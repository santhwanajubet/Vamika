const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
require('./config/cloudinary');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const orderRoutes = require('./routes/order.routes');
const reviewRoutes = require('./routes/review.routes');
const couponRoutes = require('./routes/coupon.routes');
const addressRoutes = require('./routes/address.routes');
const uploadRoutes = require('./routes/upload.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const paymentRoutes = require('./routes/payment.routes');
const swaggerSpec = require('./config/swagger');

const app = express();

// ─── Security headers ────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
}));

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
  max: process.env.NODE_ENV === 'development' ? 100 : 5,
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

// ─── Swagger docs ─────────────────────────────────
app.get('/api/docs.js', (_req, res) => {
  res.type('application/javascript');
  res.send(`var spec = ${JSON.stringify(swaggerSpec)};`);
});
app.get('/api/docs/', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vamika API Docs</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>html { box-sizing: border-box; overflow-y: scroll; } body { margin:0; background: #fafafa; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script src="/api/docs.js"></script>
  <script>
    window.onload = () => SwaggerUIBundle({
      spec: spec,
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      plugins: [SwaggerUIBundle.plugins.DownloadUrl],
      layout: 'StandaloneLayout'
    });
  </script>
</body>
</html>`);
});

// ─── Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);

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
