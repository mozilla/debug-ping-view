/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Extract all unique `pingType`s from a list of pings.
 *
 * @param {Object[]} pings Array of pings to search.
 * @returns {string[]} All unique ping types.
 */
export const aggregatePingTypes = (pings) => {
  // If there are no pings, then we can't aggregate.
  if (!pings.length) {
    return [];
  }

  const pingTypes = new Set();

  pings.forEach((ping) => {
    pingTypes.add(ping.pingType);
  });

  // Convert the Set to an array and return the values in alphabetical order.
  return Array.from(pingTypes).sort();
};

/**
 * Apply `pingType` filter to list of pings.
 *
 * @param {Object[]} pings All pings to filter.
 * @param {string} pingType The ping type we are filtering by.
 * @returns {Object[]} All pings that have the passed in `pingType`.
 */
export const filterOnPingType = (pings, pingType) => {
  // If there is no filter applied, we return all pings.
  if (!pingType) {
    return pings;
  }

  // Iterate over all pings and look for ones with matching `pingType`.
  return pings.filter((ping) => ping.pingType === pingType);
};
