'use client';
import { useApi } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';

function RedeemModal({ points, onClose, onRedeem }) {
  const [amount, setAmount] = useState('');
  const maxRedeem = Math.floor(points / 10);
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="redeem-points-title">
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-5 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto overscroll-y-contain min-w-0">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-black/30 hover:text-black/60 text-xl" aria-label="Close">✕</button>
        <h3 id="redeem-points-title" className="font-baskerville text-2xl text-[#CFB383] mb-2">Redeem Points</h3>
        <p className="text-black/40 text-sm mb-5">10 points = AED 1 discount on your next booking.</p>
        <div className="bg-[#f9f6ef] rounded-xl p-4 mb-5">
          <p className="text-black/40 text-xs">Available Points</p>
          <p className="font-baskerville text-3xl text-[#174a37]">{points.toLocaleString()} pts</p>
          <p className="text-black/40 text-xs mt-1">= Up to AED {maxRedeem} discount</p>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Points to Redeem</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            max={points} placeholder={`Max ${points}`}
            className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
          {amount && <p className="text-[#174a37] text-sm mt-1">= AED {Math.floor(parseInt(amount||0)/10)} discount</p>}
        </div>
        <button type="button" onClick={() => amount && parseInt(amount) <= points && onRedeem(parseInt(amount))}
          className="w-full bg-[#CFB383] text-white py-3 rounded-full font-medium hover:bg-[#B8A06E] transition-colors">
          Redeem Now
        </button>
      </div>
    </ModalLayer>
  );
}

const tiers = [
  { name:'Bronze', min:0, max:500, color:'#cd7f32', perks:'5% discount on bookings' },
  { name:'Silver', min:500, max:1500, color:'#C0C0C0', perks:'10% discount + priority support' },
  { name:'Gold', min:1500, max:5000, color:'#CFB383', perks:'15% discount + dedicated manager' },
  { name:'Platinum', min:5000, max:null, color:'#E5E4E2', perks:'20% discount + exclusive access' },
];

export default function LoyaltyPage() {
  const { data, loading } = useApi(UserService.getLoyalty);
  const loyalty = data || {};
  const loyaltyHistory = Array.isArray(loyalty.history) ? loyalty.history : [];
  const [points] = useState(667);
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemed, setRedeemed] = useState(0);

  const currentTier = tiers.find(t => points >= t.min && (t.max === null || points < t.max));
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const progress = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      {showRedeem && <RedeemModal points={points} onClose={() => setShowRedeem(false)} onRedeem={p => { setRedeemed(p); setShowRedeem(false); }} />}
      {redeemed > 0 && (
        <ModalLayer open onClose={() => setRedeemed(0)} aria-labelledby="points-redeemed-title">
          <div className="bg-white rounded-2xl w-full max-w-[380px] p-6 sm:p-10 text-center shadow-2xl max-h-[90vh] overflow-y-auto overscroll-y-contain min-w-0">
            <div className="text-5xl mb-4">🎉</div>
            <h3 id="points-redeemed-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Points Redeemed!</h3>
            <p className="text-black/40 text-sm mb-6">{redeemed} points = AED {Math.floor(redeemed/10)} discount applied to your account.</p>
            <button type="button" onClick={() => setRedeemed(0)} className="w-full bg-[#174a37] text-white py-3 rounded-full font-medium">Done</button>
          </div>
        </ModalLayer>
      )}
      <LoggedInNav />
      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#CFB383] mb-6 sm:mb-8">Loyalty Points</h1>

        {/* Points card */}
        <div className="bg-[#174a37] rounded-2xl p-5 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 sm:right-8 sm:top-8 text-[80px] sm:text-[120px] opacity-5 select-none pointer-events-none">⭐</div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between relative">
            <div className="min-w-0">
              <p className="text-white/50 text-sm uppercase tracking-wider">Your Balance</p>
              <p className="font-baskerville text-[40px] sm:text-[48px] md:text-[56px] text-[#CFB383] leading-none">{points.toLocaleString()}</p>
              <p className="text-white/50 text-sm">loyalty points</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3">
                <span className="text-sm font-semibold" style={{color: currentTier?.color}}>{currentTier?.name} Member</span>
                <span className="text-white/30 text-xs hidden sm:inline">·</span>
                <span className="text-white/50 text-xs w-full sm:w-auto">{nextTier ? `${(nextTier.min - points).toLocaleString()} pts to ${nextTier.name}` : 'Maximum tier reached'}</span>
              </div>
              {nextTier && (
                <div className="mt-3 w-full max-w-xs sm:w-48">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#CFB383] rounded-full transition-all" style={{width:`${progress}%`}} />
                  </div>
                </div>
              )}
            </div>
            <button type="button" onClick={() => setShowRedeem(true)}
              className="bg-[#CFB383] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#B8A06E] transition-colors w-full sm:w-auto shrink-0">
              Redeem Points
            </button>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {tiers.map(t => (
            <div key={t.name} className={`bg-white rounded-2xl p-4 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] min-w-0 ${currentTier?.name===t.name?'ring-2 ring-[#CFB383]':''}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2" style={{background:t.color}}>★</div>
              <p className="font-medium text-sm text-[#1a1a1a] break-words">{t.name}</p>
              <p className="text-black/30 text-xs mt-0.5 tabular-nums">{t.min.toLocaleString()}{t.max?`–${t.max.toLocaleString()}`:'+'} pts</p>
              <p className="text-black/50 text-xs mt-1.5 leading-snug break-words">{t.perks}</p>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-[rgba(184_154_105_/_0.08)]">
            <h2 className="font-baskerville text-lg sm:text-xl text-[#1a1a1a]">Points History</h2>
          </div>
          {(loyaltyHistory.length ? loyaltyHistory : HISTORY).map(h => (
            <div key={h.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 px-4 sm:px-6 py-4 border-b border-[rgba(184_154_105_/_0.06)] hover:bg-[#fafaf8] transition-colors last:border-0 min-w-0">
              <div className="flex items-start gap-3 sm:items-center min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${h.type==='earned'?'bg-green-100':'bg-red-50'}`}>
                  {h.type === 'earned' ? '↑' : '↓'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#1a1a1a]">{h.desc}</p>
                  <p className="text-xs text-black/30">{h.date} · {h.booking !== '-' ? `Booking ${h.booking}` : 'Referral'}</p>
                </div>
              </div>
              <p className={`font-baskerville text-lg sm:text-xl font-medium shrink-0 self-end sm:self-auto text-right sm:text-left tabular-nums ${h.type==='earned'?'text-green-600':'text-red-500'}`}>
                {h.type==='earned'?'+':''}{h.points} pts
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
