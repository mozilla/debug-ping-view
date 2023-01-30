/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Extract all unique metric types from a list of pings.
 *
 * @param {Object[]} pings Array of pings to search.
 * @returns {string[]} All unique metric types from the array of pings.
 */
export const aggregateMetricTypes = (pings) => {
  // If there are no pings, then we can't aggregate.
  if (!pings.length) {
    return [];
  }

  // Create an array of just the ping payloads that we will parse.
  const payloads = pings.map((ping) => ping.payload);

  const metricTypes = new Set();
  payloads.forEach((payload) => {
    try {
      const payloadObj = JSON.parse(payload);

      // Extract all metrics.
      if (payloadObj.metrics) {
        const metrics = payloadObj.metrics;

        // Iterate over all keys of `metrics`, which are our
        // Glean metric types. These will always have consistent naming.
        Object.keys(metrics).forEach((metricType) => {
          metricTypes.add(metricType);
        });
      }

      // If a payload contains `events`, then add the `event` metric to our Set.
      if (payloadObj.events && payloadObj.events.length > 0) {
        metricTypes.add('event');
      }
    } catch (e) {
      console.error(e);
    }
  });

  // Convert the Set to an array and return the values in alphabetical order.
  return Array.from(metricTypes).sort();
};

/**
 * Apply `metricType` filter to list of pings.
 *
 * @param {Object[]} pings All pings to filter.
 * @param {string} metricType The metric type we are filtering by.
 * @returns {Object[]} All pings that have the passed in `metricType`.
 */
export const filterOnMetricType = (pings, metricType) => {
  // If there is no filter applied, we return all pings.
  if (!metricType) {
    return pings;
  }

  // Iterate over all pings and look for ones that include the `metricType`.
  return pings.filter((ping) => {
    try {
      const payloadObj = JSON.parse(ping.payload);

      // If the `metricType` is `event` and ping has `events`, then we display it.
      if (metricType === 'event' && payloadObj.events && payloadObj.events.length > 0) {
        return true;
      }

      // Look for pings with a matching `metricType`.
      if (payloadObj.metrics) {
        const metrics = payloadObj.metrics;

        // Iterate over the metrics and see if the ping contains the
        // `metricType` we are looking for.
        return Object.keys(metrics).some((metric) => metric === metricType);
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  });
};
