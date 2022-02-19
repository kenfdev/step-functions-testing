import {
  MockedResponse,
  StateMachineTestCase,
  StateMachineTestDefinition,
  StepFunctionsMockConfig,
} from '../helpers/mock';

import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import {
  createJestTestFromMockConfig,
  extractStateMachineAsls,
} from '../helpers/stepfunctions';
import { Duration } from 'aws-cdk-lib';
import { SalesLeadsStateMachineConstruct } from '../../lib/sales-leads-state-machine-construct';

// TODO: dummy code
type LambdaResponse = {
  StatusCode: number;
  Payload: {
    statusCode: number;
    body: any;
  };
};
type DynamoResponse = {
  SdkHttpMetadata: {
    HttpStatusCode: number;
  };
};
type EventBridgeResponse = {
  Payload: {
    Entries: { EventId: string }[];
    FailedEntryCount: number;
  };
};
type ComprehendResponse = {
  Sentiment: 'POSITIVE' | 'NEGATIVE';
  SentimentScore: {
    Mixed: number;
    Negative: number;
    Neutral: number;
    Positive: number;
  };
};

export const stateNames = {
  validationStateName: 'Validation',
  checkIdentityStateName: 'Check Identity',
  checkAddressStateName: 'Check Address',
  customValidationFailedStateName: 'CustomValidationFailed',
  validationExceptionStateName: 'ValidationException',
  detectSentimentStateName: 'DetectSentiment',
  isPositiveSentimentStateName: 'Is Positive Sentiment?',
  negativeSentimentDetectedStateName: 'NegativeSentimentDetected',
  addToFollowUpStateName: 'Add to FollowUp',
  customerAddedToFollowupStateName: 'CustomerAddedToFollowup',
} as const;

type StateNameKeys = keyof typeof stateNames;
type StateName = typeof stateNames[StateNameKeys];

const stateMachineName = 'LocalTesting';

const checkIdentityLambdaMockedSuccess = new MockedResponse(
  'CheckIdentityLambdaMockedSuccess'
).return<LambdaResponse>({
  StatusCode: 200,
  Payload: {
    statusCode: 200,
    body: JSON.stringify({
      approved: true,
      message: 'identity validation passed',
    }),
  },
});

const checkAddressLambdaMockedSuccess = new MockedResponse(
  'CheckAddressLambdaMockedSuccess'
).return<LambdaResponse>({
  StatusCode: 200,
  Payload: {
    statusCode: 200,
    body: JSON.stringify({
      approved: true,
      message: 'address validation passed',
    }),
  },
});

const addToFollowUpSuccess = new MockedResponse(
  'AddToFollowUpSuccess'
).return<DynamoResponse>({
  SdkHttpMetadata: {
    HttpStatusCode: 200,
  },
});

const customerAddedToFollowupSuccess = new MockedResponse(
  'CustomerAddedToFollowupSuccess'
).return({
  StatusCode: 200,
  Payload: {
    statusCode: 200,
  },
});

const checkIdentityLambdaMockedThrowError = new MockedResponse(
  'CheckIdentityLambdaMockedThrowError'
).throw('CustomValidationError', 'Check Identity Validation Failed', 3);

const checkAddressLambdaMockedThrowExceptionSuccess = new MockedResponse(
  'CheckAddressLambdaMockedThrowExceptionSuccess'
).throw('CustomAddressValidationError', 'Address Validation Exception');

const customValidationFailedPutEventSuccess = new MockedResponse(
  'CustomValidationFailedPutEventSuccess'
).return<EventBridgeResponse>({
  Payload: {
    Entries: [
      {
        EventId: 'abc123',
      },
    ],
    FailedEntryCount: 0,
  },
});

const validationExceptionPutEventSuccess = new MockedResponse(
  'ValidationExceptionPutEventSuccess'
).return<EventBridgeResponse>({
  Payload: {
    Entries: [
      {
        EventId: 'abc123',
      },
    ],
    FailedEntryCount: 0,
  },
});

const detectSentimentPositive = new MockedResponse(
  'DetectSentimentPositive'
).return<ComprehendResponse>({
  Sentiment: 'POSITIVE',
  SentimentScore: {
    Mixed: 0.00012647535,
    Negative: 0.00008031699,
    Neutral: 0.0051454515,
    Positive: 0.9946478,
  },
});

