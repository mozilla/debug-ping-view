import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../Firebase';
import { FormatDate } from './helpers';

class ActiveClients extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('clients').orderBy('lastActive', 'desc');
    this.unsubscribe = null;
    this.state = {
      clients: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const clients = [];
    querySnapshot.forEach((doc) => {
      const { lastActive, clientId, debugId, geo, os, appName } = doc.data();
      clients.push({
        key: doc.id,
        appName: appName,
        clientId: clientId,
        debugId: debugId,
        displayDate: FormatDate(lastActive),
        geo: geo,
        lastActive: lastActive,
        os: os,
      });
    });
    this.setState({
      clients
    });
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div>
        <div className="container-fluid m-2">
          <h3>
            Active clients
          </h3>
          <table className="table table-stripe table-hover">
            <thead>
              <tr>
                <th>Debug id</th>
                <th>Last active</th>
                <th>OS</th>
                <th>Application</th>
                <th>Geo</th>
                <th>Client ID</th>
              </tr>
            </thead>
            <tbody>
              {this.state.clients.map(client =>
                <tr key={client.key}>
                  <td><Link to={`/pings/${client.clientId}/${client.debugId}`}>{client.debugId}</Link></td>
                  <td>{client.displayDate}</td>
                  <td>{client.os}</td>
                  <td>{client.appName}</td>
                  <td>{client.geo}</td>
                  <td>{client.clientId}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ActiveClients;