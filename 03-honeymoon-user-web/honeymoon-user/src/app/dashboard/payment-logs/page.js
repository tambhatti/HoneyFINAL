'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';

const LOGS = [
  { id:'TXN001', booking:'BK0001', vendor:'Al Habtoor Palace', amount:'AED 11,250', type:'Deposit 25%', date:'Jan 12, 2025', status:'Paid', method:'Visa •• 4242' },
  { id:'TXN002', booking:'BK0001', vendor:'Al Habtoor Palace', amount:'AED 11,250', type:'2nd Payment 25%', date:'Mar 15, 2025', status:'Upcoming', method:'-' },
  { id:'TXN003', booking:'BK0001', vendor:'Al Habtoor Palace', amount:'AED 22,500', type:'Final Payment 50%', date:'May 1, 2025', status:'Scheduled', method:'-' },
  { id:'TXN004', booking:'BK0002', vendor:'Studio Lumière', amount:'AED 2,125', type:'Deposit 25%', date:'Jan 20, 2025', status:'Paid', method:'Apple Pay' },
  { id:'TXN005', booking:'BK0003', vendor:'Glamour Touch', amount:'AED 800', type:'Full Payment', date:'Jan 25, 2025', status:'Paid', method:'Visa •• 4242' },
];

const StatusBadge = ({ s }) => {
  const m = { Paid:'text-green-700 bg-green-100', Upcoming:'text-amber-700 bg-amber-100', Scheduled:'text-blue-700 bg-blue-100', Refunded:'text-purple-700 bg-purple-100' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m[s] || 'bg-gray-100 text-gray-600'}`}>{s}</span>;
};

export default function DashboardPaymentLogsPage() {
  const { data, loading } = useApi(UserService.getPayments);
  const payments = data?.data || [];
  const [filter, setFilter] = useState('All');
  const source = payments.length ? payments.map(p => ({...p, amount: `AED ${(p.amount||0).toLocaleString()}`, vendor: p.vendorId || 'Vendor', id: p.transactionId || p.id, booking: p.bookingId, type: p.type, date: new Date(p.createdAt).toLocaleDateString('en-AE'), method: p.method, status: p.status === 'completed' ? 'Paid' : p.status})) : LOGS;
  const filtered = filter === 'All' ? source : source.filter(l => l.status === filter);
  const totalPaid = LOGS.filter(l => l.status === 'Paid').reduce((s, l) => s + parseInt(l.amount.replace(/[^0-9]/g,'')), 0);

  return (
    <div className="w-full min-w-0 max-w-5xl pb-6">
        <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#CFB383] mb-4">Payment Logs</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[['Total Paid',`AED ${totalPaid.toLocaleString()}`,'✓'],['Upcoming',`AED ${source.filter(l=>l.status==='Upcoming'||l.status==='pending').reduce((s,l)=>s+(typeof l.amount==='number'?l.amount:parseInt(String(l.amount).replace(/[^0-9]/g,''))||0),0).toLocaleString()}`,'⏰'],['Scheduled',`AED ${source.filter(l=>l.status==='Scheduled').reduce((s,l)=>s+(typeof l.amount==='number'?l.amount:0),0).toLocaleString()}`,'📅']].map(([l,v,icon]) => (
            <div key={l} className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)]">
              <p className="text-black/40 text-xs uppercase tracking-wider">{icon} {l}</p>
              <p className="font-baskerville text-xl sm:text-2xl text-[#174a37] mt-1 break-words tabular-nums">{v}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1 overscroll-x-contain touch-pan-x">
          {['All','Paid','Upcoming','Scheduled'].map(f => (
            <button type="button" key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 ${filter===f?'bg-[#174a37] text-white':'bg-white border border-[rgba(184_154_105_/_0.3)] text-gray-600 hover:border-[#CFB383]'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] overflow-hidden">
          <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['Transaction','Vendor','Type','Amount','Date','Method','Status'].map(h => (
                  <th key={h} className="text-left py-3.5 px-3 sm:px-5 text-black/40 font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-b border-[rgba(184_154_105_/_0.06)] hover:bg-[#fafaf8] transition-colors">
                  <td className="py-4 px-3 sm:px-5 font-mono text-xs text-black/40 whitespace-nowrap">{l.id}</td>
                  <td className="py-4 px-3 sm:px-5 font-medium text-[#1a1a1a] max-w-[160px] sm:max-w-[220px] break-words">{l.vendor}</td>
                  <td className="py-4 px-3 sm:px-5 text-black/50 text-xs max-w-[140px] sm:max-w-none break-words">{l.type}</td>
                  <td className="py-4 px-3 sm:px-5 font-baskerville text-base sm:text-lg text-[#174a37] whitespace-nowrap">{l.amount}</td>
                  <td className="py-4 px-3 sm:px-5 text-black/40 text-xs whitespace-nowrap">{l.date}</td>
                  <td className="py-4 px-3 sm:px-5 text-black/50 text-xs whitespace-nowrap">{l.method}</td>
                  <td className="py-4 px-3 sm:px-5"><StatusBadge s={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
    </div>
  );
}
