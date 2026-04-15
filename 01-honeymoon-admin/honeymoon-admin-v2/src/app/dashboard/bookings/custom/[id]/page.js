'use client';
import { useApi } from '../../../../../hooks/useApi';
import AdminService from '../../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const statusColor={Requested:'text-blue-600',Pending:'text-amber-600',Upcoming:'text-purple-600','Completed - Paid':'text-green-600','Completed - Unpaid':'text-orange-600',Rejected:'text-red-600'};
const allStatuses=['Requested','Pending','Upcoming','Completed - Paid','Completed - Unpaid','Rejected'];

function PieChart({amount,label}){
  return(
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28 mb-2">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#174a37" strokeWidth="3" strokeDasharray="65 35"/>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CFB383" strokeWidth="3" strokeDasharray="35 65" strokeDashoffset="-65"/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[8px] text-gray-500">Venue</p>
          <p className="text-xs font-semibold text-[#1a1a1a] leading-tight">{amount}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center leading-4 max-w-[120px]">{label}</p>
    </div>
  );
}

export default function AdminCustomQuotationDetailPage({ params }) {
  const bookingId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getBooking, bookingId);
  const booking = data?.booking || {};
  const [status,setStatus]=useState('Requested');
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');
  const hasLoyalty = params.id && parseInt(params.id) % 3 === 0;

  return(
    <div className="w-full min-w-0">
      {modal&&<ConfirmModal message={`Update status to "${modal}"?`} onYes={()=>{setStatus(modal);setModal(null);setSuccess('Status updated.');}} onNo={()=>setModal(null)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}
      <div className="flex items-center gap-3 mb-5 sm:mb-6 min-w-0">
        <Link href="/dashboard/bookings" className="text-gray-400 hover:text-gray-600 text-lg shrink-0">←</Link>
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] min-w-0">Custom Quotation Details</h1>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] mb-5 min-w-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-5 min-w-0">
          <div className="flex gap-4 sm:gap-8 text-sm flex-wrap min-w-0">
            <div><p className="text-gray-400 text-xs">Request ID:</p><p className="font-medium">#{(booking.id||'').slice(-10).toUpperCase()}</p></div>
            <div><p className="text-gray-400 text-xs">Name:</p><p className="font-medium">{booking.user?.firstName} {booking.user?.lastName}</p></div>
            <div><p className="text-gray-400 text-xs">Event Date:</p><p className="font-medium">{booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-AE') : '—'}</p></div>
            <div><p className="text-gray-400 text-xs">Amount:</p><p className="font-medium">AED {Number(booking.totalAmount||0).toLocaleString()}</p></div>
            <div><p className="text-gray-400 text-xs">Phone Number:</p><p className="font-medium">123456789</p></div>
            <div><p className="text-gray-400 text-xs">Email:</p><p className="font-medium">user@gmail.com</p></div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 min-w-0">
            {hasLoyalty && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <span className="text-amber-500 text-sm">⭐</span>
                <span className="text-amber-700 text-xs font-medium">Loyalty Applied: 500 pts</span>
              </div>
            )}
            <div><span className="text-xs text-gray-400">Status: </span><span className={`text-sm font-semibold ${statusColor[status]}`}>{status}</span></div>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Services To Be Availed</p>
          <div className="flex gap-2 flex-wrap">
            {['Service ABC','Service ABC','Service ABC'].map((s,i)=><span key={i} className="bg-[#174a37] text-white text-xs px-5 py-1.5 rounded-full">{s}</span>)}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
          <div><p className="text-gray-400 text-xs">Location:</p><p className="font-medium">Location ABC</p></div>
          <div><p className="text-gray-400 text-xs">Event Date:</p><p className="font-medium">mm/dd/yyyy</p></div>
          <div><p className="text-gray-400 text-xs">Event Time:</p><p className="font-medium">HH:MM – HH:MM</p></div>
          <div><p className="text-gray-400 text-xs">No. Of Guests:</p><p className="font-medium">200</p></div>
          <div className="sm:col-span-2"><p className="text-gray-400 text-xs">Budget Range:</p><p className="font-medium">2000 AED – 5000 AED</p></div>
        </div>
        <div className="mb-4 text-sm">
          <p className="text-gray-400 text-xs mb-1">Additional Note:</p>
          <p className="text-gray-600 leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
          <div className="flex gap-2 flex-wrap">
            {allStatuses.map(s=>(
              <button type="button" key={s} onClick={()=>s!==status&&setModal(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${s===status?'bg-[#174a37] text-white border-[#174a37]':'border-gray-200 text-gray-500 hover:border-[#174a37]'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
        <h2 className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] text-center mb-1 px-1">AI Recommendation</h2>
        <p className="text-gray-400 text-sm text-center mb-6 px-1">Most couples in the [User Defined Location] with 300 guests spend 7000 AED – 9000 AED or 8000 AED on average</p>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1">
          <div className="flex justify-center gap-8 sm:gap-16 min-w-[280px] py-1">
            <PieChart amount="Venue 8000 AED" label="Spending Graph according to AI Recommended Budget Range"/>
            <PieChart amount="Venue 5000 AED" label="Spending Graph according to your provided Budget Range"/>
          </div>
        </div>
      </div>
    </div>
  );
}
