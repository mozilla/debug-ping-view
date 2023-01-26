/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { isUuid } from './isUuid';

test('isUuid - proper UUID is recognized', () => {
  const input = '092cc1c0-7e3c-4483-8a91-d96601acdc30';
  const actual = isUuid(input);

  const expected = true;

  expect(actual).toEqual(expected);
});

test('isUuid - non UUID string is recognized', () => {
  const input = 'asdlkfj23-23235--234234-22';
  const actual = isUuid(input);

  const expected = false;

  expect(actual).toEqual(expected);
});
