const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== تسجيل الطلبات =====
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// ===== قاعدة البيانات =====
let itemsDB = [];
try {
  const data = fs.readFileSync(path.join(__dirname, 'items_db.json'), 'utf8');
  itemsDB = JSON.parse(data);
  console.log(`✅ Loaded ${itemsDB.length} items`);
} catch {
  itemsDB = [];
}

// ============================================
// ===== نقطة البداية الوحيدة (مثل Astutech) =====
// ============================================
app.get('/versionver.php', (req, res) => {
  console.log('📦 versionver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update",
    // توزيع العناوين (مثل Astutech)
    servers: {
      login: "https://stravex-vip-proxy.onrender.com/api/login",
      auth: "https://stravex-vip-proxy.onrender.com/auth",
      items: "https://stravex-vip-proxy.onrender.com/api/items",
      config: "https://stravex-vip-proxy.onrender.com/api/config",
      validate: "https://stravex-vip-proxy.onrender.com/api/validate"
    }
  });
});

// ============================================
// ===== النقاط الفرعية (التي يوزعها الرابط الرئيسي) =====
// ============================================

// 1. تسجيل الدخول
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

// 2. المصادقة
app.post('/auth', (req, res) => {
  console.log('🔑 Auth requested');
  res.json({
    status: "success",
    token: "fake_token_" + Date.now(),
    sessionId: "session_" + Date.now(),
    user: {
      id: "guest_" + Date.now(),
      name: "STRAVEX_VIP"
    }
  });
});

// 3. جلب الأغراض
app.get('/api/items', (req, res) => {
  console.log('📦 Items requested');
  res.json({
    status: "success",
    total: itemsDB.length,
    items: itemsDB
  });
});

// 4. الإعدادات
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

// 5. التحقق
app.get('/api/validate', (req, res) => {
  console.log('✅ Validate requested');
  res.json({
    status: "success",
    valid: true,
    message: "Game version is supported"
  });
});

// ============================================
// ===== نقطة عامة (Catch-All) =====
// ============================================
app.all('*', (req, res) => {
  console.log(`⚠️ Unhandled: ${req.method} ${req.path}`);
  res.json({
    status: "success",
    message: "Request received",
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
║     (Astutech Clone - Single URL)         ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
  console.log(`🌐 URL: https://stravex-vip-proxy.onrender.com`);
  console.log(`\n📋 Single entry point: /versionver.php`);
  console.log(`   This URL distributes requests to sub-endpoints.\n`);
});