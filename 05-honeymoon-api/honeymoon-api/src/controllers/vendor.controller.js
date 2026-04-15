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
    const vendorId = req.user.id;
    const [totalBookings, pendingBookings, totalServices, payouts, reviews] = await Promise.all([
      prisma.booking.count({ where: { vendorId } }),
      prisma.booking.count({ where: { vendorId, status: 'Pending' } }),
      prisma.service.count({ where: { vendorId } }),
      prisma.payout.findMany({ where: { vendorId } }),
      prisma.review.findMany({ where: { vendorId } }),
    ]);
    const totalRevenue = payouts.filter(p => p.status === 'Paid').reduce((s, p) => s + p.netAmount, 0);
    const avgRating = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
    const recentBookings = await prisma.booking.findMany({
      where: { vendorId }, orderBy: { createdAt: 'desc' }, take: 5,
      include: { user: { select: { firstName:true, lastName:true } }, service: { select: { name:true } } },
    });
    return ok(res, {
      stats: { totalBookings, pendingBookings, totalServices, totalRevenue, avgRating, totalReviews: reviews.length },
      recentBookings,
    });
  } catch (e) { return serverError(res, e); }
};

/* ─── PROFILE ───────────────────────────────────────────────────────────── */
exports.getProfile = async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.user.id } });
    if (!vendor) return notFound(res, 'Vendor not found');
    return ok(res, { vendor: strip(vendor) });
  } catch (e) { return serverError(res, e); }
};

exports.updateProfile = async (req, res) => {
  try {
    /* B-09: whitelist allowed fields — prevent self-elevation of status, commissionRate etc. */
    const {
      firstName,
      lastName,
      phone,
      about,
      address,
      location,
      avatar,
      banner,
      companyName,
      category,
    } = req.body;
    const vendor = await prisma.vendor.update({ where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        phone,
        about: safe(about),
        address: safe(address),
        location: safe(location),
        avatar,
        banner,
        companyName: safe(companyName),
        category: safe(category),
      } });
    return ok(res, { vendor: strip(vendor) }, 'Profile updated');
  } catch (e) { return serverError(res, e); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return fail(res, 'Current and new password are required');
    if (newPassword.length < 8) return fail(res, 'Password must be at least 8 characters');
    const vendor = await prisma.vendor.findUnique({ where: { id: req.user.id } });
    if (!vendor) return notFound(res, 'Vendor not found');
    const match = await bcrypt.compare(currentPassword, vendor.password || ''); /* B-20 */
    if (!match) return fail(res, 'Current password is incorrect');
    await prisma.vendor.update({ where: { id: req.user.id },
      data: { password: await bcrypt.hash(newPassword, BCRYPT_ROUNDS) } }); /* B-08 */
    return ok(res, {}, 'Password changed successfully');
  } catch (e) { return serverError(res, e); }
};

