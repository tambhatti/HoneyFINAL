'use strict';
const bcrypt = require('bcryptjs');
const prisma  = require('../config/prisma');
const { tokenPair, verify, verifyRefresh } = require('../utils/jwt');
const { ok, created, fail, notFound, serverError } = require('../utils/response');
const otpService     = require('../services/otp.service');
const emailService   = require('../services/email.service');
const uaePassService = require('../services/uaepass.service');
const redisStore     = require('../config/redis');

const BCRYPT_ROUNDS      = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_MINUTES       = 15;

const strip = (obj) => {
  if (!obj) return null;
  const { password, loginAttempts, lockedUntil, ...safe } = obj;
  return safe;
};

async function handleFailedLogin(model, id, identifier) {
  const record = await prisma[model].findUnique({ where: { id } });
  const attempts = (record?.loginAttempts || 0) + 1;
  const updates  = { loginAttempts: attempts };
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    updates.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    await redisStore.setLoginLock(identifier, LOCK_MINUTES * 60);
  }
  await prisma[model].update({ where: { id }, data: updates });
  return attempts;
}

async function clearLoginLock(model, id) {
  await prisma[model].update({ where: { id }, data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() } });
}

async function storeRefreshToken(tokenStr, userId, role) {
  return prisma.refreshToken.create({
    data: {
      token:    tokenStr,
      userId:   role === 'user'   ? userId : null,
      vendorId: role === 'vendor' ? userId : null,
      adminId:  role === 'admin'  ? userId : null,
      role,
      expiresAt: new Date(Date.now() + 30 * 86400 * 1000),
    }
  });
}

/* ADMIN LOGIN */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return fail(res, 'Email and password required');
    const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });
    if (!admin) return fail(res, 'Invalid credentials', 401);
    if (await redisStore.isLoginLocked(email)) return fail(res, `Account locked for ${LOCK_MINUTES} minutes.`, 429);
    const _adminMatch = await bcrypt.compare(password, admin.password);
    if (!_adminMatch) {
      await handleFailedLogin('admin', admin.id, email);
      return fail(res, 'Invalid credentials', 401);
    }
    await clearLoginLock('admin', admin.id);
    const tokens = tokenPair({ id: admin.id, email: admin.email, role: 'admin' });
    await storeRefreshToken(tokens.refreshToken, admin.id, 'admin');
    return ok(res, { admin: strip(admin), ...tokens }, 'Login successful');
  } catch (e) { return serverError(res, e); }
};

/* VENDOR LOGIN */
exports.vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return fail(res, 'Email and password required');
    const vendor = await prisma.vendor.findUnique({ where: { email: email.toLowerCase() } });
    if (!vendor) return fail(res, 'Invalid credentials', 401);
    if (await redisStore.isLoginLocked(email)) return fail(res, 'Account locked.', 429);
    if (vendor.status === 'Rejected') return fail(res, 'Account rejected. Contact support.', 403);
    if (vendor.status === 'Pending')  return fail(res, 'Account pending approval.', 403);
    if (vendor.status === 'Inactive') return fail(res, 'Account deactivated.', 403);
    const _vendorMatch = await bcrypt.compare(password, vendor.password || '');
    if (!_vendorMatch) {
      await handleFailedLogin('vendor', vendor.id, email);
      return fail(res, 'Invalid credentials', 401);
    }
    await clearLoginLock('vendor', vendor.id);
    const tokens = tokenPair({ id: vendor.id, email: vendor.email, role: 'vendor' });
    await storeRefreshToken(tokens.refreshToken, vendor.id, 'vendor');
    return ok(res, { vendor: strip(vendor), ...tokens }, 'Login successful');
  } catch (e) { return serverError(res, e); }
};

/* VENDOR SIGNUP */
exports.vendorSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, companyName, category, location } = req.body;
    if (!email || !password || !companyName || !firstName) return fail(res, 'Required fields missing');
    if (await prisma.vendor.findUnique({ where: { email: email.toLowerCase() } }))
      return fail(res, 'Email already registered');
    const vendor = await prisma.vendor.create({
      data: { firstName, lastName, email: email.toLowerCase(),
              password: bcrypt.hashSync(password, BCRYPT_ROUNDS), phone,
              companyName, category: category || 'Venue', location: location || 'Dubai',
              status: 'Pending', isVerified: false, commissionRate: 10 }
    });
    await emailService.sendWelcome(email, firstName, 'vendor').catch(()=>{});
    return created(res, { vendor: strip(vendor) }, 'Registration successful. Awaiting admin approval.');
  } catch (e) { return serverError(res, e); }
};

