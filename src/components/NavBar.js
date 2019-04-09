import firebase from '../Firebase';
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar(props) {
  return (
    <nav className="navbar navbar-light bg-light navbar-expand-md fixed-top">
      <Link className="navbar-brand" to="/">
        Debug ping viewer
      </Link>
      {
        props.authenticated ? (
          <>
            <div id="navbarNavDropdown" className="collapse navbar-collapse justify-content-between">
              <div></div>
              <div className="navbar-nav" role="presentation">
                <a className="nav-item nav-link" href="https://github.com/mozilla/debug-ping-view/issues" target="_blank" rel="noopener noreferrer">Report a bug</a>
                <Link to={`/help`} className="nav-item nav-link"><i className="far fa-question-circle"></i>Help</Link>
                <button className="btn btn-light" type="btn btn-lg " onClick={() => { firebase.auth().signOut() }}>
                  <i className="fa fa-lock"></i>Log Out
                </button>
              </div>
            </div>
          </>
        ) : ("")
      }
    </nav>
  );
}

export default NavBar;