import {
  MockedResponse,
  StateMachineTestCase,
  StateMachineTestDefinition,
  StepFunctionsMockConfig,
} from 'stepfunctions-testing';

import * as cdk from 'aws-cdk-lib';
import { StateMachineConstruct } from '../../lib/state-machine-construct';
import { createJestTestFromMockConfig } from '../helpers/stepfunctions';
import { Duration } from 'aws-cdk-lib';
import { extractStateMachineAsls } from '../helpers/stepfunctions/cdk-to-asl';

// TODO: dummy code
type LambdaResponse = {
  StatusCode: number;
  Payload: {
    StatusCode: number;
    body: any;
  };
};

export const stateNames = {
  LambdaStateName: 'LambdaState',
  SqsStateName: 'SqsState',
} as const;

type StateNameKeys = keyof typeof stateNames;
type StateName = typeof stateNames[StateNameKeys];

export const stateMachineName = 'LambdaSQSIntegration';

const mockedLambdaSuccessResponse = new MockedResponse(
  'MockedLambdaSuccess'
).return<LambdaResponse>({
  StatusCode: 200,
  Payload: {
    StatusCode: 200,
    body: 'Hello from Lambda!',
  },
});

const lambdaMockedResourceNotReadyResponse = new MockedResponse(
  'LambdaMockedResourceNotReady'
).throw('Lambda.ResourceNotReadyException', 'Lambda resource is not ready.');

const mockedSqsSuccessResponse = new MockedResponse('MockedSQSSuccess').return({
  MD5OfMessageBody: '3bcb6e8e-7h85-4375-b0bc-1a59812c6e51',
  MessageId: '3bcb6e8e-8b51-4375-b0bc-1a59812c6e51',
});

const mockedLambdaRetryResponse = new MockedResponse('MockedLambdaRetry')
  .throw('Lambda.ResourceNotReadyException', 'Lambda resource is not ready.')
  .throw('Lambda.TimeoutException', 'Lambda timed out.', 1)
  .return<LambdaResponse>({
    StatusCode: 200,
    Payload: {
      StatusCode: 200,
      body: 'Hello from Lambda!',
    },
  });

const stateMachineTestDefinition = new StateMachineTestDefinition(
  stateMachineName
)
  .addTestCase(
    new StateMachineTestCase<StateName>('HappyPath')
      .addMockedState(stateNames.LambdaStateName, mockedLambdaSuccessResponse)
      .addMockedState(stateNames.SqsStateName, mockedSqsSuccessResponse)
  )
  .addTestCase(
    new StateMachineTestCase<StateName>('RetryPath')
      .addMockedState(stateNames.LambdaStateName, mockedLambdaRetryResponse)
      .addMockedState(stateNames.SqsStateName, mockedSqsSuccessResponse)
  );

const config = new StepFunctionsMockConfig();
config.addTestDefinition(stateMachineTestDefinition);

const stack = new cdk.Stack();
new StateMachineConstruct(stack, 'StateMachine', {
  lambdaStateName: stateNames.LambdaStateName,
  sqsStateName: stateNames.SqsStateName,
  stateMachineName: stateMachineName,
  retryInterval: Duration.seconds(0),
});
// extract the Asl part
const asls = extractStateMachineAsls(stack);

describe(
  'Lambda SQS integration',
  createJestTestFromMockConfig(config, asls[0])
);
