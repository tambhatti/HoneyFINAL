'use client';
import { useApi } from '../hooks/useApi';
import UserService from '../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import { imgAiSparkle } from '@/lib/inlineIcons';

// Fresh Figma assets
const imgs = {
  heroBg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  heroOverlay: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
  appBg: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80",
  howBg: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80",
  vendorBg: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1600&q=80",
  featuresBg: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1600&q=80",
  testimonialBg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  logoIcon: "/logo-icon.svg",
  logoText: "/logo-text.svg",
  logoArabic: "/logo-arabic.svg",
  scrollIndicator: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  phoneSilver: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  phoneScreen: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  phoneScreen1: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  phoneScreen2: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  phoneScreen3: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  circlePattern: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  appBgPhone: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  aiAssistant: imgAiSparkle,
  aiIcon: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  photo: "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?w=800&q=80",
  photo1: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80",
  step1Icon: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  stepCircle: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  venueImg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  photoImg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  beautyImg: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
  featuresPhoto: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  galleryArch: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  galleryWide: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  gallerySmall: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  pagesIndicator: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  star: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png",
  reviewer1: "https://ui-avatars.com/api/?name=User&background=174a37&color=CFB383&size=200",
  reviewer2: "https://ui-avatars.com/api/?name=Omar+H&background=CFB383&color=fff&size=200",
  reviewer3: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  waitlistBtn: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  archDeco1: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  footerLogoIcon: "/logo-icon.svg",
  footerLogoText: "/logo-text.svg",
  footerArabic: "/logo-arabic.svg",
  fbIcon: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  xIcon: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  playstore: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  apple: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
};

