/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Searches an array for a query string for all provided object properties.
 * Before searching there is an undefined check to ensure that the property
 * has a value. If any of the properties include the query, then that array
 * element will be included in the result set.
 *
 * @param {Object[]} arr The array to search.
 * @param {string} query The query string that we are looking for.
 * @param {string[]} properties Every property that should be checked for the query.
 * @returns {Object[]} Array elements with a property that includes the query.
 */
export const searchArrayElementPropertiesForSubstring = (arr, query, properties) => {
  return arr.filter((obj) => {
    for (const key of properties) {
      if (obj[key] && obj[key].toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
    }

    return false;
  });
};
