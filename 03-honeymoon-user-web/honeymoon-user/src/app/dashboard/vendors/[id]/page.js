'use client';
import { useApi } from '../../../../hooks/useApi';
import UserService from '../../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import ModalLayer from '@/components/ModalLayer';

const imgRectangle3883 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgStar = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png";
const imgUnsplash1 = "https://ui-avatars.com/api/?name=User&background=174a37&color=CFB383&size=200";
const imgUnsplash2 = "https://ui-avatars.com/api/?name=Omar+H&background=CFB383&color=fff&size=200";
const imgPhotoImg = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgBeautyImg = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

// ── Booking Request Modal ──────────────────────────────────────────────────
function BookingModal({ vendor, services = [], onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [pkg, setPkg] = useState('Gold Package');
  const [guests, setGuests] = useState('200');
  const [notes, setNotes] = useState('');

  return (
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-booking-title">
      <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto overscroll-y-contain overflow-x-hidden shadow-2xl min-w-0">
        {/* Header */}
        <div className="bg-[#174a37] px-4 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-3 min-w-0 sticky top-0 z-10">
          <div className="min-w-0 pr-2">
            <p className="text-white/60 text-xs uppercase tracking-wider">Booking Request</p>
            <h2 id="vendor-booking-title" className="font-baskerville text-xl sm:text-[24px] text-[#CFB383] mt-0.5 break-words">{vendor}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-white/50 hover:text-white text-2xl transition-colors shrink-0" aria-label="Close">✕</button>
        </div>

        {step === 1 && (
          <div className="p-5 sm:p-8">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#174a37]' : 'bg-[#F5F5EF]'}`} />
              ))}
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-5">Select a Package</h3>
            <div className="flex flex-col gap-3 mb-8">
              {(services?.length ? services.map(s => ({ name: s.name, price: `AED ${(s.basePrice||0).toLocaleString()}`, desc: s.description || '' })) : [
                { name: 'Silver Package', price: 'AED 45,000', desc: '5-hour hire · Basic decoration · 150 guests' },
                { name: 'Gold Package', price: 'AED 65,000', desc: '8-hour hire · Premium decoration · 300 guests' },
                { name: 'Platinum Package', price: 'AED 80,000', desc: 'Full day · Luxury decoration · 500 guests' },
              ]).map(p => (
                <button type="button" key={p.name} onClick={() => setPkg(p.name)}
                  className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border-2 text-left transition-all min-w-0 ${pkg === p.name ? 'border-[#174a37] bg-[#F5F5EF]' : 'border-[rgba(184_154_105_/_0.2)]'}`}>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${pkg === p.name ? 'text-[#174a37]' : 'text-[#1a1a1a]'}`}>{p.name}</p>
                    <p className="text-black/40 text-xs mt-0.5">{p.desc}</p>
                  </div>
                  <p className="font-baskerville text-[18px] text-[#174a37] shrink-0">{p.price}</p>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setStep(2)} className="w-full bg-[#174a37] text-white font-medium py-3.5 rounded-xl hover:bg-[#1a5c45] transition-colors">
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-5 sm:p-8">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#174a37]' : 'bg-[#F5F5EF]'}`} />
              ))}
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-5">Wedding Details</h3>
            <div className="flex flex-col gap-4 mb-8">
              <div>
                <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Wedding Date</label>
                <input type="date" defaultValue="2026-06-15"
                  className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-all" />
              </div>
              <div>
                <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Expected Guests</label>
                <input value={guests} onChange={e => setGuests(e.target.value)}
                  className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-all" />
              </div>
              <div>
                <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Special Requests</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  rows={3} placeholder="Any specific requirements or questions..."
                  className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none transition-all" />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row-reverse gap-3">
              <button type="button" onClick={() => setStep(3)} className="flex-1 bg-[#174a37] text-white font-medium py-3.5 rounded-xl hover:bg-[#1a5c45] transition-colors">Review →</button>
              <button type="button" onClick={() => setStep(1)} className="flex-1 border border-[rgba(184_154_105_/_0.3)] text-black/50 font-medium py-3.5 rounded-xl hover:bg-[#F5F5EF] transition-colors">← Back</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-5 sm:p-8">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#174a37]' : 'bg-[#F5F5EF]'}`} />
              ))}
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-5">Review & Confirm</h3>
            <div className="bg-[#f9f6ef] rounded-xl p-5 mb-6 flex flex-col gap-3">
              {[
                { l: 'Vendor', v: vendor },
                { l: 'Package', v: pkg },
                { l: 'Date', v: 'June 15, 2026' },
                { l: 'Guests', v: guests },
                { l: 'Deposit Required', v: 'AED 16,250 (25%)' },
              ].map(({ l, v }) => (
                <div key={l} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between text-sm min-w-0">
                  <span className="text-black/50 shrink-0">{l}</span>
                  <span className="font-medium text-[#1a1a1a] break-words sm:text-right">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-black/40 mb-6 leading-5">
              By submitting, you agree to the booking terms. The vendor will review your request and respond within 24 hours.
            </p>
            <div className="flex flex-col-reverse sm:flex-row-reverse gap-3">
              <button type="button" onClick={onConfirm} className="flex-1 bg-[#CFB383] text-white font-medium py-3.5 rounded-xl hover:bg-[#B8A06E] transition-colors">Submit Request ✦</button>
              <button type="button" onClick={() => setStep(2)} className="flex-1 border border-[rgba(184_154_105_/_0.3)] text-black/50 font-medium py-3.5 rounded-xl hover:bg-[#F5F5EF] transition-colors">← Back</button>
            </div>
          </div>
        )}
      </div>
    </ModalLayer>
  );
}

