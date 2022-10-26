import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore';
import { FormatDate } from '../lib/helpers';

const q = query(collection(getFirestore(), 'clients'), orderBy('lastActive', 'desc'));

const ActiveClients = () => {
  /// state ///
  const [clients, setClients] = useState([]);

  /// handlers ///
  const onCollectionUpdate = (querySnapshot) => {
    const normalizedClients = [];

    querySnapshot.forEach((doc) => {
      const { lastActive, debugId, geo, os, appName } = doc.data();
      normalizedClients.push({
        key: doc.id,
        appName,
        debugId,
        displayDate: FormatDate(lastActive),
        geo,
        lastActive,
        os
      });
    });

    setClients(normalizedClients);
  };

  /// lifecycle ///
  useEffect(() => {
    const unsubscribe = onSnapshot(q, onCollectionUpdate);
    return () => {
      unsubscribe();
    };
  }, []);

  /// render ///
  return (
    <div>
      <div className='container-fluid m-2'>
        <h3>Active clients</h3>
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
            {clients.map((client) => {
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveClients;
