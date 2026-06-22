const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== قاعدة البيانات =====
const ITEMS_DB = [
  { id: "909000001", name: "Golden Eagle Skin", type: "Weapon Skin", rarity: "Mythic" },
  { id: "909000002", name: "Ice Dragon Skin", type: "Weapon Skin", rarity: "Epic" },
  { id: "912000001", name: "Chrono", type: "Character", rarity: "Mythic" },
  { id: "700000001", name: "Shadow", type: "Pet", rarity: "Mythic" },
];

// ============================================
// ===== نقاط النهاية =====
// ============================================

// 1. GetLoginData
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

// 2. MajorLogin
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
    },
    message: "🔥 STRAVEX VIP PROXY | All Items Unlocked!"
  });
});

// 3. Guest Token
app.post('/oauth/guest/token/grant', (req, res) => {
  console.log('🔑 Guest token requested');
  res.json({
    access_token: "fake_token_" + Date.now(),
    open_id: "fake_open_id_" + Date.now(),
    expires_in: 3600
  });
});

// 4. Version Check
app.get('/versioner.phpver.phpver.php', (req, res) => {
  console.log('📦 Version check requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// 5. Ping
app.get('/Ping', (req, res) => {
  console.log('🏓 Ping requested');
  res.json({ status: "success", pong: true });
});

// 6. نقطة عامة (Catch-All)
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
  console.log(`📦 Items loaded: ${ITEMS_DB.length}`);
  console.log(`💎 Diamonds: 99,999,999`);
  console.log(`🪙 Gold: 99,999,999`);
});