/* ─── SERVICES ──────────────────────────────────────────────────────────── */
exports.getServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const where = { vendorId: req.user.id };
    if (status) where.status = status;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [services, total] = await Promise.all([
      prisma.service.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' }, include: { packages: true } }),
      prisma.service.count({ where }),
    ]);
    return ok(res, { data: services, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getService = async (req, res) => {
  try {
    const svc = await prisma.service.findFirst({ where: { id: req.params.id, vendorId: req.user.id },
      include: { packages: true, policies: true } });
    if (!svc) return notFound(res, 'Service not found');
    return ok(res, { service: svc });
  } catch (e) { return serverError(res, e); }
};

exports.createService = async (req, res) => {
  try {
    const { name, category, description, pricingType, basePrice,
            minGuests, maxGuests, depositPercent, minHours, location, packages, policies } = req.body;
    if (!name || !category || !basePrice) return fail(res, 'Name, category and base price are required');
    const svc = await prisma.service.create({ data: {
      vendorId: req.user.id, name: safe(name), category,
      description: safe(description), pricingType, basePrice: Number(basePrice),
      minGuests: minGuests ? Number(minGuests) : null,
      maxGuests: maxGuests ? Number(maxGuests) : null,
      depositPercent: depositPercent ? Number(depositPercent) : 20,
      minHours: minHours ? Number(minHours) : null,
      location: safe(location),
      status: 'Active', rating: 0, reviewCount: 0, images: [],
    }});
    return created(res, { service: svc }, 'Service created successfully');
  } catch (e) { return serverError(res, e); }
};

exports.updateService = async (req, res) => {
  try {
    const exists = await prisma.service.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!exists) return notFound(res, 'Service not found');
    /* B-09: whitelist allowed update fields */
    const { name, category, description, pricingType, basePrice,
            minGuests, maxGuests, depositPercent, minHours, location, packages, policies, images } = req.body;
    const updated = await prisma.service.update({ where: { id: req.params.id }, data: {
      name: safe(name), category, description: safe(description), pricingType,
      basePrice: basePrice ? Number(basePrice) : undefined,
      minGuests: minGuests ? Number(minGuests) : undefined,
      maxGuests: maxGuests ? Number(maxGuests) : undefined,
      depositPercent: depositPercent ? Number(depositPercent) : undefined,
      minHours: minHours ? Number(minHours) : undefined,
      location: safe(location), images,
    }});
    return ok(res, { service: updated }, 'Service updated');
  } catch (e) { return serverError(res, e); }
};

exports.toggleServiceStatus = async (req, res) => {
  try {
    const svc = await prisma.service.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!svc) return notFound(res, 'Service not found');
    const updated = await prisma.service.update({ where: { id: req.params.id },
      data: { status: svc.status === 'Active' ? 'Inactive' : 'Active' } });
    return ok(res, { service: updated }, 'Service status toggled');
  } catch (e) { return serverError(res, e); }
};

exports.deleteService = async (req, res) => {
  try {
    const exists = await prisma.service.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!exists) return notFound(res, 'Service not found');
    await prisma.service.delete({ where: { id: req.params.id } });
    return ok(res, {}, 'Service deleted');
  } catch (e) { return serverError(res, e); }
};

/* ─── ADD-ONS ───────────────────────────────────────────────────────────── */
exports.getAddons = async (req, res) => {
  try {
    const addons = await prisma.addon.findMany({ where: { vendorId: req.user.id }, orderBy: { createdAt: 'desc' } });
    return ok(res, { addons });
  } catch (e) { return serverError(res, e); }
};

exports.getAddon = async (req, res) => {
  try {
    const addon = await prisma.addon.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!addon) return notFound(res, 'Add-on not found');
    return ok(res, { addon });
  } catch (e) { return serverError(res, e); }
};

exports.createAddon = async (req, res) => {
  try {
    const { title, category, priceType, price, status = 'Active' } = req.body;
    if (!title || !priceType || !price) return fail(res, 'Title, price type and price are required');
    const addon = await prisma.addon.create({ data: {
      vendorId: req.user.id, title: safe(title), category, priceType, price: Number(price), status } });
    return created(res, { addon }, 'Add-on created');
  } catch (e) { return serverError(res, e); }
};

exports.updateAddon = async (req, res) => {
  try {
    const exists = await prisma.addon.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!exists) return notFound(res, 'Add-on not found');
    /* B-09: whitelist fields */
    const { title, category, priceType, price, status } = req.body;
    const updated = await prisma.addon.update({ where: { id: req.params.id },
      data: { title: safe(title), category, priceType, price: price ? Number(price) : undefined, status } });
    return ok(res, { addon: updated }, 'Add-on updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteAddon = async (req, res) => {
  try {
    const exists = await prisma.addon.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!exists) return notFound(res, 'Add-on not found');
    await prisma.addon.delete({ where: { id: req.params.id } });
    return ok(res, {}, 'Add-on deleted');
  } catch (e) { return serverError(res, e); }
};

