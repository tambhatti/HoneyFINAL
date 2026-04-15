'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const logoIcon = "/logo-icon.svg";
const logoText = "/logo-text.svg";
const logoArabic = "/logo-arabic.svg";

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Budget Estimation', href: '/budget-estimation' },
  { label: 'Vendors', href: '/vendors' },
  { label: 'Services', href: '/services' },
  { label: 'Contact Us', href: '/contact' },
];

export default function LoggedInNav({ notifCount = 3 }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  return (
    <>
      <nav className="bg-[#174a37] h-[68px] flex items-center px-4 sm:px-6 lg:px-10 justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <img src={logoIcon} alt="" className="h-10 w-auto" />
          <div className="hidden sm:flex flex-col">
            <img src={logoText} alt="honeymoon" className="h-[16px] w-auto" />
            <img src={logoArabic} alt="" className="h-[12px] w-auto mt-0.5" />
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href}
              className={`text-[13px] uppercase tracking-wide hover:text-white transition-colors ${
                pathname === l.href ? 'text-white font-bold' : 'text-white/75'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/notifications" className="relative text-white/70 hover:text-white transition-colors">
            <span className="text-xl">🔔</span>
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#CFB383] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{notifCount}</span>
            )}
          </Link>
          <div className="relative">
            <button type="button" onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors" aria-expanded={profileOpen} aria-haspopup="true">
              <div className="w-8 h-8 bg-[#CFB383] rounded-full flex items-center justify-center text-white text-sm font-medium">JH</div>
              <span className="hidden md:block text-sm">John H.</span>
              <span className="text-white/50 text-xs hidden sm:block">▾</span>
            </button>
            {profileOpen && (
              <>
                <button type="button" aria-label="Close account menu" className="fixed inset-0 z-40 border-0 p-0 bg-transparent cursor-pointer overscroll-contain" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-[rgba(184_154_105_/_0.2)] py-2 w-44 z-50">
                  {[
                    { label: 'My Profile', href: '/my-profile' },
                    { label: 'My Bookings', href: '/my-bookings' },
                    { label: 'My Budgets', href: '/my-budgets' },
                    { label: 'Wishlist', href: '/wishlist' },
                    { label: 'Notifications', href: '/notifications' },
                    { label: 'Loyalty Points', href: '/loyalty' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#F5F5EF] hover:text-[#174a37] transition-colors">
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-[rgba(184_154_105_/_0.1)] mt-1 pt-1">
                    <Link href="/login" onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      Logout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Mobile hamburger */}
          <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden flex flex-col gap-1.5 p-1 ml-1" aria-label="Toggle menu">
            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="bg-[#174a37] border-t border-white/10 py-2 shadow-lg lg:hidden sticky top-[68px] z-40 max-h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain touch-pan-y">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-[14px] uppercase tracking-wide transition-colors hover:bg-white/10 ${
                pathname === l.href ? 'text-[#CFB383] font-bold' : 'text-white/80'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
