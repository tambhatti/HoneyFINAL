'use strict';
const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/chat.controller');

router.use(authenticate);

router.get('/conversations',                    ctrl.getConversations);
router.post('/conversations/:vendorId/start',   ctrl.startConversation);
router.get('/conversations/:id/messages',       ctrl.getMessages);
router.post('/conversations/:id/messages',      ctrl.sendMessage);
router.delete('/messages/:id',                  ctrl.deleteMessage);

module.exports = router;
