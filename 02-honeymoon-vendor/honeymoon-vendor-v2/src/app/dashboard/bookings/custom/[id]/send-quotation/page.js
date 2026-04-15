'use client';
import VendorService from '../../../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';

export default function SendQuotationPage({ params }) {
  const qId = params?.id || '';
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');
  const [form, setForm]       = useState({ amount: '', notes: '', validUntil: '', deposit: '20' });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  /* B-02: wire button to API — was missing entirely */
  const handleSend = async () => {
    if (!form.amount) { setError('Please enter a quotation amount'); return; }
    setSaving(true);
    setError('');
    try {
      await VendorService.sendQuotation(qId, {
        quotationAmount: Number(form.amount),
        notes:           form.notes,
        validUntil:      form.validUntil || undefined,
        depositPercent:  Number(form.deposit) || 20,
      });
      setSuccess(true);
    } catch (e) {
      setError(e?.message || 'Failed to send quotation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {success && (
        <SuccessModal
          message="Quotation sent successfully!"
          onOk={() => window.location.href = `/dashboard/bookings/custom/${qId}`}
        />
      )}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/bookings/custom/${qId}`} className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Send Quotation</h1>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quotation Amount (AED)<span className="text-red-500">*</span>
            </label>
            <input type="number" value={form.amount} onChange={e => f('amount', e.target.value)}
              placeholder="Enter your quote"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Required (%)</label>
            <input type="number" value={form.deposit} onChange={e => f('deposit', e.target.value)}
              placeholder="e.g. 20"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
            <input type="date" value={form.validUntil} onChange={e => f('validUntil', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => f('notes', e.target.value)} rows={4}
              placeholder="Additional notes for the customer..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSend}
            disabled={saving}
            className="flex-1 bg-[#174a37] text-white py-3.5 rounded-full font-medium hover:bg-[#1a5c45] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Sending…' : 'Send Quotation ↗'}
          </button>
          <Link href={`/dashboard/bookings/custom/${qId}`}
            className="flex-1 border border-gray-200 text-gray-500 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-colors text-center">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
