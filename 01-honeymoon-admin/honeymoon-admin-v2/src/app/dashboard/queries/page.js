'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';
import ModalLayer from '@/components/ModalLayer';

const QUERIES = Array.from({length:18},(_,i) => ({
  id:i+1, name:['Sarah Johnson','Mohammed Al-Rashid','Priya Sharma','James Wilson','Fatima Al-Hassan'][i%5],
  email:`user${i+1}@example.com`, subject:['Booking cancellation','Vendor not responding','Payment issue','Account access problem','Service quality complaint','Refund request'][i%6],
  date:`${String((i%28)+1).padStart(2,'0')}/01/2025`, status:i%3===0?'Resolved':i%3===1?'In Progress':'Open',
  message:'Hello, I am reaching out regarding an issue with my recent booking. The vendor did not respond to my messages for over a week, and I need assistance resolving this matter as my wedding date is approaching.',
}));

function ViewQueryModal({ query, onClose, onReply, onResolve }) {
  const [reply, setReply] = useState('');
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="admin-query-view-title">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[580px] relative max-h-[90vh] overflow-y-auto overscroll-y-contain">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5 min-w-0">
          <h3 id="admin-query-view-title" className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] min-w-0">Query #{query.id}</h3>
          <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 self-start sm:self-auto ${query.status==='Resolved'?'text-green-700 bg-green-100':query.status==='In Progress'?'text-amber-700 bg-amber-100':'text-blue-700 bg-blue-100'}`}>{query.status}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {[['From',query.name],['Email',query.email],['Subject',query.subject],['Date',query.date]].map(([l,v]) => (
            <div key={l} className="bg-[#f9f6ef] rounded-xl p-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
              <p className="text-[#1a1a1a] font-medium text-sm mt-0.5 truncate">{v}</p>
            </div>
          ))}
        </div>
        <div className="mb-5">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Message</p>
          <p className="text-gray-600 text-sm bg-[#f9f6ef] rounded-xl p-4 leading-6">{query.message}</p>
        </div>
        {query.status !== 'Resolved' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reply</label>
              <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={3} placeholder="Type your reply..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none bg-[#faf8f4]" />
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button type="button" onClick={onResolve} className="flex-1 bg-green-50 text-green-600 border border-green-200 py-3 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">Mark Resolved</button>
              <button type="button" onClick={() => onReply(reply)} className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">Send Reply</button>
            </div>
          </>
        )}
        {query.status === 'Resolved' && (
          <button type="button" onClick={onClose} className="w-full border border-gray-200 text-gray-500 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">Close</button>
        )}
      </div>
    </ModalLayer>
  );
}


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button type="button" onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-lg hover:bg-[#1a5c45] transition-colors disabled:opacity-50 w-full sm:w-auto">
          {loading ? 'Loading...' : 'Load More ↓'}
        </button>
      )}
    </div>
  );
}

export default function QueriesPage() {
  const { items: queries, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getQueries, {});
  const [data, setData] = useState(QUERIES);
  const [viewing, setViewing] = useState(null);
  const [success, setSuccess] = useState('');

  function handleReply(reply) {
    setData(p => p.map(q => q.id===viewing.id ? {...q, status:'In Progress'} : q));
    setViewing(null); setSuccess('Reply sent successfully.');
  }
  function handleResolve() {
    setData(p => p.map(q => q.id===viewing.id ? {...q, status:'Resolved'} : q));
    setViewing(null); setSuccess('Query marked as resolved.');
  }

  const StatusBadge = ({s}) => {
    const m = {Resolved:'text-green-700 bg-green-100','In Progress':'text-amber-700 bg-amber-100',Open:'text-blue-700 bg-blue-100'};
    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m[s]}`}>{s}</span>;
  };

  return (
    <div className="w-full min-w-0">
      {viewing && <ViewQueryModal query={viewing} onClose={() => setViewing(null)} onReply={handleReply} onResolve={handleResolve} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-5 sm:mb-6">Queries</h1>
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0_0_0_/_0.05)] overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
          <thead><tr className="border-b border-gray-100">{['#','Name','Email','Subject','Date','Status','Action'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {data.map(q => (
              <tr key={q.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-4 text-gray-400 text-xs">{q.id}</td>
                <td className="py-3.5 px-4 font-medium text-gray-800">{q.name}</td>
                <td className="py-3.5 px-4 text-gray-500 text-xs">{q.email}</td>
                <td className="py-3.5 px-4 text-gray-600 text-xs">{q.subject}</td>
                <td className="py-3.5 px-4 text-gray-400 text-xs">{q.date}</td>
                <td className="py-3.5 px-4"><StatusBadge s={q.status} /></td>
                <td className="py-3.5 px-4">
                  <button type="button" onClick={() => setViewing(q)} className="text-xs text-[#174a37] border border-[rgba(23_74_55_/_0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <Pagination items={queries} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
