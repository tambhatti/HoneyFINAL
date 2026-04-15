'use client';
import ModalLayer from './ModalLayer';

export function ConfirmModal({ title = 'Please Confirm', message, onYes, onNo }) {
  return (
    <ModalLayer open onClose={onNo} aria-labelledby="admin-confirm-title">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-[420px] text-center relative">
        <button type="button" onClick={onNo} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm" aria-label="Close">✕</button>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto mb-4">⚠</div>
        <h3 id="admin-confirm-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-8">{message}</p>
        <div className="flex gap-4">
          <button type="button" onClick={onNo} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors">No</button>
          <button type="button" onClick={onYes} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Yes</button>
        </div>
      </div>
    </ModalLayer>
  );
}

export function SuccessModal({ title = 'Successful', message, onOk }) {
  return (
    <ModalLayer open onClose={onOk} aria-labelledby="admin-success-title">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-[380px] text-center relative">
        <button type="button" onClick={onOk} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">✓</div>
        <h3 id="admin-success-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <button type="button" onClick={onOk} className="w-full bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Ok</button>
      </div>
    </ModalLayer>
  );
}

export function LogoutModal({ onYes, onNo }) {
  return (
    <ModalLayer open onClose={onNo} aria-labelledby="admin-logout-title">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-[400px] text-center relative">
        <button type="button" onClick={onNo} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto mb-4">⚠</div>
        <h3 id="admin-logout-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Log Out</h3>
        <p className="text-gray-500 text-sm mb-8">Are You Sure You Want To Log Out?</p>
        <div className="flex gap-4">
          <button type="button" onClick={onNo} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors">No</button>
          <button type="button" onClick={onYes} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Yes</button>
        </div>
      </div>
    </ModalLayer>
  );
}

export function UploadPhotoModal({ onClose, onSave }) {
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="admin-upload-photo-title">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[420px] relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <h3 id="admin-upload-photo-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-6">Upload Profile Photo</h3>
        <div className="border-2 border-dashed border-[rgba(184_154_105_/_0.4)] rounded-xl p-10 text-center mb-6 hover:border-[#CFB383] cursor-pointer transition-colors">
          <div className="text-4xl mb-3 opacity-30">📷</div>
          <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
          <p className="text-gray-300 text-xs mt-1">PNG, JPG up to 5MB</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onSave} className="flex-1 bg-[#174a37] text-white py-3 rounded-xl font-medium hover:bg-[#1a5c45] transition-colors">Upload</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </ModalLayer>
  );
}

export function ChangePasswordModal({ onClose, onSave }) {
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="admin-change-pw-title">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[480px] relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <h3 id="admin-change-pw-title" className="font-baskerville text-2xl text-[#CFB383] mb-6">Change Password</h3>
        {[['Old Password','old'],['New Password','new'],['Confirm Password','confirm']].map(([label, key]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}<span className="text-red-500">*</span></label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4]">
              <span className="text-gray-400 mr-2 text-sm">🔒</span>
              <input type="password" placeholder="••••••••" className="flex-1 bg-transparent text-sm outline-none" />
              <button type="button" className="text-gray-400 text-xs">👁</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={onSave} className="w-full bg-[#CFB383] text-white py-3.5 rounded-full font-medium mt-2 hover:bg-[#B8A06E] transition-colors">Update</button>
      </div>
    </ModalLayer>
  );
}

export function ApproveVendorModal({ vendor, onYes, onNo }) {
  return (
    <ModalLayer open onClose={onNo} aria-labelledby="admin-approve-vendor-title">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-[420px] text-center relative">
        <button type="button" onClick={onNo} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-4">✓</div>
        <h3 id="admin-approve-vendor-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Approve Vendor</h3>
        <p className="text-gray-500 text-sm mb-8">Are You Sure You Want To Approve This Vendor?</p>
        <div className="flex gap-4">
          <button type="button" onClick={onNo} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors">No</button>
          <button type="button" onClick={onYes} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Yes</button>
        </div>
      </div>
    </ModalLayer>
  );
}

export function RejectVendorModal({ onYes, onNo }) {
  return (
    <ModalLayer open onClose={onNo} aria-labelledby="admin-reject-vendor-title">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-[420px] text-center relative">
        <button type="button" onClick={onNo} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto mb-4">✕</div>
        <h3 id="admin-reject-vendor-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Reject Vendor</h3>
        <p className="text-gray-500 text-sm mb-4">Are You Sure You Want To Reject This Vendor?</p>
        <textarea rows={3} placeholder="Enter reason for rejection..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none mb-6" />
        <div className="flex gap-4">
          <button type="button" onClick={onNo} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors">Cancel</button>
          <button type="button" onClick={onYes} className="flex-1 bg-red-500 text-white py-3 rounded-full font-medium hover:bg-red-600 transition-colors">Reject</button>
        </div>
      </div>
    </ModalLayer>
  );
}
