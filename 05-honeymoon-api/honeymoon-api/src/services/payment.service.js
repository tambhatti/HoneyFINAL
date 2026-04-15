'use strict';
const crypto = require('crypto');
const prisma  = require('../config/prisma');

/*
  PayTabs is the primary UAE payment gateway.
  Telr is the fallback.

  Required env vars:
    PAYTABS_PROFILE_ID      — from merchant.paytabs.com → Developers
    PAYTABS_SERVER_KEY      — API server key
    PAYTABS_REGION          — ARE (UAE), EGY, SAU, OMN, JOR, IRQ, QAT
    PAYTABS_CALLBACK_URL    — https://api.honeymoon.ae/api/v1/payments/callback
    PAYTABS_RETURN_URL      — https://app.honeymoon.ae/payment/result
*/

const PAYTABS = {
  profileId:   process.env.PAYTABS_PROFILE_ID,
  serverKey:   process.env.PAYTABS_SERVER_KEY,
  region:      process.env.PAYTABS_REGION || 'ARE',
  callbackUrl: process.env.PAYTABS_CALLBACK_URL || 'https://api.honeymoon.ae/api/v1/payments/callback',
  returnUrl:   process.env.PAYTABS_RETURN_URL   || 'https://app.honeymoon.ae/payment/result',
  get baseUrl() {
    const regions = { ARE:'https://secure.paytabs.com', EGY:'https://secure-egypt.paytabs.com', SAU:'https://secure.paytabs.sa' };
    return regions[this.region] || regions.ARE;
  },
};

/* ── TELR fallback ─────────────────────────────────────────────────────────── */
const TELR = {
  storeId:  process.env.TELR_STORE_ID,
  authKey:  process.env.TELR_AUTH_KEY,
  baseUrl:  'https://secure.telr.com/gateway/order.json',
};

/* ─────────────────────────────────────────────────────────────────────────────
   CREATE PAYMENT PAGE (PayTabs hosted payment)
   Returns a redirect URL that the user opens in their browser/webview
─────────────────────────────────────────────────────────────────────────────*/
async function createPaymentPage(params) {
  const {
    bookingId, amount, currency = 'AED',
    method = 'card',        // card | apple_pay | bank_transfer
    customer,               // { name, email, phone, street, city, country }
    description,
    lang = 'en',
  } = params;

  // Dev mode — return mock redirect URL
  if (!PAYTABS.profileId || !PAYTABS.serverKey) {
    console.log(`\n[PayTabs] DEV MODE — mock payment for booking ${bookingId} AED ${amount}\n`);
    return {
      payment_ref:   `PT-DEV-${Date.now()}`,
      redirect_url:  `${PAYTABS.returnUrl}?bookingId=${bookingId}&status=A&ref=PT-DEV-${Date.now()}`,
      gateway:       'paytabs_mock',
    };
  }

  const body = {
    profile_id: Number(PAYTABS.profileId),
    tran_type:  'sale',
    tran_class: 'ecom',
    cart_id:    bookingId,
    cart_currency: currency,
    cart_amount:   amount,
    cart_description: description || `Honeymoon booking ${bookingId}`,
    paypage_lang: lang,
    callback:   PAYTABS.callbackUrl,
    return:     `${PAYTABS.returnUrl}?bookingId=${bookingId}`,
    customer_details: {
      name:    customer.name    || 'Guest',
      email:   customer.email   || 'guest@honeymoon.ae',
      phone:   customer.phone   || '+97100000000',
      street1: customer.street  || 'UAE',
      city:    customer.city    || 'Dubai',
      state:   customer.state   || 'Dubai',
      country: customer.country || 'AE',
      zip:     customer.zip     || '00000',
    },
    // Apple Pay support
    payment_methods: method === 'apple_pay' ? ['applePay'] : undefined,
  };

  const response = await fetch(`${PAYTABS.baseUrl}/payment/request`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': PAYTABS.serverKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`PayTabs error: ${err}`);
  }

  const data = await response.json();

  if (data.redirect_url) {
    return {
      payment_ref:  data.tran_ref,
      redirect_url: data.redirect_url,
      gateway:      'paytabs',
    };
  }

  throw new Error(data.message || 'Failed to create payment page');
}

