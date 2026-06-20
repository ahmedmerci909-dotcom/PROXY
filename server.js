const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== الشعار المخصص (سيظهر بعد تسجيل الدخول) =====
const SPLASH_BANNER = `
╔═══════════════════════════════════════════╗
║                                           ║
║     ███████╗████████╗██████╗  █████╗ ██╗   ║
║     ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║   ║
║     ███████╗   ██║   ██████╔╝███████║██║   ║
║     ╚════██║   ██║   ██╔══██╗██╔══██║██║   ║
║     ███████║   ██║   ██║  ██║██║  ██║██║   ║
║     ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ║
║                                           ║
║     ██╗   ██╗██╗██████╗  ██████╗  ██████╗  ║
║     ██║   ██║██║██╔══██╗██╔═══██╗██╔═══██╗ ║
║     ██║   ██║██║██████╔╝██║   ██║██║   ██║ ║
║     ╚██╗ ██╔╝██║██╔═══╝ ██║   ██║██║   ██║ ║
║      ╚████╔╝ ██║██║     ╚██████╔╝╚██████╔╝ ║
║       ╚═══╝  ╚═╝╚═╝      ╚═════╝  ╚═════╝  ║
║                                           ║
║          [ PROXY SERVERS ]                 ║
║                                           ║
╚═══════════════════════════════════════════╝
`;

// ===== الإعدادات المدمجة (مشابهة لـ Astutech) =====
const CONFIG = {
  serverName: "STRAVEX VIP PROXY",
  version: "2.0.0",
  resetGuest: true,
  features: {
    unlockAllItems: true,
    infiniteDiamonds: true,
    infiniteGold: true
  }
};

// ===== إصدارات اللعبة (مشابهة لـ Astutech) =====
const VERSIONS = {
  latest: "OB53",
  supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
  forceUpdate: false,
  updateUrl: "https://your-app-name.onrender.com/update"
};

// ===== تحميل قاعدة البيانات =====
let itemsDB = [];
try {
  const data = fs.readFileSync(path.join(__dirname, 'items_db.json'), 'utf8');
  itemsDB = JSON.parse(data);
  console.log(`✅ Loaded ${itemsDB.length} items`);
} catch {
  console.warn('⚠️ No items database found');
  itemsDB = [];
}

// ============================================
// ===== نقاط النهاية (Endpoints) =====
// ============================================

// 1. الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    server: CONFIG.serverName,
    version: CONFIG.version,
    endpoints: {
      version: '/version',
      guest_reset: '/guest/reset',
      login: '/api/login',
      items: '/api/items',
      item: '/api/item/:id'
    }
  });
});

// 2. نقطة التحديثات (مشابهة لـ Astutech)
app.get('/version', (req, res) => {
  res.json(VERSIONS);
});

// 3. نقطة إعادة تعيين الضيف (مشابهة لـ Astutech)
app.post('/guest/reset', (req, res) => {
  const newGuestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  res.json({
    status: 'success',
    guestId: newGuestId,
    reset: true
  });
});

// 4. نقطة تسجيل الدخول (בה מופיע الشعار)
app.post('/api/login', (req, res) => {
  const userId = req.body.userId || 'guest_' + Date.now();
  res.json({
    status: 'success',
    user: {
      id: userId,
      name: 'STRAVEX_VIP',
      diamonds: 999999,
      gold: 999999,
      level: 100,
      items: itemsDB.map(item => item.id)
    },
    splash: SPLASH_BANNER,  // ← الشعار يظهر هنا
    message: '🔥 STRAVEX VIP PROXY | All Items Unlocked!',
    server: {
      name: CONFIG.serverName,
      version: CONFIG.version,
      resetGuest: CONFIG.resetGuest
    }
  });
});

// 5. جلب جميع الأغراض
app.get('/api/items', (req, res) => {
  res.json({
    status: 'success',
    total: itemsDB.length,
    items: itemsDB
  });
});

// 6. جلب غرض محدد بالمعرف
app.get('/api/item/:id', (req, res) => {
  const item = itemsDB.find(i => i.id == req.params.id);
  if (item) {
    res.json({ status: 'success', item });
  } else {
    res.status(404).json({ status: 'error', message: 'Item not found' });
  }
});

// ===== تشغيل السيرفر =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ${CONFIG.serverName} running on port ${PORT}`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
});