'use client';
import { useApi, usePaginated } from '../../../hooks/useApi';
import { AdminService } from '../../../lib/services/admin.service';
import { useState, useEffect } from 'react';
import { SuccessModal } from '@/components/Modals';

const StatusBadge = ({ s }) => {
  const m = { Paid:'text-green-700 bg-green-100', Approved:'text-blue-700 bg-blue-100', Pending:'text-amber-700 bg-amber-100', Rejected:'text-red-700 bg-red-100' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m[s] || 'text-gray-500 bg-gray-100'}`}>{s}</span>;
};

export default function PayoutsPage() {
  const { data: configData, loading: configLoading, refresh: refreshConfig } = useApi(AdminService.getCommissionConfig);
  const { items: payouts, loading, refresh, total, hasMore, nextPage } = usePaginated(AdminService.getPayouts, {});

  const [disbDays,  setDisbDays]  = useState('');
  const [savingCfg, setSavingCfg] = useState(false);
  const [success,   setSuccess]   = useState('');
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (configData?.commission?.disbursementDays !== undefined) {
      setDisbDays(String(configData.commission.disbursementDays));
    }
  }, [configData]);

  const handleSaveDisbursement = async () => {
    const days = parseInt(disbDays);
    if (!disbDays || isNaN(days) || days < 1 || days > 90) {
      setError('Enter a valid number of days (1–90).');
      return;
    }
    setSavingCfg(true); setError('');
    try {
      await AdminService.updateCommissionConfig({ disbursementDays: days });
      setSuccess(`Disbursement period set to ${days} days. Payouts will be auto-approved after bookings are completed + ${days} days.`);
      refreshConfig();
    } catch (e) { setError(e?.message || 'Failed to save.'); }
    finally { setSavingCfg(false); }
  };

  return (
    <div className="w-full min-w-0">
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-6">Payout Management</h1>

      {/* Disbursement Days Configuration */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-6">
        <h2 className="font-baskerville text-lg text-[#1a1a1a] mb-1">Disbursement Period</h2>
        <p className="text-gray-400 text-sm mb-5">
          Set how many days after a booking is completed before the vendor payout is automatically approved and processed.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 max-w-[240px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days After Booking Completion<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input type="number" value={disbDays} onChange={e => setDisbDays(e.target.value)}
                min="1" max="90" placeholder={configLoading ? 'Loading…' : 'e.g. 7'}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] pr-14"/>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">days</span>
            </div>
          </div>
          <button type="button" onClick={handleSaveDisbursement} disabled={savingCfg || configLoading}
            className="bg-[#174a37] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60 self-start sm:self-auto">
            {savingCfg ? 'Saving…' : 'Save'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="mt-4 bg-[#f9f6ef] rounded-xl p-4 text-sm text-gray-600">
          <strong>How it works:</strong> The cron job runs daily at 02:00 UAE time. Any payout where the booking has been Completed + Paid for at least{' '}
          <strong>{disbDays || '?'} day{parseInt(disbDays) !== 1 ? 's' : ''}</strong> will be automatically approved and queued for bank transfer.
        </div>
      </div>

      {/* Payout Log */}
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-baskerville text-lg text-[#1a1a1a]">Payout Log</h2>
          <span className="text-sm text-gray-400">{total} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-[#faf8f4]">
                {['Payout ID','Vendor','Net Amount','Booking','Requested','Status'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="py-4 px-4"><div className="h-3 bg-gray-100 rounded animate-pulse"/></td>
                    ))}
                  </tr>
                ))
              ) : payouts.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-gray-400">No payout records found</td></tr>
              ) : payouts.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-50 hover:bg-[#fafaf8] transition-colors ${i%2===0?'':'bg-[#fdfcf9]'}`}>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500">{p.id?.slice(-8).toUpperCase()}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{p.vendor?.companyName || p.vendor?.firstName}</td>
                  <td className="py-3.5 px-4 font-medium text-[#174a37] tabular-nums">AED {Number(p.netAmount || 0).toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-xs font-mono text-gray-500">{p.bookingId?.slice(-8).toUpperCase()}</td>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{p.requestedAt ? new Date(p.requestedAt).toLocaleDateString('en-AE') : '—'}</td>
                  <td className="py-3.5 px-4"><StatusBadge s={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button onClick={nextPage} disabled={loading}
              className="text-sm text-[#174a37] font-medium hover:underline disabled:opacity-50">
              {loading ? 'Loading…' : 'Load more ↓'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
