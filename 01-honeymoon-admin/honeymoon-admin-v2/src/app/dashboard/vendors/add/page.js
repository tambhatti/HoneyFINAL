'use client';
import api from '../../../../lib/api';
mport AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';
export default function AddVendorPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ first:'', last:'', business:'', email:'', phone:'', category:'', location:'' });
  const [success, setSuccess] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const handleCreate = async () => {
    if (!form.first || !form.business || !form.email || !form.category) return setError('Required fields missing.');
    if (!form.password || form.password.length < 8) return setError('Password must be at least 8 characters.');
    setSaving(true); setError('');
    try {
      const d = await api.post('/auth/vendor/signup', { firstName:form.first, lastName:form.last, email:form.email, password:form.password, phone:form.phone?'+971'+form.phone.replace(/^0/,''):undefined, companyName:form.business, category:form.category, location:form.location||'Dubai' });
      if(!d.success) throw new Error(d.message);
      setSuccess(true);
    } catch(e) { setError(e?.message||'Failed to create vendor'); }
    finally { setSaving(false); }
  };
  return (
    <div className="w-full min-w-0 max-w-2xl">
      {success && <SuccessModal message="Vendor created successfully." onOk={() => window.location.href='/dashboard/vendors'} />}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 sm:mb-6 text-sm text-gray-400 min-w-0">
        <Link href="/dashboard/vendors" className="hover:text-[#174a37] shrink-0">Vendor Management</Link>
        <span>/</span><span className="text-gray-800">Add Vendor</span>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
        <h1 className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] mb-6">Add New Vendor</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {[['First Name','first','Enter first name'],['Last Name','last','Enter last name']].map(([l,k,ph]) => (
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
              <input value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" /></div>
          ))}
        </div>
        {[['Business Name','business','text','Enter business name'],['Email Address','email','email','Enter email']].map(([l,k,t,ph]) => (
          <div key={k} className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
            <input type={t} value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" /></div>
        ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category<span className="text-red-500">*</span></label>
            <select value={form.category} onChange={e=>f('category',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
              <option value="">Select</option>{['Venue','Photography','Beauty','Catering','Decoration'].map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Location<span className="text-red-500">*</span></label>
            <select value={form.location} onChange={e=>f('location',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
              <option value="">Select</option>{['Dubai','Abu Dhabi','Sharjah','Ajman'].map(c => <option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Link href="/dashboard/vendors" className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-center flex items-center justify-center">Cancel</Link>
          <button type="button" onClick={handleCreate} disabled={saving} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60">{saving?'Creating…':'Create Vendor'}</button>
        </div>
      </div>
    </div>
  );
}
