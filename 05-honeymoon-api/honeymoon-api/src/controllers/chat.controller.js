'use strict';
const prisma = require('../config/prisma');
const sanitizeHtml = require('sanitize-html');
const { ok, created, fail, notFound, serverError } = require('../utils/response');
const pushService = require('../services/push.service');

const safe = (s) => s ? sanitizeHtml(s, { allowedTags: [], allowedAttributes: {} }) : s;

/* GET /api/v1/chat/conversations — list user's or vendor's conversations */
exports.getConversations = async (req, res) => {
  try {
    const isVendor = req.user.role === 'vendor';
    const where = isVendor ? { vendorId: req.user.id } : { userId: req.user.id };
    const convs = await prisma.conversation.findMany({
      where, orderBy: { lastMessageAt: 'desc' },
      include: {
        user:   { select: { id:true, firstName:true, lastName:true, avatar:true } },
        vendor: { select: { id:true, companyName:true, avatar:true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    return ok(res, { data: convs });
  } catch (e) { return serverError(res, e); }
};

/* GET /api/v1/chat/conversations/:id/messages — get messages in a conversation */
exports.getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const conv = await prisma.conversation.findUnique({ where: { id: req.params.id } });
    if (!conv) return notFound(res, 'Conversation not found');

    const isParticipant = (req.user.role === 'user' && conv.userId === req.user.id)
                       || (req.user.role === 'vendor' && conv.vendorId === req.user.id);
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });

    const [messages, total] = await Promise.all([
      prisma.message.findMany({ where: { conversationId: req.params.id },
        skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'asc' } }),
      prisma.message.count({ where: { conversationId: req.params.id } }),
    ]);

    /* Mark messages as read */
    await prisma.message.updateMany({
      where: { conversationId: req.params.id, senderRole: { not: req.user.role }, isRead: false },
      data:  { isRead: true },
    });
    /* Reset unread counter */
    const unreadField = req.user.role === 'user' ? 'userUnread' : 'vendorUnread';
    await prisma.conversation.update({ where: { id: req.params.id }, data: { [unreadField]: 0 } });

    return ok(res, { data: messages, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

/* POST /api/v1/chat/conversations/:vendorId/start — start or get conversation */
exports.startConversation = async (req, res) => {
  try {
    const userId   = req.user.id;
    const vendorId = req.params.vendorId;
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) return notFound(res, 'Vendor not found');

    const conv = await prisma.conversation.upsert({
      where:  { userId_vendorId: { userId, vendorId } },
      update: {},
      create: { userId, vendorId },
      include: {
        user:   { select: { id:true, firstName:true, lastName:true, avatar:true } },
        vendor: { select: { id:true, companyName:true, avatar:true } },
      },
    });
    return ok(res, { conversation: conv });
  } catch (e) { return serverError(res, e); }
};

/* POST /api/v1/chat/conversations/:id/messages — send a message */
exports.sendMessage = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) return fail(res, 'Message body is required');

    const conv = await prisma.conversation.findUnique({ where: { id: req.params.id } });
    if (!conv) return notFound(res, 'Conversation not found');

    const isParticipant = (req.user.role === 'user' && conv.userId === req.user.id)
                       || (req.user.role === 'vendor' && conv.vendorId === req.user.id);
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Access denied' });

    const unreadField  = req.user.role === 'user' ? 'vendorUnread' : 'userUnread';
    const safeBody     = safe(body.trim());

    const [message] = await prisma.$transaction([
      prisma.message.create({ data: {
        conversationId: conv.id,
        senderRole: req.user.role,
        senderId:   req.user.id,
        body:       safeBody,
      }}),
      prisma.conversation.update({ where: { id: conv.id }, data: {
        lastMessage:    safeBody.slice(0, 120),
        lastMessageAt:  new Date(),
        [unreadField]:  { increment: 1 },
      }}),
    ]);

    /* Push notification to the other party */
    const sender = req.user.role === 'user' ? 'User' : 'Vendor';
    if (req.user.role === 'user') {
      pushService.sendToVendor(conv.vendorId, { title: 'New Message', body: safeBody.slice(0, 80), data: { conversationId: conv.id } }).catch(() => {});
    } else {
      pushService.sendToUser(conv.userId, { title: 'New Message', body: safeBody.slice(0, 80), data: { conversationId: conv.id } }).catch(() => {});
    }

    return created(res, { message });
  } catch (e) { return serverError(res, e); }
};

/* DELETE /api/v1/chat/messages/:id — delete own message (within 5 minutes) */
exports.deleteMessage = async (req, res) => {
  try {
    const msg = await prisma.message.findUnique({ where: { id: req.params.id } });
    if (!msg) return notFound(res, 'Message not found');
    if (msg.senderId !== req.user.id) return res.status(403).json({ success: false, message: 'Not your message' });
    const ageSecs = (Date.now() - new Date(msg.createdAt).getTime()) / 1000;
    if (ageSecs > 300) return fail(res, 'Messages can only be deleted within 5 minutes of sending');
    await prisma.message.delete({ where: { id: req.params.id } });
    return ok(res, {}, 'Message deleted');
  } catch (e) { return serverError(res, e); }
};
