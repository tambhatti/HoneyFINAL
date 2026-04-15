'use strict';

/* ── pdfkit (lazy init) ─────────────────────────────────────────────────────── */
let PDFDocument = null;
function getPDF() {
  if (!PDFDocument) {
    try { PDFDocument = require('pdfkit'); }
    catch { throw new Error('pdfkit not installed — run: npm install pdfkit'); }
  }
  return PDFDocument;
}

/* ── Brand constants ─────────────────────────────────────────────────────────── */
const BRAND = {
  primary: '#174a37',
  gold:    '#CFB383',
  gray:    '#6b7280',
  light:   '#F5F5EF',
  black:   '#1a1a1a',
};

/* ─────────────────────────────────────────────────────────────────────────────
   GENERATE PAYMENT RECEIPT PDF
   Returns a Buffer containing the PDF
─────────────────────────────────────────────────────────────────────────────*/
async function generateReceipt(data) {
  const {
    payment,
    booking,
    user,
    vendor,
  } = data;

  const PDF = getPDF();
  const doc = new PDF({ size: 'A4', margin: 50 });

  const chunks = [];
  doc.on('data', chunk => chunks.push(chunk));

  await new Promise((resolve) => {
    doc.on('end', resolve);

    /* ── Header ─────────────────────────────────────────────────────────────── */
    // Background bar
    doc.rect(0, 0, doc.page.width, 90).fill(BRAND.primary);

    // Logo text
    doc.font('Helvetica-Bold').fontSize(26).fillColor(BRAND.gold)
       .text('HONEYMOON', 50, 28, { align: 'center' });
    doc.font('Helvetica').fontSize(10).fillColor('rgba(255,255,255,0.7)')
       .text('Luxury Emirati Weddings', 50, 58, { align: 'center' });

    doc.moveDown(3);

    /* ── Title ──────────────────────────────────────────────────────────────── */
    doc.font('Helvetica-Bold').fontSize(20).fillColor(BRAND.black)
       .text('Payment Receipt', 50, 110, { align: 'center' });

    doc.moveTo(50, 138).lineTo(545, 138).lineWidth(1).strokeColor(BRAND.light).stroke();

    /* ── Receipt meta ────────────────────────────────────────────────────────── */
    const leftX  = 50;
    const rightX = 300;
    let   y      = 155;

    function row(label, value, bold = false) {
      doc.font('Helvetica').fontSize(10).fillColor(BRAND.gray).text(label, leftX, y);
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10).fillColor(BRAND.black)
         .text(value || '—', rightX, y, { width: 245, align: 'right' });
      y += 22;
    }

    row('Receipt Number:', `#${payment.id}`);
    row('Transaction ID:', payment.transactionId || payment.gatewayRef || '—');
    row('Date:',  new Date(payment.createdAt).toLocaleDateString('en-AE', { day:'2-digit', month:'long', year:'numeric' }));
    row('Time:',  new Date(payment.createdAt).toLocaleTimeString('en-AE'));
    row('Payment Method:', formatMethod(payment.method));
    row('Status:', '✓ Successful', true);

    doc.moveTo(50, y + 5).lineTo(545, y + 5).lineWidth(0.5).strokeColor('#e5e7eb').stroke();
    y += 20;

    /* ── Customer ────────────────────────────────────────────────────────────── */
    doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND.primary).text('Customer Details', leftX, y);
    y += 20;
    if (user) {
      row('Name:',  `${user.firstName || ''} ${user.lastName || ''}`.trim());
      row('Email:', user.email || '—');
      row('Phone:', user.phone || '—');
    }

    doc.moveTo(50, y + 5).lineTo(545, y + 5).lineWidth(0.5).strokeColor('#e5e7eb').stroke();
    y += 20;

    /* ── Booking ─────────────────────────────────────────────────────────────── */
    doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND.primary).text('Booking Details', leftX, y);
    y += 20;
    if (booking) {
      row('Booking ID:',   `#${booking.id}`);
      row('Vendor:',        vendor?.companyName || '—');
      row('Event Date:',    booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-AE', { day:'2-digit', month:'long', year:'numeric' }) : '—');
      row('Location:',      booking.location || '—');
      row('Guests:',        String(booking.guestCount || '—'));
      row('Payment Type:',  payment.type === 'deposit' ? `Deposit (${Math.round((payment.amount / booking.totalAmount) * 100)}%)` : 'Final Payment');
      row('Total Booking:',  `AED ${(booking.totalAmount || 0).toLocaleString('en-AE', { minimumFractionDigits:2 })}`, true);
      row('Amount Remaining:', `AED ${Math.max(0, (booking.totalAmount || 0) - (payment.amount || 0)).toLocaleString('en-AE', { minimumFractionDigits:2 })}`, false);
    }

    doc.moveTo(50, y + 5).lineTo(545, y + 5).lineWidth(0.5).strokeColor('#e5e7eb').stroke();
    y += 20;

    /* ── Amount box ──────────────────────────────────────────────────────────── */
    doc.rect(50, y, 495, 60).fill(BRAND.primary).stroke(BRAND.primary);
    doc.font('Helvetica').fontSize(12).fillColor('rgba(255,255,255,0.7)')
       .text('Amount Paid', leftX + 20, y + 12);
    doc.font('Helvetica-Bold').fontSize(22).fillColor(BRAND.gold)
       .text(`AED ${(payment.amount || 0).toLocaleString('en-AE', { minimumFractionDigits:2 })}`, leftX + 20, y + 32);

    if (payment.loyaltyPointsEarned) {
      doc.font('Helvetica').fontSize(10).fillColor('rgba(255,255,255,0.7)')
         .text(`+${payment.loyaltyPointsEarned} loyalty points earned`, rightX, y + 40, { width: 200, align: 'right' });
    }

    y += 80;

    /* ── Footer ──────────────────────────────────────────────────────────────── */
    doc.font('Helvetica').fontSize(9).fillColor(BRAND.gray)
       .text('Thank you for choosing Honeymoon! For support, contact us at support@honeymoon.ae', leftX, y, { align: 'center', width: 495 });
    y += 16;
    doc.font('Helvetica').fontSize(8).fillColor('#9ca3af')
       .text('This is an automatically generated receipt. No signature required.', leftX, y, { align: 'center', width: 495 });

    // Decorative gold bar at bottom
    doc.rect(0, doc.page.height - 6, doc.page.width, 6).fill(BRAND.gold);

    doc.end();
  });

  return Buffer.concat(chunks);
}

