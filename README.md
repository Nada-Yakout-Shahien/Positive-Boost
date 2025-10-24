# 🌟 Positive Boost - تطبيق الإيجابية اليومي

تطبيق يومي مُصمم لتعزيز الإيجابية والسعادة باستخدام **React** و **Electron.js**، مع دعم كامل للعربية وميزة Dark/Light Mode.

## 📋 المتطلبات

- **Node.js** (إصدار 14 أو أحدث)
- **npm** أو **yarn**

## 🚀 البدء السريع

### 1. تثبيت المكتبات

```bash
npm install
```

### 2. تشغيل التطبيق في وضع التطوير

```bash
npm run dev
```

أو شغل React server و Electron بشكل منفصل:

```bash
# Terminal 1
npm start

# Terminal 2
npm run electron
```

### 3. بناء التطبيق للإنتاج

```bash
npm run build
npm run electron
```

## 📁 هيكل المشروع

```
positive-boost/
├── public/
│   ├── index.html
│   └── icon.png (قريباً)
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── MoodSelector.jsx
│   │   ├── Display.jsx
│   │   ├── Suggestion.jsx
│   │   └── History.jsx (اختياري)
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   ├── index.css
│   ├── main.js (Electron Main Process)
│   └── preload.js
├── package.json
└── README.md
```

## ✨ الميزات

- ✅ واجهة عربية كاملة
- ✅ تصميم فريم موبايل (375px × 667px)
- ✅ وضع داكن وفاتح (Dark/Light Mode)
- ✅ آيات قرآنية من Al-Quran.cloud API
- ✅ اقتباسات تحفيزية
- ✅ اقتراحات نشاطات يومية
- ✅ حفظ البيانات في LocalStorage
- ✅ واجهة سهلة وجذابة

## 🔧 المكتبات المستخدمة

- **React 18**: مكتبة واجهة المستخدم
- **Electron**: لإنشاء تطبيق سطح المكتب
- **Axios**: لطلب البيانات من الـ APIs
- **Cairo Font**: خط عربي جميل وسهل القراءة

## 📝 الملفات الأساسية

| الملف | الوصف |
|------|-------|
| `src/main.js` | عملية Electron الرئيسية |
| `src/preload.js` | سكريبت التحميل المسبق |
| `src/App.jsx` | المكون الرئيسي |
| `public/index.html` | ملف HTML الرئيسي |

## 🎨 التصميم

- **الألوان**: درجات زاهية (أزرق، أصفر، برتقالي، أخضر)
- **الخط**: Cairo مع أحجام متناسبة
- **الحدود**: border-radius: 20px للفريم
- **الظل**: box-shadow لعمق بصري

## 📱 حجم الشاشة

- **العرض**: 375px
- **الارتفاع**: 667px (حجم موبايل قياسي)

---

**تم التطوير بواسطة**: مشروع Positive Boost
**الترخيص**: MIT
