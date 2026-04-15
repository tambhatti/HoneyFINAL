'use client';
import { usePaginated } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const imgStar = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png";
const imgVenueImg = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgPhotoImg = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgBeautyImg = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

const COMPARE_FALLBACK_VENDORS = [
  {
    id: 1, name: 'Al Habtoor Palace', cat: 'Venue', rating: 4.9, reviews: 128, img: imgVenueImg,
    price: 65000, availability: true, capacity: '50-500', style: 'Palace, Luxury', deposit: '25%',
    features: { aiMatch: 98, freeConsult: true, onSiteVisit: true, dedicatedCoord: true, inHouseCatering: true, outdoorOption: true }
  },
  {
    id: 2, name: 'Emirates Palace', cat: 'Venue', rating: 4.8, reviews: 96, img: imgPhotoImg,
    price: 80000, availability: true, capacity: '100-800', style: 'Grand, Royal', deposit: '30%',
    features: { aiMatch: 91, freeConsult: true, onSiteVisit: true, dedicatedCoord: true, inHouseCatering: true, outdoorOption: false }
  },
  {
    id: 3, name: 'Bloom Garden', cat: 'Venue', rating: 4.6, reviews: 64, img: imgBeautyImg,
    price: 45000, availability: false, capacity: '50-300', style: 'Garden, Romantic', deposit: '20%',
    features: { aiMatch: 84, freeConsult: false, onSiteVisit: true, dedicatedCoord: false, inHouseCatering: false, outdoorOption: true }
  },
];

const rows = [
  { key: 'price', label: 'Starting Price', format: v => `AED ${v.toLocaleString()}` },
  { key: 'availability', label: 'Your Date Available', format: v => v ? '✓ Available' : '✗ Unavailable' },
  { key: 'capacity', label: 'Capacity', format: v => v + ' guests' },
  { key: 'style', label: 'Style', format: v => v },
  { key: 'deposit', label: 'Deposit Required', format: v => v },
];

const featureRows = [
  { key: 'freeConsult', label: 'Free Consultation' },
  { key: 'onSiteVisit', label: 'Site Visit Included' },
  { key: 'dedicatedCoord', label: 'Dedicated Coordinator' },
  { key: 'inHouseCatering', label: 'In-house Catering' },
  { key: 'outdoorOption', label: 'Outdoor Option' },
];


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button type="button" onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-lg hover:bg-[#1a5c45] transition-colors disabled:opacity-50 w-full sm:w-auto">
          {loading ? 'Loading...' : 'Load More ↓'}
        </button>
      )}
    </div>
  );
}

