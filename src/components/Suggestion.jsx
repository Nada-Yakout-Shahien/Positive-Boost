import React, { useState, useEffect } from 'react';
import './Suggestion.css';

const Suggestion = ({ isDarkMode }) => {
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    loadSuggestion();
  }, []);

  const suggestions = [
    {
      title: '🧘 ممارسة التأمل',
      description: 'خذ 5 دقائق للجلوس بهدوء والتنفس بعمق لتهدئة عقلك.',
      emoji: '🧘',
      color: '#87CEEB',
    },
    {
      title: '🚶 نزهة صباحية',
      description: 'امشِ في الطبيعة لمدة 15 دقيقة واستنشق الهواء النقي.',
      emoji: '🚶',
      color: '#90EE90',
    },
    {
      title: '📝 اكتب يومياتك',
      description: 'اكتب أفكارك ومشاعرك لليوم في دفتر اليوميات.',
      emoji: '📝',
      color: '#FFB6C1',
    },
    {
      title: '💪 تمارين خفيفة',
      description: 'قم ببعض تمارين الاستطالة أو التمارين الخفيفة.',
      emoji: '💪',
      color: '#FF8C00',
    },
    {
      title: '🎵 استمع للموسيقى',
      description: 'استمع إلى موسيقى هادئة تفضلها لمدة 10 دقائق.',
      emoji: '🎵',
      color: '#DDA0DD',
    },
    {
      title: '☕ احتسِ قهوة ممتعة',
      description: 'استمتع بفنجان قهوة أو شاي دافئ بهدوء.',
      emoji: '☕',
      color: '#D2691E',
    },
    {
      title: '📚 اقرأ صفحة',
      description: 'اقرأ صفحة من كتاب مفيد أو خفيف.',
      emoji: '📚',
      color: '#4169E1',
    },
    {
      title: '🌟 مكافأة نفسك',
      description: 'افعل شيئاً تحبه وتستمتع به بدون ذنب.',
      emoji: '🌟',
      color: '#FFD700',
    },
  ];

  const loadSuggestion = () => {
    const today = new Date().toDateString();
    const cachedSuggestion = localStorage.getItem(`cachedsuggestion_${today}`);

    if (cachedSuggestion) {
      setSuggestion(JSON.parse(cachedSuggestion));
    } else {
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setSuggestion(randomSuggestion);
      localStorage.setItem(`cachedsuggestion_${today}`, JSON.stringify(randomSuggestion));
    }
  };

  const handleNewSuggestion = () => {
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSuggestion(randomSuggestion);
  };

  return (
    <section className={`suggestion ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="suggestion-header">
        <h2 className="suggestion-title">💡 نشاط اليوم</h2>
        <button 
          className="new-suggestion-btn" 
          onClick={handleNewSuggestion}
          title="اقتراح آخر"
        >
          🔄
        </button>
      </div>

      {suggestion && (
        <div className="suggestion-content">
          <div className="suggestion-card" style={{ '--card-color': suggestion.color }}>
            <span className="suggestion-emoji">{suggestion.emoji}</span>
            <h3 className="suggestion-name">{suggestion.title}</h3>
            <p className="suggestion-description">{suggestion.description}</p>
          </div>
          <button className="try-btn">جرب الآن ✨</button>
        </div>
      )}
    </section>
  );
};

export default Suggestion;
