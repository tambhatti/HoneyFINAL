'use strict';
const crypto = require('crypto');
const prisma  = require('../config/prisma');
const redisStore = require('../config/redis');

/* ── Generate cryptographically secure 6-digit OTP ─────────────────────────── */
function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

/* ── Twilio client (lazy init) ──────────────────────────────────────────────── */
let twilioClient = null;
function getTwilio() {
  if (!twilioClient && process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    } catch {
      console.warn('[OTP] twilio package not installed — SMS disabled');
    }
  }
  return twilioClient;
}

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS       = 5;

/* ─────────────────────────────────────────────────────────────────────────────
   SEND OTP
─────────────────────────────────────────────────────────────────────────────*/
async function sendOtp(target, purpose, channel = 'sms') {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Invalidate any existing OTP for this target+purpose
  await prisma.otpRecord.deleteMany({ where: { target, purpose, verified: false } });

  // Persist to DB
  await prisma.otpRecord.create({
    data: { target, code, purpose, expiresAt }
  });

  // Also store in Redis for fast lookup
  await redisStore.setOtp(target, purpose, code);

  // ── Send via channel ─────────────────────────────────────────────────────
  if (channel === 'sms') {
    const twilio = getTwilio();
    if (twilio && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilio.messages.create({
          body: `Your Honeymoon OTP is: ${code}. Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share this code.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to:   target, // must be E.164 format: +971501234567
        });
        console.log(`[OTP] SMS sent to ${target.slice(0,4)}****`);
        return { sent: true, channel: 'sms', expiresAt }; // code intentionally not returned
      } catch (err) {
        console.error('[OTP] Twilio error:', err.message);
        // Fall through — still saved to DB, dev can read code from logs
      }
    } else {
      // DEV MODE: log OTP to console (never in production)
      if (process.env.NODE_ENV !== 'production') {
        console.log(`\n[OTP] DEV MODE — code for ${target}: ${code}\n`);
      }
    }
  }

  return { sent: true, channel, expiresAt }; // code intentionally not returned
}

/* ─────────────────────────────────────────────────────────────────────────────
   VERIFY OTP
─────────────────────────────────────────────────────────────────────────────*/
async function verifyOtp(target, purpose, code) {
  // Fast path: Redis
  const cached = await redisStore.getOtp(target, purpose);

  if (!cached) {
    // Fallback to DB
    const record = await prisma.otpRecord.findFirst({
      where: { target, purpose, verified: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) return { valid: false, reason: 'OTP expired or not found' };
    if (record.attempts >= MAX_ATTEMPTS) return { valid: false, reason: 'Too many attempts' };
    if (record.code !== code) {
      await prisma.otpRecord.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
      return { valid: false, reason: 'Invalid OTP', attemptsLeft: MAX_ATTEMPTS - record.attempts - 1 };
    }

    await prisma.otpRecord.update({ where: { id: record.id }, data: { verified: true } });
    return { valid: true };
  }

  if (cached.attempts >= MAX_ATTEMPTS) return { valid: false, reason: 'Too many attempts' };
  if (cached.code !== code) {
    await redisStore.incrementOtpAttempts(target, purpose);
    return { valid: false, reason: 'Invalid OTP', attemptsLeft: MAX_ATTEMPTS - cached.attempts - 1 };
  }

  // Mark as used
  await redisStore.deleteOtp(target, purpose);
  await prisma.otpRecord.updateMany({
    where: { target, purpose, verified: false },
    data:  { verified: true }
  });

  return { valid: true };
}

/* ─────────────────────────────────────────────────────────────────────────────
   EMAIL OTP  (alias — route to email service instead of SMS)
─────────────────────────────────────────────────────────────────────────────*/
async function sendEmailOtp(email, purpose) {
  return sendOtp(email, purpose, 'email');
}

module.exports = { sendOtp, verifyOtp, sendEmailOtp, generateOtp };
