'use client';
import { usePaginated } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal, ApproveVendorModal, RejectVendorModal } from '@/components/Modals';

const REQUESTS = Array.from({length:15},(_,i)=>({
  id:String(i+1).padStart(2,'0'), name:['Abc','Xyz'][i%2], company:['—','—'][i%2],
  email:'abc@example.com', date:'01/12/2025',
  type:i%2===0?'New Account':'Update Request',
  status:'Pending',
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

export default function VendorRequestsPage(){
  const { items: requests, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getVendorRequests, {});
  const [data,setData]=useState(REQUESTS);
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');

  function doApprove(){
    setData(p=>p.filter(v=>v.id!==modal.vendor.id));
    setModal(null);setSuccess('Vendor request approved successfully.');
  }
  function doReject(){
    setData(p=>p.filter(v=>v.id!==modal.vendor.id));
    setModal(null);setSuccess('Vendor request rejected.');
  }

  return (
    <div className="w-full min-w-0">
      {modal?.type==='approve'&&<ApproveVendorModal vendor={modal.vendor} onYes={doApprove} onNo={()=>setModal(null)}/>}
      {modal?.type==='reject'&&<RejectVendorModal onYes={doReject} onNo={()=>setModal(null)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/vendors" className="text-[#CFB383] hover:underline text-sm">Vendor Management</Link>
        <span className="text-gray-400">/</span>
        <h1 className="font-baskerville text-2xl text-[#1a1a1a]">Vendor Requests</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0 min-w-0"><table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID','User Name','Company','Email','Date','Type','Action'].map(h=>(
                <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(v=>(
              <tr key={v.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 text-gray-600">{v.id}</td>
                <td className="py-3.5 px-3 font-medium text-gray-800">{v.name}</td>
                <td className="py-3.5 px-3 text-gray-600">{v.company}</td>
                <td className="py-3.5 px-3 text-gray-500">{v.email}</td>
                <td className="py-3.5 px-3 text-gray-500">{v.date}</td>
                <td className="py-3.5 px-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${v.type==='New Account'?'text-blue-700 bg-blue-100':'text-purple-700 bg-purple-100'}`}>{v.type}</span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex gap-1.5">
                    <Link href={`/dashboard/vendors/${v.id}`} className="text-xs text-[#174a37] border border-[rgba(23_74_55_/_0.3)] px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors">View</Link>
                    <button onClick={()=>setModal({type:'approve',vendor:v})} className="text-xs text-green-600 border border-green-200 bg-green-50 px-2.5 py-1.5 rounded-lg hover:bg-green-100 transition-colors">Approve</button>
                    <button onClick={()=>setModal({type:'reject',vendor:v})} className="text-xs text-red-500 border border-red-200 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <Pagination items={requests} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