function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer className="bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[380px] shrink-0">
            <div className="flex items-center gap-3 mb-6">
              <img src={imgs.footerLogoIcon} alt="" className="h-[76px] w-auto" />
              <div>
                <img src={imgs.footerLogoText} alt="honeymoon" className="h-[28px] w-auto" />
                <img src={imgs.footerArabic} alt="" className="h-[22px] w-auto mt-1" />
              </div>
            </div>
            <p className="text-white/60 text-[19px] leading-[32px]">210 Qilo Street, California,<br/>Main OC, USA</p>
          </div>
          <div className="flex-1">
            <p className="text-white text-[18px] leading-[32px] mb-6">
              <span className="text-white">Home</span>
              <span className="text-white/30"> .   About .   Vendors .   Services  .  Contact</span>
            </p>
            <div className="border-b border-white/30 pb-3 mb-6 min-w-0">
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="rakabir@gmail.com"
                className="bg-transparent text-white text-base sm:text-[22px] w-full min-w-0 focus:outline-none placeholder-white/30" />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-[48px] h-[48px]">
                <img src={imgs.xIcon} alt="" className="w-full h-full" />
                <span className="absolute inset-0 flex items-center justify-center text-[#060606] font-medium text-[16px]">X</span>
              </div>
              {['Fb', 'In', 'Li'].map(s => (
                <div key={s} className="relative w-[48px] h-[48px]">
                  <img src={imgs.fbIcon} alt="" className="w-full h-full" />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-[16px]">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-white/60 text-[16px] tracking-[1px] capitalize">Copyright © HoneyMoon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const { data, loading } = useApi(UserService.getHome);
  const featuredVendors = data?.featuredVendors || [];
  const categories = data?.categories || [];
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen min-h-dvh w-full min-w-0">
      <PublicNav activeHref="/" />

      {/* HERO */}
      <section className="relative min-h-screen min-h-dvh flex items-start overflow-hidden">
        <div className="absolute inset-0">
          <img src={imgs.heroBg} alt="" className="w-full h-full object-cover" />
          <img src={imgs.heroOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        {/* AI badge */}
        <div className="hidden md:flex absolute top-[100px] right-4 lg:right-10 flex-col items-center pointer-events-none md:pointer-events-auto">
          <img src={imgs.aiAssistant} alt="" className="w-[89px]" />
          <img src={imgs.aiIcon} alt="" className="w-[65px] absolute top-[88px]" />
          <p className="text-[#fff6e9] text-[13px] uppercase text-center mt-14 leading-5">Smart Wedding<br/>Assistant</p>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-[120px] sm:pt-[160px] md:pt-[200px] pb-16 sm:pb-[120px] min-w-0">
          <p className="text-white/60 text-[16px] font-medium uppercase tracking-wider mb-4">
            prepare everything in a <em>planned</em> and <em>measurable</em> manner!
          </p>
          <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[54px] lg:text-[72px] leading-tight sm:leading-[44px] md:leading-[60px] lg:leading-[80px] text-[#fff6e9] capitalize max-w-[820px] mb-6 sm:mb-8">
            Luxury Emirati Weddings, Intelligently Curated- Powered by AI
          </h1>
          <p className="text-[#fff6e9]/80 text-[16px] max-w-[576px] leading-7 mb-10">
            We believe that every wedding is a unique love story, and we are dedicated to making your wedding dreams come true perfectly
          </p>
          <Link href="/signup"
            className="inline-flex items-center justify-center bg-[#fff6e9] text-black text-base sm:text-[18px] capitalize px-6 sm:px-10 py-3.5 sm:py-4 rounded-[7.5px] shadow-[1.5px_18.75px_37.5px_0px_rgba(85_57_19_/_0.3)] hover:bg-white transition-colors w-full sm:w-auto text-center">
            Start AI Planning
          </Link>
          <div className="mt-14">
            <img src={imgs.scrollIndicator} alt="scroll" className="w-[100px]" />
          </div>
        </div>
        {/* Phone mockups */}
        <div className="absolute right-[80px] top-[120px] hidden xl:flex gap-6 items-end">
          <div className="relative w-[273px] h-[553px]">
            <img src={imgs.phoneSilver} alt="" className="absolute inset-0 w-full h-full object-contain" />
            <div className="absolute inset-[2%] overflow-hidden rounded-[35px]">
              <img src={imgs.phoneScreen3} alt="" className="w-full h-[144%] object-cover object-top" />
            </div>
          </div>
          <div className="relative w-[251px] h-[507px] mb-8">
            <img src={imgs.phoneSilver} alt="" className="absolute inset-0 w-full h-full object-contain" />
            <div className="absolute inset-[2%] overflow-hidden rounded-[32px]">
              <img src={imgs.phoneScreen1} alt="" className="w-full h-[114%] object-cover object-top" />
            </div>
          </div>
        </div>
        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 opacity-20 hidden xl:block">
          <img src={imgs.circlePattern} alt="" className="w-[860px] -rotate-[7.53deg]" />
        </div>
      </section>

      {/* APP DOWNLOAD */}
      <section className="relative min-h-0 py-16 sm:py-20 md:min-h-[560px] md:py-24 flex items-center overflow-hidden">
        <img src={imgs.appBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full min-w-0 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-[560px] w-full min-w-0">
            <h2 className="font-baskerville text-[26px] sm:text-[28px] md:text-[42px] lg:text-[60px] leading-tight md:leading-[1.1] lg:leading-[65px] text-[#CFB383] capitalize mb-6">
              Begin Your Honeymoon Experience Today
            </h2>
            <p className="text-[#1a1a1a] text-[16px] leading-6 mb-10 max-w-[435px]">
              See your shortlist, prices, and availability at a glance. Filter by style, capacity, and budget.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button type="button" className="flex items-center gap-3 bg-white border-[1.4px] border-[#CFB383] rounded-[8.4px] px-4 h-[56px] w-full max-w-[200px] sm:w-[168px] hover:bg-[#F5F5EF] transition-colors">
                <img src={imgs.playstore} alt="" className="w-[29px] h-[29px] object-contain" />
                <div className="text-left">
                  <p className="text-[10px] uppercase text-black">GET IT ON</p>
                  <p className="text-[14px] text-black font-medium">Google Play</p>
                </div>
              </button>
              <button type="button" className="flex items-center gap-3 bg-white border-[1.4px] border-[#CFB383] rounded-[8.4px] px-4 h-[56px] w-full max-w-[200px] sm:w-[168px] hover:bg-[#F5F5EF] transition-colors">
                <img src={imgs.apple} alt="" className="w-[24px] h-[28px] object-contain" />
                <div className="text-left">
                  <p className="text-[11px] text-black">Download on the</p>
                  <p className="text-[18px] text-black font-medium leading-none">App Store</p>
                </div>
              </button>
            </div>
          </div>
          <div className="w-[480px] h-[480px] relative opacity-90 hidden lg:block">
            <img src={imgs.appBgPhone} alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative min-h-0 py-16 md:py-24 lg:min-h-[720px] overflow-hidden">
        <img src={imgs.howBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 md:py-[100px] w-full min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-10 flex-wrap">
            <h2 className="font-baskerville text-[26px] sm:text-[28px] md:text-[42px] lg:text-[60px] leading-tight sm:leading-[48px] text-[#CFB383] capitalize">How It Works</h2>
            <Link href="/signup" className="bg-[#CFB383] text-white text-base sm:text-[18px] capitalize px-6 sm:px-8 py-3 sm:py-4 rounded-[10px] hover:bg-[#B8A06E] transition-colors text-center w-full sm:w-auto shrink-0">
              Try AI planning
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="w-full lg:w-[387px] h-[545px] rounded-t-[500px] overflow-hidden shadow-[0px_5px_20px_0px_rgba(0_0_0_/_0.05)] shrink-0">
              <img src={imgs.photo} alt="Wedding" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              {[
                { icon: imgs.step1Icon, title: 'Share the basics:', desc: 'date, city, budget, style.', num: '' },
                { icon: imgs.stepCircle, title: 'AI curates:', desc: 'smart matches with live availability and ratings.', num: '02' },
                { icon: imgs.stepCircle, title: 'Book with confidence:', desc: 'compare, chat, confirm, and pay securely.', num: '03' },
              ].map((s, i) => (
                <div key={s.title} className="flex items-start gap-6 mb-10 border-b border-white/15 pb-8">
                  <div className="relative w-[49px] h-[49px] shrink-0">
                    <img src={s.icon} alt="" className="w-full h-full object-contain" />
                    {s.num && <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-[19px]">{s.num}</span>}
                  </div>
                  <p className="text-white text-[16px] leading-6">
                    <span className="font-semibold">{s.title}</span>{' '}
                    <span className="font-light">{s.desc}</span>
                  </p>
                </div>
              ))}
              <div className="w-full h-[332px] overflow-hidden shadow-[0px_5px_20px_0px_rgba(0_0_0_/_0.05)] mt-2">
                <img src={imgs.photo1} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VENDOR CATEGORIES */}
      <section className="relative min-h-[1103px] overflow-hidden">
        <img src={imgs.vendorBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-[100px]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-baskerville text-[28px] md:text-[42px] lg:text-[60px] leading-[48px] text-[#CFB383] capitalize">Vendor Categories</h2>
              <p className="text-white text-[24px] leading-[41px] mt-4 max-w-[429px]">Everything in one place—venues, beauty, décor and more.</p>
            </div>
            <div className="absolute top-[100px] right-10">
              <Link href="/vendors" className="flex flex-col items-center justify-center w-[157px] h-[157px] rounded-full border border-[#CFB383] hover:bg-[#CFB383]/10 transition-colors">
                <p className="text-[#CFB383] text-[14px] uppercase tracking-[1px] text-center leading-[18px]">View All<br/>Vendors</p>
                <span className="text-[#CFB383] text-lg mt-2">→</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {[
              { img: imgs.venueImg, label: 'Venues' },
              { img: imgs.photoImg, label: 'Photography' },
              { img: imgs.beautyImg, label: 'Beauty' },
            ].map(cat => (
              <div key={cat.label} className="flex flex-col">
                <div className="relative rounded-t-[500px] overflow-hidden shadow-[0px_5px_20px_0px_rgba(0_0_0_/_0.05)]" style={{ height: 522 }}>
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-8 left-6">
                    <p className="text-white text-[21px]">{cat.label}</p>
                  </div>
                </div>
                <div className="h-px bg-white/20 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="relative min-h-[808px] overflow-hidden">
        <img src={imgs.featuresBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-[120px]">
          <h2 className="font-baskerville text-[28px] md:text-[42px] lg:text-[60px] leading-[48px] text-[#CFB383] capitalize mb-12">Core Features</h2>
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-[437px] h-[481px] overflow-hidden shadow-[0px_5px_20px_0px_rgba(0_0_0_/_0.05)] shrink-0">
              <img src={imgs.featuresPhoto} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              {['AI Shortlists', 'Real Availability', 'Smart Compare', 'Secure Payments', 'Direct Chat', 'Team Access'].map((f, i) => (
                <div key={f} className="border-b border-white/10 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[#CFB383] text-sm">✦</span>
                    <span className="font-baskerville text-[20px] text-white uppercase">{f}</span>
                  </div>
                  {i === 0 && <span className="text-white/40 text-[13px] hidden md:block">matches that fit your budget, style, and date.</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-[#F5F5EF] py-[82px] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[550px] h-[668px] rounded-t-[500px] overflow-hidden shadow-[0px_5px_20px_0px_rgba(0_0_0_/_0.05)] shrink-0">
              <img src={imgs.galleryArch} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex items-start gap-4 flex-wrap">
                <div>
                  <p className="text-[#CFB383] text-[20px] uppercase tracking-[4px]">GALLERY</p>
                  <h3 className="font-baskerville text-[28px] md:text-[42px] lg:text-[60px] leading-[48px] text-[#CFB383] uppercase mt-2">LATEST<br/>WEDDINGS</h3>
                </div>
                <div className="w-[256px] h-[440px] rounded-t-[500px] overflow-hidden shadow-[0px_5px_20px_0px_rgba(0_0_0_/_0.05)] ml-auto hidden lg:block">
                  <img src={imgs.gallerySmall} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="h-[332px] overflow-hidden shadow-[0px_5px_20px_0px_rgba(0_0_0_/_0.05)]">
                <img src={imgs.galleryWide} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-4">
                <img src={imgs.pagesIndicator} alt="" className="h-[29px] w-auto" />
              </div>
              <div>
                <p className="text-black text-[20px]">Gerald Johnson &amp; Erica Steward</p>
                <p className="text-black font-bold text-[16px]">( 2025 )</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative min-h-0 py-12 sm:py-16 md:py-20 lg:min-h-[714px] overflow-hidden">
        <img src={imgs.testimonialBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 md:py-[90px] min-w-0">
          <div className="flex items-center justify-between mb-8 sm:mb-10 flex-wrap gap-4 min-w-0">
            <h2 className="font-baskerville text-[24px] sm:text-[28px] md:text-[42px] lg:text-[60px] leading-tight sm:leading-snug md:leading-[48px] lg:leading-[60px] text-[#CFB383] uppercase max-w-[475px] min-w-0">What Our Clients Have To Say</h2>
            <button type="button" className="bg-[#CFB383] text-white text-[18px] capitalize px-8 py-4 rounded-[10px] hover:bg-[#B8A06E] transition-colors w-full sm:w-auto text-center">View All Reviews</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { quote: 'The AI saved us weeks of back-and-forth.', name: 'Musa Delimuza', loc: 'Milan, Italy', img: imgs.reviewer3 },
              { quote: 'Booked our venue in 48 hours — shortlist was spot on.', name: 'James Milner', loc: 'Dubai, UAE', img: imgs.reviewer1 },
              { quote: 'Vendors finally compared like-for-like. No surprises.', name: 'Musa Delimuza', loc: 'Dubai, UAE', img: imgs.reviewer2 },
            ].map(t => (
              <div key={t.name + t.loc} className="bg-[#1a1a1a] border border-[#CFB383]/50 p-6 sm:p-8 md:p-10 min-h-0 sm:min-h-[280px] md:min-h-[324px] flex flex-col justify-between min-w-0">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <img key={i} src={imgs.star} alt="★" className="w-[14px] h-[14px] object-contain" />)}
                </div>
                <p className="text-white text-[17px] sm:text-[20px] leading-relaxed sm:leading-[44px] flex-1 min-w-0">{t.quote}</p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-white font-medium text-[15.8px]">{t.name}</p>
                    <p className="text-white/40 text-[14.2px]">{t.loc}</p>
                  </div>
                  <div className="w-[53px] h-[53px] rounded-full overflow-hidden">
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="bg-[#174a37] min-h-[500px] md:min-h-[700px] lg:min-h-[800px] relative overflow-hidden flex items-center">
        <div className="absolute right-[160px] bottom-0 w-[257px] h-[268px] rounded-t-[500px] overflow-hidden opacity-20 rotate-180">
          <img src={imgs.archDeco1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute right-[-40px] top-0 w-[400px] h-[473px] rounded-t-[500px] overflow-hidden opacity-15 rotate-180">
          <img src={imgs.archDeco1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-[96px] w-full">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="bg-white rounded-[10px] p-10 w-full lg:w-[518px] shrink-0">
              <div className="flex flex-col gap-5">
                {[
                  { label: 'Name*', key: 'name', placeholder: 'Rashed Kabir' },
                  { label: 'Email*', key: 'email', placeholder: 'mickelalo20@gmail.com' },
                  { label: 'Phone Number*', key: 'phone', placeholder: '+971 1789 23400' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[12.8px] text-black/50 block mb-1">{f.label}</label>
                    <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full border border-[#d4d4d4] rounded-[10px] h-[48px] px-4 text-[16px] focus:outline-none focus:border-[#CFB383]" />
                  </div>
                ))}
                <div>
                  <label className="text-[12.8px] text-black/50 block mb-1">Your message*</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={3} placeholder="Your message..."
                    className="w-full border border-[#d4d4d4] rounded-[10px] px-4 py-3 text-[14.4px] focus:outline-none focus:border-[#CFB383] resize-none" />
                </div>
                <button type="button" className="relative h-[52px] rounded-[10px] overflow-hidden bg-[#174a37] text-white font-medium text-[16px] capitalize hover:bg-[#1a5c45] transition-colors w-full">
                  Notify Me
                </button>
              </div>
            </div>
            <div className="flex-1 pt-4">
              <h2 className="font-baskerville text-[32px] md:text-[48px] lg:text-[65px] leading-[44px] md:leading-[60px] lg:leading-[80px] text-[#CFB383] capitalize tracking-[-1.95px] mb-6">Join the waitlist</h2>
              <p className="text-white text-[20.8px] leading-[32px] max-w-[450px]">
                Eiusmod tempor incididunt. Ut enim mimu veniamnostrud elit lorem quis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
