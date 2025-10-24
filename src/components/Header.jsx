import React from 'react';
import './Header.css';

const Header = ({ isDarkMode, onThemeToggle }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">❤️ Positive Boost</h1>
        <button
          className={`theme-btn ${isDarkMode ? 'dark' : 'light'}`}
          onClick={onThemeToggle}
          aria-label="تبديل الوضع"
          title={isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;