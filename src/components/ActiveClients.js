import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore';

import SearchBar from './SearchBar';
import { formatDate } from '../lib/date';
import { usePrevious } from '../lib/usePrevious';
import { searchArrayElementPropertiesForSubstring } from '../lib/searchArrayElementPropertiesForSubstring';

const q = query(collection(getFirestore(), 'clients'), orderBy('lastActive', 'desc'));

const ActiveClients = () => {
  /// state ///
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  const [search, setSearch] = useState('');
  const prevSearch = usePrevious(search);

  /// handlers ///
  const onCollectionUpdate = (querySnapshot) => {
    const normalizedClients = [];

    querySnapshot.forEach((doc) => {
      const { lastActive, debugId, geo, os, appName } = doc.data();

      normalizedClients.push({
        key: doc.id,
        appName,
        debugId,
        displayDate: formatDate(lastActive),
        geo,
        lastActive,
        os
      });
    });

    setClients(normalizedClients);
  };

  const handleSearchUpdate = useCallback(() => {
    if (clients.length) {
      const localClients = searchArrayElementPropertiesForSubstring(
        clients, // Full list of clients to search.
        search.toLowerCase().trim(), // Query trimmed and converted to lowercase.
        ['key', 'os', 'appName', 'geo'] // All client properties to search.
      );

      setFilteredClients(localClients);
    }
  }, [clients, search]);

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
  const displayClients = () => {
    if (search.length) {
      return [...filteredClients];
    } else {
      return [...clients];
    }
  };

  return (
    <div>
      <div className='container-fluid m-2'>
        <h3>Active clients ({displayClients().length})</h3>
        <SearchBar
          onInput={(input) => setSearch(input)}
          placeholder='Search'
          containerStyles={{ margin: '10px 0' }}
          inputStyles={{ width: '20%' }}
          tooltipContent='Searches by: Debug id, OS, Application, Geo'
        />
        <table className='table table-stripe table-hover'>
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
            {displayClients().map((client) => {
              const { key, debugId, displayDate, os, appName, geo } = client;
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
            {!!search.length && displayClients().length === 0 && (
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
