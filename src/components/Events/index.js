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
import KeyValueTable from './components/KeyValueTable';

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
  const [eventNamesToFilter, setEventNamesToFilter] = useState({});

  /// helpers ///
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

      const filteredEvents = normalizedEvents.filter(
        (event) => event.timestamp > filterDate.getTime()
      )|| [];

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

  const eventNameClickHandler = (eventName) => {
    let newEventNamesToFilter = eventNamesToFilter;
    if (newEventNamesToFilter[eventName]) {
      delete newEventNamesToFilter[eventName];
    } else {
      newEventNamesToFilter[eventName] = true;
    };
    setEventNamesToFilter({ ...newEventNamesToFilter } || {});
  };

  /// render ///
  const renderTimeline = () => {
    let timelineEvents = [...trimmedEvents];

    // Filter out events based on event name checkboxes.
    if (Object.keys(eventNamesToFilter).length > 0) {
      timelineEvents = timelineEvents.filter(
        (event) => eventNamesToFilter[`${event.category}.${event.name}`] === undefined
      );
    }

    if (timelineEvents.length === 0) {
      return <p><strong>No events to show.</strong></p>
    }

    return (
      <div>
        <h5>Timeline</h5>
        <p>
          Number of events: <strong>{timelineEvents.length}</strong>
        </p>
        {!isEventStream && <p>
          Each timestamp is how long after{' '}
          <strong>
            <i>ping_info.start_time</i>
          </strong>{' '}
          that the event occurred. All timestamps are recorded in <strong>milliseconds</strong>.
        </p>}
        {isEventStream && renderTimelineFilter()}
        {lastFilterHadNoEvents && !!filterValue && <p>Your current selection has no events, showing all events.</p>}
        <Timeline events={[...timelineEvents]} plotClickHandler={plotClickHandler} />
      </div>
    );
  };

  const renderTimelineFilter = () => {
    return (
      <Dropdown
        name='timeRange'
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

              const fullEventName = `${category}.${name}`;
              const disabled = eventNamesToFilter[fullEventName];
              return (
                <tr
                  key={`${fullEventName}${i}`}
                  ref={el => listRefs.current[i] = el}
                  className={scrollingKey === `${category}.${name}.${timestamp}` ? 'item-highlight': ''}
                  style={disabled ? { opacity: 0.5 } : {}}
                >
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

  return (
    <div>
      <h4>{header || "events"}</h4>
      {events.length > 500 && (
        <p>
          <strong>Only the first 500 events are displayed.</strong>
        </p>
      )}
      {!!trimmedEvents.length && trimmedEvents.length > 1 && renderTimeline()}
      <h5>Aggregate Counts</h5>
      <p>Show/hide events from the timeline by clicking on the checkboxes.</p>
      {!!Object.keys(eventNamesToFilter).length && (
        <button
          type='button'
          data-glean-label='Show all events'
          onClick={() => setEventNamesToFilter({})}
          className='btn btn-sm btn-outline-secondary'
          style={{ marginBottom: 15, marginTop: -10 }}
        >
          Show all events
        </button>
      )}
      <KeyValueTable
        property='name'
        eventCounts={aggregateCountOfEventProperty(trimmedEvents, "name")}
        onRowClick={eventNameClickHandler}
        disabledEvents={eventNamesToFilter}
      />
      <KeyValueTable
        property='category'
        eventCounts={aggregateCountOfEventProperty(trimmedEvents, "category")}
      />
      {!!trimmedEvents.length && renderEventTable()}
    </div>
  );
};

Events.propTypes = {
  events: PropTypes.array.isRequired
};

export default Events;
