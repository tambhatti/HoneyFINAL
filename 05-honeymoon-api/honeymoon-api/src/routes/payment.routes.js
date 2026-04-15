'use strict';
const express  = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const ctrl     = require('../controllers/payment.controller');

/* ── Shared payment routes (user + vendor) ─────────────────────────────────── */
const shared = express.Router();

shared.post('/initiate',               authenticate,              ctrl.initiatePayment);
shared.post('/verify',                 authenticate,              ctrl.verifyPayment);
shared.get('/my',                      authenticate,              ctrl.getMyPayments);
shared.get('/:id/receipt',             authenticate,              ctrl.downloadReceipt);

// Apple Pay
shared.post('/apple-pay/session',      authenticate,              ctrl.getApplePaySession);
shared.post('/apple-pay/process',      authenticate, authorize('user'), ctrl.processApplePay);
shared.get('/apple-pay/config',        authenticate,              ctrl.getApplePayConfig);

// PayTabs webhook — raw body MUST be preserved for signature verification
// This endpoint is called by PayTabs, NOT by users, so no auth middleware
shared.post(
  '/callback',
  express.raw({ type: ['application/json', '*/*'] }),
  (req, res, next) => {
    // Store raw body string for signature verification
    if (Buffer.isBuffer(req.body)) {
      req.rawBody = req.body.toString('utf8');
      try { req.body = JSON.parse(req.rawBody); } catch { req.body = {}; }
    }
    next();
  },
  ctrl.handleWebhook
);

/* ── Admin payment routes ──────────────────────────────────────────────────── */
const admin = express.Router();

admin.get('/',                         authenticate, authorize('admin'), ctrl.getAllPayments);
admin.get('/payouts',                  authenticate, authorize('admin'), ctrl.getPayouts);
admin.patch('/payouts/:id/approve',    authenticate, authorize('admin'), ctrl.approvePayout);
admin.post('/payouts/:id/process',     authenticate, authorize('admin'), ctrl.processPayout);
admin.post('/payouts/bulk-process',    authenticate, authorize('admin'), ctrl.bulkProcessPayouts);

/* ── Vendor earnings route ──────────────────────────────────────────────────── */
const vendor = express.Router();
vendor.get('/earnings',                authenticate, authorize('vendor'), ctrl.getEarnings);

module.exports = { shared, admin, vendor };
