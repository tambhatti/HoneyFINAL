'use client';
import UserService from '../../../lib/services/user.service';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';

function SuccessModal({ onClose }) {
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="review-success-title">
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <h3 id="review-success-title" className="font-baskerville text-xl text-[#174a37] mb-2">Review Submitted!</h3>
        <p className="text-black/40 text-sm mb-6">Thank you for sharing your experience. You earned 50 loyalty points!</p>
        <button type="button" onClick={onClose}
          className="w-full bg-[#174a37] text-white py-3 rounded-xl font-medium hover:bg-[#1a5c45] transition-colors">
          Done
        </button>
      </div>
    </ModalLayer>
  );
}

const ASPECTS = [
  { key: 'quality',       label: 'Quality' },
  { key: 'communication', label: 'Communication' },
  { key: 'value',         label: 'Value for Money' },
  { key: 'punctuality',   label: 'Punctuality' },
];

function StarRow({ value, onChange, size = 'md' }) {
  const s = size === 'lg' ? 'text-3xl' : 'text-xl';
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`${s} transition-transform hover:scale-110 ${n <= value ? 'opacity-100' : 'opacity-20'}`}>
          ⭐
        </button>
      ))}
    </div>
  );
}

function ReviewContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const bookingId     = searchParams.get('bookingId') || '';
  const [rating,      setRating]     = useState(0);
  const [aspects,     setAspects]    = useState(ASPECTS.map(a => ({ ...a, rating: 0 })));
  const [form,        setForm]       = useState({ title: '', review: '' });
  const [submitting,  setSubmitting] = useState(false);
  const [error,       setError]      = useState('');
  const [success,     setSuccess]    = useState(false);

  const canSubmit = rating > 0 && form.review.trim().length > 10;

  const handleSubmit = async () => {
    if (!canSubmit) { setError('Please give a star rating and write at least 10 characters.'); return; }
    if (!bookingId) { setError('No booking ID — go back and try again.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await UserService.rateBooking(bookingId, {
        rating,
        review:   form.review.trim(),
        title:    form.title.trim() || undefined,
        aspects:  aspects.filter(a => a.rating > 0).reduce((o, a) => ({ ...o, [a.key]: a.rating }), {}),
      });
      setSuccess(true);
    } catch (e) {
      setError(e?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] flex flex-col w-full min-w-0">
      {success && <SuccessModal onClose={() => router.push('/my-bookings')} />}
      <LoggedInNav />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full min-w-0">
        <div className="flex items-center gap-2 mb-6 text-sm text-black/40">
          <Link href="/my-bookings" className="hover:text-[#174a37]">My Bookings</Link>
          <span>/</span><span className="text-[#1a1a1a]">Leave a Review</span>
        </div>
        <h1 className="font-baskerville text-2xl sm:text-3xl text-[#1a1a1a] mb-6">How was your experience?</h1>

        <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.06)] flex flex-col gap-6">
          {/* Overall rating */}
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a] mb-3">Overall Rating <span className="text-red-500">*</span></p>
            <StarRow value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <p className="mt-2 text-sm text-[#174a37]">
                {['','Poor','Fair','Good','Very Good','Excellent'][rating]}
              </p>
            )}
          </div>

          {/* Aspect ratings */}
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a] mb-3">Rate Specific Aspects</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aspects.map((a, i) => (
                <div key={a.key} className="flex items-center justify-between bg-[#faf8f4] rounded-xl px-4 py-3">
                  <span className="text-sm text-black/60">{a.label}</span>
                  <StarRow value={a.rating} onChange={v => setAspects(prev => prev.map((x, j) => j === i ? { ...x, rating: v } : x))} />
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Summarise your experience"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea value={form.review} onChange={e => setForm(p => ({ ...p, review: e.target.value }))}
              rows={5} placeholder="Share your experience with other couples..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none" />
            <p className={`text-xs mt-1 ${form.review.length < 10 ? 'text-red-400' : 'text-black/30'}`}>
              {form.review.length}/500 characters (min 10)
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Link href="/my-bookings"
              className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-center">
              Cancel
            </Link>
            <button type="button" onClick={handleSubmit} disabled={submitting || !canSubmit}
              className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-black/40">Loading…</div>}>
      <ReviewContent />
    </Suspense>
  );
}
