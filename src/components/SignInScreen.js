import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../Firebase';

// Configure FirebaseUI.
const uiConfig = {
    signInFlow: 'redirect',
    // Redirect to / after sign in is successful. Alternatively we can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };
  
  class SignInScreen extends React.Component {
    render() {
      return (
        <div>
          <p className="text-center">Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
  }

export default SignInScreen;