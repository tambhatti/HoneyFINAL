'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';

const NOTIFS = Array.from({ length: 12 }, (_, i) => ({
  id: i+1, read: i > 0,
  text: 'Reminder: Time for a Break! It\'s okay to take some time for yourself. Step away for a few minutes to relax or do something you enjoy. 😊',
  time: '01:01 PM', date: '01/01/2026',
}));


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

export default function AdminNotificationsPage() {
  const { items: notifications, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getNotifications, {});
  // Using real API data from usePaginated above
  const [show, setShow] = useState('5');

  const markAll = () => setNotifs(p => p.map(n => ({...n, read: true})));
  const toggle = (id) => setNotifs(p => p.map(n => n.id===id ? {...n, read: !n.read} : n));
  const shown = notifications || [];

  return (
    <div className="w-full min-w-0">
      <div className="flex items-center gap-3 mb-5 sm:mb-6 min-w-0">
        <button type="button" onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">←</button>
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] min-w-0">Notification</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0_0_0_/_0.05)] overflow-hidden w-full min-w-0 max-w-4xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-gray-500">Show</span>
            <select value={show} onChange={e => setShow(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
              <option>5</option><option>10</option><option>25</option>
            </select>
          </div>
          <button type="button" onClick={markAll} className="text-sm font-medium text-[#CFB383] hover:underline self-start sm:self-auto">Mark All As Read</button>
        </div>

        <div className="divide-y divide-gray-50">
          {shown.map(n => (
            <div key={n.id} className={`flex items-start justify-between gap-4 px-4 sm:px-6 py-5 hover:bg-[#fafaf8] transition-colors ${!n.read ? 'bg-[#fdfaf4]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-6 ${n.read ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>{n.text}</p>
                <div className="flex items-center gap-5 mt-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">🕐 {n.time}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">📅 {n.date}</span>
                </div>
              </div>
              <button type="button" onClick={() => toggle(n.id)}
                className="text-sm text-[#CFB383] hover:text-[#174a37] transition-colors whitespace-nowrap shrink-0 font-medium self-start sm:self-auto">
                {n.read ? 'Mark As Unread' : 'Mark As Read'}
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400 min-w-0">Showing 1 to {shown.length} from {notifs.length} entries</p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" disabled className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#F5F5EF] transition-colors opacity-50 cursor-not-allowed">Previous</button>
            {[1,2,3].map(p => <button type="button" key={p} className={`w-9 h-9 rounded-xl text-sm ${p===1?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#F5F5EF]'} transition-colors`}>{p}</button>)}
            <span className="text-gray-400">|</span>
            <button type="button" disabled className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#F5F5EF] transition-colors opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
      <Pagination items={notifications} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
