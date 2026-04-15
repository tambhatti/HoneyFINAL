'use client';
import { useUserAuth } from '../../context/auth';
import { useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import { imgAiSparkle as imgAIBadge } from '@/lib/inlineIcons';

export default function LoginPage() {
  const { login } = useUserAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e && e.preventDefault();
    setLoading(true); setError('');
    try {
      if (tab === 'email') {
        await login(form.email, form.password);
      } else if (tab === 'uae') {
        const { AuthService } = await import('../lib/services/user.service');
        const { data } = await AuthService.uaePassInit();
        window.location.href = data.authUrl;
        return;
      }
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };
  const [tab, setTab] = useState('email');
  const [form, setForm] = useState({ email: '', mobile: '', uaePass: '', password: '' });
  const [show, setShow] = useState(false);

  const tabs = [
    { id: 'email', label: 'Login with Email' },
    { id: 'uae', label: 'Login with UAE Pass' },
    { id: 'mobile', label: 'Login with Mobile Number' },
  ];

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans pt-[88px] w-full min-w-0">
      <PublicNav variant="solid" ctaHref="/signup" ctaLabel="Sign Up" />

      <div className="flex items-center justify-center min-h-[calc(100dvh-88px)] px-4 py-8 sm:py-12 w-full min-w-0">
        <div className="w-full max-w-[520px] min-w-0 mx-auto">
          <h1 className="font-baskerville text-[32px] sm:text-[40px] md:text-[48px] text-[#CFB383] text-center mb-6 sm:mb-8">Login</h1>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row border border-[rgba(184_154_105_/_0.3)] rounded-xl overflow-hidden mb-8 bg-white">
            {tabs.map(t => (
              <button type="button" key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 min-h-[44px] px-2 py-3 text-[11px] sm:text-[13px] font-medium transition-colors leading-tight ${
                  tab === t.id ? 'bg-[#174a37] text-white' : 'text-black/60 hover:bg-[#F5F5EF]'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-[0_4px_30px_rgba(0_0_0_/_0.06)]">
            {tab === 'email' && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Email address<span className="text-red-500">*</span></label>
                  <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                    placeholder="Enter your email" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#CFB383] transition-colors" />
                </div>
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={show?'text':'password'} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                      placeholder="Enter your password" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#CFB383] transition-colors pr-12" />
                    <button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 text-xs">{show?'🙈':'👁'}</button>
                  </div>
                </div>
              </div>
            )}
            {tab === 'uae' && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">UAE Pass<span className="text-red-500">*</span></label>
                  <input value={form.uaePass} onChange={e=>setForm(p=>({...p,uaePass:e.target.value}))}
                    placeholder="Enter UAE Pass" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#CFB383] transition-colors" />
                </div>
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={show?'text':'password'} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                      placeholder="Enter your password" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#CFB383] pr-12 transition-colors" />
                    <button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 text-xs">{show?'🙈':'👁'}</button>
                  </div>
                </div>
              </div>
            )}
            {tab === 'mobile' && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Mobile Number<span className="text-red-500">*</span></label>
                  <div className="flex gap-2 min-w-0">
                    <div className="flex items-center gap-2 border border-[#d4d4d4] rounded-lg px-3 py-3 bg-white shrink-0">
                      <span className="text-sm">🇦🇪</span>
                      <span className="text-sm text-black/60">+971</span>
                      <span className="text-black/30 text-xs">▾</span>
                    </div>
                    <input value={form.mobile} onChange={e=>setForm(p=>({...p,mobile:e.target.value}))}
                      placeholder="Enter Mobile Number" className="min-w-0 flex-1 border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#CFB383] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={show?'text':'password'} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                      placeholder="Enter your password" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#CFB383] pr-12 transition-colors" />
                    <button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 text-xs">{show?'🙈':'👁'}</button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4 mb-6">
              <label className="flex items-center gap-2 text-sm text-black/60 cursor-pointer">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-[#CFB383] hover:underline">Forgot Password?</Link>
            </div>

            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
            <button type="button" onClick={handleLogin} disabled={loading}
              className="block w-full bg-[#CFB383] text-white text-center font-medium py-3.5 rounded-xl hover:bg-[#B8A06E] transition-colors text-base disabled:opacity-60">
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <p className="text-center text-sm text-black/50 mt-5">
              Not A User?{' '}
              <Link href="/signup" className="text-[#CFB383] font-medium hover:underline">Sign Up Now</Link>
            </p>
          </div>

          {/* AI badge */}
          <div className="flex flex-col items-center mt-6 opacity-70">
            <img src={imgAIBadge} alt="" className="w-16" />
            <p className="text-[11px] text-black/40 uppercase tracking-wider mt-2 text-center">Smart Wedding<br/>Assistant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
