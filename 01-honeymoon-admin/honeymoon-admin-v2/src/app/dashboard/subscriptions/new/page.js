'use client';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';

export default function NewSubscriptionPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:'', commissionDiscount:'', profileFeaturing:false, bannerPromotion:'none', priceMonthly:'', priceYearly:'' });
  const [success, setSuccess] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="w-full min-w-0 max-w-2xl">
      {success && <SuccessModal message="Subscription plan created successfully!" onOk={() => window.location.href = '/dashboard/subscriptions'} />}
      <div className="flex items-center gap-3 mb-5 sm:mb-6 min-w-0">
        <Link href="/dashboard/subscriptions" className="text-gray-400 hover:text-gray-600 text-lg shrink-0">←</Link>
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] min-w-0">New Subscription</h1>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
        <div className="flex flex-col gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subscription Name<span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e=>f('name',e.target.value)} placeholder="e.g. Premium Plan"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Commission Discount (%)<span className="text-red-500">*</span></label>
            <input type="number" value={form.commissionDiscount} onChange={e=>f('commissionDiscount',e.target.value)} placeholder="e.g. 10"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Featuring</label>
            <div className="flex gap-4">
              {[['Included',true],['Not Included',false]].map(([l,v])=>(
                <label key={l} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" checked={form.profileFeaturing===v} onChange={()=>f('profileFeaturing',v)} className="accent-[#174a37]"/>{l}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Promotion</label>
            <div className="flex gap-4 flex-wrap">
              {[['Not Included','none'],['On Platform','platform'],['Off Platform','off'],['Both','both']].map(([l,v])=>(
                <label key={l} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="radio" checked={form.bannerPromotion===v} onChange={()=>f('bannerPromotion',v)} className="accent-[#174a37]"/>{l}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Price Monthly (USD)<span className="text-red-500">*</span></label>
              <input type="number" value={form.priceMonthly} onChange={e=>f('priceMonthly',e.target.value)} placeholder="e.g. 20"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Price Yearly (USD)<span className="text-red-500">*</span></label>
              <input type="number" value={form.priceYearly} onChange={e=>f('priceYearly',e.target.value)} placeholder="e.g. 40"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <Link href="/dashboard/subscriptions" className="flex-1 border border-gray-200 text-gray-500 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-colors text-center flex items-center justify-center">
            Cancel
          </Link>
          <button type="button" onClick={()=>form.name&&form.priceMonthly&&setSuccess(true)}
            className="flex-1 bg-[#174a37] text-white py-3.5 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">
            Create Plan ↗
          </button>
        </div>
      </div>
    </div>
  );
}
