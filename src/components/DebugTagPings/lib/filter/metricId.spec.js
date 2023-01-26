/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {
  defaultPayload,
  defaultPayloadOnlyEvents,
  defaultPayloadOnlyMetrics,
  defaultPayloadNoEventsOrMetrics
} from '../../../../lib/defaultPayload';
import { aggregateMetricIds, filterOnMetricId } from './metricId';

/// aggregateMetricIds ///
test('aggregateMetricIds - extract all metric IDs', () => {
  const input = [
    {
      payload: defaultPayload
    }
  ];
  const actual = aggregateMetricIds(input);

  const expected = [
    'for_testing.boolean',
    'for_testing.counter',
    'for_testing.custom_distribution_exp',
    'for_testing.custom_distribution_linear',
    'for_testing.datetime',
    'for_testing.event',
    'for_testing.labeled_boolean',
    'for_testing.labeled_counter',
    'for_testing.labeled_string',
    'for_testing.memory_distribution',
    'for_testing.quantity',
    'for_testing.rate',
    'for_testing.string',
    'for_testing.string_list',
    'for_testing.text',
    'for_testing.timespan',
    'for_testing.timing_distribution',
    'for_testing.url',
    'for_testing.uuid'
  ];

  expect(actual).toStrictEqual(expected);
});

test('aggregateMetricIds - ping array has no metric IDs or events', () => {
  const input = [
    {
      payload: defaultPayloadNoEventsOrMetrics
    }
  ];
  const actual = aggregateMetricIds(input);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('aggregateMetricIds - ping array has only metric IDs', () => {
  const input = [
    {
      payload: defaultPayloadOnlyMetrics
    }
  ];
  const actual = aggregateMetricIds(input);

  const expected = [
    'for_testing.boolean',
    'for_testing.counter',
    'for_testing.custom_distribution_exp',
    'for_testing.custom_distribution_linear',
    'for_testing.datetime',
    'for_testing.labeled_boolean',
    'for_testing.labeled_counter',
    'for_testing.labeled_string',
    'for_testing.memory_distribution',
    'for_testing.quantity',
    'for_testing.rate',
    'for_testing.string',
    'for_testing.string_list',
    'for_testing.text',
    'for_testing.timespan',
    'for_testing.timing_distribution',
    'for_testing.url',
    'for_testing.uuid'
  ];

  expect(actual).toStrictEqual(expected);
});

test('aggregateMetricIds - ping array has only event IDs', () => {
  const input = [
    {
      payload: defaultPayloadOnlyEvents
    }
  ];
  const actual = aggregateMetricIds(input);

  const expected = ['for_testing.event'];

  expect(actual).toStrictEqual(expected);
});

test('aggregateMetricIds - ping array is empty', () => {
  const input = [];
  const actual = aggregateMetricIds(input);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

/// filterOnMetricId ///
test('filterOnMetricId - filter on a metric ID in pings array', () => {
  const inputArr = [
    {
      payload: defaultPayload
    }
  ];
  const inputFilter = 'for_testing.boolean';
  const actual = filterOnMetricId(inputArr, inputFilter);

  const expected = [
    {
      payload: defaultPayload
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('filterOnMetricId - filter on an event metric ID in pings array', () => {
  const inputArr = [
    {
      payload: defaultPayload
    }
  ];
  const inputFilter = 'for_testing.event';
  const actual = filterOnMetricId(inputArr, inputFilter);

  const expected = [
    {
      payload: defaultPayload
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('filterOnMetricId - filter on a metric ID not in pings array', () => {
  const inputArr = [
    {
      payload: defaultPayloadOnlyMetrics
    }
  ];
  const inputFilter = 'for_testing.event';
  const actual = filterOnMetricId(inputArr, inputFilter);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('filterOnMetricId - filter on a metric ID in multiple pings', () => {
  const inputArr = [
    {
      payload: defaultPayload
    },
    {
      payload: defaultPayloadOnlyEvents
    }
  ];
  const inputFilter = 'for_testing.event';
  const actual = filterOnMetricId(inputArr, inputFilter);

  const expected = [
    {
      payload: defaultPayload
    },
    {
      payload: defaultPayloadOnlyEvents
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('filterOnMetricId - ping array is empty', () => {
  const inputArr = [];
  const inputMetricId = '';
  const actual = filterOnMetricId(inputArr, inputMetricId);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('filterOnMetricId - metricId is empty', () => {
  const inputArr = [
    {
      payload: defaultPayload
    }
  ];
  const inputMetricId = '';
  const actual = filterOnMetricId(inputArr, inputMetricId);

  const expected = inputArr;

  expect(actual).toStrictEqual(expected);
});
