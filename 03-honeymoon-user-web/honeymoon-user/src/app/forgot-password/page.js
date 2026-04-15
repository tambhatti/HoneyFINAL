'use client';
import api from '../../lib/api';
mport { useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';

const inp  = "w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] transition-colors";

export default function ForgotPasswordPage() {
  const [step,     setStep]     = useState(1);
  const [email,    setEmail]    = useState('');
  const [code,     setCode]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showP,    setShowP]    = useState(false);
  const [showC,    setShowC]    = useState(false);

  async function sendOtp() {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/auth/forgot-password', { email: email.trim(), role: 'user' });
      setStep(2);
    } catch { setStep(2); }
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    if (!code.trim() || code.length < 4) { setError('Enter the 6-digit code sent to your email.'); return; }
    setLoading(true); setError('');
    try {
      const r = await fetch(`${BASE}/auth/verify-otp`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, otp: code, purpose:'forgot_password' }) });
      const d = await r.json();
      if (!d.success) throw new Error(d.message || 'Invalid or expired code.');
      setStep(3);
    } catch (e) { setError(e?.message || 'Invalid code. Please try again.'); }
    finally { setLoading(false); }
  }

  async function resetPassword() {
    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      const r = await fetch(`${BASE}/auth/reset-password`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, otp: code, newPassword: password, role:'user' }) });
      const d = await r.json();
      if (!d.success) throw new Error(d.message || 'Failed to reset password.');
      setStep(4);
    } catch (e) { setError(e?.message || 'Failed to reset. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] flex flex-col w-full min-w-0">
      <PublicNav variant="solid" ctaHref="/login" ctaLabel="Sign In" />

      <main className="flex-1 flex items-center justify-center px-4 py-10 pt-[108px]">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-10">
            {/* Progress */}
            {step < 4 && (
              <div className="flex gap-1.5 mb-8">
                {[1,2,3].map(s => (
                  <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${step >= s ? 'bg-[#174a37]' : 'bg-gray-200'}`} />
                ))}
              </div>
            )}

            {step === 1 && (
              <>
                <div className="text-3xl text-center mb-4">✉️</div>
                <h2 className="font-baskerville text-2xl text-center text-[#1a1a1a] mb-2">Forgot Password?</h2>
                <p className="text-gray-400 text-sm text-center mb-6">Enter your email and we'll send a reset code.</p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="your@email.com" className={inp} onKeyDown={e => e.key === 'Enter' && sendOtp()}/>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                <button onClick={sendOtp} disabled={loading} className="w-full mt-4 bg-[#174a37] text-white py-3.5 rounded-full font-semibold hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="animate-spin">✦</span> Sending…</> : 'Send Reset Code →'}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-3xl text-center mb-4">🔑</div>
                <h2 className="font-baskerville text-2xl text-center text-[#1a1a1a] mb-2">Check Your Email</h2>
                <p className="text-gray-400 text-sm text-center mb-6">We sent a 6-digit code to <strong className="text-[#1a1a1a]">{email}</strong></p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input value={code} onChange={e => { setCode(e.target.value.replace(/\D/g,'').slice(0,6)); setError(''); }}
                  placeholder="000000" maxLength={6} className={`${inp} tracking-[0.4em] text-center font-mono text-xl`}
                  onKeyDown={e => e.key === 'Enter' && verifyOtp()}/>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                <button onClick={verifyOtp} disabled={loading || code.length < 4} className="w-full mt-4 bg-[#174a37] text-white py-3.5 rounded-full font-semibold hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="animate-spin">✦</span> Verifying…</> : 'Verify Code →'}
                </button>
                <button onClick={sendOtp} className="w-full mt-3 text-sm text-gray-400 hover:text-[#CFB383] transition-colors">Resend code</button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-3xl text-center mb-4">🔒</div>
                <h2 className="font-baskerville text-2xl text-center text-[#1a1a1a] mb-2">New Password</h2>
                <p className="text-gray-400 text-sm text-center mb-6">Choose a strong new password.</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input type={showP ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                        placeholder="Minimum 8 characters" className={`${inp} pr-10`}/>
                      <button type="button" onClick={() => setShowP(!showP)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showP ? '🙈' : '👁'}</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input type={showC ? 'text' : 'password'} value={confirm} onChange={e => { setConfirm(e.target.value); setError(''); }}
                        placeholder="Re-enter new password" className={`${inp} pr-10`}/>
                      <button type="button" onClick={() => setShowC(!showC)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showC ? '🙈' : '👁'}</button>
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                <button onClick={resetPassword} disabled={loading} className="w-full mt-5 bg-[#174a37] text-white py-3.5 rounded-full font-semibold hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="animate-spin">✦</span> Resetting…</> : 'Reset Password →'}
                </button>
              </>
            )}

            {step === 4 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-green-600">✓</div>
                <h2 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Password Reset!</h2>
                <p className="text-gray-400 text-sm mb-6">Your password has been updated successfully.</p>
                <Link href="/login" className="block w-full bg-[#174a37] text-white py-3.5 rounded-full font-semibold hover:bg-[#1a5c45] transition-colors text-center">
                  Back to Login →
                </Link>
              </div>
            )}

            {step < 4 && (
              <div className="text-center mt-5">
                <Link href="/login" className="text-sm text-gray-400 hover:text-[#CFB383] transition-colors">← Back to login</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
