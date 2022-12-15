import {
  defaultPayload,
  defaultPayloadOnlyEvents,
  defaultPayloadOnlyMetrics
} from '../../../../lib/defaultPayload';
import { aggregateMetricTypes, filterOnMetricType } from './metricType';

/// aggregateMetricTypes ///
test('aggregateMetricTypes - extract all metric types', () => {
  const input = [
    {
      payload: defaultPayload
    }
  ];
  const actual = aggregateMetricTypes(input);

  const expected = [
    'boolean',
    'counter',
    'custom_distribution',
    'datetime',
    'event',
    'labeled_boolean',
    'labeled_counter',
    'labeled_string',
    'memory_distribution',
    'quantity',
    'rate',
    'string',
    'string_list',
    'text',
    'timespan',
    'timing_distribution',
    'url',
    'uuid'
  ];

  expect(actual).toStrictEqual(expected);
});

test('aggregateMetricTypes - no events', () => {
  const input = [
    {
      payload: defaultPayloadOnlyMetrics
    }
  ];
  const actual = aggregateMetricTypes(input);

  const expected = [
    'boolean',
    'counter',
    'custom_distribution',
    'datetime',
    'labeled_boolean',
    'labeled_counter',
    'labeled_string',
    'memory_distribution',
    'quantity',
    'rate',
    'string',
    'string_list',
    'text',
    'timespan',
    'timing_distribution',
    'url',
    'uuid'
  ];

  expect(actual).toStrictEqual(expected);
});

test('aggregateMetricTypes - no metrics', () => {
  const input = [
    {
      payload: defaultPayloadOnlyEvents
    }
  ];
  const actual = aggregateMetricTypes(input);

  const expected = ['event'];

  expect(actual).toStrictEqual(expected);
});

test('aggregateMetricTypes - no metric types', () => {
  const input = [];
  const actual = aggregateMetricTypes(input);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

/// filterOnMetricType ///
test('filterOnMetricType - filter on a metricType in pings array', () => {
  const inputArr = [
    {
      payload: defaultPayload
    }
  ];
  const inputFilter = 'boolean';
  const actual = filterOnMetricType(inputArr, inputFilter);

  const expected = [
    {
      payload: defaultPayload
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('filterOnMetricType - filter on a metricType not in pings array', () => {
  const inputArr = [
    {
      payload: defaultPayloadOnlyMetrics
    }
  ];
  const inputFilter = 'event';
  const actual = filterOnMetricType(inputArr, inputFilter);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('filterOnMetricType - filter on the custom event metricType', () => {
  const inputArr = [
    {
      payload: defaultPayloadOnlyEvents
    }
  ];
  const inputFilter = 'event';
  const actual = filterOnMetricType(inputArr, inputFilter);

  const expected = [
    {
      payload: defaultPayloadOnlyEvents
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('filterOnMetricType - return multiple pings with the same metric', () => {
  const inputArr = [
    {
      payload: defaultPayload
    },
    {
      payload: defaultPayloadOnlyEvents
    },
    {
      payload: defaultPayloadOnlyMetrics
    }
  ];
  const inputFilter = 'event';
  const actual = filterOnMetricType(inputArr, inputFilter);

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

test('filterOnMetricType - ping array is empty', () => {
  const inputArr = [];
  const inputFilter = 'boolean';
  const actual = filterOnMetricType(inputArr, inputFilter);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('filterOnMetricType - metricType is empty', () => {
  const inputArr = [
    {
      payload: defaultPayload
    }
  ];
  const inputFilter = '';
  const actual = filterOnMetricType(inputArr, inputFilter);

  const expected = [
    {
      payload: defaultPayload
    }
  ];

  expect(actual).toStrictEqual(expected);
});
