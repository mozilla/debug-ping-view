import React, { Component } from 'react';
import firebase from '../Firebase';
import { FormatDate, TruncateString } from './helpers';

function ErrorField(ping) {
    if (!ping.error) {
        return <td></td>
    }

    // list of common errors - each entry is a tuple containing error string and user-friendly message
    const commonErrors = [
        ["com.mozilla.telemetry.schemas.SchemaNotFoundException: ",
            "Unknown ping type",
            "Unknown ping type - this is expected if you're developing a new ping or using local build with unregistered application id. Reach out to the telemetry team if you need help in setting up new schema."],
        ["com.mozilla.telemetry.ingestion.core.schema.SchemaNotFoundException",
            "Unknown ping type",
            "Unknown ping type - this is expected if you're developing a new ping or using local build with unregistered application id. Reach out to the telemetry team if you need help in setting up new schema."],
    ];
    const commonErrorTypes = [
        ["JSON_VALIDATION_ERROR_DEBUG_VIEW",
            "This ping did not pass validation during ingestion (this is normal if you're using custom developer build). Validation against Glean schema was attempted in Debug Viewer, but failed with error too:"
        ],
    ];

    let errorTooltip = ping.errorType + ' ' + ping.errorMessage;
    let errorText = TruncateString(ping.errorMessage, 30);

    const matchingCommonError = commonErrors.find((e) => {
        return ping.errorMessage.startsWith(e[0]);
    });
    if (matchingCommonError) {
        errorText = matchingCommonError[1];
        errorTooltip = matchingCommonError[2] + '\n\n' + errorTooltip;
    }
    const matchingCommonErrorType = commonErrorTypes.find((et) => {
        return ping.errorType === et[0];
    });
    if (matchingCommonErrorType) {
        errorTooltip = matchingCommonErrorType[1] + '\n\n' + ping.errorMessage;
    }

    return <td className='text-danger text-monospace' data-toggle="tooltip" data-placement="top" title={errorTooltip}>{errorText}&hellip;</td>;
}

function WarningIcon(ping) {
    if (ping.warning) {
        const commonWarnings = [
            ["JSON_VALIDATION_IN_DEBUG_VIEW",
                "This ping did not pass validation during ingestion (this is normal if you're using custom developer build), but was correctly validated against Glean schema in Debug Viewer.",
            ],
        ];

        const matchingCommonWarning = commonWarnings.find((e) => {
            return ping.warning === e[0];
        });

        const tooltip = matchingCommonWarning ? matchingCommonWarning[1] : ping.warning;
        return <i className="fa fa-info-circle" data-toggle="tooltip" data-placement="top" title={tooltip}/>;
    }
}

class Show extends Component {

    constructor(props) {
        super(props);

        // TODO: paginate through the full resultset
        this.pings = firebase.firestore().collection('pings')
            .where('debugId', '==', props.match.params.debugId)
            .orderBy('addedAt', 'desc')
            .limit(100);

        this.debugId = props.match.params.debugId;
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

        querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const { addedAt, payload, pingType, error, errorType, errorMessage, warning } = change.doc.data();
                pings.unshift({
                    key: change.doc.id,
                    addedAt: addedAt,
                    displayDate: FormatDate(addedAt),
                    payload: payload,
                    pingType: pingType,
                    changed: true,
                    error: error,
                    errorType: errorType,
                    errorMessage: errorMessage,
                    warning: warning,
                });
            }
            if (change.type === "removed") {
                // TODO: remove element by id
                pings.pop();
            }
        });

        pings.sort((a, b) => {
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

    componentWillUnmount() {
        this.unsubscribe();
    }

    jsonToDataURI(json) {
        return "data:application/json;charset=utf-8," + encodeURIComponent(json);
    }

    render() {
        const hasError = this.state.pings.some(ping => ping.error);

        return (
            <div className="container-fluid m-2">
                <h3>
                    Recent pings for tag: <b>{this.debugId}</b>
                </h3>
                <table className="table table-stripe table-hover">
                    <thead>
                        <tr>
                            <th>Received</th>
                            <th>Ping type</th>
                            <th></th>
                            {hasError && <th>Error</th>}
                            <th>Payload</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.pings.map(ping =>
                            <tr key={ping.key} className={ping.changed ? 'item-highlight' : ''}>
                                <td>{ping.displayDate}</td>
                                <td>{ping.pingType} {WarningIcon(ping)}</td>
                                <td><a target="_blank" rel="noopener noreferrer" href={this.jsonToDataURI(ping.payload)}>Raw JSON</a></td>
                                {hasError && ErrorField(ping)}
                                <td className='text-monospace'>{TruncateString(ping.payload, 150)}&hellip;</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );

    }
}

export default Show;
