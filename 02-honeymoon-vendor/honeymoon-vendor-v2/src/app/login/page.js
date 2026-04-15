'use client';
import { useVendorAuth } from '../../context/auth';
import { useState } from 'react';
import Link from 'next/link';

const BG_IMG = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const LOGO_ICON = "/logo-icon.svg";
const LOGO_TEXT = "/logo-text.svg";
const LOGO_AR = "/logo-arabic.svg";

export default function VendorLoginPage() {
  const { login } = useVendorAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e && e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };
  const [tab, setTab] = useState('email');
  const [form, setForm] = useState({ email:'', mobile:'', uaePass:'', password:'' });
  const [show, setShow] = useState(false);

  const tabs = [
    { id:'email', label:'Login with Email' },
    { id:'uae', label:'Login with UAE Pass' },
    { id:'mobile', label:'Login with Mobile Number' },
  ];

  return (
    <div className="min-h-screen min-h-dvh flex items-center justify-center py-6 sm:py-10" style={{background:'#F5F5EF'}}>
      <div className="flex items-center gap-6 lg:gap-10 max-w-5xl w-full px-4 sm:px-8 min-w-0">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-[440px] shrink-0 min-w-0 mx-auto lg:mx-0">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 border-2 border-[#CFB383] rounded-full flex items-center justify-center mb-3">
              <img src={LOGO_ICON} alt="" className="w-10 h-10 object-contain" />
            </div>
            <img src={LOGO_TEXT} alt="HONEYMOON" className="h-4 mb-0.5" />
            <img src={LOGO_AR} alt="" className="h-3" />
          </div>

          <h2 className="font-baskerville text-3xl text-center mb-5 text-[#1a1a1a]">Login</h2>

          {/* Tabs */}
          <div className="flex border border-[rgba(184_154_105_/_0.3)] rounded-xl overflow-hidden mb-6">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab===t.id?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#F5F5EF]'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'email' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address<span className="text-red-500">*</span></label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4]">
                <span className="text-gray-400 mr-2 text-sm">✉</span>
                <input type="email" placeholder="Enter Email address" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                  className="flex-1 bg-transparent text-sm outline-none" />
              </div>
            </div>
          )}
          {tab === 'uae' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">UAE Pass<span className="text-red-500">*</span></label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4]">
                <span className="text-gray-400 mr-2 text-sm">🆔</span>
                <input placeholder="Enter UAE Pass" value={form.uaePass} onChange={e=>setForm(p=>({...p,uaePass:e.target.value}))}
                  className="flex-1 bg-transparent text-sm outline-none" />
              </div>
            </div>
          )}
          {tab === 'mobile' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number<span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-3 py-3 shrink-0 bg-[#faf8f4]">
                  <span className="text-sm">🇦🇪</span><span className="text-xs text-gray-500">+971</span>
                </div>
                <input placeholder="Enter Mobile Number" value={form.mobile} onChange={e=>setForm(p=>({...p,mobile:e.target.value}))}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4]">
              <span className="text-gray-400 mr-2 text-sm">🔒</span>
              <input type={show?'text':'password'} placeholder="Enter your password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                className="flex-1 bg-transparent text-sm outline-none" />
              <button onClick={() => setShow(!show)} className="text-gray-400 text-xs">{show?'🙈':'👁'}</button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" className="rounded" /> Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-[#CFB383] hover:underline">Forgot Password?</Link>
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="block w-full bg-[#CFB383] text-white text-center font-medium py-3.5 rounded-full hover:bg-[#B8A06E] transition-colors disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Not A User?{' '}
            <Link href="/signup" className="text-[#CFB383] font-medium hover:underline">Sign Up Now</Link>
          </p>
        </div>

        {/* Wedding photo */}
        <div className="flex-1 hidden lg:block">
          <div className="rounded-2xl overflow-hidden h-[560px]">
            <img src={BG_IMG} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
