'use client';
import { useState } from 'react';
import ModalLayer from './ModalLayer';

const CARD = 'bg-white rounded-2xl shadow-2xl w-full max-w-md relative';

function CloseBtn({ onClose }) {
  return (
    <button type="button" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-sm" aria-label="Close">✕</button>
  );
}

export function ConfirmModal({ title = 'Please Confirm', message, onYes, onNo }) {
  return (
    <ModalLayer open onClose={onNo} aria-labelledby="vendor-confirm-title">
      <div className={`${CARD} p-5 sm:p-8 text-center`}>
        <CloseBtn onClose={onNo} />
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl text-red-500">⚠️</span>
        </div>
        <h3 id="vendor-confirm-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-2">{title}</h3>
        {message && <p className="text-gray-500 text-sm mb-6 leading-6">{message}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={onNo} className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors">No</button>
          <button type="button" onClick={onYes} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Yes</button>
        </div>
      </div>
    </ModalLayer>
  );
}

export function SuccessModal({ message = 'Action completed successfully.', onOk }) {
  return (
    <ModalLayer open onClose={onOk} aria-labelledby="vendor-success-title">
      <div className={`${CARD} p-5 sm:p-8 text-center`}>
        <CloseBtn onClose={onOk} />
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">✅</span>
        </div>
        <h3 id="vendor-success-title" className="font-baskerville text-2xl text-[#174a37] mb-2">Success!</h3>
        <p className="text-gray-500 text-sm mb-6 leading-6">{message}</p>
        <button type="button" onClick={onOk} className="w-full bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">OK</button>
      </div>
    </ModalLayer>
  );
}

export function LogoutModal({ onYes, onNo }) {
  return (
    <ConfirmModal
      title="Please Confirm"
      message="Are You Sure You Want To Log Out"
      onYes={onYes}
      onNo={onNo}
    />
  );
}

export function AcceptBookingModal({ onYes, onNo }) {
  return (
    <ConfirmModal
      title="Please Confirm"
      message="Are You Sure You Want To Approve The Booking"
      onYes={onYes}
      onNo={onNo}
    />
  );
}

export function RejectBookingModal({ onYes, onNo }) {
  const [reason, setReason] = useState('');
  return (
    <ModalLayer open onClose={onNo} aria-labelledby="vendor-reject-booking-title">
      <div className={`${CARD} p-5 sm:p-8`}>
        <CloseBtn onClose={onNo} />
        <h3 id="vendor-reject-booking-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-6 text-center">Reason</h3>
        <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Rejection Reason</label>
        <textarea
          value={reason} onChange={e => setReason(e.target.value)}
          placeholder="Enter Rejection Reason" rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] bg-[#faf8f4] resize-none mb-5"
        />
        <button type="button" onClick={() => reason && onYes(reason)}
          className="w-full bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-50"
          disabled={!reason}>
          Submit
        </button>
      </div>
    </ModalLayer>
  );
}

export function CancelBookingModal({ onYes, onNo }) {
  return (
    <ConfirmModal
      title="Please Confirm"
      message="Are You Sure You Want To Cancel This Booking?"
      onYes={onYes}
      onNo={onNo}
    />
  );
}

export function CompleteBookingModal({ onYes, onNo }) {
  return (
    <ConfirmModal
      title="Please Confirm"
      message="Are You Sure You Want To Mark This Booking As Completed?"
      onYes={onYes}
      onNo={onNo}
    />
  );
}

export function UploadPhotoModal({ onClose, onSave }) {
  const [preview, setPreview] = useState(null);
  function handleFile(e) {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  }
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-upload-photo-title">
      <div className={`${CARD} p-5 sm:p-8`}>
        <CloseBtn onClose={onClose} />
        <h3 id="vendor-upload-photo-title" className="font-baskerville text-2xl text-[#CFB383] mb-6 text-center">Upload Profile Photo</h3>
        <div className="border-2 border-dashed border-[rgba(184_154_105_/_0.4)] rounded-2xl p-8 text-center cursor-pointer hover:border-[#CFB383] transition-colors mb-5" onClick={() => document.getElementById('vendor-photo-input').click()}>
          {preview ? (
            <img src={preview} alt="preview" className="w-24 h-24 rounded-full object-cover mx-auto" />
          ) : (
            <>
              <div className="text-4xl mb-3 opacity-30">📷</div>
              <p className="text-gray-400 text-sm">Click to upload photo</p>
              <p className="text-gray-300 text-xs mt-1">JPG, PNG up to 5MB</p>
            </>
          )}
        </div>
        <input id="vendor-photo-input" type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <div className="flex gap-3">
          <button type="button" onClick={onSave} disabled={!preview} className="flex-1 bg-[#CFB383] text-white py-3 rounded-full font-medium hover:bg-[#B8A06E] disabled:opacity-50 transition-colors">Save Photo</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </ModalLayer>
  );
}

export function ChangePasswordModal({ onClose, onSave }) {
  const [form, setForm] = useState({ current:'', newPw:'', confirm:'' });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-change-pw-title">
      <div className={`${CARD} p-5 sm:p-8`}>
        <CloseBtn onClose={onClose} />
        <h3 id="vendor-change-pw-title" className="font-baskerville text-2xl text-[#CFB383] mb-6 text-center">Change Password</h3>
        {[['Current Password','current'],['New Password','newPw'],['Confirm Password','confirm']].map(([l,k])=>(
          <div key={k} className="mb-4">
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">{l}<span className="text-red-500">*</span></label>
            <input type="password" value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={`Enter ${l}`}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
        ))}
        <button type="button" onClick={()=>form.current&&form.newPw&&form.confirm&&onSave()}
          className="w-full bg-[#CFB383] text-white py-3.5 rounded-full font-medium hover:bg-[#B8A06E] transition-colors mt-2">
          Update Password ↗
        </button>
      </div>
    </ModalLayer>
  );
}

