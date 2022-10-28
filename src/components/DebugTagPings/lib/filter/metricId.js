import { getMapKeysInDescendingOrderByValue, insertOrIncrementValueInMapByKey } from './utils';

/**
 * Extract all unique metric IDs from a list of pings.
 *
 * @param {Object[]} pings Array of pings to search.
 * @returns {string[]} All unique metric IDs from the array of pings.
 */
export const aggregateMetricIds = (pings) => {
  // If there are no pings, then we can't aggregate.
  if (!pings.length) {
    return [];
  }

  // Create an array of just the ping payloads that we will parse.
  const payloads = pings.map((ping) => ping.payload);

  // Dictionary to store metric IDs and counts so when we can display the
  // IDs in descending order of occurrence.
  let metricIdCounts = new Map();

  payloads.forEach((payload) => {
    try {
      const payloadObj = JSON.parse(payload);
      if (payloadObj && payloadObj.metrics) {
        const metrics = payloadObj.metrics;

        // Iterate over all keys of `metrics`, which are Glean metric types.
        // These will always have consistent naming.
        Object.keys(metrics).forEach((metricType) => {
          // Iterate over all keys of a metric type. Each child key of
          // the metric type is a metric ID.
          Object.keys(metrics[metricType]).forEach((metricId) => {
            metricIdCounts = insertOrIncrementValueInMapByKey(metricIdCounts, metricId);
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
  });

  return getMapKeysInDescendingOrderByValue(metricIdCounts);
};

/**
 * Apply `metricId` filter to list of pings.
 *
 * @param {Object[]} pings All pings to filter.
 * @param {string} metricId The metric ID we are filtering by.
 * @returns {Object[]} All ping payloads that include the `metricId`.
 */
export const filterOnMetricId = (pings, metricId) => {
  // If there is no filter applied, we return all pings.
  if (!metricId) {
    return pings;
  }

  // Iterate over all pings and look for ones that include the `metricId`.
  return pings.filter((ping) => {
    try {
      const payloadObj = JSON.parse(ping.payload);
      if (payloadObj && payloadObj.metrics) {
        const metrics = payloadObj.metrics;

        // Iterate over the metrics and see if the ping contains the
        // `metricId` we are looking for.
        return Object.keys(metrics).some((metricType) => {
          // Iterate over all keys of a metric type. Each child key of
          // the metric type is a metric ID.
          return Object.keys(metrics[metricType]).some((metricKey) => metricKey === metricId);
        });
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  });
};
