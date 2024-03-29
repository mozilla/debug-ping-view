/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Filters all keys of an object into two arrays:
 *   1. `nestedKeys` - Keys that have complex objects as their value.
 *   2. `nonNestedKeys` - Keys that have primitive types as their value.
 *
 * The two arrays are returned in a custom object.
 *
 * @param {Object} obj Any javascript object.
 * @returns {{ nestedKeys: string[], nonNestedKeys: string[] }} A custom object
 *          containing arrays for `nested` and `nonNested` keys.
 */
export const getNestedAndNonNestedKeysFromObject = (obj) => {
  let nestedKeys = [];
  let nonNestedKeys = [];

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === 'object') {
      nestedKeys.push(key);
    } else {
      nonNestedKeys.push(key);
    }
  });

  return {
    nestedKeys,
    nonNestedKeys
  };
};

/**
 * Pad a string to a specified length with a specified character.
 * 
 * @param {string} s The original string.
 * @param {number} desiredStringLength How long the string should be after padding.
 * @param {string} padChar The character to pad the string with.
 * @returns The original string padded with the specified character.
 */
export const padStringLeft = (s, desiredStringLength, padChar) => {
  const sLength = s.length;

  if (sLength === desiredStringLength) {
    return s;
  }

  let outputStr = s;
  while (outputStr.length < desiredStringLength) {
    outputStr = padChar + outputStr;
  }

  return outputStr;
}
