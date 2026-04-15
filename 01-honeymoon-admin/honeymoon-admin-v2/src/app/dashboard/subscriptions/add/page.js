'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AdminService } from '../../../../lib/services/admin.service';
import { SuccessModal } from '@/components/Modals';

const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]";
const lbl = "block text-sm font-medium text-gray-700 mb-1";

export default function AddSubscriptionPage() {
  const [form, setForm] = useState({
    name: '', priceMonthly: '', priceYearly: '', maxServices: '',
    commissionDiscount: '', profileFeaturing: false, bannerPromotion: false,
    features: '', status: 'active',
  });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    if (!form.name)         return setError('Plan name is required.');
    if (!form.priceMonthly) return setError('Monthly price is required.');
    setSaving(true); setError('');
    try {
      await AdminService.createSubscriptionPlan({
        name:               form.name,
        priceMonthly:       Number(form.priceMonthly),
        priceYearly:        Number(form.priceYearly) || Number(form.priceMonthly) * 10,
        maxServices:        Number(form.maxServices) || undefined,
        commissionDiscount: Number(form.commissionDiscount) || 0,
        profileFeaturing:   form.profileFeaturing,
        bannerPromotion:    form.bannerPromotion,
        features:           form.features.split('\n').map(f => f.trim()).filter(Boolean),
        isActive:           form.status === 'active',
      });
      setSuccess(true);
    } catch (e) {
      setError(e?.message || 'Failed to create plan. Please try again.');
    } finally { setSaving(false); }
  };

  return (
    <div className="w-full min-w-0 max-w-2xl">
      {success && <SuccessModal message="Subscription plan created successfully." onOk={() => window.location.href = '/dashboard/subscriptions'} />}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 text-sm text-gray-400">
        <Link href="/dashboard/subscriptions" className="hover:text-[#174a37]">Subscription Management</Link>
        <span>/</span><span className="text-gray-800">Add Plan</span>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <h1 className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] mb-6">Add Subscription Plan</h1>

        {/* Plan Name + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div><label className={lbl}>Plan Name<span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Gold Plan" className={inp}/></div>
          <div><label className={lbl}>Status</label>
            <select value={form.status} onChange={e => f('status', e.target.value)} className={inp}>
              <option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div><label className={lbl}>Monthly Price (AED)<span className="text-red-500">*</span></label>
            <input type="number" value={form.priceMonthly} onChange={e => f('priceMonthly', e.target.value)} placeholder="e.g. 299" className={inp}/></div>
          <div><label className={lbl}>Yearly Price (AED)</label>
            <input type="number" value={form.priceYearly} onChange={e => f('priceYearly', e.target.value)} placeholder="Leave blank to auto-calculate" className={inp}/></div>
        </div>

        {/* Commission Discount + Max Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={lbl}>Commission Discount (%)</label>
            <input type="number" value={form.commissionDiscount} onChange={e => f('commissionDiscount', e.target.value)}
              placeholder="e.g. 5" min="0" max="100" className={inp}/>
            <p className="text-gray-400 text-xs mt-1">Discount off the platform commission for vendors on this plan</p>
          </div>
          <div><label className={lbl}>Max Services</label>
            <input type="number" value={form.maxServices} onChange={e => f('maxServices', e.target.value)} placeholder="e.g. 10" className={inp}/></div>
        </div>

        {/* Profile Featuring + Banner Promotion checkboxes */}
        <div className="bg-[#f9f6ef] rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Plan Perks</p>
          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.profileFeaturing} onChange={e => f('profileFeaturing', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#174a37] rounded shrink-0"/>
              <div>
                <p className="text-sm font-medium text-gray-800">Profile Featuring</p>
                <p className="text-xs text-gray-400">Vendor profile appears in featured section on user platform</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.bannerPromotion} onChange={e => f('bannerPromotion', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#174a37] rounded shrink-0"/>
              <div>
                <p className="text-sm font-medium text-gray-800">Banner Promotion</p>
                <p className="text-xs text-gray-400">Vendor gets a promotional banner on the home page</p>
              </div>
            </label>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <label className={lbl}>Features (one per line)</label>
          <textarea value={form.features} onChange={e => f('features', e.target.value)} rows={4}
            placeholder={"Unlimited listings\nPriority placement\nAnalytics dashboard"}
            className={`${inp} resize-none`}/>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Link href="/dashboard/subscriptions" className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-center">
            Cancel
          </Link>
          <button type="button" onClick={handleCreate} disabled={saving}
            className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60">
            {saving ? 'Creating…' : 'Create Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
