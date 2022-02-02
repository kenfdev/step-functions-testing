import { JsonSerializable } from '.';

export type Statement = JsonSerializable;

export class ReturnStatement<T = any> implements Statement {
  private response: T;

  constructor(response: T) {
    this.response = response;
  }

  toJson() {
    return {
      Return: this.response,
    };
  }
}

export class ThrowStatement implements Statement {
  error: string;
  cause: string;

  constructor(error: string, cause: string) {
    this.error = error;
    this.cause = cause;
  }

  toJson() {
    return {
      Throw: {
        Error: this.error,
        Cause: this.cause,
      },
    };
  }
}
