'use client';
import { usePaginated } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';

const REPORTS = Array.from({length:12},(_,i)=>({
  id:String(i+1).padStart(2,'0'),
  bookingId:'#12345678',
  user:'User A',
  date:'mm/dd/yyyy',
  amount:'20 AED',
  type:i%2===0?'Standard':'Custom',
  status:i%3===0?'Pending':'Resolved',
}));

const statusColor = { Pending:'text-amber-600', Resolved:'text-green-600' };


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button type="button" onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-lg hover:bg-[#1a5c45] transition-colors disabled:opacity-50 w-full sm:w-auto">
          {loading ? 'Loading...' : 'Load More ↓'}
        </button>
      )}
    </div>
  );
}

export default function VendorReportedBookingsPage(){
  const { items: reports, loading, refresh, total, hasMore, nextPage} = usePaginated(VendorService.getReportedBookings, {});
  const [data] = useState(REPORTS);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState('5');

  const filtered = data.filter(r =>
    r.bookingId.includes(search) || r.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-w-0">
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Reported Bookings</h1>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select value={show} onChange={e=>setShow(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
              <option>5</option><option>10</option><option>25</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-56 bg-[#faf8f4]">
              <span className="text-gray-400">🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
                className="bg-transparent text-sm outline-none flex-1"/>
            </div>
            <button className="border border-gray-200 rounded-xl px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors text-sm">⊞</button>
          </div>
        </div>

        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Sr. No.','Booking ID','User','Booking Date','Amount','Booking Type','Status','Action'].map(h=>(
                <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0,parseInt(show)).map(r=>(
              <tr key={r.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 text-gray-400 text-xs">{r.id}</td>
                <td className="py-3.5 px-3 font-mono text-xs text-gray-600">{r.bookingId}</td>
                <td className="py-3.5 px-3 text-gray-700">{r.user}</td>
                <td className="py-3.5 px-3 text-gray-500">{r.date}</td>
                <td className="py-3.5 px-3 text-gray-700">{r.amount}</td>
                <td className="py-3.5 px-3 text-gray-500">{r.type}</td>
                <td className="py-3.5 px-3">
                  <span className={`text-xs font-medium ${statusColor[r.status]||'text-gray-500'}`}>{r.status}</span>
                </td>
                <td className="py-3.5 px-3">
                  <Link href={`/dashboard/reported-bookings/${r.id}`}
                    className="text-xs text-[#174a37] border border-[rgba(23_74_55_/_0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing 1 to {Math.min(parseInt(show),filtered.length)} of {filtered.length} entries</p>
          <div className="flex items-center gap-2">
            <button disabled className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#F5F5EF] transition-colors text-gray-500 opacity-50 cursor-not-allowed">Previous</button>
            {[1,2,3].map(p=><button key={p} className={`w-9 h-9 rounded-xl text-sm font-medium ${p===1?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#F5F5EF]'} transition-colors`}>{p}</button>)}
            <span className="text-gray-400 text-sm">|</span>
            <button onClick={nextPage} disabled={!hasMore || loading} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#F5F5EF] transition-colors text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
      <Pagination items={reports} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
