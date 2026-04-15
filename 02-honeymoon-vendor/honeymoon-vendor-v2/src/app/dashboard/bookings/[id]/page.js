'use client';
import { useApi } from '../../../../hooks/useApi';
import VendorService from '../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { AcceptBookingModal, RejectBookingModal, CancelBookingModal, CompleteBookingModal, ConfirmModal, SuccessModal } from '@/components/Modals';

const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const IMG3="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

const STATUS_COLORS = {
  Pending:'text-amber-600', Upcoming:'text-blue-600', 'Completed - Paid':'text-green-600',
  'Completed - Unpaid':'text-orange-600', Rejected:'text-red-600', Resolved:'text-teal-600'
};

export default function VendorBookingDetailPage({ params }) {
  const bookingId = params?.id || '';
  const { data, loading, refresh } = useApi(VendorService.getBooking, bookingId);
  const booking = data?.booking || {};
  const user = data?.user || {};
  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('Pending');

  const actions = {
    accept: () => { setStatus('Upcoming'); setModal(null); setSuccess('Booking approved successfully.'); },
    reject: (reason) => { setStatus('Rejected'); setModal(null); setSuccess('Booking rejected.'); },
    cancel: () => { setStatus('Rejected'); setModal(null); setSuccess('Booking cancelled.'); },
    complete: () => { setStatus('Completed - Paid'); setModal(null); setSuccess('Booking marked as completed.'); },
    resolve: () => { setStatus('Resolved'); setModal(null); setSuccess('Booking resolved.'); },
    modify: () => { setModal(null); setSuccess('Modification request sent to customer.'); },
  };

  return (
    <div>
      {modal === 'accept'   && <AcceptBookingModal   onYes={actions.accept}   onNo={() => setModal(null)} />}
      {modal === 'reject'   && <RejectBookingModal   onYes={actions.reject}   onNo={() => setModal(null)} />}
      {modal === 'cancel'   && <CancelBookingModal   onYes={actions.cancel}   onNo={() => setModal(null)} />}
      {modal === 'complete' && <CompleteBookingModal onYes={actions.complete} onNo={() => setModal(null)} />}
      {modal === 'resolve'  && <ConfirmModal message="Mark this booking as resolved?" onYes={actions.resolve} onNo={() => setModal(null)} />}
      {modal === 'modify'   && <ConfirmModal message="Send a modification request to the customer before approving?" onYes={actions.modify} onNo={() => setModal(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/bookings" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Booking Detail</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-4 sm:gap-8 text-sm">
            <div><p className="text-gray-400 text-xs">Booking ID:</p><p className="font-medium text-gray-800">#{params.id || '12345678'}</p></div>
            <div><p className="text-gray-400 text-xs">Booking Date:</p><p className="font-medium text-gray-800">mm/dd/yyyy</p></div>
          </div>
          <div><span className="text-xs text-gray-400">Status: </span>
            <span className={`text-sm font-semibold ${STATUS_COLORS[status] || 'text-gray-600'}`}>{status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left */}
          <div>
            <h2 className="font-semibold text-[#1a1a1a] text-base mb-4">Service Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm">
              <div><p className="text-gray-400 text-xs mb-0.5">Service</p><p className="font-medium text-gray-800">Service ABC</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Category</p><p className="font-medium text-gray-800">Category A</p></div>
            </div>
            <div className="mb-5">
              <p className="text-gray-400 text-xs mb-2">Added Add-Ons</p>
              <div className="flex flex-wrap gap-2">
                {['Add-On ABC','Add-On ABC','Add-On ABC','Add-On ABC','Add-On ABC'].map((a,i)=>(
                  <span key={i} className="bg-[#174a37] text-white text-xs px-4 py-1.5 rounded-full">{a}</span>
                ))}
              </div>
            </div>
            <h2 className="font-semibold text-[#1a1a1a] text-base mb-3">User Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm">
              <div><p className="text-gray-400 text-xs">Name:</p><p className="font-medium text-gray-800">{booking.user?.firstName} {booking.user?.lastName}</p></div>
              <div><p className="text-gray-400 text-xs">Phone Number:</p><p className="font-medium text-gray-800">{booking.user?.phone || "—"}</p></div>
              <div><p className="text-gray-400 text-xs">Email:</p><p className="font-medium text-gray-800">User@Gmail.Com</p></div>
              <div><p className="text-gray-400 text-xs">Location:</p><p className="font-medium text-gray-800">Location ABC</p></div>
            </div>
            <h2 className="font-semibold text-[#1a1a1a] text-base mb-3">Event Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
              <div><p className="text-gray-400 text-xs">Event Date:</p><p className="font-medium">MM/DD/YYYY</p></div>
              <div><p className="text-gray-400 text-xs">Event Time:</p><p className="font-medium">HH:MM – HH:MM</p></div>
              <div><p className="text-gray-400 text-xs">No. Of Guests:</p><p className="font-medium">200</p></div>
              <div><p className="text-gray-400 text-xs">Quantity:</p><p className="font-medium">200</p></div>
            </div>
            <div className="mb-4 text-sm">
              <p className="text-gray-400 text-xs mb-1">Additional Note:</p>
              <p className="text-gray-600 leading-6 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2">Inspirational Images:</p>
              <div className="flex gap-2">
                {[IMG1,IMG2,IMG3].map((img,i)=>(
                  <div key={i} className="w-24 h-20 rounded-xl overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover"/></div>
                ))}
              </div>
            </div>
            {status === 'Rejected' && (
              <div className="text-sm">
                <p className="text-gray-400 text-xs mb-1">Rejection Reason:</p>
                <p className="text-gray-600 leading-6 bg-red-50 p-3 rounded-xl border border-red-100">The requested date is unavailable.</p>
              </div>
            )}
          </div>

          {/* Right - Payment Summary */}
          <div>
            <h2 className="font-semibold text-[#1a1a1a] text-base mb-4">Payment Summary</h2>
            <div className="text-xs space-y-1.5">
              {[
                ['Service Charges','200 AED'],['Price Per Guest / Per Hour',''],['Guests / Hours / Quantity','20'],
                ['Service Total','400 AED'],['Add-On Charges',''],['Add-On ABC (Per Guest)','200 AED'],['Guests','200'],
                ['Add-On ABC Total','400 AED'],['Add-On ABC (Per Item)','200 AED'],['Quantity','200'],
                ['Add-On ABC Total','400 AED'],['Add-On ABC (Per Hour)','200 AED'],['Hours','2'],
                ['Add-On ABC Total','400 AED'],['Add-On ABC (Package)','200 AED'],['Add-On ABC Total','400 AED'],
                ['Add-Ons Total','400 AED'],['Sub Total','400 AED'],
                ['Initial Deposit (20%) (On Approval)','50 AED'],['Amount To Pay Later (On Booking Completion)','50 AED'],
              ].map(([l,v],i)=>(
                <div key={i} className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 flex-1 mr-2">{l}</span>
                  {v&&<span className="font-medium text-gray-800 whitespace-nowrap">{v}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons based on status */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100 flex-wrap">
          {status === 'Pending' && <>
            <button onClick={() => setModal('accept')} className="bg-[#174a37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">Approve ↗</button>
            <button onClick={() => setModal('reject')} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">Reject ↗</button>
            <button onClick={() => setModal('modify')} className="border border-[#174a37] text-[#174a37] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#F5F5EF] transition-colors">Modify & Approve ↗</button>
          </>}
          {status === 'Upcoming' && <>
            <button onClick={() => setModal('complete')} className="bg-[#174a37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">Mark Completed ↗</button>
            <button onClick={() => setModal('cancel')} className="border border-red-300 text-red-500 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-red-50 transition-colors">Cancel</button>
          </>}
          {(status === 'Completed - Paid' || status === 'Completed - Unpaid') && (
            <button onClick={() => setModal('resolve')} className="bg-[#174a37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">Mark Resolved ↗</button>
          )}
        </div>
      </div>
    </div>
  );
}
