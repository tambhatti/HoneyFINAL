'use strict';
const bcrypt  = require('bcryptjs');
const prisma  = require('../config/prisma');
const sanitizeHtml = require('sanitize-html');
const { ok, created, fail, notFound, serverError } = require('../utils/response');

const BCRYPT_ROUNDS = 12;

const strip = (u) => {
  if (!u) return null;
  const { password, loginAttempts, lockedUntil, ...s } = u;
  return s;
};

const safe = (str) => (str ? sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} }) : str);

/* ─── HOME / PUBLIC ────────────────────────────────────────────────────────── */
exports.getHome = async (req, res) => {
  try {
    const [featuredVendors, categories, content] = await Promise.all([
      prisma.vendor.findMany({
        where: { status: 'Active' }, orderBy: { rating: 'desc' }, take: 6,
        select: { id:true, firstName:true, lastName:true, companyName:true, category:true,
                  location:true, rating:true, reviewCount:true, avatar:true, isVerified:true },
      }),
      prisma.category.findMany({ where: { status: 'Active' } }),
      prisma.homeContent.findMany({ where: { isActive: true } }),
    ]);
    return ok(res, { featuredVendors, categories, content });
  } catch (e) { return serverError(res, e); }
};

/* ─── PROFILE ──────────────────────────────────────────────────────────────── */
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return notFound(res, 'User not found');
    return ok(res, { user: strip(user) });
  } catch (e) { return serverError(res, e); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { password, role, status, loyaltyPoints, referralCode, referredBy, ...updates } = req.body;
    if (updates.firstName) updates.firstName = safe(updates.firstName);
    if (updates.lastName)  updates.lastName  = safe(updates.lastName);
    const user = await prisma.user.update({ where: { id: req.user.id }, data: updates });
    return ok(res, { user: strip(user) }, 'Profile updated');
  } catch (e) { return serverError(res, e); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return fail(res, 'Current and new password are required');
    if (newPassword.length < 8) return fail(res, 'Password must be at least 8 characters');
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return notFound(res, 'User not found');
    const match = await bcrypt.compare(currentPassword, user.password || '');
    if (!match) return fail(res, 'Current password is incorrect');
    await prisma.user.update({ where: { id: req.user.id },
      data: { password: await bcrypt.hash(newPassword, BCRYPT_ROUNDS) } });
    return ok(res, {}, 'Password changed successfully');
  } catch (e) { return serverError(res, e); }
};

/* ─── VENDORS (PUBLIC) ─────────────────────────────────────────────────────── */
exports.getVendors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category, location } = req.query;
    const where = { status: 'Active' };
    if (category) where.category = category;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (search)   where.OR = [
      { companyName: { contains: search, mode: 'insensitive' } },
      { firstName:   { contains: search, mode: 'insensitive' } },
      { lastName:    { contains: search, mode: 'insensitive' } },
    ];
    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { rating: 'desc' },
        select: { id:true, firstName:true, lastName:true, companyName:true, category:true,
                  location:true, rating:true, reviewCount:true, avatar:true, isVerified:true, about:true } }),
      prisma.vendor.count({ where }),
    ]);
    return ok(res, { data: vendors, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getVendor = async (req, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { id: req.params.id, status: 'Active' },
      include: {
        services: { where: { status: 'Active' }, include: { packages: true, policies: true } },
        reviews:  { where: { isHidden: false }, include: { user: { select: { firstName:true, lastName:true, avatar:true } } }, orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!vendor) return notFound(res, 'Vendor not found');
    return ok(res, { vendor: strip(vendor), services: vendor.services, reviews: vendor.reviews });
  } catch (e) { return serverError(res, e); }
};

/* ─── SERVICES (PUBLIC) ────────────────────────────────────────────────────── */
exports.getServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category, location, vendorId } = req.query;
    const where = { status: 'Active' };
    if (category) where.category = category;
    if (vendorId) where.vendorId = vendorId;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (search)   where.name = { contains: search, mode: 'insensitive' };
    const [services, total] = await Promise.all([
      prisma.service.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        include: { packages: true, vendor: { select: { companyName:true, rating:true, avatar:true } } } }),
      prisma.service.count({ where }),
    ]);
    return ok(res, { data: services, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getService = async (req, res) => {
  try {
    const svc = await prisma.service.findFirst({
      where: { id: req.params.id, status: 'Active' },
      include: {
        packages: true, policies: true,
        vendor:   { include: { addons: { where: { status: 'Active' } } } },
        reviews:  { where: { isHidden: false }, include: { user: { select: { firstName:true, lastName:true, avatar:true } } } },
      },
    });
    if (!svc) return notFound(res, 'Service not found');
    const { vendor, reviews, ...service } = svc;
    return ok(res, { service, vendor: strip(vendor), addons: vendor?.addons || [], reviews });
  } catch (e) { return serverError(res, e); }
};

/* ─── CATEGORIES (PUBLIC) ──────────────────────────────────────────────────── */
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ where: { status: 'Active' } });
    return ok(res, { categories });
  } catch (e) { return serverError(res, e); }
};

