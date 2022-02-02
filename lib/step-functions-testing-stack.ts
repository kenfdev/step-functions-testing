import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StateMachineConstruct } from './state-machine-construct';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class StepFunctionsTestingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new StateMachineConstruct(this, 'StateMachine');

    // example resource
    // const queue = new sqs.Queue(this, 'StepFunctionsTestingQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
