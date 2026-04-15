'use strict';
const bcrypt  = require('bcryptjs');
const prisma  = require('../config/prisma');
const sanitizeHtml = require('sanitize-html');
const { ok, created, fail, notFound, serverError } = require('../utils/response');

const BCRYPT_ROUNDS = 12;
const strip = (u) => { if (!u) return null; const { password, loginAttempts, lockedUntil, ...s } = u; return s; };
const safe  = (str) => (str ? sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} }) : str);

/* ─── DASHBOARD ─────────────────────────────────────────────────────────── */
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalVendors, totalBookings, paymentAgg, pendingVendors,
           pendingBookings, activeVendors, activeUsers, recentBookings, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.booking.count(),
      prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
      prisma.vendor.count({ where: { status: 'Pending' } }),
      prisma.booking.count({ where: { status: 'Pending' } }),
      prisma.vendor.count({ where: { status: 'Active' } }),
      prisma.user.count({ where: { status: 'Active' } }),
      prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 5,
        include: { user: { select: { firstName:true, lastName:true } }, vendor: { select: { companyName:true } } } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5,
        select: { id:true, firstName:true, lastName:true, email:true, status:true, createdAt:true } }),
    ]);
    const totalRevenue = paymentAgg._sum.amount || 0;
    const cfg = await prisma.commissionConfig.findUnique({ where: { id: 'singleton' } });
    return ok(res, {
      stats: {
        users: totalUsers, vendors: totalVendors, bookings: totalBookings,
        earning: `AED ${totalRevenue.toLocaleString()}`,
        totalUsers, totalVendors, totalBookings, totalRevenue,
        activeVendors, activeUsers, pendingVendors, pendingBookings,
        commissionRate: cfg?.defaultRate || 10, revenueGrowth: 12.5,
      },
      recentBookings, recentUsers,
    });
  } catch (e) { return serverError(res, e); }
};

/* ─── USERS ─────────────────────────────────────────────────────────────── */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName:  { contains: search, mode: 'insensitive' } },
      { email:     { contains: search, mode: 'insensitive' } },
    ];
    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: { id:true, firstName:true, lastName:true, email:true, phone:true, status:true, loyaltyPoints:true, createdAt:true } }),
      prisma.user.count({ where }),
    ]);
    return ok(res, { data: users, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return notFound(res, 'User not found');
    const bookings = await prisma.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10 });
    return ok(res, { user: strip(user), bookings });
  } catch (e) { return serverError(res, e); }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { status } });
    return ok(res, { user: strip(user) }, 'User status updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── VENDORS ───────────────────────────────────────────────────────────── */
exports.getVendors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, category } = req.query;
    const where = {};
    if (status)   where.status = status;
    if (category) where.category = category;
    if (search)   where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { firstName:   { contains: search, mode: 'insensitive' } },
      { email:       { contains: search, mode: 'insensitive' } },
    ];
    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.vendor.count({ where }),
    ]);
    return ok(res, { data: vendors.map(strip), total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getVendor = async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id },
      include: { services: true, bookings: { orderBy: { createdAt: 'desc' }, take: 10 } } });
    if (!vendor) return notFound(res, 'Vendor not found');
    return ok(res, { vendor: strip(vendor), services: vendor.services, bookings: vendor.bookings });
  } catch (e) { return serverError(res, e); }
};