const detectSentimentNegative = new MockedResponse(
  'DetectSentimentNegative'
).return<ComprehendResponse>({
  Sentiment: 'NEGATIVE',
  SentimentScore: {
    Mixed: 0.00012647535,
    Positive: 0.00008031699,
    Neutral: 0.0051454515,
    Negative: 0.9946478,
  },
});

const negativeSentimentDetectedSuccess = new MockedResponse(
  'NegativeSentimentDetectedSuccess'
).return<EventBridgeResponse>({
  Payload: {
    Entries: [
      {
        EventId: 'abc123',
      },
    ],
    FailedEntryCount: 0,
  },
});

const detectSentimentRetryOnErrorWithSuccess = new MockedResponse(
  'DetectSentimentRetryOnErrorWithSuccess'
)
  .throw(
    'InternalServerException',
    'Server Exception while calling DetectSentiment API in Comprehend Service',
    2
  )
  .return<ComprehendResponse>({
    Sentiment: 'POSITIVE',
    SentimentScore: {
      Mixed: 0.00012647535,
      Negative: 0.00008031699,
      Neutral: 0.0051454515,
      Positive: 0.9946478,
    },
  });

const input = {
  data: {
    firstname: 'Jane',
    lastname: 'Doe',
    identity: {
      email: 'jdoe@example.com',
      ssn: '123-45-6789',
    },
    address: {
      street: '123 Main St',
      city: 'Columbus',
      state: 'OH',
      zip: '43219',
    },
    comments:
      'I am glad to sign-up for this service. Looking forward to different options.',
  },
};

const stateMachineTestDefinition = new StateMachineTestDefinition(
  stateMachineName
)
  .addTestCase(
    new StateMachineTestCase<StateName>('HappyPathTest')
      .withInput(input)
      .addMockedState(
        stateNames.checkIdentityStateName,
        checkIdentityLambdaMockedSuccess
      )
      .addMockedState(
        stateNames.checkAddressStateName,
        checkAddressLambdaMockedSuccess
      )
      .addMockedState(
        stateNames.detectSentimentStateName,
        detectSentimentPositive
      )
      .addMockedState(stateNames.addToFollowUpStateName, addToFollowUpSuccess)
      .addMockedState(
        stateNames.customerAddedToFollowupStateName,
        customerAddedToFollowupSuccess
      )
  )
  .addTestCase(
    new StateMachineTestCase<StateName>('NegativeSentimentTest')
      .withInput(input)
      .addMockedState(
        stateNames.checkIdentityStateName,
        checkIdentityLambdaMockedSuccess
      )
      .addMockedState(
        stateNames.checkAddressStateName,
        checkAddressLambdaMockedSuccess
      )
      .addMockedState(
        stateNames.detectSentimentStateName,
        detectSentimentNegative
      )
      .addMockedState(
        stateNames.negativeSentimentDetectedStateName,
        negativeSentimentDetectedSuccess
      )
  );

const config = new StepFunctionsMockConfig();
config.addTestDefinition(stateMachineTestDefinition);

const stack = new cdk.Stack();
new SalesLeadsStateMachineConstruct(stack, 'SalesLeadsStateMachine', {
  validationStateName: 'Validation',
  checkIdentityStateName: 'Check Identity',
  checkAddressStateName: 'Check Address',
  customValidationFailedStateName: 'CustomValidationFailed',
  validationExceptionStateName: 'ValidationException',
  detectSentimentStateName: 'DetectSentiment',
  isPositiveSentimentStateName: 'Is Positive Sentiment?',
  negativeSentimentDetectedStateName: 'NegativeSentimentDetected',
  addToFollowUpStateName: 'Add to FollowUp',
  customerAddedToFollowupStateName: 'CustomerAddedToFollowup',
  stateMachineName: stateMachineName,
  retryInterval: Duration.seconds(0),
});
const cfnStackJson = Template.fromStack(stack).toJSON();
// extract the Asl part
const asls = extractStateMachineAsls(cfnStackJson);

describe(
  'SalesLeasStateMachine',
  createJestTestFromMockConfig(config, asls[0])
);
