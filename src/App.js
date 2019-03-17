import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css';
import firebase from './Firebase';
import NavBar from './components/NavBar';
import ActiveClients from './components/ActiveClients';
import Create from './components/Create';
import Show from './components/Show';
import SignInScreen from './components/SignInScreen';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/' component={ActiveClients} />
        <Route path='/create' component={Create} />
        <Route path='/pings/:id' component={Show} />
        <Route path='/login' component={SignInScreen} />
      </div>
    );
  }
}

export default App;