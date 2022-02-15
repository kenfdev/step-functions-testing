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

jest.setTimeout(60000);

describe('SalesLeadsStateMachine', () => {
  let tmpDir: tmp.DirectoryResult;
  let container: StartedTestContainer | undefined;

  let client: SFNClientWrapper;
  let stateMachineArn = '';

  const { config, aslDefinition, testDefinition } = createConfig();

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

  for (const testCase of Object.values(testDefinition.testCaseDefinitions)) {
    test(testCase.name, async () => {
      // Arrange
      // Act
      const startExecutionResponse = await client.startExecutionFromTestCase(
        stateMachineArn,
        testCase
      );
      await client.waitExecutionStop(startExecutionResponse.executionArn!);

      // Assert
      const { events = [] } = await client.getExecutionHistory(
        startExecutionResponse.executionArn!
      );

      expect(aslDefinition).toMatchSnapshot();
      for (const e of events) {
        expect(e).toMatchSnapshot({
          timestamp: expect.anything(),
        });
      }
    });
  }
});
