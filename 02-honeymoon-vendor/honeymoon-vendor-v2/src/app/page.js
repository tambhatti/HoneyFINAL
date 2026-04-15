'use client';
import Link from 'next/link';

const BG_HERO = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const BG_CTA  = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80";

const NAV_LINKS = [
  { label:'How It Works', href:'#how-it-works' },
  { label:'Benefits',     href:'#benefits' },
  { label:'Pricing',      href:'#pricing' },
  { label:'Contact',      href:'#contact' },
];

const BENEFITS = [
  { icon:'🎯', title:'Reach More Couples',       desc:'Get discovered by thousands of couples planning their weddings across the UAE and GCC.' },
  { icon:'📊', title:'Smart Dashboard',           desc:'Manage bookings, respond to enquiries, track earnings — all from one clean interface.' },
  { icon:'💰', title:'Transparent Earnings',      desc:'Set your own prices. Pay a small platform commission only on completed bookings.' },
  { icon:'📸', title:'Showcase Your Work',        desc:'Upload portfolio images, add packages, and let your work speak for itself.' },
  { icon:'⭐', title:'Build Your Reputation',     desc:'Collect verified reviews from real couples and grow your star rating over time.' },
  { icon:'📱', title:'Mobile-First Management',   desc:'Manage everything on the go with our fully responsive vendor portal.' },
];

const HOW_IT_WORKS = [
  { step:'01', title:'Sign Up & Get Verified',   desc:'Create your vendor profile and submit your documents. Our team reviews and approves within 24 hours.' },
  { step:'02', title:'Create Your Services',     desc:'Add your service packages with pricing, photos, and availability. Customise to match your offerings.' },
  { step:'03', title:'Receive Bookings',         desc:'Couples browse, compare, and book your services directly through the platform. You get notified instantly.' },
  { step:'04', title:'Get Paid',                 desc:'Payments are collected by the platform. Your payout is processed automatically after the booking is completed.' },
];

const PLANS = [
  { name:'Basic',    price:'199', period:'month', features:['Up to 3 services','Standard listing','Email support','Basic analytics'], highlight:false },
  { name:'Gold',     price:'499', period:'month', features:['Up to 10 services','Featured listing','Priority support','Full analytics','Banner promotion'], highlight:true },
  { name:'Platinum', price:'799', period:'month', features:['Unlimited services','Top placement','Dedicated manager','Advanced analytics','Banner + Profile featuring'], highlight:false },
];

