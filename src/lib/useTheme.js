import { useEffect, useState } from 'react';

// Reusable hook for reading and updating theme state in browser local storage.
export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  const setMode = (mode) => {
    window.localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  const themeToggler = () => {
    theme === 'light' ? setMode('dark') : setMode('light');
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    localTheme && setTheme(localTheme);
  }, []);

  return [theme, themeToggler];
};
