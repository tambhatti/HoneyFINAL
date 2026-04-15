'use client';
import { usePaginated } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const imgStar = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png";
const imgVenueImg = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgPhotoImg = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgBeautyImg = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";
const imgFeaturesPhoto = "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80";

const allResults = [
  { id: 1, type: 'vendor', name: 'Al Habtoor Palace', cat: 'Venue', rating: 4.9, img: imgVenueImg, href: '/dashboard/vendors/1' },
  { id: 2, type: 'vendor', name: 'Studio Lumière', cat: 'Photography', rating: 4.8, img: imgPhotoImg, href: '/dashboard/vendors/2' },
  { id: 3, type: 'vendor', name: 'Glamour Touch', cat: 'Beauty', rating: 4.7, img: imgBeautyImg, href: '/dashboard/vendors/3' },
  { id: 4, type: 'booking', name: 'Al Habtoor Palace', cat: 'Booking · Jun 15, 2026', img: imgVenueImg, href: '/dashboard/bookings/1' },
  { id: 5, type: 'vendor', name: 'Frames by Hassan', cat: 'Photography', rating: 4.9, img: imgFeaturesPhoto, href: '/dashboard/vendors/4' },
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

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { items: vendors, loading, total, hasMore, nextPage} = usePaginated(UserService.getVendors, { search: query });
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Vendors', 'Bookings', 'Messages'];
  const results = allResults.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) &&
    (filter === 'All' || r.type === filter.toLowerCase().replace(/s$/, ''))
  );

  return (
    <div className="max-w-[900px] w-full min-w-0 pb-6">
      <h1 className="font-baskerville text-[28px] sm:text-[32px] md:text-[36px] text-[#1a1a1a] mb-6">Search</h1>

      {/* Search input */}
      <div className="bg-white border border-[rgba(184_154_105_/_0.3)] rounded-2xl px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 mb-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] focus-within:border-[#CFB383] transition-colors min-w-0">
        <span className="text-black/30 text-xl shrink-0">🔍</span>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search vendors, bookings, messages..."
          className="flex-1 min-w-0 text-[#1a1a1a] text-base outline-none bg-transparent placeholder-black/30"
          autoFocus />
        {query && <button type="button" onClick={() => setQuery('')} className="text-black/30 hover:text-black/60 text-lg transition-colors shrink-0">✕</button>}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto overscroll-x-contain touch-pan-x pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
        {filters.map(f => (
          <button type="button" key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
              filter === f ? 'bg-[#174a37] text-white' : 'bg-white border border-[rgba(184_154_105_/_0.2)] text-black/50 hover:border-[#CFB383]'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {query === '' ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-20">🔍</div>
          <p className="text-black/40">Start typing to search vendors, bookings, and more...</p>
          <div className="mt-8">
            <p className="text-xs text-black/30 uppercase tracking-wider mb-3">Recent searches</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {['Al Habtoor', 'Photography', 'Dubai Venues'].map(s => (
                <button type="button" key={s} onClick={() => setQuery(s)}
                  className="text-sm text-[#CFB383] bg-[#F5F5EF] px-4 py-1.5 rounded-full hover:bg-[#e8dfc5] transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-black/40 text-lg">No results for "<span className="text-[#1a1a1a]">{query}</span>"</p>
          <Link href="/dashboard/vendors" className="inline-block mt-4 text-[#CFB383] hover:underline text-sm">Browse all vendors →</Link>
        </div>
      ) : (
        <div>
          <p className="text-xs text-black/40 uppercase tracking-wider mb-4">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] shadow-[0_0_30px_rgba(0_0_0_/_0.04)] divide-y divide-[rgba(184_154_105_/_0.08)] overflow-hidden">
            {results.map(r => (
              <Link key={r.id} href={r.href}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 p-4 sm:p-5 hover:bg-[#faf7f0] transition-colors group">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[#1a1a1a] truncate">{r.name}</p>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      r.type === 'vendor' ? 'bg-[#F5F5EF] text-[#CFB383]' : 'bg-blue-50 text-blue-600'
                    }`}>{r.type}</span>
                  </div>
                  <p className="text-black/40 text-sm mt-0.5">{r.cat}</p>
                  {r.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <img src={imgStar} alt="★" className="w-3 h-3 object-contain" />
                      <span className="text-xs text-black/50">{r.rating}</span>
                    </div>
                  )}
                </div>
                <span className="text-black/20 group-hover:text-[#CFB383] transition-colors text-lg self-end sm:self-center sm:ml-auto">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Pagination items={vendors} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
