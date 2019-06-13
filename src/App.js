import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import firebase from './Firebase';
import NavBar from './components/NavBar';
import ActiveClients from './components/ActiveClients';
import Create from './components/Create';
import Show from './components/Show';
import ShowRawPing from './components/ShowRawPing';
import Help from './components/Help';
import SignInScreen from './components/SignInScreen';
import SecuredRoute from './components/SecuredRoute';


class App extends Component {
  state = { loading: true, authenticated: false, user: null };

  componentWillMount() {
    this.listener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        });
      }
    });
  }
  componentWillUnmount() {
    this.listener();
  }
  render() {
    if (this.state.loading) {
      return <p className="text-center">Loading...</p>;
    }

    return (
      <div>
        <NavBar authenticated={this.state.authenticated} />
        <SecuredRoute exact path='/' component={ActiveClients} authenticated={this.state.authenticated} />
        <SecuredRoute path='/create' component={Create} authenticated={this.state.authenticated} />
        <SecuredRoute path='/pings/:debugId' component={Show} authenticated={this.state.authenticated} />
        <SecuredRoute path='/rawPing/:docId' component={ShowRawPing} authenticated={this.state.authenticated} />
        <SecuredRoute exact path='/help' component={Help} authenticated={this.state.authenticated} />
        <Route path='/login' component={SignInScreen} />
      </div>
    );
  }
}

export default App;