const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(express.json());

// ===== قاعدة البيانات =====
let itemsDB = [];
try {
  const data = fs.readFileSync(path.join(__dirname, 'items_db.json'), 'utf8');
  itemsDB = JSON.parse(data);
  console.log(`✅ Loaded ${itemsDB.length} items`);
} catch {
  itemsDB = [];
}

// ===== نقاط رئيسية =====
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'STRAVEX VIP PROXY (PROXY)', version: '2.0.0' });
});

app.get('/versionver.php', (req, res) => {
  res.json({ latest: "OB53", supported: ["OB53", "OB52", "OB51"], forceUpdate: false });
});

app.post('/api/login', (req, res) => {
  res.json({
    status: 'success',
    user: {
      id: 'guest_' + Date.now(),
      name: 'STRAVEX_VIP',
      diamonds: 999999,
      gold: 999999,
      items: itemsDB.map(item => item.id)
    }
  });
});

// ===== إعادة توجيه السيرفرات الخارجية (PROXY) =====
app.get('/config.uca.cloud.unity3d.com', async (req, res) => {
  try {
    const response = await fetch('https://config.uca.cloud.unity3d.com' + req.url);
    const data = await response.json();
    res.json(data);
  } catch {
    res.json({ status: 'success', config: { unityVersion: '2022.3.47f1' } });
  }
});

app.get('/cdp.cloud.unity3d.com', async (req, res) => {
  try {
    const response = await fetch('https://cdp.cloud.unity3d.com' + req.url);
    const data = await response.json();
    res.json(data);
  } catch {
    res.json({ status: 'success', analytics: true });
  }
});

app.get('/graph.facebook.com', async (req, res) => {
  try {
    const response = await fetch('https://graph.facebook.com' + req.url);
    const data = await response.json();
    res.json(data);
  } catch {
    res.json({ status: 'success', data: { id: 'fake_id' } });
  }
});

app.get('/rslw0r.inapps.appsflyersdk.com', async (req, res) => {
  try {
    const response = await fetch('https://rslw0r.inapps.appsflyersdk.com' + req.url);
    const data = await response.json();
    res.json(data);
  } catch {
    res.json({ status: 'success', ads: { enabled: false } });
  }
});

app.get('/firebaselogging-pa.googleapis.com', async (req, res) => {
  try {
    const response = await fetch('https://firebaselogging-pa.googleapis.com' + req.url);
    const data = await response.json();
    res.json(data);
  } catch {
    res.json({ status: 'success', logging: { enabled: true } });
  }
});

// ===== نقطة عامة =====
app.all('*', (req, res) => {
  res.json({ status: 'success', message: 'Catch-all (PROXY)', path: req.path });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ STRAVEX PROXY (PROXY) running on port ${PORT}`);
});