export function UpdateProfileModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    firstName:'Tom', lastName:'Albert', gender:'',
    companyName:'Company ABC', phone:'1234567890',
    services:'', address:''
  });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-update-profile-title">
      <div className={`${CARD} p-5 sm:p-8 max-h-[90vh] overflow-y-auto overscroll-y-contain`}>
        <CloseBtn onClose={onClose} />
        <h3 id="vendor-update-profile-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-6 text-center">Update Profile</h3>
        <p className="font-semibold text-[#1a1a1a] text-base mb-4">Personal Detail</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name<span className="text-red-500">*</span></label>
            <input value={form.firstName} onChange={e=>f('firstName',e.target.value)} placeholder="Tom"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name<span className="text-red-500">*</span></label>
            <input value={form.lastName} onChange={e=>f('lastName',e.target.value)} placeholder="Albert"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender<span className="text-red-500">*</span></label>
          <select value={form.gender} onChange={e=>f('gender',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
            <option value="">Select Gender</option>
            <option>Male</option><option>Female</option><option>Prefer not to say</option>
          </select>
        </div>
        <p className="font-semibold text-[#1a1a1a] text-base mb-4 mt-2">Company Detail</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
            <input value={form.companyName} onChange={e=>f('companyName',e.target.value)} placeholder="Company ABC"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number<span className="text-red-500">*</span></label>
            <input value={form.phone} onChange={e=>f('phone',e.target.value)} placeholder="1234567890"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered<span className="text-red-500">*</span></label>
          <select value={form.services} onChange={e=>f('services',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
            <option value="">Select Service</option>
            <option>Venue</option><option>Photography</option><option>Catering</option><option>Beauty</option><option>Decoration</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address<span className="text-red-500">*</span></label>
          <textarea value={form.address} onChange={e=>f('address',e.target.value)} placeholder="Enter Address" rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {['Trade License','Company Banner'].map(label=>(
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}<span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl h-20 flex items-center justify-center cursor-pointer hover:border-[#CFB383] transition-colors bg-[#faf8f4]">
                <span className="text-gray-300 text-2xl">+</span>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={onSave} className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-medium hover:bg-[#1a5c45] transition-colors flex items-center justify-center gap-2">
          Update ↗
        </button>
      </div>
    </ModalLayer>
  );
}

export function AddonModal({ addon, onClose, onSave }) {
  const [form, setForm] = useState(addon || { title:'', category:'', status:'', priceType:'', price:'' });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-addon-title">
      <div className={`${CARD} p-5 sm:p-8`}>
        <CloseBtn onClose={onClose} />
        <h3 id="vendor-addon-title" className="font-baskerville text-2xl text-[#CFB383] mb-6 text-center">{addon ? 'Edit' : 'Add'} Add-On</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Add-on Title<span className="text-red-500">*</span></label>
            <input value={form.title} onChange={e=>f('title',e.target.value)} placeholder="Enter Add-On Title"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Category<span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e=>f('category',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                <option value="">Enter Service Title</option>
                {['Venue','Photography','Beauty','Catering','Decoration'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Status<span className="text-red-500">*</span></label>
              <select value={form.status} onChange={e=>f('status',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                <option value="">Enter Service Title</option>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Price Type<span className="text-red-500">*</span></label>
              <select value={form.priceType} onChange={e=>f('priceType',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                <option value="">Select Price Type</option>
                <option>Per Guest</option><option>Per Hour</option><option>Per Item</option><option>Package</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Price<span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="number" value={form.price} onChange={e=>f('price',e.target.value)} placeholder="Enter Price"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-14 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
                <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">AED</span>
              </div>
            </div>
          </div>
        </div>
        <button type="button" onClick={()=>form.title&&onSave(form)}
          className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-medium hover:bg-[#1a5c45] transition-colors mt-5 flex items-center justify-center gap-2">
          Save & Next ↗
        </button>
      </div>
    </ModalLayer>
  );
}

export function ReplyModal({ review, onClose, onSave }) {
  const [reply, setReply] = useState('');
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-reply-title">
      <div className={`${CARD} p-5 sm:p-8`}>
        <CloseBtn onClose={onClose} />
        <h3 id="vendor-reply-title" className="font-baskerville text-2xl text-[#CFB383] mb-5 text-center">Reply to Review</h3>
        {review && (
          <div className="bg-[#f9f6ef] rounded-xl p-4 mb-5">
            <p className="text-gray-500 text-xs mb-1">{review.name}</p>
            <p className="text-gray-600 text-sm leading-5 line-clamp-2">{review.text}</p>
          </div>
        )}
        <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={4} placeholder="Write your reply..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none bg-[#faf8f4] mb-5"/>
        <div className="flex gap-3">
          <button type="button" onClick={()=>reply&&onSave(reply)} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Post Reply</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </ModalLayer>
  );
}

export function ReportModal({ onClose, onSave }) {
  const [reason, setReason] = useState('');
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-report-title">
      <div className={`${CARD} p-5 sm:p-8`}>
        <CloseBtn onClose={onClose} />
        <h3 id="vendor-report-title" className="font-baskerville text-2xl text-[#CFB383] mb-5 text-center">Report Booking</h3>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Reason<span className="text-red-500">*</span></label>
          <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={5} placeholder="Describe the issue..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none bg-[#faf8f4]"/>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={()=>reason&&onSave(reason)} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Submit</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </ModalLayer>
  );
}
