'use client';
import { useApi } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useUserAuth } from '../../context/auth';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';
import { imgAiSparkle as imgAIBadge } from '@/lib/inlineIcons';



function SuccessModal({ message, onClose }) {
  return (
    <ModalLayer open onClose={onClose} aria-label="Success">
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 sm:p-10 text-center shadow-2xl max-h-[90vh] overflow-y-auto overscroll-y-contain min-w-0">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
        </div>
        <p className="text-[#1a1a1a] text-lg font-medium mb-6">{message}</p>
        <button type="button" onClick={onClose} className="bg-[#CFB383] text-white px-10 py-3 rounded-xl hover:bg-[#B8A06E] transition-colors font-medium w-full sm:w-auto">
          Okay
        </button>
      </div>
    </ModalLayer>
  );
}

function EditProfileModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    firstName: profile?.firstName || '',
    lastName:  profile?.lastName  || '',
    phone:     profile?.phone     || '',
    gender:    profile?.gender    || '',
    uaePass:   profile?.uaePass   || '',
  });
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="edit-profile-title">
      <div className="bg-white rounded-2xl w-full max-w-[520px] p-5 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-y-contain min-w-0">
        <h2 id="edit-profile-title" className="font-baskerville text-[24px] sm:text-[30px] text-[#CFB383] mb-6">Edit Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-black/60 block mb-1.5">First Name<span className="text-red-500">*</span></label>
            <input value={form.firstName} onChange={e => setForm(p => ({...p, firstName: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-colors" />
          </div>
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Last Name<span className="text-red-500">*</span></label>
            <input value={form.lastName} onChange={e => setForm(p => ({...p, lastName: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-colors" />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-black/60 block mb-1.5">Phone Number<span className="text-red-500">*</span></label>
          <div className="flex gap-2 min-w-0">
            <div className="flex items-center gap-1.5 border border-[#d4d4d4] rounded-lg px-3 py-2.5 shrink-0">
              <span className="text-sm">🇦🇪</span><span className="text-sm text-black/60">+971</span><span className="text-black/30 text-xs">▾</span>
            </div>
            <input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))}
              className="min-w-0 flex-1 border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-colors" />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-black/60 block mb-1.5">Gender<span className="text-red-500">*</span></label>
          <select value={form.gender} onChange={e => setForm(p => ({...p, gender: e.target.value}))}
            className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-white transition-colors">
            <option>Male</option><option>Female</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="text-sm text-black/60 block mb-1.5">UAE Pass<span className="text-red-500">*</span></label>
          <input value={form.uaePass} onChange={e => setForm(p => ({...p, uaePass: e.target.value}))}
            className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-colors" />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
          <button type="button" onClick={onClose} className="flex-1 border border-[rgba(184_154_105_/_0.3)] text-black/60 font-medium py-3.5 rounded-xl hover:bg-[#F5F5EF] transition-colors">
            Cancel
          </button>
          <button type="button" onClick={() => onSave?.(form)} className="flex-1 bg-[#CFB383] text-white font-medium py-3.5 rounded-xl hover:bg-[#B8A06E] transition-colors">
            Update
          </button>
        </div>
      </div>
    </ModalLayer>
  );
}

function ChangePasswordModal({ onClose, onSave }) {
  const [pwForm, setPwForm] = useState({ old: '', new: '', confirm: '' });
  const [show, setShow] = useState({});
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="change-pw-title">
      <div className="bg-white rounded-2xl w-full max-w-[520px] p-5 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-y-contain min-w-0">
        <h2 id="change-pw-title" className="font-baskerville text-[24px] sm:text-[30px] text-[#CFB383] mb-6">Change Passwords</h2>
        {[
          { key: 'old', label: 'Old Password' },
          { key: 'new', label: 'New Password' },
          { key: 'confirm', label: 'Confirm Password' },
        ].map(f => (
          <div key={f.key} className="mb-4">
            <label className="text-sm text-black/60 block mb-1.5">{f.label}<span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={show[f.key] ? 'text' : 'password'} value={pwForm[f.key]} onChange={e => setPwForm(p => ({...p, [f.key]: e.target.value}))}
                placeholder="Enter your password"
                className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] pr-10 transition-colors" />
              <button type="button" onClick={() => setShow(p => ({...p, [f.key]: !p[f.key]}))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 text-xs">
                {show[f.key] ? '🙈' : '👁'}
              </button>
            </div>
          </div>
        ))}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
          <button type="button" onClick={onClose} className="flex-1 border border-[rgba(184_154_105_/_0.3)] text-black/60 font-medium py-3.5 rounded-xl hover:bg-[#F5F5EF] transition-colors">
            Cancel
          </button>
          <button type="button" onClick={() => onSave?.(pwForm)} className="flex-1 bg-[#CFB383] text-white font-medium py-3.5 rounded-xl hover:bg-[#B8A06E] transition-colors">
            Update
          </button>
        </div>
      </div>
    </ModalLayer>
  );
}

export default function MyProfilePage() {
  const { user, updateUser, logout } = useUserAuth();
  const { data, loading } = useApi(UserService.getProfile);
  const profile = data?.user || user || {};
  const [modal, setModal] = useState(null); // null | 'edit' | 'password' | 'profileSuccess' | 'passwordSuccess'

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      {modal === 'edit' && <EditProfileModal onClose={() => setModal(null)} onSave={async (formData) => {
          try { await UserService.updateProfile(formData); updateUser(formData); } catch(e) {}
          setModal('profileSuccess');
        }} />}
      {modal === 'password' && <ChangePasswordModal onClose={() => setModal(null)} onSave={async (pwData) => {
          try { await UserService.changePassword(pwData); } catch(e) {}
          setModal('passwordSuccess');
        }} />}
      {modal === 'profileSuccess' && <SuccessModal message="Profile Updated Successfully" onClose={() => setModal(null)} />}
      {modal === 'passwordSuccess' && <SuccessModal message="Password Updated Successfully" onClose={() => setModal(null)} />}

      <LoggedInNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <h1 className="font-baskerville text-[28px] sm:text-[36px] lg:text-[40px] text-[#CFB383] mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] max-w-[800px] relative">
          {/* AI badge */}
          <div className="flex flex-col items-center mb-6 sm:mb-0 sm:absolute sm:right-8 sm:top-8">
            <img src={imgAIBadge} alt="" className="w-16" />
            <p className="text-[10px] text-black/30 uppercase tracking-wider mt-1 text-center">Smart Wedding<br/>Assistant</p>
          </div>

          {/* Avatar */}
          <div className="relative w-24 h-24 mb-6">
            <img src={profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((profile?.firstName||"U")+" "+(profile?.lastName||""))}&background=174a37&color=CFB383&size=200`} alt="John Harper" className="w-24 h-24 rounded-full object-cover" />
            <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-[#174a37] rounded-full flex items-center justify-center text-white text-sm">📷</button>
          </div>

          {/* Profile fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-5 mb-8">
            {[
              { label: 'User Name:', value: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '—' },
              { label: 'Gender:', value: 'Male' },
              { label: 'Phone Number:', value: '+19159969739' },
              { label: 'UAE Pass:', value: profile.uaePass || '—' },
              { label: 'Email:', value: 'john.harper@example.com', span: true },
            ].map(f => (
              <div key={f.label} className={f.span ? 'sm:col-span-2' : ''}>
                <span className="text-black/50 text-sm">{f.label}</span>
                <span className="text-[#1a1a1a] text-sm font-medium ml-4">{f.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <button type="button" onClick={() => setModal('edit')}
              className="bg-[#CFB383] text-white px-4 md:px-8 py-3 rounded-xl hover:bg-[#B8A06E] transition-colors font-medium w-full sm:w-auto text-center">
              Update Profile
            </button>
            <button type="button" onClick={() => setModal('password')}
              className="bg-[#174a37] text-white px-4 md:px-8 py-3 rounded-xl hover:bg-[#1a5c45] transition-colors font-medium w-full sm:w-auto text-center">
              Change Password
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
