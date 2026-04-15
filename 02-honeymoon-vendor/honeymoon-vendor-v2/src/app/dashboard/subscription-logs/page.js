'use client';
import { useApi, usePaginated } from '../../../hooks/useApi';
import { VendorService } from '../../../lib/services/vendor.service';
import Link from 'next/link';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';

const StatusBadge = ({ s }) => {
  const m = { Active:'text-green-700 bg-green-100', Expired:'text-gray-500 bg-gray-100', Cancelled:'text-red-700 bg-red-100', Pending:'text-amber-700 bg-amber-100' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m[s]||'text-gray-500 bg-gray-100'}`}>{s}</span>;
};

export default function VendorSubscriptionLogsPage() {
  const { data: subData, loading: subLoading } = useApi(VendorService.getSubscription);
  const { items: logs, total, hasMore, nextPage, loading } = usePaginated(VendorService.getSubscriptionLogs, {});
  const [paying,  setPaying]  = useState(false);
  const [success, setSuccess] = useState('');

  const subscription = subData?.subscription || {};
  const plan         = subscription.plan || {};
  const daysLeft     = subscription.endDate
    ? Math.max(0, Math.round((new Date(subscription.endDate) - Date.now()) / 86400000))
    : null;

  async function handleRenew() {
    setPaying(true);
    try {
      const r = await VendorService.paySubscription({ planId: plan.id, billing: subscription.billing || 'monthly' });
      if (r?.redirect_url) { window.location.href = r.redirect_url; }
      else { setSuccess('Renewal initiated. Check your email for payment confirmation.'); }
    } catch (e) { alert(e?.message || 'Renewal failed. Please try again.'); }
    finally { setPaying(false); }
  }

  return (
    <div className="w-full min-w-0">
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-6">Subscription</h1>

      {/* Current Subscription Card */}
      <div className={`rounded-2xl p-5 sm:p-6 mb-6 ${subscription.status === 'Active' ? 'bg-[#174a37]' : 'bg-white border border-[rgba(184,154,105,0.2)]'}`}>
        {subLoading ? (
          <div className="space-y-2">
            <div className="h-4 w-24 bg-white/20 rounded animate-pulse"/>
            <div className="h-8 w-32 bg-white/20 rounded animate-pulse"/>
          </div>
        ) : subscription.id ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${subscription.status === 'Active' ? 'text-[#CFB383]' : 'text-gray-400'}`}>
                Current Plan
              </p>
              <h2 className={`font-baskerville text-2xl sm:text-3xl mb-1 ${subscription.status === 'Active' ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {plan.name || 'Unknown Plan'}
              </h2>
              <div className={`flex flex-wrap gap-4 text-sm ${subscription.status === 'Active' ? 'text-white/70' : 'text-gray-500'}`}>
                <span>AED {Number(plan.priceMonthly || 0).toLocaleString()}/month</span>
                {subscription.endDate && (
                  <span>Expires: {new Date(subscription.endDate).toLocaleDateString('en-AE',{dateStyle:'medium'})}</span>
                )}
                {daysLeft !== null && <span className={daysLeft <= 7 ? 'text-red-400 font-semibold' : ''}>{daysLeft} days left</span>}
              </div>
              {/* Plan features */}
              {plan.features?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {plan.features.slice(0,4).map(f => (
                    <span key={f} className={`text-xs px-2.5 py-1 rounded-full ${subscription.status === 'Active' ? 'bg-white/15 text-white/80' : 'bg-[#F5F5EF] text-gray-600'}`}>{f}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-row sm:flex-col gap-2 shrink-0">
              <button onClick={handleRenew} disabled={paying}
                className="px-5 py-2.5 bg-[#CFB383] hover:bg-[#B8A06E] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap">
                {paying ? 'Processing…' : '↺ Renew Now'}
              </button>
              <Link href="/dashboard/subscription"
                className="px-5 py-2.5 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-colors text-center whitespace-nowrap">
                Change Plan
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm mb-4">No active subscription</p>
            <Link href="/dashboard/subscription" className="bg-[#174a37] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors">
              View Plans
            </Link>
          </div>
        )}
      </div>

      {/* Subscription history table */}
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-baskerville text-lg text-[#1a1a1a]">Subscription History</h2>
          {total > 0 && <span className="text-sm text-gray-400">{total} records</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-100 bg-[#faf8f4]">
                {['#','Plan','Billing','Start Date','End Date','Amount','Status'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length:3}).map((_,i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({length:7}).map((_,j) => <td key={j} className="py-4 px-4"><div className="h-3 bg-gray-100 rounded animate-pulse"/></td>)}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">No subscription history</td></tr>
              ) : logs.map((l, i) => (
                <tr key={l.id} className={`border-b border-gray-50 hover:bg-[#fafaf8] transition-colors ${i%2===0?'':'bg-[#fdfcf9]'}`}>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{i+1}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{l.plan?.name || l.planName || '—'}</td>
                  <td className="py-3.5 px-4 text-gray-500 capitalize">{l.billing || 'monthly'}</td>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{l.startDate ? new Date(l.startDate).toLocaleDateString('en-AE') : '—'}</td>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{l.endDate ? new Date(l.endDate).toLocaleDateString('en-AE') : '—'}</td>
                  <td className="py-3.5 px-4 font-medium text-[#174a37] tabular-nums">AED {Number(l.amount || l.plan?.priceMonthly || 0).toLocaleString()}</td>
                  <td className="py-3.5 px-4"><StatusBadge s={l.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button onClick={nextPage} disabled={loading} className="text-sm text-[#174a37] font-medium hover:underline disabled:opacity-50">
              {loading ? 'Loading…' : 'Load more ↓'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
