# 🚀 شرح Workflow تطبيق Positive Boost

---

## 🏗️ البنية العامة للمشروع

```
Positive Boost (تطبيق سطح المكتب)
│
├─ Main Process (Electron) ─ اللي يتحكم بـ OS والنظام
│  ├─ main.js ─ ينشئ النافذة وإدارة التطبيق
│  ├─ preload.js ─ جسر آمن لنقل البيانات
│  └─ استخدام os module للـ System Info
│
└─ Renderer Process (React) ─ الواجهة الجرافيكية
   ├─ App.jsx ─ الكومبوننت الرئيسي
   ├─ Components (المكونات):
   │  ├─ Header.jsx ─ العنوان وتبديل الوضع
   │  ├─ MoodSelector.jsx ─ اختيار المزاج
   │  ├─ Display.jsx ─ الآيات والاقتباسات
   │  ├─ Suggestion.jsx ─ الاقتراحات اليومية
   │  ├─ History.jsx ─ السجل السابق
   │  └─ SystemInfo.jsx ─ معلومات الجهاز
   └─ CSS Files ─ التصاميس والأنماط
```

---

## 🚀 مراحل تشغيل المشروع

### المرحلة 1️⃣: البدء (Startup)

```bash
npm run dev
```

**ما يحدث:**
```
npm install dependencies (concurrently, wait-on)
         ↓
تشغيل أمرين معاً:
├─ npm start ← React server على http://localhost:3000
└─ wait-on + npm run electron ← تشغيل Electron
         ↓
Electron Main Process يبدأ
         ↓
app.on('ready', createWindow) ينفذ
```

---

### المرحلة 2️⃣: إنشاء النافذة (Window Creation)

**الملف:** `src/main.js`

```javascript
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 375,           // عرض الموبايل
    height: 800,          // طول الموبايل
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,    // أمان
      contextIsolation: true,    // عزل العمليات
      enableRemoteModule: false  // أمان إضافي
    },
    icon: path.join(__dirname, '../public/icon.png'),
    resizable: false,           // ممنوع تغيير الحجم
    alwaysOnTop: false          // ليست فوق جميع النوافذ
  });

  const startUrl = isDev
    ? 'http://localhost:3000'   // في التطوير
    : `file://${path.join(__dirname, '../build/index.html')}`;  // في الإنتاج

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();  // فتح DevTools
  }
};
```

**وظيفة كل إعداد:**

| الإعداد | الغرض | السبب |
|--------|-------|-------|
| `width: 375` | عرض الشاشة بحجم موبايل | محاكاة هاتف |
| `height: 800` | طول الشاشة | محاكاة هاتف |
| `preload.js` | تحميل البيانات الآمنة | جسر آمن بين العمليات |
| `contextIsolation: true` | عزل السياق | منع وصول مباشر للـ Node |
| `nodeIntegration: false` | تعطيل تكامل Node | أمان عالي |
| `resizable: false` | ممنوع تغيير الحجم | الحفاظ على حجم الموبايل |

---

### المرحلة 3️⃣: جسر البيانات الآمن (Preload)

**الملف:** `src/preload.js`

```javascript
const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

