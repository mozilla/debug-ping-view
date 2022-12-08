import React from 'react';
import PropTypes from 'prop-types';

import ReadMore from '../DebugTagPings/components/ReadMore';

import { aggregateCountOfEventProperty } from './lib';

import './styles.css';

const Events = ({ events }) => {
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

        <h5>All events</h5>
        <p>The events are in chronological order.</p>
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
              return (
                <tr key={`${category}.${name}${i}`}>
                  <td className='event-name'>{name}</td>
                  <td className='event-category'>{category}</td>
                  <td className='event-timestamp'>{timestamp}</td>
                  <td className='event-extras'>
                    <ReadMore lines={3}>
                      <p className='cell-overflow'>{JSON.stringify(extra)}</p>
                    </ReadMore>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    </div>
  );
};

Events.propTypes = {
  events: PropTypes.array.isRequired
};

export default Events;
