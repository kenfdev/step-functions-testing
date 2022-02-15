import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { JsonPath, TaskInput } from 'aws-cdk-lib/aws-stepfunctions';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import { Duration } from 'aws-cdk-lib';
import { DynamoAttributeValue } from 'aws-cdk-lib/aws-stepfunctions-tasks';

type StateMachineProps = {
  stateMachineName?: string;
  validationStateName?: string;
  checkIdentityStateName?: string;
  checkAddressStateName?: string;
  customValidationFailedStateName?: string;
  validationExceptionStateName?: string;
  detectSentimentStateName?: string;
  isPositiveSentimentStateName?: string;
  negativeSentimentDetectedStateName?: string;
  addToFollowUpStateName?: string;
  customerAddedToFollowupStateName?: string;
  retryInterval?: Duration;
};

export class SalesLeadsStateMachineConstruct extends Construct {
  constructor(scope: Construct, id: string, props: StateMachineProps = {}) {
    super(scope, id);

    const {
      validationStateName = 'Validation',
      checkIdentityStateName = 'Check Identity',
      checkAddressStateName = 'Check Address',
      customValidationFailedStateName = 'CustomValidationFailed',
      validationExceptionStateName = 'ValidationException',
      detectSentimentStateName = 'DetectSentiment',
      isPositiveSentimentStateName = 'Is Positive Sentiment?',
      negativeSentimentDetectedStateName = 'NegativeSentimentDetected',
      addToFollowUpStateName = 'Add to FollowUp',
      customerAddedToFollowupStateName = 'CustomerAddedToFollowup',
      stateMachineName = 'SalesLeadStateMachine',
      retryInterval = Duration.seconds(1),
    } = props;

    const checkIdentityState = new tasks.LambdaInvoke(
      this,
      checkIdentityStateName,
      {
        lambdaFunction: lambda.Function.fromFunctionArn(
          this,
          'CheckIdentityFunction',
          'arn:aws:lambda:us-west-2:123456789012:function:check-identity-function'
        ),
        inputPath: JsonPath.stringAt('$.data.identity'),
        payload: TaskInput.fromJsonPathAt('$'),
        resultSelector: {
          identity: JsonPath.stringToJson(JsonPath.stringAt('$.Payload.body')),
        },
        retryOnServiceExceptions: false,
      }
    ).addRetry({
      errors: [
        'Lambda.ServiceException',
        'Lambda.AWSLambdaException',
        'Lambda.SdkClientException',
        'CustomValidationError',
      ],
      backoffRate: 1,
      maxAttempts: 3,
      interval: retryInterval,
    });

    const checkAddressState = new tasks.LambdaInvoke(
      this,
      checkAddressStateName,
      {
        lambdaFunction: lambda.Function.fromFunctionArn(
          this,
          'CheckAddressFunction',
          'arn:aws:lambda:us-west-2:123456789012:function:check-address-function'
        ),
        inputPath: '$.data.address',
        payload: TaskInput.fromJsonPathAt('$'),
        resultSelector: {
          address: JsonPath.stringToJson(JsonPath.stringAt('$.Payload.body')),
        },
        retryOnServiceExceptions: false,
      }
    ).addRetry({
      errors: [
        'Lambda.ServiceException',
        'Lambda.AWSLambdaException',
        'Lambda.SdkClientException',
        'CustomValidationError',
      ],
      backoffRate: 1,
      maxAttempts: 3,
      interval: retryInterval,
    });

    const customValidationFailedState = new tasks.EventBridgePutEvents(
      this,
      customValidationFailedStateName,
      {
        entries: [
          {
            detail: TaskInput.fromObject({
              Message: 'Validation Failed',
            }),
            detailType: 'ValidationFailed',
            source: 'LocalTestingSource',
          },
        ],
      }
    );

    const validationExceptionState = new tasks.EventBridgePutEvents(
      this,
      validationExceptionStateName,
      {
        entries: [
          {
            detail: TaskInput.fromObject({
              Message: 'Validation Exception',
            }),
            detailType: 'ValidationException',
            source: 'LocalTestingSource',
          },
        ],
      }
    );

    const validation = new sfn.Parallel(this, validationStateName, {
      resultSelector: {
        identityResult: JsonPath.stringAt('$[0].identity'),
        addressResult: JsonPath.stringAt('$[1].address'),
      },
      resultPath: JsonPath.stringAt('$.results'),
    });

    const detectSentimentState = new sfn.CustomState(
      this,
      detectSentimentStateName,
      {
        stateJson: {
          Type: 'Task',
          Resource: 'arn:aws:states:::aws-sdk:comprehend:detectSentiment',
          Parameters: {
            LanguageCode: 'en',
            'Text.$': JsonPath.stringAt('$.data.comments'),
          },
          ResultSelector: {
            'sentimentAnalysis.$': JsonPath.stringAt('$'),
          },
          ResultPath: JsonPath.stringAt('$.results'),
          Retry: [
            {
              ErrorEquals: ['InternalServerException'],
              IntervalSeconds: 1,
              MaxAttempts: 3,
              BackoffRate: 1,
            },
          ],
        },
      }
    );

    const negativeSentimentDetectedState = new tasks.EventBridgePutEvents(
      this,
      negativeSentimentDetectedStateName,
      {
        entries: [
          {
            detail: TaskInput.fromObject({
              Message: 'Negative Sentiment Detected',
              Data: JsonPath.stringAt('$.data'),
            }),
            detailType: 'NegativeSentiment',
            source: 'LocalTestingSource',
          },
        ],
      }
    );

    const addToFollowUpState = new tasks.DynamoPutItem(
      this,
      addToFollowUpStateName,
      {
        inputPath: '$.data',
        table: ddb.Table.fromTableName(this, 'FollowUpTable', 'FollowUpTable'),
        item: {
          PK: DynamoAttributeValue.fromString(
            JsonPath.stringAt('$.identity.email')
          ),
        },
        resultSelector: {
          dbUpdateStatusCode: JsonPath.stringAt(
            '$.SdkHttpMetadata.HttpStatusCode'
          ),
        },
        resultPath: JsonPath.stringAt('$.results'),
      }
    );

    const customerAddedToFollowupState = new tasks.EventBridgePutEvents(
      this,
      customerAddedToFollowupStateName,
      {
        inputPath: JsonPath.stringAt('$.data'),
        entries: [
          {
            detail: TaskInput.fromObject({
              Message: 'Customer Added for follow up',
              EmailAddress: JsonPath.stringAt('$.identity.email'),
            }),
            detailType: 'CustomerAdded',
            source: 'LocalTestingSource',
          },
        ],
      }
    );

    const isPositiveSentimentState = new sfn.Choice(
      this,
      isPositiveSentimentStateName
    );

    const definition = validation
      .branch(checkIdentityState, checkAddressState)
      .addCatch(customValidationFailedState, {
        errors: ['CustomValidationError'],
      })
      .addCatch(validationExceptionState, { errors: ['States.ALL'] })
      .next(detectSentimentState)
      .next(
        isPositiveSentimentState
          .when(
            sfn.Condition.stringEquals(
              JsonPath.stringAt('$.results.sentimentAnalysis.Sentiment'),
              'POSITIVE'
            ),
            addToFollowUpState.next(customerAddedToFollowupState)
          )
          .otherwise(negativeSentimentDetectedState)
      );

    const sm = new sfn.StateMachine(this, stateMachineName, {
      stateMachineName,
      definition,
    });
  }
}
