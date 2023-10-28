/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { auth } from './Firebase';
import { ThemeProvider } from 'styled-components';

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

import { useTheme } from './lib/useTheme';
import { GlobalStyles } from './globalStyles';
import { lightTheme, darkTheme } from './themes';

// Global styles
import './App.css';
import '@mozilla-protocol/core';

const App = () => {
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
            element={<SecuredRoute component={ActiveClients} authenticated={authenticated} />}
          />
          <Route
            path='/create'
            element={<SecuredRoute component={Create} authenticated={authenticated} />}
          />
          <Route
            path='/pings/:debugId'
            element={<SecuredRoute component={DebugTagPings} authenticated={authenticated} />}
          />
          <Route
            path='/pings/:debugId/:docId'
            element={<SecuredRoute component={ShowRawPing} authenticated={authenticated} />}
          />
          <Route
            path='/help'
            element={<SecuredRoute component={Help} authenticated={authenticated} />}
          />
          <Route path='/login' element={<SignInScreen authenticated={authenticated} />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