/* ─── BOOKINGS ─────────────────────────────────────────────────────────────── */
exports.getMyBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (type)   where.type   = type;
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { vendor: { select: { companyName:true, avatar:true } }, service: { select: { name:true } } } }),
      prisma.booking.count({ where }),
    ]);
    return ok(res, { data: bookings, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getMyBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        vendor:   { select: { id:true, companyName:true, avatar:true, phone:true, location:true } },
        service:  { include: { packages: true, policies: true } },
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!booking) return notFound(res, 'Booking not found');
    return ok(res, { booking });
  } catch (e) { return serverError(res, e); }
};

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, vendorId, eventDate, eventTime, guestCount, quantity,
            addons, location, additionalNote, inspirationalImages, loyaltyPointsToUse = 0 } = req.body;
    if (!serviceId || !vendorId || !eventDate) return fail(res, 'Service, vendor and event date are required');

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return notFound(res, 'Service not found');

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    let loyaltyDiscount = 0;
    if (loyaltyPointsToUse > 0) {
      if (loyaltyPointsToUse > (user.loyaltyPoints || 0)) return fail(res, 'Insufficient loyalty points');
      const cfg = await prisma.loyaltyConfig.findUnique({ where: { id: 'singleton' } });
      loyaltyDiscount = loyaltyPointsToUse * (cfg?.pointValue || 0.1);
    }

    const qty = guestCount || quantity || 1;
    const baseAmount = service.basePrice * qty;
    const totalAmount   = Math.max(0, baseAmount - loyaltyDiscount);
    const depositAmount = totalAmount * ((service.depositPercent || 20) / 100);

    const booking = await prisma.booking.create({ data: {
      userId: req.user.id, vendorId, serviceId, type: 'standard',
      status: 'Pending', paymentStatus: 'Unpaid',
      eventDate: new Date(eventDate), eventTime, guestCount: Number(qty), quantity: Number(qty),
      addons: addons || [], location: safe(location),
      additionalNote: safe(additionalNote),
      inspirationalImages: inspirationalImages || [],
      totalAmount, depositAmount, depositPaid: false,
      loyaltyPointsUsed: loyaltyPointsToUse,
    }});

    if (loyaltyPointsToUse > 0) {
      await prisma.user.update({ where: { id: req.user.id },
        data: { loyaltyPoints: { decrement: loyaltyPointsToUse } } });
      await prisma.loyaltyLog.create({ data: {
        userId: req.user.id, type: 'redeemed',
        points: -loyaltyPointsToUse, bookingId: booking.id,
        description: 'Points redeemed on booking',
      }});
    }

    return created(res, { booking }, 'Booking created successfully');
  } catch (e) { return serverError(res, e); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) return notFound(res, 'Booking not found');
    if (!['Pending'].includes(booking.status)) return fail(res, 'Only pending bookings can be cancelled');
    const updated = await prisma.booking.update({ where: { id: booking.id },
      data: { status: 'Cancelled', rejectionReason: 'Cancelled by user' } });
    return ok(res, { booking: updated }, 'Booking cancelled');
  } catch (e) { return serverError(res, e); }
};

