import { HistoryEvent } from '@aws-sdk/client-sfn';
import { StepFunctionsMockConfig } from 'stepfunctions-testing';
import * as tmp from 'tmp-promise';
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as path from 'path';

import { StartedTestContainer } from 'testcontainers';
import { SFNClientWrapper } from './stepfunctions/client-wrapper';
import { createStepFunctionsLocalContainer } from './stepfunctions/local-container';
import { optimizeExecutionHistory } from './stepfunctions/execution-history';
import { generateMermaidMarkdown } from './stepfunctions/state-diagram';

export const createJestTestFromMockConfig = (
  config: StepFunctionsMockConfig,
  aslDefinition: any
) => {
  if (!aslDefinition) {
    // TODO: think of a better validation
    throw new Error('aslDefinition cannot be empty');
  }

  return () => {
    const testFileDir = path.dirname(module.parent!.filename);
    const snapshotRootDir = path.join(
      testFileDir,
      '__stepfunctions_snapshots__'
    );
    fsSync.mkdirSync(snapshotRootDir, { recursive: true });

    const testDefinitions = config.collectStateMachineTestDefinitions();

    for (const testDefinition of testDefinitions) {
      describe(testDefinition.stateMachineName, () => {
        const stateMachineDir = path.join(
          snapshotRootDir,
          testDefinition.stateMachineName
        );
        fsSync.mkdirSync(stateMachineDir, { recursive: true });
        fsSync.writeFileSync(
          path.join(stateMachineDir, 'asl.json'),
          JSON.stringify(aslDefinition, null, 2)
        );

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
            JSON.stringify(aslDefinition)
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
              // console.log(JSON.stringify(rawEvents));
              const results = await optimizeExecutionHistory(rawEvents);

              expect(results).toMatchSnapshot();

              const content = generateMermaidMarkdown(testCase.name, results);
              await fs.writeFile(
                path.join(stateMachineDir, `${testCase.name}.md`),
                content
              );

              // console.log(JSON.stringify(results));
            },
            30_000
          );
        }
      });
    }
  };
};
