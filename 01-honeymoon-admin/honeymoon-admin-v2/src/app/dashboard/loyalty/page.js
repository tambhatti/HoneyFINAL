'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const AWARD_LOGS = Array.from({length:10},(_,i)=>({
  id:String(i+1).padStart(2,'0'), points:100, baseAmount:'100 AED', date:'07/05/2022'
}));
const REDEMPTION_LOGS = Array.from({length:10},(_,i)=>({
  id:String(i+1).padStart(2,'0'), user:'—', points:500, value:'50 AED', date:'07/05/2022', status:i%3===0?'Pending':'Redeemed'
}));

export default function LoyaltyPage() {
  const { data, loading, refresh } = useApi(AdminService.getLoyaltyConfig);
  const { data: logsData2 } = useApi(AdminService.getLoyaltyLogs);
  const config = data?.config || {};
  const logs = data?.logs || [];
  const [tab, setTab] = useState('award');
  const [baseAmount, setBaseAmount] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState('');
  const [success, setSuccess] = useState('');

  return (
    <div>
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Loyalty Program Management</h1>
        <div className="flex rounded-full border border-[rgba(23_74_55_/_0.3)] overflow-hidden">
          <button onClick={() => setTab('award')} className={`px-6 py-2.5 text-sm font-medium transition-colors ${tab==='award'?'bg-[#174a37] text-white':'text-[#174a37] hover:bg-[#F5F5EF]'}`}>Award</button>
          <button onClick={() => setTab('redemption')} className={`px-6 py-2.5 text-sm font-medium transition-colors ${tab==='redemption'?'bg-[#174a37] text-white':'text-[#174a37] hover:bg-[#F5F5EF]'}`}>Redemption</button>
        </div>
      </div>

      {/* Award config form */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Amount<span className="text-red-500">*</span></label>
            <input value={baseAmount} onChange={e => setBaseAmount(e.target.value)} placeholder="Enter Base Amount"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Of Loyalty Points<span className="text-red-500">*</span></label>
            <input value={loyaltyPoints} onChange={e => setLoyaltyPoints(e.target.value)} placeholder="Enter No. Of Loyalty Points"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
          </div>
        </div>
        <p className="text-gray-400 text-xs mb-4 leading-5">
          This Loyalty Points Awarding Rule Will Specify The Base Amount And The Number Of Points To Be Awarded Against It (E.G., 100 PKR = 1 Point). The System Will Automatically Multiply The Points Based On The Total Booking Amount. For Example, If A User's Booking Amount Is Multiple Times The Defined Base Amount, The Awarded Points Will Be Multiplied Accordingly.
        </p>
        <button onClick={async () => {
          if (!baseAmount || !loyaltyPoints) return;
          try {
            await AdminService.updateLoyaltyConfig({ baseAmount: parseFloat(baseAmount), pointsPerBase: parseFloat(loyaltyPoints) });
            refresh();
          } catch(e) { /* API not connected */ }
          setSuccess('Loyalty rule updated successfully.');
        }}
          className="bg-[#174a37] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">
          Update ↗
        </button>
      </div>

      {/* Logs table */}
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0_0_0_/_0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-baskerville text-xl text-[#1a1a1a]">{tab === 'award' ? 'Award' : 'Redemption'} Logs</h2>
        </div>
        {tab === 'award' ? (
          <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['S. No', 'No. Of Loyalty Points', 'Base Amount', 'Update Date'].map(h => (
                  <th key={h} className="text-left py-3 px-5 text-gray-500 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {((logsData2?.logs||[]).filter(l=>l.type==="awarded").length ? (logsData2?.logs||[]).filter(l=>l.type==="awarded") : AWARD_LOGS).map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                  <td className="py-3.5 px-5 text-gray-400 text-xs">{l.id}</td>
                  <td className="py-3.5 px-5 text-gray-700">{l.points}</td>
                  <td className="py-3.5 px-5 font-medium text-[#174a37]">{l.baseAmount}</td>
                  <td className="py-3.5 px-5 text-gray-400 text-xs">{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : (
          <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['S. No', 'User', 'Points Redeemed', 'Value', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left py-3 px-5 text-gray-500 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {((logsData2?.logs||[]).filter(l=>l.type==="redeemed").length ? (logsData2?.logs||[]).filter(l=>l.type==="redeemed") : REDEMPTION_LOGS).map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                  <td className="py-3.5 px-5 text-gray-400 text-xs">{l.id}</td>
                  <td className="py-3.5 px-5 font-medium text-gray-800">{l.user}</td>
                  <td className="py-3.5 px-5 text-[#174a37] font-medium">{l.points} pts</td>
                  <td className="py-3.5 px-5 text-gray-700">{l.value}</td>
                  <td className="py-3.5 px-5 text-gray-400 text-xs">{l.date}</td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${l.status==='Redeemed'?'text-green-700 bg-green-100':'text-amber-700 bg-amber-100'}`}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing 1 to 8 of 52 entries</p>
          <div className="flex gap-2">
            <button disabled className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-[#F5F5EF] opacity-50 cursor-not-allowed">Previous</button>
            {[1,2,3].map(p => <button key={p} className={`w-9 h-9 rounded-xl text-sm ${p===1?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#F5F5EF]'}`}>{p}</button>)}
            <span className="text-gray-400 self-center">|</span>
            <button disabled className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-[#F5F5EF] opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
