'use client';
import { usePaginated, useApi } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';

const imgs = {
  heroBg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  heroOverlay: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
  featuresBg: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1600&q=80",
  howBg: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80",
  venueImg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  photoImg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  beautyImg: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
  featuresPhoto: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
};

const STATIC_SERVICE_CARDS = [
  { icon: '✦', title: 'AI Vendor Matching', desc: 'Our intelligent algorithm matches you with vendors based on your budget, style, and wedding date — with live availability.', img: imgs.venueImg, price: 'Free' },
  { icon: '📋', title: 'Full Planning Package', desc: 'A dedicated wedding planner coordinates everything from vendor selection to day-of logistics. Pure luxury, zero stress.', img: imgs.photoImg, price: 'From AED 15,000' },
  { icon: '💰', title: 'Budget Management', desc: 'AI-powered budget tracking with real-time spend analysis, automatic categorization, and smart spending recommendations.', img: imgs.beautyImg, price: 'Free with account' },
  { icon: '💬', title: 'Direct Vendor Chat', desc: 'Communicate directly with all your vendors in one secure platform. No more chasing emails or losing track of conversations.', img: imgs.featuresPhoto, price: 'Free with account' },
];

function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-w-0 mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

export default function ServicesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { items: apiServices, loading, total, hasMore, nextPage } = usePaginated(UserService.getServices, { search, category });
  const { data: catData } = useApi(UserService.getCategories);
  const categories = catData?.categories || [];
  const serviceCards = apiServices?.length ? apiServices : STATIC_SERVICE_CARDS;
  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen min-h-dvh w-full min-w-0">
      <PublicNav activeHref="/services" />

      <section className="relative min-h-[300px] sm:min-h-[400px] md:h-[480px] flex items-center overflow-hidden">
        <img src={imgs.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={imgs.heroOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-[88px] min-w-0 w-full pb-6 sm:pb-0">
          <p className="text-[#CFB383] text-[14px] uppercase tracking-[4px] mb-4">What We Offer</p>
          <h1 className="font-baskerville text-[32px] sm:text-[44px] md:text-[56px] lg:text-[72px] leading-tight sm:leading-[52px] md:leading-[64px] lg:leading-[80px] text-[#fff6e9] capitalize max-w-[720px]">
            Services Built for Luxury Weddings
          </h1>
          <p className="text-[#fff6e9]/70 text-[18px] max-w-[520px] mt-6 leading-7">
            From AI matching to full concierge planning — every service designed for perfection.
          </p>
        </div>
      </section>

      <section className="bg-[#f9f6ef] py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {serviceCards.map((s, i) => (
              <div key={s.title || s.id || i} className={`rounded-2xl overflow-hidden border ${i < 2 ? 'border-[rgba(23_74_55_/_0.2)] bg-white' : 'border-[rgba(184_154_105_/_0.2)] bg-white'} hover:shadow-[0_8px_30px_rgba(0_0_0_/_0.08)] transition-shadow`}>
                <div className="h-52 overflow-hidden">
                  <img src={s.img || s.image} alt={s.title || s.name || ''} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 sm:p-8">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#174a37] rounded-xl flex items-center justify-center text-[#CFB383] text-lg shrink-0">{s.icon || '✦'}</div>
                    <span className="text-[#CFB383] text-sm font-medium bg-[#F5F5EF] px-3 py-1 rounded-full shrink-0">{s.price}</span>
                  </div>
                  <h3 className="font-baskerville text-xl sm:text-2xl md:text-[28px] text-[#174a37] mb-3 break-words">{s.title || s.name}</h3>
                  <p className="text-black/60 text-[15px] leading-7 mb-6">{s.desc || s.description}</p>
                  <Link href="/signup" className="inline-flex items-center gap-2 text-[#174a37] text-sm font-medium hover:text-[#CFB383] transition-colors">
                    Get Started →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
        <img src={imgs.featuresBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 min-w-0">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[#CFB383] text-[14px] uppercase tracking-[4px] mb-4">Pricing</p>
            <h2 className="font-baskerville text-[28px] md:text-[40px] lg:text-[52px] leading-[36px] md:leading-[48px] lg:leading-[60px] text-white capitalize">Simple, Transparent Plans</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { plan: 'Free', price: 'AED 0', features: ['AI vendor matching', 'Up to 5 shortlists', 'Basic budget tracker', 'Vendor messaging'], cta: 'Get Started' },
              { plan: 'Premium', price: 'AED 299/mo', features: ['Unlimited AI matches', 'Priority vendor access', 'Full budget management', 'Dedicated chat support', 'Payment processing'], cta: 'Start Free Trial', featured: true },
              { plan: 'Concierge', price: 'AED 999/mo', features: ['Everything in Premium', 'Dedicated wedding planner', 'Venue site visits', 'Day-of coordination', 'White-glove service'], cta: 'Contact Us' },
            ].map(p => (
              <div key={p.plan} className={`rounded-2xl p-5 sm:p-8 ${p.featured ? 'bg-[#CFB383]' : 'bg-white/10 border border-white/20'}`}>
                <p className={`text-sm font-medium uppercase tracking-wider mb-2 ${p.featured ? 'text-white/80' : 'text-white/60'}`}>{p.plan}</p>
                <p className={`font-baskerville text-[24px] md:text-[32px] lg:text-[40px] mb-6 ${p.featured ? 'text-white' : 'text-[#CFB383]'}`}>{p.price}</p>
                <div className="flex flex-col gap-3 mb-8">
                  {p.features.map(f => (
                    <p key={f} className={`text-sm flex items-center gap-2 ${p.featured ? 'text-white' : 'text-white/70'}`}>
                      <span>✓</span> {f}
                    </p>
                  ))}
                </div>
                <Link href="/signup" className={`w-full flex items-center justify-center py-3 rounded-[10px] text-sm font-medium transition-colors ${p.featured ? 'bg-white text-[#CFB383] hover:bg-[#F5F5EF]' : 'border border-white/40 text-white hover:bg-white/10'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Pagination items={apiServices} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
