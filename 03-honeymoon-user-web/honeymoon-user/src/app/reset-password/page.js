'use client';
import { AuthService } from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const imgRectangle7 = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const imgGroup180 = "/logo-icon.svg";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [done, setDone] = useState(false);

  const strength = form.password.length < 6 ? 'weak' : form.password.length < 10 ? 'medium' : 'strong';
  const match = form.confirm && form.password === form.confirm;

  return (
    <div className="min-h-screen min-h-dvh flex w-full min-w-0">
      <div className="hidden lg:flex flex-1 relative overflow-hidden min-w-0">
        <img src={imgRectangle7} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#174a37]/75" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link href="/"><img src={imgGroup180} alt="" className="h-12 w-auto" /></Link>
          <div>
            <h2 className="font-baskerville text-[36px] xl:text-[48px] leading-tight xl:leading-[56px] text-white capitalize mb-4">Create a new password</h2>
            <p className="text-white/60 text-lg leading-7 max-w-[340px]">Choose something strong and memorable to protect your account.</p>
          </div>
          <p className="text-white/30 text-sm">© 2025 HoneyMoon.</p>
        </div>
      </div>

      <div className="flex-1 lg:max-w-[520px] flex items-center justify-center p-4 sm:p-8 bg-white min-w-0">
        <div className="w-full max-w-[400px] min-w-0">
          {done ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F5F5EF] rounded-full flex items-center justify-center text-[#174a37] text-3xl mx-auto mb-6">✓</div>
              <h1 className="font-baskerville text-[28px] sm:text-[34px] md:text-[36px] text-[#1a1a1a] mb-2">Password Reset!</h1>
              <p className="text-black/40 mb-8">You can now sign in with your new password.</p>
              <Link href="/login" className="block w-full bg-[#174a37] text-white text-sm font-medium py-3.5 rounded-xl hover:bg-[#1a5c45] transition-colors text-center">
                Sign In →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-baskerville text-[28px] sm:text-[34px] md:text-[36px] text-[#1a1a1a] mb-1">Reset Password</h1>
              <p className="text-black/40 mb-8 text-sm">Enter your new password below.</p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">New Password</label>
                  <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] transition-all" />
                  {form.password && (
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex gap-1 flex-1 min-w-0">
                        {['weak', 'medium', 'strong'].map((s, i) => (
                          <div key={s} className={`h-1 flex-1 rounded-full ${
                            (strength === 'weak' && i === 0) ? 'bg-red-400' :
                            (strength === 'medium' && i <= 1) ? 'bg-amber-400' :
                            (strength === 'strong') ? 'bg-green-400' : 'bg-[#F5F5EF]'
                          }`} />
                        ))}
                      </div>
                      <span className="text-xs text-black/40 capitalize">{strength}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Confirm Password</label>
                  <input type="password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="••••••••"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                      form.confirm ? (match ? 'border-green-400 focus:border-green-400' : 'border-red-300 focus:border-red-400') : 'border-[rgba(184_154_105_/_0.3)] focus:border-[#CFB383]'
                    }`} />
                  {form.confirm && !match && <p className="text-xs text-red-400 mt-1">Passwords don't match</p>}
                </div>
                <button type="button" onClick={() => match && setDone(true)}
                  className={`w-full text-sm font-medium py-3.5 rounded-xl transition-colors ${match ? 'bg-[#174a37] text-white hover:bg-[#1a5c45]' : 'bg-[#F5F5EF] text-black/30 cursor-not-allowed'}`}>
                  Set New Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
