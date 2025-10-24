import React, { useState, useEffect } from 'react';
import './MoodSelector.css';

const MoodSelector = ({ isDarkMode }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  // تحميل المزاج المحفوظ عند فتح التطبيق
  useEffect(() => {
    const savedMood = localStorage.getItem('dailyMood');
    if (savedMood) {
      setSelectedMood(savedMood);
    }
  }, []);

  const moods = [
    { id: 'happy', emoji: '😊', label: 'سعيد', color: '#FFD700' },
    { id: 'excited', emoji: '🤩', label: 'متحمس', color: '#FF6B9D' },
    { id: 'calm', emoji: '😌', label: 'هادئ', color: '#87CEEB' },
    { id: 'sad', emoji: '😔', label: 'حزين', color: '#A9A9A9' },
    { id: 'motivated', emoji: '💪', label: 'مندفع', color: '#FF8C00' },
  ];

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    localStorage.setItem('dailyMood', moodId);
    localStorage.setItem('moodTimestamp', new Date().toDateString());
  };

  const selectedMoodData = moods.find((m) => m.id === selectedMood);

  return (
    <section className={`mood-selector ${isDarkMode ? 'dark' : 'light'}`}>
      <h2 className="mood-title">كيف حالك اليوم؟</h2>
      <p className="mood-subtitle">اختر المزاج الذي يناسبك</p>

      <div className="mood-buttons">
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`mood-button ${selectedMood === mood.id ? 'active' : ''}`}
            onClick={() => handleMoodSelect(mood.id)}
            title={mood.label}
            style={{
              '--mood-color': mood.color,
            }}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>

      {selectedMoodData && (
        <div className="mood-feedback">
          <p>
            <span className="feedback-emoji">{selectedMoodData.emoji}</span>
            أنت تشعر بـ <strong>{selectedMoodData.label}</strong> اليوم - رائع! 
          </p>
        </div>
      )}
    </section>
  );
};

export default MoodSelector;
