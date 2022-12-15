/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { preprocessEvents } from '../lib';

const Timeline = ({
  events,
  onSliderPositionChange,
  minValue,
  maxValue,
  minSliderValue,
  maxSliderValue
}) => {
  const marks = useMemo(() => {
    let marksObj = {};

    preprocessEvents(events, maxValue).forEach((event) => {
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
          label: `${timestamp}`,
          hoverContent: `${existingMark.hoverContent}, ${label}`
        };
      } else {
        // There is no existing mark for the timestamp, create a new one.
        marksObj[normalizedTimestamp] = {
          label: `${timestamp}`,
          hoverContent: label
        };
      }
    });

    return marksObj;
  }, [events]);

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
