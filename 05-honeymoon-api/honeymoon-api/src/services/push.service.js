'use strict';
const prisma = require('../config/prisma');

/* Expo Push Notifications — Feature #2
 * Install: npm install expo-server-sdk
 * Docs: https://docs.expo.dev/push-notifications/sending-notifications/
 */
let Expo;
try {
  ({ Expo } = require('expo-server-sdk'));
} catch {
  console.warn('[Push] expo-server-sdk not installed. Run: npm install expo-server-sdk');
}

const expo = Expo ? new Expo() : null;

/* ── Register / update a push token ──────────────────────────────────────── */
async function registerToken(token, userId, vendorId, platform = 'ios') {
  if (!token) return;
  await prisma.pushToken.upsert({
    where: { token },
    update: { userId: userId || null, vendorId: vendorId || null, platform },
    create: { token, userId: userId || null, vendorId: vendorId || null, platform },
  });
}

/* ── Send push to a specific user ──────────────────────────────────────────── */
async function sendToUser(userId, { title, body, data = {} }) {
  return _sendToTargets({ userId }, title, body, data);
}

/* ── Send push to a specific vendor ───────────────────────────────────────── */
async function sendToVendor(vendorId, { title, body, data = {} }) {
  return _sendToTargets({ vendorId }, title, body, data);
}

/* ── Broadcast to all users, all vendors, or everyone ─────────────────────── */
async function broadcast(audience, { title, body, data = {} }) {
  const where = audience === 'vendors' ? { vendorId: { not: null } }
              : audience === 'users'   ? { userId:   { not: null } }
              : {};                        // all
  return _sendToTargets(where, title, body, data);
}

async function _sendToTargets(where, title, body, data) {
  if (!expo) {
    console.log(`[Push] DEV MODE — would send "${title}" to`, where);
    return { sent: 0, failed: 0, dev: true };
  }

  const tokens = await prisma.pushToken.findMany({ where });
  if (!tokens.length) return { sent: 0, failed: 0 };

  const messages = tokens
    .filter(t => Expo.isExpoPushToken(t.token))
    .map(t => ({ to: t.token, sound: 'default', title, body, data }));

  if (!messages.length) return { sent: 0, failed: 0 };

  const chunks  = expo.chunkPushNotifications(messages);
  let sent = 0, failed = 0;

  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      receipts.forEach(r => { if (r.status === 'ok') sent++; else failed++; });
    } catch (e) {
      console.error('[Push] Send error:', e.message);
      failed += chunk.length;
    }
  }

  console.log(`[Push] Sent ${sent}, failed ${failed} — "${title}"`);
  return { sent, failed };
}

module.exports = { registerToken, sendToUser, sendToVendor, broadcast };
