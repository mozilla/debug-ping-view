import React from 'react';
import { Link } from 'react-router-dom';

import { PING_LIFETIME } from '../lib/constants';

const Help = () => {
  return (
    <div className='container'>
      <h4>Usage</h4>
      <div className='alert alert-info' role='alert'>
        This is a beta service. While we strive for making it available and reliable, there might be
        downtime periods.
        <br />
        In case of any issues, find us on the Mozilla Slack in #glean.
      </div>
      <p>
        See{' '}
        <a
          href='https://mozilla.github.io/glean/book/reference/debug/debugViewTag.html'
          target='_blank'
          rel='noopener noreferrer'
        >
          Debug View Tags
        </a>{' '}
        for instructions on tagging your pings for debugging.
      </p>
      <p>
        Tagged pings should be available in under 10 seconds after sending and they are stored for{' '}
        {PING_LIFETIME} days. You'll see an entry corresponding to your debug id and client id on
        the <Link to='/'>main page</Link>. Click on your debug id there to see pings submitted from
        your device in real time.
      </p>
    </div>
  );
};

export default Help;
