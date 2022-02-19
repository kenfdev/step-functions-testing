import { StartedTestContainer } from 'testcontainers';
import * as tmp from 'tmp-promise';
import { promises as fs } from 'fs';

import {
  createStepFunctionsLocalContainer,
  SFNClientWrapper,
} from './helpers/stepfunctions';

import {
  createConfig,
  stateMachineName,
} from './stepfunctions/sales-lead-mock-config';

const { config, aslDefinition } = createConfig();

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
        stateMachineName,
        aslDefinition
      );

      // save for later usage
      stateMachineArn = result.stateMachineArn!;
    });

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
            await client.startExecutionFromTestCase(stateMachineArn, testCase);
          await client.waitExecutionStop(startExecutionResponse.executionArn!);

          // Assert
          const { events = [] } = await client.getExecutionHistory(
            startExecutionResponse.executionArn!
          );
          // console.warn(JSON.stringify(events));

          const resultsMap = new Map<string, any[]>();
          for (const e of events) {
            if (e.stateEnteredEventDetails?.name) {
              const val = resultsMap.get(e.stateEnteredEventDetails.name);
              if (val) {
                resultsMap.set(e.stateEnteredEventDetails.name, [
                  ...val,
                  { input: e.stateEnteredEventDetails.input },
                ]);
              } else {
                resultsMap.set(e.stateEnteredEventDetails.name, [
                  { input: e.stateEnteredEventDetails.input },
                ]);
              }
              // console.warn(JSON.stringify(e));
              // expect(e).toMatchSnapshot({
              //   timestamp: expect.anything(),
              // });
            }
            if (e.stateExitedEventDetails?.name) {
              const val = resultsMap.get(e.stateExitedEventDetails.name);
              if (val) {
                resultsMap.set(e.stateExitedEventDetails.name, [
                  ...val,
                  { output: e.stateExitedEventDetails.output },
                ]);
              } else {
                resultsMap.set(e.stateExitedEventDetails.name, [
                  { output: e.stateExitedEventDetails.output },
                ]);
              }
            }
            // expect(e).toMatchSnapshot({
            //   timestamp: expect.anything(),
            // });
          }
          expect(resultsMap).toMatchSnapshot();
        },
        30_000
      );
    }
  });
}
