import React, { Component } from 'react';
import firebase from '../Firebase';

class ShowRawPing extends Component {

    constructor(props) {
        super(props);

        this.state = { ping: 'Loading...' };

        firebase.firestore().collection('pings')
            .doc(props.match.params.docId)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    this.setState({
                        ping: 'No such ping!'
                    })
                } else {
                    this.setState({
                        ping: JSON.stringify(JSON.parse(doc.data().payload), undefined, 4)
                    })
                }
            });
    }

    render() {
        return (
            <div className="container-fluid m-2">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">
                            Raw ping:
                        </h3>
                        <pre id="json" class="text-monospace">
                            {this.state.ping}
                        </pre>
                    </div>
                </div>
            </div>
        );

    }
}

export default ShowRawPing;