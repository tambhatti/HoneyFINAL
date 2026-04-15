'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';

const STATUS_COLORS = {
  'Upcoming':'bg-blue-100 text-blue-700','Confirmed':'bg-blue-100 text-blue-700',
  'Completed':'bg-green-100 text-green-700','Pending':'bg-amber-100 text-amber-700',
  'Rejected':'bg-red-100 text-red-700','Cancelled':'bg-gray-100 text-gray-500',
  'Requested':'bg-purple-100 text-purple-700',
};

function StatusBadge({ s }) {
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_COLORS[s] || 'bg-gray-100 text-gray-500'}`}>{s}</span>;
}

function RejectionModal({ booking, onClose }) {
  return (
    <ModalLayer open onClose={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[480px] p-5 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-baskerville text-2xl text-[#1a1a1a]">Rejection Reason</h2>
          <button type="button" onClick={onClose} className="text-black/30 hover:text-black/60 text-xl">✕</button>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
          <p className="text-sm text-red-700 leading-6">
            {booking?.rejectionReason || 'Your booking request could not be accommodated at this time. Please contact the vendor or try a different date.'}
          </p>
        </div>
        <button type="button" onClick={onClose} className="w-full bg-[#174a37] text-white font-medium py-3 rounded-xl hover:bg-[#1a5c45] transition-colors">
          Understood
        </button>
      </div>
    </ModalLayer>
  );
}

export default function MyBookingsPage() {
  const [tab,          setTab]          = useState('standard');
  const [activeStatus, setActiveStatus] = useState('');
  const [showRejection,setShowRejection]= useState(null);

  const { items: bookings, loading, total, hasMore, nextPage } = usePaginated(
    UserService.getMyBookings,
    { status: activeStatus || undefined, type: tab === 'standard' ? 'Standard' : 'Custom' }
  );

  const STATUSES = tab === 'standard'
    ? ['','Pending','Confirmed','Upcoming','Completed','Rejected','Cancelled']
    : ['','Requested','Pending','Upcoming','Completed','Rejected'];

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] flex flex-col w-full min-w-0">
      {showRejection && <RejectionModal booking={showRejection} onClose={() => setShowRejection(null)} />}
      <LoggedInNav />
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-8 w-full min-w-0">
        <h1 className="font-baskerville text-[28px] sm:text-[36px] text-[#1a1a1a] mb-6">My Bookings</h1>

        {/* Tab switcher */}
        <div className="flex rounded-xl border border-[rgba(23,74,55,0.25)] overflow-hidden w-full sm:w-auto self-start mb-5">
          {[['standard','Standard'],['custom','Custom Quotations']].map(([id,label]) => (
            <button key={id} type="button" onClick={() => { setTab(id); setActiveStatus(''); }}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium transition-colors ${tab===id ? 'bg-[#174a37] text-white' : 'text-[#174a37] hover:bg-[#F5F5EF]'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUSES.map(s => (
            <button key={s} type="button" onClick={() => setActiveStatus(s)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${activeStatus===s ? 'bg-[#174a37] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#CFB383]'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_15px_rgba(0,0,0,0.06)] animate-pulse">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl shrink-0"/>
                  <div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded w-1/2"/><div className="h-3 bg-gray-100 rounded w-1/3"/></div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 sm:p-16 text-center shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
            <div className="text-4xl sm:text-5xl mb-4 opacity-20">📋</div>
            <p className="text-gray-400 text-sm mb-4">No bookings yet</p>
            <Link href="/vendors" className="text-[#174a37] text-sm font-medium hover:underline">Browse vendors →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
                  {/* Vendor image */}
                  <div className="w-full sm:w-20 h-32 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {b.vendor?.images?.[0]
                      ? <img src={b.vendor.images[0]} alt="" className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">🏛</div>
                    }
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a] text-base">{b.vendor?.companyName || 'Vendor'}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {b.type || tab} · {b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-AE',{dateStyle:'medium'}) : '—'}
                        </p>
                      </div>
                      <StatusBadge s={b.status} />
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <span className="text-gray-500">Amount: <strong className="text-[#1a1a1a]">AED {Number(b.totalAmount||0).toLocaleString()}</strong></span>
                      <span className={`font-medium ${b.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                        {b.paymentStatus || 'Unpaid'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/my-bookings/${tab === 'custom' ? 'custom/' : ''}${b.id}`}
                        className="text-xs bg-[#174a37] text-white px-4 py-2 rounded-lg hover:bg-[#1a5c45] transition-colors">
                        View Details
                      </Link>
                      {b.status === 'Completed' && !b.rated && (
                        <Link href={`/my-bookings/review?bookingId=${b.id}`}
                          className="text-xs border border-[#CFB383] text-[#CFB383] px-4 py-2 rounded-lg hover:bg-[#faf8f4] transition-colors">
                          Leave Review
                        </Link>
                      )}
                      {b.paymentStatus !== 'Paid' && b.status !== 'Rejected' && b.status !== 'Cancelled' && (
                        <Link href={`/my-bookings/payment?bookingId=${b.id}`}
                          className="text-xs border border-[#174a37] text-[#174a37] px-4 py-2 rounded-lg hover:bg-[#F5F5EF] transition-colors">
                          Make Payment
                        </Link>
                      )}
                      {b.status === 'Rejected' && (
                        <button type="button" onClick={() => setShowRejection(b)}
                          className="text-xs border border-red-200 text-red-500 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                          View Reason
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {hasMore && (
          <div className="mt-6 text-center">
            <button onClick={nextPage} disabled={loading} className="bg-white border border-gray-200 text-[#174a37] px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#F5F5EF] transition-colors disabled:opacity-50">
              {loading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
