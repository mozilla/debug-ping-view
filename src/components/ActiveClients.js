import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore';

import SearchBar from './SearchBar';

import { PING_LIFETIME } from '../lib/constants';
import { formatDate } from '../lib/date';
import { usePrevious } from '../lib/usePrevious';
import { searchArrayElementPropertiesForSubstring } from '../lib/searchArrayElementPropertiesForSubstring';

const q = query(collection(getFirestore(), 'clients'), orderBy('lastActive', 'desc'));

const ActiveClients = () => {
  /// state ///
  const [debugTags, setDebugTags] = useState([]);
  const [filteredDebugTags, setFilteredDebugTags] = useState([]);

  const [search, setSearch] = useState('');
  const prevSearch = usePrevious(search);

  /// handlers ///
  const onCollectionUpdate = (querySnapshot) => {
    const normalizedDebugTags = [];

    querySnapshot.forEach((doc) => {
      const { lastActive, debugId, geo, os, appName } = doc.data();

      normalizedDebugTags.push({
        key: doc.id,
        appName,
        debugId,
        displayDate: formatDate(lastActive),
        geo,
        lastActive,
        os
      });
    });

    setDebugTags(normalizedDebugTags);
  };

  const handleSearchUpdate = useCallback(() => {
    if (debugTags.length) {
      const localDebugTags = searchArrayElementPropertiesForSubstring(
        debugTags, // Full list of debug tags to search.
        search.toLowerCase().trim(), // Query trimmed and converted to lowercase.
        ['key', 'os', 'appName', 'geo'] // All debug tag properties to search.
      );

      setFilteredDebugTags(localDebugTags);
    }
  }, [debugTags, search]);

  /// lifecycle ///
  useEffect(() => {
    const unsubscribe = onSnapshot(q, onCollectionUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (search !== prevSearch) {
      handleSearchUpdate();
    }
  }, [search, prevSearch, handleSearchUpdate]);

  /// render ///
  const displayDebugTags = () => {
    if (search.length) {
      return [...filteredDebugTags];
    } else {
      return [...debugTags];
    }
  };

  return (
    <div>
      <div className='container-fluid m-2'>
        <div>
          <h4>You can</h4>
          <ul className='mzp-u-list-styled'>
            <li>
              View all debug tags that have a ping from the last{' '}
              <strong>{PING_LIFETIME} days</strong> sorted by <strong></strong>Last Active.
            </li>
            <li>
              <strong>Search</strong> by: Debug id, OS, Application, and Geo.
            </li>
            <li>
              Click on a debug tag to see (up to) the last <strong>100 pings</strong>.
            </li>
          </ul>
        </div>
        <br />
        <h4>Active Debug Tags ({displayDebugTags().length})</h4>
        <SearchBar
          onInput={(input) => setSearch(input)}
          placeholder='Search'
          containerStyles={{ margin: '10px 0' }}
          inputStyles={{ width: '20%' }}
        />
        <table className='mzp-u-data-table'>
          <thead>
            <tr>
              <th>Debug id</th>
              <th>Last active</th>
              <th>OS</th>
              <th>Application</th>
              <th>Geo</th>
            </tr>
          </thead>
          <tbody>
            {displayDebugTags().map((debugTag) => {
              const { key, debugId, displayDate, os, appName, geo } = debugTag;
              return (
                <tr key={key}>
                  <td>
                    <Link to={`/pings/${debugId}`}>{debugId}</Link>
                  </td>
                  <td>{displayDate}</td>
                  <td>{os}</td>
                  <td>{appName}</td>
                  <td>{geo}</td>
                </tr>
              );
            })}
            {!!search.length && displayDebugTags().length === 0 && (
              <tr>
                <td>No Results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveClients;
