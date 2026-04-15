'use client';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

export default function NewPushNotificationPage() {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ title:'', message:'', audience:'All Users', schedule:'now', scheduleDate:'', scheduletime:'' });
  const [confirm, setConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <div className="w-full min-w-0 max-w-2xl">
      {confirm && <ConfirmModal message="Send this push notification to selected users?" onYes={async () => {
          setConfirm(false);
          try { await AdminService.sendPushNotification({ title: form.title, message: form.message, audience: form.audience||'all' }); setSuccess(true); }
          catch(e) { alert(e?.message||'Failed to send notification'); }
        }} onNo={() => setConfirm(false)} />}
      {success && <SuccessModal message="Push notification sent successfully." onOk={() => window.location.href='/dashboard/push-notifications'} />}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 sm:mb-6 text-sm text-gray-400 min-w-0">
        <Link href="/dashboard/push-notifications" className="hover:text-[#174a37] shrink-0">Push Notifications</Link>
        <span>/</span><span className="text-gray-800">New Notification</span>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
        <h1 className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] mb-6">Create Push Notification</h1>
        <div className="flex flex-col gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title<span className="text-red-500">*</span></label>
            <input value={form.title} onChange={e=>f('title',e.target.value)} placeholder="Notification title" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Message<span className="text-red-500">*</span></label>
            <textarea value={form.message} onChange={e=>f('message',e.target.value)} rows={4} placeholder="Notification message..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <select value={form.audience} onChange={e=>f('audience',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
              {['All Users','Vendors Only','Customers Only','Premium Users','New Users (Last 30 days)'].map(a => <option key={a}>{a}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
              {['now','later'].map(s => <label key={s} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="radio" name="schedule" value={s} checked={form.schedule===s} onChange={e=>f('schedule',e.target.value)} className="accent-[#174a37]" />{s==='now'?'Send Now':'Schedule for Later'}</label>)}
            </div>
            {form.schedule==='later' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <input type="date" value={form.scheduleDate} onChange={e=>f('scheduleDate',e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
              <input type="time" value={form.scheduletime} onChange={e=>f('scheduletime',e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
            </div>}
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <Link href="/dashboard/push-notifications" className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-center flex items-center justify-center">Cancel</Link>
          <button type="button" onClick={() => form.title && form.message && setConfirm(true)} className="flex-1 bg-[#CFB383] text-white py-3 rounded-full font-medium hover:bg-[#B8A06E] transition-colors">Send Notification</button>
        </div>
      </div>
    </div>
  );
}
