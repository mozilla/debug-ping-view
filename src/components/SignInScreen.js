/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { GoogleAuthProvider } from 'firebase/auth';

import { auth } from '../Firebase';

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: 'redirect',
  // Redirect to / after sign in is successful. Alternatively we can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  signInOptions: [GoogleAuthProvider.PROVIDER_ID]
};

const SignInScreen = ({ authenticated }) => {
  // If we are already signed in, we want to redirect to the home page
  // so we don't get into the bad loop where you signed in and `/login`
  // won't redirect you.
  return (
    <>
      {authenticated ? (
        <Navigate
          to={{
            pathname: '/'
          }}
        />
      ) : (
        <div>
          <p className='text-center'>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
      )}
    </>
  );
};

SignInScreen.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

export default SignInScreen;