exports.rateBooking = async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!rating || rating < 1 || rating > 5) return fail(res, 'Rating must be between 1 and 5');
    const booking = await prisma.booking.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) return notFound(res, 'Booking not found');
    if (booking.status !== 'Completed') return fail(res, 'Can only rate completed bookings');

    const rev = await prisma.review.create({ data: {
      userId: req.user.id, vendorId: booking.vendorId,
      serviceId: booking.serviceId, bookingId: booking.id,
      rating, review: safe(review), isHidden: false,
    }});

    await prisma.user.update({ where: { id: req.user.id }, data: { loyaltyPoints: { increment: 50 } } });
    await prisma.loyaltyLog.create({ data: {
      userId: req.user.id, type: 'awarded', points: 50, bookingId: booking.id,
      description: 'Points awarded for leaving a review',
    }});

    const allReviews = await prisma.review.findMany({ where: { vendorId: booking.vendorId, isHidden: false } });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await prisma.vendor.update({ where: { id: booking.vendorId },
      data: { rating: parseFloat(avg.toFixed(1)), reviewCount: allReviews.length } });

    return created(res, { review: rev }, 'Review submitted successfully');
  } catch (e) { return serverError(res, e); }
};

exports.reportBooking = async (req, res) => {
  try {
    const { reasons, details } = req.body;
    if (!reasons || !details) return fail(res, 'Reasons and details are required');
    const booking = await prisma.booking.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) return notFound(res, 'Booking not found');
    const report = await prisma.reportedBooking.create({ data: {
      bookingId: booking.id, reportedBy: req.user.id,
      reasons: Array.isArray(reasons) ? reasons : [reasons],
      details: safe(details), status: 'Pending',
    }});
    return created(res, { report }, 'Report submitted');
  } catch (e) { return serverError(res, e); }
};

/* ─── CUSTOM QUOTATIONS ────────────────────────────────────────────────────── */
exports.getMyCustomQuotations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    const [quotations, total] = await Promise.all([
      prisma.customQuotation.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { vendor: { select: { companyName:true, avatar:true } } } }),
      prisma.customQuotation.count({ where }),
    ]);
    return ok(res, { data: quotations, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getMyCustomQuotation = async (req, res) => {
  try {
    const quotation = await prisma.customQuotation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { vendor: { select: { id:true, companyName:true, avatar:true, phone:true } } },
    });
    if (!quotation) return notFound(res, 'Quotation not found');
    return ok(res, { quotation });
  } catch (e) { return serverError(res, e); }
};

exports.requestCustomQuotation = async (req, res) => {
  try {
    const { services, location, eventDate, startTime, endTime, guestCount,
            budgetMin, budgetMax, additionalNote, inspirationalImages } = req.body;
    if (!services || !location || !eventDate) return fail(res, 'Services, location and event date are required');

    const aiRecommended = { min: budgetMin * 1.2, max: budgetMax * 1.5, average: (budgetMin + budgetMax) / 2 * 1.3 };

    const quotation = await prisma.customQuotation.create({ data: {
      userId: req.user.id,
      services: Array.isArray(services) ? services : [services],
      location: safe(location),
      eventDate: new Date(eventDate), startTime, endTime,
      guestCount: Number(guestCount) || 1,
      budgetMin: Number(budgetMin), budgetMax: Number(budgetMax),
      additionalNote: safe(additionalNote),
      inspirationalImages: inspirationalImages || [],
      status: 'Requested', depositPercent: 20, loyaltyPointsUsed: 0,
      aiRecommendedBudget: aiRecommended,
    }});
    return created(res, { quotation }, 'Custom quotation request submitted');
  } catch (e) { return serverError(res, e); }
};

