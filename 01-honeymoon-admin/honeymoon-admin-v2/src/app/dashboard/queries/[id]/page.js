'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';
const AVATAR = "https://ui-avatars.com/api/?name=User&background=174a37&color=CFB383&size=200";
export default function QueryDetailPage({ params }) {
  const queryId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getQuery, queryId);
  const query = data?.query || {};
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState('Open');
  const [success, setSuccess] = useState('');
  function sendReply() { if(reply) { setStatus('In Progress'); setSuccess('Reply sent successfully.'); setReply(''); } }
  function resolve() { setStatus('Resolved'); setSuccess('Query marked as resolved.'); }
  return (
    <div className="w-full min-w-0 max-w-2xl">
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 sm:mb-6 text-sm text-gray-400 min-w-0">
        <Link href="/dashboard/queries" className="hover:text-[#174a37] shrink-0">Queries</Link>
        <span>/</span><span className="text-gray-800 truncate min-w-0">Query #{params.id}</span>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 min-w-0">
          <h1 className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] min-w-0">Query Details</h1>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium shrink-0 self-start sm:self-auto ${status==='Resolved'?'text-green-700 bg-green-100':status==='In Progress'?'text-amber-700 bg-amber-100':'text-blue-700 bg-blue-100'}`}>{status}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5 pb-5 border-b border-gray-100 min-w-0">
          <div className="w-12 h-12 rounded-full overflow-hidden"><img src={AVATAR} alt="" className="w-full h-full object-cover"/></div>
          <div>
            <p className="font-medium text-gray-800">Sarah Johnson</p>
            <p className="text-gray-400 text-sm">sarah@example.com · Jan 15, 2025</p>
          </div>
        </div>
        <div className="mb-5">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Subject</p>
          <p className="font-medium text-gray-800">Booking cancellation - BK0042</p>
        </div>
        <div className="mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Message</p>
          <p className="text-gray-600 text-sm bg-[#f9f6ef] rounded-xl p-4 leading-6">
            Hello, I need assistance with cancelling my booking. The venue has changed their availability and can no longer accommodate my event date. I would like to request a full refund as per the cancellation policy.
          </p>
        </div>
        {status !== 'Resolved' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4} placeholder="Type your reply..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none bg-[#faf8f4]" />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button type="button" onClick={resolve} className="flex-1 bg-green-50 text-green-600 border border-green-200 py-3 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">Mark Resolved</button>
              <button type="button" onClick={sendReply} className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">Send Reply</button>
            </div>
          </>
        )}
        {status === 'Resolved' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-600 text-sm font-medium">✓ This query has been resolved</p>
          </div>
        )}
      </div>
    </div>
  );
}
