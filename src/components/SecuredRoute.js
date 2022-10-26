import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const SecuredRoute = ({ component: Component, authenticated }) => {
  const params = useParams();

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
