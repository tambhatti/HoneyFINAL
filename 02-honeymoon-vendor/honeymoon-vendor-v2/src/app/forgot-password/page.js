'use client';
import api from '../../lib/api';
mport { useState } from 'react';
import Link from 'next/link';

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] transition-colors";

export default function VendorForgotPasswordPage() {
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
      await api.post('/auth/forgot-password', { email: email.trim(), role: 'vendor' });
      setStep(2); // always advance — email enumeration prevention
    } catch { setStep(2); } // same
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    if (!code.trim() || code.length < 4) { setError('Enter the 6-digit code from your email.'); return; }
    setLoading(true); setError('');
    try {
      const d = await api.post('/auth/verify-otp', { email, otp: code, purpose: 'forgot_password' });
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
      const d = await api.post('/auth/reset-password', { email, otp: code, newPassword: password, role: 'vendor' });
      if (!d.success) throw new Error(d.message || 'Failed to reset password.');
      setStep(4);
    } catch (e) { setError(e?.message || 'Failed to reset. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] flex flex-col">
      <header className="bg-[#174a37] h-[70px] flex items-center justify-between px-4 sm:px-6 lg:px-10 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#CFB383] rounded-full flex items-center justify-center">
            <img src="/logo-icon.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
          <img src="/logo-text.svg" alt="HONEYMOON" className="h-3.5 hidden sm:block" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-10">
            {step < 4 && (
              <>
                <div className="flex items-center gap-2 mb-6">
                  {[1,2,3].map(s => (
                    <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${step >= s ? 'bg-[#174a37]' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <div className="w-14 h-14 bg-[#F5F5EF] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {step === 1 ? '✉' : step === 2 ? '🔑' : '🔒'}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="font-baskerville text-2xl text-center text-[#1a1a1a] mb-1">Forgot Password?</h2>
                <p className="text-gray-400 text-sm text-center mb-6">Enter your email and we'll send a reset code.</p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} placeholder="vendor@example.com" className={inp} onKeyDown={e=>e.key==='Enter'&&sendOtp()}/>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                <button onClick={sendOtp} disabled={loading} className="w-full mt-4 bg-[#174a37] text-white py-3.5 rounded-full font-semibold hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="animate-spin text-lg">✦</span> Sending…</> : 'Send Reset Code →'}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-baskerville text-2xl text-center text-[#1a1a1a] mb-1">Enter Reset Code</h2>
                <p className="text-gray-400 text-sm text-center mb-6">We sent a 6-digit code to <strong>{email}</strong>.</p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input value={code} onChange={e=>{setCode(e.target.value.replace(/\D/g,'').slice(0,6));setError('');}} placeholder="000000" maxLength={6}
                  className={`${inp} tracking-[0.3em] text-center font-mono text-xl`} onKeyDown={e=>e.key==='Enter'&&verifyOtp()}/>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                <button onClick={verifyOtp} disabled={loading||code.length<4} className="w-full mt-4 bg-[#174a37] text-white py-3.5 rounded-full font-semibold hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="animate-spin text-lg">✦</span> Verifying…</> : 'Verify Code →'}
                </button>
                <button onClick={sendOtp} className="w-full mt-3 text-sm text-gray-400 hover:text-[#CFB383] transition-colors">Resend code</button>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="font-baskerville text-2xl text-center text-[#1a1a1a] mb-1">New Password</h2>
                <p className="text-gray-400 text-sm text-center mb-6">Choose a strong password for your account.</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input type={showP?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('');}} placeholder="Minimum 8 characters" className={`${inp} pr-10`}/>
                      <button type="button" onClick={()=>setShowP(!showP)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showP?'🙈':'👁'}</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input type={showC?'text':'password'} value={confirm} onChange={e=>{setConfirm(e.target.value);setError('');}} placeholder="Re-enter new password" className={`${inp} pr-10`}/>
                      <button type="button" onClick={()=>setShowC(!showC)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showC?'🙈':'👁'}</button>
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                <button onClick={resetPassword} disabled={loading} className="w-full mt-5 bg-[#174a37] text-white py-3.5 rounded-full font-semibold hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="animate-spin text-lg">✦</span> Resetting…</> : 'Reset Password →'}
                </button>
              </>
            )}

            {step === 4 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-green-600">✓</div>
                <h2 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Password Reset!</h2>
                <p className="text-gray-400 text-sm mb-6">Your password has been updated successfully. You can now log in.</p>
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