/* ─── BOOKINGS ──────────────────────────────────────────────────────────── */
exports.getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const where = { vendorId: req.user.id };
    if (status) where.status = status;
    if (type)   where.type   = type;
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName:true, lastName:true, phone:true } }, service: { select: { name:true } } } }),
      prisma.booking.count({ where }),
    ]);
    return ok(res, { data: bookings, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getBookingRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [requests, total] = await Promise.all([
      prisma.booking.findMany({ where: { vendorId: req.user.id, status: 'Pending' },
        skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName:true, lastName:true } }, service: { select: { name:true } } } }),
      prisma.booking.count({ where: { vendorId: req.user.id, status: 'Pending' } }),
    ]);
    return ok(res, { data: requests, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, vendorId: req.user.id },
      include: { user: { select: { id:true, firstName:true, lastName:true, phone:true, email:true } }, service: true, payments: true },
    });
    if (!booking) return notFound(res, 'Booking not found');
    return ok(res, { booking });
  } catch (e) { return serverError(res, e); }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!booking) return notFound(res, 'Booking not found');
    const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: 'Upcoming' } });
    return ok(res, { booking: updated }, 'Booking approved');
  } catch (e) { return serverError(res, e); }
};

exports.rejectBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return fail(res, 'Rejection reason is required');
    const booking = await prisma.booking.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!booking) return notFound(res, 'Booking not found');
    const updated = await prisma.booking.update({ where: { id: booking.id },
      data: { status: 'Rejected', rejectionReason: safe(reason) } });
    return ok(res, { booking: updated }, 'Booking rejected');
  } catch (e) { return serverError(res, e); }
};

exports.completeBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!booking) return notFound(res, 'Booking not found');
    const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: 'Completed' } });
    return ok(res, { booking: updated }, 'Booking marked as completed');
  } catch (e) { return serverError(res, e); }
};

/* ─── CUSTOM QUOTATIONS ─────────────────────────────────────────────────── */
exports.getCustomQuotations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, subTab = 'requests' } = req.query;
    const where = {};
    if (subTab === 'requests') {
      where.status = 'Requested';
      where.vendorId = null; /* unassigned requests */
    } else {
      where.vendorId = req.user.id;
      if (status) where.status = status;
    }
    const [quotations, total] = await Promise.all([
      prisma.customQuotation.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName:true, lastName:true, phone:true } } } }),
      prisma.customQuotation.count({ where }),
    ]);
    return ok(res, { data: quotations, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getCustomQuotation = async (req, res) => {
  try {
    const quotation = await prisma.customQuotation.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id:true, firstName:true, lastName:true, phone:true, email:true } } },
    });
    if (!quotation) return notFound(res, 'Quotation not found');
    return ok(res, { quotation });
  } catch (e) { return serverError(res, e); }
};

exports.sendQuotation = async (req, res) => {
  try {
    const { quotationAmount, notes, validUntil, depositPercent } = req.body;
    if (!quotationAmount) return fail(res, 'Quotation amount is required');
    const quotation = await prisma.customQuotation.findUnique({ where: { id: req.params.id } });
    if (!quotation) return notFound(res, 'Quotation not found');
    const updated = await prisma.customQuotation.update({ where: { id: req.params.id }, data: {
      vendorId: req.user.id,
      quotationAmount: Number(quotationAmount),
      notes: safe(notes),
      depositPercent: depositPercent ? Number(depositPercent) : 20,
      validUntil: validUntil ? new Date(validUntil) : null,
      status: 'Pending',
    }});
    return ok(res, { quotation: updated }, 'Quotation sent to customer');
  } catch (e) { return serverError(res, e); }
};

exports.rejectQuotationRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const quotation = await prisma.customQuotation.findUnique({ where: { id: req.params.id } });
    if (!quotation) return notFound(res, 'Quotation not found');
    const updated = await prisma.customQuotation.update({ where: { id: req.params.id },
      data: { status: 'Rejected', rejectionReason: safe(reason) } });
    return ok(res, { quotation: updated }, 'Quotation request rejected');
  } catch (e) { return serverError(res, e); }
};

