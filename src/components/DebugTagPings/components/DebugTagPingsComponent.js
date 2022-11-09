import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import PayloadField from './PayloadField';
import WarningIcon from './WarningIcon';

import { formatDate } from '../../../lib/date';

const DebugTagPings = ({ debugId }) => {
  /// state ///
  const [firstSnapshot, setFirstSnapshot] = useState(true);
  const [pings, setPings] = useState([]);
  const [filteredPings, setFilteredPings] = useState([]);
  const [changeQueue, setChangeQueue] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);

  /// handlers ///
  const jsonToDataURI = (json) => {
    return 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
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
    if (firstSnapshot) {
      normalizedPings.forEach((p) => {
        p.changed = false;
      });
    }

    setFirstSnapshot(false);
    setPings(normalizedPings);

    // Queued changes have been added to local pings; queue can be cleared.
    setChangeQueue([]);
  }, [pings, changeQueue, firstSnapshot]);

  /// lifecycle ///
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

  const hasError = pings.some((ping) => ping.error);
  return (
    <div className='container-fluid m-2'>
      <h3>
        Recent pings for tag: <b>{debugId}</b> ({displayPings.length})
      </h3>
      <Filter
        pings={pings}
        handleFilter={(updatedPings) => setFilteredPings(updatedPings)}
        handleFiltersApplied={(isFilterApplied) => setFiltersApplied(isFilterApplied)}
      />
      <table className='table table-stripe table-hover'>
        <thead>
          <tr>
            <th className='received'>Received</th>
            <th className='doc-type'>Ping type</th>
            {hasError && <th className='error'>Error</th>}
            <th className='raw-json-link' />
            <th className='payload'>Payload</th>
          </tr>
        </thead>
        <tbody>
          {displayPings.map((ping) => (
            <tr key={ping.key} className={ping.changed ? 'item-highlight' : ''}>
              <td className='received'>{ping.displayDate}</td>
              <td className='doc-type'>
                {ping.pingType} <WarningIcon ping={ping} />
              </td>
              {hasError && <ErrorField ping={ping} />}
              <td className='raw-json-link'>
                <a target='_blank' rel='noopener noreferrer' href={jsonToDataURI(ping.payload)}>
                  Raw JSON
                </a>
              </td>
              <td className='text-monospace payload'>
                <PayloadField pingPayload={ping.payload} />
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
