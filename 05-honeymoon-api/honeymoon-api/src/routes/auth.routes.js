'use strict';
const router = require('express').Router();
const auth   = require('../controllers/auth.controller');

/* ── Admin ── */
router.post('/admin/login',            auth.adminLogin);

/* ── Vendor ── */
router.post('/vendor/login',           auth.vendorLogin);
router.post('/vendor/signup',          auth.vendorSignup);

/* ── User email/password ── */
router.post('/user/login',             auth.userLogin);
router.post('/user/signup',            auth.userSignup);

/* ── UAE Pass OAuth ── */
router.get('/uae-pass/init',           auth.uaePassInit);       // step 1: get redirect URL
router.get('/uae-pass/callback',       auth.uaePassCallback);   // step 2: handle code exchange

/* ── Phone OTP ── */
router.post('/phone/send-otp',         auth.sendPhoneOtp);      // send 6-digit SMS OTP
router.post('/phone/login',            auth.loginWithPhone);    // verify OTP + issue JWT

/* ── Shared ── */
router.post('/forgot-password',        auth.forgotPassword);
router.post('/verify-otp',             auth.verifyOtp);
router.post('/reset-password',         auth.resetPassword);
router.post('/refresh-token',          auth.refreshToken);
router.post('/logout',                 auth.logout);

module.exports = router;
