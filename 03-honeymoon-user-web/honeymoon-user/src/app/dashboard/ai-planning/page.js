'use client';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const IMG1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2 = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const IMG3 = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

const SUGGESTIONS = [
  { id:1, title:'Book your venue first', priority:'High', category:'Venue', deadline:'ASAP', reason:'Venues book out 12–18 months in advance for June dates.', img: IMG1 },
  { id:2, title:'Confirm photographer', priority:'High', category:'Photography', deadline:'This month', reason:'Good photographers in UAE get booked fast.', img: IMG2 },
  { id:3, title:'Start catering tastings', priority:'Medium', category:'Catering', deadline:'3 months', reason:'Allow time for multiple tastings before deciding.', img: IMG3 },
  { id:4, title:'Shop for wedding dress', priority:'Medium', category:'Beauty', deadline:'4 months', reason:'Custom dresses need 4–6 months for alterations.', img: IMG1 },
  { id:5, title:'Choose floral designer', priority:'Low', category:'Decoration', deadline:'5 months', reason:'Lock in style early to coordinate with other vendors.', img: IMG2 },
  { id:6, title:'Plan honeymoon destination', priority:'Low', category:'Travel', deadline:'6 months', reason:'Popular destinations need early booking.', img: IMG3 },
];

const priorityColor = { High:'text-red-600 bg-red-50 border border-red-200', Medium:'text-amber-600 bg-amber-50 border border-amber-200', Low:'text-green-600 bg-green-50 border border-green-200' };

export default function DashboardAIPlanningPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? SUGGESTIONS : SUGGESTIONS.filter(s => s.priority === filter);

  return (
    <div className="w-full min-w-0 max-w-5xl pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-2 min-w-0">
          <div className="w-10 h-10 bg-[#174a37] rounded-xl flex items-center justify-center text-[#CFB383] text-lg shrink-0">✦</div>
          <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#CFB383]">AI Planning Suggestions</h1>
        </div>
        <p className="text-black/40 text-sm mb-6 sm:mb-8">Personalised recommendations based on your wedding date, budget and preferences.</p>

        {/* Priority filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto overscroll-x-contain touch-pan-x pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
          {['All','High','Medium','Low'].map(p => (
            <button type="button" key={p} onClick={() => setFilter(p)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 ${filter===p?'bg-[#174a37] text-white':'bg-white border border-[rgba(184_154_105_/_0.3)] text-gray-600 hover:border-[#CFB383]'}`}>
              {p === 'All' ? 'All Tasks' : `${p} Priority`}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {filtered.map((s, i) => (
            <div key={s.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5 hover:shadow-[0_4px_20px_rgba(0_0_0_/_0.1)] transition-shadow min-w-0">
              <div className="w-8 h-8 rounded-full border-2 border-[rgba(184_154_105_/_0.3)] flex items-center justify-center text-[#CFB383] font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <img src={s.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[#1a1a1a]">{s.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[s.priority]}`}>{s.priority}</span>
                </div>
                <p className="text-black/40 text-xs">{s.reason}</p>
              </div>
              <div className="text-left sm:text-right shrink-0 sm:min-w-[100px]">
                <p className="text-black/30 text-xs uppercase tracking-wider">Deadline</p>
                <p className="text-[#174a37] font-medium text-sm">{s.deadline}</p>
                <p className="text-black/30 text-xs mt-0.5">{s.category}</p>
              </div>
              <Link href="/dashboard/vendors"
                className="bg-[#174a37] text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-[#1a5c45] transition-colors whitespace-nowrap shrink-0 text-center sm:text-left w-full sm:w-auto">
                Find Vendors
              </Link>
            </div>
          ))}
        </div>

        {/* AI Chat prompt */}
        <div className="mt-8 bg-[#174a37] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="text-3xl shrink-0">✦</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium">Ask your AI Planner anything</p>
            <p className="text-white/50 text-sm">"What should I do 6 months before my wedding?"</p>
          </div>
          <Link href="/dashboard/ai-planner"
            className="bg-[#CFB383] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#B8A06E] transition-colors text-center shrink-0 w-full sm:w-auto">
            Open AI Planner
          </Link>
        </div>
    </div>
  );
}
