const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Fixes Node 20+ DNS SRV resolution issues

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const http = require('http');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*', methods: ['GET','POST'] } });

// ─── Middleware ───────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' });
app.use('/api/', limiter);

// ─── Routes ──────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/consultations', require('./routes/consultations'));
app.use('/api/medicines',     require('./routes/medicines'));
app.use('/api/doctors',       require('./routes/doctors'));
app.use('/api/appointments',  require('./routes/appointments'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/payments',      require('./routes/payments'));
app.use('/api/admin',         require('./routes/admin'));

// Health check
app.get('/', (req, res) => {
  const { getAvailableProviders } = require('./utils/aiEngine');
  res.json({
    status: '✅ Sehat AI v2.0 Running',
    version: '2.0.0',
    availableAIs: getAvailableProviders().map(p => p.name),
    time: new Date().toISOString(),
  });
});

// 404
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

// ─── Socket.IO ───────────────────────────────────────
io.on('connection', (socket) => {
  socket.on('join_user', (userId) => { if (userId) socket.join(userId.toString()); });
  socket.on('disconnect', () => {});
});
global.io = io;

// ─── MongoDB + Start ─────────────────────────────────
mongoose.connect(process.env.MONGODB_URI, {
  family: 4 // Forces IPv4, fixing Node 24 'querySrv ECONNREFUSED' errors
})
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Sehat AI Backend running on port ${PORT}`);
      console.log(`✅ Visit: http://localhost:${PORT}`);
      const { getAvailableProviders } = require('./utils/aiEngine');
      const ais = getAvailableProviders();
      if (ais.length > 0) console.log(`✅ AI Providers ready: ${ais.map(p=>p.name).join(', ')}`);
      else console.log('⚠️  No AI keys configured — add keys to .env for AI features');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    console.log('💡 Fix: Add correct MONGODB_URI to backend/.env');
    console.log('💡 Get free MongoDB at: mongodb.com/atlas');
    process.exit(1);
  });

// Weekly backup
require('./utils/backupScheduler');

module.exports = { app, io };
