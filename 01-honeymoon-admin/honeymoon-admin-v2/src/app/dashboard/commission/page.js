'use client';
import { useApi, usePaginated } from '../../../hooks/useApi';
import { AdminService } from '../../../lib/services/admin.service';
import { useState, useEffect } from 'react';
import { SuccessModal } from '@/components/Modals';

export default function CommissionPage() {
  const { data, loading, refresh } = useApi(AdminService.getCommissionConfig);
  const { items: logs, loading: logsLoading } = usePaginated(AdminService.getCommissionLogs || AdminService.getCommissionConfig, {});
  const commission = data?.commission || {};

  const [rate,    setRate]    = useState('');
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  /* Populate from API once loaded */
  useEffect(() => {
    if (commission.defaultRate !== undefined) {
      setRate(String(commission.defaultRate));
    }
  }, [commission.defaultRate]);

  async function handleSave() {
    const parsed = parseFloat(rate);
    if (!rate || isNaN(parsed) || parsed < 0 || parsed > 100) {
      setError('Enter a valid commission rate between 0 and 100.');
      return;
    }
    setSaving(true); setError('');
    try {
      await AdminService.updateCommissionConfig({ defaultRate: parsed });
      setSuccess(`Platform commission rate updated to ${parsed}%.`);
      refresh();
    } catch (e) {
      setError(e?.message || 'Failed to save. Please try again.');
    } finally { setSaving(false); }
  }

  return (
    <div className="w-full min-w-0 max-w-xl">
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-6">Commission Management</h1>

      {/* Single rate editor */}
      <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <h2 className="font-baskerville text-xl text-[#1a1a1a] mb-2">Platform Commission Rate</h2>
        <p className="text-gray-400 text-sm mb-6">
          This single rate applies to all vendor categories. The platform deducts this percentage from every completed booking payment before releasing the vendor payout.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commission Rate (%)<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-[200px]">
              <input
                type="number" value={rate} onChange={e => setRate(e.target.value)}
                min="0" max="100" step="0.5" placeholder="e.g. 10"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">%</span>
            </div>
            <p className="text-gray-400 text-xs">Enter a value between 0–100</p>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="bg-[#f9f6ef] rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600">
            <strong>Example:</strong> If the rate is <strong>{rate || '10'}%</strong> and a booking is worth{' '}
            <strong>AED 10,000</strong>, the platform earns{' '}
            <strong>AED {((parseFloat(rate) || 10) * 100).toLocaleString()}</strong> and the vendor receives{' '}
            <strong>AED {(10000 - (parseFloat(rate) || 10) * 100).toLocaleString()}</strong>.
          </p>
        </div>

        <button type="button" onClick={handleSave} disabled={saving || loading}
          className="bg-[#174a37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Commission Rate'}
        </button>
      </div>

      {/* Commission Change History — from Figma "Referral Program Logs" section on Commission page */}
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="font-baskerville text-lg text-[#1a1a1a]">Commission Rate History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-100 bg-[rgba(0,0,0,0.04)]">
                {['S. No.', 'Commission Percentage', 'Update Date'].map(h => (
                  <th key={h} className="text-left py-3 px-5 font-bold text-[#1a1a1a] text-sm capitalize">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-[rgba(184,154,105,0.2)]">
                    {[1,2,3].map(j => <td key={j} className="py-4 px-5"><div className="h-3 bg-gray-100 rounded animate-pulse"/></td>)}
                  </tr>
                ))
              ) : (data?.commission?.history || []).length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-gray-400 text-sm">No rate change history yet</td>
                </tr>
              ) : (data?.commission?.history || []).map((entry, i) => (
                <tr key={entry.id || i} className={`border-b border-[rgba(184,154,105,0.2)] hover:bg-[#fafaf8] transition-colors ${i % 2 === 0 ? 'bg-white' : ''}`}>
                  <td className="py-4 px-5 text-[#1a1a1a] text-sm">{String(i + 1).padStart(2, '0')}</td>
                  <td className="py-4 px-5 text-[#1a1a1a] text-sm font-medium tabular-nums">{entry.rate ?? entry.defaultRate ?? '—'}%</td>
                  <td className="py-4 px-5 text-[#1a1a1a] text-sm">
                    {entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-AE', { day:'2-digit', month:'2-digit', year:'numeric' }) : entry.date || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination hint */}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {(data?.commission?.history || []).length} entries
        </div>
      </div>
    </div>
  );
}
