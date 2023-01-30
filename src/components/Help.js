/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { PING_LIFETIME } from '../lib/constants';

const Help = () => {
  return (
    <div className='container'>
      <h3>Usage</h3>
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
      <h3>The Glean Ecosystem</h3>
      <p>
        For more information on Glean and the rest of the Glean ecosystem, please check out the
        links below.
        <ul className='mzp-u-list-styled'>
          <li>
            <a
              href='https://mozilla.github.io/glean/book/index.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              Glean Book
            </a>{' '}
            - Working with Glean
          </li>
          <li>
            <a
              href='https://dictionary.telemetry.mozilla.org/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Glean Dictionary
            </a>{' '}
            - Who is using Glean
          </li>
          <li>
            <a href='https://glam.telemetry.mozilla.org' target='_blank' rel='noopener noreferrer'>
              GLAM
            </a>{' '}
            (<strong>Gl</strong>ean <strong>A</strong>ggregated <strong>M</strong>etrics Explorer) -
            Visualizing and analyzing data you've collected with Glean
          </li>
          <li>
            <a href='https://telemetry.mozilla.org/' target='_blank' rel='noopener noreferrer'>
              telemetry.mozilla.org
            </a>{' '}
            - Resources about the Mozilla data collection
          </li>
        </ul>
      </p>
    </div>
  );
};

export default Help;