// عرض الـ systemAPI بشكل آمن
contextBridge.exposeInMainWorld('systemAPI', {
  getSystemInfo: async () => {
    try {
      const systemInfo = {
        // معلومات النظام الأساسية
        platform: os.platform(),           // 'win32', 'darwin', 'linux'
        platformReadable: {                // نسخة قابلة للقراءة
          'win32': 'Windows',
          'darwin': 'macOS',
          'linux': 'Linux'
        }[os.platform()],

        // النسخة والمعمارية
        release: os.release(),             // 10.0.22631
        version: os.version(),             // Windows 10
        arch: os.arch(),                   // x64

        // المعالج
        cpus: os.cpus(),                   // جميع المعالجات
        cpuCount: os.cpus().length,        // عدد المعالجات
        cpuModel: os.cpus()[0]?.model,    // نموذج المعالج

        // الذاكرة (بالـ Bytes)
        totalMemory: os.totalmem(),        // الإجمالي
        freeMemory: os.freemem(),          // الحرة
        usedMemory: os.totalmem() - os.freemem(),  // المستخدم

        // المجلد الرئيسي
        homeDir: os.homedir(),             // C:\Users\User

        // الوقت والتاريخ بالعربي
        currentTime: new Date().toLocaleTimeString('ar-EG'),
        currentDate: new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        })
      };
      
      return systemInfo;
    } catch (error) {
      console.error('Error getting system info:', error);
      return null;
    }
  }
});
```

**ما الفائدة؟**
- ✅ React لا يقدر يصل مباشرة للـ OS
- ✅ فقط الدوال الموثوقة تمرّ (contextBridge)
- ✅ أمان عالي جداً

---

### المرحلة 4️⃣: تحميل React (App Initialization)

**الملف:** `public/index.html`

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Positive Boost - الإيجابية اليومية</title>
    <!-- خط Cairo من Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <!-- React سيحمّل هنا -->
    <div id="root"></div>
  </body>
</html>
```

**ثم:** `src/index.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**ما يحدث:**
1. React يبحث عن `<div id="root">`
2. يحمّل `App` component
3. `App` يعرّض جميع المكونات الأخرى

---

### المرحلة 5️⃣: المكون الرئيسي (App.jsx)

**الملف:** `src/App.jsx`

```javascript
function App() {
  // 1. تحميل الوضع المحفوظ من localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // 2. دالة تبديل الوضع
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // حفظ الوضع الجديد
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // 3. البنية الأساسية
  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* الفريم الموبايل */}
      <div className="mobile-frame">
        
        {/* رأس التطبيق */}
        <Header isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />

        {/* منطقة المحتوى الرئيسية */}
        <main className="frame-content">
          <div className="content-wrapper">
            {/* جميع المكونات */}
            <MoodSelector isDarkMode={isDarkMode} />
            <Display isDarkMode={isDarkMode} />
            <Suggestion isDarkMode={isDarkMode} />
            <SystemInfo isDarkMode={isDarkMode} />
            <History isDarkMode={isDarkMode} />
          </div>
        </main>

        {/* التذييل */}
        <footer className="frame-footer">
          <p>© 2025 Positive Boost - تطبيق الإيجابية اليومي</p>
        </footer>
      </div>
    </div>
  );
}
```

**دور `App.jsx`:**
- ✅ إدارة حالة Dark/Light Mode
- ✅ حفظ الإعدادات في localStorage
- ✅ تجميع جميع المكونات
- ✅ تمرير props لكل مكون

---

## 🧩 دور كل مكون (Components)

### 1️⃣ Header.jsx 🏷️

**الملف:** `src/components/Header.jsx`

```javascript
// الدور: عرض اسم التطبيق وزر تبديل الوضع

يعرض:
├─ ❤️ Positive Boost (الاسم مع أيقون)
└─ 🌙/☀️ (زر تبديل الأوضاع)

يستقبل Props:
├─ isDarkMode (boolean) ─ الوضع الحالي
└─ onThemeToggle (function) ─ دالة التبديل

الإجراءات:
└─ عند الضغط على الزر: استدعاء onThemeToggle
```

---

### 2️⃣ MoodSelector.jsx 😊

**الملف:** `src/components/MoodSelector.jsx`

```javascript
// الدور: اختيار المزاج اليومي

يعرض 5 خيارات:
├─ 😊 سعيد
├─ 🤩 متحمس
├─ 😌 هادئ
├─ 😔 حزين
└─ 💪 مندفع

عند الاختيار:
└─ حفظ في localStorage

localStorage Keys:
├─ dailyMood ─ المزاج المختار
└─ moodTimestamp ─ تاريخ الاختيار

يستقبل Props:
└─ isDarkMode ─ لتطبيق الألوان
```

**مثال التخزين:**
```javascript
localStorage.setItem('dailyMood', 'happy');
localStorage.setItem('moodTimestamp', new Date().toDateString());
// Result: "Fri Oct 24 2025"
```

---

### 3️⃣ Display.jsx 📖

**الملف:** `src/components/Display.jsx`

```javascript
// الدور: عرض آيات قرآنية واقتباسات تحفيزية

