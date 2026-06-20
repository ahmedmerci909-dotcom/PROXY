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
// ===== محاكاة نقاط Astutech فقط =====
// ============================================

// 1. نقطة الإصدارات (version.astutech.online)
app.get('/versionver.php', (req, res) => {
  console.log('📦 versionver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// 2. نقطة المصادقة (authsrv1.astutech.online)
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

// 3. نقطة تسجيل الدخول (srv0010.astutech.online)
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

// ============================================
// ===== نقطة عامة لأي طلب آخر =====
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
  console.log(`✅ STRAVEX PROXY (Astutech Clone) running on port ${PORT}`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
});