/* ─────────────────────────────────────────────────────────────────────────────
   VERIFY PAYTABS WEBHOOK SIGNATURE
   PayTabs sends a POST to callbackUrl after payment
─────────────────────────────────────────────────────────────────────────────*/
function verifyWebhookSignature(rawBody, receivedSignature) {
  if (!PAYTABS.serverKey) return true; // dev mode — skip
  if (!receivedSignature) return false;

  // PayTabs signature: SHA256 HMAC of raw body with server key
  const expected = crypto
    .createHmac('sha256', PAYTABS.serverKey)
    .update(rawBody)
    .digest('hex');

  // timingSafeEqual throws RangeError if buffers differ in length
  const expectedBuf  = Buffer.from(expected, 'hex');
  const receivedBuf  = Buffer.from(receivedSignature, 'hex');
  if (expectedBuf.length !== receivedBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

/* ─────────────────────────────────────────────────────────────────────────────
   QUERY TRANSACTION STATUS
─────────────────────────────────────────────────────────────────────────────*/
async function queryTransaction(tranRef) {
  if (!PAYTABS.profileId) {
    return { tran_ref: tranRef, payment_result: { response_status: 'A', response_message: 'Approved' } };
  }

  const response = await fetch(`${PAYTABS.baseUrl}/payment/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': PAYTABS.serverKey },
    body: JSON.stringify({ profile_id: Number(PAYTABS.profileId), tran_ref: tranRef }),
  });

  return response.json();
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROCESS WEBHOOK — update booking + payment in DB
─────────────────────────────────────────────────────────────────────────────*/
async function processWebhook(payload) {
  /*
    PayTabs webhook payload fields:
    - tran_ref           → gateway transaction reference
    - cart_id            → our bookingId
    - cart_amount        → amount
    - cart_currency
    - payment_result.response_status → A=approved, D=declined, V=void, E=error
    - payment_result.response_message
    - customer_details
  */
  const {
    tran_ref: gatewayRef,
    cart_id:  bookingId,
    cart_amount: amount,
    payment_result: { response_status: status, response_message: message } = {}
  } = payload;

  const isApproved = status === 'A';

  if (!gatewayRef) {
    console.error(`[Payment Webhook] Missing tran_ref in payload for booking ${bookingId}`);
    return { handled: false, reason: 'missing_transaction_ref' };
  }

  // Find booking
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    console.error(`[Payment Webhook] Booking not found: ${bookingId}`);
    return { handled: false, reason: 'booking_not_found' };
  }

  // Update or create payment record
  const payment = await prisma.payment.upsert({
    where:  { transactionId: gatewayRef },
    update: { status: isApproved ? 'completed' : 'failed', gatewayData: payload },
    create: {
      bookingId,
      userId:   booking.userId,
      vendorId: booking.vendorId,
      amount:   parseFloat(amount),
      type:     booking.depositPaid ? 'final' : 'deposit',
      method:   'card',
      status:   isApproved ? 'completed' : 'failed',
      transactionId: gatewayRef,
      gatewayRef,
      gatewayData: payload,
    }
  });

  if (isApproved) {
    // Update booking payment status
    const isFullyPaid = parseFloat(amount) >= booking.totalAmount;
    await prisma.booking.update({
      where: { id: bookingId },
      data:  {
        depositPaid:   true,
        paymentStatus: isFullyPaid ? 'Paid' : 'Partially_Paid',
      }
    });

    // Award loyalty points (1 point per 100 AED)
    const cfg     = await prisma.loyaltyConfig.findUnique({ where: { id: 'singleton' } });
    const points  = Math.floor(parseFloat(amount) / (cfg?.baseAmount || 100)) * (cfg?.pointsPerBase || 1);
    if (points > 0) {
      await prisma.user.update({ where: { id: booking.userId }, data: { loyaltyPoints: { increment: points } } });
      await prisma.loyaltyLog.create({
        data: { userId: booking.userId, type: 'awarded', points, bookingId, description: `Points earned on AED ${amount} payment` }
      });
    }

    // Create payout record for vendor
    const commCfg   = await prisma.commissionConfig.findUnique({ where: { id: 'singleton' } });
    const commission = parseFloat(amount) * ((commCfg?.defaultRate || 10) / 100);
    await prisma.payout.create({
      data: {
        vendorId:   booking.vendorId,
        bookingId,
        amount:     parseFloat(amount),
        commission,
        netAmount:  parseFloat(amount) - commission,
        status:     'Pending',
        requestedAt: new Date(),
      }
    });

    // Send notifications + emails (fire and forget)
    sendPaymentNotifications(booking, payment, points).catch(() => {});
  }

  return { handled: true, approved: isApproved, paymentId: payment.id };
}

async function sendPaymentNotifications(booking, payment, loyaltyPoints) {
  const emailService = require('./email.service');
  const user = await prisma.user.findUnique({ where: { id: booking.userId } });
  if (user?.email) {
    await emailService.sendPaymentReceipt(user.email, user.firstName, payment);
  }
  // Create in-app notification
  await prisma.notification.create({
    data: {
      userId:  booking.userId,
      type:    'payment_received',
      title:   'Payment Confirmed',
      message: `Your payment of AED ${payment.amount} for booking #${booking.id} has been confirmed.${loyaltyPoints ? ` You earned ${loyaltyPoints} loyalty points!` : ''}`,
      data:    { bookingId: booking.id, paymentId: payment.id },
    }
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   TELR FALLBACK (if PayTabs unavailable)
─────────────────────────────────────────────────────────────────────────────*/
async function createTelrOrder(params) {
  const { bookingId, amount, currency = 'AED', customer } = params;

  if (!TELR.storeId || !TELR.authKey) {
    return { order_ref: `TL-DEV-${Date.now()}`, url: `${PAYTABS.returnUrl}?bookingId=${bookingId}&status=ok` };
  }

  const body = {
    method:    'create',
    store:     TELR.storeId,
    authkey:   TELR.authKey,
    framed:    0,
    order: {
      cartid:   bookingId,
      test:     process.env.NODE_ENV !== 'production' ? 1 : 0,
      amount:   String(amount),
      currency,
      description: `Honeymoon booking ${bookingId}`,
    },
    customer: {
      ref:   customer.email,
      email: customer.email,
      name:  { forenames: customer.name, surname: '' },
    },
    return: {
      authorised: `${PAYTABS.returnUrl}?bookingId=${bookingId}&status=ok`,
      declined:   `${PAYTABS.returnUrl}?bookingId=${bookingId}&status=fail`,
      cancelled:  `${PAYTABS.returnUrl}?bookingId=${bookingId}&status=cancel`,
    },
  };

  const response = await fetch(TELR.baseUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });

  const data = await response.json();
  if (data.order?.url) return { order_ref: data.order.ref, url: data.order.url, gateway: 'telr' };
  throw new Error(data.error?.message || 'Telr error');
}

module.exports = {
  createPaymentPage,
  verifyWebhookSignature,
  queryTransaction,
  processWebhook,
  createTelrOrder,
  PAYTABS,
};