يعرض:
├─ الآيات القرآنية
│  └─ مصدر: https://api.alquran.cloud/v1/surah/[NUMBER]/ar.asad
├─ الاقتباسات التحفيزية
│  └─ مصدر: بيانات محلية (array)
├─ زر تبديل بين الآيات والاقتباسات
└─ زر تحديث

التخزين:
├─ cachedverse_[DATE] ─ الآية المحفوظة
└─ cachedquote_[DATE] ─ الاقتباس المحفوظ

Workflow:
1. قراءة من localStorage (إن وجدت)
2. إذا لم توجد، جلب من API
3. حفظ البيانات
4. عرض في الشاشة
```

---

### 4️⃣ Suggestion.jsx 💡

**الملف:** `src/components/Suggestion.jsx`

```javascript
// الدور: اقتراح نشاط يومي

8 اقتراحات متنوعة:
├─ 🧘 ممارسة التأمل
├─ 🚶 نزهة صباحية
├─ 📝 اكتب يومياتك
├─ 💪 تمارين خفيفة
├─ 🎵 استمع للموسيقى
├─ ☕ احتسِ قهوة ممتعة
├─ 📚 اقرأ صفحة
└─ 🌟 مكافأة نفسك

الزر:
└─ جرب الآن 🔥 (يفتح الاقتراح مع اختيار عشوائي)

التخزين:
└─ cachedsuggestion_[DATE] ─ الاقتراح اليومي
```

---

### 5️⃣ SystemInfo.jsx 💻

**الملف:** `src/components/SystemInfo.jsx`

```javascript
// الدور: عرض معلومات الجهاز والنظام

يعرض:
├─ 🕐 الوقت والتاريخ (يحدّث كل ثانية!)
├─ 🖥️ نوع النظام (Windows/Mac/Linux)
├─ ⚙️ المعالج (CPU) وعدد النوى
├─ 💾 الذاكرة (مع شريط بصري للاستخدام)
└─ 📁 المجلد الرئيسي

Workflow:
1. useEffect ينفذ عند التحميل
2. استدعاء window.systemAPI.getSystemInfo()
3. البيانات تأتي من preload.js
4. تحديث الحالة
5. تحديث كل ثانية

التحديث:
```javascript
const interval = setInterval(loadSystemInfo, 1000);
// الوقت يحدّث حياً!
```
```

---

### 6️⃣ History.jsx 📊

**الملف:** `src/components/History.jsx`

```javascript
// الدور: عرض سجل المزاجات السابقة

يعرض:
├─ زر لإظهار/إخفاء السجل
├─ آخر 7 أيام من المزاجات
├─ مع التاريخ والرموز التعبيرية
└─ زر لمسح السجل بالكامل

Workflow:
1. البحث في localStorage عن جميع المزاجات
2. استخراج آخر 7 أيام
3. عرضها في قائمة
4. عند الضغط "مسح": حذف جميع البيانات
```

---

## 💾 نظام التخزين (localStorage)

**الغرض:** حفظ البيانات حتى بعد إغلاق التطبيق

```javascript
localStorage في Positive Boost:

1. darkMode
   ├─ مفتاح: 'darkMode'
   ├─ القيمة: true أو false
   └─ التحديث: عند تبديل الوضع
   └─ مثال: localStorage.getItem('darkMode') → "true"

2. dailyMood
   ├─ مفتاح: 'dailyMood'
   ├─ القيمة: 'happy', 'excited', 'calm', 'sad', 'motivated'
   └─ التحديث: عند اختيار مزاج
   └─ مثال: localStorage.getItem('dailyMood') → "happy"

3. moodTimestamp
   ├─ مفتاح: 'moodTimestamp'
   ├─ القيمة: تاريخ اليوم
   └─ الغرض: تتبع متى اختير المزاج
   └─ مثال: "Fri Oct 24 2025"

