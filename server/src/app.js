const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');

const app = express();

// ─── Security headers ────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// ─── Rate limiting ───────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many auth attempts' },
});

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// ─── Body parsing ────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Logging ─────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health check ────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok' });
});

// ─── Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── 404 handler ─────────────────────────────────
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Error handler ───────────────────────────────
app.use(errorHandler);

module.exports = app;
