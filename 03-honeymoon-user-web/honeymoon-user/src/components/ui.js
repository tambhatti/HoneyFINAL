'use client'
import { useState } from 'react'
import Link from 'next/link'
import { imgGlobeOutline as imgGlobe, imgFacebookIcon, imgTrophyBadge, imgShieldIcon } from '@/lib/inlineIcons'

// Image assets
const imgGroup180 = "/logo-icon.svg"
const imgHoneymoon = "/logo-text.svg"
const imgArabic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
const imgGroup182 = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80"
const imgHoneymoon1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80"
const imgArabic1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
const imgFacebook = imgFacebookIcon
const imgFacebook1 = imgFacebookIcon

const NAV_ITEMS = ['Home', 'About', 'Budget Estimation', 'Vendors', 'Services', 'Contact Us']

export function PublicNavbar({ activePage = 'Home', dark = false }) {
  return (
    <nav className="w-full fixed top-0 left-0 z-50" style={{ background: 'rgba(23,74,55,0.95)', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)', height: '112px' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img src={imgGroup180} alt="HoneyMoon Icon" className="w-[52px] h-[55px] object-contain" />
          <div className="flex flex-col">
            <img src={imgHoneymoon} alt="honeymoon" className="h-[20px] object-contain" style={{ width: '183px' }} />
            <img src={imgArabic} alt="هني موون" className="h-[16px] object-contain mt-1" style={{ width: '183px' }} />
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-white text-[14px] uppercase tracking-wide hover:text-[#CFB383] transition-colors"
              style={{ fontWeight: item === activePage ? 700 : 400 }}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={imgGlobe} alt="" className="w-[18px] h-[18px]" />
            <span className="text-white text-[14px] uppercase">Eng</span>
          </div>
          <Link href="/login" className="relative overflow-hidden rounded-[7.5px] px-5 py-2.5 text-white text-[14px] uppercase border border-white/30 hover:border-[#CFB383] transition-colors whitespace-nowrap">
            Sign Up | Login
          </Link>
        </div>
      </div>
    </nav>
  )
}

export function LoggedInNavbar({ user = { name: 'Rashed Kabir' } }) {
  return (
    <nav className="w-full fixed top-0 left-0 z-50" style={{ background: 'rgba(23,74,55,0.97)', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)', height: '112px' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
          <img src={imgGroup180} alt="HoneyMoon Icon" className="w-[52px] h-[55px] object-contain" />
          <div className="flex flex-col">
            <img src={imgHoneymoon} alt="honeymoon" className="h-[20px] object-contain" style={{ width: '183px' }} />
            <img src={imgArabic} alt="هني موون" className="h-[16px] object-contain mt-1" style={{ width: '183px' }} />
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {['Dashboard', 'Vendors', 'Budget', 'Bookings', 'Services'].map(item => (
            <Link
              key={item}
              href={`/dashboard/${item.toLowerCase()}`}
              className="text-white text-[14px] uppercase tracking-wide hover:text-[#CFB383] transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={imgGlobe} alt="" className="w-[18px] h-[18px]" />
            <span className="text-white text-[14px] uppercase">Eng</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#CFB383] flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0)}
            </div>
            <span className="text-white text-sm">{user.name}</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer style={{ background: '#1a1a1a' }} className="w-full pt-16 pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Left – Logo + Copyright */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src={imgGroup182} alt="HoneyMoon Icon" className="w-[71px] h-[76px] object-contain" />
              <div className="flex flex-col">
                <img src={imgHoneymoon1} alt="honeymoon" className="h-[28px] object-contain" style={{ width: '252px' }} />
                <img src={imgArabic1} alt="هني موون" className="h-[22px] object-contain mt-1" style={{ width: '252px' }} />
              </div>
            </div>
            <p className="text-white/60 text-[16px] tracking-wider uppercase">
              Copyright © HoneyMoon. All rights reserved.
            </p>
          </div>

          {/* Right – Subscribe + Address + Links + Social */}
          <div className="flex flex-col gap-8 min-w-0 md:min-w-[500px]">
            {/* Subscribe */}
            <div className="border-b border-white/50 pb-4 flex items-center justify-between">
              <span className="text-white text-[24px]">rakabir@gmail.com</span>
              <div className="cursor-pointer">
                <svg width="24" height="10" viewBox="0 0 24 10" fill="none">
                  <path d="M1 5H23M23 5L19 1M23 5L19 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Address */}
            <p className="text-white/60 text-[19px] leading-8">
              210 Qilo Stereet, California,<br />Main OC, USA
            </p>

            {/* Nav links */}
            <div className="flex gap-6 flex-wrap">
              {['Home', 'About', 'Vendors', 'Services', 'Contact'].map((item, i) => (
                <span key={item}>
                  <Link href={`/${item.toLowerCase()}`} className={`text-[18px] ${i === 0 ? 'text-white' : 'text-white/30'} hover:text-[#CFB383] transition-colors`}>
                    {item}
                  </Link>
                  {i < 4 && <span className="text-white/30 ml-6">.</span>}
                </span>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {[
                { label: 'X', img: imgFacebook1, text: 'X' },
                { label: 'Fb', img: imgFacebook, text: 'Fb' },
                { label: 'In', img: imgFacebook, text: 'In' },
                { label: 'Li', img: imgFacebook, text: 'Li' },
              ].map(({ label, img, text }) => (
                <button type="button" key={label} className="relative w-12 h-12 flex items-center justify-center cursor-pointer" aria-label={label}>
                  <img src={img} alt={label} className="absolute inset-0 w-full h-full object-contain" />
                  <span className={`relative z-10 text-[16px] font-bold ${label === 'X' ? 'text-[#060606]' : 'text-white'}`}>{text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function SmartAssistantBadge() {
  return (
    <div className="fixed bottom-6 right-4 sm:bottom-10 sm:right-10 z-40 flex flex-col items-center gap-2 cursor-pointer max-w-[calc(100vw-2rem)]">
      <div className="relative w-[89px] h-[89px] max-w-full">
        <img src={imgTrophyBadge} alt="" className="w-full h-full object-contain" />
        <img src={imgShieldIcon} alt="" className="absolute inset-0 m-auto w-[65px] h-[69px] object-contain" />
      </div>
      <p className="text-[13px] text-center uppercase whitespace-nowrap" style={{ color: '#fff6e9', lineHeight: '20px' }}>
        Smart Wedding<br />Assistant
      </p>
    </div>
  )
}
