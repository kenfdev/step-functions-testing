import { JsonSerializable } from '.';
import { MockedResponse } from './response';
import { StateMachineTestDefinition } from './state-machine-test-definition';

type StateMachineTestDefinitions = {
  [key: string]: StateMachineTestDefinition;
};
export class StepFunctionsMockConfig implements JsonSerializable {
  private stateMachineTestDefinitions: StateMachineTestDefinitions = {};

  addTestDefinition(test: StateMachineTestDefinition) {
    if (
      this.stateMachineTestDefinitions.hasOwnProperty(test.stateMachineName)
    ) {
      throw new Error(
        `StateMachine ${test.stateMachineName} is already defined`
      );
    }
    this.stateMachineTestDefinitions[test.stateMachineName] = test;

    return this;
  }

  private optimizeMockedResponses(mockedResponses: MockedResponse[]): {
    [key: string]: MockedResponse;
  } {
    return mockedResponses.reduce((obj, response) => {
      if (
        obj[response.name] &&
        obj[response.name].hasOwnProperty(response.name) &&
        obj[response.name] !== response
      ) {
        let errMessage = `Response name conflict. ${response.name} is already defined and has a different definition. Make sure the response names are unique or else the results will be unpredictable`;
        errMessage += `\nExisting definition: ${JSON.stringify(
          obj[response.name]
        )}`;
        errMessage += `\nIncoming definition: ${JSON.stringify(
          response.toJson()
        )}`;
        throw new Error(errMessage);
      }
      obj[response.name] = response;
      return obj;
    }, {} as { [key: string]: any });
  }

  toJson() {
    let serializedStateMachines = {} as any;
    let mockedResponses = [] as MockedResponse[];
    for (const stateMachineName of Object.keys(
      this.stateMachineTestDefinitions
    )) {
      const stateMachineTestDefinition =
        this.stateMachineTestDefinitions[stateMachineName];

      serializedStateMachines = {
        ...serializedStateMachines,
        ...stateMachineTestDefinition.toJson(),
      };

      mockedResponses = mockedResponses.concat(
        stateMachineTestDefinition.collectMockedResponses()
      );
    }

    const optimizedMockResponses =
      this.optimizeMockedResponses(mockedResponses);

    const serializedMockedResponses = Object.keys(
      optimizedMockResponses
    ).reduce((obj, key) => {
      return { ...obj, ...optimizedMockResponses[key].toJson() };
    }, {} as { [key: string]: any });

    return {
      StateMachines: serializedStateMachines,
      MockedResponses: serializedMockedResponses,
    };
  }
}
