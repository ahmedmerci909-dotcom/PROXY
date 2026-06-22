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
  res.setHeader('X-Response-Time', Date.now().toString());
  res.setHeader('Connection', 'keep-alive');
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== تسجيل الطلبات =====
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, JSON.stringify(req.body).substring(0, 200));
  }
  next();
});

// ===== تحميل قاعدة البيانات =====
let ITEMS_DB = [];

try {
  const data = fs.readFileSync(path.join(__dirname, 'ff_item_ids_only.json'), 'utf8');
  const ids = JSON.parse(data);
  
  ITEMS_DB = ids.map(item => {
    if (typeof item === 'string' || typeof item === 'number') {
      return {
        id: item.toString(),
        name: `Item_${item}`,
        type: "Unknown",
        rarity: "Common"
      };
    }
    return item;
  });
  
  console.log(`✅ Loaded ${ITEMS_DB.length} items from ff_item_ids_only.json.`);
} catch (err) {
  console.warn('⚠️ ff_item_ids_only.json not found, using default items.');
  ITEMS_DB = [
    { id: "909000001", name: "Golden Eagle Skin", type: "Weapon Skin", rarity: "Mythic" },
    { id: "909000002", name: "Ice Dragon Skin", type: "Weapon Skin", rarity: "Epic" },
    { id: "912000001", name: "Chrono", type: "Character", rarity: "Mythic" },
    { id: "700000001", name: "Shadow", type: "Pet", rarity: "Mythic" },
    { id: "912000021", name: "DJ Alok", type: "Character", rarity: "Mythic" },
    { id: "912000012", name: "Sakura", type: "Character", rarity: "Epic" },
  ];
}

const SPLASH_IMAGE = "https://i.ibb.co/MymkpY7q/file-00000000a3b872439f678a30c7446893.webp";

// ===== دوال مساعدة =====
function getServerTime() {
  return Math.floor(Date.now() / 1000);
}

function getBaseUserData() {
  const userId = "STRAVEX_" + Date.now();
  return {
    id: userId,
    name: "STRAVEX_VIP",
    diamonds: 99999999,
    gold: 99999999,
    level: 100,
    experience: 9999999,
    nextLevelExp: 9999999,
    battlePass: {
      active: true,
      level: 100,
      tier: "premium",
      points: 999999
    },
    clan: {
      id: "clan_stravex",
      name: "STRAVEX",
      role: "leader"
    },
    region: "global",
    platform: "android",
    avatar: "default_001",
    banner: "banner_001",
    created: 1700000000,
    lastLogin: getServerTime(),
    banned: false,
    muted: false,
    items: ITEMS_DB.map(item => item.id)
  };
}

function successResponse(data = {}) {
  return {
    code: 0,
    message: "success",
    timestamp: getServerTime(),
    ...data
  };
}

// ============================================
// ===== نقاط النهاية =====
// ============================================

// 1. الإصدارات
app.get('/versioner.php', (req, res) => {
  console.log('📦 Version check');
  res.json(successResponse({
    version: "OB53",
    versionCode: 530001,
    latestVersion: "OB53",
    minSupportedVersion: "OB49",
    forceUpdate: false,
    updateUrl: "https://play.google.com/store/apps/details?id=com.dts.freefireth",
    host: req.headers.host
  }));
});

// 2. تسجيل الدخول الرئيسي
app.post('/Login', (req, res) => {
  console.log('🔐 Login');
  res.json(successResponse({
    userId: "STRAVEX_" + getServerTime(),
    token: "stravex_token_" + getServerTime() + "_" + Math.random().toString(36).substr(2, 9),
    sessionId: "session_" + getServerTime(),
    serverTime: getServerTime(),
    splash: {
      type: "image",
      url: SPLASH_IMAGE,
      text: "STRAVEX VIP",
      duration: 5000
    },
    user: getBaseUserData(),
    inventory: {
      items: ITEMS_DB,
      skins: [],
      pets: [],
      emotes: [],
      vehicles: []
    }
  }));
});

// 3. GetLoginData
app.post('/GetLoginData', (req, res) => {
  console.log('🔐 GetLoginData');
  res.json(successResponse({
    loginData: {
      userId: "STRAVEX_" + getServerTime(),
      token: "stravex_token_" + getServerTime(),
      sessionId: "session_" + getServerTime(),
      serverTime: getServerTime()
    },
    user: getBaseUserData(),
    inventory: {
      items: ITEMS_DB,
      all: ITEMS_DB
    },
    splash: {
      type: "image",
      url: SPLASH_IMAGE,
      text: "STRAVEX VIP",
      duration: 5000
    },
    server: {
      name: "STRAVEX VIP",
      version: "2.0.0",
      resetGuest: true,
      region: "global",
      time: getServerTime()
    }
  }));
});

// 4. MajorLogin
app.post('/MajorLogin', (req, res) => {
  console.log('🔑 MajorLogin');
  res.json(successResponse({
    sessionId: "session_" + getServerTime(),
    user: getBaseUserData(),
    inventory: {
      items: ITEMS_DB,
      all: ITEMS_DB
    },
    splash: {
      type: "image",
      url: SPLASH_IMAGE,
      text: "STRAVEX VIP",
      duration: 5000
    },
    server: {
      time: getServerTime(),
      maintenance: false,
      timezone: "UTC"
    }
  }));
});

// 5. المحفظة
app.get('/GetWallet', (req, res) => {
  res.json(successResponse({
    diamonds: 99999999,
    gold: 99999999,
    tokens: 999999,
    credits: 999999
  }));
});

