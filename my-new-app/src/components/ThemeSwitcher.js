import React, { useEffect } from 'react';
import '../styles/ThemeSwitcher.css'

const ThemeSwitcher = ({ toggleTheme, theme }) => {
  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  // Dynamically pick the Bootstrap class
  const btnClass = theme === 'dark' ? 'btn btn-dark' : 'btn btn-light';

  return (
    <div className="theme-switcher">
      <button className={btnClass} onClick={toggleTheme}>
        {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
};

export default ThemeSwitcher;