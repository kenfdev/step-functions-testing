import {
  CreateStateMachineCommand,
  DescribeExecutionCommand,
  GetExecutionHistoryCommand,
  SFNClient,
  SFNClientConfig,
  StartExecutionCommand,
} from '@aws-sdk/client-sfn';
import { StateMachineTestCase } from 'stepfunctions-testing';

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
