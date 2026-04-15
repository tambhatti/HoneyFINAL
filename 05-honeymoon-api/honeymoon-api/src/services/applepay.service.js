'use strict';
const fs     = require('fs');
const path   = require('path');
const https  = require('https');

/*
  Apple Pay integration requires:
  1. Apple Pay merchant certificate (from Apple Developer portal)
  2. Domain verification file at /.well-known/apple-developer-merchantid-domain-association
  3. HTTPS domain with valid SSL

  Required env vars:
    APPLE_PAY_MERCHANT_ID       — e.g. merchant.ae.honeymoon.app
    APPLE_PAY_MERCHANT_CERT     — path to merchant certificate PEM
    APPLE_PAY_MERCHANT_KEY      — path to merchant private key PEM
    APPLE_PAY_DISPLAY_NAME      — e.g. Honeymoon Weddings
    FRONTEND_URL                — your frontend domain (must be Apple Pay verified)

  Flow:
    1. User taps Apple Pay button in browser/app
    2. Browser fires onvalidatemerchant → client calls POST /payments/apple-pay/session
    3. Server requests merchant session from Apple → returns session object to client
    4. Client completes Apple Pay sheet → sends payment token
    5. Client calls POST /payments/apple-pay/process with token + bookingId
    6. Server charges card using PayTabs Apple Pay token endpoint
*/

const APPLE_PAY_CONFIG = {
  merchantId:   process.env.APPLE_PAY_MERCHANT_ID  || 'merchant.ae.honeymoon.app',
  certPath:     process.env.APPLE_PAY_MERCHANT_CERT || './certs/apple_pay_merchant.pem',
  keyPath:      process.env.APPLE_PAY_MERCHANT_KEY  || './certs/apple_pay_merchant.key',
  displayName:  process.env.APPLE_PAY_DISPLAY_NAME  || 'Honeymoon',
  domainName:   (() => {
    try { return new URL(process.env.FRONTEND_URL || 'https://app.honeymoon.ae').hostname; } catch { return 'app.honeymoon.ae'; }
  })(),
  appleValidationUrl: 'https://apple-pay-gateway.apple.com/paymentservices/startSession',
  appleValidationUrlSandbox: 'https://apple-pay-gateway-cert.apple.com/paymentservices/startSession',
  get validationUrl() {
    return process.env.NODE_ENV === 'production'
      ? this.appleValidationUrl
      : this.appleValidationUrlSandbox;
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   REQUEST MERCHANT SESSION
   Called server-side when client's onvalidatemerchant fires
─────────────────────────────────────────────────────────────────────────────*/
async function requestMerchantSession(validationURL) {
  if (!fs.existsSync(APPLE_PAY_CONFIG.certPath) || !fs.existsSync(APPLE_PAY_CONFIG.keyPath)) {
    // DEV mode — return mock session
    console.log('[Apple Pay] DEV MODE — returning mock merchant session');
    return {
      merchantSessionIdentifier: `SSH${Date.now()}MOCK`,
      merchantIdentifier: APPLE_PAY_CONFIG.merchantId,
      displayName: APPLE_PAY_CONFIG.displayName,
      initiative: 'web',
      initiativeContext: APPLE_PAY_CONFIG.domainName,
      status: 'mock',
    };
  }

  const cert = fs.readFileSync(APPLE_PAY_CONFIG.certPath);
  const key  = fs.readFileSync(APPLE_PAY_CONFIG.keyPath);

  const body = JSON.stringify({
    merchantIdentifier: APPLE_PAY_CONFIG.merchantId,
    displayName:        APPLE_PAY_CONFIG.displayName,
    initiative:         'web',
    initiativeContext:  APPLE_PAY_CONFIG.domainName,
  });

  return new Promise((resolve, reject) => {
    const url = new URL(validationURL || APPLE_PAY_CONFIG.validationUrl);

    const options = {
      hostname: url.hostname,
      path:     url.pathname,
      method:   'POST',
      cert,
      key,
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try   { resolve(JSON.parse(data)); }
        catch { reject(new Error('Invalid Apple Pay session response')); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROCESS APPLE PAY TOKEN
   After user authorises, client sends encrypted payment token
   We forward it to PayTabs for charging
─────────────────────────────────────────────────────────────────────────────*/
async function processApplePayToken(token, bookingId, amount, customer) {
  const prisma = require('../config/prisma');
  const paymentService = require('./payment.service');

  // In production: send token to PayTabs Apple Pay endpoint
  // PayTabs handles the decryption using your Apple Pay certificate
  if (!process.env.PAYTABS_PROFILE_ID) {
    // DEV MODE
    console.log(`[Apple Pay] DEV MODE — mock charge AED ${amount} for booking ${bookingId}`);

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error('Booking not found');

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId:   booking.userId,
        vendorId: booking.vendorId,
        amount:   parseFloat(amount),
        type:     booking.depositPaid ? 'final' : 'deposit',
        method:   'apple_pay',
        status:   'completed',
        transactionId: `APPLE-DEV-${Date.now()}`,
        gatewayRef: `APPLE-DEV-${Date.now()}`,
        gatewayData: { mock: true, token: 'redacted' },
      }
    });

    await paymentService.processWebhook({
      tran_ref:    payment.transactionId,
      cart_id:     bookingId,
      cart_amount: String(amount),
      cart_currency: 'AED',
      payment_result: { response_status: 'A', response_message: 'Approved' }
    });

    return { success: true, paymentId: payment.id };
  }

  // Production: call PayTabs Apple Pay charge endpoint
  const response = await fetch(`${paymentService.PAYTABS.baseUrl}/payment/tokencharge`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': paymentService.PAYTABS.serverKey },
    body: JSON.stringify({
      profile_id:     Number(process.env.PAYTABS_PROFILE_ID),
      tran_type:      'sale',
      tran_class:     'ecom',
      cart_id:        bookingId,
      cart_currency:  'AED',
      cart_amount:    amount,
      cart_description: `Honeymoon booking ${bookingId}`,
      payment_token:  JSON.stringify(token), // Apple Pay payment token
      customer_details: {
        name:    customer.name    || 'Apple Pay User',
        email:   customer.email   || 'applepay@honeymoon.ae',
        phone:   customer.phone   || '+97100000000',
        street1: 'UAE',
        city:    'Dubai',
        state:   'Dubai',
        country: 'AE',
        zip:     '00000',
      },
    }),
  });

  const result = await response.json();
  if (result.payment_result?.response_status === 'A') {
    // Process successful payment (update DB, award points, create payout)
    await paymentService.processWebhook({ ...result, cart_id: bookingId });
    return { success: true, transactionRef: result.tran_ref };
  }

  throw new Error(result.payment_result?.response_message || 'Apple Pay charge failed');
}

/* ─────────────────────────────────────────────────────────────────────────────
   BUILD PAYMENT REQUEST (for native mobile Apple Pay)
   Returns the PaymentRequest object structure for the mobile app
─────────────────────────────────────────────────────────────────────────────*/
function buildPaymentRequest(amount, currency = 'AED', items = []) {
  return {
    countryCode:  'AE',
    currencyCode: currency,
    supportedNetworks: ['visa', 'masterCard', 'amex'],
    merchantCapabilities: ['supports3DS'],
    total: {
      label:  APPLE_PAY_CONFIG.displayName,
      amount: String(amount),
    },
    lineItems: items.length ? items : undefined,
  };
}

module.exports = {
  requestMerchantSession,
  processApplePayToken,
  buildPaymentRequest,
  APPLE_PAY_CONFIG,
};
