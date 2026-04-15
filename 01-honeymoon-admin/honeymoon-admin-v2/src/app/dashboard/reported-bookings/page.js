'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { ConfirmModal, SuccessModal } from '@/components/Modals';
import ModalLayer from '@/components/ModalLayer';

const IMG1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2 = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";

const REPORTS = Array.from({length:15},(_,i) => ({
  id: i+1,
  booking: `BK${String(i+1).padStart(4,'0')}`,
  user: ['Sarah Johnson','Mohammed Al-Rashid','Priya Sharma','James Wilson'][i%4],
  vendor: ['Al Habtoor Palace','Studio Lumière','Glamour Touch','Emirates Floral'][i%4],
  reason: ['Service quality issue','No-show','Payment dispute','Cancellation without notice'][i%4],
  date: `${String((i%28)+1).padStart(2,'0')}/01/2025`,
  status: i%3===0?'Resolved':i%3===1?'Under Review':'Pending',
  img: i%2===0?IMG1:IMG2,
}));

function ViewModal({ report, onClose, onResolve }) {
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="admin-report-view-title">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[520px] relative max-h-[90vh] overflow-y-auto overscroll-y-contain">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-5">Reported Booking — Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {[
            ['Report ID',    report.id],
            ['Booking ID',   report.booking?.id ? `#${report.booking.id.slice(-8).toUpperCase()}` : report.booking || '—'],
            ['Reported By',  report.user?.firstName ? `${report.user.firstName} ${report.user.lastName}` : report.user || '—'],
            ['Vendor',       report.booking?.vendor?.companyName || report.vendor || '—'],
            ['Service',      report.booking?.service?.name || '—'],
            ['Booking Date', report.booking?.eventDate ? new Date(report.booking.eventDate).toLocaleDateString('en-AE') : '—'],
            ['Amount',       report.booking?.totalAmount ? `AED ${Number(report.booking.totalAmount).toLocaleString()}` : '—'],
            ['Report Date',  report.date || (report.createdAt ? new Date(report.createdAt).toLocaleDateString('en-AE') : '—')],
            ['Reasons',      Array.isArray(report.reasons) ? report.reasons.join(', ') : report.reason || '—'],
            ['Status',       report.status || '—'],
          ].map(([l,v]) => (
            <div key={l} className="bg-[#f9f6ef] rounded-xl p-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
              <p className="text-[#1a1a1a] font-medium text-sm mt-0.5 break-words">{v}</p>
            </div>
          ))}
        </div>
        {(report.details || report.booking?.notes) && (
          <div className="bg-[#f9f6ef] rounded-xl p-3 mb-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Details</p>
            <p className="text-[#1a1a1a] text-sm">{report.details || report.booking?.notes}</p>
          </div>
        )}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">Close</button>
          {report.status !== 'Resolved' && <button type="button" onClick={onResolve} className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">Mark Resolved</button>}
        </div>
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

export default function ReportedBookingsPage() {
  const { items: reports, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getReportedBookings, {});
  // Real data from usePaginated above
  const [viewing, setViewing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [success, setSuccess] = useState('');

  function doResolve(id) {
    setData(p => p.map(r => r.id===id ? {...r, status:'Resolved'} : r));
    setConfirm(null); setViewing(null);
    setSuccess('Report marked as resolved.');
  }

  const StatusBadge = ({s}) => {
    const m = { Resolved:'text-green-700 bg-green-100', 'Under Review':'text-amber-700 bg-amber-100', Pending:'text-red-700 bg-red-100' };
    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m[s]}`}>{s}</span>;
  };

  return (
    <div className="w-full min-w-0">
      {viewing && !confirm && <ViewModal report={viewing} onClose={() => setViewing(null)} onResolve={() => setConfirm(viewing)} />}
      {confirm && <ConfirmModal message="Mark this report as resolved?" onYes={() => doResolve(confirm.id)} onNo={() => { setConfirm(null); setViewing(viewing); }} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-5 sm:mb-6">Reported Booking Management</h1>
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0_0_0_/_0.05)] overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
          <thead><tr className="border-b border-gray-100">{['#','Booking','Reporter','Vendor','Reason','Date','Status','Action'].map(h => <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {(reportedBookings.length ? reportedBookings : []).map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-4 text-gray-400 text-xs">{r.id}</td>
                <td className="py-3.5 px-4 font-mono text-xs text-gray-600">{r.booking}</td>
                <td className="py-3.5 px-4 font-medium text-gray-800">{r.user}</td>
                <td className="py-3.5 px-4 text-gray-500">{r.vendor}</td>
                <td className="py-3.5 px-4 text-gray-500 text-xs">{r.reason}</td>
                <td className="py-3.5 px-4 text-gray-400 text-xs">{r.date}</td>
                <td className="py-3.5 px-4"><StatusBadge s={r.status} /></td>
                <td className="py-3.5 px-4">
                  <button type="button" onClick={() => setViewing(r)} className="text-xs text-[#174a37] border border-[rgba(23_74_55_/_0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <Pagination items={reports} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
