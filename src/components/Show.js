import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Show extends Component {

    constructor(props) {
        super(props);
        
        // TODO: limit size of the resultset
        this.pings = firebase.firestore().collection('pings')
            .where('clientId', '==', props.match.params.id)
            .orderBy('addedAt', 'desc');

        this.clientId = props.match.params.id;
        this.state = {
            pings: [],
            firstSnapshot: true,
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        // Clear previously highlighted entries on query update
        const pings = this.state.pings.map(p => {
            p.changed = false;
            return p;
        });
        
        querySnapshot.docChanges().forEach((change)=>{
            if (change.type === "added") {
                const { addedAt, payload, pingType } = change.doc.data();
                pings.unshift({
                    key: change.doc.id,
                    addedAt: addedAt.toString(),
                    payload: payload,
                    pingType: pingType,
                    changed: true,
                });
            }
            if (change.type === "removed") {
                // TODO: remove element by id
                pings.pop();
            }
        });

        pings.sort((a,b)=>{
            return (a.addedAt > b.addedAt) ? -1 : 1;
        });

        // Clear changed flag on page load to avoid whole table blinking
        if (this.state.firstSnapshot) {
            pings.forEach(p => {
                p.changed = false;
            });
        }
        
        this.setState({
            pings: pings,
            firstSnapshot: false,
        });
    };

    componentDidMount() {
        this.unsubscribe = this.pings.onSnapshot(this.onCollectionUpdate);
    }

    render() {
        return (
            <div className="container">
                <h4><Link to="/">Client list</Link></h4>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">
                            Recent pings for client {this.clientId}
                        </h3>
                    </div>
                    <div className="panel-body">
                        <table className="table table-stripe">
                            <thead>
                            <tr>
                                <th>Received</th>
                                <th>Ping type</th>
                                <th>Payload</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.pings.map(ping =>
                                <tr key={ping.key} className={ping.changed ? 'item-highlight' : ''}>
                                    <td>{ping.addedAt}</td>
                                    <td>{ping.pingType}</td>
                                    <td>{ping.payload}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

    }
}

export default Show;