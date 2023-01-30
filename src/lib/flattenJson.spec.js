/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

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
