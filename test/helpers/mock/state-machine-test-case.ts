import { isObjectEmpty, JsonSerializable } from '.';
import { MockedResponse } from './response';

export class StateMachineTestCase<StateName extends string = string>
  implements JsonSerializable
{
  // private mockedStates = {} as MockedStateDefinitions<StateName>;
  private mockedStates = {} as Record<StateName, MockedResponse>;

  private _testCaseName: string;
  get name(): string {
    return this._testCaseName;
  }

  private _input: any;
  get input(): any {
    return this._input;
  }

  constructor(testCaseName: string) {
    this._testCaseName = testCaseName;
  }

  withInput(input: any) {
    this._input = input;
    return this;
  }

  addMockedState(stateName: StateName, response: MockedResponse) {
    if (this.mockedStates.hasOwnProperty(stateName)) {
      throw new Error(`The State ${stateName} is already defined`);
    }

    this.mockedStates[stateName] = response;

    return this;
  }

  collectMockedResponses(): MockedResponse[] {
    return Object.keys(this.mockedStates).map(
      (key) => this.mockedStates[key as StateName]
    ); // TODO: better way to Type?
  }

  toJson() {
    if (isObjectEmpty(this.mockedStates)) {
      throw new Error('At least 1 state needs to be defined');
    }

    const serializedMockedStates = Object.keys(this.mockedStates).reduce(
      (acc, key) => {
        acc[key] = this.mockedStates[key as StateName].name;
        return acc;
      },
      {} as { [key: string]: any }
    );

    return {
      [this._testCaseName]: serializedMockedStates,
    };
  }
}
