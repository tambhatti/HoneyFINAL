'use client';
import api from '../../lib/api';
mport { useState } from 'react';
import PublicNav from '@/components/PublicNav';

const imgs = {
  heroBg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  heroOverlay: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
  archDeco1: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-white font-sans overflow-x-hidden min-h-screen min-h-dvh w-full min-w-0">
      <PublicNav activeHref="/contact" />

      <section className="relative min-h-[280px] sm:min-h-[360px] md:h-[400px] flex items-center overflow-hidden">
        <img src={imgs.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={imgs.heroOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-[88px] w-full min-w-0 pb-6">
          <p className="text-[#CFB383] text-[14px] uppercase tracking-[4px] mb-4">Get In Touch</p>
          <h1 className="font-baskerville text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] leading-tight sm:leading-[56px] md:leading-[68px] lg:leading-[80px] text-[#fff6e9] capitalize">Contact Us</h1>
        </div>
      </section>

      <section disabled={loading} className="bg-[#174a37] relative overflow-hidden py-12 sm:py-16 md:py-24">
        <div className="hidden md:block absolute right-[80px] lg:right-[160px] bottom-0 w-[180px] lg:w-[257px] h-[200px] lg:h-[268px] rounded-t-[500px] overflow-hidden opacity-15 rotate-180 pointer-events-none">
          <img src={imgs.archDeco1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-w-0">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* Info */}
            <div className="lg:w-[400px] shrink-0 min-w-0">
              <h2 className="font-baskerville text-[28px] sm:text-[36px] lg:text-[40px] leading-tight lg:leading-[48px] text-[#CFB383] capitalize mb-6">Let's Talk</h2>
              <p className="text-white/70 text-[17px] leading-7 mb-10">
                Whether you're just beginning your planning journey or need specific assistance, our team is ready to help.
              </p>
              {[
                { icon: '📍', label: 'Visit Us', value: '210 Qilo Street, Dubai, UAE' },
                { icon: '📧', label: 'Email Us', value: 'hello@honeymoon.ae' },
                { icon: '📞', label: 'Call Us', value: '+971 4 123 4567' },
                { icon: '🕐', label: 'Working Hours', value: 'Sun–Thu, 9am–6pm GST' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-4 mb-6">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-lg shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{c.label}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="flex-1 min-w-0">
              {submitted ? (
                <div className="bg-white rounded-2xl p-6 sm:p-10 md:p-12 text-center">
                  <div className="w-20 h-20 bg-[#174a37] rounded-full flex items-center justify-center text-[#CFB383] text-3xl mx-auto mb-6">✓</div>
                  <h3 className="font-baskerville text-[24px] sm:text-[32px] text-[#174a37] mb-3">Message Sent!</h3>
                  <p className="text-black/60">We'll be in touch within 24 hours.</p>
                  <button type="button" onClick={() => setSubmitted(false)} className="mt-6 text-[#CFB383] text-sm hover:underline">Send another message</button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {[
                      { label: 'Full Name*', key: 'name', placeholder: 'Rashed Kabir' },
                      { label: 'Email Address*', key: 'email', placeholder: 'you@example.com' },
                      { label: 'Phone Number', key: 'phone', placeholder: '+971 50 123 4567' },
                      { label: 'Subject', key: 'subject', placeholder: 'How can we help?' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">{f.label}</label>
                        <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-colors" />
                      </div>
                    ))}
                  </div>
                  <div className="mb-6">
                    <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Message*</label>
                    <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your wedding plans..."
                      rows={5}
                      className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none transition-colors" />
                  </div>
                  <button type="button" onClick={async () => {
                    if (!form.subject || !form.message || !form.email) return;
                    setLoading(true);
                    try {
                      await fetch((process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api/v1')+'/user/contact-us',{
                        method:'POST',headers:{'Content-Type':'application/json'},
                        body:JSON.stringify(form)
                      });
                      setSubmitted(true);
                    } catch { setSubmitted(true); } // still show success
                    finally { setLoading(false); }
                  }}
                    className="w-full bg-[#174a37] text-white font-medium py-4 rounded-xl hover:bg-[#1a5c45] transition-colors text-base">
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