exports.getVendorRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({ where: { status: 'Pending' },
        skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.vendor.count({ where: { status: 'Pending' } }),
    ]);
    return ok(res, { data: vendors.map(strip), total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.approveVendor = async (req, res) => {
  try {
    const vendor = await prisma.vendor.update({ where: { id: req.params.id },
      data: { status: 'Active', isVerified: true } });
    return ok(res, { vendor: strip(vendor) }, 'Vendor approved successfully');
  } catch (e) { return serverError(res, e); }
};

exports.rejectVendor = async (req, res) => {
  try {
    const { reason } = req.body;
    const vendor = await prisma.vendor.update({ where: { id: req.params.id },
      data: { status: 'Rejected', rejectionReason: safe(reason) } });
    return ok(res, { vendor: strip(vendor) }, 'Vendor rejected');
  } catch (e) { return serverError(res, e); }
};

exports.toggleVendorStatus = async (req, res) => {
  try {
    const current = await prisma.vendor.findUnique({ where: { id: req.params.id }, select: { status: true } });
    if (!current) return notFound(res, 'Vendor not found');
    const newStatus = current.status === 'Active' ? 'Inactive' : 'Active';
    const vendor = await prisma.vendor.update({ where: { id: req.params.id }, data: { status: newStatus } });
    return ok(res, { vendor: strip(vendor) }, `Vendor ${newStatus.toLowerCase()}`);
  } catch (e) { return serverError(res, e); }
};

exports.updateCommission = async (req, res) => {
  try {
    const { commissionRate } = req.body;
    const vendor = await prisma.vendor.update({ where: { id: req.params.id }, data: { commissionRate: Number(commissionRate) } });
    return ok(res, { vendor: strip(vendor) }, 'Commission rate updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── CATEGORIES ────────────────────────────────────────────────────────── */
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return ok(res, { categories });
  } catch (e) { return serverError(res, e); }
};

exports.getCategory = async (req, res) => {
  try {
    const cat = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!cat) return notFound(res, 'Category not found');
    return ok(res, { category: cat });
  } catch (e) { return serverError(res, e); }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name) return fail(res, 'Category name is required');
    const category = await prisma.category.create({ data: { name: safe(name), icon: icon || '📌',
      description: safe(description), status: 'Active', vendorCount: 0 } });
    return created(res, { category }, 'Category created');
  } catch (e) { return serverError(res, e); }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, icon, description, status } = req.body;
    const category = await prisma.category.update({ where: { id: req.params.id },
      data: { name: safe(name), icon, description: safe(description), status } });
    return ok(res, { category }, 'Category updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    return ok(res, {}, 'Category deleted');
  } catch (e) { return serverError(res, e); }
};

/* ─── BOOKINGS ──────────────────────────────────────────────────────────── */
exports.getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, type } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type)   where.type   = type;
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName:true, lastName:true } }, vendor: { select: { companyName:true } }, service: { select: { name:true } } } }),
      prisma.booking.count({ where }),
    ]);
    return ok(res, { data: bookings, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id },
      include: { user: true, vendor: true, service: true, payments: true } });
    if (!booking) return notFound(res, 'Booking not found');
    return ok(res, { booking, user: strip(booking.user), vendor: strip(booking.vendor) });
  } catch (e) { return serverError(res, e); }
};

exports.exportBookings = async (req, res) => {
  try {
    const { format = 'json', type } = req.query;
    const where = type ? { type } : {};
    const count = await prisma.booking.count({ where });
    return ok(res, { exportUrl: `/exports/bookings-${Date.now()}.${format}`, count }, 'Export ready');
  } catch (e) { return serverError(res, e); }
};

/* ─── REPORTED BOOKINGS ─────────────────────────────────────────────────── */
exports.getReportedBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = status ? { status } : {};
    const [reports, total] = await Promise.all([
      prisma.reportedBooking.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { booking: { select: { id:true, eventDate:true } } } }),
      prisma.reportedBooking.count({ where }),
    ]);
    return ok(res, { data: reports, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.resolveReport = async (req, res) => {
  try {
    const { adminNote } = req.body;
    const report = await prisma.reportedBooking.update({ where: { id: req.params.id },
      data: { status: 'Resolved', adminNote: safe(adminNote) } });
    return ok(res, { report }, 'Report resolved');
  } catch (e) { return serverError(res, e); }
};

/* ─── MEETING REQUESTS ──────────────────────────────────────────────────── */
exports.getMeetingRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = status ? { status } : {};
    const [meetings, total] = await Promise.all([
      prisma.meetingRequest.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.meetingRequest.count({ where }),
    ]);
    return ok(res, { data: meetings, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getMeetingRequest = async (req, res) => {
  try {
    const meeting = await prisma.meetingRequest.findUnique({ where: { id: req.params.id },
      include: { user: { select: { firstName:true, lastName:true, email:true } }, vendor: { select: { companyName:true } } } });
    if (!meeting) return notFound(res, 'Meeting request not found');
    return ok(res, { meeting });
  } catch (e) { return serverError(res, e); }
};

/* ─── SUBSCRIPTIONS ─────────────────────────────────────────────────────── */
exports.getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({ orderBy: { priceMonthly: 'asc' } });
    return ok(res, { plans });
  } catch (e) { return serverError(res, e); }
};

exports.getSubscriptionPlan = async (req, res) => {
  try {
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: req.params.id } });
    if (!plan) return notFound(res, 'Subscription plan not found');
    return ok(res, { plan });
  } catch (e) { return serverError(res, e); }
};

