'use client';
import { useApi } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useVendorAuth } from '../../../context/auth';
import { useState, useEffect } from 'react';
import { ChangePasswordModal, UploadPhotoModal, SuccessModal, LogoutModal } from '@/components/Modals';
import { useRouter } from 'next/navigation';

// Inline edit profile modal — pre-populated from real API data
function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    firstName:   profile?.firstName   || '',
    lastName:    profile?.lastName    || '',
    gender:      profile?.gender      || '',
    companyName: profile?.companyName || profile?.company || '',
    phone:       profile?.phone       || '',
    services:    profile?.category    || profile?.services || '',
    address:     profile?.address     || profile?.location || '',
  });
  const [saving, setSaving] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSave() {
    setSaving(true);
    try {
      await VendorService.updateProfile(form);
      onSave();
    } catch (e) { alert(e?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-6 text-center">Update Profile</h3>
        <p className="font-semibold text-[#1a1a1a] text-base mb-4">Personal Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {[['First Name','firstName','text','Tom'],['Last Name','lastName','text','Albert']].map(([l,k,t,ph])=>(
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
              <input type={t} value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select value={form.gender} onChange={e=>f('gender',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
            <option value="">Select Gender</option>
            <option>Male</option><option>Female</option><option>Prefer not to say</option>
          </select>
        </div>
        <p className="font-semibold text-[#1a1a1a] text-base mb-4 mt-2">Company Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Name<span className="text-red-500">*</span></label>
            <input value={form.companyName} onChange={e=>f('companyName',e.target.value)} placeholder="Company Name"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Number<span className="text-red-500">*</span></label>
            <input value={form.phone} onChange={e=>f('phone',e.target.value)} placeholder="+971..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
          <select value={form.services} onChange={e=>f('services',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
            <option value="">Select Service</option>
            {['Venue','Photography','Catering','Beauty','Decoration','Music','Transport'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea value={form.address} onChange={e=>f('address',e.target.value)} placeholder="Full address" rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? 'Saving…' : 'Update ↗'}
          </button>
        </div>
      </div>
    </div>
  );
}

const InfoField = ({ label, value }) => value ? (
  <div>
    <p className="text-[#1a1a1a] text-sm font-semibold mb-0.5">{label}:</p>
    <p className="text-[#7e7e7e] text-base font-medium">{value}</p>
  </div>
) : null;

export default function VendorProfilePage() {
  const { vendor, logout, updateVendor } = useVendorAuth();
  const { data, loading, refresh } = useApi(VendorService.getProfile);
  const profile = data?.vendor || vendor || {};
  const router = useRouter();
  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState('');

  const avatarSrc = profile.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent((profile.firstName||'V')+' '+(profile.lastName||''))}&background=174a37&color=CFB383&size=200`;

  return (
    <div className="w-full min-w-0 max-w-3xl">
      {modal === 'edit'     && <EditProfileModal profile={profile} onClose={() => setModal(null)} onSave={() => { setModal(null); setSuccess('Profile updated successfully.'); refresh(); if (updateVendor && data?.vendor) updateVendor(data.vendor); }} />}
      {modal === 'password' && <ChangePasswordModal  onClose={() => setModal(null)} onSave={() => { setModal(null); setSuccess('Password updated successfully.'); }} />}
      {modal === 'photo'    && <UploadPhotoModal     onClose={() => setModal(null)} onSave={() => { setModal(null); setSuccess('Profile photo updated.'); refresh(); }} />}
      {modal === 'logout'   && <LogoutModal          onYes={() => { logout?.(); router.push('/login'); }} onNo={() => setModal(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex items-center gap-3 mb-5 sm:mb-6 min-w-0">
        <button type="button" onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 text-lg shrink-0">←</button>
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] min-w-0">My Profile</h1>
      </div>

      {/* Personal Info Card — matches Figma layout */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-5 relative">
        {/* Avatar top-right */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-[rgba(218,218,218,0.3)]">
              {loading
                ? <div className="w-full h-full bg-gray-100 animate-pulse rounded-full"/>
                : <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover"/>}
            </div>
            <button type="button" onClick={() => setModal('photo')}
              className="absolute bottom-0 right-0 w-6 h-6 bg-[#174a37] rounded-full flex items-center justify-center text-white text-xs shadow hover:bg-[#1a5c45] transition-colors">
              📷
            </button>
          </div>
        </div>

        {/* Personal fields — matching Figma 2-col grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 pr-24">
            {Array.from({length:4}).map((_,i)=><div key={i}><div className="h-3 w-20 bg-gray-100 rounded mb-2 animate-pulse"/><div className="h-4 w-32 bg-gray-100 rounded animate-pulse"/></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 pr-24 sm:pr-28">
            <InfoField label="First Name"     value={profile.firstName} />
            <InfoField label="Last Name"      value={profile.lastName} />
            <InfoField label="Phone Number"   value={profile.phone} />
            <InfoField label="E-Mail Address" value={profile.email} />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <button type="button" onClick={() => setModal('edit')}
            className="flex items-center justify-center gap-2 bg-[#174a37] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors w-full sm:w-auto">
            Edit Profile ↗
          </button>
          <button type="button" onClick={() => setModal('password')}
            className="flex items-center justify-center gap-2 bg-[#aab4b1] text-[#174a37] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#97a09d] transition-colors w-full sm:w-auto">
            Change Password ↗
          </button>
        </div>
      </div>

      {/* Company Details Card — the missing section per issues doc */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-5">
        <h2 className="font-baskerville text-xl text-[#1a1a1a] mb-5">Company Details</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({length:4}).map((_,i)=><div key={i}><div className="h-3 w-24 bg-gray-100 rounded mb-2 animate-pulse"/><div className="h-4 w-36 bg-gray-100 rounded animate-pulse"/></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoField label="Company Name"   value={profile.companyName || profile.company} />
            <InfoField label="Services"       value={profile.category || profile.services} />
            <InfoField label="Location"       value={profile.location} />
            <InfoField label="Address"        value={profile.address} />
            {profile.about && (
              <div className="sm:col-span-2">
                <p className="text-[#1a1a1a] text-sm font-semibold mb-0.5">About:</p>
                <p className="text-[#7e7e7e] text-base font-medium leading-relaxed">{profile.about}</p>
              </div>
            )}
            {profile.tradeLicense && (
              <InfoField label="Trade License" value={profile.tradeLicense} />
            )}
          </div>
        )}
        {!loading && !profile.companyName && !profile.company && (
          <p className="text-gray-400 text-sm">No company details added yet. <button type="button" onClick={() => setModal('edit')} className="text-[#174a37] underline">Add now</button></p>
        )}
      </div>

      {/* Logout */}
      <button type="button" onClick={() => setModal('logout')}
        className="flex items-center justify-center gap-2 border border-red-200 text-red-500 px-6 py-3 rounded-full text-sm font-medium hover:bg-red-50 transition-colors w-full sm:w-auto">
        🚪 Log Out
      </button>
    </div>
  );
}
