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
import { StateMachineTestCase } from './mock';

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
  console.log('spinning up container');
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
  console.log('container created');
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
