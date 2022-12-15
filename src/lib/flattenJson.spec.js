import { flattenJson } from './flattenJson';

test('flattenJson - JSON is correctly flattened', () => {
  const input = {
    value1: '',
    value2: {
      value3: {
        value4: ''
      }
    }
  };
  const actual = flattenJson(input);

  const expected = {
    value1: '',
    'value2.value3.value4': ''
  };

  expect(actual).toStrictEqual(expected);
});

test('flattenJson - flattening an empty object', () => {
  const input = {};
  const actual = flattenJson(input);

  const expected = {};

  expect(actual).toStrictEqual(expected);
});

test('flattenJson - already flattened objects are not flattened further', () => {
  const input = {
    value1: '',
    'value2.value3.value4': ''
  };
  const actual = flattenJson(input);

  const expected = {
    value1: '',
    'value2.value3.value4': ''
  };

  expect(actual).toStrictEqual(expected);
});
