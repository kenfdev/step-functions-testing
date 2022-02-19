import {
  CreateStateMachineCommand,
  CreateStateMachineCommandInput,
  DescribeExecutionCommand,
  GetExecutionHistoryCommand,
  SFNClient,
  SFNClientConfig,
  StartExecutionCommand,
} from '@aws-sdk/client-sfn';
import { GenericContainer } from 'testcontainers';
import { StateMachineTestCase, StepFunctionsMockConfig } from './mock';
import * as tmp from 'tmp-promise';
import { promises as fs } from 'fs';
import { StartedTestContainer } from 'testcontainers';

const AWS_PARTITION = process.env.AWS_PARTITION || 'aws';
const AWS_URL_SUFFIX = process.env.AWS_URL_SUFFIX || 'amazonaws.com';

// 99% copied from
// https://github.com/nathanagez/aws-cdk-state-machine-asl
export const extractStateMachineAsls = (cfnStackJson: any) => {
  const { Resources: resources = {} } = cfnStackJson;

  const stateMachineResources = Object.keys(resources)
    .filter((resourceKey) => {
      const resource = resources[resourceKey];
      return resource && resource.Type === 'AWS::StepFunctions::StateMachine';
    })
    .map((resource) => resources[resource]);

  return stateMachineResources.map((resource) => {
    const definitionString = resource.Properties.DefinitionString;
    const [delimiter, values] = definitionString['Fn::Join'];
    const resolvedExpressions = resolveExpressions(values);
    return resolvedExpressions.join(delimiter);
  });
};

const resolveExpressions = (expressions: any) => {
  const resolvers = [
    {
      name: 'Ref',
      resolve: ref,
    },
  ];
  return expressions.map((expression: any) => {
    if (typeof expression === 'string') return expression;

    for (const resolver of resolvers) {
      if (expression.hasOwnProperty(resolver.name)) {
        return resolver.resolve(expression[resolver.name]);
      }
    }
    return expression;
  });
};

function ref(value: any) {
  switch (value) {
    case 'AWS::Partition':
      return AWS_PARTITION;
    case 'AWS::URLSuffix':
      return AWS_URL_SUFFIX;
    default:
      console.warn(`Could not resolve expression: ${value}`);
      return value; // unresolved
  }
}

export const createStepFunctionsLocalContainer = async (
  mockConfigPath: string
) => {
  const container = await new GenericContainer('amazon/aws-stepfunctions-local')
    .withExposedPorts(8083)
    .withBindMount(
      mockConfigPath,
      '/home/StepFunctionsLocal/MockConfigFile.json',
      'ro'
    )
    .withEnv('SFN_MOCK_CONFIG', '/home/StepFunctionsLocal/MockConfigFile.json')
    // .withEnv('AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID as string)
    // .withEnv(
    //   'AWS_SECRET_ACCESS_KEY',
    //   process.env.AWS_SECRET_ACCESS_KEY as string
    // )
    // For federated credentials (for example, SSO), this environment variable is required.
    // .withEnv('AWS_SESSION_TOKEN', process.env.AWS_SESSION_TOKEN as string)
    // .withEnv('AWS_DEFAULT_REGION', process.env.AWS_REGION)
    .start();
  return container;
};

type SFNClientWrapperProps = {} & SFNClientConfig;
export class SFNClientWrapper {
  client: SFNClient;
  constructor(props: SFNClientWrapperProps) {
    this.client = new SFNClient(props);
  }

  async createStateMachine(stateMachineName: string, definition: string) {
    const dummyRoleArn =
      'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration';

    const createStateMachineCommand = new CreateStateMachineCommand({
      name: stateMachineName,
      definition,
      roleArn: dummyRoleArn,
    });
    return await this.client.send(createStateMachineCommand);
  }

