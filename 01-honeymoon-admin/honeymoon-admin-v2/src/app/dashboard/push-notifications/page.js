'use client';
import api from '../../../lib/api';
mport { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const NOTIFS = Array.from({length:12},(_,i) => ({
  id:i+1, title:['New Feature Available','Booking Reminder','Special Offer','System Update','Welcome Bonus','Weekend Deals'][i%6],
  message:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Notifications sent to all active users.',
  audience:['All Users','Vendors','Premium Users','New Users'][i%4], sentAt:`${String((i%28)+1).padStart(2,'0')}/01/2025 ${10+i%12}:00`,
  status:i%4===0?'Draft':'Sent', sent:i%4===0?0:Math.floor(Math.random()*5000)+500,
}));

export default function PushNotificationsPage() {
  const { data, loading, refresh } = useApi(AdminService.getPushNotifications);
  const notifications = data?.notifications || [];
  // Real data from useApi above — using apiData.notifications
  const [confirm, setConfirm] = useState(null);
  const [success, setSuccess] = useState('');

  async function doDelete() {
    try { await api.del(`/admin/push-notifications/${confirm.id}`); refresh(); } catch(e) { console.error(e); }
    setConfirm(null); setSuccess('Notification deleted.');
  }

  return (
    <div>
      {confirm && <ConfirmModal message="Are you sure you want to delete this notification?" onYes={doDelete} onNo={() => setConfirm(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Push Notification Management</h1>
        <Link href="/dashboard/push-notifications/new" className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors">+ New Notification</Link>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0_0_0_/_0.05)] overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
          <thead><tr className="border-b border-gray-100">{['#','Title','Audience','Sent At','Reach','Status','Actions'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {notifications.map(n => (
              <tr key={n.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-4 text-gray-400 text-xs">{n.id}</td>
                <td className="py-3.5 px-4 font-medium text-gray-800">{n.title}</td>
                <td className="py-3.5 px-4 text-gray-500 text-xs">{n.audience}</td>
                <td className="py-3.5 px-4 text-gray-400 text-xs">{n.sentAt}</td>
                <td className="py-3.5 px-4 text-gray-600">{n.sent > 0 ? n.sent.toLocaleString() : '—'}</td>
                <td className="py-3.5 px-4"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${n.status==='Sent'?'text-green-700 bg-green-100':'text-amber-700 bg-amber-100'}`}>{n.status}</span></td>
                <td className="py-3.5 px-4">
                  <div className="flex gap-1.5">
                    <Link href={`/dashboard/push-notifications/${n.id}`} className="text-xs text-[#174a37] border border-[rgba(23_74_55_/_0.3)] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors">View</Link>
                    <button onClick={() => setConfirm(n)} className="text-xs text-red-500 border border-red-200 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
