'use client';
import { useApi } from '../../../../hooks/useApi';
import UserService from '../../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';

const IMG1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";

function SuccessModal({ message, onClose }) {
  return (
    <ModalLayer open onClose={onClose} aria-label="Success">
      <div className="bg-white rounded-2xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-6 sm:p-10 text-center shadow-2xl min-w-0">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
        </div>
        <p className="text-[#1a1a1a] text-lg font-medium mb-6">{message}</p>
        <button type="button" onClick={onClose} className="w-full sm:w-auto bg-[#CFB383] text-white px-10 py-3 rounded-xl font-medium">Okay</button>
      </div>
    </ModalLayer>
  );
}

export default function CustomQuotationDetailPage({ params }) {
  const qId = params?.id || '';
  const { data, loading, refresh } = useApi(UserService.getQuotation, qId);
  const quotation = data?.quotation || {};
  const vendor = data?.vendor || {};
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('Pending');

  const statusColors = {
    'Pending': 'text-amber-700 bg-amber-100',
    'Requested': 'text-blue-700 bg-blue-100',
    'Upcoming': 'text-purple-700 bg-purple-100',
    'Completed': 'text-green-700 bg-green-100',
    'Rejected': 'text-red-700 bg-red-100',
  };

  const quotes = [
    { vendor: 'Al Habtoor Palace', amount: 'AED 55,000', includes: 'Venue + Catering + Decor', img: IMG1 },
    { vendor: 'Crystal Gardens', amount: 'AED 62,000', includes: 'All-inclusive package', img: IMG1 },
  ];

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      {success && <SuccessModal message={success} onClose={() => setSuccess('')} />}
      <LoggedInNav />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm text-black/40 min-w-0">
          <Link href="/my-bookings" className="hover:text-[#174a37] shrink-0">My Bookings</Link>
          <span className="shrink-0">/</span><span className="text-[#1a1a1a] min-w-0 break-words">Custom Quotation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 min-w-0">
                <h1 className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] min-w-0 break-words">Custom Quotation Request</h1>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium w-fit shrink-0 ${statusColors[status]}`}>{status}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[['Request ID',`CQ-2025-${params.id}`],['Event Date','Jun 15, 2026'],['Guests','~200'],['Service Type','Venue + Catering'],['Budget Range','AED 40,000 – 60,000'],['Submitted','Jan 15, 2025']].map(([l,v])=>(
                  <div key={l} className="bg-[#f9f6ef] rounded-xl p-3">
                    <p className="text-black/40 text-xs uppercase tracking-wider">{l}</p>
                    <p className="text-[#1a1a1a] font-medium text-sm mt-0.5 break-words tabular-nums">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-black/40 text-xs uppercase tracking-wider mb-2">Your Requirements</p>
                <p className="text-black/60 text-sm bg-[#f9f6ef] rounded-xl p-4 leading-6">Premium indoor venue with full catering for 200 guests, floral decoration, and dedicated wedding coordinator needed.</p>
              </div>
            </div>

            {/* Vendor Quotes */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] min-w-0">
              <h2 className="font-baskerville text-lg sm:text-xl text-[#1a1a1a] mb-4 sm:mb-5">Vendor Quotes Received</h2>
              {quotes.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {quotes.map(q => (
                    <div key={q.vendor} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 p-4 border border-[rgba(184_154_105_/_0.2)] rounded-xl hover:border-[#CFB383] transition-colors min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0"><img src={q.img} alt="" className="w-full h-full object-cover"/></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1a1a1a] break-words">{q.vendor}</p>
                        <p className="text-black/40 text-sm break-words">{q.includes}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0 w-full sm:w-auto min-w-0">
                        <p className="font-baskerville text-xl sm:text-2xl text-[#174a37] tabular-nums">{q.amount}</p>
                        <button type="button" onClick={() => { setStatus('Upcoming'); setSuccess('Quote accepted! The vendor has been notified.'); }}
                          className="mt-1 w-full sm:w-auto text-xs text-white bg-[#CFB383] px-4 py-1.5 rounded-lg hover:bg-[#B8A06E] transition-colors">
                          Accept Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-black/30">
                  <p className="text-3xl mb-2">⏳</p>
                  <p className="text-sm">Waiting for vendor quotes...</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] min-w-0 lg:sticky lg:top-[88px] h-fit">
              <h3 className="font-medium text-black/60 text-sm mb-4">Status Timeline</h3>
              {['Submitted','Under Review','Quotes Received','Accepted','Confirmed'].map((s,i)=>(
                <div key={s} className="flex items-center gap-3 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${i<=2?'bg-[#174a37]':'bg-gray-200'}`}/>
                  <p className={`text-sm ${i<=2?'text-[#1a1a1a] font-medium':'text-black/30'}`}>{s}</p>
                  {i<=2 && <span className="ml-auto text-xs text-black/30">✓</span>}
                </div>
              ))}
            </div>
            <Link href="/request-meeting" className="block bg-[#174a37] text-white py-3 rounded-xl font-medium text-sm text-center hover:bg-[#1a5c45] transition-colors">
              Schedule Meeting
            </Link>
            <Link href="/my-bookings" className="block border border-[rgba(184_154_105_/_0.3)] text-[#CFB383] py-3 rounded-xl font-medium text-sm text-center hover:bg-[#F5F5EF] transition-colors">
              Back to Bookings
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