// ── Booking Confirmed Modal ─────────────────────────────────────────────────
function ConfirmedModal({ onClose }) {
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-confirmed-title">
      <div className="bg-white rounded-2xl w-full max-w-[440px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-6 sm:p-10 text-center shadow-2xl min-w-0">
        <div className="w-20 h-20 bg-[#F5F5EF] rounded-full flex items-center justify-center text-[#174a37] text-3xl mx-auto mb-6">✓</div>
        <h2 id="vendor-confirmed-title" className="font-baskerville text-[24px] sm:text-[28px] md:text-[32px] text-[#174a37] mb-3">Request Sent!</h2>
        <p className="text-black/50 text-[15px] leading-6 mb-8">
          Your booking request has been sent to Al Habtoor Palace. They'll respond within 24 hours. We'll notify you by email.
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Link href="/dashboard/bookings" className="flex-1 bg-[#174a37] text-white font-medium py-3 rounded-xl hover:bg-[#1a5c45] transition-colors text-center text-sm">
            View Bookings
          </Link>
          <button type="button" onClick={onClose} className="flex-1 border border-[rgba(184_154_105_/_0.3)] text-[#CFB383] font-medium py-3 rounded-xl hover:bg-[#F5F5EF] transition-colors text-sm">
            Continue Browsing
          </button>
        </div>
      </div>
    </ModalLayer>
  );
}