/* ─── REPORTED BOOKINGS ─────────────────────────────────────────────────── */
exports.getReportedBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [reports, total] = await Promise.all([
      prisma.reportedBooking.findMany({
        where: { booking: { vendorId: req.user.id } },
        skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' },
        include: { booking: { select: { id:true, eventDate:true } } },
      }),
      prisma.reportedBooking.count({ where: { booking: { vendorId: req.user.id } } }),
    ]);
    return ok(res, { data: reports, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getReportedBooking = async (req, res) => {
  try {
    const report = await prisma.reportedBooking.findUnique({ where: { id: req.params.id },
      include: { booking: true } });
    if (!report) return notFound(res, 'Report not found');
    return ok(res, { report });
  } catch (e) { return serverError(res, e); }
};

/* ─── MEETING REQUESTS ──────────────────────────────────────────────────── */
exports.getMeetingRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = { vendorId: req.user.id };
    if (status) where.status = status;
    const [meetings, total] = await Promise.all([
      prisma.meetingRequest.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName:true, lastName:true, phone:true } } } }),
      prisma.meetingRequest.count({ where }),
    ]);
    return ok(res, { data: meetings, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.getMeetingRequest = async (req, res) => {
  try {
    const meeting = await prisma.meetingRequest.findFirst({ where: { id: req.params.id, vendorId: req.user.id },
      include: { user: { select: { firstName:true, lastName:true, email:true, phone:true } } } });
    if (!meeting) return notFound(res, 'Meeting request not found');
    return ok(res, { meeting });
  } catch (e) { return serverError(res, e); }
};

exports.updateMeetingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Pending','Contacted','Meeting_Scheduled','Lost','Converted'];
    if (!valid.includes(status)) return fail(res, `Invalid status. Valid: ${valid.join(', ')}`);
    const meeting = await prisma.meetingRequest.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!meeting) return notFound(res, 'Meeting not found');
    const updated = await prisma.meetingRequest.update({ where: { id: meeting.id }, data: { status } });
    return ok(res, { meeting: updated }, 'Meeting status updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── REVIEWS ───────────────────────────────────────────────────────────── */
exports.getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const where = { vendorId: req.user.id };
    if (rating) where.rating = Number(rating);
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName:true, lastName:true, avatar:true } } } }),
      prisma.review.count({ where }),
    ]);
    return ok(res, { data: reviews, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await prisma.review.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!review) return notFound(res, 'Review not found');
    const updated = await prisma.review.update({ where: { id: review.id },
      data: { vendorReply: safe(reply) } });
    return ok(res, { review: updated }, 'Reply posted');
  } catch (e) { return serverError(res, e); }
};

