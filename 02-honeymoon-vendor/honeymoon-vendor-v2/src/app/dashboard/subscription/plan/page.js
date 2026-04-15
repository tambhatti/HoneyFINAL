'use client';
import { useApi } from '../../../../hooks/useApi';
import VendorService from '../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';


export default function SubscriptionPlanPage(){
  const { data, loading } = useApi(VendorService.getSubscription);
  const plans = data?.plans || [];
  const [billing,setBilling]=useState('monthly');
  const [currentPlan]=useState(2);
  const [confirm,setConfirm]=useState(null);
  const [success,setSuccess]=useState('');

  return(
    <div>
      {confirm&&<ConfirmModal message={`Subscribe to "${confirm.name}"?`} onYes={()=>{setConfirm(null);setSuccess('Subscription changed successfully.');}} onNo={()=>setConfirm(null)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>window.history.back()} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Subscription Plan</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
        <div className="flex items-center gap-3 mb-8">
          <span className={`text-sm font-medium ${billing==='monthly'?'text-[#1a1a1a]':'text-gray-400'}`}>Monthly</span>
          <button onClick={()=>setBilling(b=>b==='monthly'?'annually':'monthly')}
            className={`w-12 h-6 rounded-full flex items-center px-0.5 transition-colors ${billing==='annually'?'bg-[#174a37] justify-end':'bg-gray-300 justify-start'}`}>
            <span className="w-5 h-5 bg-white rounded-full shadow"/>
          </button>
          <span className={`text-sm font-medium ${billing==='annually'?'text-[#1a1a1a]':'text-gray-400'}`}>Annually</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(plans.length ? plans : []).map(p=>(
            <div key={p.id} className={`border-2 rounded-2xl p-6 transition-all ${p.id===currentPlan?'border-[#174a37] shadow-lg':'border-gray-100 hover:border-[rgba(184_154_105_/_0.3)]'}`}>
              {p.id===currentPlan&&<div className="text-center mb-3"><span className="text-xs bg-[#174a37] text-white px-3 py-1 rounded-full font-medium">Current Plan</span></div>}
              <h3 className="font-semibold text-[#1a1a1a] text-base mb-4">{p.name}</h3>
              <div className="bg-[#CFB383] rounded-xl p-4 text-center mb-5">
                <p className="text-white font-baskerville text-3xl">{p.price.replace('$','')}<span className="text-lg">.00</span></p>
                <p className="text-white text-xs opacity-80">{p.period}</p>
              </div>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Commission Discount</span><span className="font-medium">{p.commissionDiscount}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Profile Featuring</span><span className={`font-medium ${p.profileFeaturing==='N/A'?'text-gray-400':''}`}>{p.profileFeaturing}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Banner Promotion</span><span className={`font-medium text-xs ${p.bannerPromotion==='N/A'?'text-gray-400':''}`}>{p.bannerPromotion}</span></div>
              </div>
              {p.id!==currentPlan?(
                <button onClick={()=>setConfirm(p)} className="w-full bg-[#174a37] text-white py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center justify-center gap-2">Buy Now ↗</button>
              ):(
                <button disabled className="w-full border border-gray-200 text-gray-400 py-2.5 rounded-full text-sm font-medium cursor-not-allowed">Current Plan</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
