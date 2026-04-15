'use strict';
const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const pushService = require('../services/push.service');
const prisma = require('../config/prisma');
const { ok, fail, serverError } = require('../utils/response');

/* POST /api/v1/push/register — register or refresh a push token */
router.post('/register', authenticate, async (req, res) => {
  try {
    const { token, platform = 'ios' } = req.body;
    if (!token) return fail(res, 'token is required');
    const isUser = req.user.role === 'user';
    await pushService.registerToken(
      token,
      isUser ? req.user.id : null,
      !isUser ? req.user.id : null,
      platform
    );
    return ok(res, { registered: true }, 'Push token registered');
  } catch (e) { return serverError(res, e); }
});

/* DELETE /api/v1/push/unregister — remove token on logout */
router.delete('/unregister', authenticate, async (req, res) => {
  try {
    const { token } = req.body;
    if (token) await prisma.pushToken.deleteMany({ where: { token } });
    return ok(res, {}, 'Token removed');
  } catch (e) { return serverError(res, e); }
});

module.exports = router;
