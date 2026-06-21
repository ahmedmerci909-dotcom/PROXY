const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== الرؤوس المطلوبة (مثل Astutech) =====
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
  itemsDB = [];
}

// ============================================
// ===== نقطة البداية (مثل Astutech) =====
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
// ===== نقاط Astutech الأخرى =====
// ============================================

// 1. تسجيل الدخول (بنفس تنسيق Astutech)
app.post('/api/login', (req, res) => {
  console.log('🔐 Login requested');
  res.json({
    status: 0,  // Astutech يستخدم 0 للنجاح
    message: "success",
    data: {
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
    }
  });
});

// 2. المصادقة (بنفس تنسيق Astutech)
app.post('/auth', (req, res) => {
  console.log('🔑 Auth requested');
  res.json({
    status: 0,
    message: "success",
    data: {
      token: "fake_token_" + Date.now(),
      sessionId: "session_" + Date.now(),
      user: {
        id: "guest_" + Date.now(),
        name: "STRAVEX_VIP"
      }
    }
  });
});

// 3. جلب الأغراض
app.get('/api/items', (req, res) => {
  console.log('📦 Items requested');
  res.json({
    status: 0,
    message: "success",
    data: {
      total: itemsDB.length,
      items: itemsDB
    }
  });
});

// 4. الإعدادات
app.get('/api/config', (req, res) => {
  console.log('⚙️ Config requested');
  res.json({
    status: 0,
    message: "success",
    data: {
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
    status: 0,
    message: "success",
    data: {
      valid: true,
      message: "Game version is supported"
    }
  });
});

// 6. نقطة البنج (Ping)
app.get('/api/ping', (req, res) => {
  console.log('🏓 Ping requested');
  res.json({
    status: 0,
    message: "success",
    data: {
      pong: true
    }
  });
});

// ============================================
// ===== نقطة عامة (Catch-All) =====
// ============================================
app.all('*', (req, res) => {
  console.log(`⚠️ Unhandled: ${req.method} ${req.path}`);
  res.json({
    status: 0,
    message: "success",
    data: {
      path: req.path,
      method: req.method
    }
  });
});

// ===== تشغيل السيرفر =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║     STRAVEX VIP PROXY                     ║
║     (Astutech Full Emulation)             ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
  console.log(`🌐 URL: https://stravex-vip-proxy.onrender.com`);
  console.log(`\n📋 All endpoints with Astutech headers and format.\n`);
});