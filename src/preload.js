const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  version: process.version,
});

contextBridge.exposeInMainWorld('systemAPI', {
  getSystemInfo: async () => {
    try {
      const systemInfo = {
        // معلومات النظام الأساسية
        platform: os.platform(),
        platformReadable: {
          'win32': 'Windows',
          'darwin': 'macOS',
          'linux': 'Linux'
        }[os.platform()] || os.platform(),
        
        // النسخة
        release: os.release(),
        version: os.version(),
        
        // المعالج
        arch: os.arch(),
        cpus: os.cpus(),
        cpuCount: os.cpus().length,
        cpuModel: os.cpus()[0]?.model || 'معروف',
        
        // الذاكرة
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        usedMemory: os.totalmem() - os.freemem(),
        
        // المجلد الرئيسي
        homeDir: os.homedir(),
        
        // الوقت والتاريخ
        currentTime: new Date().toLocaleTimeString('ar-EG'),
        currentDate: new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        }),
      };
      
      return systemInfo;
    } catch (error) {
      console.error('Error getting system info:', error);
      return null;
    }
  }
});
