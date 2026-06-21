const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== الرؤوس المطلوبة =====
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(cors());
app.use(express.json());

// ===== تسجيل الطلبات =====
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
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
  console.warn('⚠️ No items database found, using default');
  itemsDB = [
    {"id": "909000001", "name": "Mythic Skin 1", "type": "Weapon"},
    {"id": "909000002", "name": "Mythic Skin 2", "type": "Weapon"},
    {"id": "909000003", "name": "Epic Bundle 1", "type": "Bundle"},
    {"id": "912000001", "name": "Character 1", "type": "Character"},
    {"id": "700000001", "name": "Pet 1", "type": "Pet"}
  ];
}

// ============================================
// ===== نقاط الإصدارات (Version) =====
// ============================================
app.get('/versioner.phpver.php', (req, res) => {
  console.log('📦 /versioner.phpver.php requested');
  res.json({ latest: "OB53", supported: ["OB53", "OB52", "OB51", "OB50", "OB49"], forceUpdate: false });
});

app.get('/versionver.php', (req, res) => {
  console.log('📦 /versionver.php requested');
  res.json({ latest: "OB53", supported: ["OB53", "OB52", "OB51", "OB50", "OB49"], forceUpdate: false });
});

// ============================================
// ===== نقاط ServiceMessageTypeHTTP (الأساسية) =====
// ============================================

// 1. Ping (الرقم 2)
app.get('/Ping', (req, res) => {
  console.log('🏓 Ping requested');
  res.json({ status: "success", pong: true });
});

// 2. Login (الرقم 3)
app.post('/Login', (req, res) => {
  console.log('🔐 Login requested');
  res.json({ status: "success", userId: "STRAVEX_" + Date.now(), token: "fake_token_" + Date.now() });
});

// 3. GetWallet (الرقم 8)
app.get('/GetWallet', (req, res) => {
  console.log('💰 GetWallet requested');
  res.json({ status: "success", diamonds: 99999999, gold: 99999999 });
});

// 4. GetBackpack (الرقم 9)
app.get('/GetBackpack', (req, res) => {
  console.log('🎒 GetBackpack requested');
  res.json({ status: "success", items: itemsDB });
});

// 5. GetStore (الرقم 40)
app.get('/GetStore', (req, res) => {
  console.log('🏪 GetStore requested');
  res.json({ status: "success", store: itemsDB.map(item => ({ ...item, price: 100, currency: "diamonds" })) });
});

// 6. LoginGetProfile (الرقم 108)
app.get('/LoginGetProfile', (req, res) => {
  console.log('👤 LoginGetProfile requested');
  res.json({
    status: "success",
    profile: {
      id: "STRAVEX_" + Date.now(),
      name: "STRAVEX_VIP",
      level: 100,
      diamonds: 99999999,
      gold: 99999999
    }
  });
});

// 7. MajorLogin (الرقم 352)
app.post('/MajorLogin', (req, res) => {
  console.log('🔑 MajorLogin requested');
  res.json({ status: "success", sessionId: "session_" + Date.now(), user: { id: "STRAVEX_" + Date.now(), name: "STRAVEX_VIP", diamonds: 99999999, gold: 99999999 } });
});

// 8. GetLoginData (الرقم 354)
app.post('/GetLoginData', (req, res) => {
  console.log('🔐 GetLoginData requested');
  res.json({
    status: "success",
    loginData: { userId: "STRAVEX_" + Date.now(), token: "fake_token_" + Date.now(), sessionId: "session_" + Date.now() },
    user: { id: "STRAVEX_" + Date.now(), name: "STRAVEX_VIP", diamonds: 99999999, gold: 99999999, level: 100, items: itemsDB.map(item => item.id) }
  });
});

// ============================================
// ===== نقطة عامة (Catch-All) =====
// ============================================
app.all('*', (req, res) => {
  console.log(`⚠️ Unhandled: ${req.method} ${req.path}`);
  res.json({ status: "success", message: "Request received (catch-all)", path: req.path, method: req.method });
});

// ===== تشغيل السيرفر =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 URL: https://stravex-vip-proxy.onrender.com`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
  console.log(`🔑 Endpoints added: Ping, Login, GetWallet, GetBackpack, GetStore, LoginGetProfile, MajorLogin, GetLoginData`);
});