export { MockedResponse } from './response';
export { StateMachineTestDefinition } from './state-machine-test-definition';
export { StateMachineTestCase } from './state-machine-test-case';
export { StepFunctionsMockConfig } from './step-functions-mock-config';

export interface JsonSerializable {
  toJson: () => any;
}

export const isObjectEmpty = (obj: any) => {
  return (
    obj &&
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
};