exports.confirmQuotation = async (req, res) => {
  try {
    const quotation = await prisma.customQuotation.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!quotation) return notFound(res, 'Quotation not found');
    if (quotation.status !== 'Pending') return fail(res, 'Quotation is not in pending state');
    const updated = await prisma.customQuotation.update({ where: { id: quotation.id }, data: { status: 'Upcoming' } });
    return ok(res, { quotation: updated }, 'Quotation confirmed');
  } catch (e) { return serverError(res, e); }
};

/* ─── PAYMENTS ─────────────────────────────────────────────────────────────── */
exports.getMyPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where: { userId: req.user.id },
        skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.payment.count({ where: { userId: req.user.id } }),
    ]);
    return ok(res, { data: payments, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

/* ─── MEETING REQUESTS ─────────────────────────────────────────────────────── */
exports.getMyMeetingRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    const [meetings, total] = await Promise.all([
      prisma.meetingRequest.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { vendor: { select: { companyName:true, avatar:true } } } }),
      prisma.meetingRequest.count({ where }),
    ]);
    return ok(res, { data: meetings, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.requestMeeting = async (req, res) => {
  try {
    const { vendorId, name, phone, email, reason } = req.body;
    if (!vendorId || !reason) return fail(res, 'Vendor and reason are required');
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) return notFound(res, 'Vendor not found');
    const meeting = await prisma.meetingRequest.create({ data: {
      userId: req.user.id, vendorId,
      name: safe(name), phone, email, reason: safe(reason), status: 'Pending',
    }});
    return created(res, { meeting }, 'Meeting request sent');
  } catch (e) { return serverError(res, e); }
};

/* ─── REPORTED BOOKINGS ────────────────────────────────────────────────────── */
exports.getMyReportedBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [reports, total] = await Promise.all([
      prisma.reportedBooking.findMany({ where: { reportedBy: req.user.id },
        skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.reportedBooking.count({ where: { reportedBy: req.user.id } }),
    ]);
    return ok(res, { data: reports, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

/* ─── BUDGETS ──────────────────────────────────────────────────────────────── */
exports.getMyBudgets = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const where = { userId: req.user.id };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [budgets, total] = await Promise.all([
      prisma.budget.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { updatedAt: 'desc' } }),
      prisma.budget.count({ where }),
    ]);
    return ok(res, { data: budgets, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getMyBudget = async (req, res) => {
  try {
    const budget = await prisma.budget.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!budget) return notFound(res, 'Budget not found');
    return ok(res, { budget });
  } catch (e) { return serverError(res, e); }
};

exports.createBudget = async (req, res) => {
  try {
    const { name, totalBudget, allocations } = req.body;
    if (!name || !totalBudget) return fail(res, 'Name and total budget are required');
    const budget = await prisma.budget.create({ data: {
      userId: req.user.id, name: safe(name), totalBudget: Number(totalBudget),
      allocations: allocations || {},
      spent: Object.fromEntries(Object.keys(allocations || {}).map(k => [k, 0])),
    }});
    return created(res, { budget }, 'Budget created');
  } catch (e) { return serverError(res, e); }
};

exports.updateBudget = async (req, res) => {
  try {
    const exists = await prisma.budget.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!exists) return notFound(res, 'Budget not found');
    const { userId, ...updates } = req.body;
    if (updates.name) updates.name = safe(updates.name);
    const budget = await prisma.budget.update({ where: { id: req.params.id }, data: updates });
    return ok(res, { budget }, 'Budget updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteBudget = async (req, res) => {
  try {
    const exists = await prisma.budget.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!exists) return notFound(res, 'Budget not found');
    await prisma.budget.delete({ where: { id: req.params.id } });
    return ok(res, {}, 'Budget deleted');
  } catch (e) { return serverError(res, e); }
};

exports.estimateBudget = async (req, res) => {
  try {
    const { location, guestCount } = req.body;
    if (!location || !guestCount) return fail(res, 'Location and guest count are required');
    const basePerGuest = { Dubai: 250, 'Abu Dhabi': 220, Sharjah: 180 }[location] || 200;
    const estimated = Number(guestCount) * basePerGuest;
    return ok(res, {
      location, guestCount,
      estimatedBudget: estimated,
      range: { min: estimated * 0.8, max: estimated * 1.3 },
      breakdown: {
        Venue: Math.round(estimated * 0.35), Catering: Math.round(estimated * 0.30),
        Photography: Math.round(estimated * 0.12), Decoration: Math.round(estimated * 0.10),
        Beauty: Math.round(estimated * 0.08), Music: Math.round(estimated * 0.05),
      },
      aiMessage: `Most couples in ${location} with ${guestCount} guests spend between AED ${Math.round(estimated * 0.8).toLocaleString()} - AED ${Math.round(estimated * 1.3).toLocaleString()} on average.`,
    });
  } catch (e) { return serverError(res, e); }
};

/* ─── LOYALTY ──────────────────────────────────────────────────────────────── */
exports.getLoyalty = async (req, res) => {
  try {
    const [user, logs, cfg] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.user.id } }),
      prisma.loyaltyLog.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 50 }),
      prisma.loyaltyConfig.findUnique({ where: { id: 'singleton' } }),
    ]);
    if (!user) return notFound(res, 'User not found');
    return ok(res, {
      points: user.loyaltyPoints,
      pointsValue: ((user.loyaltyPoints || 0) * (cfg?.pointValue || 0.1)).toFixed(2),
      referralCode: user.referralCode, logs, config: cfg,
    });
  } catch (e) { return serverError(res, e); }
};

