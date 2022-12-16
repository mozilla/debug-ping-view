import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import ReadMore from '../ReadMore';
import Timeline from './components/Timeline';

import { aggregateCountOfEventProperty, getEventTimestampRange } from './lib';

import './styles.css';

const Events = ({ events }) => {
  // Calculate min and max timestamps from our events array ONLY
  // when the events array changes.
  const [minValue, maxValue] = useMemo(() => {
    return getEventTimestampRange(events);
  }, [events]);

  /// state ///
  const [minSliderValue, setMinSliderValue] = useState(minValue);
  const [maxSliderValue, setMaxSliderValue] = useState(maxValue);

  /// helpers ///
  const isEventInCurrentRange = (event) => {
    const timestamp = Number(event.timestamp);
    return minSliderValue <= timestamp && timestamp <= maxSliderValue;
  };

  const getCountOfEventsInCurrentRange = () => {
    return events.filter(isEventInCurrentRange).length;
  };

  /// handlers ///
  const resetSlider = () => {
    setMinSliderValue(minValue);
    setMaxSliderValue(maxValue);
  };

  /// render ///
  const renderKeyValueCountTable = (property) => {
    const eventCounts = aggregateCountOfEventProperty(events, property);

    return (
      <table className='mzp-u-data-table'>
        <thead>
          <tr>
            <th>Event {property}</th>
            <th>Total number of events</th>
          </tr>
        </thead>
        <tbody>
          {eventCounts.map((eventData) => (
            <tr key={eventData.key}>
              <td>{eventData.key}</td>
              <td>{eventData.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderTimeline = () => {
    return (
      <div>
        <h5>Timeline</h5>
        <p>
          The timeline below displays all events in chronological order. As you move the sliders on
          the timeline, the table will display the events that occurred during the timeframe.
        </p>
        <p className='mb-2'>
          <strong>You can</strong>
        </p>
        <ul className='mzp-u-list-styled'>
          <li>
            <strong>Grab and drag</strong> the sliders on each end of the timeline to update the
            timeframe.
          </li>
          <li>
            <strong>Click a spot on the timeline</strong> and the sliders will automatically adjust.
          </li>
        </ul>
        <p style={{ textAlign: 'center' }}>
          Selected Range: <strong>{minSliderValue}</strong> - <strong>{maxSliderValue}</strong>
          <br />
          Events in current range: <strong>{getCountOfEventsInCurrentRange()}</strong>
          <br />
          <button type='button' onClick={resetSlider} className='btn btn-sm btn-outline-secondary'>
            Reset
          </button>
        </p>
        <Timeline
          events={events}
          onSliderPositionChange={(values) => {
            if (values) {
              const { min, max } = values;
              setMinSliderValue(min);
              setMaxSliderValue(max);
            }
          }}
          maxSliderValue={maxSliderValue}
          minSliderValue={minSliderValue}
          minValue={minValue}
          maxValue={maxValue}
        />
        <table className='mzp-u-data-table event-table'>
          <thead>
            <tr>
              <th className='event-name'>Name</th>
              <th className='event-category'>Category</th>
              <th className='event-timestamp'>Timestamp</th>
              <th className='event-extras'>Extras</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => {
              const { name, category, timestamp, extra } = event;

              // If the event is outside of the timeframe, we don't want to display it.
              if (!isEventInCurrentRange(event)) {
                return null;
              }

              // Event is in our current range, so we render a row in the table.
              return (
                <tr key={`${category}.${name}${i}`}>
                  <td className='event-name align-middle'>{name}</td>
                  <td className='event-category align-middle'>{category}</td>
                  <td className='event-timestamp align-middle'>{timestamp}</td>
                  <td className='event-extras align-middle'>
                    <ReadMore lines={3}>
                      <p className='cell-overflow'>{JSON.stringify(extra)}</p>
                    </ReadMore>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <details>
        <summary>
          <h4>events</h4>
        </summary>
        <p>
          Number of events: <strong>{events.length}</strong>
        </p>

        <h5>Aggregate Counts</h5>
        {renderKeyValueCountTable('name')}
        {renderKeyValueCountTable('category')}
        {!!events && !!events.length && events.length > 1 && renderTimeline()}
      </details>
    </div>
  );
};

Events.propTypes = {
  events: PropTypes.array.isRequired
};

export default Events;