export default function VendorHomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5EF] overflow-x-hidden">
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#174a37]/95 backdrop-blur-sm h-[70px] flex items-center px-4 sm:px-6 lg:px-10 justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 border-2 border-[#CFB383] rounded-full flex items-center justify-center">
            <img src="/logo-icon.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
          <div className="hidden sm:block">
            <img src="/logo-text.svg" alt="HONEYMOON" className="h-3.5" />
            <img src="/logo-arabic.svg" alt="" className="h-2.5 mt-0.5" />
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-white/70 hover:text-white text-sm transition-colors">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/login" className="text-white/70 hover:text-white text-sm transition-colors whitespace-nowrap">Login</Link>
          <Link href="/signup" className="bg-[#CFB383] hover:bg-[#B8A06E] text-white px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap">
            Join as Vendor
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center text-center pt-[70px]">
        <img src={BG_HERO} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#174a37]/70 via-[#174a37]/60 to-[#174a37]/80" />
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <span className="inline-block text-[#CFB383] text-xs font-semibold uppercase tracking-widest mb-4">Vendor Portal</span>
          <h1 className="font-baskerville text-[36px] sm:text-[52px] lg:text-[64px] text-white leading-[1.1] mb-6">
            Grow Your Wedding<br />Business with HoneyMoon
          </h1>
          <p className="text-white/75 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10">
            Join thousands of UAE wedding vendors on the region's most trusted honeymoon & wedding planning platform. Zero upfront fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto bg-[#CFB383] hover:bg-[#B8A06E] text-white px-8 py-4 rounded-full font-semibold text-base transition-colors text-center">
              Get Started Free →
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto border-2 border-white/60 hover:border-white text-white px-8 py-4 rounded-full font-medium text-base transition-colors text-center">
              See How It Works
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 text-white/60 text-sm">
            {['500+ Active Vendors','AED 10M+ Processed','4.8★ Average Rating'].map(t => (
              <span key={t} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#CFB383]"/>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[#CFB383] text-xs font-semibold uppercase tracking-widest">Simple Process</span>
          <h2 className="font-baskerville text-[28px] sm:text-[40px] text-[#1a1a1a] mt-2">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {HOW_IT_WORKS.map(({ step, title, desc }) => (
            <div key={step} className="relative">
              <div className="w-12 h-12 bg-[#174a37] rounded-xl flex items-center justify-center mb-4">
                <span className="text-[#CFB383] text-xs font-bold">{step}</span>
              </div>
              <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────── */}
      <section id="benefits" className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[#CFB383] text-xs font-semibold uppercase tracking-widest">Why Join Us</span>
            <h2 className="font-baskerville text-[28px] sm:text-[40px] text-[#1a1a1a] mt-2">Everything You Need to Succeed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {BENEFITS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#F5F5EF] rounded-2xl p-6 sm:p-8">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-6">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[#CFB383] text-xs font-semibold uppercase tracking-widest">Subscription Plans</span>
          <h2 className="font-baskerville text-[28px] sm:text-[40px] text-[#1a1a1a] mt-2">Simple, Transparent Pricing</h2>
          <p className="text-gray-500 mt-3 text-sm">Start free. Upgrade anytime. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PLANS.map(({ name, price, period, features, highlight }) => (
            <div key={name} className={`rounded-2xl p-6 sm:p-8 flex flex-col ${highlight ? 'bg-[#174a37] text-white shadow-2xl scale-105 border-2 border-[#CFB383]' : 'bg-white border border-[rgba(184,154,105,0.2)] shadow-md'}`}>
              {highlight && <span className="text-xs font-semibold uppercase tracking-widest text-[#CFB383] mb-2">Most Popular</span>}
              <h3 className={`font-baskerville text-2xl mb-1 ${highlight ? 'text-white' : 'text-[#1a1a1a]'}`}>{name}</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className={`font-baskerville text-4xl ${highlight ? 'text-[#CFB383]' : 'text-[#174a37]'}`}>AED {price}</span>
                <span className={`text-sm mb-1 ${highlight ? 'text-white/60' : 'text-gray-400'}`}>/{period}</span>
              </div>
              <ul className="flex flex-col gap-3 flex-1 mb-8">
                {features.map(f => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm ${highlight ? 'text-white/80' : 'text-gray-600'}`}>
                    <span className={highlight ? 'text-[#CFB383]' : 'text-[#174a37]'}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`text-center py-3 rounded-full font-semibold text-sm transition-colors ${highlight ? 'bg-[#CFB383] hover:bg-[#B8A06E] text-white' : 'border-2 border-[#174a37] text-[#174a37] hover:bg-[#174a37] hover:text-white'}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
        <img src={BG_CTA} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#174a37]/85" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="font-baskerville text-[28px] sm:text-[42px] text-white mb-4">Ready to Grow Your Business?</h2>
          <p className="text-white/70 text-sm sm:text-base mb-8">Join 500+ vendors already growing their wedding businesses with HoneyMoon.</p>
          <Link href="/signup" className="inline-block bg-[#CFB383] hover:bg-[#B8A06E] text-white px-10 py-4 rounded-full font-semibold text-base transition-colors">
            Create Your Vendor Account
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer id="contact" className="bg-[#0f3323] text-white/70 py-12 sm:py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border-2 border-[#CFB383] rounded-full flex items-center justify-center">
                  <img src="/logo-icon.svg" alt="" className="w-6 h-6 object-contain" />
                </div>
                <img src="/logo-text.svg" alt="HONEYMOON" className="h-3.5" />
              </div>
              <p className="text-sm leading-6">The UAE's premier honeymoon & wedding services marketplace.</p>
            </div>
            {/* Links */}
            {[
              ['Vendor', [['Dashboard','/dashboard'],['Sign Up','/signup'],['Login','/login']]],
              ['Company', [['About Us','#'],['Blog','#'],['Careers','#']]],
              ['Support', [['Help Center','#'],['Contact Us','#'],['Terms of Service','#']]],
            ].map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map(([label, href]) => (
                    <li key={label}><Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2026 Honeymoon Events Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
