/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { aggregateCountOfEventProperty } from './lib';

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