function formatMethod(method) {
  const map = { card: 'Credit / Debit Card', apple_pay: 'Apple Pay', bank_transfer: 'Bank Transfer' };
  return map[method] || method || 'Card';
}

/* ─────────────────────────────────────────────────────────────────────────────
   SAVE RECEIPT TO S3 AND STORE URL ON PAYMENT RECORD
─────────────────────────────────────────────────────────────────────────────*/
async function generateAndStoreReceipt(paymentId) {
  const prisma  = require('../config/prisma');
  const upload  = require('./upload.service');

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: true,
      user:    { select: { id:true, firstName:true, lastName:true, email:true, phone:true } },
      vendor:  { select: { id:true, companyName:true } },
    }
  });

  if (!payment) throw new Error('Payment not found');

  const pdfBuffer = await generateReceipt({
    payment: { ...payment, loyaltyPointsEarned: payment.loyaltyPointsEarned },
    booking: payment.booking,
    user:    payment.user,
    vendor:  payment.vendor,
  });

  const { url } = await upload.uploadBuffer(pdfBuffer, 'application/pdf', `receipt-${paymentId}.pdf`, upload.FOLDERS.receipts);

  await prisma.payment.update({ where: { id: paymentId }, data: { receiptUrl: url } });

  return { url, buffer: pdfBuffer };
}

module.exports = { generateReceipt, generateAndStoreReceipt };
