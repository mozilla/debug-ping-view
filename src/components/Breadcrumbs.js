/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
//import GleanMetrics from '@mozilla/glean/metrics';

import { isUuid } from '../lib/isUuid';
import { recordClick } from '../lib/telemetry';

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div style={{ marginLeft: '0.5rem', paddingLeft: 16, marginBottom: 15 }} data-glean-label='Breadcrumbs' onClick={() => {
      recordClick('Breadcrumbs');
      //GleanMetrics.recordElementClick({'label': 'Breadcrumbs'});
      }}>
      {breadcrumbs.map(({ breadcrumb, key, location, match }) => {
        // `/pings` & `/stream` are included in the routes, but they don't have
        // their own pages, so we can hide it from our breadcrumbs.
        if (breadcrumb.key === '/pings' || breadcrumb.key === '/stream') {
          return null;
        }

        let displayElement;

        // Gets the last part of the route to check what page we are on.
        const currentKey = breadcrumb.key.split('/').slice(-1)[0];

        // We need to hack what it tries to display a bit so it doesn't try
        // to turn everything into a pretty title. There are 3 scenarios
        // we need to handle: root, normal routes, UUID routes.
        if (breadcrumb.key === '/') {
          // We want to provide something to click if the user is on the root
          // route.
          displayElement = 'Home';
        } else if (isUuid(currentKey)) {
          // The last part of each individual ping page will be a UUID. If
          // we are going to display a UUID, we need to format it. By default
          // the `breadcrumb` tries to turn the UUID into a title, which makes
          // it look clunky.
          displayElement = currentKey.toLowerCase().replaceAll(' ', '-');
        } else {
          // Pulls the last part of the path to display
          displayElement = breadcrumb.key.split('/').slice(-1)[0];
        }

        // The `currentKey` is an empty string for the root route. We don't
        // want to prepend the `/` for the root since it throws off the UI.
        return (
          <React.Fragment key={key}>
            {currentKey && <span className='m-2'>/</span>}
            <Link key={key} to={breadcrumb.key}>
              <span className='breadcrumb-font'>{displayElement}</span>
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
