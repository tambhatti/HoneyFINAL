'use client';
import Link from 'next/link';
import { useApi } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useUserAuth } from '../../context/auth';

const FALLBACK_VENDOR_IMAGE = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80';
const CATEGORY_IMAGES = {
  Venue: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
  Photography: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  Beauty: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
  Catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
  Flowers: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80',
  Decoration: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
  Jewelry: 'https://images.unsplash.com/photo-1515562141589-67f0d99e2954?w=800&q=80',
};

function formatCurrency(value) {
  return `AED ${Number(value || 0).toLocaleString()}`;
}

function initials(name) {
  return (name || 'HM')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function vendorImage(vendor) {
  return vendor?.avatar || CATEGORY_IMAGES[vendor?.category] || FALLBACK_VENDOR_IMAGE;
}

function StatusBadge({ status }) {
  const colors = {
    Confirmed: 'bg-green-100 text-green-700',
    Upcoming: 'bg-blue-100 text-blue-700',
    Pending: 'bg-amber-100 text-amber-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status || 'Pending'}
    </span>
  );
}

export default function DashboardHome() {
  const { user } = useUserAuth();
  const { data: homeData } = useApi(UserService.getHome);
  const { data: bookingsData } = useApi(UserService.getBookings, { limit: 3 });
  const { data: budgetsData } = useApi(UserService.getBudgets, { limit: 4 });
  const { data: wishlistData } = useApi(UserService.getWishlist);

  const featuredVendors = homeData?.featuredVendors || [];
  const categories = homeData?.categories || [];
  const bookings = bookingsData?.data || [];
  const budgets = budgetsData?.data || [];
  const wishlist = wishlistData?.wishlist || [];
  const activeBudget = budgets[0];
  const allocations = activeBudget?.allocations || {};
  const spent = activeBudget?.spent || {};
  const budgetCats = Object.keys(allocations).slice(0, 4).map((key) => ({
    cat: key,
    budgeted: Number(allocations[key] || 0),
    spent: Number(spent[key] || 0),
  }));

  const bookingCount = bookingsData?.total || bookings.length;
  const wishlistCount = wishlist.length;
  const totalBudget = Number(activeBudget?.totalBudget || 0);
  const totalSpent = Object.values(spent).reduce((sum, value) => sum + Number(value || 0), 0);
  const budgetUsedPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const stats = [
    { label: 'Active Bookings', value: bookingCount, change: `${bookings.filter((b) => b.status === 'Pending').length} pending`, icon: '📋' },
    { label: 'Vendors Shortlisted', value: wishlistCount, change: `${featuredVendors.length} featured now`, icon: '🏛' },
    { label: 'Budget Used', value: `${budgetUsedPct}%`, change: totalBudget ? `${formatCurrency(totalSpent)} / ${formatCurrency(totalBudget)}` : 'No budget created yet', icon: '💰' },
    { label: 'Categories', value: categories.length, change: 'Explore more vendors', icon: '💍' },
  ];

  const heroName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Your wedding';
  const aiMatches = featuredVendors.slice(0, 3);

  return (
    <div className="w-full max-w-[1200px] min-w-0 pb-6">
      <div className="bg-[#174a37] rounded-2xl p-5 sm:p-6 md:p-8 mb-6 sm:mb-8 relative overflow-hidden min-w-0">
        <div className="absolute right-4 top-4 w-24 h-24 bg-white/5 rounded-full" />
        <div className="absolute right-16 top-12 w-16 h-16 bg-[#CFB383]/10 rounded-full" />
        <p className="text-white/50 text-sm uppercase tracking-wider">Welcome back</p>
        <h1 className="font-baskerville text-[26px] sm:text-[32px] md:text-[42px] text-[#CFB383] mt-1 mb-3 break-words">
          {heroName}
        </h1>
        <p className="text-white/60 text-sm md:text-base max-w-[520px] mb-6">
          {featuredVendors.length
            ? `We found ${featuredVendors.length} featured vendors and ${categories.length} categories ready for your next planning step.`
            : 'Start exploring vendors, budgets, and bookings from one place.'}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link href="/dashboard/ai-planner"
            className="bg-[#CFB383] text-white text-sm font-medium px-6 py-2.5 rounded-[10px] hover:bg-[#B8A06E] transition-colors text-center w-full sm:w-auto">
            Open AI Planner ✦
          </Link>
          <Link href="/dashboard/vendors"
            className="border border-white/20 text-white text-sm font-medium px-6 py-2.5 rounded-[10px] hover:bg-white/10 transition-colors text-center w-full sm:w-auto">
            Browse Vendors
          </Link>
          <Link href="/dashboard/getting-started"
            className="text-white/40 text-sm hover:text-white/60 transition-colors text-center sm:text-left py-1">
            Setup checklist →
          </Link>
        </div>
      </div>

      <div className="flex gap-2 mb-6 min-w-0 items-stretch sm:items-center">
        <Link href="/dashboard/search" className="flex-1 min-w-0 flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 sm:px-5 min-h-[52px] h-[52px] hover:border-[#CFB383] transition-colors">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-sm text-gray-400">Search vendors, services, and bookings...</span>
        </Link>
        <Link href="/dashboard/search" className="w-[52px] h-[52px] shrink-0 bg-[#174a37] rounded-full flex items-center justify-center" aria-label="Search">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 7h2v2H3V7zm0 4h2v2H3v-2zm0 4h2v2H3v-2zm4-8h14v2H7V7zm0 4h14v2H7v-2zm0 4h14v2H7v-2z"/></svg>
        </Link>
      </div>

      <div className="bg-[#CFB383] rounded-[20px] p-6 md:p-8 mb-8 text-center">
        <h2 className="font-baskerville text-[24px] md:text-[28px] text-[#1a1a1a] mb-2">Plan Your Wedding Budget</h2>
        <p className="text-[#1a1a1a]/70 text-sm mb-5">
          {activeBudget ? `${activeBudget.name} is your latest saved budget.` : 'Quick questions. Instant wedding cost estimate.'}
        </p>
        <Link href={activeBudget ? '/dashboard/budget' : '/budget-estimation'}
          className="inline-flex items-center gap-2 bg-[#174a37] text-white text-sm font-medium px-8 py-3.5 rounded-full hover:bg-[#1a5c45] transition-colors w-full max-w-[400px] justify-center">
          {activeBudget ? 'Manage Budget' : 'Estimate Budget'}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" /></svg>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4 min-w-0">
          <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a]">Featured Vendors</h2>
          <Link href="/dashboard/vendors" className="text-[#CFB383] text-sm font-medium hover:underline shrink-0">See all</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto overscroll-x-contain touch-pan-x pb-2 scrollbar-hide -mx-2 px-2">
          {(featuredVendors.length ? featuredVendors : []).map((vendor) => {
            const vendorName = vendor.companyName || `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim() || 'Vendor';
            return (
              <Link key={vendor.id} href={`/dashboard/vendors/${vendor.id}`} className="shrink-0 w-[155px] group">
                <div className="h-[102px] rounded-lg overflow-hidden mb-2">
                  <img src={vendorImage(vendor)} alt={vendorName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="font-medium text-sm text-[#1a1a1a] truncate">{vendorName}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{vendor.category || 'Wedding services'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-amber-400">★</span>
                  <span className="text-xs text-black/50">{vendor.rating || 0}</span>
                  <span className="text-xs text-gray-400">({vendor.reviewCount || 0})</span>
                </div>
              </Link>
            );
          })}
          {!featuredVendors.length && (
            <div className="text-sm text-gray-400 px-2 py-4">No featured vendors available yet.</div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4 min-w-0">
          <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a]">Categories</h2>
          <Link href="/vendors" className="text-[#CFB383] text-sm font-medium hover:underline shrink-0">See all</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto overscroll-x-contain touch-pan-x pb-2 scrollbar-hide -mx-2 px-2">
          {(categories.length ? categories : []).map((category) => (
            <Link key={category.id || category.name} href={`/vendors/category/${encodeURIComponent((category.name || '').toLowerCase())}`}
              className="shrink-0 w-[138px] h-[188px] rounded-lg overflow-hidden relative group">
              <img src={CATEGORY_IMAGES[category.name] || FALLBACK_VENDOR_IMAGE} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-white font-medium text-base">{category.name}</p>
                <p className="text-white/70 text-xs">{category.vendorCount || 0} vendors</p>
              </div>
            </Link>
          ))}
          {!categories.length && (
            <div className="text-sm text-gray-400 px-2 py-4">No categories available yet.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, change, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-4 md:p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] min-w-0">
            <div className="flex items-center justify-between mb-3 gap-2 min-w-0">
              <span className="text-xl shrink-0">{icon}</span>
              <span className="text-[#CFB383] text-[10px] uppercase tracking-wider shrink-0">Live</span>
            </div>
            <p className="font-baskerville text-[28px] md:text-[36px] text-[#1a1a1a] tabular-nums break-words">{value}</p>
            <p className="text-black/50 text-xs md:text-sm mt-0.5 break-words">{label}</p>
            <p className="text-[#174a37] text-xs mt-1.5 break-words">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 md:p-6 border-b border-[rgba(184_154_105_/_0.1)] min-w-0">
            <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a]">Upcoming Bookings</h2>
            <Link href="/dashboard/bookings" className="text-[#CFB383] text-sm hover:underline shrink-0">View all →</Link>
          </div>
          <div className="divide-y divide-[rgba(184_154_105_/_0.08)]">
            {bookings.map((booking) => (
              <Link key={booking.id} href={`/dashboard/bookings/${booking.id}`}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 p-4 md:p-5 hover:bg-[#faf7f0] transition-colors group min-w-0">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-[#F5F5EF] flex items-center justify-center text-[#174a37] font-semibold">
                    {initials(booking.vendor?.companyName || booking.service?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1a1a1a] text-sm truncate">{booking.vendor?.companyName || 'Vendor'}</p>
                    <p className="text-black/40 text-xs mt-0.5">{booking.service?.name || 'Service'} · {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'Date TBD'}</p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:text-right shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t border-[rgba(184_154_105_/_0.06)] sm:border-0">
                  <StatusBadge status={booking.status} />
                  <p className="text-[#1a1a1a] text-sm font-medium sm:mt-1 tabular-nums">{formatCurrency(booking.totalAmount)}</p>
                </div>
              </Link>
            ))}
            {!bookings.length && (
              <div className="p-5 text-sm text-gray-400">No bookings yet. Start with a featured vendor above.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 md:p-6 border-b border-[rgba(184_154_105_/_0.1)] min-w-0">
            <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a]">AI Matches</h2>
            <span className="text-[#CFB383] text-xs px-2 py-1 bg-[#F5F5EF] rounded-full shrink-0 w-fit">✦ Live picks</span>
          </div>
          <div className="divide-y divide-[rgba(184_154_105_/_0.08)]">
            {aiMatches.map((vendor, index) => {
              const vendorName = vendor.companyName || `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim() || 'Vendor';
              const match = Math.max(85, 98 - index * 3);
              return (
                <Link key={vendor.id} href={`/dashboard/vendors/${vendor.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-[#faf7f0] transition-colors group">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                    <img src={vendorImage(vendor)} alt={vendorName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1a1a1a] text-sm truncate">{vendorName}</p>
                    <p className="text-black/40 text-xs">{vendor.category || 'Wedding services'}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-amber-400">★</span>
                      <span className="text-xs text-black/50">{vendor.rating || 0}</span>
                    </div>
                  </div>
                  <span className="bg-[#174a37] text-white text-xs px-2 py-0.5 rounded-full shrink-0">{match}%</span>
                </Link>
              );
            })}
            {!aiMatches.length && (
              <div className="p-5 text-sm text-gray-400">More matches will appear once featured vendors are available.</div>
            )}
          </div>
          <div className="p-4">
            <Link href="/dashboard/ai-planner"
              className="w-full flex items-center justify-center gap-2 bg-[#F5F5EF] text-[#174a37] text-sm font-medium py-2.5 rounded-[10px] hover:bg-[#e8dfc5] transition-colors">
              ✦ See All AI Matches
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] shadow-[0_0_30px_rgba(0_0_0_/_0.04)] p-5 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6 min-w-0">
          <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a]">Budget Overview</h2>
          <Link href="/dashboard/budget" className="text-[#CFB383] text-sm hover:underline shrink-0">Manage →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {budgetCats.map(({ cat, budgeted, spent: catSpent }) => {
            const pct = budgeted > 0 ? Math.min(100, Math.round((catSpent / budgeted) * 100)) : 0;
            return (
              <div key={cat}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-[#1a1a1a]">{cat}</span>
                  <span className="text-xs text-black/40">{pct}%</span>
                </div>
                <div className="h-1.5 bg-[#F5F5EF] rounded-full overflow-hidden">
                  <div className="h-full bg-[#CFB383] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-black/40">{formatCurrency(catSpent)}</span>
                  <span className="text-xs text-black/20">/ {formatCurrency(budgeted)}</span>
                </div>
              </div>
            );
          })}
          {!budgetCats.length && (
            <div className="sm:col-span-2 lg:col-span-4 text-sm text-gray-400">Create a budget to track your category-by-category spend here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
