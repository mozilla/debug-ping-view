/**
 * Collect counts for event properties based on an event key (name, category, etc).
 *
 * @param {Object[]} events The events array from a ping.
 * @param {string} propertyName The property we want to aggregate counts for.
 * @returns {Object[]} Array of objects containing property as the key and
 *                     the number of occurrences as the value.
 */
export const aggregateCountOfEventProperty = (events, propertyName) => {
  const eventMap = new Map();

  events.forEach((event) => {
    let property = event[propertyName];

    // Prepend the event category to an event name for context.
    if (propertyName === 'name') {
      property = `${event.category}.${property}`;
    }

    if (eventMap.has(property)) {
      const previousValue = eventMap.get(property);
      eventMap.set(property, previousValue + 1);
    } else {
      eventMap.set(property, 1);
    }
  });

  return Array.from(eventMap, ([key, value]) => ({ key, value }));
};
