const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== تسجيل كل الطلبات (للتحليل) =====
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  console.log(`   Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, req.body);
  }
  next();
});

app.use(cors());
app.use(express.json());

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
// ===== نقاط النهاية (مثل Astutech + إضافية) =====
// ============================================

// 1. الصفحة الرئيسية (404 مثل Astutech)
app.get('/', (req, res) => {
  console.log('📄 Root path requested (404)');
  res.status(404).send('Not Found');
});

// 2. نقطة الإصدارات (verAddr)
app.get('/version', (req, res) => {
  console.log('📦 Version requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// 3. نقطة تسجيل الدخول (srv0010)
app.post('/api/login', (req, res) => {
  console.log('🔐 Login requested');
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
    server: {
      name: 'STRAVEX VIP PROXY',
      version: '2.0.0',
      resetGuest: true
    }
  });
});

// 4. نقطة التحقق من صحة اللعبة
app.get('/api/validate', (req, res) => {
  console.log('✅ Validate requested');
  res.json({
    status: "success",
    valid: true,
    message: "Game version is supported"
  });
});

// 5. نقطة إعدادات اللعبة
app.get('/api/config', (req, res) => {
  console.log('⚙️ Config requested');
  res.json({
    status: "success",
    config: {
      gameVersion: "OB53",
      serverTime: Date.now(),
      maintenance: false,
      maxPlayers: 500
    }
  });
});

// 6. نقطة البنج (Ping)
app.get('/api/ping', (req, res) => {
  console.log('🏓 Ping requested');
  res.json({ status: 'success', pong: true });
});

// 7. نقطة المصادقة (Auth)
app.post('/api/auth', (req, res) => {
  console.log('🔑 Auth requested');
  res.json({
    status: 'success',
    token: 'fake_token_' + Date.now(),
    user: {
      id: 'guest_' + Date.now(),
      name: 'STRAVEX_VIP'
    }
  });
});

// 8. نقطة إعادة تعيين الضيف
app.post('/guest/reset', (req, res) => {
  console.log('🔄 Guest reset requested');
  res.json({
    status: 'success',
    guestId: 'guest_' + Date.now(),
    reset: true
  });
});

// 9. جلب جميع الأغراض
app.get('/api/items', (req, res) => {
  console.log('📦 Items list requested');
  res.json({
    status: 'success',
    total: itemsDB.length,
    items: itemsDB
  });
});

// 10. جلب غرض محدد
app.get('/api/item/:id', (req, res) => {
  console.log(`🔍 Item ${req.params.id} requested`);
  const item = itemsDB.find(i => i.id == req.params.id);
  if (item) {
    res.json({ status: 'success', item });
  } else {
    res.status(404).json({ status: 'error', message: 'Item not found' });
  }
});

// ============================================
// ===== نقاط إضافية شائعة (لتغطية كل الطلبات) =====
// ============================================

app.get('/api/check', (req, res) => {
  console.log('✅ Check requested');
  res.json({ status: 'success', message: 'OK' });
});

app.get('/api/status', (req, res) => {
  console.log('📊 Status requested');
  res.json({ status: 'success', game: 'Free Fire', version: 'OB53' });
});

app.post('/api/init', (req, res) => {
  console.log('🚀 Init requested');
  res.json({
    status: 'success',
    sessionId: 'session_' + Date.now(),
    serverTime: Date.now()
  });
});

app.get('/api/game/config', (req, res) => {
  console.log('🎮 Game config requested');
  res.json({
    status: 'success',
    config: {
      map: 'Bermuda',
      maxPlayers: 50,
      gameMode: 'Battle Royale'
    }
  });
});

// نقطة لتحديثات اللعبة (Game Updates)
app.get('/api/update', (req, res) => {
  console.log('🔄 Update requested');
  res.json({
    status: 'success',
    updateAvailable: false,
    latestVersion: 'OB53'
  });
});

// ============================================
// ===== نقطة عامة (Catch-All) للتشخيص =====
// ============================================
app.all('*', (req, res) => {
  console.log(`⚠️ Unhandled request: ${req.method} ${req.path}`);
  res.json({
    status: 'success',
    message: 'Endpoint received (catch-all)',
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query
  });
});

// ===== تشغيل السيرفر =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║     ███████╗████████╗██████╗  █████╗ ██╗   ║
║     ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║   ║
║     ███████╗   ██║   ██████╔╝███████║██║   ║
║     ╚════██║   ██║   ██╔══██╗██╔══██║██║   ║
║     ███████║   ██║   ██║  ██║██║  ██║██║   ║
║     ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ║
║                                           ║
║     STRAVEX VIP PROXY (Astutech Clone)    ║
║          [ FULLY LOGGED ]                 ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
  console.log(`🌐 URL: https://stravex-vip-proxy.onrender.com`);
  console.log('\n📋 All endpoints:');
  console.log('  - GET /version');
  console.log('  - POST /api/login');
  console.log('  - GET /api/validate');
  console.log('  - GET /api/config');
  console.log('  - GET /api/ping');
  console.log('  - POST /api/auth');
  console.log('  - POST /guest/reset');
  console.log('  - GET /api/items');
  console.log('  - GET /api/item/:id');
  console.log('  - GET /api/check');
  console.log('  - GET /api/status');
  console.log('  - POST /api/init');
  console.log('  - GET /api/game/config');
  console.log('  - GET /api/update');
  console.log('  - * (catch-all for any other request)\n');
});