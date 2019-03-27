import firebase from '../Firebase';
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar(props) {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <Link className="navbar-brand" to="/">
        Debug ping viewer
      </Link>
      {
        props.authenticated ? (
          <button className="btn btn-info" type="btn btn-lg " onClick={() => { firebase.auth().signOut() }}>
            <i className="fa fa-lock"></i>Log Out
        </button>
        ) : ("")
      }
    </nav>
  );
}

export default NavBar;