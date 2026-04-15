'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/auth';
import { LogoutModal } from '@/components/Modals';

const NAV = [
  { href:'/dashboard',                    label:'Dashboard',             icon:'⊞' },
  { href:'/dashboard/users',              label:'User Management',        icon:'👥' },
  { href:'/dashboard/vendors',            label:'Vendor Management',      icon:'🏛' },
  { href:'/dashboard/categories',         label:'Category Management',    icon:'📂' },
  { href:'/dashboard/commission',         label:'Commission Management',  icon:'💹' },
  { href:'/dashboard/subscriptions',      label:'Subscription Management',icon:'💳' },
  { href:'/dashboard/bookings',           label:'Booking Management',     icon:'📋' },
  { href:'/dashboard/reported-bookings',  label:'Reported Bookings',      icon:'🚩' },
  { href:'/dashboard/meeting-requests',   label:'Meeting Requests',       icon:'🤝' },
  { href:'/dashboard/referral',           label:'Referral Program',       icon:'🔗' },
  { href:'/dashboard/loyalty',            label:'Loyalty Program',        icon:'⭐' },
  { href:'/dashboard/payouts',            label:'Payouts Management',     icon:'💰' },
  { href:'/dashboard/home-content',       label:'Home Content',           icon:'🏠' },
  { href:'/dashboard/push-notifications', label:'Push Notifications',     icon:'🔔' },
  { href:'/dashboard/payment-logs',       label:'Payment Logs',           icon:'💳' },
  { href:'/dashboard/subscription-logs',  label:'Subscription Logs',      icon:'📄' },
  { href:'/dashboard/queries',            label:'Queries',                icon:'❓' },
  { href:'/dashboard/ratings',            label:'Ratings & Reviews',      icon:'⭐' },
  { href:'/dashboard/reports',            label:'Reports',                icon:'📊' },
  { href:'/dashboard/settings',           label:'Settings',               icon:'⚙️' },
];

export default function DashboardLayout({ children }) {
  const pathname       = usePathname();
  const router         = useRouter();
  const { admin, isLoggedIn, isLoading, logout } = useAdminAuth();
  const [showLogout,   setShowLogout]   = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const menuRef = useRef(null);

  /* Auth guard — redirect to login if not authenticated */
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = async () => {
    setShowLogout(false);
    await logout();
    router.replace('/login');
  };

  const isActive = href => href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);
  const adminName = admin ? `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.name || 'Admin' : 'Admin';
  const avatarUrl = admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=174a37&color=CFB383&size=200`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5EF]">
        <div className="text-[#174a37] text-4xl animate-spin">✦</div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="flex flex-col min-h-screen min-h-dvh bg-[#F5F5EF] w-full min-w-0">
      {showLogout && <LogoutModal onYes={handleLogout} onNo={() => setShowLogout(false)} />}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-[70px] bg-[#174a37] flex items-center justify-between px-4 md:px-6 shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 -ml-1 mr-1" aria-label="Open menu">
            <div className="flex flex-col gap-1.5">
              <span className="block w-5 h-0.5 bg-white/70" />
              <span className="block w-5 h-0.5 bg-white/70" />
              <span className="block w-4 h-0.5 bg-white/70" />
            </div>
          </button>
          <div className="w-10 h-10 border-2 border-[#CFB383] rounded-full flex items-center justify-center">
            <img src="/logo-icon.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
          <div className="hidden sm:block">
            <img src="/logo-text.svg" alt="HONEYMOON" className="h-3.5" />
            <img src="/logo-arabic.svg" alt="" className="h-2.5 mt-0.5" />
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-5">
          <Link href="/dashboard/notifications" className="relative text-white/70 hover:text-white transition-colors">
            <span className="text-xl">🔔</span>
          </Link>
          <div className="relative" ref={menuRef}>
            <button type="button" onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#CFB383]/40">
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-white text-sm font-medium hidden md:block">{adminName}</span>
              <span className="text-white/50 text-xs hidden sm:block">▾</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-[rgba(184,154,105,0.2)] rounded-xl shadow-xl py-1.5 w-44 z-50">
                <Link href="/dashboard/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F5F5EF] transition-colors">👤 My Profile</Link>
                <Link href="/dashboard/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F5F5EF] transition-colors">⚙️ Settings</Link>
                <button type="button" onClick={() => { setShowUserMenu(false); setShowLogout(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">🚪 Log Out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex pt-[70px] min-h-0 flex-1 w-full min-w-0">
        {sidebarOpen && (
          <button type="button" aria-label="Close menu" className="fixed inset-0 bg-black/50 z-30 lg:hidden border-0 p-0 cursor-pointer overscroll-contain" onClick={() => setSidebarOpen(false)} />
        )}
        <aside className={`fixed top-[70px] bottom-0 w-[260px] bg-[#174a37] overflow-y-auto overscroll-y-contain touch-pan-y scrollbar-hide z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:left-0`}>
          <nav className="p-3 py-4">
            {NAV.map(({ href, label, icon }) => {
              const active = isActive(href);
              return (
                <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-0.5 transition-all text-sm ${active ? 'bg-[#CFB383] text-white font-medium shadow-[0_2px_8px_rgba(184,154,105,0.4)]' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                  <span className="text-base w-5 text-center shrink-0">{icon}</span>
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-[260px] min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
