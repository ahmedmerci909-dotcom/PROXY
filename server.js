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

// ============================================
// ===== قاعدة البيانات =====
// ============================================
const ITEMS_DB = [
  { id: "909000001", name: "Golden Eagle Skin", type: "Weapon Skin", rarity: "Mythic" },
  { id: "909000002", name: "Ice Dragon Skin", type: "Weapon Skin", rarity: "Epic" },
  { id: "909000003", name: "Cyber Punk Skin", type: "Weapon Skin", rarity: "Rare" },
  { id: "909000004", name: "Neon Striker Skin", type: "Weapon Skin", rarity: "Epic" },
  { id: "909000005", name: "Phoenix Fire Skin", type: "Weapon Skin", rarity: "Mythic" },
  { id: "912000001", name: "Chrono", type: "Character", rarity: "Mythic" },
  { id: "912000002", name: "Alok", type: "Character", rarity: "Epic" },
  { id: "700000001", name: "Shadow", type: "Pet", rarity: "Mythic" },
  { id: "700000002", name: "Falcon", type: "Pet", rarity: "Epic" },
  { id: "710000001", name: "M4A1", type: "Weapon", rarity: "Mythic" },
  { id: "710000002", name: "AK-47", type: "Weapon", rarity: "Epic" },
  { id: "720000001", name: "Victory Dance", type: "Emote", rarity: "Epic" },
  { id: "5001", name: "Health Pack", type: "Consumable", rarity: "Common" },
  { id: "5002", name: "Shield Potion", type: "Consumable", rarity: "Common" },
];

// ============================================
// ===== الشعار (Splash Image) =====
// ============================================
const SPLASH_IMAGE = "https://i.ibb.co/MymkpY7q/file-00000000a3b872439f678a30c7446893.webp";

// ============================================
// ===== جميع نقاط الإصدارات =====
// ============================================

// المسار الجديد (الذي تطلبه اللعبة)
app.get('/versioner.phpver.phpver.php', (req, res) => {
  console.log('📦 /versioner.phpver.phpver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// المسارات القديمة (احتياطياً)
app.get('/versioner.phpver.php', (req, res) => {
  console.log('📦 /versioner.phpver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false
  });
});

app.get('/versionver.php', (req, res) => {
  console.log('📦 /versionver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false
  });
});

// ============================================
// ===== نقاط تسجيل الدخول =====
// ============================================
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
      items: ITEMS_DB.map(item => item.id),
      inventory: ITEMS_DB
    },
    splash: {
      type: "image",
      url: SPLASH_IMAGE,
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
      url: SPLASH_IMAGE,
      text: "STRAVE Z FUEAR"
    }
  });
});

app.post('/Login', (req, res) => {
  console.log('🔐 Login requested');
  res.json({
    status: "success",
    userId: "STRAVEX_" + Date.now(),
    token: "fake_token_" + Date.now(),
    splash: {
      type: "image",
      url: SPLASH_IMAGE,
      text: "STRAVE Z FUEAR"
    }
  });
});

// ============================================
// ===== نقاط البيانات =====
// ============================================
app.get('/GetWallet', (req, res) => {
  console.log('💰 GetWallet requested');
  res.json({
    status: "success",
    diamonds: 99999999,
    gold: 99999999
  });
});

app.get('/GetBackpack', (req, res) => {
  console.log('🎒 GetBackpack requested');
  res.json({
    status: "success",
    items: ITEMS_DB
  });
});

app.get('/GetStore', (req, res) => {
  console.log('🏪 GetStore requested');
  res.json({
    status: "success",
    store: ITEMS_DB.map(item => ({
      ...item,
      price: 100,
      currency: "diamonds"
    }))
  });
});

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

// ============================================
// ===== نقاط عامة =====
// ============================================
app.get('/Ping', (req, res) => {
  console.log('🏓 Ping requested');
  res.json({ status: "success", pong: true });
});

app.get('/api/config', (req, res) => {
  console.log('⚙️ Config requested');
  res.json({
    gameVersion: "OB53",
    serverTime: Date.now(),
    maintenance: false
  });
});

app.get('/api/items', (req, res) => {
  console.log('📦 Items requested');
  res.json({
    status: "success",
    total: ITEMS_DB.length,
    items: ITEMS_DB
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
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║     STRAVEX VIP PROXY                     ║
║     (Final Server)                        ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Items loaded: ${ITEMS_DB.length}`);
  console.log(`💎 Diamonds: 99,999,999`);
  console.log(`🪙 Gold: 99,999,999`);
  console.log(`🖼️  Splash image URL: ${SPLASH_IMAGE}`);
  console.log(`🌐 URL: https://stravex-vip-proxy.onrender.com\n`);
});