'use client';
import { useState } from 'react';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

const cats = [
  { name: 'Venue', pct: 40, color: '#174a37' },
  { name: 'Catering', pct: 25, color: '#CFB383' },
  { name: 'Photography', pct: 10, color: '#4a7a5c' },
  { name: 'Decoration', pct: 10, color: '#8a6b3c' },
  { name: 'Beauty', pct: 5, color: '#2d6b50' },
  { name: 'Music', pct: 5, color: '#c9a66b' },
  { name: 'Others', pct: 5, color: '#888' },
];

export default function BudgetEstimationPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [estimated, setEstimated] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalPerHead = guests ? Math.round(8000 + Number(guests) * 10) : 8000;
  const totalBudget = guests ? totalPerHead * Number(guests) : 0;

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      <LoggedInNav />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#CFB383] mb-6 sm:mb-8">Budget Estimation</h1>

        <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] max-w-[900px] w-full min-w-0">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Left: form */}
            <div className="flex-1">
              <div className="mb-5">
                <label className="text-sm text-black/60 block mb-1.5">Location<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={location} onChange={e => setLocation(e.target.value)}
                    className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-white appearance-none transition-colors">
                    <option value="">Select location</option>
                    {cities.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none">📍</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm text-black/60 block mb-1.5">No. of Guests<span className="text-red-500">*</span></label>
                <input type="number" value={guests} onChange={e => setGuests(e.target.value)}
                  placeholder="Enter No. of Guests"
                  className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#CFB383] transition-colors" />
              </div>
              <button type="button" onClick={() => location && guests && setEstimated(true)}
                className={`w-full sm:w-auto px-4 md:px-8 py-3 rounded-xl font-medium text-sm transition-colors ${location && guests ? 'bg-[#CFB383] text-white hover:bg-[#B8A06E]' : 'bg-[#e8e0d0] text-black/30 cursor-not-allowed'}`}>
                Generate Estimation
              </button>
            </div>

            {/* Right: AI estimation result */}
            <div className="flex-1 min-w-0 bg-[#f9f6ef] rounded-2xl p-4 sm:p-6 border border-[rgba(184_154_105_/_0.2)]">
              {estimated ? (
                <>
                  {/* Simple pie chart visualization */}
                  <div className="flex items-center justify-center mb-5">
                    <div className="relative w-[140px] h-[140px]">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        {cats.reduce((acc, cat, i) => {
                          const start = acc.offset;
                          const dash = cat.pct;
                          const gap = 100 - dash;
                          acc.elements.push(
                            <circle key={cat.name} cx="18" cy="18" r="15.9" fill="none"
                              stroke={cat.color} strokeWidth="3"
                              strokeDasharray={`${dash} ${gap}`}
                              strokeDashoffset={-(start)} />
                          );
                          acc.offset += cat.pct;
                          return acc;
                        }, { offset: 0, elements: [] }).elements}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xs text-black/40">Venue</p>
                        <p className="font-baskerville text-[16px] text-[#174a37]">AED {Math.round(totalBudget*0.4).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-baskerville text-[18px] text-[#1a1a1a] text-center mb-2">AI Estimation Budget</p>
                  <p className="text-sm text-black/50 text-center leading-5 mb-4">
                    Most couples in {location} with {guests} guests spend AED {Math.round(totalPerHead*0.8).toLocaleString()} – {Math.round(totalPerHead*1.2).toLocaleString()} per person or AED {totalBudget.toLocaleString()} total.
                  </p>
                  <div className="flex flex-col gap-2 mb-5">
                    {cats.map(c => (
                      <div key={c.name} className="flex items-center justify-between gap-3 text-sm min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} />
                          <span className="text-black/60 truncate">{c.name}</span>
                        </div>
                        <span className="font-medium text-[#1a1a1a] shrink-0 tabular-nums">AED {Math.round(totalBudget * c.pct / 100).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={async () => {
                    if (!location || !guests) return;
                    try {
                      await (await import('../../lib/services/user.service')).default.createBudget({
                        name: `${location} Wedding — ${guests} guests`,
                        location,
                        guestCount: parseInt(guests),
                        totalAmount: totalBudget,
                        breakdown: Object.fromEntries(cats.map(c => [c.name, Math.round(totalBudget * c.pct / 100)])),
                      }));
                      setSaved(true);
                    } catch (e) {
                      alert(e?.message || 'Failed to save budget');
                    }
                  }}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-[#CFB383] text-white hover:bg-[#B8A06E]'}`}>
                    {saved ? '✓ Budget Saved!' : 'Save Budget'}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="text-5xl mb-4 opacity-20">💰</div>
                  <p className="text-black/40 text-sm">Fill in your location and guest count to generate an AI budget estimation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
