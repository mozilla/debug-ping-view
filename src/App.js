/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { auth } from './Firebase';
import { ThemeProvider } from 'styled-components';
import GleanMetrics from '@mozilla/glean/metrics';

import NavBar from './components/NavBar';
import ActiveClients from './components/ActiveClients';
import Create from './components/Create';
import DebugTagPings from './components/DebugTagPings';
import ShowRawPing from './components/ShowRawPing';
import Help from './components/Help';
import SignInScreen from './components/SignInScreen';
import SecuredRoute from './components/SecuredRoute';
import Loading from './components/Loading';
import Footer from './components/Footer';
import EventStream from './components/EventStream';

import { useTheme } from './lib/useTheme';
import { GlobalStyles } from './globalStyles';
import { lightTheme, darkTheme } from './themes';

// Global styles
import './App.css';
import '@mozilla-protocol/core';

const App = () => {
  // Get the current app route. We use this for determining when the route has
  // changed and we should record an app page load event.
  const location = useLocation();

  const [theme, themeToggler] = useTheme();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  /// state ///
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  /// lifecycle ///
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Record a page load event on each route change.
    GleanMetrics.pageLoad();
  }, [location]);

  /// render ///
  if (loading) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={themeMode}>
      <GlobalStyles />
      <div>
        <NavBar authenticated={authenticated} theme={theme} themeToggler={themeToggler} />
        <Routes>
          <Route
            exact
            path='/'
            element={
              <SecuredRoute component={ActiveClients} authenticated={authenticated} title='Home' />
            }
          />
          <Route
            path='/create'
            element={<SecuredRoute component={Create} authenticated={authenticated} />}
          />
          <Route
            path='/pings/:debugId'
            element={
              <SecuredRoute component={DebugTagPings} authenticated={authenticated} title='Pings' />
            }
          />
          <Route
            path='/pings/:debugId/:docId'
            element={
              <SecuredRoute component={ShowRawPing} authenticated={authenticated} title='Ping' />
            }
          />
          <Route
            path='/help'
            element={<SecuredRoute component={Help} authenticated={authenticated} title='Help' />}
          />
          <Route path='/login' element={<SignInScreen authenticated={authenticated} />} />
          <Route
            path='/stream/:debugId'
            element={
              <SecuredRoute
                component={EventStream}
                authenticated={authenticated}
                title='Event Stream'
              />
            }
          />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
