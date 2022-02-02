import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { extractStateMachineAsls } from './helpers/stepfunctions';
import { StateMachineConstruct } from '../lib/state-machine-construct';

import {
  SFNClient,
  CreateStateMachineCommand,
  DeleteStateMachineCommand,
  StartExecutionCommand,
  GetExecutionHistoryCommand,
} from '@aws-sdk/client-sfn';

describe('StateMachine', () => {
  let client = new SFNClient({ endpoint: 'http://localhost:8083' });
  let stateMachineArn = '';

  beforeAll(async () => {
    const stack = new cdk.Stack();

    new StateMachineConstruct(stack, 'StateMachine');

    const cfnStackJson = Template.fromStack(stack).toJSON();
    const asls = extractStateMachineAsls(cfnStackJson);

    // console.log(JSON.stringify(asls));

    const createStateMachineCommand = new CreateStateMachineCommand({
      name: 'LambdaSQSIntegration',
      definition: asls[0],
      roleArn:
        'arn:aws:iam::123456789012:role/service-role/LambdaSQSIntegration',
    });

    const result = await client.send(createStateMachineCommand);
    // console.log(result);

    stateMachineArn = result.stateMachineArn!;
  });

  test('HappyPath', async () => {
    // Arrange
    const startExecutionCmd = new StartExecutionCommand({
      name: 'executionWithHappyPathMockedServices',
      stateMachineArn: `${stateMachineArn}#HappyPath`,
    });
    const expectedMockedLambdaResult = {
      StatusCode: 200,
      Payload: {
        StatusCode: 200,
        body: 'Hello from Lambda!',
      },
    };

    // Act
    const startExecutionResponse = await client.send(startExecutionCmd);
    // console.log('startExecutionResponse', startExecutionResponse);
    await wait(2); // FIXME: hard-coded waiting for the execution to finish

    // Assert
    const getExecutionHistoryCmd = new GetExecutionHistoryCommand({
      executionArn: startExecutionResponse.executionArn,
    });
    const { events = [] } = await client.send(getExecutionHistoryCmd);

    // comment out to see all the events
    // for (const e of events) {
    // 
    //   console.log(e);
    // }

    expect(events[0].type).toEqual('ExecutionStarted');
    expect(events[1].type).toEqual('TaskStateEntered');
    expect(events[1].stateEnteredEventDetails?.name).toEqual('LambdaState');
    expect(events[2].type).toEqual('TaskScheduled');
    expect(events[3].type).toEqual('TaskStarted');
    expect(events[4].type).toEqual('TaskSucceeded');
    expect(events[4].taskSucceededEventDetails?.output).toEqual(
      JSON.stringify(expectedMockedLambdaResult)
    );
    expect(events[5].type).toEqual('TaskStateExited');

    expect(events[6].type).toEqual('TaskStateEntered');
    expect(events[6].stateEnteredEventDetails?.name).toEqual('SQSState');
    expect(events[7].type).toEqual('TaskScheduled');
    expect(
      JSON.parse(events[7].taskScheduledEventDetails?.parameters!).MessageBody
    ).toEqual(expectedMockedLambdaResult);
    expect(events[8].type).toEqual('TaskStarted');
    expect(events[9].type).toEqual('TaskSucceeded');
    expect(events[10].type).toEqual('TaskStateExited');
    expect(events[11].type).toEqual('ExecutionSucceeded');
  });

  afterAll(async () => {
    // clean up the state machine
    const deleteStateMachineCommand = new DeleteStateMachineCommand({
      stateMachineArn,
    });
    const result = await client.send(deleteStateMachineCommand);
    // console.log(result);
  });
});

function wait(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, seconds * 1000);
  });
}
