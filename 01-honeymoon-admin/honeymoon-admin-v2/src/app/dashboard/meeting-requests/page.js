'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';

const MEETINGS = Array.from({length:20},(_,i)=>({
  id:String(i+1).padStart(2,'0'), requestId:'#12345678',
  user:'—', company:'—', date:'mm/dd/yyyy',
  status:['Pending','Contacted','Meeting Scheduled','Lost','Converted'][i%5],
}));
const statusColor={Pending:'text-amber-600',Contacted:'text-blue-600','Meeting Scheduled':'text-purple-600',Lost:'text-red-600',Converted:'text-green-600'};


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

export default function AdminMeetingRequestsPage(){
  const { items: meetings, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getMeetingRequests, {});
  const [show,setShow]=useState('5');
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);
  const filtered=MEETINGS.filter(m=>m.requestId.includes(search)||m.user.toLowerCase().includes(search.toLowerCase()));
  const perPage=parseInt(show);
  const paged=filtered.slice((page-1)*perPage,page*perPage);
  const totalPages=Math.ceil(filtered.length/perPage);

  return (
    <div className="w-full min-w-0">
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Meeting Request</h1>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select value={show} onChange={e=>setShow(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
              <option>5</option><option>10</option>
            </select>
          </div>
          <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-56 bg-[#faf8f4]">
            <span className="text-gray-400">🔍</span>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search..." className="bg-transparent text-sm outline-none flex-1"/>
          </div>
        </div>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Sr. No.','Request ID','User','Company','Request Date','Status','Action'].map(h=>(
                <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(m=>(
              <tr key={m.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 text-gray-400 text-xs">{m.id}</td>
                <td className="py-3.5 px-3 font-mono text-xs text-gray-600">{m.requestId}</td>
                <td className="py-3.5 px-3 text-gray-700">{m.user}</td>
                <td className="py-3.5 px-3 text-gray-500">{m.company}</td>
                <td className="py-3.5 px-3 text-gray-500">{m.date}</td>
                <td className="py-3.5 px-3"><span className={`text-xs font-medium ${statusColor[m.status]}`}>{m.status}</span></td>
                <td className="py-3.5 px-3">
                  <Link href={`/dashboard/meeting-requests/${m.id}`} className="text-xs text-[#174a37] border border-[rgba(23_74_55_/_0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing {(page-1)*perPage+1} to {Math.min(page*perPage,filtered.length)} of {filtered.length} entries</p>
          <div className="flex items-center gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#F5F5EF] disabled:opacity-40 transition-colors">Previous</button>
            {Array.from({length:Math.min(3,totalPages)},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium ${page===p?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#F5F5EF]'} transition-colors`}>{p}</button>
            ))}
            <span className="text-gray-400">|</span>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#F5F5EF] disabled:opacity-40 transition-colors">Next</button>
          </div>
        </div>
      </div>
      <Pagination items={meetings} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
