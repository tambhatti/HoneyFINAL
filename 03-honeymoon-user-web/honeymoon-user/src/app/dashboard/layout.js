'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserAuth } from '@/context/auth';
import { useApi } from '@/hooks/useApi';
import UserService from '@/lib/services/user.service';

const logoIcon = "/logo-icon.svg";
const logoText = "/logo-text.svg";
const logoArabic = "/logo-arabic.svg";

const navGroups = [
  {
    label: 'Planning',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
      { href: '/dashboard/ai-planner', label: 'AI Planner', icon: '✦', badge: '4' },
      { href: '/dashboard/getting-started', label: 'Getting Started', icon: '🚀' },
    ]
  },
  {
    label: 'Vendors',
    items: [
      { href: '/dashboard/vendors', label: 'Browse Vendors', icon: '🏛' },
      { href: '/dashboard/compare', label: 'Compare', icon: '⚖' },
      { href: '/dashboard/search', label: 'Search', icon: '🔍' },
    ]
  },
  {
    label: 'Bookings & Finance',
    items: [
      { href: '/dashboard/bookings', label: 'My Bookings', icon: '📋' },
      { href: '/dashboard/budget', label: 'Budget', icon: '💰' },
      { href: '/dashboard/payments', label: 'Payments', icon: '💳' },
    ]
  },
  {
    label: 'Communication',
    items: [
      { href: '/dashboard/chat', label: 'Messages', icon: '💬', badge: '2' },
      { href: '/dashboard/reviews', label: 'Reviews', icon: '⭐' },
      { href: '/dashboard/notifications', label: 'Notifications', icon: '🔔', badge: '3' },
      { href: '/dashboard/invite', label: 'Invite Team', icon: '👥' },
    ]
  },
  {
    label: 'Account',
    items: [
      { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
      { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
    ]
  },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user } = useUserAuth();
  const { data: notificationsData } = useApi(UserService.getNotifications, { limit: 50, isRead: false });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Your account';
  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'HM';
  const membershipLabel = user?.email || 'Planning dashboard';
  const unreadNotifications = notificationsData?.total || 0;

  return (
    <div className="flex min-h-screen min-h-dvh bg-[#f9f6ef] w-full min-w-0">
      {mobileOpen && (
        <button type="button" aria-label="Close menu" className="fixed inset-0 bg-black/50 z-30 lg:hidden border-0 p-0 cursor-pointer overscroll-contain" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`bg-[#174a37] flex flex-col fixed lg:sticky top-0 h-dvh max-h-dvh z-40 transition-all duration-300 shrink-0
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Link href="/" className="flex items-center gap-3 px-5 py-5 border-b border-white/10 hover:bg-white/5 transition-colors shrink-0">
          <img src={logoIcon} alt="HoneyMoon" className="h-10 w-auto object-contain shrink-0" />
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <img src={logoText} alt="honeymoon" className="h-[16px] w-auto object-contain" />
              <img src={logoArabic} alt="هني موون" className="h-[12px] w-auto object-contain mt-0.5" />
            </div>
          )}
        </Link>

        {!collapsed && (
          <div className="mx-3 my-3 bg-white/10 rounded-xl px-4 py-3 shrink-0">
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Account</p>
            <p className="text-white text-sm font-medium">{fullName}</p>
            <p className="text-[#CFB383] text-xs mt-0.5 truncate">{membershipLabel}</p>
          </div>
        )}

        <nav className="flex-1 px-2 py-2 overflow-y-auto overscroll-y-contain touch-pan-y scrollbar-hide min-h-0">
          {navGroups.map(group => (
            <div key={group.label} className="mb-3">
              {!collapsed && (
                <p className="text-white/20 text-[10px] uppercase tracking-widest px-3 mb-1.5">{group.label}</p>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map(({ href, label, icon, badge }) => {
                  const active = isActive(href);
                  return (
                    <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        active ? 'bg-[#CFB383] text-white' : 'text-white/55 hover:bg-white/10 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`}>
                      <span className="text-[15px] shrink-0 w-5 text-center leading-none">{icon}</span>
                      {!collapsed && <span className="text-[13px] font-medium flex-1 truncate">{label}</span>}
                      {!collapsed && badge && (
                        <span className={`text-[10px] rounded-full w-5 h-5 flex items-center justify-center shrink-0 ${active ? 'bg-white/25 text-white' : 'bg-[#CFB383] text-white'}`}>
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 shrink-0">
          <button type="button" onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-full items-center gap-3 px-4 py-3 text-white/30 hover:text-white/60 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}>
            <span>{collapsed ? '→' : '←'}</span>
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[rgba(184_154_105_/_0.15)] h-[68px] flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 -ml-1" aria-label="Open menu">
              <div className="flex flex-col gap-1.5">
                <span className="block w-5 h-0.5 bg-[#1a1a1a]/60" />
                <span className="block w-5 h-0.5 bg-[#1a1a1a]/60" />
                <span className="block w-4 h-0.5 bg-[#1a1a1a]/60" />
              </div>
            </button>
            <Link href="/dashboard/search"
              className="bg-[#f9f6ef] border border-[rgba(184_154_105_/_0.15)] rounded-full h-9 w-44 md:w-72 flex items-center px-4 gap-2 hover:border-[#CFB383] transition-colors">
              <span className="text-black/25 text-sm">🔍</span>
              <span className="text-sm text-black/25 hidden sm:block">Search...</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/dashboard/notifications" className="relative">
              <span className="text-black/40 text-xl hover:text-black/70 transition-colors">🔔</span>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#CFB383] text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-medium">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#174a37] rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0">{initials}</div>
              <div className="hidden md:block">
                <p className="text-[#1a1a1a] text-sm font-medium leading-none">{fullName}</p>
                <p className="text-black/35 text-xs mt-0.5 truncate max-w-[180px]">{membershipLabel}</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto overscroll-y-contain min-w-0 w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
