'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const CATEGORIES=[
  {name:'Venue',icon:'🏛',allocated:15000,spent:12000},
  {name:'Catering',icon:'🍽',allocated:8000,spent:6500},
  {name:'Photography',icon:'📸',allocated:5000,spent:5000},
  {name:'Decoration',icon:'🌸',allocated:4000,spent:2800},
  {name:'Beauty',icon:'💄',allocated:3000,spent:1500},
  {name:'Music',icon:'🎵',allocated:2500,spent:0},
  {name:'Transport',icon:'🚗',allocated:2000,spent:800},
  {name:'Invitations',icon:'✉️',allocated:1500,spent:1200},
];
export default function BudgetDetailPage({ params }) {
  const bId = params?.id || '';
  const { data } = useApi(UserService.getBudget, bId);
  const apiBudget = data?.budget;
  const total=CATEGORIES.reduce((s,c)=>s+c.allocated,0);
  const spent=CATEGORIES.reduce((s,c)=>s+c.spent,0);
  return(
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      <LoggedInNav />
      <main className="flex-1 max-w-3xl mx-auto py-6 sm:py-8 px-4 sm:px-6 w-full min-w-0 pb-8">
        <div className="flex flex-wrap items-center gap-3 mb-6 min-w-0">
          <Link href="/my-budgets" className="text-gray-400 hover:text-[#174a37] text-lg shrink-0" aria-label="Back to budgets">←</Link>
          <div className="min-w-0">
            <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] min-w-0 break-words">Budget Detail</h1>
            {apiBudget?.name ? (
              <p className="text-sm text-black/50 mt-1 break-words">{apiBudget.name}</p>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[['Total Budget',`AED ${total.toLocaleString()}`,'bg-[#174a37] text-white'],['Total Spent',`AED ${spent.toLocaleString()}`,'bg-[#CFB383] text-white'],['Remaining',`AED ${(total-spent).toLocaleString()}`,'bg-green-50 text-green-700 border border-green-200']].map(([l,v,cls])=>(
            <div key={l} className={`${cls} rounded-2xl p-5 text-center min-w-0`}>
              <p className="text-sm opacity-80 mb-1">{l}</p>
              <p className="font-baskerville text-xl sm:text-2xl font-semibold break-words tabular-nums">{v}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-5 mb-5 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-sm mb-2 min-w-0">
            <span className="text-gray-500">Overall Progress</span>
            <span className="font-medium text-[#174a37] tabular-nums">{Math.round((spent/total)*100)}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#174a37] rounded-full" style={{width:`${(spent/total)*100}%`}}/>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0_0_0_/_0.05)] overflow-hidden min-w-0">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-[#1a1a1a]">Category Breakdown</h2></div>
          {CATEGORIES.map(c=>{
            const pct=c.allocated>0?(c.spent/c.allocated)*100:0;
            return(
              <div key={c.name} className="px-4 sm:px-6 py-4 border-b border-gray-50 last:border-0 min-w-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-[#F5F5EF] rounded-xl flex items-center justify-center shrink-0">{c.icon}</div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 tabular-nums">AED {c.spent.toLocaleString()} / AED {c.allocated.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 w-fit ${pct>=100?'bg-red-100 text-red-600':pct>70?'bg-amber-100 text-amber-600':'bg-green-100 text-green-700'}`}>{Math.round(pct)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden sm:ml-12">
                  <div className="h-full bg-[#174a37] rounded-full" style={{width:`${Math.min(100,pct)}%`}}/>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
