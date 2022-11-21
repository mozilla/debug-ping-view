import React from 'react';
import PropTypes from 'prop-types';

import MoonIcon from '../Icons/MoonIcon';
import SunIcon from '../Icons/SunIcon';

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDarkMode = theme === 'dark';

  return (
    <button style={{ all: 'unset', cursor: 'pointer' }} onClick={toggleTheme}>
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

ThemeToggle.propTypes = {
  theme: PropTypes.string,
  toggleTheme: PropTypes.func
};

export default ThemeToggle;
