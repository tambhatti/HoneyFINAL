'use client';
import { useApi } from '../../../../hooks/useApi';
import { VendorService } from '../../../../lib/services/vendor.service';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const TRANSITIONS = {
  Pending:           { next:'Contacted',         action:'Mark as Contacted',      color:'text-amber-600' },
  Contacted:         { next:'Meeting Scheduled', action:'Schedule Meeting',       color:'text-blue-600' },
  'Meeting Scheduled':{ next:'Converted',        action:'Mark as Converted',      color:'text-purple-600' },
  Converted:         { next:null,                action:null,                     color:'text-green-600' },
  Lost:              { next:null,                action:null,                     color:'text-red-600' },
};

function InfoRow({ label, value }) {
  return value ? (
    <div>
      <p className="text-gray-400 text-xs mb-0.5">{label}</p>
      <p className="font-medium text-gray-800 text-sm">{value}</p>
    </div>
  ) : null;
}

export default function VendorRequestDetailPage({ params }) {
  const mId = params?.id || '';
  const { data, loading, refresh } = useApi(VendorService.getMeetingRequest, mId);
  const meeting = data?.meeting || {};

  const [status,  setStatus]  = useState('Pending');
  const [modal,   setModal]   = useState(null);
  const [success, setSuccess] = useState('');
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (meeting.status) setStatus(meeting.status);
  }, [meeting.status]);

  const config = TRANSITIONS[status] || {};

  async function updateStatus(newStatus) {
    setSaving(true);
    try {
      await VendorService.updateMeetingStatus(mId, newStatus);
      setStatus(newStatus);
      setSuccess(`Status updated to ${newStatus}.`);
      refresh();
    } catch (e) { alert(e?.message || 'Failed to update status.'); }
    finally { setSaving(false); setModal(null); }
  }

  async function markLost() {
    setSaving(true);
    try {
      await VendorService.updateMeetingStatus(mId, 'Lost');
      setStatus('Lost');
      setSuccess('Meeting request marked as lost.');
      refresh();
    } catch (e) { alert(e?.message || 'Failed.'); }
    finally { setSaving(false); setModal(null); }
  }

  if (loading) return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-100 rounded"/>
        <div className="h-4 w-32 bg-gray-100 rounded"/>
        <div className="h-4 w-full bg-gray-100 rounded"/>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl w-full min-w-0">
      {modal === 'advance' && <ConfirmModal message={`Update status to "${config.next}"?`} onYes={() => updateStatus(config.next)} onNo={() => setModal(null)} />}
      {modal === 'lost'    && <ConfirmModal message="Mark this meeting request as Lost?" onYes={markLost} onNo={() => setModal(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/meeting-requests" className="text-gray-400 hover:text-gray-600 text-lg shrink-0">←</Link>
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">Meeting Request</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-sm">
            <div><p className="text-gray-400 text-xs">Request ID</p><p className="font-medium">#{(meeting.id||mId).slice(-8).toUpperCase()}</p></div>
            <div><p className="text-gray-400 text-xs">Submitted</p><p className="font-medium">{meeting.createdAt ? new Date(meeting.createdAt).toLocaleDateString('en-AE',{dateStyle:'medium'}) : '—'}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Status:</span>
            <span className={`text-sm font-semibold ${config.color || 'text-gray-600'}`}>{status}</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1a1a] text-sm uppercase tracking-wide text-gray-400 mb-4">Contact Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Full Name"     value={meeting.name || `${meeting.user?.firstName||''} ${meeting.user?.lastName||''}`.trim() || '—'} />
            <InfoRow label="Phone Number"  value={meeting.phone || meeting.user?.phone || '—'} />
            <InfoRow label="Email Address" value={meeting.email || meeting.user?.email || '—'} />
            <InfoRow label="Preferred Date" value={meeting.preferredDate ? new Date(meeting.preferredDate).toLocaleDateString('en-AE',{dateStyle:'full'}) : '—'} />
          </div>
        </div>

        {/* Message */}
        {(meeting.reason || meeting.message) && (
          <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Message</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{meeting.reason || meeting.message}</p>
          </div>
        )}

        {/* Actions */}
        {status !== 'Converted' && status !== 'Lost' && (
          <div className="px-5 sm:px-6 py-5 flex flex-col gap-3 sm:flex-row">
            {config.action && (
              <button type="button" onClick={() => setModal('advance')} disabled={saving}
                className="flex-1 bg-[#174a37] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60">
                {saving ? 'Updating…' : config.action}
              </button>
            )}
            <button type="button" onClick={() => setModal('lost')} disabled={saving}
              className="flex-1 border border-red-200 text-red-500 bg-red-50 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-60">
              Mark as Lost
            </button>
          </div>
        )}

        {(status === 'Converted' || status === 'Lost') && (
          <div className={`px-5 sm:px-6 py-4 text-center text-sm font-medium ${status === 'Converted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {status === 'Converted' ? '✓ Successfully converted to booking' : '✗ Marked as lost'}
          </div>
        )}
      </div>
    </div>
  );
}
