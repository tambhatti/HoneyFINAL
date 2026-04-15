'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

export default function ReportedBookingDetailPage({ params }) {
  const { data, loading } = useApi(UserService.getReported);
  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      <LoggedInNav />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-5 sm:mb-6 min-w-0">
          <Link href="/reported-bookings" className="text-gray-400 hover:text-[#174a37] text-lg transition-colors shrink-0" aria-label="Back to reported bookings">←</Link>
          <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] min-w-0">Reported Booking</h1>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_4px_30px_rgba(0_0_0_/_0.06)] mb-5 min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6 pb-4 border-b border-gray-100 min-w-0">
            <div className="flex flex-wrap gap-4 sm:gap-8 text-sm min-w-0">
              <div><p className="text-gray-400 text-xs">Report ID:</p><p className="font-medium text-gray-800">#{params.id}</p></div>
              <div><p className="text-gray-400 text-xs">Report Date:</p><p className="font-medium text-gray-800">15/01/2025</p></div>
              <div><p className="text-gray-400 text-xs">Booking ID:</p><p className="font-medium text-gray-800">#BK12345678</p></div>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 shrink-0 self-start sm:self-auto">Under Review</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-sm">
            <div><p className="text-gray-400 text-xs mb-0.5">Vendor:</p><p className="font-medium text-gray-800">Royal Gardens Event Co.</p></div>
            <div><p className="text-gray-400 text-xs mb-0.5">Service:</p><p className="font-medium text-gray-800">Premium Venue Package</p></div>
            <div><p className="text-gray-400 text-xs mb-0.5">Event Date:</p><p className="font-medium text-gray-800">20/03/2025</p></div>
            <div><p className="text-gray-400 text-xs mb-0.5">Amount Paid:</p><p className="font-medium text-gray-800">AED 15,000</p></div>
          </div>
          <div className="mb-4">
            <p className="text-gray-400 text-xs mb-1">Report Reason:</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {['Service Not As Described','Poor Quality'].map(r => (
                <span key={r} className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full">{r}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Details:</p>
            <p className="text-gray-600 text-sm leading-6">The vendor did not deliver the services as described in the package. The venue capacity was significantly smaller than advertised, and several promised amenities were not available on the event day. Despite multiple attempts to contact the vendor beforehand, there was no response to our concerns.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_4px_30px_rgba(0_0_0_/_0.06)] min-w-0">
          <h2 className="font-baskerville text-lg sm:text-xl text-[#1a1a1a] mb-4">Timeline</h2>
          <div className="space-y-4">
            {[
              { date:'15/01/2025', time:'10:30 AM', event:'Report submitted', done:true },
              { date:'15/01/2025', time:'11:00 AM', event:'Under review by admin team', done:true },
              { date:'Pending', time:'', event:'Resolution', done:false },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${item.done ? 'bg-[#174a37]' : 'bg-gray-200'}`} />
                <div>
                  <p className={`text-sm font-medium ${item.done ? 'text-gray-800' : 'text-gray-400'}`}>{item.event}</p>
                  {item.date !== 'Pending' && <p className="text-xs text-gray-400">{item.date} {item.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
