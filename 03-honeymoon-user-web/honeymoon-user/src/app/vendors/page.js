'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';

const imgs = {
  heroBg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  heroOverlay: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
  vendorBg: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1600&q=80",
  venueImg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  photoImg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  beautyImg: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
  featuresPhoto: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  photo: "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?w=800&q=80",
  photo1: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80",
  star: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png",
};

const categories = ['All', 'Venues', 'Photography', 'Beauty', 'Catering', 'Decoration', 'Music', 'Transport'];
const STATIC_VENDORS = [
  { id: 1, name: 'Al Habtoor Palace', cat: 'Venues', rating: 4.9, reviews: 128, price: 'AED 45,000–80,000', location: 'Dubai', img: imgs.venueImg, tags: ['Luxury', 'Palace', '500+ guests'] },
  { id: 2, name: 'Studio Lumière', cat: 'Photography', rating: 4.8, reviews: 96, price: 'AED 8,500–15,000', location: 'Abu Dhabi', img: imgs.photoImg, tags: ['Portrait', 'Editorial', 'Drone'] },
  { id: 3, name: 'Glamour Touch', cat: 'Beauty', rating: 4.7, reviews: 215, price: 'AED 3,200–5,000', location: 'Dubai', img: imgs.beautyImg, tags: ['Bridal', 'Traditional', 'Team'] },
  { id: 4, name: 'Emirates Floral', cat: 'Decoration', rating: 4.6, reviews: 82, price: 'AED 12,000–30,000', location: 'Sharjah', img: imgs.featuresPhoto, tags: ['Luxury', 'Floral', 'Custom'] },
  { id: 5, name: 'Saveur Catering', cat: 'Catering', rating: 4.5, reviews: 173, price: 'AED 180–350 pp', location: 'Dubai', img: imgs.photo, tags: ['Arabic', 'International', 'Buffet'] },
  { id: 6, name: 'Frames by Hassan', cat: 'Photography', rating: 4.9, reviews: 64, price: 'AED 10,000–18,000', location: 'Dubai', img: imgs.photo1, tags: ['Fine Art', 'Cinematic', 'Emirati'] },
];
function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-w-0 mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button type="button" onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-xl hover:bg-[#1a5c45] transition-colors disabled:opacity-50 w-full sm:w-auto">
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

export default function PublicVendorsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { items: apiVendors, loading, nextPage, hasMore, refresh, total } = usePaginated(UserService.getVendors, { search, category });
  const [activeCategory, setActiveCategory] = useState('All');
  const vendors = apiVendors?.length ? apiVendors : STATIC_VENDORS;

  const filtered = vendors.filter(v =>
    (activeCategory === 'All' || v.cat === activeCategory) &&
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen min-h-dvh w-full min-w-0">
      <PublicNav activeHref="/vendors" />

      {/* Hero */}
      <section className="relative min-h-[300px] sm:min-h-[400px] md:h-[480px] flex items-center overflow-hidden">
        <img src={imgs.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={imgs.heroOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-[88px] w-full min-w-0 pb-8">
          <p className="text-[#CFB383] text-[14px] uppercase tracking-[4px] mb-4">Discover</p>
          <h1 className="font-baskerville text-[32px] sm:text-[44px] md:text-[56px] lg:text-[72px] leading-tight sm:leading-[52px] md:leading-[64px] lg:leading-[80px] text-[#fff6e9] capitalize max-w-[720px] mb-4 sm:mb-6">
            UAE's Finest Wedding Vendors
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center max-w-[600px] w-full min-w-0">
            <div className="flex-1 min-w-0 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-4 sm:px-5 py-3 flex items-center gap-3">
              <span className="text-white/50 shrink-0">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search vendors..."
                className="bg-transparent text-white text-[15px] outline-none flex-1 min-w-0 placeholder-white/40" />
            </div>
            <Link href="/signup" className="bg-[#CFB383] text-white text-[15px] font-medium px-6 py-3 rounded-xl hover:bg-[#B8A06E] transition-colors whitespace-nowrap text-center shrink-0">
              ✦ AI Match Me
            </Link>
          </div>
        </div>
      </section>

      {/* Vendor listing */}
      <section className="bg-[#f9f6ef] py-10 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-w-0">
          {/* Category pills */}
          <div className="flex items-center gap-3 mb-10 overflow-x-auto overscroll-x-contain touch-pan-x pb-2 -mx-1 px-1 sm:mx-0 sm:px-0">
            {categories.map(cat => (
              <button type="button" key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat ? 'bg-[#174a37] text-white' : 'bg-white border border-[rgba(184_154_105_/_0.3)] text-black/60 hover:border-[#CFB383]'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] overflow-hidden hover:shadow-[0_8px_30px_rgba(0_0_0_/_0.1)] transition-all hover:-translate-y-0.5 group">
                <div className="relative h-52 overflow-hidden">
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 min-w-0">
                  <span className="text-[#CFB383] text-[11px] uppercase tracking-wider font-medium">{v.cat}</span>
                  <h3 className="font-medium text-[#1a1a1a] text-lg mt-0.5 line-clamp-2">{v.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 min-w-0">
                    <div className="flex items-center gap-1">
                      <img src={v.img && imgs.star} alt="★" className="w-3.5 h-3.5 object-contain" />
                      <span className="text-sm font-medium">{v.rating}</span>
                      <span className="text-xs text-black/30">({v.reviews})</span>
                    </div>
                    <span className="text-black/20">·</span>
                    <span className="text-black/40 text-xs">📍 {v.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(v.tags || []).map(t => <span key={t} className="text-[11px] text-[#174a37] bg-[#F5F5EF] px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 min-w-0">
                    <span className="text-[#174a37] text-sm font-medium shrink-0">{v.price}</span>
                    <Link href={`/vendors/${v.id}`} className="bg-[#174a37] text-white text-xs font-medium px-4 py-2.5 rounded-[8px] hover:bg-[#1a5c45] transition-colors text-center sm:text-left w-full sm:w-auto">
                      View & Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-black/40 text-lg">No vendors found. <Link href="/signup" className="text-[#CFB383] hover:underline">Let AI find them for you →</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* AI CTA */}
      <section className="bg-[#174a37] py-20 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="w-16 h-16 bg-[#CFB383] rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6">✦</div>
          <h2 className="font-baskerville text-[28px] md:text-[36px] lg:text-[48px] leading-[34px] md:leading-[44px] lg:leading-[56px] text-[#CFB383] capitalize mb-4">Let AI Find Your Perfect Match</h2>
          <p className="text-white/70 text-[17px] leading-7 mb-8">Answer a few questions and our AI will shortlist the best vendors for your specific vision, date, and budget.</p>
          <Link href="/signup" className="bg-[#CFB383] text-white text-[16px] font-medium px-6 sm:px-10 py-3.5 sm:py-4 rounded-[10px] hover:bg-[#B8A06E] transition-colors w-full sm:w-auto text-center">
            Start AI Planning — It's Free
          </Link>
        </div>
      </section>
      <Pagination items={apiVendors} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
