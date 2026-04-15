'use client';
import { useApi } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const imgStar = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png";
const imgVenue1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgVenue2 = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgVenue3 = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";
const imgVenue4 = "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80";
const imgVenue5 = "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?w=800&q=80";
const imgVenue6 = "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80";

const initWishlist = [
  { id: 1, name: 'The Wedding Atelier', vendor: 'James Milner', rating: 4.9, img: imgVenue1 },
  { id: 2, name: 'Grand Ballroom Oasis', vendor: 'Elias Fischer', rating: 4.9, img: imgVenue2 },
  { id: 3, name: 'Crystal Gardens Venue', vendor: 'Zander Nash', rating: 4.9, img: imgVenue3 },
  { id: 4, name: 'Sunset Terrace Events', vendor: 'Willow Howell', rating: 4.9, img: imgVenue4 },
  { id: 5, name: 'Whispering Pines Barn', vendor: 'Kiana Bergson', rating: 4.9, img: imgVenue5 },
  { id: 6, name: 'Azure Sky Loft', vendor: 'Alistair Faulkner', rating: 4.9, img: imgVenue6 },
  { id: 7, name: 'Royal Palm Estate', vendor: 'Amelia MacLeod', rating: 4.9, img: imgVenue1 },
  { id: 8, name: 'Timeless Charm Chateau', vendor: 'Ronan Blackwood', rating: 4.9, img: imgVenue2 },
  { id: 9, name: 'Urban Luxe Space', vendor: 'Scarlett Romney', rating: 4.9, img: imgVenue3 },
  { id: 10, name: 'Vintage Grace Hall', vendor: 'Lachlan Shaw', rating: 4.9, img: imgVenue4 },
  { id: 11, name: 'Secret Garden Weddings', vendor: 'Bronte Cavendish', rating: 4.9, img: imgVenue5 },
  { id: 12, name: 'Enchanted Forest Venue', vendor: 'Jasper Ainsworth', rating: 4.8, img: imgVenue6 },
];

export default function WishlistPage() {
  const { data, loading, refresh } = useApi(UserService.getWishlist);
  const wishlist = data?.wishlist || [];
  const [items, setItems] = useState(initWishlist);
  const [search, setSearch] = useState('');

  const filtered = items.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));
  const remove = (id) => setItems(p => p.filter(v => v.id !== id));

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      <LoggedInNav />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <h1 className="font-baskerville text-[28px] md:text-[36px] lg:text-[40px] text-[#CFB383]">Wishlist</h1>
          <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
            <div className="bg-white border border-[rgba(184_154_105_/_0.3)] rounded-lg px-4 py-2.5 flex items-center gap-2 flex-1 min-w-0 sm:flex-none sm:w-52">
              <span className="text-black/30 shrink-0">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search" className="bg-transparent text-sm outline-none flex-1 min-w-0 text-black/60 placeholder-black/30" />
            </div>
            <button type="button" aria-label="Toggle grid layout" className="w-10 h-10 shrink-0 border border-[rgba(184_154_105_/_0.3)] rounded-lg flex items-center justify-center text-black/40 hover:text-[#CFB383] hover:border-[#CFB383] transition-colors">
              ⊞
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] hover:shadow-[0_4px_25px_rgba(0_0_0_/_0.1)] transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button type="button" onClick={() => remove(v.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:scale-110 transition-all shadow-md text-sm">
                  ❤️
                </button>
              </div>
              <div className="p-4 min-w-0">
                <h3 className="font-medium text-[#1a1a1a] text-base line-clamp-2">{v.name}</h3>
                <div className="flex items-center justify-between gap-2 mt-2 min-w-0">
                  <p className="text-[#CFB383] text-sm flex items-center gap-1 min-w-0 truncate">
                    <span className="text-black/40 shrink-0">👤</span> <span className="truncate">{v.vendor}</span>
                  </p>
                  <div className="flex items-center gap-1">
                    <img src={imgStar} alt="★" className="w-3.5 h-3.5 object-contain" />
                    <span className="text-sm font-medium text-[#1a1a1a]">{v.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">♡</p>
            <p className="text-black/40 text-lg">No saved venues yet.</p>
            <Link href="/vendors" className="inline-block mt-4 text-[#CFB383] hover:underline">Browse Vendors →</Link>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-8 sm:mt-10 min-w-0">
          <p className="text-sm text-black/50 min-w-0">Showing 1 To {filtered.length} From {items.length} Entries</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto min-w-0">
            <button type="button" className="px-3 py-1.5 text-sm border border-[rgba(184_154_105_/_0.3)] rounded-lg text-black/50 hover:border-[#CFB383] transition-colors">← Previous</button>
            {[1,2,3].map(p => (
              <button type="button" key={p} className={`w-8 h-8 rounded-lg text-sm ${p===1?'bg-[#CFB383] text-white':'text-black/50 border border-[rgba(184_154_105_/_0.3)] hover:border-[#CFB383]'} transition-colors`}>{p}</button>
            ))}
            <button type="button" className="px-3 py-1.5 text-sm border border-[rgba(184_154_105_/_0.3)] rounded-lg text-black/50 hover:border-[#CFB383] transition-colors">Next →</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
