import { getMapKeysInDescendingOrderByValue, insertOrIncrementValueInMapByKey } from './utils';

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

  // Dictionary to store ping types and counts so when we can display the
  // types in descending order of occurrence.
  let pingTypeCounts = new Map();

  pings.forEach((ping) => {
    pingTypeCounts = insertOrIncrementValueInMapByKey(pingTypeCounts, ping.pingType);
  });

  return getMapKeysInDescendingOrderByValue(pingTypeCounts);
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
