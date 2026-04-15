'use client';
import VendorService from '../../../lib/services/vendor.service';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';

export default function VendorContactUsPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ subject:'', message:'' });
  const [success, setSuccess] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div className="max-w-2xl">
      {success && <SuccessModal message="Your message has been sent successfully. We'll get back to you soon." onOk={() => setSuccess(false)} />}

      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Contact Us</h1>

      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            ['📧','Email','support@honeymoon.ae'],
            ['📞','Phone','+971 4 123 4567'],
            ['📍','Address','Dubai, UAE'],
          ].map(([icon, label, value]) => (
            <div key={label} className="bg-[#f9f6ef] rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-gray-700 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Subject<span className="text-red-500">*</span></label>
            <input value={form.subject} onChange={e=>f('subject',e.target.value)} placeholder="What can we help you with?"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Message<span className="text-red-500">*</span></label>
            <textarea value={form.message} onChange={e=>f('message',e.target.value)} rows={6} placeholder="Describe your issue or question in detail..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/>
          </div>
        </div>

        <button onClick={async () => {
          if (!form.subject || !form.message) return;
          setSaving(true);
          try {
            await VendorService.contactUs(form);
            setSuccess(true);
            setForm({ name:'', email:'', phone:'', subject:'', message:'' });
          } catch(e) { alert(e?.message||'Failed to send'); }
          finally { setSaving(false); }
        }}
          className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-medium hover:bg-[#1a5c45] transition-colors mt-6 flex items-center justify-center gap-2">
          Send Message ↗
        </button>
      </div>
    </div>
  );
}
