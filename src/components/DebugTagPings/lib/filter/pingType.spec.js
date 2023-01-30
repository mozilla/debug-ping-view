/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import {
  defaultPayload,
  defaultPayloadOnlyEvents,
  defaultPayloadOnlyMetrics
} from '../../../../lib/defaultPayload';
import { aggregatePingTypes, filterOnPingType } from './pingType';

/// aggregatePingTypes ///
test('aggregateMetricIds - extract all ping types', () => {
  const input = [
    {
      pingType: 'full',
      payload: defaultPayload
    },
    {
      pingType: 'metrics',
      payload: defaultPayloadOnlyMetrics
    },
    {
      pingType: 'events',
      payload: defaultPayloadOnlyEvents
    }
  ];
  const actual = aggregatePingTypes(input);

  const expected = ['events', 'full', 'metrics'];

  expect(actual).toStrictEqual(expected);
});

test('aggregateMetricIds - ping array has no ping types', () => {
  const input = [];
  const actual = aggregatePingTypes(input);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

/// filterOnPingType ///
test('filterOnPingType - filter on a pingType in pings array ', () => {
  const inputArr = [
    {
      pingType: 'full',
      payload: defaultPayload
    },
    {
      pingType: 'metrics',
      payload: defaultPayloadOnlyMetrics
    },
    {
      pingType: 'events',
      payload: defaultPayloadOnlyEvents
    }
  ];
  const inputFilter = 'full';
  const actual = filterOnPingType(inputArr, inputFilter);

  const expected = [
    {
      pingType: 'full',
      payload: defaultPayload
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('filterOnPingType - filter on a pingType in multiple pings ', () => {
  const inputArr = [
    {
      pingType: 'full',
      payload: defaultPayload
    },
    {
      pingType: 'metrics',
      payload: defaultPayloadOnlyMetrics
    },
    {
      pingType: 'events',
      payload: defaultPayloadOnlyEvents
    },
    {
      pingType: 'events',
      payload: defaultPayloadOnlyEvents
    }
  ];
  const inputFilter = 'events';
  const actual = filterOnPingType(inputArr, inputFilter);

  const expected = [
    {
      pingType: 'events',
      payload: defaultPayloadOnlyEvents
    },
    {
      pingType: 'events',
      payload: defaultPayloadOnlyEvents
    }
  ];

  expect(actual).toStrictEqual(expected);
});

test('filterOnPingType - filter on a pingType not in pings array ', () => {
  const inputArr = [
    {
      pingType: 'metrics',
      payload: defaultPayloadOnlyMetrics
    },
    {
      pingType: 'events',
      payload: defaultPayloadOnlyEvents
    }
  ];
  const inputFilter = 'full';
  const actual = filterOnPingType(inputArr, inputFilter);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('filterOnPingType - pings array is empty ', () => {
  const inputArr = [];
  const inputFilter = 'full';
  const actual = filterOnPingType(inputArr, inputFilter);

  const expected = [];

  expect(actual).toStrictEqual(expected);
});

test('filterOnPingType - pingType is empty', () => {
  const inputArr = [
    {
      pingType: 'metrics',
      payload: defaultPayloadOnlyMetrics
    },
    {
      pingType: 'events',
      payload: defaultPayloadOnlyEvents
    }
  ];
  const inputFilter = '';
  const actual = filterOnPingType(inputArr, inputFilter);

  const expected = inputArr;

  expect(actual).toStrictEqual(expected);
});