/* ─── PAYMENT LOGS ──────────────────────────────────────────────────────── */
exports.getPaymentLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where: { vendorId: req.user.id },
        skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.payment.count({ where: { vendorId: req.user.id } }),
    ]);
    return ok(res, { data: payments, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

/* ─── SUBSCRIPTION ──────────────────────────────────────────────────────── */
exports.getSubscription = async (req, res) => {
  try {
    const [vendor, plans, logs] = await Promise.all([
      prisma.vendor.findUnique({ where: { id: req.user.id }, select: { subscriptionPlan:true, subscriptionExpiry:true } }),
      prisma.subscriptionPlan.findMany({ where: { isActive: true } }),
      prisma.subscriptionLog.findMany({ where: { vendorId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);
    return ok(res, { currentPlan: vendor?.subscriptionPlan, expiresAt: vendor?.subscriptionExpiry, plans, logs });
  } catch (e) { return serverError(res, e); }
};

exports.getSubscriptionLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [logs, total] = await Promise.all([
      prisma.subscriptionLog.findMany({ where: { vendorId: req.user.id },
        skip: (Number(page)-1)*Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.subscriptionLog.count({ where: { vendorId: req.user.id } }),
    ]);
    return ok(res, { data: logs, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

exports.changeSubscription = async (req, res) => {
  try {
    const { planId, billing = 'monthly' } = req.body;
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) return notFound(res, 'Plan not found');
    const endDate = new Date(Date.now() + (billing === 'yearly' ? 365 : 30) * 864e5);
    await prisma.vendor.update({ where: { id: req.user.id },
      data: { subscriptionPlan: plan.name, subscriptionExpiry: endDate } });
    const log = await prisma.subscriptionLog.create({ data: {
      vendorId: req.user.id, planId: plan.id, planName: plan.name,
      startDate: new Date(), endDate,
      amount: billing === 'yearly' ? plan.priceYearly : plan.priceMonthly,
      billing, status: 'Active',
    }});
    return ok(res, { subscription: log }, 'Subscription changed');
  } catch (e) { return serverError(res, e); }
};

/* ─── BANK DETAILS ──────────────────────────────────────────────────────── */
exports.getBankDetails = async (req, res) => {
  try {
    const banks = await prisma.bankDetail.findMany({ where: { vendorId: req.user.id } });
    return ok(res, { bankDetails: banks });
  } catch (e) { return serverError(res, e); }
};

exports.addBankDetail = async (req, res) => {
  try {
    const { bankName, accountName, iban, swift, routingNumber, isPrimary = false } = req.body;
    if (!bankName || !iban) return fail(res, 'Bank name and IBAN are required');
    if (isPrimary) {
      await prisma.bankDetail.updateMany({ where: { vendorId: req.user.id }, data: { isPrimary: false } });
    }
    const bank = await prisma.bankDetail.create({ data: {
      vendorId: req.user.id, bankName: safe(bankName), accountName: safe(accountName),
      iban, swift, routingNumber, isPrimary,
    }});
    return created(res, { bank }, 'Bank account added');
  } catch (e) { return serverError(res, e); }
};

exports.updateBankDetail = async (req, res) => {
  try {
    const exists = await prisma.bankDetail.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!exists) return notFound(res, 'Bank detail not found');
    const { bankName, accountName, iban, swift, routingNumber, isPrimary } = req.body;
    const updated = await prisma.bankDetail.update({ where: { id: req.params.id },
      data: { bankName: safe(bankName), accountName: safe(accountName), iban, swift, routingNumber, isPrimary } });
    return ok(res, { bank: updated }, 'Bank detail updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteBankDetail = async (req, res) => {
  try {
    const exists = await prisma.bankDetail.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!exists) return notFound(res, 'Bank detail not found');
    await prisma.bankDetail.delete({ where: { id: req.params.id } });
    return ok(res, {}, 'Bank detail deleted');
  } catch (e) { return serverError(res, e); }
};

/* ─── NOTIFICATIONS ─────────────────────────────────────────────────────── */
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    const where = { vendorId: req.user.id };
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
    const notif = await prisma.notification.findFirst({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!notif) return notFound(res, 'Notification not found');
    const updated = await prisma.notification.update({ where: { id: notif.id }, data: { isRead: true } });
    return ok(res, { notification: updated });
  } catch (e) { return serverError(res, e); }
};

exports.markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({ where: { vendorId: req.user.id, isRead: false }, data: { isRead: true } });
    return ok(res, {}, 'All notifications marked as read');
  } catch (e) { return serverError(res, e); }
};

/* ─── SUBSCRIPTION PAYMENT — Feature #5 ──────────────────────────────────── */
exports.paySubscription = async (req, res) => {
  try {
    const { planId, billing = 'monthly' } = req.body;
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) return notFound(res, 'Plan not found');
    const vendor = await prisma.vendor.findUnique({ where: { id: req.user.id } });
    const amount = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    if (!amount) return fail(res, 'This plan has no price configured');

    const paymentService = require('../services/payment.service');
    const result = await paymentService.createPaymentPage({
      bookingId:   `SUB-${req.user.id}-${Date.now()}`,
      amount,
      method:      'card',
      customer:    { name: `${vendor.firstName} ${vendor.lastName}`, email: vendor.email, phone: vendor.phone || '' },
      description: `${plan.name} subscription (${billing})`,
    });

    return ok(res, { ...result, amount, currency: 'AED', plan: plan.name, billing }, 'Payment page created for subscription');
  } catch (e) { return serverError(res, e); }
};

/* ─── CONTACT US (vendor submitting a support query) ────────────────────── */
exports.contactUs = async (req, res) => {
  try {
    const { subject, message, name, email, phone } = req.body;
    if (!subject || !message) return fail(res, 'Subject and message are required');
    const query = await prisma.query.create({ data: {
      vendorId: req.user.id, name: safe(name), email, phone,
      subject: safe(subject), message: safe(message), status: 'Open',
    }});
    return created(res, { query }, 'Message sent. We will get back to you soon.');
  } catch (e) { return serverError(res, e); }
};
