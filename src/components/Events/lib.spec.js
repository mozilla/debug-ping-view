import { aggregateCountOfEventProperty, getEventTimestampRange, preprocessEvents } from './lib';

const mockEvents = [
  {
    category: 'category1',
    name: 'start',
    timestamp: 0
  },
  {
    category: 'category1',
    name: 'end',
    timestamp: 100
  },
  {
    category: 'category2',
    name: 'start',
    timestamp: 150
  },
  {
    category: 'category1',
    name: 'start',
    timestamp: 70000
  },
  {
    category: 'category2',
    name: 'end',
    timestamp: 82000
  },
  {
    category: 'category1',
    name: 'end',
    timestamp: 82500
  }
];

/// aggregateCountOfEventProperty ///
test('aggregateCountOfEventProperty - generate event counts for event names', () => {
  const inputArr = mockEvents;
  const inputProperty = 'name';
  const actual = aggregateCountOfEventProperty(inputArr, inputProperty);

  const expected = [
    {
      key: 'category1.start',
      value: 2
    },
    {
      key: 'category1.end',
      value: 2
    },
    {
      key: 'category2.start',
      value: 1
    },
    {
      key: 'category2.end',
      value: 1
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('aggregateCountOfEventProperty - generate event counts for event categories', () => {
  const inputArr = mockEvents;
  const inputProperty = 'category';
  const actual = aggregateCountOfEventProperty(inputArr, inputProperty);

  const expected = [
    {
      key: 'category1',
      value: 4
    },
    {
      key: 'category2',
      value: 2
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('aggregateCountOfEventProperty - events array is empty', () => {
  const inputArr = [];
  const inputProperty = 'name';
  const actual = aggregateCountOfEventProperty(inputArr, inputProperty);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('aggregateCountOfEventProperty - events property is empty', () => {
  const inputArr = mockEvents;
  const inputProperty = '';
  const actual = aggregateCountOfEventProperty(inputArr, inputProperty);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

/// getEventTimestampRange ///
test('getEventTimestampRange - get values for events array', () => {
  const input = mockEvents;
  const actual = getEventTimestampRange(input);

  const expected = [0, 82500];

  expect(actual).toStrictEqual(expected);
});

test('getEventTimestampRange - single event, min and max are the same', () => {
  const input = [
    {
      category: 'category1',
      name: 'start',
      timestamp: 0
    }
  ];
  const actual = getEventTimestampRange(input);

  const expected = [0, 0];

  expect(actual).toStrictEqual(expected);
});

test('getEventTimestampRange - empty events array', () => {
  const input = [];
  const actual = getEventTimestampRange(input);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

/// preprocessEvents ///
test('preprocessEvents - process events', () => {
  const inputArr = mockEvents;
  const inputMax = 82500;
  const actual = preprocessEvents(inputArr, inputMax);

  const expected = [
    {
      label: 'category1.start,category1.end,category2.start',
      timestamp: '0-150'
    },
    {
      label: 'category1.start',
      timestamp: '70000'
    },
    {
      label: 'category2.end',
      timestamp: '82000'
    },
    {
      label: 'category1.end',
      timestamp: '82500'
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('preprocessEvents - no events', () => {
  const inputArr = [];
  const inputMax = 0;
  const actual = preprocessEvents(inputArr, inputMax);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('preprocessEvents - no max value', () => {
  const inputArr = mockEvents;
  const inputMax = undefined;
  const actual = preprocessEvents(inputArr, inputMax);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});
