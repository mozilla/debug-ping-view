/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import ReadMore from '../ReadMore';
import Timeline from './components/Timeline';
import Dropdown from '../Dropdown';

import { aggregateCountOfEventProperty } from './lib';

import './styles.css';

const filterValues = [
  "Last 15 minutes",
  "Last 30 minutes",
  "Last 1 hour",
  "Last 3 hours",
  "Last 6 hours",
  "Last 12 hours",
  "Last 1 day",
  "Last 7 days",
  "Last 21 days"
];

const Events = ({ events, header, isEventStream }) => {
  const listRefs = useRef([]);

  /// state ///
  const [filterValue, setFilterValue] = useState("");
  const [lastFilterHadNoEvents, setLastFilterHadNoEvents] = useState(undefined);
  const [scrollingKey, setScrollingKey] = useState("");

  /// helpers ///
  const filterEvents = (eventsToFilter, filterDate) => {
    return eventsToFilter.filter((event) => event.timestamp > filterDate.getTime()) || [];
  };

  const trimmedEvents = useMemo(() => {
    let normalizedEvents;

    // Event limit is 500, anything more than that will be truncated.
    if (events && events.length && events.length > 500) {
      normalizedEvents = events.slice(0, 500);
    } else {
      normalizedEvents = events;
    }

    // Filter out events based on timeline filter.
    if (!!filterValue) {
      const filterDate = new Date();

      switch (filterValue) {
        case "Last 15 minutes":
          filterDate.setMinutes(filterDate.getMinutes() - 15);
          break;
        case "Last 30 minutes":
          filterDate.setMinutes(filterDate.getMinutes() - 30);
          break;
        case "Last 1 hour":
          filterDate.setHours(filterDate.getHours() - 1);
          break;
        case "Last 3 hours":
          filterDate.setHours(filterDate.getHours() - 3);
          break;
        case "Last 6 hours":
          filterDate.setHours(filterDate.getHours() - 6);
          break;
        case "Last 12 hours":
          filterDate.setHours(filterDate.getHours() - 12);
          break;
        case "Last 1 day":
          filterDate.setDate(filterDate.getDate() - 1);
          break;
        case "Last 7 days":
          filterDate.setDate(filterDate.getDate() - 7);
          break;
        case "Last 21 days":
          filterDate.setDate(filterDate.getDate() - 21);
          break;
        default:
          break;
      }

      const filteredEvents = filterEvents(normalizedEvents, filterDate);
      if (filteredEvents.length === 0) {
        // No events for the filter, show an error message and continue to show
        // all events.
        setLastFilterHadNoEvents(true);
      } else {
        // The filter has events, so we show those events.
        normalizedEvents = filteredEvents;
        setLastFilterHadNoEvents(false);
      }
    }

    return normalizedEvents;
  }, [events, filterValue]);

  useEffect(() => {
    listRefs.current = listRefs.current.slice(0, trimmedEvents.length);
 }, [trimmedEvents]);

  const plotClickHandler = (eventName, timestamp) => {
    const eventIndex = trimmedEvents.findIndex((event) => {
      return `${event.category}.${event.name}` === eventName && event.timestamp === timestamp;
    });

    listRefs.current[eventIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // Triggers highlighting the event row that was just selected.
    setScrollingKey(`${eventName}.${timestamp}`);

    // After 1 second, we want to unset the key. The animation timing is
    // handled from the CSS, so this is just to make sure that later when
    // an event is clicked that a previous key isn't already set.
    setTimeout(() => {
      setScrollingKey("");
    }, 1000);
  };

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
        {!isEventStream && <p>
          Each timestamp is how long after{' '}
          <strong>
            <i>ping_info.start_time</i>
          </strong>{' '}
          that the event occurred. All timestamps are recorded in <strong>milliseconds</strong>.
        </p>}
        {isEventStream && renderTimelineFilter()}
        {lastFilterHadNoEvents && !!filterValue && <p>Your current selection has no events, showing all events.</p>}
        <Timeline events={trimmedEvents} plotClickHandler={plotClickHandler} />
      </div>
    );
  };

  const renderTimelineFilter = () => {
    return (
      <Dropdown
        defaultValue='Time range'
        state={filterValue}
        setState={setFilterValue}
        values={filterValues}
      />
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
              <th className='event-extras'>
                Extras <span className='font-weight-normal'>(click to expand)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {trimmedEvents.map((event, i) => {
              const { name, category, timestamp, extra } = event;
              return (
                <tr
                  key={`${category}.${name}${i}`}
                  ref={el => listRefs.current[i] = el}
                  className={scrollingKey === `${category}.${name}.${timestamp}` && 'item-highlight'}>
                  <td className='event-name align-middle'>
                    {category}.{name}
                  </td>
                  <td className='event-timestamp align-middle'>{timestamp}</td>
                  <td className='event-extras align-middle'>
                    {!!extra && <ReadMore numberOfLines={1} text={JSON.stringify(extra)} />}
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
      <h4>{header || "events"}</h4>
      {events.length > 500 && (
        <p>
          <strong>Only the first 500 events are displayed.</strong>
        </p>
      )}
      <p>
        Number of events: <strong>{trimmedEvents.length}</strong>
      </p>
      {showTimeline && renderTimeline()}
      <h5>Aggregate Counts</h5>
      {renderKeyValueCountTable('name')}
      {renderKeyValueCountTable('category')}
      {showTable && renderEventTable()}
    </div>
  );
};

Events.propTypes = {
  events: PropTypes.array.isRequired
};

export default Events;
