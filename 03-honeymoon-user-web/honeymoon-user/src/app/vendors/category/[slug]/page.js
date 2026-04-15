'use client';
import { usePaginated } from '../../../../hooks/useApi';
import UserService from '../../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const IMGS=[IMG1,IMG2,IMG1,IMG2,IMG1,IMG2];

const CATEGORIES={
  venue:{name:'Venues',icon:'🏛'},photography:{name:'Photography',icon:'📸'},
  beauty:{name:'Beauty & Makeup',icon:'💄'},catering:{name:'Catering',icon:'🍽'},
  decoration:{name:'Decoration',icon:'🌸'},music:{name:'Music & Entertainment',icon:'🎵'},
};

const VENDORS=Array.from({length:12},(_,i)=>({
  id:i+1,name:`${['Royal','Golden','Luxe','Elite','Premium','Grand'][i%6]} ${['Gardens','Studio','Events','Venue','Hall','Palace'][i%6]}`,
  location:'Dubai, UAE',rating:(4.5+Math.random()*0.5).toFixed(1),
  reviews:Math.floor(50+Math.random()*200),
  price:`AED ${(5000+i*1000).toLocaleString()}`,verified:i%3!==2,
}));


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

export default function VendorCategoryPage({ params }) {
  const slug = params?.slug || '';
  const { items: apiVendors, loading, total, hasMore, nextPage} = usePaginated(UserService.getVendors, { category: slug });
  const [sort,setSort]=useState('rating');
  const [priceRange,setPriceRange]=useState('all');
  const cat=CATEGORIES[slug]||{name:slug||'Category',icon:'🌟'};
  const vendors = apiVendors?.length ? apiVendors : VENDORS;
  const displayCount = vendors.length;

  return(
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] flex flex-col font-sans w-full min-w-0">
      <LoggedInNav/>
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 flex-wrap">
          <Link href="/vendors" className="hover:text-[#174a37]">Vendors</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{cat.name}</span>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
          <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">{cat.icon} {cat.name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto min-w-0">
            <select value={sort} onChange={e=>setSort(e.target.value)}
              className="border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] w-full sm:w-auto min-w-0">
              <option value="rating">Top Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="reviews">Most Reviewed</option>
            </select>
            <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
              {['all','budget','mid','luxury'].map(p=>(
                <button type="button" key={p} onClick={()=>setPriceRange(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${priceRange===p?'bg-[#174a37] text-white':'text-gray-500 hover:text-gray-700'}`}>
                  {p==='all'?'All':p==='budget'?'< 5k':p==='mid'?'5-15k':'> 15k'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-5">{displayCount} vendors found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map((v,i)=>(
            <Link key={v.id} href={`/vendors/${v.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0_0_0_/_0.05)] hover:shadow-[0_8px_30px_rgba(0_0_0_/_0.1)] transition-all group">
              <div className="h-44 overflow-hidden relative">
                <img src={IMGS[i%6]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                {v.verified && (
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#174a37] text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="p-4 min-w-0">
                <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-1 line-clamp-2">{v.name}</h3>
                <p className="text-gray-400 text-sm mb-3 truncate">📍 {v.location}</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <div className="flex">{[1,2,3,4,5].map(s=><span key={s} className={`text-xs ${s<=Math.round(parseFloat(v.rating))?'text-amber-400':'text-gray-200'}`}>★</span>)}</div>
                    <span className="text-gray-600 text-xs font-medium">{v.rating}</span>
                    <span className="text-gray-400 text-xs">({v.reviews})</span>
                  </div>
                  <p className="text-[#174a37] font-semibold text-sm shrink-0">From {v.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Pagination items={apiVendors} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
      </main>
      <Footer/>
    </div>
  );
}
