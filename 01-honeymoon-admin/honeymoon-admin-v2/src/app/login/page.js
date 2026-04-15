'use client';
import { useAdminAuth } from '../../context/auth';
import { useState } from 'react';
import Link from 'next/link';

const BG = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const LOGO_ICON = "/logo-icon.svg";
const LOGO_TEXT = "/logo-text.svg";
const LOGO_AR = "/logo-arabic.svg";

export default function AdminLoginPage() {
  const { login, isLoggedIn } = useAdminAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (typeof window !== 'undefined' && isLoggedIn) {
    window.location.href = '/dashboard';
  }
  
  const handleLogin = async (e) => {
    e && e.preventDefault();
    if (!email || !password) { setError('Please enter email and password'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="min-h-screen min-h-dvh flex items-center justify-center py-6 sm:py-10" style={{background:'#F5F5EF'}}>
      <div className="flex items-center gap-6 lg:gap-10 max-w-5xl w-full px-4 sm:px-8 min-w-0">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-[420px] shrink-0 min-w-0 mx-auto lg:mx-0">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 border-2 border-[#CFB383] rounded-full flex items-center justify-center mb-3">
              <img src={LOGO_ICON} alt="" className="w-10 h-10 object-contain" />
            </div>
            <img src={LOGO_TEXT} alt="HONEYMOON" className="h-4 mb-0.5" />
            <img src={LOGO_AR} alt="" className="h-3" />
          </div>
          <h2 className="font-baskerville text-3xl text-center mb-1 text-[#1a1a1a]">Admin Login</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Login to Your Account!</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Address<span className="text-red-500">*</span></label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4] focus-within:border-[#CFB383] transition-colors">
              <span className="text-gray-400 mr-2 text-sm">✉</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter Email Address" className="flex-1 bg-transparent text-sm outline-none" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4] focus-within:border-[#CFB383] transition-colors">
              <span className="text-gray-400 mr-2 text-sm">🔒</span>
              <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter Password" className="flex-1 bg-transparent text-sm outline-none" />
              <button type="button" onClick={() => setShow(!show)} className="text-gray-400 text-xs ml-2">{show ? '🙈' : '👁'}</button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded accent-[#174a37]" />
              Remember Me
            </label>
            <Link href="/forgot-password" className="text-sm text-[#CFB383] hover:underline font-medium sm:text-right">Forgot Password?</Link>
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button type="button" onClick={handleLogin} disabled={loading}
            className="block w-full bg-[#174a37] text-white text-center font-medium py-3.5 rounded-full hover:bg-[#1a5c45] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login ↗'}
          </button>
        </div>

        {/* Wedding photo */}
        <div className="flex-1 hidden lg:block">
          <div className="rounded-2xl overflow-hidden h-[520px]">
            <img src={BG} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