4. cachedverse_[DATE]
   ├─ مثال: 'cachedverse_Fri Oct 24 2025'
   ├─ القيمة: JSON
   │  ├─ text: الآية
   │  ├─ surah: اسم السورة
   │  └─ ayah: رقم الآية
   └─ التحديث: يومياً (مرة واحدة فقط)

5. cachedquote_[DATE]
   ├─ مثال: 'cachedquote_Fri Oct 24 2025'
   ├─ القيمة: JSON
   │  ├─ text: الاقتباس
   │  └─ author: المؤلف
   └─ التحديث: يومياً

6. cachedsuggestion_[DATE]
   ├─ مثال: 'cachedsuggestion_Fri Oct 24 2025'
   ├─ القيمة: JSON
   │  ├─ title: عنوان النشاط
   │  ├─ description: الوصف
   │  ├─ emoji: الأيقون
   │  └─ color: اللون
   └─ التحديث: يومياً
```

---

## 🔄 Workflow كامل - مثال عملي

### السيناريو: المستخدم يفتح التطبيق أول مرة

```
المرحلة 1: البدء
└─ npm run dev

المرحلة 2: تشغيل الخوادم
├─ React server على localhost:3000
└─ Electron Main Process

المرحلة 3: إنشاء النافذة
└─ BrowserWindow بحجم 375×800

المرحلة 4: تحميل البيانات الآمنة
└─ preload.js ينتظر (يحمّل قبل الصفحة)

المرحلة 5: تحميل React
└─ HTML يحمّل، ثم React

المرحلة 6: تشغيل App.jsx
├─ فحص localStorage عن darkMode
├─ لا يجد شيء (أول مرة)
├─ يعيّن isDarkMode = false
└─ يبدأ عرض المكونات

المرحلة 7: تحميل المكونات
├─ Header: يعرض العنوان والزر
├─ MoodSelector: ينتظر اختيار
├─ Display: يجلب آية من API
├─ Suggestion: يختار نشاط عشوائي
├─ SystemInfo: يجلب معلومات النظام
└─ History: يفحص localStorage (فارغ)

المرحلة 8: عرض النتيجة
└─ المستخدم يرى الواجهة الكاملة!
```

---

## 🔐 الأمان (Security)

```
بدون contextBridge (خطير!):
┌──────────────────────────────┐
│  React Code                  │
│  └─ يقدر يعمل أي حاجة       │
└────────────┬─────────────────┘
             │
    (بدون حماية!)
             │
┌────────────▼──────────────────┐
│  Node.js / OS                 │
│  └─ يقدر تحذف الملفات، إلخ   │
└──────────────────────────────┘

مع contextBridge (آمن! ✅):
┌──────────────────────────────┐
│  React Code                  │
│  └─ فقط استدعاء معين       │
└────────────┬─────────────────┘
             │
    [جسر محدود جداً]
             │
┌────────────▼──────────────────┐
│  window.systemAPI.getSystemInfo()  │
│  └─ فقط هذه الدالة تمرّ     │
└────────────┬──────────────────┘
             │
  (نفس العملية بأمان)
             │
┌────────────▼──────────────────┐
│  preload.js                  │
│  └─ يجمع البيانات الآمنة     │
└──────────────────────────────┘
```

---

## 📊 تدفق البيانات

```
┌────────────────────┐
│   User Action      │
│  (اختيار مزاج...)  │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ Component Handler  │
│ (onClick, etc.)    │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ setState() Update  │
│ (تحديث الحالة)    │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ localStorage.setItem() │
│ (حفظ البيانات)     │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ Component Re-render│
│ (إعادة عرض)       │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ User Sees Update   │
│ (المستخدم يرى)    │
└────────────────────┘
```

---

## 🎯 ملخص الملفات الرئيسية

| الملف | النوع | الدور | يستخدم |
|------|-------|-------|--------|
| `main.js` | Electron | إنشاء النافذة | Electron API |
| `preload.js` | Electron | جسر البيانات | os module |
| `App.jsx` | React | تجميع المكونات | localStorage |
| `Header.jsx` | React | العنوان والوضع | props |
| `MoodSelector.jsx` | React | اختيار المزاج | localStorage |
| `Display.jsx` | React | الآيات والاقتباسات | axios, API |
| `Suggestion.jsx` | React | الاقتراحات | localStorage |
| `SystemInfo.jsx` | React | معلومات النظام | window.systemAPI |
| `History.jsx` | React | السجل | localStorage |
| `App.css` | CSS | التصاميم | CSS3, Gradients |
| `*.css` | CSS | تصاميم المكونات | CSS3, Animations |

---

## ⚡ في كل مرة يفتح التطبيق

```
1. ✅ قراءة darkMode من localStorage
   ├─ إن وُجد: استخدمه
   └─ إلا: قيمة افتراضية (false)

