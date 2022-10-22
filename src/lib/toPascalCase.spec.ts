import * as assert from 'assert';
import toPascalCase from './toPascalCase';

describe('toPascalCase', () => {
  describe('#1', () => {
    const tests = [
      {
        input: 'Apple Models',
        expected: 'AppleModels',
      },
      {
        input: 'Apple-Models',
        expected: 'AppleModels',
      },
      {
        input: 'Apple_Models',
        expected: 'AppleModels',
      },
      {
        input: '1Apple 2Models',
        expected: '1Apple2Models',
      },
      {
        input: '1apple 2models',
        expected: '1apple2models',
      },
    ];

    tests.forEach(({ input, expected }) => {
      it(`should be convert pascalcase ${input} to ${expected}`, () => {
        const result = toPascalCase(input);

        assert.strictEqual(result, expected);
      });
    });
  });

  describe('Support alphanumeric only', () => {
    const tests = [
      {
        input: '사과_모델',
        expected: ' ',
      },
      {
        input: 'Rocket🚀',
        expected: '',
      },
    ];

    tests.forEach(({ input, expected }) => {
      it(`should be throws error when non-alphanumeric character includes: ${input} to ${expected}`, () => {
        assert.throws(() => {
          toPascalCase(input);
        });
      });
    });
  });
});
