/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore';

import ReturnToTop from './ReturnToTop';
import SearchBar from './SearchBar';

import { PING_LIFETIME } from '../lib/constants';
import { formatDate } from '../lib/date';
import { usePrevious } from '../lib/usePrevious';
import { searchArrayElementPropertiesForSubstring } from '../lib/searchArrayElementPropertiesForSubstring';
import { recordClick } from '../lib/telemetry';

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
      <ReturnToTop />
      <div className='container-fluid m-2'>
        <div>
          <p className='mb-2'>
            <strong>You can</strong>
          </p>
          <ul className='mzp-u-list-styled'>
            <li>
              View all debug tags that have a ping from the last{' '}
              <strong>{PING_LIFETIME} days</strong> sorted by <strong></strong>Last Active.
            </li>
            <li>
              <strong>Search</strong> by: Debug id, OS, Application, and Geo.
            </li>
            <li>
              Click on <strong>Pings</strong> to see (up to) the last 100 pings for a Debug Tag.
            </li>
            <li>
              Click on <strong>Event Stream</strong> to see an aggregated timeline for all events in the 
              last 100 pings for a Debug Tag.
            </li>
          </ul>
        </div>
        <h3>Active Debug Tags ({displayDebugTags().length})</h3>
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
              <th>Views</th>
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
                  <td>{debugId}</td>
                  <td>
                    <Link
                      className='text-decoration-none'
                      to={`/pings/${debugId}`}
                      onClick={() => {
                        recordClick("Debug ID Pings");
                      }}
                    >
                      Pings
                    </Link>
                    <br />
                    <Link className='text-decoration-none' to={`/stream/${debugId}`} onClick={() => {
                      recordClick("Debug ID Event Stream")
                    }}>
                      Event Stream
                    </Link>
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
