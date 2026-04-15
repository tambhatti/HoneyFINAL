'use client';
import { usePaginated } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const imgRectangle3883 = "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80";
const imgRectangle3875 = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";
const imgRectangle3876 = "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80";

const tabs = ['All', 'Confirmed', 'Pending', 'Cancelled'];

const STATIC_BOOKINGS = [
  { id: 1, vendor: 'Al Habtoor Palace', type: 'Venue', date: 'Jun 15, 2026', booked: 'Jan 12, 2025', status: 'Confirmed', amount: 45000, deposit: 15000, img: imgRectangle3883, contact: 'events@alhabtoor.ae' },
  { id: 2, vendor: 'Studio Lumière', type: 'Photography', date: 'Jun 15, 2026', booked: 'Jan 25, 2025', status: 'Pending', amount: 12000, deposit: 4000, img: imgRectangle3875, contact: 'info@studiolumiere.ae' },
  { id: 3, vendor: 'Glamour Touch', type: 'Beauty', date: 'Jun 14, 2026', booked: 'Feb 3, 2025', status: 'Confirmed', amount: 4500, deposit: 1500, img: imgRectangle3876, contact: 'book@glamourtouch.ae' },
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

export default function BookingsPage() {
  const [status, setStatus] = useState('');
  const { items: apiBookings, loading, refresh, total, hasMore, nextPage} = usePaginated(UserService.getBookings, { status });
  const [activeTab, setActiveTab] = useState('All');
  const bookings = apiBookings?.length ? apiBookings : STATIC_BOOKINGS;
  const filtered = activeTab === 'All' ? bookings : bookings.filter(b => b.status === activeTab);

  return (
    <div className="w-full max-w-[1100px] min-w-0 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="font-baskerville text-[28px] sm:text-[32px] md:text-[36px] text-[#1a1a1a]">My Bookings</h1>
          <p className="text-black/40 text-sm mt-1">{bookings.length} bookings for your wedding</p>
        </div>
        <Link href="/dashboard/vendors"
          className="bg-[#174a37] text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-[#1a5c45] transition-colors text-center w-full sm:w-auto">
          + Browse Vendors
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: '3', icon: '📋' },
          { label: 'Confirmed', value: '2', icon: '✅' },
          { label: 'Pending', value: '1', icon: '⏳' },
          { label: 'Total Committed', value: 'AED 61,500', icon: '💰' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-5 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
            <span className="text-xl">{icon}</span>
            <p className="font-baskerville text-[28px] text-[#1a1a1a] mt-2">{value}</p>
            <p className="text-black/40 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto overscroll-x-contain touch-pan-x pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
        {tabs.map((statusTab) => (
          <button type="button" key={statusTab} onClick={() => setActiveTab(statusTab)}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
              activeTab === statusTab ? 'bg-[#174a37] text-white' : 'bg-white border border-[rgba(184_154_105_/_0.2)] text-black/50 hover:border-[#CFB383]'
            }`}>
            {statusTab}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] shadow-[0_0_30px_rgba(0_0_0_/_0.04)] overflow-hidden">
        <div className="divide-y divide-[rgba(184_154_105_/_0.08)]">
          {filtered.map(b => (
            <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 p-4 sm:p-6 hover:bg-[#faf7f0] transition-colors group">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={b.img} alt={b.vendor} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium text-[#1a1a1a] truncate">{b.vendor}</p>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status]}`}>{b.status}</span>
                  </div>
                  <p className="text-black/40 text-sm mt-0.5">{b.type} · Booked {b.booked}</p>
                  <p className="text-[#174a37] text-xs mt-1">📅 {b.date}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:contents">
                <div className="text-left sm:text-right shrink-0 sm:ml-auto">
                  <p className="font-baskerville text-[22px] text-[#1a1a1a]">AED {b.amount.toLocaleString()}</p>
                  <p className="text-black/40 text-xs">Deposit: AED {b.deposit.toLocaleString()}</p>
                </div>
                <span className="text-black/20 group-hover:text-[#CFB383] transition-colors text-xl sm:pr-2 self-center">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Pagination items={apiBookings} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
