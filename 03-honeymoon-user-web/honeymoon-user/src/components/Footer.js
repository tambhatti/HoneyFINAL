'use client';
import { useState } from 'react';
import Link from 'next/link';

const footerLogoIcon = "/logo-icon.svg";
const footerLogoText = "/logo-text.svg";
const footerArabic = "/logo-arabic.svg";

export default function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer className="bg-[#1a1a1a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-10 justify-between min-w-0">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={footerLogoIcon} alt="" className="h-14 w-auto" />
            <div>
              <img src={footerLogoText} alt="honeymoon" className="h-[22px] w-auto" />
              <img src={footerArabic} alt="" className="h-[18px] w-auto mt-0.5" />
            </div>
          </div>
          <p className="text-white/50 text-sm leading-6">Copyright © HoneyMoon. All Rights Reserved.</p>
          <p className="text-white/40 text-sm mt-1">210 Qilo Stereet, California, Main OC, USA</p>
        </div>
        <div className="flex-1 max-w-[500px]">
          <div className="border-b border-white/30 pb-2 mb-5 flex items-center gap-2">
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="rakabir@gmail.com"
              className="bg-transparent text-white text-lg flex-1 outline-none placeholder-white/30" />
            <span className="text-white/40 hover:text-white cursor-pointer transition-colors">→</span>
          </div>
          <div className="flex items-center gap-4 mb-5">
            {['X','Fb','In','Li'].map(s => (
              <button type="button" key={s} className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 text-sm font-medium transition-colors" aria-label={`Social ${s}`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap">
            {['Home','About','Vendors','Services','Contact'].map(l => (
              <Link key={l} href={l === 'Home' ? '/' : `/${l.toLowerCase()}`}
                className="text-white/50 text-sm hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
