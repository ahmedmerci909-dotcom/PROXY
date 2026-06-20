const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== الشعار المخصص =====
const SPLASH_BANNER = `
╔═══════════════════════════════════════════╗
║     ███████╗████████╗██████╗  █████╗ ██╗   ║
║     ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║   ║
║     ███████╗   ██║   ██████╔╝███████║██║   ║
║     ╚════██║   ██║   ██╔══██╗██╔══██║██║   ║
║     ███████║   ██║   ██║  ██║██║  ██║██║   ║
║     ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ║
║                                           ║
║     STRAVEX VIP PROXY                     ║
║          [ ACTIVE ]                       ║
╚═══════════════════════════════════════════╝
`;

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

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    server: 'STRAVEX VIP PROXY',
    version: '2.0.0',
    endpoints: {
      version: '/version',
      login: '/api/login',
      items: '/api/items',
      item: '/api/item/:id',
      validate: '/api/validate',
      player: '/api/player'
    }
  });
});

// === نقاط Astutech-style ===
app.get('/version', (req, res) => {
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

app.get('/api/validate', (req, res) => {
  res.json({
    status: "success",
    valid: true,
    message: "Game version is supported"
  });
});

app.post('/api/player', (req, res) => {
  const userId = req.body.userId || 'guest';
  res.json({
    status: "success",
    user: {
      id: userId,
      name: "STRAVEX_VIP",
      diamonds: 999999,
      gold: 999999,
      level: 100,
      items: itemsDB.map(item => item.id)
    },
    splash: SPLASH_BANNER,
    message: "🔥 STRAVEX VIP PROXY | All Items Unlocked!"
  });
});

// === نقاط السيرفر الأساسية ===
app.post('/api/login', (req, res) => {
  const userId = req.body.userId || 'guest';
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
    splash: SPLASH_BANNER,
    message: '🔥 STRAVEX VIP PROXY | All Items Unlocked!'
  });
});

app.get('/api/items', (req, res) => {
  res.json({
    status: 'success',
    total: itemsDB.length,
    items: itemsDB
  });
});

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
  console.log(SPLASH_BANNER);
  console.log(`✅ STRAVEX VIP PROXY running on port ${PORT}`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
});