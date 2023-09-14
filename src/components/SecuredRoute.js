/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { updateTelemetry } from '../lib/telemetry';

const SecuredRoute = ({ component: Component, authenticated }) => {
  const params = useParams();
  updateTelemetry();

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
  authenticated: PropTypes.bool.isRequired
};

export default SecuredRoute;
