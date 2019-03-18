import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Show extends Component {

    constructor(props) {
        super(props);
        this.pings = firebase.firestore().collection('pings')
            .where('clientId', '==', props.match.params.id)
            .orderBy('addedAt', 'desc');
        this.clientId = props.match.params.id;
        this.state = {
            pings: [],
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const pings = [];
        querySnapshot.forEach((doc) => {
            const { addedAt, payload } = doc.data();
            pings.push({
                key: doc.id,
                addedAt: addedAt.toDate().toString(),
                payload: payload,
            });
        });
        this.setState({
            pings
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
                                <th>Added at</th>
                                <th>Payload</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.pings.map(ping =>
                                <tr key={ping.key}>
                                    <td>{ping.addedAt}</td>
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