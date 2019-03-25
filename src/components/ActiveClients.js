import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../Firebase';

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
      const { lastActive, debugId, geo } = doc.data();
      clients.push({
        key: doc.id,
        lastActive: lastActive.toString(),
        debugId: debugId,
        geo: geo,
      });
    });
    this.setState({
      clients
    });
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="panel panel-default">
              <h4><Link to="/create">Add ping</Link></h4>
            <hr/>
            <div className="panel-heading">
              <h3 className="panel-title">
                Active clients
              </h3>
            </div>
            <div className="panel-body">
              <table className="table table-stripe">
                <thead>
                <tr>
                  <th>Client ID</th>
                  <th>Last active</th>
                  <th>Debug id</th>
                  <th>OS</th>
                  <th>Application</th>
                  <th>Geo</th>
                </tr>
                </thead>
                <tbody>
                {this.state.clients.map(client =>
                    <tr key={client.key}>
                      <td><Link to={`/pings/${client.key}`}>{client.key}</Link></td>
                      <td>{client.lastActive}</td>
                      <td>{client.debugId}</td>
                      <td></td>
                      <td></td>
                      <td>{client.geo}</td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ActiveClients;