// 6. الحقيبة
app.get('/GetBackpack', (req, res) => {
  res.json(successResponse({
    items: ITEMS_DB,
    maxSlots: 10000,
    usedSlots: ITEMS_DB.length
  }));
});

// 7. المتجر
app.get('/GetStore', (req, res) => {
  res.json(successResponse({
    categories: [
      {
        id: "weapons",
        name: "Weapons",
        items: ITEMS_DB.slice(0, 20).map(i => ({ ...i, price: 0, currency: "diamonds", discount: 0 }))
      },
      {
        id: "characters",
        name: "Characters",
        items: ITEMS_DB.slice(0, 10).map(i => ({ ...i, price: 0, currency: "gold", discount: 100 }))
      },
      {
        id: "pets",
        name: "Pets",
        items: ITEMS_DB.slice(0, 5).map(i => ({ ...i, price: 0, currency: "diamonds", discount: 50 }))
      },
      {
        id: "skins",
        name: "Skins",
        items: ITEMS_DB.slice(0, 30).map(i => ({ ...i, price: 0, currency: "diamonds", discount: 0 }))
      }
    ],
    featured: ITEMS_DB.slice(0, 5)
  }));
});

// 8. البروفايل
app.get('/LoginGetProfile', (req, res) => {
  res.json(successResponse({
    profile: getBaseUserData(),
    stats: {
      matches: 9999,
      wins: 9999,
      kills: 99999,
      deaths: 0,
      kd: 999.99,
      level: 100,
      rank: "Heroic",
      rankPoints: 10000,
      maxRank: "Heroic",
      headshots: 50000,
      assists: 25000,
      survivalTime: 999999
    }
  }));
});

// 9. Ping
app.get('/Ping', (req, res) => {
  res.json(successResponse({
    pong: true,
    time: getServerTime(),
    serverDelay: 1
  }));
});

// 10. إعدادات اللعبة
app.get('/GetConfig', (req, res) => {
  res.json(successResponse({
    appVersion: "OB53",
    resourceVersion: "v2.0.0",
    features: {
      battlePass: true,
      ranked: true,
      clan: true,
      pets: true,
      vehicles: true,
      emotes: true,
      guild: true,
      tournament: true
    },
    limits: {
      maxFriends: 200,
      maxClanMembers: 50,
      maxInventory: 10000
    },
    servers: [
      { name: "STRAVEX VIP", region: "global", status: "online", players: 9999, ping: 1 }
    ]
  }));
});

// 11. مزامنة الوقت
app.post('/SyncTime', (req, res) => {
  res.json(successResponse({
    serverTime: getServerTime(),
    clientTime: req.body?.clientTime || 0,
    diff: 0
  }));
});

app.get('/SyncTime', (req, res) => {
  res.json(successResponse({
    serverTime: getServerTime()
  }));
});

// 12. قائمة الأصدقاء
app.get('/GetFriends', (req, res) => {
  res.json(successResponse({
    friends: [],
    total: 0,
    online: 0,
    requests: []
  }));
});

// 13. الإشعارات
app.get('/GetNotifications', (req, res) => {
  res.json(successResponse({
    notifications: [],
    total: 0,
    unread: 0
  }));
});

// 14. المتصدرين
app.get('/GetLeaderboard', (req, res) => {
  res.json(successResponse({
    leaderboard: [
      { rank: 1, name: "STRAVEX_VIP", level: 100, points: 99999, region: "global" }
    ],
    myRank: 1,
    totalPlayers: 1
  }));
});

// 15. جلب الأغراض
app.get('/api/items', (req, res) => {
  res.json(successResponse({
    total: ITEMS_DB.length,
    items: ITEMS_DB
  }));
});

// 16. جلب غرض معين
app.get('/api/items/:id', (req, res) => {
  const item = ITEMS_DB.find(i => i.id === req.params.id);
  if (item) {
    res.json(successResponse({ item }));
  } else {
    res.json(successResponse({
      item: null,
      message: "Item not found"
    }));
  }
});

// 17. حالة السيرفر
app.get('/status', (req, res) => {
  res.json(successResponse({
    server: "STRAVEX VIP PROXY",
    version: "2.0.0",
    uptime: process.uptime(),
    itemsLoaded: ITEMS_DB.length,
    memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 + " MB"
  }));
});

// 18. Catch-All
app.all('*', (req, res) => {
  const knownPaths = [
    '/versioner.php', '/Login', '/GetLoginData', '/MajorLogin',
    '/GetWallet', '/GetBackpack', '/GetStore', '/LoginGetProfile',
    '/Ping', '/GetConfig', '/SyncTime', '/GetFriends',
    '/GetNotifications', '/GetLeaderboard', '/api/items', '/status'
  ];
  
  if (req.path.startsWith('/versioner')) {
    return res.redirect(307, '/versioner.php');
  }
  
  console.log(`⚠️ Unhandled: ${req.method} ${req.path}`);
  
  // للـ OPTIONS نرجع 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.json(successResponse({
    path: req.path,
    method: req.method,
    handled: false,
    message: "Endpoint not specifically handled"
  }));
});

// ===== تشغيل السيرفر =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════╗
║     STRAVEX VIP PROXY v2.0                ║
║     Free Fire Private Server              ║
║     All Items & Unlimited Resources       ║
╚═══════════════════════════════════════════╝
  `);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📦 Items loaded: ${ITEMS_DB.length}`);
  console.log(`💎 Diamonds: 99,999,999`);
  console.log(`🪙 Gold: 99,999,999`);
  console.log(`🖼️  Splash: ${SPLASH_IMAGE}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📡 Status: http://localhost:${PORT}/status\n`);
});
