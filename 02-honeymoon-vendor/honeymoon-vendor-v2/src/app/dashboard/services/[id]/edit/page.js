'use client';
import { useApi } from '../../../../../hooks/useApi';
import VendorService from '../../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';

const STEPS=['Service Detail','Pricing','Add-ons','Policies'];
const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";

export default function EditServicePage({ params }) {
  const svcId = params?.id || '';
  const { data, loading } = useApi(VendorService.getService, svcId);
  const service = data?.service || {};
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: 'Service ABC', category: 'Venue', location: 'Location ABC',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'Inactive', pricingType: 'Per Guest', price: '200', deposit: '20',
    addons: [{name:'Add-On ABC',price:'50'},{name:'Add-On ABC',price:'50'}],
    cancelPolicy: 'Lorem ipsum', terms: 'Lorem ipsum', refund: 'Lorem ipsum'
  });
  const [success, setSuccess] = useState(false);
  const f = (k, v) => setForm(p => ({...p, [k]: v}));

  return (
    <div className="max-w-2xl">
      {success && <SuccessModal message="Service updated successfully!" onOk={() => window.location.href=`/dashboard/services/${params.id}`} />}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/services/${params.id}`} className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Edit Service</h1>
      </div>

      {/* Step indicators */}
      <div className="flex mb-6">
        {STEPS.map((s,i) => (
          <div key={s} className="flex-1 flex items-center cursor-pointer" onClick={() => setStep(i+1)}>
            <div className="flex items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i+1===step?'bg-[#174a37] text-white border-[#174a37]':i+1<step?'bg-[#CFB383] text-white border-[#CFB383]':'bg-white text-gray-400 border-gray-200'}`}>
                {i+1<step?'✓':i+1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i+1<=step?'text-[#1a1a1a]':'text-gray-400'}`}>{s}</span>
            </div>
            {i<STEPS.length-1 && <div className={`flex-1 h-0.5 mx-2 ${i+1<step?'bg-[#CFB383]':'bg-gray-100'}`}/>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        {step===1 && (
          <div className="flex flex-col gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Service Title<span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e=>f('name',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category<span className="text-red-500">*</span></label>
                <select value={form.category} onChange={e=>f('category',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                  {['Venue','Photography','Beauty','Catering','Decoration'].map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Status<span className="text-red-500">*</span></label>
                <select value={form.status} onChange={e=>f('status',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                  <option>Active</option><option>Inactive</option></select></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Service Description<span className="text-red-500">*</span></label>
              <textarea value={form.desc} onChange={e=>f('desc',e.target.value)} rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location<span className="text-red-500">*</span></label>
              <input value={form.location} onChange={e=>f('location',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Upload Image<span className="text-red-500">*</span></label>
              <div className="flex gap-3">
                {[IMG1,IMG2].map((img,i)=>(
                  <div key={i} className="relative w-32 h-24 rounded-xl overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                    <button className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                  </div>
                ))}
                <div className="w-32 h-24 border-2 border-dashed border-[rgba(184_154_105_/_0.3)] rounded-xl flex items-center justify-center cursor-pointer hover:border-[#CFB383] transition-colors">
                  <span className="text-2xl opacity-30">+</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {step===2 && (
          <div className="flex flex-col gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
              <div className="flex gap-3 flex-wrap">
                {['Per Guest','Per Hour','Per Item','Package'].map(t=>(
                  <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="pt" value={t} checked={form.pricingType===t} onChange={e=>f('pricingType',e.target.value)} className="accent-[#174a37]"/>{t}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Base Price (AED)</label>
                <input value={form.price} onChange={e=>f('price',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Deposit (%)</label>
                <input value={form.deposit} onChange={e=>f('deposit',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
            </div>
          </div>
        )}
        {step===3 && (
          <div>
            {form.addons.map((a,i)=>(
              <div key={i} className="flex gap-3 mb-3 items-end">
                <div className="flex-1"><label className="block text-xs text-gray-500 mb-1">Add-On Name</label>
                  <input value={a.name} onChange={e=>setForm(p=>({...p,addons:p.addons.map((x,j)=>j===i?{...x,name:e.target.value}:x)}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
                <div className="w-28"><label className="block text-xs text-gray-500 mb-1">Price (AED)</label>
                  <input value={a.price} onChange={e=>setForm(p=>({...p,addons:p.addons.map((x,j)=>j===i?{...x,price:e.target.value}:x)}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
                <button onClick={()=>setForm(p=>({...p,addons:p.addons.filter((_,j)=>j!==i)}))} className="text-red-400 hover:text-red-600 pb-2.5 text-lg">✕</button>
              </div>
            ))}
            <button onClick={()=>setForm(p=>({...p,addons:[...p.addons,{name:'',price:''}]}))} className="text-sm text-[#174a37] hover:underline">+ Add Add-on</button>
          </div>
        )}
        {step===4 && (
          <div className="flex flex-col gap-4">
            {[['Cancellation Policy','cancelPolicy'],['Terms & Conditions','terms'],['Refund Policy','refund']].map(([l,k])=>(
              <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                <textarea value={form[k]} onChange={e=>f(k,e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/></div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step>1 && <button onClick={()=>setStep(s=>s-1)} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">← Back</button>}
          {step<4 ?
            <button onClick={()=>setStep(s=>s+1)} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Save & Next ↗</button>:
            <button onClick={()=>setSuccess(true)} className="flex-1 bg-[#CFB383] text-white py-3 rounded-full font-medium hover:bg-[#B8A06E] transition-colors">Save Changes ↗</button>
          }
        </div>
      </div>
    </div>
  );
}
