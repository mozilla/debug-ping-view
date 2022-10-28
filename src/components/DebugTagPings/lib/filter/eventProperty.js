import { getMapKeysInDescendingOrderByValue, insertOrIncrementValueInMapByKey } from './utils';

/**
 * Extract all property values from a set of pings. The two current use
 * cases are `{event}.name` and `{event}.category`.
 *
 * @param {Object[]} pings Array of pings to search.
 * @param {string} property The property we are aggregating: name, category, etc.
 * @returns {string[]} All unique keys for that property.
 */
export const aggregateEventPropertyValues = (pings, property) => {
  // If there are no pings, then we can't aggregate.
  if (!pings.length) {
    return [];
  }

  // Create an array of just the ping payloads that we will parse.
  const payloads = pings.map((ping) => ping.payload);

  // Dictionary to store event property values and counts so when we can display the
  // values in descending order of occurrence.
  let eventPropertyCounts = new Map();

  payloads.forEach((payload) => {
    try {
      const payloadObj = JSON.parse(payload);
      if (payloadObj && payloadObj.events && payloadObj.events.length) {
        const events = payloadObj.events;

        // Iterate over all events and extract the property from each.
        events.forEach((event) => {
          eventPropertyCounts = insertOrIncrementValueInMapByKey(
            eventPropertyCounts,
            event[property]
          );
        });
      }
    } catch (e) {
      console.error(e);
    }
  });

  return getMapKeysInDescendingOrderByValue(eventPropertyCounts);
};

/**
 * Apply filtering for an event property.
 *
 * Example:
 * Function accepts the following arguments
 * - pings (all pings)
 * - filterValue ('page_loaded')
 * - keyName ('name')
 *
 * We will find all events that have the event `name` of `page_loaded` and
 * return those.
 *
 * @param {Object[]} pings All pings to filter.
 * @param {string} filterValue The current value we are looking for.
 * @param {string} keyName The name of the event key (name | category).
 * @returns {Object[]} All pings that match the above criteria.
 */
export const filterOnEventProperty = (pings, filterValue, property) => {
  // If there is no filter applied, we return all pings.
  if (!filterValue) {
    return pings;
  }

  // Iterate over all pings and look for ones that include the property value.
  return pings.filter((ping) => {
    try {
      const payloadObj = JSON.parse(ping.payload);
      if (payloadObj && payloadObj.events && payloadObj.events.length) {
        const events = payloadObj.events;

        // Iterate over the events and see if any individual events
        // contain the value for the specific property we are looking for.
        return events.some((event) => event[property] === filterValue);
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  });
};
