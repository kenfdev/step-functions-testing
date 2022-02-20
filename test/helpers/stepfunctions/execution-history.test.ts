import { optimizeExecutionHistory } from './execution-history';
import { testCases } from './execution-history-data';
describe('Optimize Execution History', () => {
  test.each(testCases.map((v) => [v.input, v.output]))(
    '',
    (input, expected) => {
      // act
      const actual = optimizeExecutionHistory(input as any);

      expect(actual).toEqual(expected);
    }
  );
});