/* USER LOGIN */
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return fail(res, 'Email and password required');
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return fail(res, 'Invalid credentials', 401);
    if (await redisStore.isLoginLocked(email)) return fail(res, 'Account locked.', 429);
    if (user.status !== 'Active') return fail(res, 'Account deactivated.', 403);
    const _userMatch = await bcrypt.compare(password, user.password || '');
    if (!_userMatch) {
      await handleFailedLogin('user', user.id, email);
      return fail(res, 'Invalid credentials', 401);
    }
    await clearLoginLock('user', user.id);
    const tokens = tokenPair({ id: user.id, email: user.email, role: 'user' });
    await storeRefreshToken(tokens.refreshToken, user.id, 'user');
    return ok(res, { user: strip(user), ...tokens }, 'Login successful');
  } catch (e) { return serverError(res, e); }
};

/* USER SIGNUP */
exports.userSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, gender, referralCode } = req.body;
    if (!email || !password || !firstName) return fail(res, 'Required fields missing');
    if (password.length < 8) return fail(res, 'Password must be at least 8 characters');
    if (await prisma.user.findUnique({ where: { email: email.toLowerCase() } }))
      return fail(res, 'Email already registered');
    let referralBonus = 0;
    let referrer = null;
    if (referralCode) {
      referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (referrer) {
        const cfg = await prisma.referralConfig.findUnique({ where: { id: 'singleton' } });
        referralBonus = cfg?.refereeBonus || 100;
        await prisma.user.update({ where: { id: referrer.id }, data: { loyaltyPoints: { increment: cfg?.referrerBonus || 200 } } });
      }
    }
    const refCode = `REF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2,6).toUpperCase()}`;
    const user = await prisma.user.create({
      data: { firstName, lastName, email: email.toLowerCase(),
              password: bcrypt.hashSync(password, BCRYPT_ROUNDS),
              phone, gender, referralCode: refCode,
              referredBy: referralCode || null,
              loyaltyPoints: referralBonus, status: 'Active' }
    });
    await emailService.sendWelcome(email, firstName, 'user').catch(()=>{});
    const tokens = tokenPair({ id: user.id, email: user.email, role: 'user' });
    await storeRefreshToken(tokens.refreshToken, user.id, 'user');
    return created(res, { user: strip(user), ...tokens }, 'Registration successful');
  } catch (e) { return serverError(res, e); }
};

/* UAE PASS INIT */
exports.uaePassInit = async (req, res) => {
  try {
    const role = req.query.role || 'user';
    const result = await uaePassService.getAuthorizationUrl(role);
    return ok(res, result, 'Authorization URL generated');
  } catch (e) { return serverError(res, e); }
};

/* UAE PASS CALLBACK */
exports.uaePassCallback = async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    if (error) return fail(res, error_description || 'UAE Pass failed', 400);
    const { profile, role } = await uaePassService.handleCallback(code, state);
    const { user, vendor } = await uaePassService.upsertUserFromUAEPass(profile, role);
    const entity = user || vendor;
    const tokens = tokenPair({ id: entity.id, email: entity.email, role });
    await storeRefreshToken(tokens.refreshToken, entity.id, role);
    if (req.query.mobile !== '1') {
      return res.redirect(`${process.env.FRONTEND_URL||'https://app.honeymoon.ae'}/auth/callback?accessToken=${tokens.accessToken}&role=${role}`);
    }
    return ok(res, { [role]: strip(entity), ...tokens }, 'UAE Pass login successful');
  } catch (e) { return serverError(res, e); }
};

/* SEND PHONE OTP */
exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return fail(res, 'Phone number required');
    const formatted = phone.startsWith('+') ? phone : `+971${phone.replace(/^0/,'')}`;
    await otpService.sendOtp(formatted, 'phone_verify', 'sms');
    return ok(res, { sent: true, phone: formatted.slice(0,5)+'****' }, 'OTP sent');
  } catch (e) { return serverError(res, e); }
};

