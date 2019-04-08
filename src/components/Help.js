import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Help extends Component {
    render() {
        return (
            <div className="container">
                <h1>Usage</h1>
                <div className="alert alert-info" role="alert">
                This is a beta service. While we strive for making it available and reliable, there might be downtime periods.<br/>
                In case of any issues, find us on the Mozilla Slack in #glean.
                </div>
                <p>See <a href="https://github.com/mozilla-mobile/android-components/tree/master/components/service/glean#debugging-products-using-glean" target="_blank" rel="noopener noreferrer">Glean README</a> for instructions on tagging your pings for debugging.</p>
                <p>
                    Tagged pings should be available in under 10 seconds after sending and we'll keep them here for 3 weeks. You'll see an entry corresponding to your debug id and client id on the <Link to="/">main page</Link>.
                    Click on your debug id there to see pings submitted from your device in real time.
                </p>
            </div>
        );
    }
}

export default Help;