const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
// ===== نقاط النهاية (مثل Astutech) =====
// ============================================

// 1. الصفحة الرئيسية (404 مثل Astutech)
app.get('/', (req, res) => {
  res.status(404).send('Not Found');
});

// 2. نقطة الإصدارات (verAddr)
app.get('/version', (req, res) => {
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// 3. نقطة تسجيل الدخول (srv0010)
app.post('/api/login', (req, res) => {
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
  res.json({
    status: "success",
    valid: true,
    message: "Game version is supported"
  });
});

// 5. نقطة إعدادات اللعبة
app.get('/api/config', (req, res) => {
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
  res.json({ status: 'success', pong: true });
});

// 7. نقطة المصادقة (Auth)
app.post('/api/auth', (req, res) => {
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
  res.json({
    status: 'success',
    guestId: 'guest_' + Date.now(),
    reset: true
  });
});

// 9. جلب جميع الأغراض
app.get('/api/items', (req, res) => {
  res.json({
    status: 'success',
    total: itemsDB.length,
    items: itemsDB
  });
});

// 10. جلب غرض محدد
app.get('/api/item/:id', (req, res) => {
  const item = itemsDB.find(i => i.id == req.params.id);
  if (item) {
    res.json({ status: 'success', item });
  } else {
    res.status(404).json({ status: 'error', message: 'Item not found' });
  }
});

// ============================================
// ===== نقطة عامة (Catch-All) للتشخيص =====
// ============================================
app.all('*', (req, res) => {
  console.log(`📥 Request received: ${req.method} ${req.path}`);
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
  console.log(`✅ STRAVEX PROXY (Astutech Clone) running on port ${PORT}`);
  console.log(`📦 Items loaded: ${itemsDB.length}`);
  console.log(`🌐 Server URL: https://stravex-vip-proxy.onrender.com`);
});