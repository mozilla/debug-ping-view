import React, { useCallback, useEffect, useState } from 'react';
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

import SearchBar from '../../SearchBar';
import ErrorField from './ErrorField';
import PayloadField from './PayloadField';
import WarningIcon from './WarningIcon';

import { FormatDate } from '../../../lib/helpers';
import { searchArrayPropertiesForSubstring } from '../../../lib/search';
import { usePrevious } from '../../../lib/usePrevious';

const DebugTagPings = ({ debugId }) => {
  /// state ///
  const [firstSnapshot, setFirstSnapshot] = useState(true);
  const [pings, setPings] = useState([]);
  const [filteredPings, setFilteredPings] = useState([]);
  const [changeQueue, setChangeQueue] = useState([]);

  const [search, setSearch] = useState('');
  const prevSearch = usePrevious(search);

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

    changeQueue.forEach((change) => {
      // New doc, need to append to current array.
      if (change.type === 'added') {
        const { addedAt, payload, pingType, error, errorType, errorMessage, warning } =
          change.doc.data();
        normalizedPings.unshift({
          key: change.doc.id,
          addedAt,
          displayDate: FormatDate(addedAt),
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
          return ping.key !== change.doc.id;
        });
      }
    });

    // Sort pings to show the most recent first.
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
    setChangeQueue([]);
  }, [pings, changeQueue, firstSnapshot]);

  const handleSearchUpdate = useCallback(() => {
    if (pings.length) {
      const localPings = searchArrayPropertiesForSubstring(
        pings, // Full list of pings to check.
        search.toLowerCase().trim(), // Search query converted to lowercase.
        ['pingType', 'payload'] // All properties to check for search.
      );
      setFilteredPings(localPings);
    }
  }, [pings, search]);

  /// lifecycle ///
  useEffect(() => {
    const pingsQuery = query(
      collection(getFirestore(), 'pings'),
      where('debugId', '==', debugId),
      orderBy('addedAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(pingsQuery, (querySnapshot) => {
      setChangeQueue(querySnapshot.docChanges());
    });

    return () => {
      unsubscribe();
    };
  }, [debugId]);

  useEffect(() => {
    if (changeQueue.length) {
      onCollectionUpdate();
    } else {
      // Do nothing, we have no currently queued changes.
    }
  }, [changeQueue, onCollectionUpdate]);

  useEffect(() => {
    if (search !== prevSearch) {
      handleSearchUpdate();
    }
  }, [search, prevSearch, handleSearchUpdate]);

  /// render ///
  const displayPings = () => {
    if (search.length) {
      return [...filteredPings];
    } else {
      return [...pings];
    }
  };

  const hasError = pings.some((ping) => ping.error);
  return (
    <div className='container-fluid m-2'>
      <h3>
        Recent pings for tag: <b>{debugId}</b> ({displayPings().length})
      </h3>
      <SearchBar
        onInput={(input) => setSearch(input)}
        placeholder='Search'
        containerStyles={{ margin: '10px 0' }}
        inputStyles={{ width: '20%' }}
        debounceTime={500}
        tooltipContent='Searches by: Ping type, Payload'
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
          {displayPings().map((ping) => (
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
          {!!search.length && displayPings().length === 0 && (
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
