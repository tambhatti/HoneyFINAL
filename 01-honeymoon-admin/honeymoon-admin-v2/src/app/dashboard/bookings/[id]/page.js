'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const statusColor={Pending:'text-amber-600','Upcoming':'text-blue-600','Completed - Paid':'text-green-600','Completed - Unpaid':'text-orange-600',Rejected:'text-red-600',Resolved:'text-teal-600'};

export default function AdminBookingDetailPage({ params }) {
  const bookingId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getBooking, bookingId);
  const booking = data?.booking || {};
  const user = data?.user || {};
  const vendor = data?.vendor || {};
  const [status,setStatus]=useState('Pending');
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');

  return(
    <div className="w-full min-w-0">
      {modal==='resolve'&&<ConfirmModal message="Mark this booking as resolved?" onYes={()=>{setStatus('Resolved');setModal(null);setSuccess('Booking marked as resolved.');}} onNo={()=>setModal(null)}/>}
      {modal==='cancel'&&<ConfirmModal message="Cancel this booking?" onYes={()=>{setStatus('Rejected');setModal(null);setSuccess('Booking cancelled.');}} onNo={()=>setModal(null)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center gap-3 mb-5 sm:mb-6 min-w-0">
        <Link href="/dashboard/bookings" className="text-gray-400 hover:text-gray-600 text-lg shrink-0">←</Link>
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] min-w-0">Booking Detail</h1>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 pb-4 border-b border-gray-100 min-w-0">
          <div className="flex flex-wrap gap-4 sm:gap-8 text-sm min-w-0">
            <div><p className="text-gray-400 text-xs">Booking ID:</p><p className="font-medium text-gray-800">#{params.id||'12345678'}</p></div>
            <div><p className="text-gray-400 text-xs">Booking Date:</p><p className="font-medium text-gray-800">mm/dd/yyyy</p></div>
          </div>
          <div className="shrink-0"><span className="text-xs text-gray-400">Status: </span><span className={`text-sm font-semibold ${statusColor[status]}`}>{status}</span></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold text-[#1a1a1a] text-base mb-4">Service Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
              <div><p className="text-gray-400 text-xs">Service</p><p className="font-medium">Service ABC</p></div>
              <div><p className="text-gray-400 text-xs">Category</p><p className="font-medium">Category A</p></div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
              <div><p className="text-gray-400 text-xs">Name:</p><p className="font-medium">User ABC</p></div>
              <div><p className="text-gray-400 text-xs">Phone Number:</p><p className="font-medium">123456789</p></div>
              <div><p className="text-gray-400 text-xs">Email:</p><p className="font-medium">User@Gmail.Com</p></div>
              <div><p className="text-gray-400 text-xs">Location:</p><p className="font-medium">Location ABC</p></div>
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
              <p className="text-gray-600 leading-6 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.</p>
            </div>
            {status==='Rejected'&&(
              <div className="text-sm">
                <p className="text-gray-400 text-xs mb-1">Rejection Reason:</p>
                <p className="text-gray-600 leading-6 bg-red-50 p-3 rounded-xl border border-red-100">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-[#1a1a1a] text-base mb-4">Payment Summary</h2>
            <div className="text-xs space-y-1.5">
              {[['Service Charges','200 AED'],['Price Per Guest / Per Hour / Per Item / Package',''],['Guests / Hours / Quantity','20'],['Service Total','400 AED'],['Add-On Charges',''],['Add-On ABC (Per Guest)','200 AED'],['Guests','200'],['Add-On ABC Total','400 AED'],['Add-On ABC (Per Item)','200 AED'],['Quantity','200'],['Add-On ABC Total','400 AED'],['Add-On ABC (Per Hour)','200 AED'],['Hours','2'],['Add-On ABC Total','400 AED'],['Add-On ABC (Package)','200 AED'],['Add-On ABC Total','400 AED'],['Add-Ons Total','400 AED'],['Sub Total','400 AED'],['Initial Deposit (20%) (On Approval)','50 AED'],['Amount To Pay Later (On Booking Completion)','50 AED']].map(([l,v])=>(
                <div key={l} className="flex flex-col gap-0.5 py-2 border-b border-gray-50 last:border-0 sm:flex-row sm:justify-between sm:items-baseline sm:gap-3">
                  <span className="text-gray-500 min-w-0 flex-1 text-[11px] sm:text-xs leading-snug">{l}</span>
                  {v&&<span className="font-medium text-gray-800 whitespace-nowrap shrink-0 text-right sm:text-left">{v}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
        {(status==='Pending'||status==='Upcoming')&&(
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-6 pt-5 border-t border-gray-100">
            <button type="button" onClick={()=>setModal('resolve')} className="inline-flex items-center justify-center bg-[#174a37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors w-full sm:w-auto">Mark Resolved</button>
            {status==='Pending'&&<button type="button" onClick={()=>setModal('cancel')} className="border border-red-300 text-red-500 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-red-50 transition-colors w-full sm:w-auto text-center">Cancel Booking</button>}
          </div>
        )}
      </div>
    </div>
  );
}
