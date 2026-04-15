'use client';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';

const imgs = {
  heroBg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  heroOverlay: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
  photo: "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?w=800&q=80",
  photo1: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80",
  venueImg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  photoImg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  beautyImg: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
  reviewer1: "https://ui-avatars.com/api/?name=User&background=174a37&color=CFB383&size=200",
  reviewer2: "https://ui-avatars.com/api/?name=Omar+H&background=CFB383&color=fff&size=200",
  reviewer3: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  featuresBg: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1600&q=80",
};

const team = [
  { name: 'Aisha Al Rashidi', role: 'Founder & CEO', img: imgs.reviewer1 },
  { name: 'Mohammed Al Mansouri', role: 'Head of AI', img: imgs.reviewer2 },
  { name: 'Fatima Hassan', role: 'Lead Wedding Planner', img: imgs.reviewer3 },
];

const stats = [
  { value: '500+', label: 'Verified Vendors' },
  { value: '2,000+', label: 'Happy Couples' },
  { value: '98%', label: 'Match Accuracy' },
  { value: '7', label: 'Emirates Covered' },
];

export default function AboutPage() {
  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen min-h-dvh w-full min-w-0">
      <PublicNav activeHref="/about" />

      {/* Hero */}
      <section className="relative flex items-center overflow-hidden py-14 sm:py-0 min-h-[260px] sm:h-[600px] sm:min-h-[600px]">
        <img src={imgs.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={imgs.heroOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-[88px] w-full min-w-0 pb-6 sm:pb-0">
          <p className="text-[#CFB383] text-[14px] uppercase tracking-[4px] mb-4">About HoneyMoon</p>
          <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[54px] lg:text-[72px] leading-tight sm:leading-[44px] md:leading-[60px] lg:leading-[80px] text-[#fff6e9] capitalize max-w-[720px]">
            Redefining Luxury Wedding Planning
          </h1>
          <p className="text-[#fff6e9]/70 text-[18px] max-w-[520px] mt-6 leading-7">
            Born in the UAE, built for couples who deserve nothing but the finest.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-[#F5F5EF] py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-w-0">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            <div className="flex-1 min-w-0">
              <p className="text-[#CFB383] text-[14px] uppercase tracking-[4px] mb-4">Our Story</p>
              <h2 className="font-baskerville text-[28px] md:text-[40px] lg:text-[52px] leading-[36px] md:leading-[48px] lg:leading-[60px] text-[#174a37] capitalize mb-8">
                Where Tradition Meets Technology
              </h2>
              <p className="text-black/60 text-[17px] leading-8 mb-6">
                HoneyMoon was founded with one mission: to bring the magic of Emirati wedding traditions into the modern age. We understood that planning a luxury wedding shouldn't be a stressful ordeal — it should be a celebration in itself.
              </p>
              <p className="text-black/60 text-[17px] leading-8 mb-8">
                Our AI-powered platform connects couples with the UAE's finest vendors, from palace venues to world-class photographers, ensuring every detail is curated to perfection.
              </p>
              <Link href="/signup" className="inline-flex justify-center bg-[#174a37] text-white text-[16px] font-medium px-8 py-4 rounded-[10px] hover:bg-[#1a5c45] transition-colors w-full sm:w-auto text-center">
                Start Planning Today
              </Link>
            </div>
            <div className="w-full max-w-[420px] lg:max-w-none lg:w-[500px] shrink-0 mx-auto lg:mx-0">
              <div className="w-full h-[360px] sm:h-[440px] lg:h-[520px] rounded-t-[500px] overflow-hidden shadow-[0px_5px_20px_0px_rgba(0_0_0_/_0.1)]">
                <img src={imgs.photo} alt="Wedding" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
        <img src={imgs.featuresBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-baskerville text-[44px] sm:text-[52px] md:text-[64px] text-[#CFB383] leading-none">{s.value}</p>
                <p className="text-white/70 text-[16px] mt-2 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-w-0">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[#CFB383] text-[14px] uppercase tracking-[4px] mb-4">Our Values</p>
            <h2 className="font-baskerville text-[28px] md:text-[40px] lg:text-[52px] leading-[36px] md:leading-[48px] lg:leading-[60px] text-[#174a37] capitalize">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '✦', title: 'AI-Powered Curation', desc: 'Our algorithms learn your preferences and match you with vendors who truly understand your vision.' },
              { icon: '♡', title: 'Cultural Authenticity', desc: 'Deep respect for Emirati traditions, ensuring your wedding honors your heritage beautifully.' },
              { icon: '★', title: 'Uncompromising Quality', desc: 'Every vendor on our platform is rigorously vetted to meet our luxury standards.' },
            ].map(v => (
              <div key={v.title} className="bg-[#f9f6ef] rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-8 text-center hover:shadow-[0_8px_30px_rgba(0_0_0_/_0.06)] transition-shadow">
                <div className="w-16 h-16 bg-[#174a37] rounded-2xl flex items-center justify-center text-[#CFB383] text-2xl mx-auto mb-6">{v.icon}</div>
                <h3 className="font-baskerville text-[24px] text-[#174a37] mb-4">{v.title}</h3>
                <p className="text-black/60 text-[15px] leading-7">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#F5F5EF] py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full min-w-0">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[#CFB383] text-[14px] uppercase tracking-[4px] mb-4">The People</p>
            <h2 className="font-baskerville text-[28px] md:text-[40px] lg:text-[52px] leading-[36px] md:leading-[48px] lg:leading-[60px] text-[#174a37] capitalize">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[800px] mx-auto">
            {team.map(m => (
              <div key={m.name} className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 text-center shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-[rgba(184_154_105_/_0.2)]">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-medium text-[#1a1a1a] text-base">{m.name}</p>
                <p className="text-[#CFB383] text-sm mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#174a37] py-12 sm:py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="font-baskerville text-[28px] md:text-[40px] lg:text-[52px] leading-[36px] md:leading-[48px] lg:leading-[60px] text-[#CFB383] capitalize mb-6">Ready to Begin?</h2>
          <p className="text-white/70 text-[18px] leading-8 mb-10">Join thousands of couples who trusted HoneyMoon to plan their perfect day.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup" className="bg-[#CFB383] text-white text-[16px] font-medium px-6 sm:px-10 py-3.5 sm:py-4 rounded-[10px] hover:bg-[#B8A06E] transition-colors w-full sm:w-auto text-center">
              Start AI Planning ✦
            </Link>
            <Link href="/contact" className="border border-white/40 text-white text-[16px] font-medium px-6 sm:px-10 py-3.5 sm:py-4 rounded-[10px] hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
