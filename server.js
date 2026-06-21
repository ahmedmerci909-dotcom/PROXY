const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== تسجيل جميع الطلبات (للتحليل) =====
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  console.log(`   Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, req.body);
  }
  next();
});

// ===== قاعدة البيانات =====
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
// ===== نقطة الإصدارات (المسار الصحيح) =====
// ============================================
app.get('/versionver.php', (req, res) => {
  console.log('📦 versionver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// ============================================
// ===== نقاط محتملة (قد تطلبها اللعبة) =====
// ============================================
app.get('/version', (req, res) => {
  console.log('📦 /version requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false
  });
});

app.get('/api/version', (req, res) => {
  console.log('📦 /api/version requested');
  res.json({ version: "OB53", supported: ["OB53", "OB52", "OB51"] });
});

app.get('/config', (req, res) => {
  console.log('⚙️ /config requested');
  res.json({
    gameVersion: "OB53",
    serverTime: Date.now(),
    maintenance: false
  });
});

app.get('/api/config', (req, res) => {
  console.log('⚙️ /api/config requested');
  res.json({
    gameVersion: "OB53",
    serverTime: Date.now(),
    maintenance: false
  });
});

// ============================================
// ===== نقاط تسجيل الدخول والمصادقة =====
// ============================================
app.post('/api/login', (req, res) => {
  console.log('🔐 Login requested');
  res.json({
    status: "success",
    user: {
      id: "guest_" + Date.now(),
      name: "STRAVEX_VIP",
      diamonds: 999999,
      gold: 999999,
      level: 100,
      items: itemsDB.map(item => item.id)
    },
    server: {
      name: "STRAVEX VIP PROXY",
      version: "2.0.0",
      resetGuest: true
    }
  });
});

app.post('/auth', (req, res) => {
  console.log('🔑 Auth requested');
  res.json({
    status: "success",
    token: "fake_token_" + Date.now(),
    sessionId: "session_" + Date.now()
  });
});

app.post('/api/auth', (req, res) => {
  console.log('🔑 /api/auth requested');
  res.json({
    status: "success",
    token: "fake_token_" + Date.now(),
    sessionId: "session_" + Date.now()
  });
});

// ============================================
// ===== نقاط الأغراض =====
// ============================================
app.get('/api/items', (req, res) => {
  console.log('📦 Items requested');
  res.json({
    status: "success",
    total: itemsDB.length,
    items: itemsDB
  });
});

app.get('/items', (req, res) => {
  console.log('📦 /items requested');
  res.json({
    status: "success",
    total: itemsDB.length,
    items: itemsDB
  });
});

// ============================================
// ===== نقطة عامة (Catch-All) للتشخيص =====
// ============================================
app.all('*', (req, res) => {
  console.log(`⚠️ Unhandled: ${req.method} ${req.path}`);
  res.json({
    status: "success",
    message: "Request received (catch-all)",
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body
  });
});

// ===== تشغيل السيرفر =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║     STRAVEX VIP PROXY (CATCH-ALL)         ║
║           Path Detector                    ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
  console.log(`🌐 URL: https://stravex-vip-proxy.onrender.com`);
  console.log(`\n📋 All requests will be logged and responded to.`);
  console.log(`   Check Render logs to see the exact path requested.\n`);
});