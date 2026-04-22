require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const connectDB = require('./config/db');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Serve frontend static files ───────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/patient', require('./routes/patient'));
app.use('/api/doctor',  require('./routes/doctor'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: '🏥 SwasthyaSetu+ API running!' })
);

// ── Catch-all: serve index.html for any non-API, non-file route ────
app.get('*', (req, res) => {
  // Only serve index.html if the request doesn't have a file extension
  if (req.path.includes('.')) {
    return res.status(404).send('Not Found');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('  🏥  SwasthyaSetu+  ────────────────────────');
    console.log(`  🚀  Server  →  http://localhost:${PORT}`);
    console.log(`  📡  API     →  http://localhost:${PORT}/api`);
    console.log('  ────────────────────────────────────────────');
    console.log('  Open your browser and go to:');
    console.log(`  👉  http://localhost:${PORT}`);
    console.log('');
  });
});