2. ✅ قراءة dailyMood إن وُجد
   ├─ إن وُجد: عرض المزاج المختار
   └─ إلا: عرض الأزرار فقط

3. ✅ جلب البيانات المحفوظة
   ├─ cachedverse_[TODAY]
   ├─ cachedquote_[TODAY]
   └─ cachedsuggestion_[TODAY]

4. ✅ جلب معلومات النظام
   └─ من window.systemAPI

5. ✅ حساب نسبة الذاكرة
   └─ (used / total) * 100

6. ✅ تحديث الوقت كل ثانية
   └─ new Date().toLocaleTimeString('ar-EG')
```

---

## 🌟 الخلاصة

**Positive Boost هو تطبيق desktop كامل يتضمن:**

1. ✅ **Electron** ← تطبيق سطح المكتب
2. ✅ **React** ← الواجهة الجرافيكية
3. ✅ **localStorage** ← تخزين البيانات
4. ✅ **Node.js APIs** ← معلومات النظام
5. ✅ **External APIs** ← الآيات القرآنية
6. ✅ **Dark/Light Mode** ← تبديل الأوضاع
7. ✅ **Responsive Design** ← تصميم متناسق
8. ✅ **Arabic Support** ← دعم كامل للعربية

---

**تم التطوير بواسطة:** Positive Boost Team  
**التاريخ:** أكتوبر 2025  
**الإصدار:** 1.0.0

---

## 📚 المكتبات المستخدمة وظائفها

### **🎯 Production Dependencies (مكتبات الإنتاج)**

---

#### **1. React 18.2.0** ⚛️

```javascript
// الغرض: مكتبة واجهة المستخدم الرئيسية

الاستخدام:
import React, { useState, useEffect } from 'react';

الوظائف:
├─ إنشاء Components
├─ إدارة State (useState)
├─ تأثيرات جانبية (useEffect)
├─ إعادة عرض الواجهة تلقائياً
└─ دعم JSX (HTML في JavaScript)

المثال:
const [count, setCount] = useState(0);
useEffect(() => {
  // يعمل عند تحميل المكون
}, []);
```

---

#### **2. React DOM 18.2.0** 🖥️

```javascript
// الغرض: ربط React مع DOM (HTML)

الاستخدام:
import ReactDOM from 'react-dom/client';

الوظائف:
├─ عرض React Components في الـ HTML
├─ إنشاء root element
├─ تحديث الصفحة
└─ التعامل مع الأحداث

المثال:
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

---

#### **3. Axios 1.6.0** 🌐

```javascript
// الغرض: جلب البيانات من الـ APIs (REST)

الاستخدام:
import axios from 'axios';

الوظائف:
├─ إرسال طلبات HTTP
├─ GET, POST, PUT, DELETE
├─ معالجة الأخطاء
├─ تعيين Headers
└─ دعم Promises و Async/Await

المثال:
const response = await axios.get('https://api.alquran.cloud/v1/surah/1');
const data = response.data;

في المشروع:
جلب الآيات القرآنية من Al-Quran Cloud API
```

---

#### **4. React Flip Toolkit 7.1.0** ✨

