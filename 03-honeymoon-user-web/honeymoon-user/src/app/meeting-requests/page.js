'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const imgVenue1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgVenue2 = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgVenue3 = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

const meetings = [
  { id: 1, vendor: 'Al Habtoor Palace', type: 'Venue', date: 'Mar 20, 2025', time: '2:00 PM', status: 'Confirmed', img: imgVenue1 },
  { id: 2, vendor: 'Studio Lumière', type: 'Photography', date: 'Mar 25, 2025', time: '11:00 AM', status: 'Pending', img: imgVenue2 },
  { id: 3, vendor: 'Glamour Touch', type: 'Beauty', date: 'Apr 1, 2025', time: '10:00 AM', status: 'Cancelled', img: imgVenue3 },
  { id: 4, vendor: 'Emirates Floral', type: 'Decoration', date: 'Apr 5, 2025', time: '3:00 PM', status: 'Confirmed', img: imgVenue1 },
];

const statusColors = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};


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

export default function MeetingRequestsPage() {
  const { items: meetings, loading, refresh, total, hasMore, nextPage} = usePaginated(UserService.getMeetings, {});
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? meetings : meetings.filter(m => m.status === filter);

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      <LoggedInNav />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#CFB383] mb-6 sm:mb-8">Meeting Requests</h1>
        <div className="flex gap-2 mb-6 overflow-x-auto overscroll-x-contain touch-pan-x pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
          {['All','Confirmed','Pending','Cancelled'].map(s => (
            <button type="button" key={s} onClick={() => setFilter(s)}
              className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${filter===s?'bg-[#174a37] text-white':'bg-white border border-[rgba(184_154_105_/_0.3)] text-black/60 hover:border-[#CFB383]'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] overflow-hidden">
          <div className="divide-y divide-[rgba(184_154_105_/_0.08)]">
            {filtered.map(m => (
              <div key={m.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 p-4 sm:p-5 hover:bg-[#faf7f0] transition-colors">
                <div className="flex items-center gap-4 sm:contents">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img src={m.img} alt={m.vendor} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1a1a1a] truncate">{m.vendor}</p>
                    <p className="text-black/40 text-sm">{m.type}</p>
                    <p className="text-[#174a37] text-sm mt-0.5 flex flex-wrap gap-x-1">📅 {m.date} · ⏰ {m.time}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full self-start sm:self-auto ${statusColors[m.status]}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
        <Pagination items={meetings} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
