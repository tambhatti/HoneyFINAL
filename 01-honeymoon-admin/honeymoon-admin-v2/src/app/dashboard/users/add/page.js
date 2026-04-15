'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AdminService } from '../../../../lib/services/admin.service';
import { SuccessModal } from '@/components/Modals';

export default function AddUserPage() {
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'', gender:'', password:'', confirm:''
  });
  const f = (k,v) => setForm(p => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    setError('');
    if (!form.firstName || !form.email)       return setError('First name and email are required.');
    if (!form.password)                        return setError('Password is required.');
    if (form.password.length < 8)              return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirm)        return setError('Passwords do not match.');
    setSaving(true);
    try {
      await AdminService.createUser({
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        phone:     form.phone ? `+971${form.phone.replace(/^0/,'')}` : undefined,
        gender:    form.gender || undefined,
        password:  form.password,
      });
      setSuccess(true);
    } catch (e) {
      setError(e?.message || 'Failed to create user. Please try again.');
    } finally { setSaving(false); }
  };

  return (
    <div className="w-full min-w-0 max-w-2xl">
      {success && <SuccessModal message="User created successfully." onOk={() => window.location.href='/dashboard/users'} />}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 sm:mb-6 text-sm text-gray-400 min-w-0">
        <Link href="/dashboard/users" className="hover:text-[#174a37] shrink-0">User Management</Link>
        <span>/</span><span className="text-gray-800">Add User</span>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)] min-w-0">
        <h1 className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] mb-6">Add New User</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {[['First Name','firstName','Enter first name'],['Last Name','lastName','Enter last name']].map(([l,k,ph]) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l}{k==='firstName'&&<span className="text-red-500">*</span>}</label>
              <input value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address<span className="text-red-500">*</span></label>
          <input type="email" value={form.email} onChange={e=>f('email',e.target.value)} placeholder="Enter email address"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="flex gap-2 min-w-0">
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-3 py-2.5 shrink-0 bg-[#faf8f4]">
              <span>🇦🇪</span><span className="text-xs text-gray-500">+971</span>
            </div>
            <input value={form.phone} onChange={e=>f('phone',e.target.value)} placeholder="Enter phone"
              className="min-w-0 flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select value={form.gender} onChange={e=>f('gender',e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
            <option value="">Select</option><option>Male</option><option>Female</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {[['Password<span>*</span>','password','password'],['Confirm Password<span>*</span>','confirm','password']].map(([l,k,t]) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l.replace('<span>*</span>','')}<span className="text-red-500">*</span></label>
              <input type={t} value={form[k]} onChange={e=>f(k,e.target.value)} placeholder="Min 8 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
            </div>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Link href="/dashboard/users"
            className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-center">
            Cancel
          </Link>
          <button type="button" onClick={handleCreate} disabled={saving}
            className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60">
            {saving ? 'Creating…' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
