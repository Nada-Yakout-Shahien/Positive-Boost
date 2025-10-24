import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Display.css';

const Display = ({ isDarkMode }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState('verse'); // 'verse' or 'quote'

  useEffect(() => {
    loadContent();
  }, [contentType]);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // التحقق من البيانات المحفوظة في localStorage
      const today = new Date().toDateString();
      const cachedContent = localStorage.getItem(`cached${contentType}_${today}`);
      
      if (cachedContent) {
        setContent(JSON.parse(cachedContent));
        setLoading(false);
        return;
      }

      if (contentType === 'verse') {
        await fetchQuran();
      } else {
        await fetchMotivationalQuote();
      }
    } catch (err) {
      console.error('Error loading content:', err);
      setError('حدث خطأ في تحميل المحتوى');
      setLoading(false);
    }
  };

  const fetchQuran = async () => {
    try {
      // جلب سورة عشوائية من API القرآن
      const suraNumber = Math.floor(Math.random() * 114) + 1;
      const response = await axios.get(
        `https://api.alquran.cloud/v1/surah/${suraNumber}/ar.asad`
      );
      
      const surah = response.data.data;
      const randomAya = surah.ayahs[Math.floor(Math.random() * surah.ayahs.length)];
      
      const verseData = {
        text: randomAya.text,
        surah: surah.englishName,
        ayah: randomAya.numberInSurah,
        type: 'verse',
      };
      
      const today = new Date().toDateString();
      localStorage.setItem(`cachedverse_${today}`, JSON.stringify(verseData));
      setContent(verseData);
    } catch (err) {
      console.error('Quran fetch error:', err);
      setContent({
        text: 'وَاصْبِرْ نَفْسَكَ مَعَ الَّذِينَ يَدْعُونَ رَبَّهُم بِالْغَدَاةِ وَالْعَشِيِّ',
        surah: 'الكهف',
        ayah: 28,
        type: 'verse',
      });
    }
    setLoading(false);
  };

  const fetchMotivationalQuote = async () => {
    try {
      // اقتباسات تحفيزية بالعربية
      const quotes = [
        {
          text: 'لا تستسلم للخوف، فالخوف هو السجن والشجاعة هي الحرية.',
          author: 'محمود درويش',
        },
        {
          text: 'النجاح ليس وجهة بل رحلة مستمرة من التطور والتحسن.',
          author: 'جيم رون',
        },
        {
          text: 'إذا كنت تستطيع أن تحلم بها، فأنت تستطيع أن تحققها.',
          author: 'والت ديزني',
        },
        {
          text: 'لا تتوقف عن محاولة فقط لأنك سقطت، القائمة هي من تحقق الأحلام.',
          author: 'جيم فيتلين',
        },
        {
          text: 'الحياة جميلة جداً لتكون صغيراً في الأحلام، فكبر أحلامك وحقق أكثر.',
          author: 'محفوظ الليثي',
        },
      ];

      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const quoteData = {
        text: randomQuote.text,
        author: randomQuote.author,
        type: 'quote',
      };

      const today = new Date().toDateString();
      localStorage.setItem(`cachedquote_${today}`, JSON.stringify(quoteData));
      setContent(quoteData);
    } catch (err) {
      console.error('Quote fetch error:', err);
      setContent({
        text: 'الحياة جميلة، والحياة تستحق أن تعاش بكل شغف.',
        author: 'مجهول',
        type: 'quote',
      });
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    // حذف البيانات المخزنة واعادة التحميل
    const today = new Date().toDateString();
    localStorage.removeItem(`cached${contentType}_${today}`);
    loadContent();
  };

  return (
    <section className={`display ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="display-header">
        <div className="content-type-toggle">
          <button
            className={`toggle-btn ${contentType === 'verse' ? 'active' : ''}`}
            onClick={() => setContentType('verse')}
          >
            📖 آية
          </button>
          <button
            className={`toggle-btn ${contentType === 'quote' ? 'active' : ''}`}
            onClick={() => setContentType('quote')}
          >
            💭 اقتباس
          </button>
        </div>
        <button className="refresh-btn" onClick={handleRefresh} title="تحديث">
          🔄
        </button>
      </div>

      <div className="display-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>جاري التحميل...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
          </div>
        ) : content ? (
          <div className="content-box">
            <p className="main-text">{content.text}</p>
            <p className="meta-info">
              {content.type === 'verse' 
                ? `سورة ${content.surah} - الآية ${content.ayah}`
                : `- ${content.author}`
              }
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Display;
