'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useAdminAuth } from '../../../context/auth';
import { useState } from 'react';
import { SuccessModal, ChangePasswordModal, UploadPhotoModal } from '@/components/Modals';
import ModalLayer from '@/components/ModalLayer';

const AVATAR="https://ui-avatars.com/api/?name=User&background=174a37&color=CFB383&size=200";

function EditProfileModal({profile,onClose,onSave}){
  const [form,setForm]=useState({...profile});
  return(
    <ModalLayer open onClose={onClose} aria-labelledby="admin-profile-edit-title">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[480px] relative max-h-[90vh] overflow-y-auto overscroll-y-contain">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <h3 id="admin-profile-edit-title" className="font-baskerville text-2xl text-[#CFB383] mb-6">Edit Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {[['First Name','firstName'],['Last Name','lastName']].map(([l,k])=>(
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          ))}
        </div>
        {[['E-Mail Address','email'],['Phone Number','phone']].map(([l,k])=>(
          <div key={k} className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
            <input value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
        ))}
        <button type="button" onClick={()=>onSave(form)} className="w-full bg-[#CFB383] text-white py-3.5 rounded-full font-medium mt-2 hover:bg-[#B8A06E] transition-colors">Update ↗</button>
      </div>
    </ModalLayer>
  );
}

export default function AdminProfilePage(){
  const { admin, logout } = useAdminAuth();
  const { data, loading, refresh } = useApi(AdminService.getProfile);
  const profile = data?.admin || admin || {};
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');

  return(
    <div className="w-full min-w-0 max-w-3xl">
      {modal==='edit'&&<EditProfileModal profile={profile} onClose={()=>setModal(null)} onSave={async p=>{
          try { await AdminService.updateProfile(p); refresh(); } catch(e) {}
          setModal(null); setSuccess('Profile updated successfully.');
        }}/>}
      {modal==='password'&&<ChangePasswordModal onClose={()=>setModal(null)} onSave={()=>{setModal(null);setSuccess('Password updated successfully.');}}/>}
      {modal==='photo'&&<UploadPhotoModal onClose={()=>setModal(null)} onSave={()=>{setModal(null);setSuccess('Profile photo updated.');}}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center gap-3 mb-5 sm:mb-6 min-w-0">
        <button type="button" onClick={()=>window.history.back()} className="text-gray-400 hover:text-gray-600 text-lg shrink-0">←</button>
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] min-w-0">My Profile</h1>
      </div>
      <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-16 gap-y-5 text-sm min-w-0">
            <div><p className="text-gray-400 text-xs mb-1">First Name:</p><p className="font-medium text-gray-800">{profile.firstName}</p></div>
            <div><p className="text-gray-400 text-xs mb-1">Last Name:</p><p className="font-medium text-gray-800">{profile.lastName}</p></div>
            <div><p className="text-gray-400 text-xs mb-1">Phone Number:</p><p className="font-medium text-gray-800">{profile.phone}</p></div>
            <div><p className="text-gray-400 text-xs mb-1">E-Mail Address:</p><p className="font-medium text-gray-800">{profile.email}</p></div>
          </div>
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[rgba(184_154_105_/_0.2)]">
              <img src={AVATAR} alt="" className="w-full h-full object-cover"/>
            </div>
            <button type="button" onClick={()=>setModal('photo')} className="absolute bottom-0 right-0 w-7 h-7 bg-[#174a37] rounded-full flex items-center justify-center text-white text-xs shadow-md hover:bg-[#1a5c45] transition-colors">📷</button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <button type="button" onClick={()=>setModal('edit')} className="flex items-center justify-center gap-2 bg-[#174a37] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors w-full sm:w-auto">
            Edit Profile ↗
          </button>
          <button type="button" onClick={()=>setModal('password')} className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
            Change Password ↗
          </button>
        </div>
      </div>
    </div>
  );
}