/* LOGIN WITH PHONE */
exports.loginWithPhone = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return fail(res, 'Phone and OTP required');
    const formatted = phone.startsWith('+') ? phone : `+971${phone.replace(/^0/,'')}`;
    const result = await otpService.verifyOtp(formatted, 'phone_verify', String(otp));
    if (!result.valid) return fail(res, result.reason || 'Invalid OTP', 401);
    let entity = await prisma.user.findUnique({ where: { phone: formatted } });
    if (!entity) {
      entity = await prisma.user.create({
        data: { firstName:'User', lastName: '', phone: formatted, phoneVerified: true,
                referralCode: `REF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2,6).toUpperCase()}`,
                loyaltyPoints: 0, status: 'Active' }
      });
    } else {
      await prisma.user.update({ where: { id: entity.id }, data: { phoneVerified: true, lastLoginAt: new Date() } });
    }
    const tokens = tokenPair({ id: entity.id, phone: entity.phone, role: 'user' });
    await storeRefreshToken(tokens.refreshToken, entity.id, 'user');
    return ok(res, { user: strip(entity), ...tokens }, 'Login successful');
  } catch (e) { return serverError(res, e); }
};

/* FORGOT PASSWORD */
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role = 'user' } = req.body;
    if (!email) return fail(res, 'Email required');
    const model = role === 'admin' ? 'admin' : role === 'vendor' ? 'vendor' : 'user';
    const account = await prisma[model].findUnique({ where: { email: email.toLowerCase() } });
    if (!account) return ok(res, { otpSent: true }, 'If this email exists, an OTP will be sent');
    const result = await otpService.sendOtp(email, 'forgot_password', 'email');
    // Send the OTP code via email
    await emailService.sendOtpEmail(email, result.code, 'forgot_password').catch(()=>{});
    return ok(res, { otpSent: true }, 'OTP sent to your email');
  } catch (e) { return serverError(res, e); }
};

/* VERIFY OTP */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose = 'forgot_password' } = req.body;
    if (!email || !otp) return fail(res, 'Email and OTP required');
    const result = await otpService.verifyOtp(email.toLowerCase(), purpose, String(otp));
    if (!result.valid) return fail(res, result.reason || 'Invalid OTP', 401);
    return ok(res, { verified: true }, 'OTP verified');
  } catch (e) { return serverError(res, e); }
};

/* RESET PASSWORD */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, role = 'user' } = req.body;
    if (!email || !newPassword) return fail(res, 'Email and new password required');
    if (!otp) return fail(res, 'OTP is required to reset password');
    if (newPassword.length < 8) return fail(res, 'Password must be at least 8 characters');

    // Verify OTP before allowing password reset
    const otpResult = await otpService.verifyOtp(email.toLowerCase(), 'forgot_password', String(otp));
    if (!otpResult.valid) return fail(res, otpResult.reason || 'Invalid or expired OTP', 401);

    const model = role === 'admin' ? 'admin' : role === 'vendor' ? 'vendor' : 'user';
    const account = await prisma[model].findUnique({ where: { email: email.toLowerCase() } });
    if (!account) return notFound(res, 'Account not found');
    await prisma[model].update({
      where: { id: account.id },
      data: { password: bcrypt.hashSync(newPassword, BCRYPT_ROUNDS), loginAttempts: 0, lockedUntil: null }
    });
    await emailService.sendPasswordResetSuccess(email, account.firstName || 'User').catch(()=>{});
    return ok(res, {}, 'Password reset successfully');
  } catch (e) { return serverError(res, e); }
};

/* REFRESH TOKEN */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return fail(res, 'Refresh token required');
    let decoded;
    try { decoded = verifyRefresh(refreshToken); } catch { return fail(res, 'Invalid or expired refresh token', 401); }
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date())
      return fail(res, 'Refresh token revoked or expired', 401);
    const newTokens = tokenPair({ id: decoded.id, email: decoded.email, role: decoded.role });
    await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revokedAt: new Date() } });
    await storeRefreshToken(newTokens.refreshToken, decoded.id, decoded.role);
    return ok(res, newTokens, 'Token refreshed');
  } catch (e) { return serverError(res, e); }
};

/* LOGOUT */
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken)
      await prisma.refreshToken.updateMany({ where: { token: refreshToken, revokedAt: null }, data: { revokedAt: new Date() } });
    return ok(res, {}, 'Logged out successfully');
  } catch (e) { return serverError(res, e); }
};
