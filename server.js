const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

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
const ITEMS_DB = [
  { id: "909000001", name: "Golden Eagle Skin", type: "Weapon Skin", rarity: "Mythic" },
  { id: "909000002", name: "Ice Dragon Skin", type: "Weapon Skin", rarity: "Epic" },
  { id: "912000001", name: "Chrono", type: "Character", rarity: "Mythic" },
  { id: "700000001", name: "Shadow", type: "Pet", rarity: "Mythic" },
];

// ============================================
// ===== نقاط النهاية الأساسية =====
// ============================================

// 1. Ping (الرقم 2)
app.get('/Ping', (req, res) => {
  console.log('🏓 Ping requested');
  res.json({ status: "success", pong: true });
});

// 2. Login (الرقم 3)
app.post('/Login', (req, res) => {
  console.log('🔐 Login requested');
  res.json({
    status: "success",
    userId: "STRAVEX_" + Date.now(),
    token: "fake_token_" + Date.now()
  });
});

// 3. GetWallet (الرقم 8)
app.get('/GetWallet', (req, res) => {
  console.log('💰 GetWallet requested');
  res.json({ status: "success", diamonds: 99999999, gold: 99999999 });
});

// 4. GetBackpack (الرقم 9)
app.get('/GetBackpack', (req, res) => {
  console.log('🎒 GetBackpack requested');
  res.json({ status: "success", items: ITEMS_DB });
});

// 5. GetStore (الرقم 40)
app.get('/GetStore', (req, res) => {
  console.log('🏪 GetStore requested');
  res.json({ status: "success", store: ITEMS_DB });
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
      gold: 99999999,
      items: ITEMS_DB.map(item => item.id)
    }
  });
});

// 7. LoginGetSplash (الرقم 55)
app.get('/LoginGetSplash', (req, res) => {
  console.log('🖼️ LoginGetSplash requested');
  res.json({
    status: "success",
    splash: {
      type: "image",
      url: "https://i.ibb.co/MymkpY7q/file-00000000a3b872439f678a30c7446893.webp",
      text: "STRAVE Z FUEAR"
    }
  });
});

// 8. MajorLogin (الرقم 352)
app.post('/MajorLogin', (req, res) => {
  console.log('🔑 MajorLogin requested');
  res.json({
    status: "success",
    sessionId: "session_" + Date.now(),
    user: {
      id: "STRAVEX_" + Date.now(),
      name: "STRAVEX_VIP",
      diamonds: 99999999,
      gold: 99999999,
      level: 100,
      items: ITEMS_DB.map(item => item.id)
    },
    splash: {
      type: "image",
      url: "https://i.ibb.co/MymkpY7q/file-00000000a3b872439f678a30c7446893.webp",
      text: "STRAVE Z FUEAR"
    }
  });
});

// 9. GetLoginData (الرقم 354)
app.post('/GetLoginData', (req, res) => {
  console.log('🔐 GetLoginData requested');
  res.json({
    status: "success",
    loginData: {
      userId: "STRAVEX_" + Date.now(),
      token: "fake_token_" + Date.now(),
      sessionId: "session_" + Date.now()
    },
    user: {
      id: "STRAVEX_" + Date.now(),
      name: "STRAVEX_VIP",
      diamonds: 99999999,
      gold: 99999999,
      level: 100,
      items: ITEMS_DB.map(item => item.id)
    },
    splash: {
      type: "image",
      url: "https://i.ibb.co/MymkpY7q/file-00000000a3b872439f678a30c7446893.webp",
      text: "STRAVE Z FUEAR"
    },
    message: "🔥 STRAVEX VIP PROXY | All Items Unlocked!",
    server: {
      name: "STRAVEX VIP PROXY",
      version: "2.0.0",
      resetGuest: true
    }
  });
});

// ============================================
// ===== نقطة عامة (Catch-All) =====
// ============================================
app.all('*', (req, res) => {
  console.log(`⚠️ Unhandled: ${req.method} ${req.path}`);
  res.json({
    status: "success",
    message: "Request received (catch-all)",
    path: req.path,
    method: req.method
  });
});

// ===== تشغيل السيرفر =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 URL: https://stravex-vip-proxy.onrender.com`);
});