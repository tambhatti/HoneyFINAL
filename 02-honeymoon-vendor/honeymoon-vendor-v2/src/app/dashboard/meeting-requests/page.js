'use client';
import { usePaginated } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const MEETINGS = Array.from({length:12},(_,i)=>({
  id:String(i+1).padStart(2,'0'),
  meetingId:'#12345678',
  user:'',
  date:'mm/dd/yyyy',
  time:`${10+(i%8)}:00 ${i%2===0?'AM':'PM'}`,
  status:i%3===0?'Pending':i%3===1?'Confirmed':'Cancelled',
}));

const statusColor = { Pending:'text-amber-600', Confirmed:'text-green-600', Cancelled:'text-red-600' };


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

export default function VendorMeetingRequestsPage(){
  const { items: meetings, loading, refresh, total, hasMore, nextPage} = usePaginated(VendorService.getMeetingRequests, {});
  // Use real API data from usePaginated
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');
  const [show,setShow]=useState('5');
  const [search,setSearch]=useState('');

  const filtered=data.filter(m=>m.meetingId.includes(search)||m.user.toLowerCase().includes(search.toLowerCase()));

  function doAccept(){
    setData(p=>p.map(m=>m.id===modal.id?{...m,status:'Confirmed'}:m));
    setModal(null); setSuccess('Meeting request confirmed.');
  }
  function doDecline(){
    setData(p=>p.map(m=>m.id===modal.id?{...m,status:'Cancelled'}:m));
    setModal(null); setSuccess('Meeting request declined.');
  }

  return (
    <div className="w-full min-w-0">
      {modal?.type==='accept'&&<ConfirmModal title="Confirm Meeting" message="Confirm this meeting request?" onYes={doAccept} onNo={()=>setModal(null)}/>}
      {modal?.type==='decline'&&<ConfirmModal title="Decline Meeting" message="Decline this meeting request?" onYes={doDecline} onNo={()=>setModal(null)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Meeting Request</h1>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select value={show} onChange={e=>setShow(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
              <option>5</option><option>10</option>
            </select>
          </div>
          <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-56 bg-[#faf8f4]">
            <span className="text-gray-400">🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              className="bg-transparent text-sm outline-none flex-1"/>
          </div>
        </div>

        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Sr. No.','Meeting ID','User Name','Meeting Date','Meeting Time','Status','Action'].map(h=>(
                <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0,parseInt(show)).map(m=>(
              <tr key={m.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 text-gray-400 text-xs">{m.id}</td>
                <td className="py-3.5 px-3 font-mono text-xs text-gray-600">{m.meetingId}</td>
                <td className="py-3.5 px-3 text-gray-700">{m.user}</td>
                <td className="py-3.5 px-3 text-gray-500">{m.date}</td>
                <td className="py-3.5 px-3 text-gray-500">{m.time}</td>
                <td className="py-3.5 px-3">
                  <span className={`text-xs font-medium ${statusColor[m.status]}`}>{m.status}</span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex gap-1.5">
                    {m.status==='Pending'&&<>
                      <button onClick={()=>setModal({type:'accept',...m})} className="text-xs text-green-600 border border-green-200 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">Accept</button>
                      <button onClick={()=>setModal({type:'decline',...m})} className="text-xs text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">Decline</button>
                    </>}
                    {m.status!=='Pending'&&<span className="text-xs text-gray-400 px-3 py-1.5">{m.status}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing 1 to {Math.min(parseInt(show),filtered.length)} of {filtered.length} entries</p>
          <div className="flex items-center gap-2">
            <button disabled className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#F5F5EF] transition-colors text-gray-500 opacity-50 cursor-not-allowed">Previous</button>
            {[1,2,3].map(p=><button key={p} className={`w-9 h-9 rounded-xl text-sm ${p===1?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#F5F5EF]'} transition-colors`}>{p}</button>)}
            <span className="text-gray-400">|</span>
            <button onClick={nextPage} disabled={!hasMore || loading} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#F5F5EF] transition-colors text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
      <Pagination items={meetings} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
