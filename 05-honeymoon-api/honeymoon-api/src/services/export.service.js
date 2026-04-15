'use strict';
/**
 * Export Service — Feature #4
 * Generates CSV/Excel exports for bookings and payments.
 * Install: npm install exceljs
 */

function toCSV(rows, columns) {
  const header = columns.map(c => `"${c.label}"`).join(',');
  const lines = rows.map(row =>
    columns.map(c => {
      const val = c.key.split('.').reduce((o, k) => o?.[k], row) ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  );
  return [header, ...lines].join('\r\n');
}

async function exportBookings(bookings, format = 'csv') {
  const columns = [
    { key: 'id',           label: 'Booking ID' },
    { key: 'type',         label: 'Type' },
    { key: 'status',       label: 'Status' },
    { key: 'paymentStatus',label: 'Payment Status' },
    { key: 'totalAmount',  label: 'Total (AED)' },
    { key: 'depositAmount',label: 'Deposit (AED)' },
    { key: 'eventDate',    label: 'Event Date' },
    { key: 'createdAt',    label: 'Created At' },
  ];

  if (format === 'xlsx') {
    try {
      const ExcelJS = require('exceljs');
      const wb = new ExcelJS.Workbook();
      wb.creator = 'Honeymoon Platform';
      const ws = wb.addWorksheet('Bookings');
      ws.columns = columns.map(c => ({ header: c.label, key: c.key, width: 20 }));
      ws.getRow(1).font = { bold: true };
      ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF174A37' } };
      ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      bookings.forEach(b => ws.addRow(columns.reduce((o, c) => {
        o[c.key] = c.key.includes('Date') || c.key.includes('At')
          ? (b[c.key] ? new Date(b[c.key]).toLocaleDateString('en-AE') : '')
          : b[c.key] ?? '';
        return o;
      }, {})));
      return await wb.xlsx.writeBuffer();
    } catch {
      console.warn('[Export] exceljs not installed, falling back to CSV');
    }
  }

  return Buffer.from(toCSV(bookings.map(b => ({
    ...b,
    eventDate: b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-AE') : '',
    createdAt: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-AE') : '',
  })), columns), 'utf-8');
}

async function exportPayments(payments, format = 'csv') {
  const columns = [
    { key: 'id',            label: 'Payment ID' },
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'amount',        label: 'Amount (AED)' },
    { key: 'type',          label: 'Type' },
    { key: 'method',        label: 'Method' },
    { key: 'status',        label: 'Status' },
    { key: 'createdAt',     label: 'Date' },
  ];
  const data = payments.map(p => ({
    ...p,
    createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-AE') : '',
  }));
  return Buffer.from(toCSV(data, columns), 'utf-8');
}

module.exports = { exportBookings, exportPayments };
