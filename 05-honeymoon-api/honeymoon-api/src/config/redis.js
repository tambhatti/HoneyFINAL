'use strict';
const redis = require('redis');

let client = null;

async function getRedis() {
  if (client && client.isOpen) return client;

  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('[Redis] Max reconnect attempts reached');
          return new Error('Max reconnect attempts');
        }
        return Math.min(retries * 100, 3000);
      }
    }
  });

  client.on('error', (err) => console.error('[Redis] Error:', err.message));
  client.on('connect', () => console.log('[Redis] Connected'));
  client.on('reconnecting', () => console.log('[Redis] Reconnecting...'));

  await client.connect();
  return client;
}

/* ── Key helpers ────────────────────────────────────────────────────────────── */
const OTP_TTL     = 600;  // 10 minutes
const SESSION_TTL = 3600; // 1 hour

module.exports = {
  getRedis,

  // OTP storage
  async setOtp(target, purpose, code) {
    const r = await getRedis();
    const key = `otp:${purpose}:${target}`;
    await r.setEx(key, OTP_TTL, JSON.stringify({ code, attempts: 0, createdAt: Date.now() }));
    return key;
  },

  async getOtp(target, purpose) {
    const r = await getRedis();
    const raw = await r.get(`otp:${purpose}:${target}`);
    return raw ? JSON.parse(raw) : null;
  },

  async incrementOtpAttempts(target, purpose) {
    const r = await getRedis();
    const key = `otp:${purpose}:${target}`;
    const raw = await r.get(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    data.attempts += 1;
    const ttl = await r.ttl(key);
    await r.setEx(key, ttl > 0 ? ttl : OTP_TTL, JSON.stringify(data));
    return data;
  },

  async deleteOtp(target, purpose) {
    const r = await getRedis();
    await r.del(`otp:${purpose}:${target}`);
  },

  // Login throttle
  async setLoginLock(identifier, ttlSeconds = 900) {
    const r = await getRedis();
    await r.setEx(`login_lock:${identifier}`, ttlSeconds, '1');
  },

  async isLoginLocked(identifier) {
    const r = await getRedis();
    return !!(await r.get(`login_lock:${identifier}`));
  },

  // General cache
  async set(key, value, ttl = SESSION_TTL) {
    const r = await getRedis();
    await r.setEx(key, ttl, JSON.stringify(value));
  },

  async get(key) {
    const r = await getRedis();
    const raw = await r.get(key);
    return raw ? JSON.parse(raw) : null;
  },

  async del(key) {
    const r = await getRedis();
    await r.del(key);
  },
};
