import {
  MockedResponse,
  StateMachineTestCase,
  StateMachineTestDefinition,
  StepFunctionsMockConfig,
} from '../helpers/mock';

import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StateMachineConstruct } from '../../lib/state-machine-construct';
import { extractStateMachineAsls } from '../helpers/stepfunctions';
import { Duration } from 'aws-cdk-lib';

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

export const createConfig = () => {
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

  const mockedSqsSuccessResponse = new MockedResponse(
    'MockedSQSSuccess'
  ).return({
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
        .withInput({ hoge: 'moge' })
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
  const cfnStackJson = Template.fromStack(stack).toJSON();
  // extract the Asl part
  const asls = extractStateMachineAsls(cfnStackJson);

  return {
    config,
    aslDefinition: asls[0],
    testDefinition: stateMachineTestDefinition,
  };
};
