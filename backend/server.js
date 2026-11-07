import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { routeBooking } from './routes/route.booking.js';
import { routeReports } from './routes/route.reports.js';
import { routeTests } from './routes/route.tests.js';
import { routeContact } from './routes/route.contact.js';
import { routeDoctors } from './routes/route.doctors.js';
import { routeAdmin } from './routes/route.admin.js';
import { routeGallery } from './routes/route.gallery.js';
import { routeNotice } from './routes/route.notice.js';

import { middlewareRateLimiter } from './middleware/middleware.rateLimiter.js';
import { ensureAdminAccount } from './controllers/controller.admin.js';
import { seedDefaultDoctors } from './controllers/controller.doctors.js';
import { seedDefaultGallery } from './controllers/controller.gallery.js';
import { seedDefaultNotices } from './controllers/controller.notice.js';
import { seedDefaultTests } from './controllers/controller.tests.js';
import { startSyncScheduler } from './utils/scheduler.sync.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, cron jobs, mobile or curl requests with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow local development and common deployment preview domains
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));
app.use(middlewareRateLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/bookings', routeBooking);
app.use('/api/reports', routeReports);
app.use('/api/tests', routeTests);
app.use('/api/contact', routeContact);
app.use('/api/doctors', routeDoctors);
app.use('/api/admin', routeAdmin);
app.use('/api/gallery', routeGallery);
app.use('/api/notices', routeNotice);

// ─── Root & Health Check Endpoints ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'New Life Care Healthcare Gateway API',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'New Life Care Healthcare Gateway',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

app.get(['/ping', '/api/ping'], (req, res) => {
  res.json({
    status: 'alive',
    message: 'Backend server active and running',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health/ping-status', (req, res) => {
  res.json({ success: true, data: getKeepAliveStats() });
});

app.get('/api/health/test-ping', async (req, res) => {
  const result = await pingServerNow();
  res.json({
    success: result.success,
    message: 'Keep-alive test ping executed',
    result,
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── Database + Server Start ──────────────────────────────────────────────────
const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');

      // Initialize default data & admin record
      await ensureAdminAccount();
      await seedDefaultDoctors();
      await seedDefaultGallery();
      await seedDefaultNotices();
      await seedDefaultTests();
    }

    // Start 24-Hour Test Sync Scheduler
    startSyncScheduler();

    app.listen(PORT, () => {
      console.log(`🚀 New Life Care Gateway & Middleman Server active on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
