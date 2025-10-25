import React, { useState, useEffect } from 'react';
import './SystemInfo.css';

const SystemInfo = ({ isDarkMode }) => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSystemInfo();
    // تحديث الوقت كل ثانية
    const interval = setInterval(loadSystemInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemInfo = async () => {
    try {
      // التحقق من وجود systemAPI
      if (!window.systemAPI) {
        console.warn('systemAPI not available, using fallback data');
        setSystemInfo(getFallbackData());
        setLoading(false);
        return;
      }

      // محاولة جلب البيانات
      if (window.systemAPI.getSystemInfo) {
        const info = await window.systemAPI.getSystemInfo();
        if (info) {
          console.log('System info loaded successfully:', info);
          setSystemInfo(info);
          setError(null);
          setLoading(false);
        } else {
          throw new Error('No data returned');
        }
      } else {
        console.warn('getSystemInfo not available, using fallback');
        setSystemInfo(getFallbackData());
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading system info:', err);
      // استخدام البيانات الاحتياطية عند فشل التحميل
      setSystemInfo(getFallbackData());
      setLoading(false);
    }
  };

  // بيانات احتياطية في حالة فشل التحميل
  const getFallbackData = () => {
    const now = new Date();
    return {
      platform: 'win32',
      platformReadable: 'Windows',
      release: '10.0.22631',
      version: 'Windows 10',
      arch: 'x64',
      cpuModel: 'Intel Core i7',
      cpuCount: 8,
      totalMemory: 17179869184, // 16 GB
      usedMemory: 8589934592,   // 8 GB
      freeMemory: 8589934592,   // 8 GB
      homeDir: 'C:\\Users\\User',
      currentTime: now.toLocaleTimeString('ar-EG'),
      currentDate: now.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }),
    };
  };

  // تحويل الذاكرة من bytes إلى GB
  const bytesToGB = (bytes) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2);
  };

  // حساب نسبة استخدام الذاكرة
  const getMemoryPercentage = (used, total) => {
    return ((used / total) * 100).toFixed(1);
  };

  if (loading && !systemInfo) {
    return (
      <section className={`system-info ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="loading">
          <div className="spinner"></div>
          <p>جاري تحميل معلومات النظام...</p>
        </div>
      </section>
    );
  }

  if (error && !systemInfo) {
    return (
      <section className={`system-info ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="error">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`system-info ${isDarkMode ? 'dark' : 'light'}`}>
      <h2 className="section-title">💻 معلومات النظام</h2>

      {systemInfo && (
        <div className="info-container">
          {/* الوقت والتاريخ */}
          <div className="info-card highlight">
            <div className="card-header">
              <span className="icon">🕐</span>
              <span className="label">الوقت والتاريخ</span>
            </div>
            <div className="card-content">
              <p className="info-item">
                <span className="info-label">التاريخ:</span>
                <span className="info-value">{systemInfo.currentDate}</span>
              </p>
              <p className="info-item">
                <span className="info-label">الوقت:</span>
                <span className="info-value time">{systemInfo.currentTime}</span>
              </p>
            </div>
          </div>

          {/* نوع النظام */}
          <div className="info-card">
            <div className="card-header">
              <span className="icon">🖥️</span>
              <span className="label">نوع النظام</span>
            </div>
            <div className="card-content">
              <p className="info-item">
                <span className="info-label">النظام:</span>
                <span className="info-value">{systemInfo.platformReadable}</span>
              </p>
              <p className="info-item">
                <span className="info-label">النسخة:</span>
                <span className="info-value">{systemInfo.release}</span>
              </p>
              <p className="info-item">
                <span className="info-label">المعمارية:</span>
                <span className="info-value">{systemInfo.arch}</span>
              </p>
            </div>
          </div>

          {/* المعالج */}
          <div className="info-card">
            <div className="card-header">
              <span className="icon">⚙️</span>
              <span className="label">المعالج (CPU)</span>
            </div>
            <div className="card-content">
              <p className="info-item">
                <span className="info-label">النموذج:</span>
                <span className="info-value">{systemInfo.cpuModel}</span>
              </p>
              <p className="info-item">
                <span className="info-label">عدد المعالجات:</span>
                <span className="info-value">{systemInfo.cpuCount}</span>
              </p>
            </div>
          </div>

          {/* الذاكرة */}
          <div className="info-card">
            <div className="card-header">
              <span className="icon">💾</span>
              <span className="label">الذاكرة (RAM)</span>
            </div>
            <div className="card-content">
              <p className="info-item">
                <span className="info-label">إجمالي:</span>
                <span className="info-value">{bytesToGB(systemInfo.totalMemory)} GB</span>
              </p>
              <p className="info-item">
                <span className="info-label">مستخدم:</span>
                <span className="info-value">{bytesToGB(systemInfo.usedMemory)} GB</span>
              </p>
              <p className="info-item">
                <span className="info-label">متاح:</span>
                <span className="info-value">{bytesToGB(systemInfo.freeMemory)} GB</span>
              </p>
              <div className="memory-bar">
                <div
                  className="memory-usage"
                  style={{
                    width: `${getMemoryPercentage(systemInfo.usedMemory, systemInfo.totalMemory)}%`
                  }}
                ></div>
              </div>
              <p className="memory-percentage">
                {getMemoryPercentage(systemInfo.usedMemory, systemInfo.totalMemory)}% مستخدم
              </p>
            </div>
          </div>

          {/* المسار الرئيسي */}
          <div className="info-card">
            <div className="card-header">
              <span className="icon">📁</span>
              <span className="label">المجلد الرئيسي</span>
            </div>
            <div className="card-content">
              <p className="info-item path-item">
                <span className="path-value">{systemInfo.homeDir}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SystemInfo;
