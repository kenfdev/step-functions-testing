export const testCases = [
  {
    input: [
      {
        executionStartedEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          roleArn:
            'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
        },
        id: 1,
        previousEventId: 0,
        timestamp: '2022-02-20T02:39:59.901Z',
        type: 'ExecutionStarted',
      },
      {
        id: 2,
        previousEventId: 0,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Validation',
        },
        timestamp: '2022-02-20T02:39:59.901Z',
        type: 'ParallelStateEntered',
      },
      {
        id: 3,
        previousEventId: 2,
        timestamp: '2022-02-20T02:39:59.901Z',
        type: 'ParallelStateStarted',
      },
      {
        id: 4,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Identity',
        },
        timestamp: '2022-02-20T02:39:59.904Z',
        type: 'TaskStateEntered',
      },
      {
        id: 5,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Address',
        },
        timestamp: '2022-02-20T02:39:59.906Z',
        type: 'TaskStateEntered',
      },
      {
        id: 6,
        previousEventId: 4,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:59.910Z',
        type: 'TaskScheduled',
      },
      {
        id: 7,
        previousEventId: 5,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:59.910Z',
        type: 'TaskScheduled',
      },
      {
        id: 8,
        previousEventId: 7,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:59.911Z',
        type: 'TaskStarted',
      },
      {
        id: 9,
        previousEventId: 6,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:59.914Z',
        type: 'TaskStarted',
      },
      {
        id: 10,
        previousEventId: 8,
        taskSucceededEventDetails: {
          output:
            '{"address":{"approved":true,"message":"address validation passed"}}',
          outputDetails: { truncated: false },
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:59.917Z',
        type: 'TaskSucceeded',
      },
      {
        id: 11,
        previousEventId: 10,
        stateExitedEventDetails: {
          name: 'Check Address',
          output:
            '{"address":{"approved":true,"message":"address validation passed"}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:59.917Z',
        type: 'TaskStateExited',
      },
      {
        id: 12,
        previousEventId: 9,
        taskSucceededEventDetails: {
          output:
            '{"identity":{"approved":true,"message":"identity validation passed"}}',
          outputDetails: { truncated: false },
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:59.917Z',
        type: 'TaskSucceeded',
      },
      {
        id: 13,
        previousEventId: 12,
        stateExitedEventDetails: {
          name: 'Check Identity',
          output:
            '{"identity":{"approved":true,"message":"identity validation passed"}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:59.917Z',
        type: 'TaskStateExited',
      },
      {
        id: 14,
        previousEventId: 11,
        timestamp: '2022-02-20T02:39:59.933Z',
        type: 'ParallelStateSucceeded',
      },
      {
        id: 15,
        previousEventId: 14,
        stateExitedEventDetails: {
          name: 'Validation',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:59.935Z',
        type: 'ParallelStateExited',
      },
      {
        id: 16,
        previousEventId: 15,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
          inputDetails: { truncated: false },
          name: 'DetectSentiment',
        },
        timestamp: '2022-02-20T02:39:59.937Z',
        type: 'TaskStateEntered',
      },
      {
        id: 17,
        previousEventId: 16,
        taskScheduledEventDetails: {
          parameters:
            '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
          region: 'us-east-1',
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:39:59.939Z',
        type: 'TaskScheduled',
      },
      {
        id: 18,
        previousEventId: 17,
        taskStartedEventDetails: {
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:39:59.940Z',
        type: 'TaskStarted',
      },
      {
        id: 19,
        previousEventId: 18,
        taskFailedEventDetails: {
          cause:
            'Server Exception while calling DetectSentiment API in Comprehend Service',
          error: 'InternalServerException',
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:39:59.943Z',
        type: 'TaskFailed',
      },
      {
        id: 20,
        previousEventId: 19,
        taskScheduledEventDetails: {
          parameters:
            '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
          region: 'us-east-1',
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:40:00.947Z',
        type: 'TaskScheduled',
      },
      {
        id: 21,
        previousEventId: 20,
        taskStartedEventDetails: {
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:40:00.950Z',
        type: 'TaskStarted',
      },
      {
        id: 22,
        previousEventId: 21,
        taskFailedEventDetails: {
          cause:
            'Server Exception while calling DetectSentiment API in Comprehend Service',
          error: 'InternalServerException',
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:40:00.953Z',
        type: 'TaskFailed',
      },
      {
        id: 23,
        previousEventId: 22,
        taskScheduledEventDetails: {
          parameters:
            '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
          region: 'us-east-1',
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:40:01.955Z',
        type: 'TaskScheduled',
      },
      {
        id: 24,
        previousEventId: 23,
        taskStartedEventDetails: {
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:40:01.955Z',
        type: 'TaskStarted',
      },
      {
        id: 25,
        previousEventId: 24,
        taskFailedEventDetails: {
          cause:
            'Server Exception while calling DetectSentiment API in Comprehend Service',
          error: 'InternalServerException',
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:40:01.956Z',
        type: 'TaskFailed',
      },
      {
        id: 26,
        previousEventId: 25,
        taskScheduledEventDetails: {
          parameters:
            '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
          region: 'us-east-1',
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:40:02.959Z',
        type: 'TaskScheduled',
      },
      {
        id: 27,
        previousEventId: 26,
        taskStartedEventDetails: {
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:40:02.959Z',
        type: 'TaskStarted',
      },
      {
        id: 28,
        previousEventId: 27,
        taskSucceededEventDetails: {
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          outputDetails: { truncated: false },
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:40:02.961Z',
        type: 'TaskSucceeded',
      },
      {
        id: 29,
        previousEventId: 28,
        stateExitedEventDetails: {
          name: 'DetectSentiment',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:40:02.961Z',
        type: 'TaskStateExited',
      },
      {
        id: 30,
        previousEventId: 29,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          inputDetails: { truncated: false },
          name: 'Is Positive Sentiment?',
        },
        timestamp: '2022-02-20T02:40:02.962Z',
        type: 'ChoiceStateEntered',
      },
      {
        id: 31,
        previousEventId: 30,
        stateExitedEventDetails: {
          name: 'Is Positive Sentiment?',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:40:02.965Z',
        type: 'ChoiceStateExited',
      },
      {
        id: 32,
        previousEventId: 31,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          inputDetails: { truncated: false },
          name: 'Add to FollowUp',
        },
        timestamp: '2022-02-20T02:40:02.966Z',
        type: 'TaskStateEntered',
      },
      {
        id: 33,
        previousEventId: 32,
        taskScheduledEventDetails: {
          parameters:
            '{"Item":{"PK":{"S":"jdoe@example.com"}},"TableName":"FollowUpTable"}',
          region: 'us-east-1',
          resource: 'putItem',
          resourceType: 'dynamodb',
        },
        timestamp: '2022-02-20T02:40:02.969Z',
        type: 'TaskScheduled',
      },
      {
        id: 34,
        previousEventId: 33,
        taskStartedEventDetails: {
          resource: 'putItem',
          resourceType: 'dynamodb',
        },
        timestamp: '2022-02-20T02:40:02.970Z',
        type: 'TaskStarted',
      },
      {
        id: 35,
        previousEventId: 34,
        taskSucceededEventDetails: {
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
          outputDetails: { truncated: false },
          resource: 'putItem',
          resourceType: 'dynamodb',
        },
        timestamp: '2022-02-20T02:40:02.973Z',
        type: 'TaskSucceeded',
      },
      {
        id: 36,
        previousEventId: 35,
        stateExitedEventDetails: {
          name: 'Add to FollowUp',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:40:02.974Z',
        type: 'TaskStateExited',
      },
      {
        id: 37,
        previousEventId: 36,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
          inputDetails: { truncated: false },
          name: 'CustomerAddedToFollowup',
        },
        timestamp: '2022-02-20T02:40:02.975Z',
        type: 'TaskStateEntered',
      },
      {
        id: 38,
        previousEventId: 37,
        taskScheduledEventDetails: {
          parameters:
            '{"Entries":[{"Detail":{"Message":"Customer Added for follow up","EmailAddress":"jdoe@example.com"},"DetailType":"CustomerAdded","Source":"LocalTestingSource"}]}',
          region: 'us-east-1',
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:40:02.979Z',
        type: 'TaskScheduled',
      },
      {
        id: 39,
        previousEventId: 38,
        taskStartedEventDetails: {
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:40:02.984Z',
        type: 'TaskStarted',
      },
      {
        id: 40,
        previousEventId: 39,
        taskSucceededEventDetails: {
          output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
          outputDetails: { truncated: false },
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:40:02.987Z',
        type: 'TaskSucceeded',
      },
      {
        id: 41,
        previousEventId: 40,
        stateExitedEventDetails: {
          name: 'CustomerAddedToFollowup',
          output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:40:02.987Z',
        type: 'TaskStateExited',
      },
      {
        executionSucceededEventDetails: {
          output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
          outputDetails: { truncated: false },
        },
        id: 42,
        previousEventId: 41,
        timestamp: '2022-02-20T02:40:02.988Z',
        type: 'ExecutionSucceeded',
      },
    ],
    output: [
      {
        ExecutionStarted: [
          {
            type: 'ExecutionStarted',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              roleArn:
                'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
            },
          },
        ],
        'ParallelStateEntered Validation': [
          {
            type: 'ParallelStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              name: 'Validation',
            },
          },
          { type: 'ParallelStateStarted' },
          {
            'TaskStateEntered Check Identity': [
              {
                type: 'TaskStateEntered',
                detail: {
                  input:
                    '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                  inputDetails: { truncated: false },
                  name: 'Check Identity',
                },
              },
              {
                type: 'TaskScheduled',
                detail: {
                  parameters:
                    '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
                  region: 'us-east-1',
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStarted',
                detail: { resource: 'invoke', resourceType: 'lambda' },
              },
              {
                type: 'TaskSucceeded',
                detail: {
                  output:
                    '{"identity":{"approved":true,"message":"identity validation passed"}}',
                  outputDetails: { truncated: false },
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'Check Identity',
                  output:
                    '{"identity":{"approved":true,"message":"identity validation passed"}}',
                  outputDetails: { truncated: false },
                },
              },
            ],
            'TaskStateEntered Check Address': [
              {
                type: 'TaskStateEntered',
                detail: {
                  input:
                    '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                  inputDetails: { truncated: false },
                  name: 'Check Address',
                },
              },
              {
                type: 'TaskScheduled',
                detail: {
                  parameters:
                    '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
                  region: 'us-east-1',
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStarted',
                detail: { resource: 'invoke', resourceType: 'lambda' },
              },
              {
                type: 'TaskSucceeded',
                detail: {
                  output:
                    '{"address":{"approved":true,"message":"address validation passed"}}',
                  outputDetails: { truncated: false },
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'Check Address',
                  output:
                    '{"address":{"approved":true,"message":"address validation passed"}}',
                  outputDetails: { truncated: false },
                },
              },
            ],
          },
          { type: 'ParallelStateSucceeded' },
          {
            type: 'ParallelStateExited',
            detail: {
              name: 'Validation',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'TaskStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
              inputDetails: { truncated: false },
              name: 'DetectSentiment',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
              region: 'us-east-1',
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskStarted',
            detail: {
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskFailed',
            detail: {
              cause:
                'Server Exception while calling DetectSentiment API in Comprehend Service',
              error: 'InternalServerException',
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
              region: 'us-east-1',
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskStarted',
            detail: {
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskFailed',
            detail: {
              cause:
                'Server Exception while calling DetectSentiment API in Comprehend Service',
              error: 'InternalServerException',
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
              region: 'us-east-1',
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskStarted',
            detail: {
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskFailed',
            detail: {
              cause:
                'Server Exception while calling DetectSentiment API in Comprehend Service',
              error: 'InternalServerException',
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
              region: 'us-east-1',
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskStarted',
            detail: {
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskSucceeded',
            detail: {
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              outputDetails: { truncated: false },
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskStateExited',
            detail: {
              name: 'DetectSentiment',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'ChoiceStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              inputDetails: { truncated: false },
              name: 'Is Positive Sentiment?',
            },
          },
          {
            type: 'ChoiceStateExited',
            detail: {
              name: 'Is Positive Sentiment?',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'TaskStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              inputDetails: { truncated: false },
              name: 'Add to FollowUp',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"Item":{"PK":{"S":"jdoe@example.com"}},"TableName":"FollowUpTable"}',
              region: 'us-east-1',
              resource: 'putItem',
              resourceType: 'dynamodb',
            },
          },
          {
            type: 'TaskStarted',
            detail: { resource: 'putItem', resourceType: 'dynamodb' },
          },
          {
            type: 'TaskSucceeded',
            detail: {
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
              outputDetails: { truncated: false },
              resource: 'putItem',
              resourceType: 'dynamodb',
            },
          },
          {
            type: 'TaskStateExited',
            detail: {
              name: 'Add to FollowUp',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'TaskStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
              inputDetails: { truncated: false },
              name: 'CustomerAddedToFollowup',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"Entries":[{"Detail":{"Message":"Customer Added for follow up","EmailAddress":"jdoe@example.com"},"DetailType":"CustomerAdded","Source":"LocalTestingSource"}]}',
              region: 'us-east-1',
              resource: 'putEvents',
              resourceType: 'events',
            },
          },
          {
            type: 'TaskStarted',
            detail: { resource: 'putEvents', resourceType: 'events' },
          },
          {
            type: 'TaskSucceeded',
            detail: {
              output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
              outputDetails: { truncated: false },
              resource: 'putEvents',
              resourceType: 'events',
            },
          },
          {
            type: 'TaskStateExited',
            detail: {
              name: 'CustomerAddedToFollowup',
              output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'ExecutionSucceeded',
            detail: {
              output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
              outputDetails: { truncated: false },
            },
          },
        ],
      },
    ],
  },
  {
    input: [
      {
        executionStartedEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          roleArn:
            'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
        },
        id: 1,
        previousEventId: 0,
        timestamp: '2022-02-20T02:39:58.798Z',
        type: 'ExecutionStarted',
      },
      {
        id: 2,
        previousEventId: 0,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Validation',
        },
        timestamp: '2022-02-20T02:39:58.805Z',
        type: 'ParallelStateEntered',
      },
      {
        id: 3,
        previousEventId: 2,
        timestamp: '2022-02-20T02:39:58.809Z',
        type: 'ParallelStateStarted',
      },
      {
        id: 4,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Identity',
        },
        timestamp: '2022-02-20T02:39:58.810Z',
        type: 'TaskStateEntered',
      },
      {
        id: 5,
        previousEventId: 4,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:58.812Z',
        type: 'TaskScheduled',
      },
      {
        id: 6,
        previousEventId: 5,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:58.813Z',
        type: 'TaskStarted',
      },
      {
        id: 7,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Address',
        },
        timestamp: '2022-02-20T02:39:58.816Z',
        type: 'TaskStateEntered',
      },
      {
        id: 8,
        previousEventId: 7,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:58.818Z',
        type: 'TaskScheduled',
      },
      {
        id: 9,
        previousEventId: 8,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:58.819Z',
        type: 'TaskStarted',
      },
      {
        id: 10,
        previousEventId: 9,
        taskFailedEventDetails: {
          cause: 'Address Validation Exception',
          error: 'CustomAddressValidationError',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:58.821Z',
        type: 'TaskFailed',
      },
      {
        id: 11,
        previousEventId: 10,
        timestamp: '2022-02-20T02:39:58.823Z',
        type: 'ParallelStateFailed',
      },
      {
        id: 12,
        previousEventId: 6,
        taskSucceededEventDetails: {
          output:
            '{"identity":{"approved":true,"message":"identity validation passed"}}',
          outputDetails: { truncated: false },
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:58.825Z',
        type: 'TaskSucceeded',
      },
      {
        id: 13,
        previousEventId: 2,
        stateExitedEventDetails: {
          name: 'Validation',
          output:
            '{"Error":"CustomAddressValidationError","Cause":"Address Validation Exception"}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:58.828Z',
        type: 'TaskStateExited',
      },
      {
        id: 14,
        previousEventId: 12,
        stateExitedEventDetails: {
          name: 'Check Identity',
          output:
            '{"identity":{"approved":true,"message":"identity validation passed"}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:58.828Z',
        type: 'TaskStateExited',
      },
      {
        id: 15,
        previousEventId: 13,
        stateEnteredEventDetails: {
          input:
            '{"Error":"CustomAddressValidationError","Cause":"Address Validation Exception"}',
          inputDetails: { truncated: false },
          name: 'ValidationException',
        },
        timestamp: '2022-02-20T02:39:58.829Z',
        type: 'TaskStateEntered',
      },
      {
        id: 16,
        previousEventId: 15,
        taskScheduledEventDetails: {
          parameters:
            '{"Entries":[{"Detail":{"Message":"Validation Exception"},"DetailType":"ValidationException","Source":"LocalTestingSource"}]}',
          region: 'us-east-1',
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:58.830Z',
        type: 'TaskScheduled',
      },
      {
        id: 17,
        previousEventId: 16,
        taskStartedEventDetails: {
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:58.830Z',
        type: 'TaskStarted',
      },
      {
        id: 18,
        previousEventId: 17,
        taskSucceededEventDetails: {
          output:
            '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
          outputDetails: { truncated: false },
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:58.831Z',
        type: 'TaskSucceeded',
      },
      {
        id: 19,
        previousEventId: 18,
        stateExitedEventDetails: {
          name: 'ValidationException',
          output:
            '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:58.831Z',
        type: 'TaskStateExited',
      },
      {
        executionSucceededEventDetails: {
          output:
            '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
          outputDetails: { truncated: false },
        },
        id: 20,
        previousEventId: 19,
        timestamp: '2022-02-20T02:39:58.831Z',
        type: 'ExecutionSucceeded',
      },
    ],
    output: [
      {
        ExecutionStarted: [
          {
            type: 'ExecutionStarted',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              roleArn:
                'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
            },
          },
        ],
        'ParallelStateEntered Validation': [
          {
            type: 'ParallelStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              name: 'Validation',
            },
          },
          {
            ParallelStateStarted: [
              { type: 'ParallelStateStarted' },
              {
                'TaskStateEntered Check Identity': [
                  {
                    type: 'TaskStateEntered',
                    detail: {
                      input:
                        '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                      inputDetails: { truncated: false },
                      name: 'Check Identity',
                    },
                  },
                  {
                    type: 'TaskScheduled',
                    detail: {
                      parameters:
                        '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
                      region: 'us-east-1',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskStarted',
                    detail: { resource: 'invoke', resourceType: 'lambda' },
                  },
                  {
                    type: 'TaskSucceeded',
                    detail: {
                      output:
                        '{"identity":{"approved":true,"message":"identity validation passed"}}',
                      outputDetails: { truncated: false },
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskStateExited',
                    detail: {
                      name: 'Check Identity',
                      output:
                        '{"identity":{"approved":true,"message":"identity validation passed"}}',
                      outputDetails: { truncated: false },
                    },
                  },
                ],
                'TaskStateEntered Check Address': [
                  {
                    type: 'TaskStateEntered',
                    detail: {
                      input:
                        '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                      inputDetails: { truncated: false },
                      name: 'Check Address',
                    },
                  },
                  {
                    type: 'TaskScheduled',
                    detail: {
                      parameters:
                        '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
                      region: 'us-east-1',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskStarted',
                    detail: { resource: 'invoke', resourceType: 'lambda' },
                  },
                  {
                    type: 'TaskFailed',
                    detail: {
                      cause: 'Address Validation Exception',
                      error: 'CustomAddressValidationError',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  { type: 'ParallelStateFailed' },
                ],
              },
            ],
            'TaskStateExited Validation': [
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'Validation',
                  output:
                    '{"Error":"CustomAddressValidationError","Cause":"Address Validation Exception"}',
                  outputDetails: { truncated: false },
                },
              },
              {
                type: 'TaskStateEntered',
                detail: {
                  input:
                    '{"Error":"CustomAddressValidationError","Cause":"Address Validation Exception"}',
                  inputDetails: { truncated: false },
                  name: 'ValidationException',
                },
              },
              {
                type: 'TaskScheduled',
                detail: {
                  parameters:
                    '{"Entries":[{"Detail":{"Message":"Validation Exception"},"DetailType":"ValidationException","Source":"LocalTestingSource"}]}',
                  region: 'us-east-1',
                  resource: 'putEvents',
                  resourceType: 'events',
                },
              },
              {
                type: 'TaskStarted',
                detail: { resource: 'putEvents', resourceType: 'events' },
              },
              {
                type: 'TaskSucceeded',
                detail: {
                  output:
                    '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
                  outputDetails: { truncated: false },
                  resource: 'putEvents',
                  resourceType: 'events',
                },
              },
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'ValidationException',
                  output:
                    '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
                  outputDetails: { truncated: false },
                },
              },
              {
                type: 'ExecutionSucceeded',
                detail: {
                  output:
                    '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
                  outputDetails: { truncated: false },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    output: [
      {
        ExecutionStarted: [
          {
            type: 'ExecutionStarted',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              roleArn:
                'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
            },
          },
        ],
        'ParallelStateEntered Validation': [
          {
            type: 'ParallelStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              name: 'Validation',
            },
          },
          {
            ParallelStateStarted: [
              { type: 'ParallelStateStarted' },
              {
                'TaskStateEntered Check Identity': [
                  {
                    type: 'TaskStateEntered',
                    detail: {
                      input:
                        '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                      inputDetails: { truncated: false },
                      name: 'Check Identity',
                    },
                  },
                  {
                    type: 'TaskScheduled',
                    detail: {
                      parameters:
                        '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
                      region: 'us-east-1',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskStarted',
                    detail: { resource: 'invoke', resourceType: 'lambda' },
                  },
                  {
                    type: 'TaskFailed',
                    detail: {
                      cause: 'Check Identity Validation Failed',
                      error: 'CustomValidationError',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskScheduled',
                    detail: {
                      parameters:
                        '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
                      region: 'us-east-1',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskStarted',
                    detail: { resource: 'invoke', resourceType: 'lambda' },
                  },
                  {
                    type: 'TaskFailed',
                    detail: {
                      cause: 'Check Identity Validation Failed',
                      error: 'CustomValidationError',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskScheduled',
                    detail: {
                      parameters:
                        '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
                      region: 'us-east-1',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskStarted',
                    detail: { resource: 'invoke', resourceType: 'lambda' },
                  },
                  {
                    type: 'TaskFailed',
                    detail: {
                      cause: 'Check Identity Validation Failed',
                      error: 'CustomValidationError',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskScheduled',
                    detail: {
                      parameters:
                        '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
                      region: 'us-east-1',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskStarted',
                    detail: { resource: 'invoke', resourceType: 'lambda' },
                  },
                  {
                    type: 'TaskFailed',
                    detail: {
                      cause: 'Check Identity Validation Failed',
                      error: 'CustomValidationError',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  { type: 'ParallelStateFailed' },
                ],
                'TaskStateEntered Check Address': [
                  {
                    type: 'TaskStateEntered',
                    detail: {
                      input:
                        '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                      inputDetails: { truncated: false },
                      name: 'Check Address',
                    },
                  },
                  {
                    type: 'TaskScheduled',
                    detail: {
                      parameters:
                        '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
                      region: 'us-east-1',
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskStarted',
                    detail: { resource: 'invoke', resourceType: 'lambda' },
                  },
                  {
                    type: 'TaskSucceeded',
                    detail: {
                      output:
                        '{"address":{"approved":true,"message":"address validation passed"}}',
                      outputDetails: { truncated: false },
                      resource: 'invoke',
                      resourceType: 'lambda',
                    },
                  },
                  {
                    type: 'TaskStateExited',
                    detail: {
                      name: 'Check Address',
                      output:
                        '{"address":{"approved":true,"message":"address validation passed"}}',
                      outputDetails: { truncated: false },
                    },
                  },
                ],
              },
            ],
            'TaskStateExited Validation': [
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'Validation',
                  output:
                    '{"Error":"CustomValidationError","Cause":"Check Identity Validation Failed"}',
                  outputDetails: { truncated: false },
                },
              },
              {
                type: 'TaskStateEntered',
                detail: {
                  input:
                    '{"Error":"CustomValidationError","Cause":"Check Identity Validation Failed"}',
                  inputDetails: { truncated: false },
                  name: 'CustomValidationFailed',
                },
              },
              {
                type: 'TaskScheduled',
                detail: {
                  parameters:
                    '{"Entries":[{"Detail":{"Message":"Validation Failed"},"DetailType":"ValidationFailed","Source":"LocalTestingSource"}]}',
                  region: 'us-east-1',
                  resource: 'putEvents',
                  resourceType: 'events',
                },
              },
              {
                type: 'TaskStarted',
                detail: { resource: 'putEvents', resourceType: 'events' },
              },
              {
                type: 'TaskSucceeded',
                detail: {
                  output:
                    '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
                  outputDetails: { truncated: false },
                  resource: 'putEvents',
                  resourceType: 'events',
                },
              },
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'CustomValidationFailed',
                  output:
                    '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
                  outputDetails: { truncated: false },
                },
              },
              {
                type: 'ExecutionSucceeded',
                detail: {
                  output:
                    '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
                  outputDetails: { truncated: false },
                },
              },
            ],
          },
        ],
      },
    ],
    input: [
      {
        executionStartedEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          roleArn:
            'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
        },
        id: 1,
        previousEventId: 0,
        timestamp: '2022-02-20T02:39:57.661Z',
        type: 'ExecutionStarted',
      },
      {
        id: 2,
        previousEventId: 0,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Validation',
        },
        timestamp: '2022-02-20T02:39:57.662Z',
        type: 'ParallelStateEntered',
      },
      {
        id: 3,
        previousEventId: 2,
        timestamp: '2022-02-20T02:39:57.663Z',
        type: 'ParallelStateStarted',
      },
      {
        id: 4,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Identity',
        },
        timestamp: '2022-02-20T02:39:57.664Z',
        type: 'TaskStateEntered',
      },
      {
        id: 5,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Address',
        },
        timestamp: '2022-02-20T02:39:57.665Z',
        type: 'TaskStateEntered',
      },
      {
        id: 6,
        previousEventId: 4,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.667Z',
        type: 'TaskScheduled',
      },
      {
        id: 7,
        previousEventId: 6,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:57.667Z',
        type: 'TaskStarted',
      },
      {
        id: 8,
        previousEventId: 5,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.668Z',
        type: 'TaskScheduled',
      },
      {
        id: 9,
        previousEventId: 8,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:57.669Z',
        type: 'TaskStarted',
      },
      {
        id: 10,
        previousEventId: 9,
        taskSucceededEventDetails: {
          output:
            '{"address":{"approved":true,"message":"address validation passed"}}',
          outputDetails: { truncated: false },
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.674Z',
        type: 'TaskSucceeded',
      },
      {
        id: 11,
        previousEventId: 10,
        stateExitedEventDetails: {
          name: 'Check Address',
          output:
            '{"address":{"approved":true,"message":"address validation passed"}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:57.676Z',
        type: 'TaskStateExited',
      },
      {
        id: 12,
        previousEventId: 7,
        taskFailedEventDetails: {
          cause: 'Check Identity Validation Failed',
          error: 'CustomValidationError',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.685Z',
        type: 'TaskFailed',
      },
      {
        id: 13,
        previousEventId: 12,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.705Z',
        type: 'TaskScheduled',
      },
      {
        id: 14,
        previousEventId: 13,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:57.707Z',
        type: 'TaskStarted',
      },
      {
        id: 15,
        previousEventId: 14,
        taskFailedEventDetails: {
          cause: 'Check Identity Validation Failed',
          error: 'CustomValidationError',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.708Z',
        type: 'TaskFailed',
      },
      {
        id: 16,
        previousEventId: 15,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.711Z',
        type: 'TaskScheduled',
      },
      {
        id: 17,
        previousEventId: 16,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:57.712Z',
        type: 'TaskStarted',
      },
      {
        id: 18,
        previousEventId: 17,
        taskFailedEventDetails: {
          cause: 'Check Identity Validation Failed',
          error: 'CustomValidationError',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.714Z',
        type: 'TaskFailed',
      },
      {
        id: 19,
        previousEventId: 18,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.721Z',
        type: 'TaskScheduled',
      },
      {
        id: 20,
        previousEventId: 19,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:57.723Z',
        type: 'TaskStarted',
      },
      {
        id: 21,
        previousEventId: 20,
        taskFailedEventDetails: {
          cause: 'Check Identity Validation Failed',
          error: 'CustomValidationError',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:57.726Z',
        type: 'TaskFailed',
      },
      {
        id: 22,
        previousEventId: 21,
        timestamp: '2022-02-20T02:39:57.740Z',
        type: 'ParallelStateFailed',
      },
      {
        id: 23,
        previousEventId: 2,
        stateExitedEventDetails: {
          name: 'Validation',
          output:
            '{"Error":"CustomValidationError","Cause":"Check Identity Validation Failed"}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:57.746Z',
        type: 'TaskStateExited',
      },
      {
        id: 24,
        previousEventId: 23,
        stateEnteredEventDetails: {
          input:
            '{"Error":"CustomValidationError","Cause":"Check Identity Validation Failed"}',
          inputDetails: { truncated: false },
          name: 'CustomValidationFailed',
        },
        timestamp: '2022-02-20T02:39:57.748Z',
        type: 'TaskStateEntered',
      },
      {
        id: 25,
        previousEventId: 24,
        taskScheduledEventDetails: {
          parameters:
            '{"Entries":[{"Detail":{"Message":"Validation Failed"},"DetailType":"ValidationFailed","Source":"LocalTestingSource"}]}',
          region: 'us-east-1',
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:57.751Z',
        type: 'TaskScheduled',
      },
      {
        id: 26,
        previousEventId: 25,
        taskStartedEventDetails: {
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:57.752Z',
        type: 'TaskStarted',
      },
      {
        id: 27,
        previousEventId: 26,
        taskSucceededEventDetails: {
          output:
            '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
          outputDetails: { truncated: false },
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:57.754Z',
        type: 'TaskSucceeded',
      },
      {
        id: 28,
        previousEventId: 27,
        stateExitedEventDetails: {
          name: 'CustomValidationFailed',
          output:
            '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:57.757Z',
        type: 'TaskStateExited',
      },
      {
        executionSucceededEventDetails: {
          output:
            '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
          outputDetails: { truncated: false },
        },
        id: 29,
        previousEventId: 28,
        timestamp: '2022-02-20T02:39:57.758Z',
        type: 'ExecutionSucceeded',
      },
    ],
  },
  {
    output: [
      {
        ExecutionStarted: [
          {
            type: 'ExecutionStarted',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              roleArn:
                'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
            },
          },
        ],
        'ParallelStateEntered Validation': [
          {
            type: 'ParallelStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              name: 'Validation',
            },
          },
          { type: 'ParallelStateStarted' },
          {
            'TaskStateEntered Check Identity': [
              {
                type: 'TaskStateEntered',
                detail: {
                  input:
                    '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                  inputDetails: { truncated: false },
                  name: 'Check Identity',
                },
              },
              {
                type: 'TaskScheduled',
                detail: {
                  parameters:
                    '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
                  region: 'us-east-1',
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStarted',
                detail: { resource: 'invoke', resourceType: 'lambda' },
              },
              {
                type: 'TaskSucceeded',
                detail: {
                  output:
                    '{"identity":{"approved":true,"message":"identity validation passed"}}',
                  outputDetails: { truncated: false },
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'Check Identity',
                  output:
                    '{"identity":{"approved":true,"message":"identity validation passed"}}',
                  outputDetails: { truncated: false },
                },
              },
            ],
            'TaskStateEntered Check Address': [
              {
                type: 'TaskStateEntered',
                detail: {
                  input:
                    '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                  inputDetails: { truncated: false },
                  name: 'Check Address',
                },
              },
              {
                type: 'TaskScheduled',
                detail: {
                  parameters:
                    '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
                  region: 'us-east-1',
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStarted',
                detail: { resource: 'invoke', resourceType: 'lambda' },
              },
              {
                type: 'TaskSucceeded',
                detail: {
                  output:
                    '{"address":{"approved":true,"message":"address validation passed"}}',
                  outputDetails: { truncated: false },
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'Check Address',
                  output:
                    '{"address":{"approved":true,"message":"address validation passed"}}',
                  outputDetails: { truncated: false },
                },
              },
            ],
          },
          { type: 'ParallelStateSucceeded' },
          {
            type: 'ParallelStateExited',
            detail: {
              name: 'Validation',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'TaskStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
              inputDetails: { truncated: false },
              name: 'DetectSentiment',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
              region: 'us-east-1',
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskStarted',
            detail: {
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskSucceeded',
            detail: {
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
              outputDetails: { truncated: false },
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskStateExited',
            detail: {
              name: 'DetectSentiment',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'ChoiceStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
              inputDetails: { truncated: false },
              name: 'Is Positive Sentiment?',
            },
          },
          {
            type: 'ChoiceStateExited',
            detail: {
              name: 'Is Positive Sentiment?',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'TaskStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
              inputDetails: { truncated: false },
              name: 'NegativeSentimentDetected',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"Entries":[{"Detail":{"Message":"Negative Sentiment Detected","Data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}},"DetailType":"NegativeSentiment","Source":"LocalTestingSource"}]}',
              region: 'us-east-1',
              resource: 'putEvents',
              resourceType: 'events',
            },
          },
          {
            type: 'TaskStarted',
            detail: { resource: 'putEvents', resourceType: 'events' },
          },
          {
            type: 'TaskSucceeded',
            detail: {
              output:
                '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
              outputDetails: { truncated: false },
              resource: 'putEvents',
              resourceType: 'events',
            },
          },
          {
            type: 'TaskStateExited',
            detail: {
              name: 'NegativeSentimentDetected',
              output:
                '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'ExecutionSucceeded',
            detail: {
              output:
                '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
              outputDetails: { truncated: false },
            },
          },
        ],
      },
    ],
    input: [
      {
        executionStartedEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          roleArn:
            'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
        },
        id: 1,
        previousEventId: 0,
        timestamp: '2022-02-20T02:39:56.556Z',
        type: 'ExecutionStarted',
      },
      {
        id: 2,
        previousEventId: 0,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Validation',
        },
        timestamp: '2022-02-20T02:39:56.561Z',
        type: 'ParallelStateEntered',
      },
      {
        id: 3,
        previousEventId: 2,
        timestamp: '2022-02-20T02:39:56.564Z',
        type: 'ParallelStateStarted',
      },
      {
        id: 4,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Identity',
        },
        timestamp: '2022-02-20T02:39:56.568Z',
        type: 'TaskStateEntered',
      },
      {
        id: 5,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Address',
        },
        timestamp: '2022-02-20T02:39:56.573Z',
        type: 'TaskStateEntered',
      },
      {
        id: 6,
        previousEventId: 5,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:56.575Z',
        type: 'TaskScheduled',
      },
      {
        id: 7,
        previousEventId: 6,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:56.577Z',
        type: 'TaskStarted',
      },
      {
        id: 8,
        previousEventId: 4,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:56.580Z',
        type: 'TaskScheduled',
      },
      {
        id: 9,
        previousEventId: 8,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:56.581Z',
        type: 'TaskStarted',
      },
      {
        id: 10,
        previousEventId: 7,
        taskSucceededEventDetails: {
          output:
            '{"address":{"approved":true,"message":"address validation passed"}}',
          outputDetails: { truncated: false },
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:56.582Z',
        type: 'TaskSucceeded',
      },
      {
        id: 11,
        previousEventId: 9,
        taskSucceededEventDetails: {
          output:
            '{"identity":{"approved":true,"message":"identity validation passed"}}',
          outputDetails: { truncated: false },
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:56.583Z',
        type: 'TaskSucceeded',
      },
      {
        id: 12,
        previousEventId: 10,
        stateExitedEventDetails: {
          name: 'Check Address',
          output:
            '{"address":{"approved":true,"message":"address validation passed"}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:56.585Z',
        type: 'TaskStateExited',
      },
      {
        id: 13,
        previousEventId: 11,
        stateExitedEventDetails: {
          name: 'Check Identity',
          output:
            '{"identity":{"approved":true,"message":"identity validation passed"}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:56.592Z',
        type: 'TaskStateExited',
      },
      {
        id: 14,
        previousEventId: 12,
        timestamp: '2022-02-20T02:39:56.604Z',
        type: 'ParallelStateSucceeded',
      },
      {
        id: 15,
        previousEventId: 14,
        stateExitedEventDetails: {
          name: 'Validation',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:56.605Z',
        type: 'ParallelStateExited',
      },
      {
        id: 16,
        previousEventId: 15,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
          inputDetails: { truncated: false },
          name: 'DetectSentiment',
        },
        timestamp: '2022-02-20T02:39:56.606Z',
        type: 'TaskStateEntered',
      },
      {
        id: 17,
        previousEventId: 16,
        taskScheduledEventDetails: {
          parameters:
            '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
          region: 'us-east-1',
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:39:56.607Z',
        type: 'TaskScheduled',
      },
      {
        id: 18,
        previousEventId: 17,
        taskStartedEventDetails: {
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:39:56.608Z',
        type: 'TaskStarted',
      },
      {
        id: 19,
        previousEventId: 18,
        taskSucceededEventDetails: {
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
          outputDetails: { truncated: false },
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:39:56.610Z',
        type: 'TaskSucceeded',
      },
      {
        id: 20,
        previousEventId: 19,
        stateExitedEventDetails: {
          name: 'DetectSentiment',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:56.611Z',
        type: 'TaskStateExited',
      },
      {
        id: 21,
        previousEventId: 20,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
          inputDetails: { truncated: false },
          name: 'Is Positive Sentiment?',
        },
        timestamp: '2022-02-20T02:39:56.612Z',
        type: 'ChoiceStateEntered',
      },
      {
        id: 22,
        previousEventId: 21,
        stateExitedEventDetails: {
          name: 'Is Positive Sentiment?',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:56.614Z',
        type: 'ChoiceStateExited',
      },
      {
        id: 23,
        previousEventId: 22,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"NEGATIVE","SentimentScore":{"Mixed":1.2647535E-4,"Positive":8.031699E-5,"Neutral":0.0051454515,"Negative":0.9946478}}}}',
          inputDetails: { truncated: false },
          name: 'NegativeSentimentDetected',
        },
        timestamp: '2022-02-20T02:39:56.614Z',
        type: 'TaskStateEntered',
      },
      {
        id: 24,
        previousEventId: 23,
        taskScheduledEventDetails: {
          parameters:
            '{"Entries":[{"Detail":{"Message":"Negative Sentiment Detected","Data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}},"DetailType":"NegativeSentiment","Source":"LocalTestingSource"}]}',
          region: 'us-east-1',
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:56.615Z',
        type: 'TaskScheduled',
      },
      {
        id: 25,
        previousEventId: 24,
        taskStartedEventDetails: {
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:56.615Z',
        type: 'TaskStarted',
      },
      {
        id: 26,
        previousEventId: 25,
        taskSucceededEventDetails: {
          output:
            '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
          outputDetails: { truncated: false },
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:56.615Z',
        type: 'TaskSucceeded',
      },
      {
        id: 27,
        previousEventId: 26,
        stateExitedEventDetails: {
          name: 'NegativeSentimentDetected',
          output:
            '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:56.616Z',
        type: 'TaskStateExited',
      },
      {
        executionSucceededEventDetails: {
          output:
            '{"Payload":{"Entries":[{"EventId":"abc123"}],"FailedEntryCount":0}}',
          outputDetails: { truncated: false },
        },
        id: 28,
        previousEventId: 27,
        timestamp: '2022-02-20T02:39:56.616Z',
        type: 'ExecutionSucceeded',
      },
    ],
  },
  {
    output: [
      {
        ExecutionStarted: [
          {
            type: 'ExecutionStarted',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              roleArn:
                'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
            },
          },
        ],
        'ParallelStateEntered Validation': [
          {
            type: 'ParallelStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
              inputDetails: { truncated: false },
              name: 'Validation',
            },
          },
          { type: 'ParallelStateStarted' },
          {
            'TaskStateEntered Check Identity': [
              {
                type: 'TaskStateEntered',
                detail: {
                  input:
                    '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                  inputDetails: { truncated: false },
                  name: 'Check Identity',
                },
              },
              {
                type: 'TaskScheduled',
                detail: {
                  parameters:
                    '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
                  region: 'us-east-1',
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStarted',
                detail: { resource: 'invoke', resourceType: 'lambda' },
              },
              {
                type: 'TaskSucceeded',
                detail: {
                  output:
                    '{"identity":{"approved":true,"message":"identity validation passed"}}',
                  outputDetails: { truncated: false },
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'Check Identity',
                  output:
                    '{"identity":{"approved":true,"message":"identity validation passed"}}',
                  outputDetails: { truncated: false },
                },
              },
            ],
            'TaskStateEntered Check Address': [
              {
                type: 'TaskStateEntered',
                detail: {
                  input:
                    '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
                  inputDetails: { truncated: false },
                  name: 'Check Address',
                },
              },
              {
                type: 'TaskScheduled',
                detail: {
                  parameters:
                    '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
                  region: 'us-east-1',
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStarted',
                detail: { resource: 'invoke', resourceType: 'lambda' },
              },
              {
                type: 'TaskSucceeded',
                detail: {
                  output:
                    '{"address":{"approved":true,"message":"address validation passed"}}',
                  outputDetails: { truncated: false },
                  resource: 'invoke',
                  resourceType: 'lambda',
                },
              },
              {
                type: 'TaskStateExited',
                detail: {
                  name: 'Check Address',
                  output:
                    '{"address":{"approved":true,"message":"address validation passed"}}',
                  outputDetails: { truncated: false },
                },
              },
            ],
          },
          { type: 'ParallelStateSucceeded' },
          {
            type: 'ParallelStateExited',
            detail: {
              name: 'Validation',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'TaskStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
              inputDetails: { truncated: false },
              name: 'DetectSentiment',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
              region: 'us-east-1',
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskStarted',
            detail: {
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskSucceeded',
            detail: {
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              outputDetails: { truncated: false },
              resource: 'comprehend:detectSentiment',
              resourceType: 'aws-sdk',
            },
          },
          {
            type: 'TaskStateExited',
            detail: {
              name: 'DetectSentiment',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'ChoiceStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              inputDetails: { truncated: false },
              name: 'Is Positive Sentiment?',
            },
          },
          {
            type: 'ChoiceStateExited',
            detail: {
              name: 'Is Positive Sentiment?',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'TaskStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
              inputDetails: { truncated: false },
              name: 'Add to FollowUp',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"Item":{"PK":{"S":"jdoe@example.com"}},"TableName":"FollowUpTable"}',
              region: 'us-east-1',
              resource: 'putItem',
              resourceType: 'dynamodb',
            },
          },
          {
            type: 'TaskStarted',
            detail: { resource: 'putItem', resourceType: 'dynamodb' },
          },
          {
            type: 'TaskSucceeded',
            detail: {
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
              outputDetails: { truncated: false },
              resource: 'putItem',
              resourceType: 'dynamodb',
            },
          },
          {
            type: 'TaskStateExited',
            detail: {
              name: 'Add to FollowUp',
              output:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'TaskStateEntered',
            detail: {
              input:
                '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
              inputDetails: { truncated: false },
              name: 'CustomerAddedToFollowup',
            },
          },
          {
            type: 'TaskScheduled',
            detail: {
              parameters:
                '{"Entries":[{"Detail":{"Message":"Customer Added for follow up","EmailAddress":"jdoe@example.com"},"DetailType":"CustomerAdded","Source":"LocalTestingSource"}]}',
              region: 'us-east-1',
              resource: 'putEvents',
              resourceType: 'events',
            },
          },
          {
            type: 'TaskStarted',
            detail: { resource: 'putEvents', resourceType: 'events' },
          },
          {
            type: 'TaskSucceeded',
            detail: {
              output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
              outputDetails: { truncated: false },
              resource: 'putEvents',
              resourceType: 'events',
            },
          },
          {
            type: 'TaskStateExited',
            detail: {
              name: 'CustomerAddedToFollowup',
              output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
              outputDetails: { truncated: false },
            },
          },
          {
            type: 'ExecutionSucceeded',
            detail: {
              output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
              outputDetails: { truncated: false },
            },
          },
        ],
      },
    ],
    input: [
      {
        executionStartedEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          roleArn:
            'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
        },
        id: 1,
        previousEventId: 0,
        timestamp: '2022-02-20T02:39:55.437Z',
        type: 'ExecutionStarted',
      },
      {
        id: 2,
        previousEventId: 0,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Validation',
        },
        timestamp: '2022-02-20T02:39:55.439Z',
        type: 'ParallelStateEntered',
      },
      {
        id: 3,
        previousEventId: 2,
        timestamp: '2022-02-20T02:39:55.448Z',
        type: 'ParallelStateStarted',
      },
      {
        id: 4,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Identity',
        },
        timestamp: '2022-02-20T02:39:55.459Z',
        type: 'TaskStateEntered',
      },
      {
        id: 5,
        previousEventId: 3,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."}}',
          inputDetails: { truncated: false },
          name: 'Check Address',
        },
        timestamp: '2022-02-20T02:39:55.468Z',
        type: 'TaskStateEntered',
      },
      {
        id: 6,
        previousEventId: 4,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-identity-function","Payload":{"email":"jdoe@example.com","ssn":"123-45-6789"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:55.498Z',
        type: 'TaskScheduled',
      },
      {
        id: 7,
        previousEventId: 6,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:55.500Z',
        type: 'TaskStarted',
      },
      {
        id: 8,
        previousEventId: 5,
        taskScheduledEventDetails: {
          parameters:
            '{"FunctionName":"arn:aws:lambda:us-west-2:123456789012:function:check-address-function","Payload":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"}}',
          region: 'us-east-1',
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:55.502Z',
        type: 'TaskScheduled',
      },
      {
        id: 9,
        previousEventId: 8,
        taskStartedEventDetails: { resource: 'invoke', resourceType: 'lambda' },
        timestamp: '2022-02-20T02:39:55.504Z',
        type: 'TaskStarted',
      },
      {
        id: 10,
        previousEventId: 9,
        taskSucceededEventDetails: {
          output:
            '{"address":{"approved":true,"message":"address validation passed"}}',
          outputDetails: { truncated: false },
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:55.509Z',
        type: 'TaskSucceeded',
      },
      {
        id: 11,
        previousEventId: 7,
        taskSucceededEventDetails: {
          output:
            '{"identity":{"approved":true,"message":"identity validation passed"}}',
          outputDetails: { truncated: false },
          resource: 'invoke',
          resourceType: 'lambda',
        },
        timestamp: '2022-02-20T02:39:55.510Z',
        type: 'TaskSucceeded',
      },
      {
        id: 12,
        previousEventId: 10,
        stateExitedEventDetails: {
          name: 'Check Address',
          output:
            '{"address":{"approved":true,"message":"address validation passed"}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:55.512Z',
        type: 'TaskStateExited',
      },
      {
        id: 13,
        previousEventId: 11,
        stateExitedEventDetails: {
          name: 'Check Identity',
          output:
            '{"identity":{"approved":true,"message":"identity validation passed"}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:55.514Z',
        type: 'TaskStateExited',
      },
      {
        id: 14,
        previousEventId: 12,
        timestamp: '2022-02-20T02:39:55.534Z',
        type: 'ParallelStateSucceeded',
      },
      {
        id: 15,
        previousEventId: 14,
        stateExitedEventDetails: {
          name: 'Validation',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:55.539Z',
        type: 'ParallelStateExited',
      },
      {
        id: 16,
        previousEventId: 15,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"addressResult":{"approved":true,"message":"address validation passed"},"identityResult":{"approved":true,"message":"identity validation passed"}}}',
          inputDetails: { truncated: false },
          name: 'DetectSentiment',
        },
        timestamp: '2022-02-20T02:39:55.553Z',
        type: 'TaskStateEntered',
      },
      {
        id: 17,
        previousEventId: 16,
        taskScheduledEventDetails: {
          parameters:
            '{"LanguageCode":"en","Text":"I am glad to sign-up for this service. Looking forward to different options."}',
          region: 'us-east-1',
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:39:55.556Z',
        type: 'TaskScheduled',
      },
      {
        id: 18,
        previousEventId: 17,
        taskStartedEventDetails: {
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:39:55.557Z',
        type: 'TaskStarted',
      },
      {
        id: 19,
        previousEventId: 18,
        taskSucceededEventDetails: {
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          outputDetails: { truncated: false },
          resource: 'comprehend:detectSentiment',
          resourceType: 'aws-sdk',
        },
        timestamp: '2022-02-20T02:39:55.561Z',
        type: 'TaskSucceeded',
      },
      {
        id: 20,
        previousEventId: 19,
        stateExitedEventDetails: {
          name: 'DetectSentiment',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:55.562Z',
        type: 'TaskStateExited',
      },
      {
        id: 21,
        previousEventId: 20,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          inputDetails: { truncated: false },
          name: 'Is Positive Sentiment?',
        },
        timestamp: '2022-02-20T02:39:55.563Z',
        type: 'ChoiceStateEntered',
      },
      {
        id: 22,
        previousEventId: 21,
        stateExitedEventDetails: {
          name: 'Is Positive Sentiment?',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:55.566Z',
        type: 'ChoiceStateExited',
      },
      {
        id: 23,
        previousEventId: 22,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"sentimentAnalysis":{"Sentiment":"POSITIVE","SentimentScore":{"Mixed":1.2647535E-4,"Negative":8.031699E-5,"Neutral":0.0051454515,"Positive":0.9946478}}}}',
          inputDetails: { truncated: false },
          name: 'Add to FollowUp',
        },
        timestamp: '2022-02-20T02:39:55.568Z',
        type: 'TaskStateEntered',
      },
      {
        id: 24,
        previousEventId: 23,
        taskScheduledEventDetails: {
          parameters:
            '{"Item":{"PK":{"S":"jdoe@example.com"}},"TableName":"FollowUpTable"}',
          region: 'us-east-1',
          resource: 'putItem',
          resourceType: 'dynamodb',
        },
        timestamp: '2022-02-20T02:39:55.570Z',
        type: 'TaskScheduled',
      },
      {
        id: 25,
        previousEventId: 24,
        taskStartedEventDetails: {
          resource: 'putItem',
          resourceType: 'dynamodb',
        },
        timestamp: '2022-02-20T02:39:55.571Z',
        type: 'TaskStarted',
      },
      {
        id: 26,
        previousEventId: 25,
        taskSucceededEventDetails: {
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
          outputDetails: { truncated: false },
          resource: 'putItem',
          resourceType: 'dynamodb',
        },
        timestamp: '2022-02-20T02:39:55.572Z',
        type: 'TaskSucceeded',
      },
      {
        id: 27,
        previousEventId: 26,
        stateExitedEventDetails: {
          name: 'Add to FollowUp',
          output:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:55.573Z',
        type: 'TaskStateExited',
      },
      {
        id: 28,
        previousEventId: 27,
        stateEnteredEventDetails: {
          input:
            '{"data":{"firstname":"Jane","lastname":"Doe","identity":{"email":"jdoe@example.com","ssn":"123-45-6789"},"address":{"street":"123 Main St","city":"Columbus","state":"OH","zip":"43219"},"comments":"I am glad to sign-up for this service. Looking forward to different options."},"results":{"dbUpdateStatusCode":200}}',
          inputDetails: { truncated: false },
          name: 'CustomerAddedToFollowup',
        },
        timestamp: '2022-02-20T02:39:55.574Z',
        type: 'TaskStateEntered',
      },
      {
        id: 29,
        previousEventId: 28,
        taskScheduledEventDetails: {
          parameters:
            '{"Entries":[{"Detail":{"Message":"Customer Added for follow up","EmailAddress":"jdoe@example.com"},"DetailType":"CustomerAdded","Source":"LocalTestingSource"}]}',
          region: 'us-east-1',
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:55.576Z',
        type: 'TaskScheduled',
      },
      {
        id: 30,
        previousEventId: 29,
        taskStartedEventDetails: {
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:55.577Z',
        type: 'TaskStarted',
      },
      {
        id: 31,
        previousEventId: 30,
        taskSucceededEventDetails: {
          output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
          outputDetails: { truncated: false },
          resource: 'putEvents',
          resourceType: 'events',
        },
        timestamp: '2022-02-20T02:39:55.578Z',
        type: 'TaskSucceeded',
      },
      {
        id: 32,
        previousEventId: 31,
        stateExitedEventDetails: {
          name: 'CustomerAddedToFollowup',
          output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
          outputDetails: { truncated: false },
        },
        timestamp: '2022-02-20T02:39:55.578Z',
        type: 'TaskStateExited',
      },
      {
        executionSucceededEventDetails: {
          output: '{"StatusCode":200,"Payload":{"statusCode":200}}',
          outputDetails: { truncated: false },
        },
        id: 33,
        previousEventId: 32,
        timestamp: '2022-02-20T02:39:55.581Z',
        type: 'ExecutionSucceeded',
      },
    ],
  },
];
