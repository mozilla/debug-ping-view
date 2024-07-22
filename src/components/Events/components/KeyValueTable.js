/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Display event names and counts in a structured table. Optionally, checkboxes
 * are hooked up to handlers to allow for event filtering.
 */
const KeyValueTable = ({ property, eventCounts, onRowClick, disabledEvents }) => {
  const showCheckboxes = eventCounts.length > 1 && !!onRowClick;
  return (
    <table className='mzp-u-data-table'>
      <thead>
        <tr>
          <th>Event {property}</th>
          <th>Total number of events</th>
        </tr>
      </thead>
      <tbody>
        {eventCounts.map((eventData) => {
          let checkboxEnabled;
          if (showCheckboxes) {
            checkboxEnabled = disabledEvents[eventData.key] === undefined;
          }

          return (
            <tr key={eventData.key}>
              <td>
                {showCheckboxes && (
                  <input
                    type='checkbox'
                    checked={checkboxEnabled}
                    onChange={!!onRowClick ? () => onRowClick(eventData.key) : undefined}
                    style={{ marginRight: 4 }}
                  />
                )}
                {eventData.key}
              </td>
              <td>{eventData.value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

KeyValueTable.propTypes = {
  property: PropTypes.string.isRequired,
  eventCounts: PropTypes.arrayOf(PropTypes.object).isRequired,

  // Show/hide events
  onRowClick: PropTypes.func,
  disabledEvents: PropTypes.object,
  compareFunc: PropTypes.func
};

export default KeyValueTable;
