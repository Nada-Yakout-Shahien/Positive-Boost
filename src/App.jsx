import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import MoodSelector from './components/MoodSelector';
import Display from './components/Display';
import Suggestion from './components/Suggestion';
import History from './components/History';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // تحميل الوضع المحفوظ من localStorage
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // حفظ الوضع المختار
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* الفريم الموبايل الرئيسي */}
      <div className="mobile-frame">
        
        {/* رأس التطبيق - Header Section */}
        <Header isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />

        {/* منطقة المحتوى الرئيسية - Main Content Area */}
        <main className="frame-content">
          <div className="content-wrapper">
            
            {/* مكون اختيار المزاج */}
            <MoodSelector isDarkMode={isDarkMode} />

            {/* مكون عرض الآيات والاقتباسات */}
            <Display isDarkMode={isDarkMode} />

            {/* مكون الاقتراح اليومي */}
            <Suggestion isDarkMode={isDarkMode} />

            {/* مكون السجل (اختياري) */}
            <History isDarkMode={isDarkMode} />

          </div>
        </main>

        {/* تذييل اختياري */}
        <footer className="frame-footer">
          <p className="footer-text">© 2025 Positive Boost - تطبيق الإيجابية اليومي</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
