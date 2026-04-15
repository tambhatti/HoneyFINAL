'use client';
import { useApi, usePaginated } from '../../../hooks/useApi';
import { AdminService } from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';

const StatusBadge = ({ s }) => {
  const m = { Completed:'text-green-700 bg-green-100', Success:'text-green-700 bg-green-100', Failed:'text-red-700 bg-red-100', Refunded:'text-orange-700 bg-orange-100', Pending:'text-amber-700 bg-amber-100' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m[s] || 'text-gray-500 bg-gray-100'}`}>{s}</span>;
};

export default function PaymentLogsPage() {
  const [filter, setFilter]   = useState('');
  const [search, setSearch]   = useState('');
  const { items: payments, loading, total, hasMore, nextPage, refresh } = usePaginated(AdminService.getPaymentLogs, { status: filter || undefined });
  const { data: statsData } = useApi(AdminService.getDashboard);
  const stats = statsData?.stats || {};

  const shown = payments.filter(p =>
    !search || p.id?.includes(search) ||
    p.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalEarnings = stats.revenue ?? payments.filter(p => p.status === 'Completed' || p.status === 'Success').reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="w-full min-w-0">
      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-6">Payment Logs</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Total Earnings',   `AED ${Number(totalEarnings || 0).toLocaleString()}`, '💰', 'text-[#174a37]'],
          ['Total Transactions', String(total || 0), '📋', 'text-[#1a1a1a]'],
          ['Successful',        String(payments.filter(p => p.status==='Completed'||p.status==='Success').length), '✅', 'text-green-700'],
          ['Failed / Refunded', String(payments.filter(p => p.status==='Failed'||p.status==='Refunded').length), '❌', 'text-red-600'],
        ].map(([l, v, ic, col]) => (
          <div key={l} className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)] flex items-center gap-4">
            <span className="text-2xl shrink-0">{ic}</span>
            <div className="min-w-0">
              <p className="text-gray-400 text-xs uppercase tracking-wider truncate">{l}</p>
              <p className={`font-baskerville text-xl sm:text-2xl mt-0.5 tabular-nums ${col}`}>{loading ? '—' : v}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-[#faf8f4] w-full sm:flex-1 sm:max-w-64">
            <span className="text-gray-400 shrink-0">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or user…"
              className="bg-transparent text-sm outline-none flex-1 min-w-0"/>
          </div>
          <div className="flex flex-wrap gap-2">
            {[['All',''],['Completed','Completed'],['Failed','Failed'],['Refunded','Refunded'],['Pending','Pending']].map(([l, v]) => (
              <button key={v} type="button" onClick={() => { setFilter(v); }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter===v ? 'bg-[#174a37] text-white' : 'bg-[#F5F5EF] text-gray-600 hover:bg-[#e8dfc5]'}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-100 bg-[#faf8f4]">
                {['Transaction ID','User','Vendor','Amount','Method','Payment Type','Date','Status'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="py-4 px-4"><div className="h-3 bg-gray-100 rounded animate-pulse"/></td>
                    ))}
                  </tr>
                ))
              ) : shown.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-gray-400">No payment records found</td></tr>
              ) : shown.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-50 hover:bg-[#fafaf8] transition-colors ${i%2===0?'':'bg-[#fdfcf9]'}`}>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500">{(p.transactionId || p.id || '').slice(-12)}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{p.user?.firstName} {p.user?.lastName}</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">{p.vendor?.companyName || p.booking?.vendor?.companyName || '—'}</td>
                  <td className="py-3.5 px-4 font-medium text-[#1a1a1a] tabular-nums">AED {Number(p.amount || 0).toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-gray-500 capitalize">{p.method?.replace(/_/g,' ') || '—'}</td>
                  <td className="py-3.5 px-4 text-gray-500 capitalize">{p.type || '—'}</td>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-AE') : '—'}</td>
                  <td className="py-3.5 px-4"><StatusBadge s={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button onClick={nextPage} disabled={loading} className="text-sm text-[#174a37] font-medium hover:underline disabled:opacity-50">
              {loading ? 'Loading…' : 'Load more ↓'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
