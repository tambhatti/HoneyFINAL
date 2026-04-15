'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';

const IMG1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2 = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const IMG3 = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";
const AVATAR = "https://ui-avatars.com/api/?name=User&background=174a37&color=CFB383&size=200";
const STAR = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png";

function BookingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ date:'', guests:'', notes:'' });
  const [success, setSuccess] = useState(false);
  if (success) return (
    <ModalLayer open onClose={onClose} aria-labelledby="service-booking-success-title">
      <div className="bg-white rounded-2xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-6 sm:p-10 text-center shadow-2xl min-w-0">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
        </div>
        <h3 id="service-booking-success-title" className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] mb-2">Booking Requested!</h3>
        <p className="text-black/40 text-sm mb-6">Your booking request has been sent. The vendor will confirm shortly.</p>
        <button type="button" onClick={onClose} className="w-full bg-[#CFB383] text-white py-3 rounded-xl font-medium">View Bookings</button>
      </div>
    </ModalLayer>
  );
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="service-booking-title">
      <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-5 sm:p-8 shadow-2xl min-w-0">
        <div className="flex items-start justify-between gap-3 mb-5 min-w-0">
          <h3 id="service-booking-title" className="font-baskerville text-lg sm:text-2xl text-[#CFB383] min-w-0 pr-2">Book This Service</h3>
          <button type="button" onClick={onClose} className="text-black/30 hover:text-black/60 text-xl shrink-0" aria-label="Close">✕</button>
        </div>
        <div className="flex gap-1.5 mb-6">
          {[1,2,3].map(s=><div key={s} className={`h-1 flex-1 rounded-full ${s<=step?'bg-[#174a37]':'bg-gray-200'}`}/>)}
        </div>
        {step===1&&<>
          <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Event Date<span className="text-red-500">*</span></label>
            <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
            <input type="number" value={form.guests} onChange={e=>setForm(p=>({...p,guests:e.target.value}))} placeholder="e.g. 200" className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          <button type="button" onClick={()=>form.date&&setStep(2)} className="w-full bg-[#174a37] text-white py-3.5 rounded-xl font-medium hover:bg-[#1a5c45] transition-colors">Next →</button>
        </>}
        {step===2&&<>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={4} placeholder="Any special requirements..." className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none bg-[#faf8f4]"/></div>
          <div className="flex flex-col-reverse sm:flex-row-reverse gap-3">
            <button type="button" onClick={()=>setStep(3)} className="flex-1 bg-[#174a37] text-white py-3.5 rounded-xl font-medium hover:bg-[#1a5c45] transition-colors">Next →</button>
            <button type="button" onClick={()=>setStep(1)} className="flex-1 border border-gray-200 text-gray-500 py-3.5 rounded-xl font-medium">← Back</button>
          </div>
        </>}
        {step===3&&<>
          <div className="bg-[#f9f6ef] rounded-xl p-4 mb-6">
            <h4 className="font-medium text-[#1a1a1a] mb-3">Booking Summary</h4>
            {[['Service','Grand Ballroom Package'],['Date',form.date||'Not set'],['Guests',form.guests||'Not set'],['Price','AED 45,000']].map(([l,v])=>(
              <div key={l} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between py-1.5 border-b border-[rgba(184_154_105_/_0.1)] last:border-0 min-w-0">
                <p className="text-xs text-black/40 shrink-0">{l}</p><p className="text-sm font-medium break-words sm:text-right">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col-reverse sm:flex-row-reverse gap-3">
            <button type="button" onClick={()=>setSuccess(true)} className="flex-1 bg-[#CFB383] text-white py-3.5 rounded-xl font-medium hover:bg-[#B8A06E] transition-colors">Confirm Booking</button>
            <button type="button" onClick={()=>setStep(2)} className="flex-1 border border-gray-200 text-gray-500 py-3.5 rounded-xl font-medium">← Back</button>
          </div>
        </>}
      </div>
    </ModalLayer>
  );
}

export default function ServiceDetailPage({ params }) {
  const svcId = params?.id || '';
  const { data, loading } = useApi(UserService.getService, svcId);
  const service = data?.service || {};
  const vendor = data?.vendor || {};
  const addons = data?.addons || [];
  const reviews = data?.reviews || [];
  const [showBooking, setShowBooking] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
      <LoggedInNav />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full min-w-0">
        <div className="flex items-center gap-x-2 gap-y-1 mb-6 text-sm text-black/40 min-w-0 flex-wrap">
          <Link href="/services" className="hover:text-[#174a37] shrink-0">Services</Link>
          <span className="shrink-0">/</span><span className="text-[#1a1a1a] min-w-0 break-words">Grand Ballroom Package</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0_0_0_/_0.06)]">
              <div className="h-64 overflow-hidden"><img src={IMG1} alt="" className="w-full h-full object-cover"/></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-1">
                {[IMG2,IMG3,IMG1].map((img,i)=><div key={i} className="h-20 overflow-hidden rounded-lg"><img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"/></div>)}
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)]">
              <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <span className="text-[#CFB383] text-xs uppercase tracking-wider font-medium">Venue</span>
                  <h1 className="font-baskerville text-[22px] sm:text-[28px] text-[#1a1a1a] mt-0.5 break-words">Grand Ballroom Package</h1>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <img src={STAR} alt="★" className="w-4 h-4 object-contain"/>
                    <span className="text-sm font-medium text-[#1a1a1a]">4.9</span>
                    <span className="text-black/30 text-sm">(186 reviews)</span>
                    <span className="text-black/30 text-sm">·</span>
                    <span className="text-black/50 text-sm">📍 Dubai Marina</span>
                  </div>
                </div>
                <button type="button" onClick={()=>setWishlisted(!wishlisted)} className="text-2xl shrink-0" aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>{wishlisted?'❤️':'🤍'}</button>
              </div>
              <p className="text-black/60 text-sm leading-7 mb-5">A luxurious ballroom experience featuring stunning chandeliers, marble floors, and floor-to-ceiling windows overlooking the marina. Our dedicated team ensures every detail of your day is perfect, from setup to breakdown.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[['Capacity','50–500 guests'],['Duration','Up to 12 hours'],['Catering','Included']].map(([l,v])=>(
                  <div key={l} className="bg-[#f9f6ef] rounded-xl p-3 text-center">
                    <p className="text-black/40 text-xs">{l}</p>
                    <p className="text-[#1a1a1a] font-medium text-sm mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)]">
              <h2 className="font-baskerville text-xl text-[#1a1a1a] mb-4">Reviews</h2>
              {[{name:'Sarah J.',rating:5,text:'Absolutely stunning venue! The team was incredible.'},
                {name:'Mohammed A.',rating:5,text:'Perfect experience from start to finish. Highly recommend.'}].map(r=>(
                <div key={r.name} className="flex gap-4 mb-4 pb-4 border-b border-[rgba(184_154_105_/_0.08)] last:border-0 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0"><img src={AVATAR} alt="" className="w-full h-full object-cover"/></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-[#1a1a1a]">{r.name}</p>
                      <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><img key={s} src={STAR} alt="★" className="w-3 h-3 object-contain"/>)}</div>
                    </div>
                    <p className="text-black/50 text-sm">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking panel */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] h-fit lg:sticky lg:top-24 min-w-0">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-5 min-w-0">
              <div className="min-w-0"><span className="text-black/40 text-sm">Starting from</span>
                <p className="font-baskerville text-2xl sm:text-3xl text-[#174a37] tabular-nums">AED 45,000</p></div>
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {['Custom packages available','Free site visit','Dedicated coordinator'].map(f=>(
                <p key={f} className="text-sm text-black/60 flex items-center gap-2"><span className="text-green-500">✓</span>{f}</p>
              ))}
            </div>
            <button type="button" onClick={() => setShowBooking(true)} className="w-full bg-[#CFB383] text-white py-3.5 rounded-xl font-medium hover:bg-[#B8A06E] transition-colors mb-3">Book Now</button>
            <Link href="/request-meeting" className="block w-full border border-[rgba(184_154_105_/_0.3)] text-[#CFB383] py-3.5 rounded-xl font-medium text-center hover:bg-[#F5F5EF] transition-colors text-sm">Request Meeting</Link>
            <p className="text-center text-xs text-black/30 mt-3">Free cancellation · 24h confirmation</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