  async startExecutionFromTestCase(
    stateMachineArn: string,
    testCase: StateMachineTestCase
  ) {
    const startExecutionCmd = new StartExecutionCommand({
      name: `executionWith${testCase.name}`,
      stateMachineArn: `${stateMachineArn}#${testCase.name}`,
      input: JSON.stringify(testCase.input),
    });
    return await this.client.send(startExecutionCmd);
  }

  async waitExecutionStop(executionArn: string, retry: number = 30) {
    const describeExecCmd = new DescribeExecutionCommand({
      executionArn: executionArn,
    });

    for (let i = 0; i < retry; i++) {
      const result = await this.client.send(describeExecCmd);
      if (result.stopDate) break;
      await this.wait(1);
    }
  }

  async getExecutionHistory(executionArn: string) {
    const getExecutionHistoryCmd = new GetExecutionHistoryCommand({
      executionArn,
      maxResults: 1000,
    });
    return await this.client.send(getExecutionHistoryCmd);
  }

  private async wait(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, seconds * 1000);
    });
  }
}

export const createJestTestFromMockConfig = (
  config: StepFunctionsMockConfig,
  aslDefinition: string
) => {
  return () => {
    for (const testDefinition of config.collectStateMachineTestDefinitions()) {
      describe(testDefinition.stateMachineName, () => {
        let tmpDir: tmp.DirectoryResult;
        let container: StartedTestContainer | undefined;

        let client: SFNClientWrapper;
        let stateMachineArn = '';

        beforeAll(async () => {
          const mockConfigPath = await tmp.tmpName();
          await fs.writeFile(mockConfigPath, JSON.stringify(config.toJson()));
          container = await createStepFunctionsLocalContainer(mockConfigPath);

          // create the state machine
          client = new SFNClientWrapper({
            endpoint: `http://localhost:${container?.getMappedPort(8083)}`,
          });
          const result = await client.createStateMachine(
            testDefinition.stateMachineName,
            aslDefinition
          );

          // save for later usage
          stateMachineArn = result.stateMachineArn!;
        });

        afterAll(async () => {
          await container?.stop();
          await tmpDir.cleanup();
        });

        for (const testCase of testDefinition.collectTestCase()) {
          test(
            testCase.name,
            async () => {
              // Arrange
              // Act
              const startExecutionResponse =
                await client.startExecutionFromTestCase(
                  stateMachineArn,
                  testCase
                );
              await client.waitExecutionStop(
                startExecutionResponse.executionArn!
              );

              // Assert
              const { events = [] } = await client.getExecutionHistory(
                startExecutionResponse.executionArn!
              );
              // console.warn(JSON.stringify(events));

              const resultsMap = new Map<string, any[]>();
              for (const e of events) {
                if (e.stateEnteredEventDetails?.name) {
                  const val = resultsMap.get(e.stateEnteredEventDetails.name);
                  if (val) {
                    resultsMap.set(e.stateEnteredEventDetails.name, [
                      ...val,
                      { input: e.stateEnteredEventDetails.input },
                    ]);
                  } else {
                    resultsMap.set(e.stateEnteredEventDetails.name, [
                      { input: e.stateEnteredEventDetails.input },
                    ]);
                  }
                  // console.warn(JSON.stringify(e));
                  // expect(e).toMatchSnapshot({
                  //   timestamp: expect.anything(),
                  // });
                }
                if (e.stateExitedEventDetails?.name) {
                  const val = resultsMap.get(e.stateExitedEventDetails.name);
                  if (val) {
                    resultsMap.set(e.stateExitedEventDetails.name, [
                      ...val,
                      { output: e.stateExitedEventDetails.output },
                    ]);
                  } else {
                    resultsMap.set(e.stateExitedEventDetails.name, [
                      { output: e.stateExitedEventDetails.output },
                    ]);
                  }
                }
                // expect(e).toMatchSnapshot({
                //   timestamp: expect.anything(),
                // });
              }
              expect(resultsMap).toMatchSnapshot();
            },
            30_000
          );
        }
      });
    }
  };
};
