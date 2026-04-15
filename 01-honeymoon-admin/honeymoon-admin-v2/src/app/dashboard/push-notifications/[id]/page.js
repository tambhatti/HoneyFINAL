'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import Link from 'next/link';
export default function PushNotificationDetailPage({ params }) {
  const notifId = params?.id || '';
  const { data, loading } = useApi(AdminService.getPushNotification, notifId);
  const notification = data?.notification || {};
  return (
    <div className="w-full min-w-0 max-w-2xl">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 sm:mb-6 text-sm text-gray-400 min-w-0">
        <Link href="/dashboard/push-notifications" className="hover:text-[#174a37] shrink-0">Push Notifications</Link>
        <span>/</span><span className="text-gray-800">Notification Detail</span>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 min-w-0">
          <h1 className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] min-w-0">Notification Detail</h1>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium text-green-700 bg-green-100 shrink-0 self-start sm:self-auto">Sent</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[['Title','New Feature Available'],['Audience','All Users'],['Sent At','15/01/2025 10:00 AM'],['Reach','4,832 users'],['Opened','1,240 (25.7%)'],['Clicked','384 (7.9%)']].map(([l,v])=>(
            <div key={l} className="bg-[#f9f6ef] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
              <p className="text-[#1a1a1a] font-medium text-sm mt-1">{v}</p>
            </div>
          ))}
        </div>
        <div className="mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Message</p>
          <p className="text-gray-600 text-sm bg-[#f9f6ef] rounded-xl p-4 leading-6">
            We're excited to announce our latest feature update! You can now compare vendors side-by-side, set budget alerts, and invite your wedding party to collaborate on planning. Log in to explore all the new features.
          </p>
        </div>
        <Link href="/dashboard/push-notifications" className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
          ← Back to List
        </Link>
      </div>
    </div>
  );
}
