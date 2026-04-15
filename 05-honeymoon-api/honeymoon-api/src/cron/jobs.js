'use strict';
/**
 * Cron Jobs — Feature #12
 * Requires: npm install node-cron
 */
let cron;
try { cron = require('node-cron'); } catch {
  console.warn('[Cron] node-cron not installed. Run: npm install node-cron');
}

const { autoApprovePendingPayouts } = require('../services/payout.service');

function start() {
  if (!cron) return;

  /* Auto-approve eligible payouts — daily at 02:00 UAE time (UTC+4 = 22:00 UTC) */
  cron.schedule('0 22 * * *', async () => {
    console.log('[Cron] Running auto-approve payouts...');
    try {
      const count = await autoApprovePendingPayouts();
      console.log(`[Cron] Auto-approved ${count} payouts`);
    } catch (e) {
      console.error('[Cron] Auto-approve error:', e.message);
    }
  }, { timezone: 'UTC' });

  /* Clean up expired OTP records — daily at 03:00 UTC */
  cron.schedule('0 3 * * *', async () => {
    try {
      const prisma = require('../config/prisma');
      const { count } = await prisma.otpRecord.deleteMany({
        where: { expiresAt: { lt: new Date() }, verified: false },
      });
      if (count > 0) console.log(`[Cron] Cleaned ${count} expired OTP records`);
    } catch (e) {
      console.error('[Cron] OTP cleanup error:', e.message);
    }
  }, { timezone: 'UTC' });

  /* Clean up revoked refresh tokens older than 30 days — weekly Sunday 04:00 UTC */
  cron.schedule('0 4 * * 0', async () => {
    try {
      const prisma = require('../config/prisma');
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const { count } = await prisma.refreshToken.deleteMany({
        where: { OR: [{ revokedAt: { lt: cutoff } }, { expiresAt: { lt: new Date() } }] },
      });
      if (count > 0) console.log(`[Cron] Cleaned ${count} expired refresh tokens`);
    } catch (e) {
      console.error('[Cron] Token cleanup error:', e.message);
    }
  }, { timezone: 'UTC' });

  console.log('[Cron] Jobs scheduled: payout auto-approve (daily 02:00 UAE), OTP cleanup (daily 03:00 UTC), token cleanup (weekly)');
}

module.exports = { start };
