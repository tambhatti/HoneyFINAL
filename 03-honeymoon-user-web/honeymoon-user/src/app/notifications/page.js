'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const initNotifs = [
  { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: false },
  { id: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
  { id: 3, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
  { id: 4, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
  { id: 5, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
  { id: 6, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
];


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

export default function NotificationsPage() {
  const { items: notifications, loading, refresh, total, hasMore, nextPage} = usePaginated(UserService.getNotifications, {});
  const [notifs, setNotifs] = useState(initNotifs);
  const [filter, setFilter] = useState('All');

  const markAllRead = () => setNotifs(p => p.map(n => ({...n, read: true})));
  const markOne = (id) => setNotifs(p => p.map(n => n.id === id ? {...n, read: !n.read} : n));

  const filtered = filter === 'All' ? notifs : filter === 'Unread' ? notifs.filter(n => !n.read) : notifs.filter(n => n.read);

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      <LoggedInNav />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#CFB383]">Notifications</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] overflow-hidden max-w-[900px] w-full min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 border-b border-[rgba(184_154_105_/_0.1)] min-w-0">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <span className="text-sm text-black/50">Showing:</span>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="border border-[rgba(184_154_105_/_0.3)] rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:border-[#CFB383] transition-colors min-w-0">
                <option>All</option>
                <option>Unread</option>
                <option>Read</option>
              </select>
            </div>
            <button type="button" onClick={markAllRead} className="text-sm text-[#CFB383] hover:underline font-medium text-left sm:text-right">
              Mark all As Read
            </button>
          </div>

          <div className="divide-y divide-[rgba(184_154_105_/_0.08)]">
            {filtered.map(n => (
              <div key={n.id} className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 hover:bg-[#faf7f0] transition-colors ${!n.read ? 'bg-[#fdf9f0]' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-6 break-words ${n.read ? 'text-black/50' : 'text-black/80'}`}>{n.text}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    <span className="text-xs text-black/40 flex items-center gap-1">📅 {n.date}</span>
                    <span className="text-xs text-black/40 flex items-center gap-1">⏰ Time: {n.time}</span>
                  </div>
                </div>
                <button type="button" onClick={() => markOne(n.id)}
                  className="text-sm text-[#CFB383] hover:text-[#174a37] transition-colors whitespace-nowrap shrink-0 font-medium self-start sm:self-auto">
                  {n.read ? 'Mark As Unread' : 'Mark As Read'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <Pagination items={notifications} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
