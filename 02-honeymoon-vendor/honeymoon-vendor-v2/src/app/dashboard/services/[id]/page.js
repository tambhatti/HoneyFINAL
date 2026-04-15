'use client';
import { useApi } from '../../../../hooks/useApi';
import VendorService from '../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";

const CALENDAR_DAYS = ['M','T','W','T','F','S','S'];
const UNAVAILABLE = [13,19,20];
const ALL_DAYS = Array.from({length:30},(_,i)=>i+1);

export default function VendorViewServicePage({ params }) {
  const svcId = params?.id || '';
  const { data } = useApi(VendorService.getService, svcId);
  const service = data?.service || {};
  const router = useRouter();
  const [confirm,setConfirm]=useState(false);
  const [success,setSuccess]=useState('');

  async function handleDelete() {
    try {
      await VendorService.deleteService(svcId);
      setConfirm(false);
      setSuccess('Service deleted.');
      router.push('/dashboard/services');
    } catch (e) {
      alert(e?.message || 'Failed to delete service.');
      setConfirm(false);
    }
  }

  return(
    <div>
      {confirm&&<ConfirmModal message="Delete this service? This cannot be undone." onYes={handleDelete} onNo={()=>setConfirm(false)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/services" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">View Service</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-semibold text-base text-gray-800">{service.name || 'Service'}</h2>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${service.status === 'Inactive' ? 'text-gray-700 bg-gray-100' : 'text-green-700 bg-green-100'}`}>
            {service.status || 'Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
          <div><p className="text-gray-400 text-xs">Category:</p><p className="font-medium">{service.category || '—'}</p></div>
          <div><p className="text-gray-400 text-xs">Location:</p><p className="font-medium">{service.location || '—'}</p></div>
        </div>

        <div className="mb-4 text-sm">
          <p className="text-gray-400 text-xs mb-1">Description</p>
          <p className="text-gray-600 leading-6 text-xs">{service.description || 'No description added yet.'}</p>
        </div>

        {/* Pricing table */}
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 border-b border-gray-100">
            {['Price Per Guest:','Price Per Hour:','Minimum Guests:','Minimum Hours:'].map((h,i)=>(
              <div key={h} className={`p-3 ${i<3?'border-r border-gray-100':''}`}>
                <p className="text-gray-400 text-xs">{h}</p><p className="font-medium">{service.basePrice ? `${service.basePrice} AED` : '—'}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
            {['Minimum Guests:','','',''].map((h,i)=>(
              <div key={i} className={`p-3 ${i<3?'border-r border-gray-100':''}`}>
                {i===0&&<><p className="text-gray-400 text-xs">{h}</p><p className="font-medium">{service.minGuests || '—'}</p></>}
              </div>
            ))}
          </div>
        </div>

        {/* Packages table */}
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
          <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-xs min-w-[640px]">
            <thead><tr className="border-b border-gray-100 bg-[#faf8f4]">
              {['Package Name','Package Price','Inclusions'].map(h=><th key={h} className="text-left py-2.5 px-4 text-gray-500 font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {(service.packages?.length ? service.packages : [{ id: 'empty', name: 'No packages added', price: null, inclusions: [] }]).map((pkg)=>(
                <tr key={pkg.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 px-4 text-gray-700">{pkg.name}</td>
                  <td className="py-2.5 px-4 text-gray-700">{pkg.price ? `${pkg.price} AED` : '—'}</td>
                  <td className="py-2.5 px-4 text-gray-500">{Array.isArray(pkg.inclusions) && pkg.inclusions.length ? pkg.inclusions.join(', ') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>

        {/* Per Item */}
        <div className="mb-4 text-sm border border-gray-100 rounded-xl p-3">
          <p className="text-gray-400 text-xs">Base Price:</p><p className="font-medium">{service.basePrice ? `${service.basePrice} AED` : '—'}</p>
        </div>

        {/* Policies */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
          <div><p className="text-gray-400 text-xs">Initial Deposit:</p><p className="font-medium">{service.depositPercent ? `${service.depositPercent}%` : '—'}</p></div>
          <div><p className="text-gray-400 text-xs">Minimum Hours</p><p className="font-medium">{service.minHours || '—'}</p></div>
          <div><p className="text-gray-400 text-xs">Status</p><p className="font-medium">{service.status || 'Active'}</p></div>
        </div>
        <div className="mb-5 text-sm">
          <p className="text-gray-400 text-xs">Policies</p>
          <p className="font-medium">{service.policies?.length ? `${service.policies.length} policy item(s) configured` : 'No policies added yet.'}</p>
        </div>

        {/* Calendar */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Service Availability For Booking</p>
          <div className="border border-gray-200 rounded-xl p-4 inline-block">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
              <button className="text-gray-400 hover:text-gray-600 text-sm">‹</button>
              <span className="text-sm font-medium text-gray-800">February 2026</span>
              <button className="text-gray-400 hover:text-gray-600 text-sm">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {CALENDAR_DAYS.map((d,i)=><div key={i} className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs font-medium">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[null,null].concat(ALL_DAYS).map((d,i)=>(
                d===null?<div key={i} className="w-8 h-8"/>:
                <div key={i} className={`w-8 h-8 flex items-center justify-center text-xs rounded-full transition-colors
                  ${UNAVAILABLE.includes(d)?'bg-red-100 text-red-600 font-medium':'text-gray-600 hover:bg-[#F5F5EF] cursor-pointer'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-gray-300 bg-white"/><span className="text-xs text-gray-500">Available</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-200"/><span className="text-xs text-gray-500">Unavailable</span></div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {(service.images?.length ? service.images : [IMG1,IMG2]).map((img,i)=><div key={i} className="h-40 rounded-xl overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover"/></div>)}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href={`/dashboard/services/${params.id}/edit`} className="bg-[#174a37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">
            Save & Next →
          </Link>
          <button onClick={()=>setConfirm(true)} className="border border-red-200 text-red-500 bg-red-50 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-red-100 transition-colors">
            Delete Service
          </button>
        </div>
      </div>
    </div>
  );
}
