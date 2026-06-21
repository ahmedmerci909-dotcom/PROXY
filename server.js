const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== نقطة الإصدارات فقط (مثل Astutech) =====
app.get('/versionver.php', (req, res) => {
  console.log('📦 versionver.php requested');
  res.json({
    latest: "OB53",
    supported: ["OB53", "OB52", "OB51", "OB50", "OB49"],
    forceUpdate: false,
    updateUrl: "https://stravex-vip-proxy.onrender.com/update"
  });
});

// ===== نقطة عامة لأي طلب آخر (لكن لا تغير شيئاً) =====
app.all('*', (req, res) => {
  console.log(`⚠️ Unhandled: ${req.method} ${req.path}`);
  res.status(404).send('Not Found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Astutech Clone running on port ${PORT}`);
});