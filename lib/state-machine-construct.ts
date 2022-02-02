import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { TaskInput } from 'aws-cdk-lib/aws-stepfunctions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Duration } from 'aws-cdk-lib';

export class StateMachineConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const lambdaState = new tasks.LambdaInvoke(this, 'LambdaState', {
      lambdaFunction: lambda.Function.fromFunctionArn(
        this,
        'lambdaInvoke',
        'arn:aws:lambda:us-west-2:123456789012:function:my-function'
      ),
      payload: TaskInput.fromObject({
        'Payload.$': '$',
        FunctionName: 'HelloWorldFunction',
      }),
      retryOnServiceExceptions: false,
    }).addRetry({
      errors: ['States.ALL'],
      backoffRate: 2,
      maxAttempts: 3,
      interval: Duration.seconds(2),
    });

    const sqsState = new tasks.SqsSendMessage(this, 'SQSState', {
      queue: sqs.Queue.fromQueueArn(
        this,
        'sqs',
        'arn:aws:sqs:us-west-2:444455556666:queue1'
      ),
      messageBody: TaskInput.fromJsonPathAt('$'),
    });

    const definition = lambdaState.next(sqsState);

    const sm = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });
  }
}
