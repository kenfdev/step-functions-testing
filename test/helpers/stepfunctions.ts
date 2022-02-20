import { HistoryEvent } from '@aws-sdk/client-sfn';
import { StepFunctionsMockConfig } from 'stepfunctions-testing';
import * as tmp from 'tmp-promise';
import { promises as fs } from 'fs';
import { StartedTestContainer } from 'testcontainers';
import { SFNClientWrapper } from './stepfunctions/client-wrapper';
import { createStepFunctionsLocalContainer } from './stepfunctions/local-container';
import { optimizeExecutionHistory } from './stepfunctions/execution-history';

export const createJestTestFromMockConfig = (
  config: StepFunctionsMockConfig,
  aslDefinition: string
) => {
  return () => {
    for (const testDefinition of config.collectStateMachineTestDefinitions()) {
      describe(testDefinition.stateMachineName, () => {
        let tmpDir: tmp.DirectoryResult;
        let container: StartedTestContainer | undefined;

        let client: SFNClientWrapper;
        let stateMachineArn = '';

        beforeAll(async () => {
          const mockConfigPath = await tmp.tmpName();
          await fs.writeFile(mockConfigPath, JSON.stringify(config.toJson()));
          container = await createStepFunctionsLocalContainer(mockConfigPath);

          // create the state machine
          client = new SFNClientWrapper({
            endpoint: `http://localhost:${container?.getMappedPort(8083)}`,
          });
          const result = await client.createStateMachine(
            testDefinition.stateMachineName,
            aslDefinition
          );

          // save for later usage
          stateMachineArn = result.stateMachineArn!;
        }, 30_000);

        afterAll(async () => {
          await container?.stop();
          await tmpDir.cleanup();
        });

        for (const testCase of testDefinition.collectTestCase()) {
          test(
            testCase.name,
            async () => {
              // Arrange
              // Act
              const startExecutionResponse =
                await client.startExecutionFromTestCase(
                  stateMachineArn,
                  testCase
                );
              await client.waitExecutionStop(
                startExecutionResponse.executionArn!
              );

              // Assert
              const { events: rawEvents = [] } =
                await client.getExecutionHistory(
                  startExecutionResponse.executionArn!
                );
              console.log(JSON.stringify(rawEvents));
              const results = await optimizeExecutionHistory(rawEvents);

              console.log(JSON.stringify(results));
            },
            30_000
          );
        }
      });
    }
  };
};
