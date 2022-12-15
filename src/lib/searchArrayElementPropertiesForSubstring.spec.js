import { searchArrayElementPropertiesForSubstring } from './searchArrayElementPropertiesForSubstring';

test('searchArrayElementPropertiesForSubstring - array elements with specified property match are returned', () => {
  const inputArr = [
    {
      greeting: 'hello',
      name: 'person1'
    },
    {
      greeting: 'hi',
      name: 'person2'
    }
  ];
  const inputQuery = 'hello';
  const inputProperties = ['greeting'];
  const actual = searchArrayElementPropertiesForSubstring(inputArr, inputQuery, inputProperties);

  const expected = [
    {
      greeting: 'hello',
      name: 'person1'
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('searchArrayElementPropertiesForSubstring - empty array returns an empty array', () => {
  const inputArr = [];
  const inputQuery = '';
  const inputProperties = [];
  const actual = searchArrayElementPropertiesForSubstring(inputArr, inputQuery, inputProperties);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('searchArrayElementPropertiesForSubstring - an array with no elements that match returns an empty array', () => {
  const inputArr = [
    {
      greeting: 'hello',
      name: 'person1'
    },
    {
      greeting: 'hi',
      name: 'person2'
    }
  ];
  const inputQuery = 'moin';
  const inputProperties = ['greeting'];
  const actual = searchArrayElementPropertiesForSubstring(inputArr, inputQuery, inputProperties);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});
