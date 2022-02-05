import {
  MockedResponse,
  StateMachineTestCase,
  StateMachineTestDefinition,
  StepFunctionsMockConfig,
} from './helpers/mock';

// TODO: dummy code
type LambdaResponse = {
  StatusCode: number;
  Payload: {
    StatusCode: number;
    body: any;
  };
};

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
  'LambdaSQSIntegration'
)
  .addTestCase(
    new StateMachineTestCase('HappyPath')
      .addMockedState('LambdaState', mockedLambdaSuccessResponse)
      .addMockedState('SQSState', mockedSqsSuccessResponse)
  )
  .addTestCase(
    new StateMachineTestCase('RetryPath')
      .addMockedState('LambdaState', mockedLambdaRetryResponse)
      .addMockedState('SQSState', mockedSqsSuccessResponse)
  );

const config = new StepFunctionsMockConfig();
config.addTestDefinition(stateMachineTestDefinition);

console.log(JSON.stringify(config.toJson()));
