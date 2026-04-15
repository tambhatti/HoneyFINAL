'use client';
import { useState } from 'react';
import UserService from '../../../../lib/services/user.service';

const STYLES = ['luxury','modern','traditional','outdoor'];
const LOCATIONS = ['Dubai','Abu Dhabi','Sharjah'];
const PREFERENCES = ['Venue','Photography','Catering','Beauty','Decoration','Music','Transport'];

export default function AIPlannerPage() {
  const [step,     setStep]     = useState(1);
  const [form,     setForm]     = useState({ location:'Dubai', budget:20000, guestCount:50, style:'luxury', duration:3, preferences:[], additionalNotes:'' });
  const [plan,     setPlan]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const f = (k,v) => setForm(p => ({ ...p, [k]: v }));
  const togglePref = (p) => setForm(prev => ({ ...prev, preferences: prev.preferences.includes(p) ? prev.preferences.filter(x => x !== p) : [...prev.preferences, p] }));

  const handleGenerate = async () => {
    setLoading(true); setError('');
    try {
      const res = await UserService.generateAIPlan(form);
      setPlan(res.plan);
      setStep(3);
    } catch (e) {
      setError(e?.message || 'Failed to generate plan. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl w-full pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-baskerville text-2xl sm:text-3xl text-[#1a1a1a] flex items-center gap-2">
          <span className="text-[#CFB383]">✦</span> AI Honeymoon Planner
        </h1>
        <p className="text-black/40 text-sm mt-1">Tell us about your dream honeymoon and we'll create a personalised plan.</p>
      </div>

      {/* Step 1: Preferences */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.06)] flex flex-col gap-5">
          <h2 className="font-semibold text-[#1a1a1a]">Step 1 — Tell us your vision</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select value={form.location} onChange={e => f('location', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
              <select value={form.style} onChange={e => f('style', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                {STYLES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (AED)</label>
              <input type="number" value={form.budget} onChange={e => f('budget', Number(e.target.value))} min="5000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
              <input type="number" value={form.guestCount} onChange={e => f('guestCount', Number(e.target.value))} min="2"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input type="number" value={form.duration} onChange={e => f('duration', Number(e.target.value))} min="1" max="14"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Services you need</label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCES.map(p => (
                <button key={p} type="button" onClick={() => togglePref(p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${form.preferences.includes(p) ? 'bg-[#174a37] text-white border-[#174a37]' : 'border-[rgba(184,154,105,0.4)] text-black/60 hover:border-[#CFB383]'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea value={form.additionalNotes} onChange={e => f('additionalNotes', e.target.value)} rows={3}
              placeholder="Any special requests, themes, or preferences…"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={handleGenerate} disabled={loading}
            className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-medium hover:bg-[#1a5c45] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? (
              <><span className="animate-spin text-lg">✦</span> Generating your plan…</>
            ) : (
              <><span className="text-[#CFB383]">✦</span> Generate My Plan</>
            )}
          </button>
        </div>
      )}

      {/* Step 3: Plan result */}
      {step === 3 && plan && (
        <div className="flex flex-col gap-6">
          <div className="bg-[#174a37] rounded-2xl p-6 text-white">
            <p className="text-[#CFB383] text-xs font-semibold uppercase tracking-widest mb-2">Your Personalised Plan</p>
            <h2 className="font-baskerville text-2xl mb-2">{plan.title}</h2>
            <p className="text-white/70 text-sm leading-relaxed">{plan.aiMessage}</p>
            {plan.source === 'rule-based' && (
              <p className="mt-2 text-white/40 text-xs">Generated by rule-based planner. Add ANTHROPIC_API_KEY to enable AI.</p>
            )}
          </div>

          {/* Budget breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
            <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-4">Budget Breakdown</h3>
            <div className="text-center mb-4">
              <p className="text-3xl font-baskerville text-[#174a37]">AED {plan.totalBudget?.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              {plan.breakdown && Object.entries(plan.breakdown).map(([cat, amt]) => {
                const pct = Math.round((amt / plan.totalBudget) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-black/60">{cat}</span>
                      <span className="font-medium">AED {amt?.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#CFB383] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itinerary */}
          {plan.itinerary?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
              <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-4">Day-by-Day Itinerary</h3>
              <div className="flex flex-col gap-4">
                {plan.itinerary.map(day => (
                  <div key={day.day} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#174a37] text-white font-bold flex items-center justify-center shrink-0 text-sm">{day.day}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#CFB383] uppercase tracking-wide mb-0.5">{day.theme}</p>
                      <p className="font-semibold text-[#1a1a1a] text-sm">{day.activity}</p>
                      {day.tips && <p className="text-xs text-black/40 mt-1">{day.tips}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => { setPlan(null); setStep(1); }}
              className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
              Start Over
            </button>
            <button onClick={() => window.location.href = '/dashboard/vendors'}
              className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">
              Browse Vendors →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
