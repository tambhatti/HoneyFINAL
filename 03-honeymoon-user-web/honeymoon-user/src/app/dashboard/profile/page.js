'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useUserAuth } from '../../../context/auth';
import { useState } from 'react';

const imgUnsplash1 = "https://ui-avatars.com/api/?name=Sarah+J&background=174a37&color=CFB383&size=200";

export default function ProfilePage() {
  const { user, updateUser } = useUserAuth();
  const { data, loading, refresh } = useApi(UserService.getProfile);
  const profile = data?.user || user || {};
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: 'Rashed Kabir',
    email: 'rashed.kabir@gmail.com',
    phone: '+971 50 123 4567',
    weddingDate: '2026-06-15',
    partnerName: 'Fatima Al Rashidi',
    guestCount: '200',
    city: 'Dubai',
    budget: '200000',
    style: 'Luxury Emirati',
  });

  return (
    <div className="w-full min-w-0 max-w-[900px] pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 min-w-0">
        <div className="min-w-0">
          <h1 className="font-baskerville text-[28px] sm:text-[34px] md:text-[36px] text-[#1a1a1a]">My Profile</h1>
          <p className="text-black/40 text-sm mt-1">Manage your personal information and wedding details</p>
        </div>
        <button type="button" onClick={() => setEditing(!editing)}
          className={`text-sm font-medium px-5 py-2.5 rounded-[10px] transition-colors shrink-0 self-start sm:self-auto w-full sm:w-auto text-center ${
            editing
              ? 'bg-[#CFB383] text-white hover:bg-[#B8A06E]'
              : 'bg-[#174a37] text-white hover:bg-[#1a5c45]'
          }`}>
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Avatar + Plan */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-[rgba(184_154_105_/_0.2)]">
              <img src={imgUnsplash1} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <p className="font-baskerville text-[22px] text-[#1a1a1a]">{form.name}</p>
            <p className="text-[#CFB383] text-sm mt-0.5">Premium Member</p>
            <div className="mt-4 bg-[#F5F5EF] rounded-xl p-3 text-center">
              <p className="text-[#174a37] text-xs font-medium uppercase tracking-wider">Wedding in</p>
              <p className="font-baskerville text-[28px] text-[#174a37]">187</p>
              <p className="text-[#174a37] text-xs">days</p>
            </div>
            <button type="button" onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = () => alert('Photo selected. Upload will be available when API is connected.'); input.click(); }} className="mt-4 w-full border border-[rgba(184_154_105_/_0.3)] text-[#CFB383] text-xs font-medium py-2 rounded-[8px] hover:bg-[#F5F5EF] transition-colors">
              Change Photo
            </button>
          </div>

          <div className="bg-[#174a37] rounded-2xl p-5 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Plan</p>
            <p className="text-[#CFB383] font-baskerville text-[22px]">Premium</p>
            <div className="flex flex-col gap-2 mt-4">
              {['Unlimited AI matches', 'Priority vendor access', 'Dedicated planner', 'Direct chat'].map(f => (
                <p key={f} className="text-white/70 text-xs flex items-center gap-2">
                  <span className="text-[#CFB383]">✓</span> {f}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name' },
                { label: 'Email Address', key: 'email' },
                { label: 'Phone Number', key: 'phone' },
                { label: 'Partner\'s Name', key: 'partnerName' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">{label}</label>
                  {editing
                    ? <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-[10px] px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#CFB383]" />
                    : <p className="text-[#1a1a1a] text-sm font-medium py-2.5">{form[key]}</p>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Wedding details */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Wedding Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Wedding Date', key: 'weddingDate', type: 'date' },
                { label: 'City', key: 'city' },
                { label: 'Guest Count', key: 'guestCount' },
                { label: 'Total Budget (AED)', key: 'budget' },
                { label: 'Wedding Style', key: 'style' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">{label}</label>
                  {editing
                    ? <input type={type || 'text'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-[10px] px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#CFB383]" />
                    : <p className="text-[#1a1a1a] text-sm font-medium py-2.5">{key === 'budget' ? `AED ${Number(form[key]).toLocaleString()}` : form[key]}</p>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">Security</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1a1a1a]">Password</p>
                <p className="text-black/40 text-xs mt-0.5">Last changed 3 months ago</p>
              </div>
              <button type="button" onClick={() => alert('Password change will be available when API is connected. Navigate to Settings for more options.')} className="border border-[rgba(184_154_105_/_0.3)] text-[#CFB383] text-sm font-medium px-4 py-2 rounded-[8px] hover:bg-[#F5F5EF] transition-colors self-start sm:self-auto shrink-0">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