```javascript
// الغرض: تأثيرات حركة سلسة عند تغيير العناصر

الاستخدام:
import { Flipper, Flipped } from 'react-flip-toolkit';

الوظائف:
├─ حركات سلسة للعناصر
├─ تأثير FLIP (First, Last, Invert, Play)
├─ إعادة ترتيب العناصر
└─ تأثيرات احترافية

المثال:
<Flipper flipKey={items.length}>
  {items.map(item => (
    <Flipped key={item.id} flipId={item.id}>
      <div>{item.name}</div>
    </Flipped>
  ))}
</Flipper>

في المشروع:
يمكن استخدامها عند تغيير ترتيب المزاجات أو الاقتراحات
```

---

#### **5. Framer Motion 10.16.12** 🎬

```javascript
// الغرض: تأثيرات حركة متقدمة وتفاعلية

الاستخدام:
import { motion } from 'framer-motion';

الوظائف:
├─ تأثيرات Fade In/Out
├─ تأثيرات Slide
├─ Animations معقدة
├─ Interactive Gestures
└─ Keyframes Animation

المثال:
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  محتوى
</motion.div>

في المشروع:
تأثيرات الظهور والاختفاء للآيات والاقتباسات
```

---

### **⚙️ DevDependencies (مكتبات التطوير)**

---

#### **6. Electron 27.0.0** 🖥️

```javascript
// الغرض: إنشاء تطبيقات سطح المكتب بـ JavaScript

الاستخدام:
const { app, BrowserWindow } = require('electron');

الوظائف الرئيسية:
├─ إنشاء نوافذ
├─ إدارة التطبيق
├─ الوصول لـ OS (نظام التشغيل)
├─ معالجة أحداث التطبيق
├─ Native APIs (ملفات، أجهزة، إلخ)
└─ دعم Preload Scripts

المثال:
const mainWindow = new BrowserWindow({
  width: 375,
  height: 800,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true
  }
});

في المشروع:
إنشاء التطبيق الرئيسي ونافذة الموبايل
```

---

#### **7. Electron is Dev 2.0.0** 🔍

```javascript
// الغرض: التحقق من بيئة التطوير vs الإنتاج

الاستخدام:
const isDev = require('electron-is-dev');

الوظائف:
├─ معرفة هل نحن في وضع التطوير
├─ معرفة هل نحن في وضع الإنتاج
├─ تشغيل DevTools في التطوير فقط
└─ اختيار الـ URLs المختلفة

المثال:
const startUrl = isDev
  ? 'http://localhost:3000'        // في التطوير
  : `file://${path.join(__dirname, '../build/index.html')}`;  // في الإنتاج

في المشروع:
تحديد الـ URL بناءً على البيئة الحالية
```

---

#### **8. React Scripts 5.0.1** 📦

```javascript
// الغرض: أدوات بناء React (Build tools)

الوظائف:
├─ npm start ← تشغيل React dev server
├─ npm build ← بناء الإنتاج
├─ npm test ← تشغيل الاختبارات
├─ Webpack ← دمج الملفات
├─ Babel ← ترجمة JavaScript الحديث
└─ Hot Reload ← تحديث فوري

المثال:
npm start  # شغّل React server

في المشروع:
تشغيل خادم التطوير ودعم JSX
```

---

#### **9. Concurrently 8.2.0** ⚡

```javascript
// الغرض: تشغيل عدة أوامر معاً في نفس الوقت

الاستخدام:
concurrently "npm start" "npm run electron"

الوظائف:
├─ تشغيل عدة عمليات
├─ عرض المخرجات
├─ إدارة الأخطاء
└─ إغلاق جميع العمليات معاً

في package.json:
"dev": "concurrently \"npm start\" \"wait-on http://localhost:3000 && npm run electron\""

في المشروع:
تشغيل React server و Electron معاً
```

---

#### **10. Wait On 7.0.1** ⏳

```javascript
// الغرض: الانتظار حتى يكون الخادم جاهزاً

الاستخدام:
wait-on http://localhost:3000

الوظائف:
├─ انتظر حتى يرفع الخادم
├─ تحقق من الاتصال
├─ ثم شغّل الأمر التالي
└─ تجنب الأخطاء

