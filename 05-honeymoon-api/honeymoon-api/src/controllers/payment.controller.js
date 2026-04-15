'use strict';
const prisma          = require('../config/prisma');
const paymentService  = require('../services/payment.service');
const applePayService = require('../services/applepay.service');
const receiptService  = require('../services/receipt.service');
const payoutService   = require('../services/payout.service');
const webhookMiddleware = require('../middleware/webhook');
const { ok, created, fail, notFound, serverError } = require('../utils/response');

/* ─────────────────────────────────────────────────────────────────────────────
   INITIATE PAYMENT
   POST /api/v1/payments/initiate
   Creates a PayTabs hosted payment page URL
─────────────────────────────────────────────────────────────────────────────*/
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, method = 'card', useCustomQuotation = false } = req.body;
    if (!bookingId) return fail(res, 'bookingId is required');

    // Find booking (standard or custom quotation)
    let booking, totalAmount, depositAmount;

    if (useCustomQuotation) {
      const quotation = await prisma.customQuotation.findFirst({
        where: { id: bookingId, userId: req.user.id }
      });
      if (!quotation) return notFound(res, 'Quotation not found');
      if (!quotation.quotationAmount) return fail(res, 'Vendor has not sent a quotation yet');
      totalAmount   = quotation.quotationAmount;
      depositAmount = totalAmount * (quotation.depositPercent / 100);
      booking       = { id: bookingId, ...quotation };
    } else {
      booking = await prisma.booking.findFirst({
        where: { id: bookingId, userId: req.user.id },
        include: { vendor: { select: { companyName: true } } }
      });
      if (!booking) return notFound(res, 'Booking not found');
      totalAmount   = booking.totalAmount;
      depositAmount = booking.depositAmount;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    // Determine amount to charge (deposit or final)
    const chargeAmount = booking.depositPaid ? (totalAmount - depositAmount) : depositAmount;

    // Handle bank transfer — no gateway needed, just show bank details
    if (method === 'bank_transfer') {
      return ok(res, {
        method: 'bank_transfer',
        amount: chargeAmount,
        currency: 'AED',
        bankDetails: {
          accountName: 'Honeymoon Events Ltd',
          iban:        'AE07 0331 2345 6789 0123 456',
          swift:       'EBILAEAD',
          bankName:    'Emirates NBD',
          reference:   `HM-${bookingId}`,
          note:        'Please use the reference number when making the transfer. Allow 1-2 business days for verification.',
        }
      }, 'Bank transfer details');
    }

    const result = await paymentService.createPaymentPage({
      bookingId,
      amount:   chargeAmount,
      method,
      customer: {
        name:  `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        email: user?.email || '',
        phone: user?.phone || '',
      },
      description: `Honeymoon booking ${bookingId} — ${booking.depositPaid ? 'Final' : 'Deposit'} payment`,
    });

    return ok(res, {
      ...result,
      amount:   chargeAmount,
      currency: 'AED',
      type:     booking.depositPaid ? 'final' : 'deposit',
    }, 'Payment page created');
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   PAYTABS WEBHOOK CALLBACK
   POST /api/v1/payments/callback
   Called by PayTabs after payment (success or failure)
─────────────────────────────────────────────────────────────────────────────*/
exports.handleWebhook = async (req, res) => {
  try {
    // Verify signature
    const signature = req.headers['signature'] || req.headers['x-signature'];
    const isValid   = paymentService.verifyWebhookSignature(req.rawBody || JSON.stringify(req.body), signature);

    if (!isValid) {
      console.error('[Webhook] Invalid signature — possible forgery');
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const result = await paymentService.processWebhook(req.body);

    // Generate receipt async (don't block response)
    if (result.approved && result.paymentId) {
      receiptService.generateAndStoreReceipt(result.paymentId).catch(err =>
        console.error('[Webhook] Receipt generation failed:', err.message)
      );
    }

    // PayTabs expects a 200 OK response
    return res.status(200).json({ success: true, ...result });
  } catch (e) {
    console.error('[Webhook] Processing error:', e.message);
    // Still return 200 to prevent PayTabs from retrying
    return res.status(200).json({ success: false, message: e.message });
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   VERIFY PAYMENT (client polls after returning from PayTabs)
   POST /api/v1/payments/verify
─────────────────────────────────────────────────────────────────────────────*/
exports.verifyPayment = async (req, res) => {
  try {
    const { tranRef, bookingId } = req.body;
    if (!tranRef) return fail(res, 'tranRef is required');

    const txStatus = await paymentService.queryTransaction(tranRef);
    const isApproved = txStatus?.payment_result?.response_status === 'A';

    // Check DB for the payment record
    const payment = await prisma.payment.findFirst({
      where: { OR: [{ transactionId: tranRef }, { gatewayRef: tranRef }] }
    });

    // If webhook hasn't fired yet (race condition), process manually
    if (!payment && isApproved && bookingId) {
      await paymentService.processWebhook({ ...txStatus, cart_id: bookingId });
    }

    return ok(res, {
      approved: isApproved,
      status:   txStatus?.payment_result?.response_status,
      message:  txStatus?.payment_result?.response_message,
      payment:  payment ? { id: payment.id, status: payment.status, amount: payment.amount } : null,
    });
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   APPLE PAY — GET MERCHANT SESSION
   POST /api/v1/payments/apple-pay/session
─────────────────────────────────────────────────────────────────────────────*/
exports.getApplePaySession = async (req, res) => {
  try {
    const { validationURL } = req.body;
    if (!validationURL) return fail(res, 'validationURL is required');

    const session = await applePayService.requestMerchantSession(validationURL);
    return ok(res, { session }, 'Merchant session created');
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   APPLE PAY — PROCESS PAYMENT TOKEN
   POST /api/v1/payments/apple-pay/process
─────────────────────────────────────────────────────────────────────────────*/
exports.processApplePay = async (req, res) => {
  try {
    const { token, bookingId, amount } = req.body;
    if (!token || !bookingId || !amount) return fail(res, 'token, bookingId and amount are required');

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const result = await applePayService.processApplePayToken(token, bookingId, amount, {
      name:  `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      email: user?.email || '',
      phone: user?.phone || '',
    });

    // Generate receipt
    if (result.paymentId) {
      receiptService.generateAndStoreReceipt(result.paymentId).catch(() => {});
    }

    return ok(res, result, 'Apple Pay payment successful');
  } catch (e) {
    if (e.message?.includes('declined')) return fail(res, e.message, 402);
    return serverError(res, e);
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   GET APPLE PAY PAYMENT REQUEST CONFIG
   GET /api/v1/payments/apple-pay/config?amount=500
─────────────────────────────────────────────────────────────────────────────*/
exports.getApplePayConfig = (req, res) => {
  try {
    const { amount, currency = 'AED', bookingId } = req.query;
    if (!amount) return fail(res, 'amount is required');

    const items = bookingId ? [{ label: `Honeymoon Booking #${bookingId}`, amount: String(amount) }] : [];
    const config = applePayService.buildPaymentRequest(parseFloat(amount), currency, items);
    return ok(res, { config, merchantId: applePayService.APPLE_PAY_CONFIG.merchantId });
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   DOWNLOAD RECEIPT PDF
   GET /api/v1/payments/:id/receipt
─────────────────────────────────────────────────────────────────────────────*/
exports.downloadReceipt = async (req, res) => {
  try {
    const payment = await prisma.payment.findFirst({
      where: { id: req.params.id },
      include: {
        booking: true,
        user:    { select: { id:true, firstName:true, lastName:true, email:true, phone:true } },
        vendor:  { select: { id:true, companyName:true } },
      }
    });

    if (!payment) return notFound(res, 'Payment not found');

    // Verify ownership
    if (req.user.role === 'user' && payment.userId !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied' });
    if (req.user.role === 'vendor' && payment.vendorId !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied' });

    // If stored receipt URL exists, redirect to it
    if (payment.receiptUrl) {
      return res.redirect(payment.receiptUrl);
    }

    // Generate on demand
    const pdfBuffer = await receiptService.generateReceipt({
      payment, booking: payment.booking, user: payment.user, vendor: payment.vendor
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${payment.id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.send(pdfBuffer);
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   GET MY PAYMENTS
   GET /api/v1/payments/my
─────────────────────────────────────────────────────────────────────────────*/
exports.getMyPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = req.user.role === 'vendor'
      ? { vendorId: req.user.id }
      : { userId:   req.user.id };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.payment.count({ where }),
    ]);

    return ok(res, { data: payments, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN — GET ALL PAYMENTS
─────────────────────────────────────────────────────────────────────────────*/
exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, method } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = {};
    if (status) where.status = status;
    if (method) where.method = method;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.payment.count({ where }),
    ]);

    return ok(res, { data: payments, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN — APPROVE PAYOUT
─────────────────────────────────────────────────────────────────────────────*/
exports.approvePayout = async (req, res) => {
  try {
    const payout = await prisma.payout.findUnique({ where: { id: req.params.id } });
    if (!payout) return notFound(res, 'Payout not found');
    if (payout.status !== 'Pending') return fail(res, 'Only pending payouts can be approved');
    const updated = await prisma.payout.update({
      where: { id: req.params.id },
      data:  { status: 'Approved', approvedAt: new Date() }
    });
    return ok(res, { payout: updated }, 'Payout approved');
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN — PROCESS SINGLE PAYOUT
─────────────────────────────────────────────────────────────────────────────*/
exports.processPayout = async (req, res) => {
  try {
    const result = await payoutService.processPayout(req.params.id, req.user.id);
    return ok(res, { payout: result }, 'Payout processed and transferred');
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN — BULK PROCESS PAYOUTS
   POST /api/v1/admin/payouts/bulk-process
─────────────────────────────────────────────────────────────────────────────*/
exports.bulkProcessPayouts = async (req, res) => {
  try {
    const { payoutIds } = req.body;
    if (!payoutIds?.length) return fail(res, 'payoutIds array is required');
    const result = await payoutService.bulkProcessPayouts(payoutIds, req.user.id);
    return ok(res, result, `Processed ${result.success}/${result.total} payouts`);
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN — GET ALL PAYOUTS
─────────────────────────────────────────────────────────────────────────────*/
exports.getPayouts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = status ? { status } : {};
    const [payouts, total] = await Promise.all([
      prisma.payout.findMany({ where, skip, take: Number(limit), orderBy: { requestedAt: 'desc' }, include: { vendor: { select: { companyName: true } } } }),
      prisma.payout.count({ where }),
    ]);
    return ok(res, { data: payouts, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) });
  } catch (e) { return serverError(res, e); }
};

/* ─────────────────────────────────────────────────────────────────────────────
   VENDOR — GET EARNINGS
   GET /api/v1/vendor/earnings
─────────────────────────────────────────────────────────────────────────────*/
exports.getEarnings = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const earnings = await payoutService.getVendorEarnings(req.user.id, period);
    return ok(res, { earnings });
  } catch (e) { return serverError(res, e); }
};
