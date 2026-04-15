'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';

const imgVenue1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgVenue2 = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";

function ReportModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ reason: '', description: '' });
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="report-booking-title">
      <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-5 sm:p-8 shadow-2xl min-w-0">
        <h2 id="report-booking-title" className="font-baskerville text-[26px] text-[#CFB383] mb-5">Report a Booking Issue</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Reason<span className="text-red-500">*</span></label>
            <select value={form.reason} onChange={e => setForm(p=>({...p,reason:e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-white transition-colors">
              <option value="">Select a reason</option>
              <option>Vendor did not show up</option>
              <option>Service quality issue</option>
              <option>Payment dispute</option>
              <option>Cancellation without notice</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Description<span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))}
              rows={4} placeholder="Describe the issue in detail..."
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none transition-colors" />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 border border-[rgba(184_154_105_/_0.3)] text-black/50 font-medium py-3 rounded-xl hover:bg-[#F5F5EF] transition-colors">Cancel</button>
          <button type="button" onClick={onSubmit} className="flex-1 bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 transition-colors">Submit Report</button>
        </div>
      </div>
    </ModalLayer>
  );
}

const reports = [
  { id: 1, vendor: 'Emirates Floral', type: 'Decoration', date: 'Feb 10, 2026', status: 'Under Review', img: imgVenue1, reason: 'Service quality issue' },
  { id: 2, vendor: 'Bloom Catering', type: 'Catering', date: 'Dec 5, 2025', status: 'Resolved', img: imgVenue2, reason: 'Payment dispute' },
];


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button type="button" onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-xl hover:bg-[#1a5c45] transition-colors disabled:opacity-50 w-full sm:w-auto">
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

export default function ReportedBookingsPage() {
  const { items: apiReports, loading, refresh, total, hasMore, nextPage } = usePaginated(UserService.getReported, {});
  const displayReports = apiReports.length ? apiReports : reports;
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      {showModal && <ReportModal onClose={() => setShowModal(false)} onSubmit={() => { setShowModal(false); setSubmitted(true); }} />}
      <LoggedInNav />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#CFB383]">Reported Bookings</h1>
          <button type="button" onClick={() => setShowModal(true)} className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors w-full sm:w-auto text-center">
            + New Report
          </button>
        </div>

        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <p className="text-green-700 text-sm font-medium">Your report has been submitted. Our team will review it within 24 hours.</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] overflow-hidden w-full min-w-0">
          <div className="divide-y divide-[rgba(184_154_105_/_0.08)]">
            {displayReports.map(r => (
              <div key={r.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 p-4 sm:p-5 hover:bg-[#faf7f0] transition-colors">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img src={r.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1a1a1a]">{r.vendor}</p>
                    <p className="text-black/40 text-sm">{r.type} · {r.date}</p>
                    <p className="text-black/50 text-xs mt-0.5">Reason: {r.reason}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full self-start sm:self-auto ${r.status==='Resolved'?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
        <Pagination items={displayReports} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
