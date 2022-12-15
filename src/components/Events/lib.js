/**
 * Collect counts for event properties based on an event key (name, category, etc).
 *
 * @param {Object[]} events The events array from a ping.
 * @param {string} propertyName The property we want to aggregate counts for.
 * @returns {Object[]} Array of objects containing property as the key and
 *                     the number of occurrences as the value.
 */
export const aggregateCountOfEventProperty = (events, propertyName) => {
  if (!propertyName) {
    return [];
  }

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

/**
 * Finds the min and max values of the event timestamps.
 * @param {Object[]} events All events for the ping.
 * @returns {number[]} Two element array: min and max.
 */
export const getEventTimestampRange = (events) => {
  if (!events.length) {
    return [];
  }

  // Extract all timestamps into their own array.
  const timestamps = events.map((event) => event.timestamp);

  // Use JS built-in functions for finding min and max.
  return [Math.min(...timestamps), Math.max(...timestamps)];
};

/**
 * The rc-slider library we are using is very specific about the format
 * of marks. The fork of the package we are using is customized
 * specifically for rendering our timeline UI. The format of the labels and
 * the timestamps is very specific, which is why we do this preprocessing.
 *
 * The goal of the preprocessing is to ensure that all event data is displayed
 * in one of the tooltips. Without this preprocessing, events are often too close
 * to one another and end up getting hidden on the timeline and you are unable to
 * find that event when hovering the data points.
 *
 * @param {Object[]} events All events for a ping.
 * @param {number} maxValue The largest timestamp from all the pings.
 * @returns {Object[]} Processed array of events.
 */
export const preprocessEvents = (events, maxValue) => {
  // The check for maxValue has to be for undefined, not just `!maxValue`. JS
  // treats 0 as a falsy value, so if we did `!maxValue` on a single event array
  // and the only event timestamp was 0 it would trigger this guard clause.
  if (!events || !events.length || maxValue === undefined) {
    return [];
  }

  const preprocessedEvents = [];

  // If events are close enough together, their dots are not visible
  // on the timeline. This can be avoided by grouping events within
  // a certain timeframe of one another into a single dot on the
  // timeline, making sure that everything is visible.
  const groupingThreshold = maxValue * 0.005;

  events.forEach((event, i) => {
    const { category, name, timestamp } = event;

    const label = `${category}.${name}`;
    const arrLen = preprocessedEvents.length;
    if (i === 0) {
      // The first event always gets added.
      preprocessedEvents.push({
        label,
        timestamp: `${timestamp}`
      });
    } else {
      const { label: lastLabel, timestamp: lastTimestamp } = preprocessedEvents[arrLen - 1];

      // Checks if the last element in our array is a range.
      const isRange = typeof lastTimestamp === 'string' && lastTimestamp.includes('-');

      // Explicit use of double-equals rather than triple to deal with
      // timestamps that are already cast as numbers and onces that aren't.
      // It is more pragmatic to allow the looser check across different types
      // rather than casting and getting unexpected behavior from the different
      // formats we are using.
      /* eslint-disable-next-line eqeqeq */
      if (timestamp == lastTimestamp) {
        // When timestamps are the same, they will always overwrite one another
        // because the `marks` prop is a JS object rather than an array. To
        // avoid this behavior, we combine the labels into a single label.
        preprocessedEvents[arrLen - 1] = {
          label: `${lastLabel},${label}`,
          timestamp: `${timestamp}`
        };
      } else if (isRange) {
        // If our last event is a range, then we need to do the threshold
        // calculation based on the upper bound of the range.
        const [start, end] = lastTimestamp.split('-');

        const isNewEventInExistingRangeThreshold = timestamp - end < groupingThreshold;
        if (isNewEventInExistingRangeThreshold) {
          // The new event is within the threshold of the previous upper
          // bound. We can add this event to the group and update the
          // upper bound to the current timestamp.
          preprocessedEvents[arrLen - 1] = {
            label: `${lastLabel},${label}`,
            timestamp: `${start}-${timestamp}`
          };
        } else {
          // The new event is not within the threshold of the upper
          // bound. We can push the new event and it will have its
          // own dot on the timeline.
          preprocessedEvents.push({
            label: `${label}`,
            timestamp: `${timestamp}`
          });
        }
      } else if (timestamp - lastTimestamp < groupingThreshold) {
        // When timestamps are too close together, the marks on the timeline can't be
        // seen. To avoid this, we combine the labels into a single tooltip and show
        // the timeRange instead.
        preprocessedEvents[arrLen - 1] = {
          label: `${lastLabel},${label}`,
          timestamp: `${lastTimestamp}-${timestamp}`
        };
      } else {
        // Event doesn't fall into one of our edge cases, it can be organically appended
        // to the array.
        preprocessedEvents.push({
          label,
          timestamp: `${timestamp}`
        });
      }
    }
  });

  return preprocessedEvents;
};