exports.createSubscriptionPlan = async (req, res) => {
  try {
    const { name, priceMonthly, priceYearly, features, maxServices, maxImages } = req.body;
    const plan = await prisma.subscriptionPlan.create({ data: { name, priceMonthly: Number(priceMonthly),
      priceYearly: Number(priceYearly), features: features || [], maxServices, maxImages, isActive: true } });
    return created(res, { plan }, 'Subscription plan created');
  } catch (e) { return serverError(res, e); }
};

exports.updateSubscriptionPlan = async (req, res) => {
  try {
    const plan = await prisma.subscriptionPlan.update({ where: { id: req.params.id }, data: req.body });
    return ok(res, { plan }, 'Plan updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteSubscriptionPlan = async (req, res) => {
  try {
    await prisma.subscriptionPlan.delete({ where: { id: req.params.id } });
    return ok(res, {}, 'Plan deleted');
  } catch (e) { return serverError(res, e); }
};

exports.getSubscriptionLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [logs, total] = await Promise.all([
      prisma.subscriptionLog.findMany({ skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.subscriptionLog.count(),
    ]);
    return ok(res, { data: logs, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

/* ─── COMMISSION ────────────────────────────────────────────────────────── */
exports.getCommissionConfig = async (req, res) => {
  try {
    const commission = await prisma.commissionConfig.findUnique({ where: { id: 'singleton' } });
    return ok(res, { commission });
  } catch (e) { return serverError(res, e); }
};

exports.updateCommissionConfig = async (req, res) => {
  try {
    const commission = await prisma.commissionConfig.upsert({
      where: { id: 'singleton' }, update: req.body, create: { id: 'singleton', ...req.body } });
    return ok(res, { commission }, 'Commission config updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── LOYALTY ───────────────────────────────────────────────────────────── */
exports.getLoyaltyConfig = async (req, res) => {
  try {
    const config = await prisma.loyaltyConfig.findUnique({ where: { id: 'singleton' } });
    return ok(res, { config });
  } catch (e) { return serverError(res, e); }
};

exports.updateLoyaltyConfig = async (req, res) => {
  try {
    const config = await prisma.loyaltyConfig.upsert({
      where: { id: 'singleton' }, update: req.body, create: { id: 'singleton', ...req.body } });
    return ok(res, { config }, 'Loyalty config updated');
  } catch (e) { return serverError(res, e); }
};

exports.getLoyaltyLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const where = type ? { type } : {};
    const [logs, total] = await Promise.all([
      prisma.loyaltyLog.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.loyaltyLog.count({ where }),
    ]);
    return ok(res, { data: logs, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

/* ─── REFERRAL ──────────────────────────────────────────────────────────── */
exports.getReferralConfig = async (req, res) => {
  try {
    const config = await prisma.referralConfig.findUnique({ where: { id: 'singleton' } });
    return ok(res, { config });
  } catch (e) { return serverError(res, e); }
};

exports.updateReferralConfig = async (req, res) => {
  try {
    const config = await prisma.referralConfig.upsert({
      where: { id: 'singleton' }, update: req.body, create: { id: 'singleton', ...req.body } });
    return ok(res, { config }, 'Referral config updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── PAYOUTS ───────────────────────────────────────────────────────────── */
exports.getPayouts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = status ? { status } : {};
    const [payouts, total] = await Promise.all([
      prisma.payout.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { requestedAt: 'desc' },
        include: { vendor: { select: { companyName:true } } } }),
      prisma.payout.count({ where }),
    ]);
    return ok(res, { data: payouts, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getPayout = async (req, res) => {
  try {
    const payout = await prisma.payout.findUnique({ where: { id: req.params.id },
      include: { vendor: { select: { companyName:true, email:true } } } });
    if (!payout) return notFound(res, 'Payout not found');
    return ok(res, { payout });
  } catch (e) { return serverError(res, e); }
};

exports.approvePayout = async (req, res) => {
  try {
    const payout = await prisma.payout.update({ where: { id: req.params.id },
      data: { status: 'Approved', approvedAt: new Date() } });
    return ok(res, { payout }, 'Payout approved');
  } catch (e) { return serverError(res, e); }
};

exports.processPayout = async (req, res) => {
  try {
    const payout = await prisma.payout.update({ where: { id: req.params.id },
      data: { status: 'Paid', paidAt: new Date() } });
    return ok(res, { payout }, 'Payout processed');
  } catch (e) { return serverError(res, e); }
};

/* ─── PAYMENT LOGS ──────────────────────────────────────────────────────── */
exports.getPaymentLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, method } = req.query;
    const where = {};
    if (status) where.status = status;
    if (method) where.method = method;
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.payment.count({ where }),
    ]);
    return ok(res, { data: payments, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getPaymentLog = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });
    if (!payment) return notFound(res, 'Payment not found');
    return ok(res, { payment });
  } catch (e) { return serverError(res, e); }
};

/* ─── PUSH NOTIFICATIONS ────────────────────────────────────────────────── */
exports.getPushNotifications = async (req, res) => {
  try {
    const notifications = await prisma.pushNotification.findMany({ orderBy: { sentAt: 'desc' } });
    return ok(res, { notifications });
  } catch (e) { return serverError(res, e); }
};

exports.getPushNotification = async (req, res) => {
  try {
    const notification = await prisma.pushNotification.findUnique({ where: { id: req.params.id } });
    if (!notification) return notFound(res, 'Notification not found');
    return ok(res, { notification });
  } catch (e) { return serverError(res, e); }
};

exports.sendPushNotification = async (req, res) => {
  try {
    const { title, message, audience = 'all' } = req.body;
    if (!title || !message) return fail(res, 'Title and message required');
    const [userCount, vendorCount] = await Promise.all([
      prisma.user.count({ where: { status: 'Active' } }),
      prisma.vendor.count({ where: { status: 'Active' } }),
    ]);
    const notif = await prisma.pushNotification.create({ data: {
      title: safe(title), message: safe(message), audience,
      reach: audience === 'all' ? userCount + vendorCount : userCount,
      opened: 0, status: 'Sent', sentAt: new Date(),
    }});
    return created(res, { notification: notif }, 'Push notification sent');
  } catch (e) { return serverError(res, e); }
};

/* ─── RATINGS ───────────────────────────────────────────────────────────── */
exports.getRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10, isHidden } = req.query;
    const where = {};
    if (isHidden !== undefined) where.isHidden = isHidden === 'true';
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.review.count({ where }),
    ]);
    return ok(res, { data: reviews, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.toggleReviewVisibility = async (req, res) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id }, select: { isHidden: true } });
    if (!review) return notFound(res, 'Review not found');
    const updated = await prisma.review.update({ where: { id: req.params.id }, data: { isHidden: !review.isHidden } });
    return ok(res, { review: updated }, 'Review visibility toggled');
  } catch (e) { return serverError(res, e); }
};

/* ─── HOME CONTENT ──────────────────────────────────────────────────────── */
exports.getHomeContent = async (req, res) => {
  try {
    const content = await prisma.homeContent.findMany({ orderBy: { sortOrder: 'asc' } });
    return ok(res, { content });
  } catch (e) { return serverError(res, e); }
};

exports.updateHomeContent = async (req, res) => {
  try {
    const content = await prisma.homeContent.update({ where: { id: req.params.id }, data: req.body });
    return ok(res, { content }, 'Content updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── QUERIES ───────────────────────────────────────────────────────────── */
exports.getQueries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = status ? { status } : {};
    const [queries, total] = await Promise.all([
      prisma.query.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.query.count({ where }),
    ]);
    return ok(res, { data: queries, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getQuery = async (req, res) => {
  try {
    const query = await prisma.query.findUnique({ where: { id: req.params.id } });
    if (!query) return notFound(res, 'Query not found');
    return ok(res, { query });
  } catch (e) { return serverError(res, e); }
};

exports.replyToQuery = async (req, res) => {
  try {
    const { reply } = req.body;
    const query = await prisma.query.update({ where: { id: req.params.id },
      data: { adminReply: safe(reply), status: 'Resolved' } });
    return ok(res, { query }, 'Reply sent');
  } catch (e) { return serverError(res, e); }
};

/* ─── REPORTS ───────────────────────────────────────────────────────────── */
exports.getReports = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const [userCount, vendorCount, categories, paymentAgg, bookingCount] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.category.findMany({ take: 5 }),
      prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
      prisma.booking.count(),
    ]);
    return ok(res, {
      period,
      revenue:  { total: paymentAgg._sum.amount || 0, growth: 12.5, chart: Array.from({ length: 12 }, (_, i) => ({ month: i+1, amount: 15000 + i*2000 })) },
      bookings: { total: bookingCount, growth: 8.2, chart: Array.from({ length: 12 }, (_, i) => ({ month: i+1, count: 25 + i*3 })) },
      users:    { total: userCount,    newThisMonth: 24 },
      vendors:  { total: vendorCount,  newThisMonth: 5 },
      topCategories: categories,
    });
  } catch (e) { return serverError(res, e); }
};

/* ─── SETTINGS ──────────────────────────────────────────────────────────── */
exports.getSettings = async (req, res) => {
  try {
    const settings = await prisma.platformSettings.findUnique({ where: { id: 'singleton' } });
    return ok(res, { settings });
  } catch (e) { return serverError(res, e); }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await prisma.platformSettings.upsert({
      where: { id: 'singleton' }, update: req.body, create: { id: 'singleton', ...req.body } });
    return ok(res, { settings }, 'Settings updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── ADMIN PROFILE ─────────────────────────────────────────────────────── */
exports.getProfile = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    if (!admin) return notFound(res, 'Admin not found');
    return ok(res, { admin: strip(admin) });
  } catch (e) { return serverError(res, e); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { password, role, ...updates } = req.body;
    const admin = await prisma.admin.update({ where: { id: req.user.id }, data: updates });
    return ok(res, { admin: strip(admin) }, 'Profile updated');
  } catch (e) { return serverError(res, e); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return fail(res, 'Current and new password are required');
    if (newPassword.length < 8) return fail(res, 'Password must be at least 8 characters');
    const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
    if (!admin) return notFound(res, 'Admin not found');
    const match = await bcrypt.compare(currentPassword, admin.password || '');
    if (!match) return fail(res, 'Current password is incorrect');
    await prisma.admin.update({ where: { id: req.user.id },
      data: { password: await bcrypt.hash(newPassword, BCRYPT_ROUNDS) } });
    return ok(res, {}, 'Password changed successfully');
  } catch (e) { return serverError(res, e); }
};

/* ─── NOTIFICATIONS ─────────────────────────────────────────────────────── */
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    const where = { adminId: req.user.id };
    if (isRead !== undefined) where.isRead = isRead === 'true';
    const [notifs, total] = await Promise.all([
      prisma.notification.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.notification.count({ where }),
    ]);
    return ok(res, { data: notifs, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const updated = await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
    return ok(res, { notification: updated }, 'Marked as read');
  } catch (e) { return serverError(res, e); }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({ where: { adminId: req.user.id, isRead: false }, data: { isRead: true } });
    return ok(res, {}, 'All notifications marked as read');
  } catch (e) { return serverError(res, e); }
};

/* ─── CREATE USER (admin) ────────────────────────────────────────────────── */
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, password, uaePass } = req.body;
    if (!firstName || !email) return fail(res, 'First name and email are required');
    if (!password || password.length < 8) return fail(res, 'Password must be at least 8 characters');
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return fail(res, 'Email already registered');
    const refCode = `REF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2,6).toUpperCase()}`;
    const user = await prisma.user.create({ data: {
      firstName: safe(firstName), lastName: safe(lastName),
      email: email.toLowerCase(), phone, gender,
      password: await bcrypt.hash(password, BCRYPT_ROUNDS),
      uaePass, referralCode: refCode,
      loyaltyPoints: 0, status: 'Active',
    }});
    return created(res, { user: strip(user) }, 'User created successfully');
  } catch (e) { return serverError(res, e); }
};

/* ─── EXPORT BOOKINGS ────────────────────────────────────────────────────── */
exports.exportBookings = async (req, res) => {
  try {
    const { format = 'csv', type, status } = req.query;
    const where = {};
    if (type)   where.type   = type;
    if (status) where.status = status;
    const bookings = await prisma.booking.findMany({ where, orderBy: { createdAt: 'desc' }, take: 5000 });
    const exportService = require('../services/export.service');
    const buffer = await exportService.exportBookings(bookings, format);
    const mime = format === 'xlsx'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv; charset=utf-8';
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Disposition', `attachment; filename="bookings-${Date.now()}.${format}"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
  } catch (e) { return serverError(res, e); }
};

/* ─── EXPORT PAYMENTS ────────────────────────────────────────────────────── */
exports.exportPayments = async (req, res) => {
  try {
    const { format = 'csv', status } = req.query;
    const where = status ? { status } : {};
    const payments = await prisma.payment.findMany({ where, orderBy: { createdAt: 'desc' }, take: 5000 });
    const exportService = require('../services/export.service');
    const buffer = await exportService.exportPayments(payments, format);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="payments-${Date.now()}.csv"`);
    return res.send(buffer);
  } catch (e) { return serverError(res, e); }
};
