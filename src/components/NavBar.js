import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { auth } from '../Firebase';

import ThemeToggle from './Theme/ThemeToggle';
import BugIcon from './Icons/BugIcon';
import SignOutIcon from './Icons/SignOut';
import HelpIcon from './Icons/HelpIcon';
import Breadcrumbs from './Breadcrumbs';

const NavBar = ({ authenticated, theme, themeToggler }) => {
  return (
    <div>
      <nav className='navbar navbar-expand-md'>
        <Link to='/' className='text-decoration-none'>
          <h2 className='m-0'>Glean Debug Ping Viewer</h2>
        </Link>
        {authenticated && (
          <>
            <div
              id='navbarNavDropdown'
              className='collapse navbar-collapse justify-content-between'
            >
              <div></div>
              <div className='navbar-nav' role='presentation'>
                <div className='nav-item nav-link cursor-pointer'>
                  <ThemeToggle theme={theme} toggleTheme={themeToggler} />
                </div>
                <div className='nav-item nav-link cursor-pointer'>
                  <a
                    href='https://github.com/mozilla/debug-ping-view/issues'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ all: 'unset ' }}
                  >
                    <BugIcon />
                  </a>
                </div>
                <div className='nav-item nav-link cursor-pointer'>
                  <Link to={`/help`} style={{ all: 'unset' }}>
                    <HelpIcon />
                  </Link>
                </div>
                <div
                  className='nav-item nav-link cursor-pointer'
                  type='btn btn-lg '
                  onClick={() => {
                    auth.signOut();
                  }}
                >
                  <SignOutIcon />
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
      {authenticated && <Breadcrumbs />}
    </div>
  );
};

NavBar.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

export default NavBar;
