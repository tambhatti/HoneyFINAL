'use client';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';

function SuccessModal({ onClose }) {
  return (
    <ModalLayer open onClose={onClose} aria-label="Meeting requested">
      <div className="bg-white rounded-2xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-6 sm:p-10 text-center shadow-2xl min-w-0">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
        </div>
        <p className="text-[#1a1a1a] text-lg font-medium mb-2">Meeting Requested!</p>
        <p className="text-gray-400 text-sm mb-6">Your meeting request has been sent. The vendor will confirm shortly.</p>
        <button type="button" onClick={onClose} className="w-full sm:w-auto bg-[#CFB383] text-white px-10 py-3 rounded-xl hover:bg-[#B8A06E] transition-colors font-medium">Okay</button>
      </div>
    </ModalLayer>
  );
}

export default function RequestMeetingPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ vendor:'', date:'', time:'', notes:'' });
  const [success, setSuccess] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      {success && <SuccessModal onClose={() => { setSuccess(false); window.location.href='/my-bookings'; }} />}
      <LoggedInNav />
      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <h1 className="font-baskerville text-[24px] md:text-[32px] lg:text-[40px] text-[#CFB383] mb-8">Request a Meeting</h1>
        <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] min-w-0">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Vendor<span className="text-red-500">*</span></label>
            <select value={form.vendor} onChange={e=>f('vendor',e.target.value)} className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
              <option value="">Select a vendor</option>
              {['Al Habtoor Palace','Studio Lumière','Glamour Touch','Emirates Floral','Saveur Catering'].map(v=><option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date<span className="text-red-500">*</span></label>
              <input type="date" value={form.date} onChange={e=>f('date',e.target.value)} className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time<span className="text-red-500">*</span></label>
              <select value={form.time} onChange={e=>f('time',e.target.value)} className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                <option value="">Select time</option>
                {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Notes</label>
            <textarea value={form.notes} onChange={e=>f('notes',e.target.value)} rows={4} placeholder="What would you like to discuss? (venue availability, packages, pricing...)"
              className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none bg-[#faf8f4]" />
          </div>
          <button type="button" onClick={async () => {
          if (!form.vendor || !form.reason) return;
          setSaving(true);
          try {
            await UserService.requestMeeting({ vendorId: form.vendor, reason: form.reason, name: form.name, phone: form.phone, email: form.email });
            setSuccess(true);
          } catch(e) { alert(e?.message||'Failed to send request'); }
          finally { setSaving(false); }
        }}
            className="w-full bg-[#174a37] text-white py-3.5 rounded-xl font-medium hover:bg-[#1a5c45] transition-colors">
            Send Meeting Request
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
