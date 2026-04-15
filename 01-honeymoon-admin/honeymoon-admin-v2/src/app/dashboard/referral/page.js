'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';
import ModalLayer from '@/components/ModalLayer';

function EditReferralModal({ config, onClose, onSave }) {
  const [form, setForm] = useState({ ...config });
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="admin-referral-edit-title">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[480px] relative max-h-[90vh] overflow-y-auto overscroll-y-contain">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <h3 id="admin-referral-edit-title" className="font-baskerville text-2xl text-[#CFB383] mb-6">Edit Referral Settings</h3>
        {[['Referrer Reward (AED)','referrerReward'],['Referee Reward (AED)','refereeReward'],['Max Referrals/User','maxReferrals'],['Expiry Days','expiryDays']].map(([label,key]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input type="number" value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
          </div>
        ))}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium">Cancel</button>
          <button type="button" onClick={async () => {
            try { await AdminService.updateReferralConfig(form); onSave(form); }
            catch(e) { alert(e?.message || 'Failed to save'); }
          }} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Save</button>
        </div>
      </div>
    </ModalLayer>
  );
}

const REFERRALS = Array.from({length:12},(_,i) => ({
  id:i+1, referrer:['Sarah J.','Mohammed A.','Priya S.','James W.'][i%4],
  referee:['Tom B.','Lisa K.','Ahmed M.','Emma C.'][i%4],
  date:`${String((i%28)+1).padStart(2,'0')}/01/2025`,
  status:i%3===0?'Pending':i%3===1?'Completed':'Expired',
  reward:`AED ${i%3===1?'100':'0'}`,
}));

export default function ReferralPage() {
  const { data, loading, refresh } = useApi(AdminService.getReferralConfig);
  const { data: logsData } = useApi(AdminService.getLoyaltyLogs);
  const config = data?.config || {};
  const [savedConfig, setSavedConfig] = useState(null);
  const displayConfig = { ...config, ...savedConfig };
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');

  return (
    <div className="w-full min-w-0">
      {editing && <EditReferralModal config={displayConfig} onClose={() => setEditing(false)} onSave={c => { setSavedConfig(c); setEditing(false); setSuccess('Referral settings updated.'); refresh(); }} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-5 sm:mb-6">Referral Program Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Total Referrals', String(logsData?.total ?? '—')],
          ['Successful',      String(logsData?.successful ?? '—')],
          ['Pending',         String(logsData?.pending ?? '—')],
          ['Rewards Paid',    logsData?.totalRewards ? `AED ${Number(logsData.totalRewards).toLocaleString()}` : '—'],
        ].map(([l,v]) => (
          <div key={l} className="bg-white rounded-2xl p-5 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
            <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
            <p className="font-baskerville text-2xl text-[#1a1a1a] mt-1">{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 min-w-0">
          <h2 className="font-baskerville text-lg sm:text-xl text-[#1a1a1a] min-w-0">Program Configuration</h2>
          <button type="button" onClick={() => setEditing(true)} className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors self-start sm:self-auto shrink-0">Edit Settings</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[['Referrer Reward',`AED ${displayConfig.referrerReward ?? '—'}`],['Referee Reward',`AED ${displayConfig.refereeReward ?? '—'}`],['Max Referrals',displayConfig.maxReferrals ?? '—'],['Expiry',`${displayConfig.expiryDays ?? '—'} days`]].map(([l,v]) => (
            <div key={l} className="bg-[#f9f6ef] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
              <p className="font-baskerville text-xl text-[#174a37] mt-1">{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0_0_0_/_0.05)] overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100"><h2 className="font-baskerville text-lg sm:text-xl text-[#1a1a1a]">Referral History</h2></div>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
          <thead><tr className="border-b border-gray-100">{['#','Referrer','Referee','Date','Status','Reward'].map(h => <th key={h} className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {(logsData?.logs || logsData?.referrals || []).map((r, i) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-[#fafaf8]">
                <td className="py-3 px-5 text-gray-400 text-xs">{r.id}</td>
                <td className="py-3 px-5 font-medium text-gray-800">{r.referrer?.firstName ? `${r.referrer.firstName} ${r.referrer.lastName}` : r.referrer || '—'}</td>
                <td className="py-3 px-5 text-gray-500">{r.referee?.firstName ? `${r.referee.firstName} ${r.referee.lastName}` : r.referee || '—'}</td>
                <td className="py-3 px-5 text-gray-400 text-xs">{r.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-AE') : '—')}</td>
                <td className="py-3 px-5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${r.status==='Completed'?'text-green-700 bg-green-100':r.status==='Pending'?'text-amber-700 bg-amber-100':'text-gray-500 bg-gray-100'}`}>{r.status}</span></td>
                <td className="py-3 px-5 font-medium text-[#174a37]">{r.reward ? `AED ${r.reward}` : r.rewardAmount ? `AED ${r.rewardAmount}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
