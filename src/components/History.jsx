import React, { useState, useEffect } from 'react';
import './History.css';

const History = ({ isDarkMode }) => {
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const allHistory = [];
    
    // البحث عن جميع المزاجات المحفوظة
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('dailyMood')) {
        const moodTimestamp = localStorage.getItem('moodTimestamp');
        const mood = localStorage.getItem(key);
        if (moodTimestamp && mood) {
          allHistory.push({
            date: moodTimestamp,
            mood: mood,
            timestamp: key,
          });
        }
      }
    }
    
    setHistory(allHistory.slice(0, 7)); // آخر 7 أيام
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      excited: '🤩',
      calm: '😌',
      sad: '😔',
      motivated: '💪',
    };
    return moodMap[mood] || '😐';
  };

  const getMoodLabel = (mood) => {
    const labelMap = {
      happy: 'سعيد',
      excited: 'متحمس',
      calm: 'هادئ',
      sad: 'حزين',
      motivated: 'مندفع',
    };
    return labelMap[mood] || 'غير معروف';
  };

  const clearHistory = () => {
    if (window.confirm('هل تريد مسح جميع السجل؟')) {
      localStorage.clear();
      setHistory([]);
    }
  };

  return (
    <section className={`history ${isDarkMode ? 'dark' : 'light'}`}>
      <button
        className="history-toggle"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? '📖 إخفاء السجل' : '📖 عرض السجل'}
      </button>

      {showHistory && (
        <div className="history-content">
          <h3 className="history-title">📊 سجل المزاجات</h3>
          
          {history.length > 0 ? (
            <div className="history-list">
              {history.map((item, index) => (
                <div key={index} className="history-item">
                  <span className="history-emoji">{getMoodEmoji(item.mood)}</span>
                  <span className="history-mood">{getMoodLabel(item.mood)}</span>
                  <span className="history-date">{item.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="history-empty">لا توجد بيانات سابقة</p>
          )}

          {history.length > 0 && (
            <button className="clear-history-btn" onClick={clearHistory}>
              🗑️ مسح السجل
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default History;