المثال:
"dev": "concurrently \"npm start\" \"wait-on http://localhost:3000 && npm run electron\""

في المشروع:
Electron ينتظر React server حتى يكون جاهزاً
```

---

### **🎨 Web Fonts**

---

#### **11. Cairo Font (Google Fonts)** 🔤

```html
<!-- الغرض: خط عربي جميل وسهل القراءة -->

الاستخدام:
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">

الخصائص:
├─ وزن خفيف: 300
├─ وزن عادي: 400
├─ وزن أغمق: 600
├─ وزن ثقيل جداً: 700
└─ دعم كامل للعربية

في المشروع:
جميع النصوص العربية تستخدم هذا الخط
```

---

### **🖥️ Node.js Built-in Modules**

---

#### **12. Node.js OS Module** 💻

```javascript
// الغرض: الوصول إلى معلومات نظام التشغيل

الاستخدام:
const os = require('os');

الوظائف:
├─ os.platform() ─ نوع النظام (win32, darwin, linux)
├─ os.release() ─ نسخة النظام
├─ os.arch() ─ المعمارية (x64, x32)
├─ os.cpus() ─ معلومات المعالجات
├─ os.totalmem() ─ إجمالي الذاكرة
├─ os.freemem() ─ الذاكرة الحرة
├─ os.homedir() ─ مجلد المستخدم الرئيسي
└─ os.hostname() ─ اسم الجهاز

المثال:
const systemInfo = {
  platform: os.platform(),        // 'win32'
  cpuCount: os.cpus().length,     // 8
  totalMemory: os.totalmem(),     // 17GB
  homeDir: os.homedir()           // C:\Users\User
};

في المشروع:
في preload.js لجلب معلومات النظام
```

---

#### **13. Node.js Path Module** 📁

```javascript
// الغرض: التعامل مع مسارات الملفات

الاستخدام:
const path = require('path');

الوظائف:
├─ path.join() ─ دمج المسارات
├─ path.resolve() ─ مسار مطلق
├─ path.dirname() ─ اسم المجلد
└─ __dirname ─ المجلد الحالي

المثال:
preload: path.join(__dirname, 'preload.js')
icon: path.join(__dirname, '../public/icon.png')

في المشروع:
في main.js لتحديد مسارات الملفات
```

---

### **💾 JavaScript Native APIs**

---

#### **14. localStorage API** 🗄️

```javascript
// الغرض: تخزين البيانات محلياً في المتصفح

الاستخدام:
localStorage.setItem('key', 'value');
localStorage.getItem('key');
localStorage.removeItem('key');

الوظائف:
├─ حفظ النصوص والـ JSON
├─ البيانات تبقى بعد الإغلاق
├─ محدود بـ 5-10 MB
└─ لا يحتاج Server

المثال:
localStorage.setItem('darkMode', JSON.stringify(true));
const isDark = JSON.parse(localStorage.getItem('darkMode'));

في المشروع:
حفظ الوضع، المزاج، الآيات، الاقتباسات، الاقتراحات
```

---

#### **15. Fetch API و Promises** 🔗

```javascript
// الغرض: جلب البيانات من الـ APIs

الاستخدام:
const data = await fetch(url).then(res => res.json());

الوظائف:
├─ عمل requests HTTP
├─ معالجة الـ responses
├─ دعم Async/Await
└─ معالجة الأخطاء

المثال:
try {
  const response = await fetch('https://api.example.com');
  const data = await response.json();
} catch (error) {
  console.error(error);
}

في المشروع:
Axios يستخدمها تحت الغطاء
```

---

#### **16. Date API** 📅

```javascript
// الغرض: التعامل مع الأوقات والتواريخ

الاستخدام:
new Date().toLocaleTimeString('ar-EG')
new Date().toLocaleDateString('ar-EG')

الوظائف:
├─ إنشاء تاريخ حالي
├─ تحويل إلى نصوص
├─ دعم اللغات المختلفة
└─ حسابات التاريخ

المثال:
const time = new Date().toLocaleTimeString('ar-EG');
// "23:45:30"

