'use client';
import { useApi } from '../../../../hooks/useApi';
import UserService from '../../../../lib/services/user.service';
import Link from 'next/link';
import { imgStar } from '@/lib/inlineIcons';

const imgRectangle3883 = "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80";

export default function BookingDetailPage({ params }) {
  const bId = params?.id || '';
  const { data, loading, refresh } = useApi(UserService.getBooking, bId);
  const booking = data?.booking || {};
  return (
    <div className="max-w-[900px] w-full min-w-0 pb-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm text-black/40 min-w-0">
        <Link href="/dashboard/bookings" className="hover:text-[#174a37] transition-colors shrink-0">Bookings</Link>
        <span className="shrink-0">/</span>
        <span className="text-[#1a1a1a] min-w-0 break-words">Al Habtoor Palace</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
          {/* Hero */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] overflow-hidden shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
            <div className="h-48 overflow-hidden">
              <img src={imgRectangle3883} alt="Al Habtoor Palace" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between min-w-0">
                <div className="min-w-0">
                  <span className="text-[#CFB383] text-xs uppercase tracking-wider">Venue</span>
                  <h1 className="font-baskerville text-[24px] sm:text-[28px] md:text-[30px] text-[#1a1a1a] mt-0.5 break-words">Al Habtoor Palace</h1>
                  <p className="text-black/40 text-sm mt-1">📍 Dubai Marina</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full shrink-0 w-fit">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-4 sm:p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] min-w-0">
            <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a] mb-4 sm:mb-5">Booking Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Booking Reference', value: 'BK-2025-0001' },
                { label: 'Package', value: 'Gold Package' },
                { label: 'Wedding Date', value: 'June 15, 2026' },
                { label: 'Guest Count', value: '~200 guests' },
                { label: 'Booked On', value: 'January 12, 2025' },
                { label: 'Event Manager', value: 'Laila Al Rashidi' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#f9f6ef] rounded-xl p-4">
                  <p className="text-black/40 text-xs uppercase tracking-wider">{label}</p>
                  <p className="text-[#1a1a1a] font-medium text-sm mt-1 break-words">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment schedule */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-4 sm:p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] min-w-0">
            <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a] mb-4 sm:mb-5">Payment Schedule</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Deposit (25%)', amount: 15000, date: 'Jan 12, 2025', status: 'Paid' },
                { label: 'Second Payment (25%)', amount: 15000, date: 'Mar 15, 2025', status: 'Upcoming' },
                { label: 'Final Payment (50%)', amount: 30000, date: 'May 1, 2025', status: 'Scheduled' },
              ].map(p => (
                <div key={p.label} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-[rgba(184_154_105_/_0.08)] last:border-0 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1a1a1a]">{p.label}</p>
                    <p className="text-black/40 text-xs mt-0.5">Due: {p.date}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      p.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      p.status === 'Upcoming' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{p.status}</span>
                    <span className="font-baskerville text-lg sm:text-[20px] text-[#1a1a1a] tabular-nums">AED {p.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pt-4 mt-2 border-t border-[rgba(184_154_105_/_0.15)] min-w-0">
              <span className="font-medium text-[#1a1a1a]">Total</span>
              <span className="font-baskerville text-[20px] sm:text-[24px] text-[#174a37] tabular-nums">AED 60,000</span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-4 sm:p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] lg:sticky lg:top-[88px] min-w-0">
            <h3 className="font-baskerville text-[18px] text-[#1a1a1a] mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard/chat"
                className="w-full bg-[#174a37] text-white text-sm font-medium py-3 rounded-[10px] hover:bg-[#1a5c45] transition-colors text-center">
                Message Venue
              </Link>
              <Link href="/dashboard/payments/checkout"
                className="w-full border border-[rgba(184_154_105_/_0.4)] text-[#CFB383] text-sm font-medium py-3 rounded-[10px] hover:bg-[#F5F5EF] transition-colors text-center">
                Make Payment
              </Link>
              <button type="button" onClick={() => {
                const w = window.open('', '_blank');
                w.document.write(`<html><head><title>Booking Contract</title><style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:20px;color:#1a1a1a}h1{color:#174a37;border-bottom:2px solid #CFB383;padding-bottom:12px}h2{color:#CFB383;margin-top:24px}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee}.label{color:#666}.footer{margin-top:40px;text-align:center;color:#999;font-size:12px}</style></head><body><h1>Honeymoon — Booking Contract</h1><p>Contract ID: BK-${booking.id || '001'}</p><h2>Vendor Details</h2><div class="row"><span class="label">Vendor</span><span>${booking.vendor || 'Al Habtoor Palace'}</span></div><div class="row"><span class="label">Category</span><span>${booking.type || 'Venue'}</span></div><h2>Booking Details</h2><div class="row"><span class="label">Event Date</span><span>${booking.date || 'Jun 15, 2026'}</span></div><div class="row"><span class="label">Amount</span><span>${booking.amount || 'AED 45,000'}</span></div><div class="row"><span class="label">Status</span><span>${booking.status || 'Confirmed'}</span></div><h2>Terms &amp; Conditions</h2><p>1. A 30% deposit is required to confirm the booking.</p><p>2. Cancellation within 30 days of the event forfeits the deposit.</p><p>3. Full payment is due 7 days before the event date.</p><p>4. The vendor reserves the right to substitute equivalent services if originally booked items become unavailable.</p><div class="footer"><p>Honeymoon Events Platform — Generated ${new Date().toLocaleDateString()}</p></div></body></html>`);
                w.document.close();
                w.print();
              }} className="w-full text-black/40 text-sm hover:text-black/60 transition-colors py-2">
                Download Contract ↓
              </button>
            </div>
          </div>

          <div className="bg-[#F5F5EF] rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-5">
            <p className="text-[#CFB383] text-xs uppercase tracking-wider mb-2">Next Steps</p>
            <div className="flex flex-col gap-2">
              {[
                { done: true, text: 'Deposit paid' },
                { done: false, text: 'Site visit scheduled' },
                { done: false, text: 'Menu selection' },
                { done: false, text: 'Final payment' },
              ].map(s => (
                <p key={s.text} className={`text-sm flex items-center gap-2 ${s.done ? 'text-black/30 line-through' : 'text-[#1a1a1a]'}`}>
                  <span>{s.done ? '✓' : '○'}</span> {s.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
