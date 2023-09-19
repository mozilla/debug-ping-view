/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import PropTypes from 'prop-types';

import Filter from './Filter';
import ErrorField from './ErrorField';
import ReadMore from '../../ReadMore';
import ReturnToTop from '../../ReturnToTop';
import WarningIcon from './WarningIcon';

import { formatDate } from '../../../lib/date';
import { recordLoad, recordClick } from '../../../lib/telemetry';

const DebugTagPings = ({ debugId }) => {
  /// state ///
  const [copySuccessKey, setCopySuccessKey] = useState(null);
  const [isFirstSnapshot, setIsFirstSnapshot] = useState(true);
  const [pings, setPings] = useState([]);
  const [filteredPings, setFilteredPings] = useState([]);
  const [changeQueue, setChangeQueue] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);

  /// handlers ///
  const jsonToDataURI = (json) => {
    return 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
  };

  // Copies the beautified JSON payload to the clipboard.
  const handleCopyPayload = (key, payload, buttonLabel) => () => {
    recordClick(buttonLabel);

    try {
      const beautifiedJson = JSON.stringify(JSON.parse(payload), undefined, 2);
      navigator.clipboard.writeText(beautifiedJson);

      setCopySuccessKey(key);
      setTimeout(() => {
        setCopySuccessKey(null);
      }, 2000);
    } catch (e) {
      console.error('Unable to copy beautified JSON.');
    }
  };

  const onCollectionUpdate = useCallback(() => {
    // Clear previously highlighted entries on query update.
    let normalizedPings = pings.map((p) => {
      p.changed = false;
      return p;
    });

    // Iterate over all changes in change queue to add and/or remove pings.
    changeQueue.forEach((change) => {
      // New doc, need to append to current array.
      if (change.type === 'added') {
        const { addedAt, payload, pingType, error, errorType, errorMessage, warning } =
          change.doc.data();

        // Add ping at the start of the array.
        normalizedPings.unshift({
          key: change.doc.id,
          addedAt,
          displayDate: formatDate(addedAt),
          payload,
          pingType,
          changed: true,
          error,
          errorType,
          errorMessage,
          warning
        });
      }

      // Doc should no longer be in our array, so we remove it.
      if (change.type === 'removed') {
        normalizedPings = normalizedPings.filter((ping) => {
          // Remove all pings with corresponding ID, should only ever be 1.
          return ping.key !== change.doc.id;
        });
      }
    });

    // Sort the pings to show the most recent first.
    normalizedPings.sort((a, b) => {
      return a.addedAt > b.addedAt ? -1 : 1;
    });

    // Clear changed flag on page load to avoid whole table blinking.
    if (isFirstSnapshot) {
      normalizedPings.forEach((p) => {
        p.changed = false;
      });
    }

    setIsFirstSnapshot(false);
    setPings(normalizedPings);

    // Queued changes have been added to local pings; queue can be cleared.
    setChangeQueue([]);
  }, [pings, changeQueue, isFirstSnapshot]);

  /// lifecycle ///
  useEffect(() => {
    // record page load event
    recordLoad('Pings');
  }, []);

  useEffect(() => {
    const pingsQuery = query(
      collection(getFirestore(), 'pings'),
      where('debugId', '==', debugId),
      orderBy('addedAt', 'desc'),
      limit(100)
    );

    // Listener for our realtime connection to the firestore collection.
    const unsubscribe = onSnapshot(pingsQuery, (querySnapshot) => {
      setChangeQueue(querySnapshot.docChanges());
    });

    return () => {
      unsubscribe();
    };
  }, [debugId]);

  useEffect(() => {
    if (changeQueue.length) {
      // Process our queued changes.
      onCollectionUpdate();
    } else {
      // Do nothing, we have no currently queued changes.
    }
  }, [changeQueue, onCollectionUpdate]);

  /// render ///
  const displayPings = useMemo(() => {
    const shouldShowFilteredPings = filteredPings.length > 0 || filtersApplied;

    if (shouldShowFilteredPings) {
      return [...filteredPings];
    } else {
      return [...pings];
    }
  }, [pings, filteredPings, filtersApplied]);

  const numberOfErrors = useMemo(() => {
    return displayPings.filter((ping) => ping.error).length;
  }, [displayPings]);

  return (
    <div className='container-fluid m-2'>
      <ReturnToTop />
      <div>
        <p className='mb-2'>
          <strong>You can</strong>
        </p>
        <ul className='mzp-u-list-styled'>
          <li>
            <strong>Search</strong> by: Ping Type, and Payload.
          </li>
          <li>
            Click on <strong>Add Filters</strong> to see all available filtering options.
          </li>
          <li>
            Click on <strong>Details</strong> to see the ping data in a more structured, beautified
            format. The link for each ping can also be shared.
          </li>
          <li>
            Click on <strong>Raw JSON</strong> to see the ping data in the Firefox JSON viewer.
          </li>
        </ul>
      </div>
      <h3 className='mb-2'>
        Recent pings for: <b>{debugId}</b> ({displayPings.length})
      </h3>
      {!!numberOfErrors && <h5>Number of errors: {numberOfErrors}</h5>}
      <Filter
        pings={pings}
        handleFilter={(updatedPings) => setFilteredPings(updatedPings)}
        handleFiltersApplied={(isFilterApplied) => setFiltersApplied(isFilterApplied)}
      />
      <table className='mzp-u-data-table'>
        <thead>
          <tr>
            <th className='received'>Received</th>
            <th className='doc-type'>Type</th>
            {!!numberOfErrors && (
              <th className='error'>
                Error <span className='font-weight-normal'>(click to expand)</span>
              </th>
            )}
            <th className='actions'>Actions</th>
            <th className='payload'>
              Payload <span className='font-weight-normal'>(click to expand)</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {displayPings.map((ping) => (
            <tr key={ping.key} className={ping.changed ? 'item-highlight' : ''}>
              <td className='received'>
                <strong>{ping.displayDate}</strong>
              </td>
              <td className='doc-type'>
                {ping.pingType} <WarningIcon ping={ping} />
              </td>
              {!!numberOfErrors && <ErrorField ping={ping} />}
              <td className='actions'>
                <Link to={`/pings/${debugId}/${ping.key}`} onClick={() => {recordClick('Details')}}>Details</Link>
                <br />
                <a target='_blank' rel='noopener noreferrer' href={jsonToDataURI(ping.payload)} onClick={() => {recordClick('Raw JSON')}}>
                  Raw JSON
                </a>
                <br />
                <button
                  className='btn btn-sm btn-outline-secondary'
                  onClick={handleCopyPayload(ping.key, ping.payload, 'Copy Payload')}
                >
                  {!!copySuccessKey && copySuccessKey === ping.key ? 'Copied!' : 'Copy Payload'}
                </button>
              </td>
              <td className='text-monospace payload'>
                <ReadMore key={ping.key} text={ping.payload} numberOfLines={3} />
              </td>
            </tr>
          ))}
          {/* If we have a search or are filtering and 0 pings, then show no results message. */}
          {filtersApplied && displayPings.length === 0 && (
            <tr>
              <td>No Results</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

DebugTagPings.propTypes = {
  debugId: PropTypes.string.isRequired
};

export { DebugTagPings };
