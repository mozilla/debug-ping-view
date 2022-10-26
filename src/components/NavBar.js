import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { auth } from '../Firebase';

const NavBar = ({ authenticated }) => {
  return (
    <nav className='navbar navbar-light bg-light navbar-expand-md fixed-top'>
      <Link className='navbar-brand' to='/'>
        Glean Debug ping viewer
      </Link>
      {authenticated ? (
        <>
          <div id='navbarNavDropdown' className='collapse navbar-collapse justify-content-between'>
            <div></div>
            <div className='navbar-nav' role='presentation'>
              <a
                className='nav-item nav-link'
                href='https://github.com/mozilla/debug-ping-view/issues'
                target='_blank'
                rel='noopener noreferrer'
              >
                Report a bug
              </a>
              <Link to={`/help`} className='nav-item nav-link'>
                <i className='far fa-question-circle'></i>Help
              </Link>
              <button
                className='btn btn-light nav-item nav-link'
                type='btn btn-lg '
                onClick={() => {
                  auth.signOut();
                }}
              >
                <i className='fa fa-lock'></i>Log Out
              </button>
            </div>
          </div>
        </>
      ) : (
        ''
      )}
    </nav>
  );
};

NavBar.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

export default NavBar;
