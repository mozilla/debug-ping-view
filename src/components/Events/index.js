import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import ReadMore from '../ReadMore';
import Timeline from './components/Timeline';

import { aggregateCountOfEventProperty } from './lib';

import './styles.css';

const Events = ({ events }) => {
  const trimmedEvents = useMemo(() => {
    // Event limit is 500, anything more than that will be truncated.
    if (events && events.length && events.length > 500) {
      return events.slice(0, 500);
    } else {
      return events;
    }
  }, [events]);

  /// render ///
  const renderKeyValueCountTable = (property) => {
    const eventCounts = aggregateCountOfEventProperty(trimmedEvents, property);

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
          Each timestamp is how long after{' '}
          <strong>
            <i>ping_info.start_time</i>
          </strong>{' '}
          that the event occurred. All timestamps are recorded in <strong>milliseconds</strong>.
        </p>
        <Timeline events={trimmedEvents} />
      </div>
    );
  };

  const renderEventTable = () => {
    return (
      <div>
        <h5>Events</h5>
        <table className='mzp-u-data-table event-table'>
          <thead>
            <tr>
              <th className='event-name'>Name</th>
              <th className='event-timestamp'>Timestamp (ms)</th>
              <th className='event-extras'>Extras</th>
            </tr>
          </thead>
          <tbody>
            {trimmedEvents.map((event, i) => {
              const { name, category, timestamp, extra } = event;
              return (
                <tr key={`${category}.${name}${i}`}>
                  <td className='event-name align-middle'>
                    {category}.{name}
                  </td>
                  <td className='event-timestamp align-middle'>{timestamp}</td>
                  <td className='event-extras align-middle'>
                    <ReadMore numberOfLines={3} text={JSON.stringify(extra)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const showTimeline = !!trimmedEvents.length && trimmedEvents.length > 1;
  const showTable = !!trimmedEvents.length;
  return (
    <div>
      <details>
        <summary>
          <h4>events</h4>
        </summary>
        {events.length > 500 && (
          <p>
            <strong>Only the first 500 events are displayed.</strong>
          </p>
        )}
        <p>
          Number of events: <strong>{trimmedEvents.length}</strong>
        </p>

        <h5>Aggregate Counts</h5>
        {renderKeyValueCountTable('name')}
        {renderKeyValueCountTable('category')}
        {showTimeline && renderTimeline()}
        {showTable && renderEventTable()}
      </details>
    </div>
  );
};

Events.propTypes = {
  events: PropTypes.array.isRequired
};

export default Events;
