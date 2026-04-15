'use client';
import { usePaginated } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import { imgStar } from '@/lib/inlineIcons';
import ModalLayer from '@/components/ModalLayer';

const imgRectangle3883 = "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80";
const imgRectangle3875 = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";
const imgRectangle3876 = "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80";

const reviews = [
  { id: 1, vendor: 'Al Habtoor Palace', type: 'Venue', rating: 5, text: 'Absolutely stunning venue. The staff were incredibly professional and the ballroom exceeded all our expectations.', date: 'Jun 20, 2025', img: imgRectangle3883 },
  { id: 2, vendor: 'Glamour Touch', type: 'Beauty', rating: 5, text: 'The bridal team was exceptional. My hair and makeup lasted the entire night and I felt absolutely beautiful.', date: 'Jun 20, 2025', img: imgRectangle3876 },
];

const pending = [
  { id: 3, vendor: 'Studio Lumière', type: 'Photography', img: imgRectangle3875 },
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

export default function ReviewsPage() {
  const { items: bookings, loading, total, hasMore, nextPage} = usePaginated(UserService.getBookings, { status: 'Completed' });
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ rating: 5, text: '' });
  const [submitted, setSubmitted] = useState([]);

  const handleSubmit = async () => {
    try {
      await UserService.rateBooking(selected.id, { rating: form.rating, review: form.text });
    } catch(e) { /* API not connected - track locally */ }
    setSubmitted(prev => [...prev, selected.id]);
    setSelected(null);
    setForm({ rating: 5, text: '' });
  };

  return (
    <div className="max-w-[900px] w-full min-w-0 pb-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-baskerville text-[28px] sm:text-[32px] md:text-[36px] text-[#1a1a1a]">Reviews</h1>
        <p className="text-black/40 text-sm mt-1">Share your experience with vendors</p>
      </div>

      {/* Pending reviews */}
      {pending.filter(p => !submitted.includes(p.id)).length > 0 && (
        <div className="mb-8">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">Awaiting Your Review</h2>
          <div className="flex flex-col gap-3">
            {pending.filter(p => !submitted.includes(p.id)).map(p => (
              <div key={p.id} className="bg-[#F5F5EF] border border-[rgba(184_154_105_/_0.3)] rounded-2xl p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={p.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[#1a1a1a]">{p.vendor}</p>
                    <p className="text-[#CFB383] text-xs">{p.type}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSelected(p)}
                  className="bg-[#174a37] text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-[#1a5c45] transition-colors w-full sm:w-auto text-center">
                  Write Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review modal */}
      {selected && (
        <ModalLayer open onClose={() => setSelected(null)} aria-labelledby="dashboard-review-title">
          <div className="bg-white rounded-2xl p-5 sm:p-8 max-w-[500px] max-h-[90vh] overflow-y-auto overscroll-y-contain w-full shadow-2xl min-w-0">
            <h3 id="dashboard-review-title" className="font-baskerville text-[22px] sm:text-[26px] md:text-[28px] text-[#1a1a1a] mb-2 break-words">Review {selected.vendor}</h3>
            <p className="text-black/40 text-sm mb-6">{selected.type}</p>
            <div className="mb-5">
              <p className="text-sm font-medium text-[#1a1a1a] mb-3">Your Rating</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button type="button" key={s} onClick={() => setForm(f => ({ ...f, rating: s }))}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      s <= form.rating ? 'bg-[#F5F5EF] scale-110' : 'bg-[#f9f6ef]'
                    }`}>
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm font-medium text-[#1a1a1a] mb-2">Your Review</p>
              <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                placeholder="Share your experience..."
                rows={4}
                className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-xl px-4 py-3 text-sm text-[#1a1a1a] outline-none focus:border-[#CFB383] resize-none" />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button type="button" onClick={() => setSelected(null)}
                className="flex-1 border border-[rgba(184_154_105_/_0.3)] text-black/50 font-medium py-3 rounded-[10px] hover:bg-[#F5F5EF] transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSubmit}
                className="flex-1 bg-[#174a37] text-white font-medium py-3 rounded-[10px] hover:bg-[#1a5c45] transition-colors">
                Submit Review
              </button>
            </div>
          </div>
        </ModalLayer>
      )}

      {/* Submitted reviews */}
      <div>
        <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">Your Reviews</h2>
        <div className="flex flex-col gap-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-4 sm:p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between min-w-0">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={r.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[#1a1a1a] truncate">{r.vendor}</p>
                    <p className="text-[#CFB383] text-xs">{r.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 flex-wrap">
                  {[...Array(r.rating)].map((_, i) => <img key={i} src={imgStar} alt="★" className="w-4 h-4 object-contain" />)}
                </div>
              </div>
              <p className="text-black/60 text-sm mt-4 leading-6 break-words">{r.text}</p>
              <p className="text-black/30 text-xs mt-3">{r.date}</p>
            </div>
          ))}
        </div>
      </div>
      <Pagination items={bookings} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
