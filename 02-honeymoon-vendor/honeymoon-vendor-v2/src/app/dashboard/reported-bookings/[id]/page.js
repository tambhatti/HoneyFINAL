'use client';
import { useApi } from '../../../../hooks/useApi';
import VendorService from '../../../../lib/services/vendor.service';
import Link from 'next/link';
const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const IMG3="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";
export default function ReportedBookingDetailPage({ params }) {
  const rId = params?.id || '';
  const { data, loading } = useApi(VendorService.getReportedBooking, rId);
  const report = data?.report || {};
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Booking Detail</h1>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
            <div><p className="text-gray-400 text-xs">Booking ID:</p><p className="font-medium text-gray-800">#{params.id}</p></div>
            <div><p className="text-gray-400 text-xs">Booking Date:</p><p className="font-medium text-gray-800">mm/dd/yyyy</p></div>
          </div>
          <div><span className="text-xs text-gray-400">Status: </span><span className="text-sm font-semibold text-teal-600">Resolved</span></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold text-[#1a1a1a] text-base mb-4">Service Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm">
              <div><p className="text-gray-400 text-xs mb-0.5">Service</p><p className="font-medium">Service ABC</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Category</p><p className="font-medium">Category A</p></div>
            </div>
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2">Added Add-Ons</p>
              <div className="flex flex-wrap gap-2">
                {['Add-On ABC','Add-On ABC','Add-On ABC','Add-On ABC','Add-On ABC'].map((a,i)=>(
                  <span key={i} className="bg-[#174a37] text-white text-xs px-4 py-1.5 rounded-full">{a}</span>
                ))}
              </div>
            </div>
            <h2 className="font-semibold text-[#1a1a1a] text-base mb-3">User Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm">
              <div><p className="text-gray-400 text-xs">Name:</p><p className="font-medium">User ABC</p></div>
              <div><p className="text-gray-400 text-xs">Phone Number:</p><p className="font-medium">{report.user?.phone || "—"}</p></div>
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
              <p className="text-gray-600 leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.</p>
            </div>
            <div className="mb-5">
              <p className="text-gray-400 text-xs mb-2">Inspirational Images:</p>
              <div className="flex gap-2">
                {[IMG1,IMG2,IMG3].map((img,i)=><div key={i} className="w-24 h-20 rounded-xl overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover"/></div>)}
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-[#1a1a1a] text-base mb-2">Reported Details</h2>
              <p className="text-gray-400 text-xs mb-1">Review:</p>
              <p className="text-gray-600 text-sm leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.</p>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-[#1a1a1a] text-base mb-4">Payment Summary</h2>
            <div className="text-sm space-y-1.5">
              {[['Service Charges','200 AED'],['Service Total','400 AED'],['Add-On Charges',''],['Add-On ABC Total','400 AED'],['Add-Ons Total','400 AED'],['Sub Total','400 AED'],['Initial Deposit (20%)','400 AED'],['Amount To Pay Later','200 AED']].map(([l,v])=>(
                <div key={l} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500 text-xs">{l}</span>
                  {v&&<span className="font-medium text-gray-800 text-xs">{v}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
