import { isObjectEmpty, JsonSerializable } from '.';
import { MockedResponse } from './response';
import { StateMachineTestCase } from './state-machine-test-case';

type TestCaseDefinitions = { [key: string]: StateMachineTestCase };

export class StateMachineTestDefinition implements JsonSerializable {
  private _testCaseDefinitions: TestCaseDefinitions = {};
  get testCaseDefinitions(): TestCaseDefinitions {
    return this._testCaseDefinitions;
  }

  private _stateMachineName: string;
  get stateMachineName(): string {
    return this._stateMachineName;
  }

  constructor(stateMachineName: string) {
    this._stateMachineName = stateMachineName;
  }

  addTestCase(testCase: StateMachineTestCase) {
    if (this._testCaseDefinitions.hasOwnProperty(testCase.name)) {
      throw new Error(`TestCase ${testCase.name} is already defined`);
    }

    this._testCaseDefinitions[testCase.name] = testCase;

    return this;
  }

  collectMockedResponses(): MockedResponse[] {
    return Object.keys(this._testCaseDefinitions).reduce((acc, key) => {
      return acc.concat(
        this._testCaseDefinitions[key].collectMockedResponses()
      );
    }, [] as MockedResponse[]);
  }

  toJson() {
    if (isObjectEmpty(this._testCaseDefinitions)) {
      throw new Error('At least 1 test case needs to be defined');
    }

    const serializedTestCaseDefinitions = Object.keys(
      this._testCaseDefinitions
    ).reduce((acc, key) => {
      return { ...acc, ...this._testCaseDefinitions[key].toJson() };
    }, {} as { [key: string]: any });

    return {
      [this._stateMachineName]: {
        TestCases: serializedTestCaseDefinitions,
      },
    };
  }
}
