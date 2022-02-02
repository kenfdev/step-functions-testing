import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface StepFunctionsTestingProps {
  // Define construct properties here
}

export class StepFunctionsTesting extends Construct {

  constructor(scope: Construct, id: string, props: StepFunctionsTestingProps = {}) {
    super(scope, id);

    // Define construct contents here

    // example resource
    // const queue = new sqs.Queue(this, 'StepFunctionsTestingQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
