/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Timeline = ({
  events,
  onSliderPositionChange,
  minValue,
  maxValue,
  minSliderValue,
  maxSliderValue
}) => {
  /// helpers ///
  // The `rc-slider` library that we are using is very specific about the format
  // of `marks`. The fork of the package that we are using is very customized
  // specifically for rendering our timeline UI. The format of the labels and
  // the timestamps is very specific, which is why we do this preprocessing.
  //
  // The goal of the preprocessing is to ensure that all event data is displayed
  // in one of the tooltips. Without this preprocessing, events are often too close
  // to one another and end up getting hidden on the timeline and you are unable to
  // find that event when hovering the data points.
  const preprocessEvents = () => {
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
          timestamp
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
            timestamp
          });
        }
      }
    });

    return preprocessedEvents;
  };

  /// handlers ///
  const handleSliderChange = (value) => {
    // Pass the changes up to the parent so we can highlight events
    // in the current frame.
    if (value && value.length) {
      const [min, max] = value;
      onSliderPositionChange({
        min,
        max
      });
    }
  };

  /// render ///
  const marks = useMemo(() => {
    let marksObj = {};

    preprocessEvents().forEach((event) => {
      const { label, timestamp } = event;

      let normalizedTimestamp;
      if (typeof timestamp === 'string' && timestamp.includes('-')) {
        // If the current label is a range, we need to take the average of those values
        // for display purposes. The positioning on the timeline is calculated as a
        // percentage of the currentValue/maxValue. Since we have to combine data so
        // all events are visible, the timeline is unnoticeably different because we
        // are actually plotting averages.
        const [start, end] = timestamp.split('-');
        normalizedTimestamp = Math.round((Number(end) + Number(start)) / 2);
      } else {
        // The timestamp is not a range, so it can be plotted as is.
        normalizedTimestamp = timestamp;
      }

      if (marksObj[normalizedTimestamp]) {
        // If we already have a mark with that timestamp
        const existingMark = marksObj[timestamp];
        marksObj[normalizedTimestamp] = {
          label: timestamp,
          hoverContent: `${existingMark.hoverContent}, ${label}`
        };
      } else {
        // There is no existing mark for the timestamp, create a new one.
        marksObj[normalizedTimestamp] = {
          label: timestamp,
          hoverContent: label
        };
      }
    });

    return marksObj;
  }, [events]);

  return (
    <div className='mb-4 ml-5 mr-5'>
      <span style={{ display: 'flex' }}>
        <p style={{ marginRight: 15, marginTop: '-4px' }}>{minValue}</p>
        <Slider
          range
          allowCross={false}
          min={minValue}
          max={maxValue}
          marks={marks}
          value={[minSliderValue, maxSliderValue]}
          defaultValue={[minValue, maxValue]}
          draggableTrack
          onChange={handleSliderChange}
        />
        <p style={{ marginLeft: 15, marginTop: '-4px' }}>{maxValue}</p>
      </span>
    </div>
  );
};

Timeline.propTypes = {
  events: PropTypes.array.isRequired,
  onSliderPositionChange: PropTypes.func,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  minSliderValue: PropTypes.number.isRequired,
  maxSliderValue: PropTypes.number.isRequired
};

export default Timeline;
