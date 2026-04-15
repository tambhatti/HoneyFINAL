'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';

const LOGS = Array.from({length:10},(_,i)=>({
  id:String(i+1).padStart(2,'0'), star4:100, star5:100, date:'07/05/2022'
}));


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

export default function RatingProgramManagementPage(){
  const { items: reviews, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getRatings, {});
  const [form,setForm]=useState({star4:'',star5:''});
  const [success,setSuccess]=useState('');

  return (
    <div className="w-full min-w-0">
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Rating Program Management</h1>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] mb-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. Of Points On 4 Star<span className="text-red-500">*</span>
            </label>
            <input value={form.star4} onChange={e=>setForm(p=>({...p,star4:e.target.value}))}
              placeholder="Enter No. Of Points On 4 Star"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. Of Points On 5 Star<span className="text-red-500">*</span>
            </label>
            <input value={form.star5} onChange={e=>setForm(p=>({...p,star5:e.target.value}))}
              placeholder="Enter No. Of Points On 5 Star"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
          <button
            onClick={()=>form.star4&&form.star5&&setSuccess('Rating program updated successfully.')}
            className="bg-[#174a37] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">
            Update ↗
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0_0_0_/_0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-baskerville text-xl text-[#1a1a1a]">Rating Program Logs</h2>
        </div>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['S. No','No. Of Points On 4 Star','No. Of Points On 5 Star','Update Date'].map(h=>(
                <th key={h} className="text-left py-3 px-5 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(reviews.length ? reviews : LOGS).map(l=>(
              <tr key={l.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-5 text-gray-400 text-xs">{l.id}</td>
                <td className="py-3.5 px-5 text-gray-700">{l.star4}</td>
                <td className="py-3.5 px-5 text-gray-700">{l.star5}</td>
                <td className="py-3.5 px-5 text-gray-400 text-xs">{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing 1 to 8 of 52 entries</p>
          <div className="flex gap-2">
            <button disabled className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-[#F5F5EF] opacity-50 cursor-not-allowed">Previous</button>
            {[1,2,3].map(p=><button key={p} className={`w-9 h-9 rounded-xl text-sm ${p===1?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#F5F5EF]'}`}>{p}</button>)}
            <span className="text-gray-400 self-center">|</span>
            <button disabled className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-[#F5F5EF] opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
      <Pagination items={reviews} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
