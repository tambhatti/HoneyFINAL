'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const imgVenue1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";

export default function BookingDetailPage({ params }) {
  const bId = params?.id || '';
  const { data, loading, refresh } = useApi(UserService.getBooking, bId);
  const booking = data?.booking || {};
  const vendor = data?.vendor || {};
  const service = data?.service || {};
  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      <LoggedInNav />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 sm:mb-6 text-sm text-black/40 min-w-0">
          <Link href="/my-bookings" className="hover:text-[#174a37] transition-colors shrink-0">My Bookings</Link>
          <span>/</span>
          <span className="text-[#1a1a1a] truncate min-w-0">Booking Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0_0_0_/_0.06)]">
              <div className="h-52 overflow-hidden">
                <img src={imgVenue1} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 sm:p-6 min-w-0">
                <span className="text-[#CFB383] text-xs uppercase tracking-wider font-medium">Venue</span>
                <h1 className="font-baskerville text-[26px] sm:text-[32px] text-[#1a1a1a] mt-1 break-words">{vendor.companyName || service.name || booking.serviceId || "Booking Detail"}</h1>
                <p className="text-black/40 mt-1">📍 Dubai Marina</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] min-w-0">
              <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a] mb-4 sm:mb-5">Booking Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ['Reference', booking.id || 'BK-2025-0001'],
                  ['Package', booking.packageName || service.name || 'Standard Package'],
                  ['Event Date', booking.eventDate || '—'],
                  ['Guests', booking.guestCount ? `~${booking.guestCount}` : '—'],
                  ['Status', booking.status || 'Upcoming'],
                  ['Payment', booking.paymentStatus || 'Pending'],
                ].map(([l,v]) => (
                  <div key={l} className="bg-[#f9f6ef] rounded-xl p-4">
                    <p className="text-black/40 text-xs uppercase tracking-wider">{l}</p>
                    <p className="text-[#1a1a1a] font-medium text-sm mt-1 break-words tabular-nums">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] min-w-0">
              <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a] mb-4 sm:mb-5">Payment Schedule</h2>
              <div className="flex flex-col gap-3">
                {[['Deposit (25%)','AED 15,000','Jan 12, 2025','Paid'],['2nd Payment (25%)','AED 15,000','Mar 15, 2025','Upcoming'],['Final (50%)','AED 30,000','May 1, 2025','Scheduled']].map(([l,a,d,s]) => (
                  <div key={l} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3 border-b border-[rgba(184_154_105_/_0.08)] last:border-0 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1a1a1a]">{l}</p>
                      <p className="text-black/40 text-xs">{d}</p>
                    </div>
                    <div className="flex flex-row items-center gap-3 shrink-0 self-start sm:self-auto">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s==='Paid'?'bg-green-100 text-green-700':s==='Upcoming'?'bg-amber-100 text-amber-700':'bg-blue-100 text-blue-700'}`}>{s}</span>
                      <span className="font-baskerville text-lg sm:text-[20px] text-[#1a1a1a] tabular-nums">{a}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] min-w-0 lg:sticky lg:top-[88px]">
              <h3 className="font-baskerville text-lg sm:text-[20px] text-[#1a1a1a] mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                <Link href="/meeting-requests" className="w-full bg-[#174a37] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#1a5c45] transition-colors text-center">
                  Request Meeting
                </Link>
                <Link href="/my-bookings/payment" className="w-full border border-[rgba(184_154_105_/_0.4)] text-[#CFB383] text-sm font-medium py-3 rounded-xl hover:bg-[#F5F5EF] transition-colors text-center">
                  Make Payment
                </Link>
                {booking.status === 'Pending' || booking.status === 'Upcoming' ? (
                  <button type="button" onClick={async () => {
                    if (!confirm('Cancel this booking?')) return;
                    try { await UserService.cancelBooking(bId); refresh(); } catch(e) {}
                  }} className="w-full text-center text-red-400 text-sm hover:text-red-600 transition-colors py-2 border border-red-200 rounded-xl">
                    Cancel Booking
                  </button>
                ) : null}
                <Link href="/reported-bookings" className="w-full text-center text-red-400 text-sm hover:text-red-600 transition-colors py-2">
                  Report Issue
                </Link>
              </div>
            </div>
            <div className="bg-[#F5F5EF] rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-5">
              <p className="text-[#CFB383] text-xs uppercase tracking-wider mb-3">Next Steps</p>
              {[['✓','Deposit paid',true],['○','Site visit',false],['○','Menu selection',false],['○','Final payment',false]].map(([icon,text,done]) => (
                <p key={text} className={`text-sm flex items-center gap-2 mb-2 ${done?'text-black/30 line-through':'text-[#1a1a1a]'}`}>
                  <span>{icon}</span>{text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
