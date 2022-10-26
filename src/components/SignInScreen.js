import React from 'react';
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

const SignInScreen = () => {
  return (
    <div>
      <p className='text-center'>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
};

export default SignInScreen;
