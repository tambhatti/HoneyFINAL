'use client';
import { usePaginated } from '../../../hooks/useApi';
import { AdminService } from '../../../lib/services/admin.service';
import { useState } from 'react';

const StatusBadge = ({ s }) => {
  const m = { Active:'text-[#027a48] bg-[#ecfdf3]', Expired:'text-[#dc3544] bg-[#fef2f2]', Cancelled:'text-gray-500 bg-gray-100', Pending:'text-amber-700 bg-amber-100' };
  return <span className={`text-sm font-medium ${m[s] || 'text-gray-500'}`}>{s}</span>;
};

export default function SubscriptionLogsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const { items: logs, loading, total, hasMore, nextPage } = usePaginated(
    AdminService.getSubscriptionLogs, { status: filter || undefined }
  );

  const shown = logs.filter(l =>
    !search ||
    l.vendor?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    l.vendor?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    l.plan?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-w-0">
      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-6">Subscription Logs</h1>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Toolbar — Show + Search + Filter matches Figma */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#1a1a1a] font-medium">Show</span>
            <div className="flex items-center gap-1 bg-[#f1ebe1] border border-[rgba(184,154,105,0.2)] rounded-md px-3 py-1 cursor-pointer">
              <span className="text-[#666] text-sm font-bold">5</span>
              <span className="text-[#666] text-xs">▾</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {[['All',''],['Active','Active'],['Expired','Expired'],['Cancelled','Cancelled']].map(([l, v]) => (
              <button key={v} type="button" onClick={() => setFilter(v)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter===v ? 'bg-[#174a37] text-white' : 'bg-[#F5F5EF] text-gray-600 hover:bg-[#e8dfc5]'}`}>{l}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 border border-[rgba(184,154,105,0.2)] rounded-md px-4 py-2.5 bg-[#faf8f4] w-full sm:w-[300px]">
            <span className="text-gray-400 shrink-0 text-sm">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="bg-transparent text-sm outline-none flex-1 min-w-0 opacity-60"/>
          </div>
        </div>

        {/* Table — columns exactly as per Figma */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.04)]">
                {[
                  'S. No', 'Vendor Name', 'Company Name', 'Subscription Name',
                  'Amount', 'Subscription Type', 'Subscription Date', 'Status'
                ].map(h => (
                  <th key={h} className="text-left py-3.5 px-4 text-[#1a1a1a] font-bold text-sm capitalize whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[rgba(184,154,105,0.2)]">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="py-4 px-4"><div className="h-3 bg-gray-100 rounded animate-pulse"/></td>
                    ))}
                  </tr>
                ))
              ) : shown.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-gray-400">No subscription logs found</td></tr>
              ) : shown.map((l, i) => {
                const vendorName = l.vendor?.companyName || `${l.vendor?.firstName || ''} ${l.vendor?.lastName || ''}`.trim() || '—';
                const companyName = l.vendor?.companyName || l.vendor?.businessName || '—';
                const subscriptionType = l.billing || (l.plan?.priceYearly && l.amount >= l.plan.priceYearly ? 'Yearly' : 'Monthly');
                const subscriptionDate = l.startDate
                  ? new Date(l.startDate).toLocaleDateString('en-AE', { day:'2-digit', month:'2-digit', year:'numeric' })
                  : (l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-AE', { day:'2-digit', month:'2-digit', year:'numeric' }) : '—');
                return (
                  <tr key={l.id} className="border-b border-[rgba(184,154,105,0.2)] hover:bg-[#fafaf8] transition-colors">
                    <td className="py-4 px-4 text-[#1a1a1a] text-sm">{String(i + 1).padStart(2, '0')}</td>
                    <td className="py-4 px-4 text-[#1a1a1a] text-sm capitalize">{vendorName}</td>
                    <td className="py-4 px-4 text-[#1a1a1a] text-sm capitalize">{companyName}</td>
                    <td className="py-4 px-4 text-[#1a1a1a] text-sm">{l.plan?.name || l.planName || '—'}</td>
                    <td className="py-4 px-4 text-[#1a1a1a] text-sm font-medium tabular-nums">
                      AED {Number(l.amount || l.plan?.priceMonthly || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-[#1a1a1a] text-sm capitalize">{subscriptionType}</td>
                    <td className="py-4 px-4 text-[#1a1a1a] text-sm">{subscriptionDate}</td>
                    <td className="py-4 px-4"><StatusBadge s={l.status}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-t border-gray-100">
          <span className="text-sm text-[#1a1a1a]">Showing 1 to {Math.min(shown.length, 8)} of {total || shown.length} entries</span>
          {hasMore && (
            <button onClick={nextPage} disabled={loading}
              className="text-sm text-[#174a37] font-medium hover:underline disabled:opacity-50">
              {loading ? 'Loading…' : 'Load more ↓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