const date = new Date().toLocaleDateString('ar-EG', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
});
// "الخميس، 24 أكتوبر 2025"

في المشروع:
في SystemInfo و Display لعرض الوقت والتاريخ بالعربي
```

---

#### **17. Array Methods** 📊

```javascript
// الغرض: معالجة المصفوفات

الاستخدام:
array.map()
array.filter()
array.find()
array.slice()
array.forEach()

الوظائف:
├─ التكرار على العناصر
├─ تصفية البيانات
├─ البحث عن عناصر
├─ تغيير العناصر
└─ دمج المصفوفات

المثال:
const moods = ['happy', 'sad', 'calm'];
const upperCase = moods.map(m => m.toUpperCase());
// ['HAPPY', 'SAD', 'CALM']

في المشروع:
في جميع المكونات للتكرار على البيانات
```

---

#### **18. JSON API** 🔄

```javascript
// الغرض: تحويل بين Objects و JSON Strings

الاستخدام:
JSON.stringify(object)  // Object → String
JSON.parse(string)      // String → Object

الوظائف:
├─ حفظ Objects في localStorage
├─ إرسال البيانات للـ APIs
├─ استقبال البيانات
└─ معالجة الأخطاء

المثال:
// حفظ
localStorage.setItem('user', JSON.stringify({name: 'Ahmed'}));

// قراءة
const user = JSON.parse(localStorage.getItem('user'));

في المشروع:
حفظ واستقبال جميع البيانات في localStorage
```

---

## 📊 جدول شامل للمكتبات

| # | المكتبة | النسخة | النوع | الغرض | الاستخدام |
|---|--------|--------|-------|--------|-----------|
| 1 | React | 18.2.0 | Prod | واجهة المستخدم | Components, Hooks |
| 2 | React DOM | 18.2.0 | Prod | ربط React بـ HTML | Rendering |
| 3 | Axios | 1.6.0 | Prod | جلب البيانات | HTTP Requests |
| 4 | React Flip Toolkit | 7.1.0 | Prod | تأثيرات حركة | Animations |
| 5 | Framer Motion | 10.16.12 | Prod | حركات متقدمة | Advanced Animations |
| 6 | Electron | 27.0.0 | Dev | تطبيق Desktop | Main Process |
| 7 | Electron is Dev | 2.0.0 | Dev | التحقق من البيئة | Conditional Logic |
| 8 | React Scripts | 5.0.1 | Dev | أدوات بناء | Build Tools |
| 9 | Concurrently | 8.2.0 | Dev | تشغيل متوازي | Run Multiple Commands |
| 10 | Wait On | 7.0.1 | Dev | الانتظار | Wait for Server |
| 11 | Cairo Font | Latest | Web Font | خط عربي | Text Display |
| 12 | OS Module | Built-in | Node.js | معلومات النظام | System Info |
| 13 | Path Module | Built-in | Node.js | إدارة المسارات | Path Management |
| 14 | localStorage | Built-in | API | التخزين المحلي | Data Storage |
| 15 | Fetch API | Built-in | API | جلب البيانات | HTTP Requests |
| 16 | Date API | Built-in | API | التواريخ والأوقات | Date/Time |
| 17 | Array Methods | Built-in | API | معالجة المصفوفات | Data Processing |
| 18 | JSON API | Built-in | API | تحويل البيانات | Data Serialization |

---

## 🔗 العلاقات بين المكتبات

```
┌──────────────────────────────────────────────────┐
│         Positive Boost Application               │
└────────────────┬─────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ↓                 ↓
   React Side      Electron Side
   (Renderer)      (Main Process)
        │                 │
        ├─React          ├─Electron
        ├─React DOM      ├─OS Module
        ├─Axios          ├─Path Module
        ├─Framer Motion  ├─preload.js
        ├─React Flip     │
        ├─localStorage   │
        ├─Fetch API      │
        ├─Date API       │
        └─Array Methods  │
                 │
        localStorage (مشترك)
        │
        JSON API (تحويل البيانات)
```

---

**الآن أنت تعرف كل مكتبة ووظيفتها! 🎓**
