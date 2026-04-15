'use strict';
const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM = process.env.SENDGRID_FROM_EMAIL || 'noreply@honeymoon.ae';
const BRAND = { primary: '#174a37', gold: '#CFB383', name: 'Honeymoon' };

/* ── Base HTML template ──────────────────────────────────────────────────── */
function baseTemplate(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#F5F5EF;color:#1a1a1a}
  .wrapper{max-width:600px;margin:0 auto;padding:32px 16px}
  .card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.06)}
  .header{background:${BRAND.primary};padding:32px 40px;text-align:center}
  .header h1{color:#fff;font-size:24px;font-weight:700;letter-spacing:.5px}
  .header p{color:rgba(255,255,255,.7);font-size:13px;margin-top:4px}
  .body{padding:40px}
  .greeting{font-size:18px;font-weight:600;margin-bottom:16px}
  .text{font-size:15px;line-height:1.7;color:#444;margin-bottom:16px}
  .divider{height:1px;background:#f0ebe0;margin:24px 0}
  .detail-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f5f0e8;font-size:14px}
  .detail-label{color:#888}
  .detail-value{font-weight:600;text-align:right}
  .amount{font-size:28px;font-weight:700;color:${BRAND.primary};text-align:center;margin:24px 0}
  .btn{display:inline-block;background:${BRAND.primary};color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:600;text-align:center}
  .btn-center{text-align:center;margin:28px 0}
  .badge{display:inline-block;background:#e8f5ee;color:${BRAND.primary};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
  .otp-box{background:#f9f6ef;border:2px dashed ${BRAND.gold};border-radius:12px;padding:24px;text-align:center;margin:24px 0}
  .otp-code{font-size:42px;font-weight:800;letter-spacing:12px;color:${BRAND.primary};font-family:'Courier New',monospace}
  .footer{padding:24px 40px;background:#faf8f4;text-align:center}
  .footer p{font-size:12px;color:#aaa;line-height:1.8}
  .footer a{color:${BRAND.gold};text-decoration:none}
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <h1>✦ ${BRAND.name}</h1>
      <p>Making love stories unforgettable</p>
    </div>
    <div class="body">${bodyHtml}</div>
    <div class="footer">
      <p>© 2026 Honeymoon Events Ltd. All rights reserved.<br>
      <a href="https://honeymoon.ae">honeymoon.ae</a> · 
      <a href="mailto:support@honeymoon.ae">support@honeymoon.ae</a> · 
      <a href="tel:+97141234567">+971 4 123 4567</a></p>
    </div>
  </div>
</div>
</body></html>`;
}

/* ── Send helper ────────────────────────────────────────────────────────────── */
async function send(to, subject, html) {
  if (!process.env.SENDGRID_API_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Email] DEV — To: ${to} | Subject: ${subject}`);
    }
    return { dev: true };
  }
  try {
    await sgMail.send({ to, from: FROM, subject, html });
    return { sent: true };
  } catch (e) {
    console.error('[Email] SendGrid error:', e.response?.body || e.message);
    return { sent: false, error: e.message };
  }
}

/* ── Templates ──────────────────────────────────────────────────────────────── */

exports.send = send;

exports.sendWelcome = async (to, firstName, role = 'user') => {
  const roleText = role === 'vendor' ? 'Vendor Partner' : 'Member';
  const html = baseTemplate('Welcome to Honeymoon', `
    <p class="greeting">Welcome, ${firstName}! 🎉</p>
    <p class="text">You've joined Honeymoon as a <strong>${roleText}</strong>. We're thrilled to have you as part of our community dedicated to crafting unforgettable love stories.</p>
    ${role === 'vendor' ? `<p class="text">Your vendor account is currently <strong>pending admin approval</strong>. You'll receive an email once approved — usually within 24 hours.</p>` : `<p class="text">Start exploring UAE's finest honeymoon vendors, build your dream budget, and let our AI planner guide you to your perfect day.</p>`}
    <div class="btn-center"><a href="https://app.honeymoon.ae" class="btn">Get Started</a></div>
  `);
  return send(to, `Welcome to Honeymoon, ${firstName}!`, html);
};

exports.sendOtpEmail = async (to, code, purpose = 'forgot_password') => {
  const titles = { forgot_password: 'Password Reset OTP', phone_verify: 'Phone Verification OTP', email_verify: 'Email Verification OTP' };
  const subject = titles[purpose] || 'Your OTP Code';
  const html = baseTemplate(subject, `
    <p class="greeting">Verification Code</p>
    <p class="text">Use the code below to ${purpose === 'forgot_password' ? 'reset your password' : 'verify your account'}. It expires in <strong>10 minutes</strong>.</p>
    <div class="otp-box">
      <p style="font-size:13px;color:#888;margin-bottom:12px">Your one-time code</p>
      <p class="otp-code">${code}</p>
    </div>
    <p class="text" style="font-size:13px;color:#888">If you didn't request this, you can safely ignore this email. Never share this code with anyone.</p>
  `);
  return send(to, subject, html);
};

exports.sendPaymentReceipt = async (to, firstName, payment) => {
  const html = baseTemplate('Payment Confirmed', `
    <p class="greeting">Payment Confirmed ✓</p>
    <p class="text">Hi ${firstName}, your payment has been successfully processed.</p>
    <p class="amount">AED ${(payment.amount || 0).toLocaleString()}</p>
    <div class="divider"></div>
    <div class="detail-row"><span class="detail-label">Transaction ID</span><span class="detail-value">${payment.transactionId || payment.id}</span></div>
    <div class="detail-row"><span class="detail-label">Payment Type</span><span class="detail-value">${payment.type === 'deposit' ? 'Deposit' : 'Final Payment'}</span></div>
    <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge">Completed</span></span></div>
    <div class="divider"></div>
    <div class="btn-center"><a href="https://app.honeymoon.ae/dashboard/payments" class="btn">View Receipt</a></div>
  `);
  return send(to, 'Payment Confirmed — Honeymoon', html);
};

exports.sendBookingConfirmation = async (to, firstName, booking, vendorName) => {
  const html = baseTemplate('Booking Confirmed', `
    <p class="greeting">Booking Confirmed! 🎊</p>
    <p class="text">Hi ${firstName}, your booking with <strong>${vendorName}</strong> has been confirmed.</p>
    <div class="divider"></div>
    <div class="detail-row"><span class="detail-label">Booking ID</span><span class="detail-value">#${(booking.id || '').slice(-8).toUpperCase()}</span></div>
    <div class="detail-row"><span class="detail-label">Vendor</span><span class="detail-value">${vendorName}</span></div>
    <div class="detail-row"><span class="detail-label">Event Date</span><span class="detail-value">${booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-AE', { dateStyle:'long' }) : 'TBC'}</span></div>
    <div class="detail-row"><span class="detail-label">Total Amount</span><span class="detail-value">AED ${(booking.totalAmount || 0).toLocaleString()}</span></div>
    <div class="divider"></div>
    <div class="btn-center"><a href="https://app.honeymoon.ae/my-bookings" class="btn">View Booking</a></div>
  `);
  return send(to, `Booking Confirmed — ${vendorName}`, html);
};

exports.sendPasswordResetSuccess = async (to, firstName) => {
  const html = baseTemplate('Password Reset Successful', `
    <p class="greeting">Password Updated</p>
    <p class="text">Hi ${firstName}, your password has been successfully reset. You can now log in with your new password.</p>
    <p class="text" style="font-size:13px;color:#888">If you did not make this change, please contact support immediately at <a href="mailto:support@honeymoon.ae" style="color:${BRAND.gold}">support@honeymoon.ae</a>.</p>
    <div class="btn-center"><a href="https://app.honeymoon.ae/login" class="btn">Log In</a></div>
  `);
  return send(to, 'Password Reset Successful — Honeymoon', html);
};

exports.sendVendorApproved = async (to, firstName, companyName) => {
  const html = baseTemplate('Vendor Account Approved', `
    <p class="greeting">You're approved, ${firstName}! 🎉</p>
    <p class="text"><strong>${companyName}</strong> has been approved as a Honeymoon vendor. You can now log in, complete your profile, and start receiving bookings.</p>
    <div class="btn-center"><a href="https://vendor.honeymoon.ae/login" class="btn">Access Vendor Portal</a></div>
  `);
  return send(to, `${companyName} — Vendor Account Approved`, html);
};

exports.sendPayoutProcessed = async (to, companyName, amount, transferRef) => {
  const html = baseTemplate('Payout Processed', `
    <p class="greeting">Payout Processed</p>
    <p class="text">Hi ${companyName}, your payout of <strong>AED ${amount.toFixed(2)}</strong> has been processed and should arrive within 1–3 business days.</p>
    <div class="detail-row"><span class="detail-label">Transfer Reference</span><span class="detail-value">${transferRef}</span></div>
    <div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value">AED ${amount.toFixed(2)}</span></div>
    <p class="text" style="margin-top:16px;font-size:13px;color:#888">Questions about this payout? Contact <a href="mailto:finance@honeymoon.ae" style="color:${BRAND.gold}">finance@honeymoon.ae</a>.</p>
  `);
  return send(to, `Payout Processed — AED ${amount.toFixed(2)}`, html);
};