/* ─── NOTIFICATIONS ────────────────────────────────────────────────────────── */
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    const where = { userId: req.user.id };
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
    const notif = await prisma.notification.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!notif) return notFound(res, 'Notification not found');
    const updated = await prisma.notification.update({ where: { id: notif.id }, data: { isRead: true } });
    return ok(res, { notification: updated });
  } catch (e) { return serverError(res, e); }
};

exports.markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user.id, isRead: false }, data: { isRead: true } });
    return ok(res, {}, 'All notifications marked as read');
  } catch (e) { return serverError(res, e); }
};

/* ─── WISHLIST — persisted in PostgreSQL (B-04) ────────────────────────────── */
exports.getWishlist = async (req, res) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: { vendor: { select: { id:true, companyName:true, category:true, location:true,
                                     rating:true, reviewCount:true, avatar:true, isVerified:true } } },
      orderBy: { createdAt: 'desc' },
    });
    return ok(res, { wishlist: items.map(w => w.vendor) });
  } catch (e) { return serverError(res, e); }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { vendorId } = req.body;
    if (!vendorId) return fail(res, 'vendorId is required');
    const existing = await prisma.wishlist.findUnique({
      where: { userId_vendorId: { userId: req.user.id, vendorId } } });
    let action;
    if (existing) {
      await prisma.wishlist.delete({ where: { userId_vendorId: { userId: req.user.id, vendorId } } });
      action = 'removed';
    } else {
      await prisma.wishlist.create({ data: { userId: req.user.id, vendorId } });
      action = 'added';
    }
    return ok(res, { action }, `Vendor ${action} to wishlist`);
  } catch (e) { return serverError(res, e); }
};

/* ─── CONTACT US ───────────────────────────────────────────────────────────── */
exports.contactUs = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!subject || !message) return fail(res, 'Subject and message are required');
    const query = await prisma.query.create({ data: {
      userId: req.user?.id || null, name: safe(name), email, phone,
      subject: safe(subject), message: safe(message), status: 'Open',
    }});
    return created(res, { query }, 'Message sent. We will get back to you soon.');
  } catch (e) { return serverError(res, e); }
};

/* ─── AI PLANNER ───────────────────────────────────────────────────────────── */
exports.generateAIPlan = async (req, res) => {
  try {
    const { location, budget, guestCount, preferences, style, duration, additionalNotes } = req.body;
    if (!location) return fail(res, 'Location is required');
    const aiService = require('../services/ai.service');
    const plan = await aiService.generatePlan({ location, budget, guestCount, preferences, style, duration, additionalNotes });
    return ok(res, { plan });
  } catch (e) { return serverError(res, e); }
};
