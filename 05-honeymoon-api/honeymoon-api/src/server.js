'use strict';
require('dotenv').config();
/* ── Env validation — fail fast with a clear message ─────────────────────── */
const REQUIRED_ENV = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`\n[STARTUP] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[STARTUP] Copy .env.example → .env and fill in the values.\n');
  process.exit(1);
}


const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const compression = require('compression');
const rateLimit   = require('express-rate-limit');

const authRoutes    = require('./routes/auth.routes');
const adminRoutes   = require('./routes/admin.routes');
const vendorRoutes  = require('./routes/vendor.routes');
const userRoutes    = require('./routes/user.routes');
const uploadRoutes  = require('./routes/upload.routes');
const paymentRoutes = require('./routes/payment.routes');
const chatRoutes   = require('./routes/chat.routes');
const pushRoutes   = require('./routes/push.routes');

const { errorHandler, notFoundHandler } = require('./utils/response');

const app  = express();
const PORT = process.env.PORT || 5000;
const V    = '/api/v1';

/* ── Security & utilities ─────────────────────────────────────────────────────*/
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (process.env.CORS_ORIGIN || '*').split(',').map(s => s.trim()),
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// NOTE: payment callback uses express.raw — mount BEFORE express.json
app.use((req, res, next) => {
  if (req.path.includes('/payments/callback')) return next();
  express.json({ limit: '10mb' })(req, res, next);
});
app.use(express.urlencoded({ extended: true }));

/* ── Rate limiting ─────────────────────────────────────────────────────────────*/
const apiLimiter  = rateLimit({ windowMs: 15*60*1000, max: 500 });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 20, message: { success:false, message:'Too many auth attempts' } });
const otpLimiter  = rateLimit({ windowMs: 60*1000,    max: 3,  message: { success:false, message:'Too many OTP requests' } });
app.use(V, apiLimiter);
app.use(`${V}/auth`, authLimiter);
app.use(`${V}/auth/phone/send-otp`, otpLimiter);
app.use(`${V}/auth/forgot-password`, otpLimiter);

/* B-13: User-ID-keyed rate limiter for auth (prevents distributed brute force) */
const userAuthLimiter = rateLimit({
  windowMs: 15*60*1000, max: 10,
  keyGenerator: (req) => req.body?.email || req.ip,
  message: { success:false, message:'Too many attempts from this account' }
});
app.use(`${V}/auth/admin/login`,    userAuthLimiter);
app.use(`${V}/auth/vendor/login`,   userAuthLimiter);
app.use(`${V}/auth/user/login`,     userAuthLimiter);
app.use(`${V}/auth/reset-password`, userAuthLimiter);



/* Feature #6: Apple Pay domain verification */
app.get('/.well-known/apple-developer-merchantid-domain-association', (req, res) => {
  const filePath = process.env.APPLE_PAY_DOMAIN_FILE || './certs/apple-developer-merchantid-domain-association';
  const fs = require('fs');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/plain');
    return res.sendFile(require('path').resolve(filePath));
  }
  // Placeholder — replace with actual file content from Apple Pay console
  res.setHeader('Content-Type', 'text/plain');
  res.send('REPLACE_WITH_ACTUAL_APPLE_PAY_DOMAIN_VERIFICATION_FILE_CONTENT');
});

/* ── Health ─────────────────────────────────────────────────────────────────── */
app.get('/health', async (_, res) => {
  let db = 'unavailable';
  try { const p = require('./config/prisma'); await p.$queryRaw`SELECT 1`; db = 'ok'; } catch {}
  res.json({ status:'ok', version:'1.0.0', timestamp:new Date().toISOString(), environment:process.env.NODE_ENV, database:db, session:'4-payments' });
});

/* ── API Info ─────────────────────────────────────────────────────────────────*/
app.get(V, (_, res) => res.json({
  name: 'Honeymoon Project API', version: '1.0.0', session: 'Session 4 — Payments',
  totalEndpoints: 168,
  actors: {
    admin:  `${V}/admin`,
    vendor: `${V}/vendor`,
    user:   `${V}/user`,
  },
  newInSession4: [
    'POST /api/v1/payments/initiate           — Create PayTabs payment page URL',
    'POST /api/v1/payments/callback           — PayTabs webhook (signature verified)',
    'POST /api/v1/payments/verify             — Verify payment status with gateway',
    'POST /api/v1/payments/apple-pay/session  — Apple Pay merchant session',
    'POST /api/v1/payments/apple-pay/process  — Process Apple Pay token',
    'GET  /api/v1/payments/apple-pay/config   — Apple Pay payment request config',
    'GET  /api/v1/payments/my                 — User/vendor payment history',
    'GET  /api/v1/payments/:id/receipt        — Download PDF receipt',
    'GET  /api/v1/vendor/earnings             — Vendor earnings analytics',
    'POST /api/v1/admin/payments/payouts/bulk-process — Bulk vendor payouts',
  ],
}));

/* ── Routes ─────────────────────────────────────────────────────────────────── */
app.use(`${V}/auth`,              authRoutes);
app.use(`${V}/admin`,             adminRoutes);
app.use(`${V}/vendor`,            vendorRoutes);
app.use(`${V}/user`,              userRoutes);
app.use(`${V}/upload`,            uploadRoutes);
app.use(`${V}/payments`,          paymentRoutes.shared);
app.use(`${V}/admin/payments`,    paymentRoutes.admin);
app.use(`${V}/vendor`,            paymentRoutes.vendor);
app.use(`${V}/chat`,              chatRoutes);
app.use(`${V}/push`,              pushRoutes);

/* ── 404 & error ─────────────────────────────────────────────────────────────── */
app.use(notFoundHandler);
app.use(errorHandler);

/* ── Start ───────────────────────────────────────────────────────────────────── */
async function start() {
  try { const p = require('./config/prisma'); await p.$connect(); console.log('[DB] PostgreSQL connected'); }
  catch { console.warn('[DB] PostgreSQL unavailable — set DATABASE_URL in .env\n     Run: npx prisma migrate dev'); }


  /* Start cron jobs */
  try {
    require('./cron/jobs').start();
    console.log('[Cron] Scheduled jobs started');
  } catch (e) { console.warn('[Cron] Could not start jobs:', e.message); }

  app.listen(PORT, () => {
    console.log(`\n🚀 Honeymoon API — Session 4 (Payments)`);
    console.log(`   http://localhost:${PORT}/api/v1`);
    console.log(`\n   New: PayTabs | Apple Pay | PDF Receipts | Vendor Payouts | Earnings\n`);
  });
}

process.on('SIGTERM', async () => {
  try { await require('./config/prisma').$disconnect(); } catch {}
  process.exit(0);
});

start();
module.exports = app;

/* B-12: Handle SIGINT (Ctrl+C / nodemon) for clean Prisma disconnect */
process.on('SIGINT', async () => {
  try { await require('./config/prisma').$disconnect(); } catch {}
  process.exit(0);
});