export default function ComparePage() {
  const { items: apiVendors, loading, total, hasMore, nextPage} = usePaginated(UserService.getVendors, {});
  const vendors = apiVendors?.length ? apiVendors : COMPARE_FALLBACK_VENDORS;
  const [selected, setSelected] = useState([0, 1]);

  const displayed = vendors.filter((_, i) => selected.includes(i));

  return (
    <div className="w-full max-w-[1200px] min-w-0 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="font-baskerville text-[28px] sm:text-[36px] text-[#1a1a1a]">Compare Vendors</h1>
          <p className="text-black/40 text-sm mt-1">Side-by-side comparison to make the right choice</p>
        </div>
        <Link href="/dashboard/vendors" className="border border-[rgba(184_154_105_/_0.3)] text-[#CFB383] text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-[#F5F5EF] transition-colors text-center w-full sm:w-auto">
          + Add Vendor
        </Link>
      </div>

      {/* Vendor selector */}
      <div className="flex gap-3 mb-8 overflow-x-auto overscroll-x-contain touch-pan-x pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
        {vendors.map((v, i) => (
          <button type="button" key={v.id} onClick={() => setSelected(p => p.includes(i) ? p.filter(x => x !== i) : p.length < 3 ? [...p, i] : p)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium shrink-0 min-w-0 ${
              selected.includes(i) ? 'border-[#174a37] bg-[#F5F5EF] text-[#174a37]' : 'border-[rgba(184_154_105_/_0.2)] bg-white text-black/50 hover:border-[#CFB383]'
            }`}>
            <div className="w-7 h-7 rounded-lg overflow-hidden">
              <img src={v.img} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="truncate min-w-0 flex-1 text-left">{v.name}</span>
            {selected.includes(i) && <span className="text-[#174a37]">✓</span>}
          </button>
        ))}
      </div>

      {displayed.length < 2 ? (
        <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-10 sm:p-20 text-center">
          <p className="text-black/40">Select at least 2 vendors to compare.</p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-visible overscroll-x-contain pb-2 -mx-1 px-1 sm:mx-0 sm:px-0 touch-pan-x scrollbar-hide">
        <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] shadow-[0_0_30px_rgba(0_0_0_/_0.04)] overflow-hidden min-w-[560px]">
          {/* Header row */}
          <div className={`grid border-b border-[rgba(184_154_105_/_0.1)]`}
            style={{ gridTemplateColumns: `200px repeat(${displayed.length}, 1fr)` }}>
            <div className="p-6" />
            {displayed.map(v => (
              <div key={v.id} className="p-6 border-l border-[rgba(184_154_105_/_0.1)]">
                <div className="w-full h-36 rounded-xl overflow-hidden mb-4">
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[#CFB383] text-[11px] uppercase tracking-wider">{v.cat}</span>
                <h3 className="font-medium text-[#1a1a1a] text-base mt-0.5 line-clamp-2">{v.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <img src={imgStar} alt="★" className="w-3.5 h-3.5 object-contain" />
                  <span className="text-sm font-medium">{v.rating}</span>
                  <span className="text-xs text-black/30">({v.reviews})</span>
                </div>
                <div className="mt-3">
                  <span className="bg-[#174a37] text-white text-xs px-2.5 py-1 rounded-full">✦ {v.features.aiMatch}% match</span>
                </div>
              </div>
            ))}
          </div>

          {/* Metrics */}
          {rows.map(row => (
            <div key={row.key} className={`grid border-b border-[rgba(184_154_105_/_0.06)] hover:bg-[#faf7f0] transition-colors`}
              style={{ gridTemplateColumns: `200px repeat(${displayed.length}, 1fr)` }}>
              <div className="p-4 px-6 flex items-center">
                <span className="text-xs font-medium text-black/50 uppercase tracking-wider">{row.label}</span>
              </div>
              {displayed.map(v => {
                const val = row.key === 'price' ? v.price : row.key === 'availability' ? v.availability : v[row.key];
                const formatted = row.format(val);
                return (
                  <div key={v.id} className="p-4 px-6 border-l border-[rgba(184_154_105_/_0.06)] flex items-center">
                    <span className={`text-sm font-medium ${
                      row.key === 'availability' ? (val ? 'text-green-600' : 'text-red-500') :
                      row.key === 'price' ? 'font-baskerville text-[20px] text-[#174a37]' : 'text-[#1a1a1a]'
                    }`}>{formatted}</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Features */}
          <div className={`grid bg-[#f9f6ef] border-b border-[rgba(184_154_105_/_0.1)]`}
            style={{ gridTemplateColumns: `200px repeat(${displayed.length}, 1fr)` }}>
            <div className="p-4 px-6"><span className="text-xs font-medium text-black/40 uppercase tracking-wider">Included</span></div>
            {displayed.map(v => <div key={v.id} className="p-4 border-l border-[rgba(184_154_105_/_0.06)]" />)}
          </div>
          {featureRows.map(f => (
            <div key={f.key} className={`grid border-b border-[rgba(184_154_105_/_0.06)] hover:bg-[#faf7f0] transition-colors`}
              style={{ gridTemplateColumns: `200px repeat(${displayed.length}, 1fr)` }}>
              <div className="p-4 px-6 flex items-center">
                <span className="text-sm text-black/60">{f.label}</span>
              </div>
              {displayed.map(v => (
                <div key={v.id} className="p-4 px-6 border-l border-[rgba(184_154_105_/_0.06)] flex items-center">
                  <span className={`text-base ${v.features[f.key] ? 'text-[#174a37]' : 'text-black/20'}`}>
                    {v.features[f.key] ? '✓' : '—'}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {/* CTA row */}
          <div className={`grid p-4`} style={{ gridTemplateColumns: `200px repeat(${displayed.length}, 1fr)` }}>
            <div />
            {displayed.map(v => (
              <div key={v.id} className="px-3 flex flex-col gap-2">
                <Link href={`/dashboard/vendors/${v.id}`}
                  className="w-full bg-[#174a37] text-white text-xs font-medium py-2.5 rounded-[8px] hover:bg-[#1a5c45] transition-colors text-center">
                  Request Booking
                </Link>
                <Link href="/dashboard/chat"
                  className="w-full border border-[rgba(184_154_105_/_0.4)] text-[#CFB383] text-xs font-medium py-2.5 rounded-[8px] hover:bg-[#F5F5EF] transition-colors text-center">
                  Message
                </Link>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}
      <Pagination items={apiVendors} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
