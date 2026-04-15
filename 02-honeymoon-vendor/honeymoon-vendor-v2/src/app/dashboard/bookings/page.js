'use client';
import { usePaginated } from '../../../hooks/useApi';
import { VendorService } from '../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';

const StatusBadge = ({ s }) => {
  const m = { Upcoming:'text-blue-700 bg-blue-100', Confirmed:'text-blue-700 bg-blue-100', Completed:'text-green-700 bg-green-100', Pending:'text-amber-700 bg-amber-100', Rejected:'text-red-700 bg-red-100', Cancelled:'text-gray-500 bg-gray-100', Requested:'text-purple-700 bg-purple-100' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m[s]||'bg-gray-100 text-gray-500'}`}>{s}</span>;
};
const PayBadge = ({ s }) => {
  const m = { Paid:'text-green-700 bg-green-100', Unpaid:'text-red-700 bg-red-100', Partial:'text-amber-700 bg-amber-100' };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m[s]||'text-gray-400'}`}>{s||'—'}</span>;
};

export default function VendorBookingsPage() {
  const [tab,    setTab]    = useState('standard');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { items: bookings, total, loading, hasMore, nextPage } = usePaginated(
    VendorService.getBookings,
    { search, status, type: tab === 'standard' ? 'Standard' : 'Custom' }
  );

  const STATUSES_STD    = ['','Pending','Confirmed','Upcoming','Completed','Rejected','Cancelled'];
  const STATUSES_CUSTOM = ['','Requested','Pending','Upcoming','Completed','Rejected'];

  return (
    <div className="w-full min-w-0">
      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-6">Booking Management</h1>

      {/* Tab */}
      <div className="flex rounded-xl border border-[rgba(23,74,55,0.25)] overflow-hidden w-full sm:w-auto self-start mb-5">
        {[['standard','Standard'],['custom','Custom Quotations']].map(([id,label]) => (
          <button key={id} type="button" onClick={() => { setTab(id); setStatus(''); }}
            className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium transition-colors ${tab===id ? 'bg-[#174a37] text-white' : 'text-[#174a37] hover:bg-[#F5F5EF]'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-[#faf8f4] w-full sm:max-w-60">
            <span className="text-gray-400 shrink-0 text-sm">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              className="bg-transparent text-sm outline-none flex-1 min-w-0"/>
          </div>
          <div className="flex flex-wrap gap-2">
            {(tab === 'standard' ? STATUSES_STD : STATUSES_CUSTOM).map(s => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${status===s ? 'bg-[#174a37] text-white' : 'bg-[#F5F5EF] text-gray-600 hover:bg-[#e8dfc5]'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-400 sm:ml-auto">{total} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="border-b border-gray-100 bg-[#faf8f4]">
                {['#','Booking ID','Customer','Service','Event Date','Amount','Payment','Status','Action'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length:5}).map((_,i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({length:9}).map((_,j) => <td key={j} className="py-4 px-4"><div className="h-3 bg-gray-100 rounded animate-pulse"/></td>)}
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr><td colSpan={9} className="py-16 text-center text-gray-400 text-sm">No bookings found</td></tr>
              ) : bookings.map((b, i) => (
                <tr key={b.id} className={`border-b border-gray-50 hover:bg-[#fafaf8] transition-colors ${i%2===0?'':'bg-[#fdfcf9]'}`}>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{i+1}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#174a37]">#{(b.id||'').slice(-8).toUpperCase()}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{b.user?.firstName} {b.user?.lastName}</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs max-w-[120px] truncate">{b.service?.name || '—'}</td>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-AE') : '—'}</td>
                  <td className="py-3.5 px-4 font-medium tabular-nums">AED {Number(b.totalAmount||0).toLocaleString()}</td>
                  <td className="py-3.5 px-4"><PayBadge s={b.paymentStatus}/></td>
                  <td className="py-3.5 px-4"><StatusBadge s={b.status}/></td>
                  <td className="py-3.5 px-4">
                    <Link href={`/dashboard/bookings/${tab==='custom'?'custom/':''}${b.id}`}
                      className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors">
                      View
                    </Link>
                  </td>
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
