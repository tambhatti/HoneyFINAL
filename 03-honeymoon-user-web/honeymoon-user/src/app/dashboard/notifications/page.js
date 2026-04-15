'use client';
import { usePaginated } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState, useEffect } from 'react';

const STATIC_NOTIFICATIONS = [
  { id: 1, type: 'booking', icon: '✅', title: 'Booking Confirmed', body: 'Al Habtoor Palace confirmed your June 15, 2026 booking. Contract sent to your email.', time: '2 hours ago', read: false },
  { id: 2, type: 'ai', icon: '✦', title: 'New AI Matches', body: 'Your AI planner found 4 new vendor matches based on your updated style preferences.', time: '5 hours ago', read: false },
  { id: 3, type: 'payment', icon: '💰', title: 'Payment Reminder', body: 'Your next payment of AED 15,000 to Al Habtoor Palace is due on March 15, 2025.', time: '1 day ago', read: false },
  { id: 4, type: 'message', icon: '💬', title: 'New Message', body: 'Studio Lumière sent you a message about your photography package preferences.', time: '2 days ago', read: true },
  { id: 5, type: 'review', icon: '⭐', title: 'Review Request', body: 'How was your experience with Glamour Touch? Share your feedback to help other couples.', time: '3 days ago', read: true },
  { id: 6, type: 'ai', icon: '✦', title: 'Budget Alert', body: 'You\'ve used 42% of your total budget. Your AI planner suggests reviewing catering options to stay on track.', time: '4 days ago', read: true },
  { id: 7, type: 'booking', icon: '📅', title: 'Site Visit Scheduled', body: 'Your site visit at Al Habtoor Palace is confirmed for Saturday, March 16 at 2:00 PM.', time: '5 days ago', read: true },
];

const typeColors = {
  booking: 'bg-green-50 text-green-600 border-green-100',
  ai: 'bg-[#F5F5EF] text-[#174a37] border-[rgba(184_154_105_/_0.3)]',
  payment: 'bg-amber-50 text-amber-600 border-amber-100',
  message: 'bg-blue-50 text-blue-600 border-blue-100',
  review: 'bg-purple-50 text-purple-600 border-purple-100',
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

export default function NotificationsPage() {
  const { items: apiNotifications, loading, refresh, total, hasMore, nextPage } = usePaginated(UserService.getNotifications, {});
  const [items, setItems] = useState(STATIC_NOTIFICATIONS);

  useEffect(() => {
    if (apiNotifications?.length) setItems(apiNotifications);
  }, [apiNotifications]);

  const unread = items.filter(n => !n.read).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="max-w-[800px] w-full min-w-0 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 min-w-0">
        <div className="min-w-0">
          <h1 className="font-baskerville text-[28px] sm:text-[32px] md:text-[36px] text-[#1a1a1a] break-words">Notifications</h1>
          <p className="text-black/40 text-sm mt-1">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button type="button" onClick={markAllRead}
            className="text-sm text-[#CFB383] hover:text-[#B8A06E] transition-colors font-medium text-left sm:text-right">
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {items.map(n => (
          <button
            type="button"
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`w-full text-left bg-white rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 transition-all hover:shadow-[0_4px_20px_rgba(0_0_0_/_0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CFB383] focus-visible:ring-offset-2 ${
              n.read ? 'border-[rgba(184_154_105_/_0.1)] opacity-70' : 'border-[rgba(184_154_105_/_0.25)] shadow-[0_2px_12px_rgba(0_0_0_/_0.04)]'
            }`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 border ${typeColors[n.type]}`}>
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <p className={`text-sm font-medium ${n.read ? 'text-black/60' : 'text-[#1a1a1a]'}`}>{n.title}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-black/30">{n.time}</span>
                  {!n.read && <div className="w-2 h-2 bg-[#174a37] rounded-full" />}
                </div>
              </div>
              <p className={`text-sm mt-1 leading-6 break-words ${n.read ? 'text-black/40' : 'text-black/60'}`}>{n.body}</p>
            </div>
          </button>
        ))}
      </div>
      <Pagination items={apiNotifications} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
