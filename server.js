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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
// ===== جميع نقاط الإصدارات =====
// ============================================

// المسار الأصلي
app.get('/versionver.php', (req, res) => {
  console.log('📦 versionver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// المسار المكرر
app.get('/versionver.phpver.php', (req, res) => {
  console.log('📦 versionver.phpver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// المسار الجديد (الذي تطلبه اللعبة)
app.get('/versioner.phpver.php', (req, res) => {
  console.log('📦 versioner.phpver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// ============================================
// ===== نقطة تسجيل الدخول =====
// ============================================
app.post('/api/login', (req, res) => {
  console.log('🔐 Login requested');
  res.json({
    status: "success",
    user: {
      id: "STRAVEX_" + Date.now(),
      name: "STRAVEX_VIP",
      diamonds: 99999999,
      gold: 99999999,
      level: 100,
      items: itemsDB.map(item => item.id)
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
// ===== نقاط عامة =====
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
║     (With All Version Paths)              ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
  console.log(`🌐 URL: https://stravex-vip-proxy.onrender.com`);
  console.log(`🖼️  Splash image URL embedded.\n`);
});