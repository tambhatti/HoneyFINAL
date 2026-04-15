'use client';
import { useState } from 'react';
import ModalLayer from '@/components/ModalLayer';

function SuccessModal({ onClose }) {
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="contact-success-title">
      <div className="bg-white rounded-2xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-6 sm:p-10 text-center shadow-2xl min-w-0">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
        </div>
        <h3 id="contact-success-title" className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] mb-2">Message Sent!</h3>
        <p className="text-black/40 text-sm mb-6">We'll get back to you within 24 hours.</p>
        <button type="button" onClick={onClose} className="w-full sm:w-auto bg-[#CFB383] text-white px-10 py-3 rounded-xl font-medium hover:bg-[#B8A06E] transition-colors">Done</button>
      </div>
    </ModalLayer>
  );
}

export default function DashboardContactUsPage() {
  const [form, setForm] = useState({ subject: '', category: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const f = (k, v) => setForm(p => ({...p, [k]: v}));

  return (
    <>
      {success && <SuccessModal onClose={() => setSuccess(false)} />}
      <div className="w-full min-w-0 max-w-3xl pb-6">
        <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#CFB383] mb-6 sm:mb-8">Contact Support</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[['📧','Email Support','support@honeymoon.ae'],['📞','Phone','800-HONEYMOON'],['⏰','Hours','Sun–Thu 9AM–6PM'],['💬','Live Chat','Available in app']].map(([icon, label, val]) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] flex items-center gap-4">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-black/40 text-xs uppercase tracking-wider">{label}</p>
                <p className="text-[#1a1a1a] font-medium text-sm mt-0.5">{val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)]">
          <h2 className="font-baskerville text-2xl text-[#1a1a1a] mb-6">Send a Message</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => f('category', e.target.value)}
                className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                <option value="">Select category</option>
                {['Booking Issue','Payment Problem','Vendor Complaint','Account Help','General Enquiry'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input value={form.subject} onChange={e => f('subject', e.target.value)} placeholder="Brief subject"
                className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea value={form.message} onChange={e => f('message', e.target.value)} rows={5}
              placeholder="Describe your issue in detail..."
              className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none bg-[#faf8f4]" />
          </div>
          <button type="button" onClick={async () => {
          if (!form.subject || !form.message) return;
          setSaving(true);
          try {
            await UserService.contactUs(form);
            setSuccess(true);
            setForm({ name:'', email:'', phone:'', subject:'', message:'' });
          } catch(e) { alert(e?.message||'Failed to send'); }
          finally { setSaving(false); }
        }}
            className="w-full sm:w-auto bg-[#174a37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">
            Send Message
          </button>
        </div>
      </div>
    </>
  );
}
