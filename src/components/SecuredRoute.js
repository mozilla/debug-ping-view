/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { updateTelemetryClientUploadStatus } from '../lib/telemetry';

const SecuredRoute = ({ component: Component, authenticated, title }) => {
  // Update the page title for page load telemetry.
  useEffect(() => {
    document.title = `Debug Ping Viewer | ${title}`;
  }, [title]);

  const params = useParams();
  updateTelemetryClientUploadStatus();

  return authenticated ? (
    <Component {...params} />
  ) : (
    <Navigate
      to={{
        pathname: '/login'
      }}
    />
  );
};

SecuredRoute.propTypes = {
  // This handles both functional and class components.
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  authenticated: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};

export default SecuredRoute;
