/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

import MoonIcon from '../Icons/MoonIcon';
import SunIcon from '../Icons/SunIcon';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDarkMode = theme === 'dark';

  return (
    <button style={{ all: 'unset', cursor: 'pointer' }} data-glean-label='Theme' onClick={toggleTheme}>
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

ThemeToggle.propTypes = {
  theme: PropTypes.string,
  toggleTheme: PropTypes.func
};

export default ThemeToggle;
