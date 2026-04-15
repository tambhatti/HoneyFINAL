'use strict';
const prisma       = require('../config/prisma');
const emailService = require('./email.service');

/* ── Bank transfer executor — Feature #1 ───────────────────────────────────── */
async function executeBankTransfer(params) {
  const { amount, currency, iban, accountName, reference } = params;

  /* Option A: Stripe Payouts (requires STRIPE_SECRET_KEY + Stripe Connect) */
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const transfer = await stripe.transfers.create({
        amount:              Math.round(amount * 100),
        currency:            currency.toLowerCase(),
        destination:         params.stripeAccountId || process.env.STRIPE_PLATFORM_ACCOUNT,
        transfer_group:      reference,
        description:         `Honeymoon payout — ${reference}`,
      });
      return `STRIPE-${transfer.id}`;
    } catch (e) {
      console.error('[Payout] Stripe error:', e.message);
      throw new Error(`Stripe transfer failed: ${e.message}`);
    }
  }

  /* Option B: Mashreq Bank API (requires BANK_API_KEY) */
  if (process.env.BANK_API_KEY && process.env.BANK_API_URL) {
    try {
      const res = await fetch(`${process.env.BANK_API_URL}/v1/payments/wire`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.BANK_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount, currency,
          beneficiary: { iban, accountName },
          reference, remarks: `Honeymoon payout — ${reference}`,
        }),
      });
      if (!res.ok) throw new Error(`Bank API ${res.status}`);
      const data = await res.json();
      return data.referenceId || data.transactionId || `BANK-${Date.now()}`;
    } catch (e) {
      console.error('[Payout] Bank API error:', e.message);
      throw new Error(`Bank transfer failed: ${e.message}`);
    }
  }

  /* Dev mode fallback */
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n[Payout] DEV MODE — mock transfer AED ${amount} to IBAN ${iban}\n`);
    return `TRF-DEV-${Date.now()}`;
  }

  throw new Error('No payment provider configured. Set STRIPE_SECRET_KEY or BANK_API_KEY + BANK_API_URL in .env');
}

/* ── Process single payout ──────────────────────────────────────────────────── */
async function processPayout(payoutId, adminId) {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: { vendor: { select: { id:true, firstName:true, lastName:true, email:true, companyName:true } } },
  });

  if (!payout)                    throw new Error('Payout not found');
  if (payout.status === 'Paid')   throw new Error('Payout already processed');
  if (payout.status !== 'Approved') throw new Error('Payout must be approved before processing');

  const bankDetail = await prisma.bankDetail.findFirst({ where: { vendorId: payout.vendorId, isPrimary: true } });
  if (!bankDetail) throw new Error('Vendor has no primary bank account configured');

  const transferRef = await executeBankTransfer({
    amount:      payout.netAmount,
    currency:    'AED',
    bankName:    bankDetail.bankName,
    iban:        bankDetail.iban,
    accountName: bankDetail.accountName,
    reference:   `HM-PAYOUT-${payoutId}`,
    stripeAccountId: bankDetail.stripeAccountId,
  });

  const updated = await prisma.payout.update({
    where: { id: payoutId },
    data:  { status: 'Paid', paidAt: new Date(), notes: `Transfer ref: ${transferRef}` },
  });

  emailService.send(
    payout.vendor.email,
    `Payout Processed — AED ${payout.netAmount.toFixed(2)}`,
    `<p>Your payout of AED ${payout.netAmount.toFixed(2)} has been processed. Ref: ${transferRef}</p>`
  ).catch(() => {});

  await prisma.notification.create({ data: {
    vendorId: payout.vendorId, type: 'payment_received',
    title: 'Payout Processed',
    message: `Your payout of AED ${payout.netAmount.toFixed(2)} has been processed.`,
    data: { payoutId, transferRef },
  }});

  return updated;
}

/* ── Bulk process ───────────────────────────────────────────────────────────── */
async function bulkProcessPayouts(payoutIds, adminId) {
  const results = { success: [], failed: [] };
  for (const id of payoutIds) {
    try {
      const payout = await processPayout(id, adminId);
      results.success.push({ id, netAmount: payout.netAmount });
    } catch (err) {
      results.failed.push({ id, reason: err.message });
    }
  }
  return { total: payoutIds.length, success: results.success.length, failed: results.failed.length, details: results };
}

/* ── Vendor earnings ────────────────────────────────────────────────────────── */
async function getVendorEarnings(vendorId, period = 'monthly') {
  const now   = new Date();
  const start = period === 'monthly'
    ? new Date(now.getFullYear(), now.getMonth(), 1)
    : new Date(now.getFullYear(), 0, 1);

  const payouts = await prisma.payout.findMany({ where: { vendorId, requestedAt: { gte: start } }, orderBy: { requestedAt: 'desc' } });

  return {
    period,
    totalGross:      payouts.reduce((s, p) => s + p.amount, 0),
    totalCommission: payouts.reduce((s, p) => s + p.commission, 0),
    totalNet:        payouts.reduce((s, p) => s + p.netAmount, 0),
    totalPaid:       payouts.filter(p => p.status === 'Paid').reduce((s, p) => s + p.netAmount, 0),
    totalPending:    payouts.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.netAmount, 0),
    payoutCount:     payouts.length,
  };
}

/* ── Auto-approve eligible payouts (cron) ───────────────────────────────────── */
async function autoApprovePendingPayouts() {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const eligible = await prisma.payout.findMany({
    where: { status: 'Pending', requestedAt: { lte: cutoff }, booking: { status: 'Completed', paymentStatus: 'Paid' } },
    include: { booking: true },
  });
  const updated = await prisma.payout.updateMany({
    where: { id: { in: eligible.map(p => p.id) } },
    data:  { status: 'Approved', approvedAt: new Date(), notes: 'Auto-approved after 7-day holding period' },
  });
  return updated.count;
}

module.exports = { processPayout, bulkProcessPayouts, getVendorEarnings, autoApprovePendingPayouts };
