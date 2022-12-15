import { getNestedAndNonNestedKeysFromObject } from './lib';

test('getNestedAndNonNestedKeysFromObject - both nested and non-nested keys', () => {
  const input = {
    nested1: {
      thing: ''
    },
    nonNested1: ''
  };
  const actual = getNestedAndNonNestedKeysFromObject(input);

  const expected = {
    nestedKeys: ['nested1'],
    nonNestedKeys: ['nonNested1']
  };

  expect(actual).toStrictEqual(expected);
});

test('getNestedAndNonNestedKeysFromObject - just nested keys', () => {
  const input = {
    nested1: {
      thing: ''
    }
  };
  const actual = getNestedAndNonNestedKeysFromObject(input);

  const expected = {
    nestedKeys: ['nested1'],
    nonNestedKeys: []
  };

  expect(actual).toStrictEqual(expected);
});

test('getNestedAndNonNestedKeysFromObject - just non-nested keys', () => {
  const input = {
    nonNested1: ''
  };
  const actual = getNestedAndNonNestedKeysFromObject(input);

  const expected = {
    nestedKeys: [],
    nonNestedKeys: ['nonNested1']
  };

  expect(actual).toStrictEqual(expected);
});

test('getNestedAndNonNestedKeysFromObject - empty object', () => {
  const input = {};
  const actual = getNestedAndNonNestedKeysFromObject(input);

  const expected = {
    nestedKeys: [],
    nonNestedKeys: []
  };

  expect(actual).toStrictEqual(expected);
});
