'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { imgGlobeFilled as globe } from '@/lib/inlineIcons';

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

export default function PublicNav({
  activeHref = null,
  variant = 'marketing',
  ctaHref = '/login',
  ctaLabel = 'Sign Up | Login',
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState('Eng');

  const isSolid = variant === 'solid';

  useEffect(() => {
    if (isSolid) return;
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, [isSolid]);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[88px] flex items-center px-4 sm:px-6 lg:px-4 md:px-10 justify-between transition-all duration-300 ps-[env(safe-area-inset-left,0px)] pe-[env(safe-area-inset-right,0px)] ${
        isSolid || scrolled || mobileOpen ? 'bg-[#174a37] shadow-[0_2px_20px_rgba(0_0_0_/_0.2)]' : 'bg-transparent'
      }`}>
        <Link href="/" className="flex items-center gap-3">
          <img src={logoIcon} alt="Logo" className="h-[48px] lg:h-[55px] w-auto" />
          <div className="hidden sm:flex flex-col">
            <img src={logoText} alt="honeymoon" className="h-[18px] lg:h-[21px] w-auto" />
            <img src={logoArabic} alt="" className="h-[14px] lg:h-[16px] w-auto mt-1" />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href}
              className={`text-[13px] xl:text-[14px] uppercase tracking-wide transition-colors hover:text-white ${
                activeHref != null && l.href === activeHref ? 'text-white font-bold' : 'text-white/75 font-normal'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <button type="button" onClick={() => setLang(l => l === 'Eng' ? 'عربي' : 'Eng')} className="hidden md:flex items-center gap-2 text-white text-[13px] uppercase hover:opacity-80 transition-opacity" aria-label="Switch language">
            <img src={globe} alt="" className="w-[16px]" /> {lang}
          </button>
          <Link href={ctaHref}
            className="border border-white/40 text-white text-[13px] uppercase px-4 py-2 rounded-[7.5px] hover:bg-white/10 transition-colors whitespace-nowrap">
            {ctaLabel}
          </Link>
          {/* Mobile hamburger */}
          <button type="button" onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-1" aria-label="Toggle menu">
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-[88px] z-[35] bg-black/35 lg:hidden border-0 p-0 cursor-pointer overscroll-contain"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-[88px] left-0 right-0 bottom-0 z-40 overflow-y-auto bg-[#174a37] py-4 shadow-lg lg:hidden touch-pan-y overscroll-contain">
            {navLinks.map(l => (
              <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                className={`block px-6 py-3.5 text-[14px] uppercase tracking-wide transition-colors hover:bg-white/10 ${
                  activeHref != null && l.href === activeHref ? 'text-[#CFB383] font-bold' : 'text-white/80'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