export default function VendorDetailPage({ params }) {
  const vId = params?.id || '';
  const { data, loading } = useApi(UserService.getVendor, vId);
  const vendor = data?.vendor || {};
  const services = data?.services || [];
  const [showBooking, setShowBooking] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);

  return (
    <div className="w-full max-w-[1100px] min-w-0 pb-6">
      {showBooking && (
        <BookingModal vendor="Al Habtoor Palace"
          services={services}
          onClose={() => setShowBooking(false)}
          onConfirm={() => { setShowBooking(false); setShowConfirmed(true); }} />
      )}
      {showConfirmed && <ConfirmedModal onClose={() => setShowConfirmed(false)} />}

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm text-black/40 min-w-0">
        <Link href="/dashboard/vendors" className="hover:text-[#174a37] transition-colors shrink-0">Vendors</Link>
        <span className="shrink-0">/</span>
        <span className="text-[#1a1a1a] min-w-0 break-words">Al Habtoor Palace</span>
      </div>

      {/* Hero images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-2xl overflow-hidden min-h-[220px] h-auto md:h-[300px]">
        <div className="col-span-1 md:col-span-2 overflow-hidden min-h-[200px] md:min-h-0">
          <img src={imgRectangle3883} alt="" className="w-full h-full min-h-[200px] md:min-h-0 object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="grid grid-rows-2 gap-3 min-h-[200px] md:min-h-0">
          <div className="overflow-hidden md:rounded-tr-2xl min-h-[96px]">
            <img src={imgPhotoImg} alt="" className="w-full h-full min-h-[96px] object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="overflow-hidden md:rounded-br-2xl min-h-[96px]">
            <img src={imgBeautyImg} alt="" className="w-full h-full min-h-[96px] object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="text-[#CFB383] text-xs uppercase tracking-wider font-medium">Venue</span>
              <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#1a1a1a] mt-1">Al Habtoor Palace</h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <img key={i} src={imgStar} alt="" className="w-4 h-4 object-contain" />)}
                  <span className="text-sm font-medium text-[#1a1a1a] ml-1">4.9</span>
                  <span className="text-sm text-black/40">(128 reviews)</span>
                </div>
                <span className="text-black/50 text-sm">📍 Dubai Marina</span>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="inline-block bg-[#174a37] text-white text-sm font-bold px-4 py-2 rounded-full">✦ 98% match</div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">About</h2>
            <p className="text-black/60 leading-7 text-sm">Al Habtoor Palace is Dubai's most prestigious luxury wedding venue, nestled within the magnificent Al Habtoor City complex. With its stunning Baroque-inspired architecture, crystal chandeliers, and world-class service, it offers an unparalleled setting for luxury Emirati weddings.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[{ label: 'Capacity', value: '50–500 guests' }, { label: 'Style', value: 'Luxury, Palace' }, { label: 'Availability', value: '✓ Your date' }].map(({ label, value }) => (
                <div key={label} className="bg-[#f9f6ef] rounded-xl p-4">
                  <p className="text-black/40 text-xs uppercase tracking-wider">{label}</p>
                  <p className="text-[#1a1a1a] font-medium text-sm mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">Packages</h2>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Silver Package', price: 'AED 45,000', guests: 'Up to 150', features: ['5-hour venue hire', 'Basic decoration', 'Bridal suite', 'Parking'] },
                { name: 'Gold Package', price: 'AED 65,000', guests: 'Up to 300', features: ['8-hour venue hire', 'Premium decoration', 'Bridal suite', 'Catering coordinator', 'Valet'], popular: true },
                { name: 'Platinum Package', price: 'AED 80,000', guests: 'Up to 500', features: ['Full day hire', 'Luxury decoration', 'Bridal suite', 'In-house catering', 'Valet', 'Wedding coordinator'] },
              ].map(pkg => (
                <div key={pkg.name} className={`border rounded-xl p-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between min-w-0 ${pkg.popular ? 'border-[#CFB383] bg-[#faf7f0]' : 'border-[rgba(184_154_105_/_0.2)]'}`}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#1a1a1a]">{pkg.name}</p>
                      {pkg.popular && <span className="bg-[#CFB383] text-white text-[10px] px-2 py-0.5 rounded-full">Popular</span>}
                    </div>
                    <p className="text-black/40 text-xs mt-1">{pkg.guests}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pkg.features.map(f => <span key={f} className="text-xs text-black/50 bg-white border border-[rgba(184_154_105_/_0.2)] px-2 py-0.5 rounded-full">{f}</span>)}
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0 sm:ml-4 w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                    <p className="font-baskerville text-[22px] text-[#174a37] tabular-nums">{pkg.price}</p>
                    <button type="button" onClick={() => setShowBooking(true)} className="bg-[#174a37] text-white text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-[#1a5c45] transition-colors shrink-0">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">Client Reviews</h2>
            {[
              { name: 'Aisha Al Mansoori', date: 'March 2025', text: 'Absolutely magnificent. Our 300-guest wedding was flawless. Every detail was perfect.', img: imgUnsplash1 },
              { name: 'James Milner', date: 'January 2025', text: 'The palace exceeded every expectation. Professional team, stunning venue.', img: imgUnsplash2 },
            ].map(r => (
              <div key={r.name} className="flex gap-4 pb-4 border-b border-[rgba(184_154_105_/_0.1)] last:border-0 mb-4 last:mb-0 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-medium text-sm text-[#1a1a1a]">{r.name}</p>
                    <span className="text-black/30 text-xs">{r.date}</span>
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <img key={i} src={imgStar} alt="" className="w-3 h-3" />)}</div>
                  </div>
                  <p className="text-black/60 text-sm mt-1 leading-6">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking sidebar */}
        <div>
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-4 sm:p-6 lg:sticky lg:top-[88px] min-w-0">
            <p className="text-black/40 text-xs uppercase tracking-wider mb-1">Starting from</p>
            <p className="font-baskerville text-[28px] sm:text-[36px] text-[#174a37] tabular-nums">AED 45,000</p>
            <div className="my-4 h-px bg-[rgba(184_154_105_/_0.15)]" />
            <div className="flex flex-col gap-3 text-sm mb-6">
              {[['Your Date', 'June 15, 2026'], ['Guests', '~200'], ['Style', 'Luxury Emirati'], ['AI Match', '98%']].map(([l, v]) => (
                <div key={l} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between min-w-0">
                  <span className="text-black/40 shrink-0">{l}</span>
                  <span className="text-[#1a1a1a] font-medium break-words sm:text-right">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => setShowBooking(true)}
                className="w-full bg-[#174a37] text-white font-medium py-3 rounded-[10px] hover:bg-[#1a5c45] transition-colors">
                Request Booking
              </button>
              <Link href="/dashboard/chat" className="w-full border border-[rgba(184_154_105_/_0.4)] text-[#CFB383] font-medium py-3 rounded-[10px] hover:bg-[#F5F5EF] transition-colors text-center text-sm">
                Message Vendor
              </Link>
              <button type="button" onClick={() => setShortlisted(!shortlisted)}
                className="w-full text-black/40 text-sm hover:text-[#CFB383] transition-colors py-1">
                {shortlisted ? '❤️ Shortlisted' : '♡ Add to Shortlist'}
              </button>
              <Link href="/dashboard/compare" className="w-full text-center text-black/30 text-xs hover:text-[#CFB383] transition-colors">
                Compare with others ⚖
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
