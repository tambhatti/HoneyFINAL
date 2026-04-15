'use client';
import VendorService from '../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';

const STEPS=['Service Detail','Pricing','Add-ons','Policies'];

function Step1({form,setForm}){
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(
    <div className="flex flex-col gap-4">
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Service Name<span className="text-red-500">*</span></label>
        <input value={form.name||''} onChange={e=>f('name',e.target.value)} placeholder="Enter service name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Category<span className="text-red-500">*</span></label>
          <select value={form.category||''} onChange={e=>f('category',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
            <option value="">Select</option>{['Venue','Photography','Beauty','Catering','Decoration'].map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select value={form.location||''} onChange={e=>f('location',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
            <option value="">Select Emirate</option>{['Dubai','Abu Dhabi','Sharjah'].map(e=><option key={e}>{e}</option>)}</select></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.desc||''} onChange={e=>f('desc',e.target.value)} rows={4} placeholder="Describe your service..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-2">Service Images</label>
        <div className="border-2 border-dashed border-[rgba(184_154_105_/_0.3)] rounded-xl p-8 text-center cursor-pointer hover:border-[#CFB383] transition-colors">
          <div className="text-3xl mb-2 opacity-30">📸</div><p className="text-gray-400 text-sm">Upload images (max 10)</p></div></div>
    </div>
  );
}

function Step2({form,setForm}){
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(
    <div className="flex flex-col gap-4">
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type<span className="text-red-500">*</span></label>
        <div className="flex gap-3">
          {['Per Guest','Per Hour','Per Item','Package'].map(t=>(
            <label key={t} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="radio" name="pricingType" value={t} checked={form.pricingType===t} onChange={e=>f('pricingType',e.target.value)} className="accent-[#174a37]"/>{t}
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Base Price (AED)<span className="text-red-500">*</span></label>
          <input type="number" value={form.price||''} onChange={e=>f('price',e.target.value)} placeholder="e.g. 5000" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Guests</label>
          <input type="number" value={form.minGuests||''} onChange={e=>f('minGuests',e.target.value)} placeholder="e.g. 50" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
          <input type="number" value={form.maxGuests||''} onChange={e=>f('maxGuests',e.target.value)} placeholder="e.g. 500" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Deposit Required (%)</label>
          <input type="number" value={form.deposit||''} onChange={e=>f('deposit',e.target.value)} placeholder="e.g. 20" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
      </div>
    </div>
  );
}

function Step3({form,setForm}){
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const addons=form.addons||[];
  const addNew=()=>setForm(p=>({...p,addons:[...(p.addons||[]),{name:'',price:''}]}));
  const update=(i,k,v)=>setForm(p=>({...p,addons:p.addons.map((a,idx)=>idx===i?{...a,[k]:v}:a)}));
  const remove=(i)=>setForm(p=>({...p,addons:p.addons.filter((_,idx)=>idx!==i)}));
  return(
    <div>
      <p className="text-sm text-gray-500 mb-4">Add optional add-ons customers can include with this service.</p>
      {addons.map((addon,i)=>(
        <div key={i} className="flex gap-3 mb-3 items-end">
          <div className="flex-1"><label className="block text-xs text-gray-500 mb-1">Add-On Name</label>
            <input value={addon.name} onChange={e=>update(i,'name',e.target.value)} placeholder="e.g. Extra Hour" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          <div className="w-32"><label className="block text-xs text-gray-500 mb-1">Price (AED)</label>
            <input value={addon.price} onChange={e=>update(i,'price',e.target.value)} placeholder="500" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          <button onClick={()=>remove(i)} className="text-red-400 hover:text-red-600 pb-2.5 text-lg">✕</button>
        </div>
      ))}
      <button onClick={addNew} className="text-sm text-[#174a37] hover:underline flex items-center gap-1 mt-2">+ Add Add-on</button>
    </div>
  );
}

function Step4({form,setForm}){
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(
    <div className="flex flex-col gap-4">
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
        <textarea value={form.cancelPolicy||''} onChange={e=>f('cancelPolicy',e.target.value)} rows={4} placeholder="Describe your cancellation policy..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
        <textarea value={form.terms||''} onChange={e=>f('terms',e.target.value)} rows={4} placeholder="Enter terms and conditions..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Refund Policy</label>
        <textarea value={form.refund||''} onChange={e=>f('refund',e.target.value)} rows={3} placeholder="Describe your refund policy..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/></div>
    </div>
  );
}

export default function AddServicePage(){
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [form,setForm]=useState({});
  const [success,setSuccess]=useState(false);

  return(
    <div className="max-w-2xl">
      {success&&<SuccessModal message="Service created successfully!" onOk={()=>window.location.href='/dashboard/services'}/>}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/services" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Add Service</h1>
      </div>
      {/* Step progress */}
      <div className="flex mb-6">
        {STEPS.map((s,i)=>(
          <div key={s} className="flex-1 flex items-center">
            <div className={`flex items-center gap-2 ${i+1===step?'text-[#174a37]':i+1<step?'text-[#CFB383]':'text-gray-300'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${i+1===step?'bg-[#174a37] text-white':i+1<step?'bg-[#CFB383] text-white':'bg-gray-100 text-gray-400'}`}>{i+1<step?'✓':i+1}</div>
              <span className="text-xs font-medium hidden sm:block">{s}</span>
            </div>
            {i<STEPS.length-1&&<div className={`flex-1 h-0.5 mx-2 ${i+1<step?'bg-[#CFB383]':'bg-gray-100'}`}/>}
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        <h2 className="font-baskerville text-xl text-[#CFB383] mb-6">{STEPS[step-1]}</h2>
        {step===1&&<Step1 form={form} setForm={setForm}/>}
        {step===2&&<Step2 form={form} setForm={setForm}/>}
        {step===3&&<Step3 form={form} setForm={setForm}/>}
        {step===4&&<Step4 form={form} setForm={setForm}/>}
        <div className="flex gap-3 mt-6">
          {step>1&&<button onClick={()=>setStep(s=>s-1)} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">← Back</button>}
          {step<4?
            <button onClick={()=>setStep(s=>s+1)} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Continue →</button>:
            <button onClick={async ()=>{ try { await VendorService.createService(form); } catch(e){} setSuccess(true); }} className="flex-1 bg-[#CFB383] text-white py-3 rounded-full font-medium hover:bg-[#B8A06E] transition-colors">Create Service ↗</button>
          }
        </div>
      </div>
    </div>
  );
}
