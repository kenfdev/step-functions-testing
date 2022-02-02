import { JsonSerializable } from '.';
import { ReturnStatement, Statement, ThrowStatement } from './statements';

type MockedResponseCollectionItem = {
  repeat: number;
  statement: Statement;
};

class MockedResponseCollection implements JsonSerializable {
  collection: MockedResponseCollectionItem[] = [];
  add(statement: JsonSerializable, repeat: number) {
    this.collection = [...this.collection, { repeat, statement }];
  }

  isEmpty() {
    return this.collection.length === 0;
  }

  toJson() {
    let result: { [index: string]: any } = {};
    let currentResponseIndex = 0;
    for (let i = 0; i < this.collection.length; i++) {
      const item = this.collection[i];
      let indexStr = currentResponseIndex.toString();

      if (item.repeat > 0) {
        currentResponseIndex = currentResponseIndex + item.repeat;
        indexStr = `${indexStr}-${currentResponseIndex}`;
      }

      result[indexStr] = item.statement.toJson();
      currentResponseIndex++;
    }

    return result;
  }
}

export class MockedResponse implements JsonSerializable {
  private responses: MockedResponseCollection = new MockedResponseCollection();

  private _name: string;
  get name(): string {
    return this._name;
  }

  constructor(name: string) {
    this._name = name;
  }

  return<T = any>(response: T, repeat = 0) {
    this.responses.add(new ReturnStatement<T>(response), repeat);
    return this;
  }

  throw(error: string, cause: string, repeat = 0) {
    this.responses.add(new ThrowStatement(error, cause), repeat);
    return this;
  }

  toJson() {
    if (this.responses.isEmpty()) {
      throw new Error('At least 1 return or throw response is required.');
    }
    return {
      [this._name]: this.responses.toJson(),
    };
  }
}
