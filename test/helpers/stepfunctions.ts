import {
  CreateStateMachineCommand,
  CreateStateMachineCommandInput,
  DescribeExecutionCommand,
  GetExecutionHistoryCommand,
  HistoryEvent,
  SFNClient,
  SFNClientConfig,
  StartExecutionCommand,
} from '@aws-sdk/client-sfn';
import { GenericContainer } from 'testcontainers';
import {
  StateMachineTestCase,
  StepFunctionsMockConfig,
} from 'stepfunctions-testing';
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

const typeMaps = {
  ActivityFailed: 'activityFailedEventDetails',
  ActivityScheduled: 'activityScheduledEventDetails',
  ActivityScheduleFailed: 'activityScheduleFailedEventDetails',
  ActivityStarted: 'activityStartedEventDetails',
  ActivitySucceeded: 'activitySucceededEventDetails',
  ActivityTimedOut: 'activityTimedOutEventDetails',
  ChoiceStateEntered: 'stateEnteredEventDetails',
  ChoiceStateExited: 'stateExitedEventDetails',
  ExecutionAborted: 'executionAbortedEventDetails',
  ExecutionFailed: 'executionFailedEventDetails',
  ExecutionStarted: 'executionStartedEventDetails',
  ExecutionSucceeded: 'executionSucceededEventDetails',
  ExecutionTimedOut: 'executionTimedOutEventDetails',
  FailStateEntered: '',
  LambdaFunctionFailed: 'lambdaFunctionFailedEventDetails',
  LambdaFunctionScheduled: 'lambdaFunctionScheduledEventDetails',
  LambdaFunctionScheduleFailed: 'lambdaFunctionScheduleFailedEventDetails',
  LambdaFunctionStarted: '',
  LambdaFunctionStartFailed: 'lambdaFunctionStartFailedEventDetails',
  LambdaFunctionSucceeded: 'lambdaFunctionSucceededEventDetails',
  LambdaFunctionTimedOut: 'lambdaFunctionTimedOutEventDetails',
  MapIterationAborted: 'mapIterationAbortedEventDetails',
  MapIterationFailed: 'mapIterationFailedEventDetails',
  MapIterationStarted: 'mapIterationStartedEventDetails',
  MapIterationSucceeded: 'mapIterationSucceededEventDetails',
  MapStateAborted: '',
  MapStateEntered: '', // TODO: probably maps to stateEnteredEventDetails
  MapStateExited: '', // TODO: probably maps to stateExitedEventDetails
  MapStateFailed: '',
  MapStateStarted: 'mapStateStartedEventDetails',
  MapStateSucceeded: '',
  ParallelStateAborted: '',
  ParallelStateEntered: 'stateEnteredEventDetails',
  ParallelStateExited: 'stateExitedEventDetails',
  ParallelStateFailed: '',
  ParallelStateStarted: '',
  ParallelStateSucceeded: '',
  PassStateEntered: '',
  PassStateExited: '',
  SucceedStateEntered: '',
  SucceedStateExited: '',
  TaskFailed: 'taskFailedEventDetails',
  TaskScheduled: 'taskScheduledEventDetails',
  TaskStarted: 'taskStartedEventDetails',
  TaskStartFailed: 'taskStartFailedEventDetails',
  TaskStateAborted: '',
  TaskStateEntered: 'stateEnteredEventDetails',
  TaskStateExited: 'stateExitedEventDetails',
  TaskSubmitFailed: 'taskSubmitFailedEventDetails',
  TaskSubmitted: 'taskSubmittedEventDetails',
  TaskSucceeded: 'taskSucceededEventDetails',
  TaskTimedOut: 'taskTimedOutEventDetails',
  WaitStateAborted: '',
  WaitStateEntered: '',
  WaitStateExited: '',
} as { [key: string]: string };

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
        }, 30_000);

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
              const { events: rawEvents = [] } =
                await client.getExecutionHistory(
                  startExecutionResponse.executionArn!
                );

              // TODO: think of an efficient way to do this
              const { nextEvents, normalizedEvents } = rawEvents.reduce(
                (obj, e) => {
                  const id = e.id!.toString();
                  const previousId = e.previousEventId!.toString();

                  const { nextEvents, normalizedEvents } = obj;

                  if (nextEvents[previousId]) {
                    nextEvents[previousId].push(e.id?.toString());
                  } else {
                    nextEvents[previousId] = [e.id?.toString()];
                  }

                  normalizedEvents[id] = e;

                  return obj;
                },
                { nextEvents: {}, normalizedEvents: {} } as {
                  nextEvents: { [id: string]: any[] };
                  normalizedEvents: { [id: string]: HistoryEvent };
                }
              );

              // console.log('next events', JSON.stringify(nextEvents));

              let [results, nextKey] = findNext('0');
              while (nextKey) {
                const [res, next] = findNext(nextKey);
                results = results.concat(res);
                nextKey = next;
              }

              // console.log('results', JSON.stringify(results));
              expect(results).toMatchSnapshot();

              function findNext(key: string) {
                const events = [] as any[];
                const initialEvent = normalizedEvents[key];
                if (initialEvent) {
                  const detail = (initialEvent as any)[
                    typeMaps[initialEvent.type!]
                  ];
                  events.push({ type: initialEvent.type, detail });
                }

                let next = nextEvents[key];
                while (next) {
                  if (next.length > 1) {
                    // parallel
                    const results = {} as { [key: string]: string[] };
                    let continueKey = ''; // only one continue key should happen. I think...
                    for (let k of next) {
                      let [ns, nextKey] = findNext(k);
                      if (nextKey && !continueKey) {
                        continueKey = nextKey;
                      }

                      const targetEvent = normalizedEvents[k];
                      const name =
                        targetEvent.stateEnteredEventDetails?.name ||
                        targetEvent.stateExitedEventDetails?.name;
                      results[`${targetEvent.type}${name || ''}`] = ns; // TODO: not sure if this has collisions or not
                    }
                    events.push(results);
                    if (continueKey) return [events, continueKey];

                    break;
                  }

                  const nextKey = next[0];
                  const targetEvent = normalizedEvents[nextKey];
                  if (targetEvent.type === 'ParallelStateSucceeded') {
                    // Parallel screws things because of inconsistent order.
                    // Break the sequence here
                    return [events, nextKey];
                  }

                  const detail = (targetEvent as any)[
                    typeMaps[targetEvent.type!]
                  ];
                  events.push({ type: targetEvent.type, detail });
                  next = nextEvents[nextKey];
                }
                return [events];
              }
            },
            30_000
          );
        }
      });
    }
  };
};
