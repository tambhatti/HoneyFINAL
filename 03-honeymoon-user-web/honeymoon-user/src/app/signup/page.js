'use client';
import { useUserAuth } from '../../context/auth';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PublicNav from '@/components/PublicNav';

const inp = "w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] transition-colors";

function validate(form) {
  const e = {};
  if (!form.firstName?.trim()) e.firstName = 'First name is required';
  if (!form.lastName?.trim())  e.lastName  = 'Last name is required';
  if (!form.phone?.trim())     e.phone     = 'Phone number is required';
  if (!form.gender)            e.gender    = 'Please select a gender';
  if (!form.email?.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
  if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
  if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
  return e;
}

export default function SignupPage() {
  const { signup } = useUserAuth();
  const router  = useRouter();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    firstName:'', lastName:'', gender:'', phone:'', uaePass:'', email:'', password:'', confirm:''
  });
  const [errors,   setErrors]   = useState({});
  const [preview,  setPreview]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [showP,    setShowP]    = useState(false);
  const [showC,    setShowC]    = useState(false);

  const f = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setApiError('Image must be under 5MB'); return; }
    setForm(p => ({ ...p, avatarFile: file }));
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!form.terms) { setApiError('Please accept the Terms of Service'); return; }
    setSaving(true); setApiError('');
    try {
      await signup({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim().toLowerCase(),
        password:  form.password,
        phone:     `+971${form.phone.replace(/^0/, '')}`,
        gender:    form.gender,
        uaePass:   form.uaePass || undefined,
      });
      router.push('/onboarding');
    } catch (err) {
      setApiError(err.message || 'Sign up failed. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] w-full min-w-0">
      <PublicNav variant="solid" ctaHref="/login" ctaLabel="Sign In" />

      <main className="flex flex-col items-center py-10 sm:py-14 px-4 pt-[108px]">
        <div className="w-full max-w-[520px]">
          <div className="text-center mb-8">
            <h1 className="font-baskerville text-[28px] sm:text-[36px] text-[#1a1a1a]">Create Your Account</h1>
            <p className="text-black/40 text-sm mt-2">Join thousands of couples planning their perfect day</p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-8">
            {/* Avatar upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[rgba(184,154,105,0.2)] bg-[#F5F5EF] flex items-center justify-center">
                  {preview
                    ? <img src={preview} alt="" className="w-full h-full object-cover"/>
                    : <span className="text-gray-300 text-3xl">👤</span>
                  }
                </div>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-[#174a37] rounded-full flex items-center justify-center text-white text-xs shadow hover:bg-[#1a5c45] transition-colors">
                  📷
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto}/>
              </div>
              <p className="text-xs text-gray-400 mt-2">Upload profile photo</p>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[['First Name*','firstName'],['Last Name*','lastName']].map(([l,k]) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                  <input value={form[k]} onChange={e => f(k, e.target.value)} className={`${inp} ${errors[k] ? 'border-red-400' : ''}`}/>
                  {errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>}
                </div>
              ))}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 border border-[#d4d4d4] rounded-xl px-3 py-3 shrink-0 bg-[#faf8f4]">
                  <span>🇦🇪</span><span className="text-xs text-gray-500">+971</span>
                </div>
                <input value={form.phone} onChange={e => f('phone', e.target.value.replace(/\D/g,''))}
                  placeholder="5X XXX XXXX" className={`flex-1 ${inp} ${errors.phone ? 'border-red-400' : ''}`}/>
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
              <select value={form.gender} onChange={e => f('gender', e.target.value)} className={`${inp} ${errors.gender ? 'border-red-400' : ''}`}>
                <option value="">Select gender</option>
                <option>Male</option><option>Female</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            {/* UAE Pass */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UAE Pass <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <input value={form.uaePass} onChange={e => f('uaePass', e.target.value)} placeholder="Enter UAE Pass ID" className={inp}/>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
              <input type="email" value={form.email} onChange={e => f('email', e.target.value)}
                placeholder="your@email.com" className={`${inp} ${errors.email ? 'border-red-400' : ''}`}/>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
              <div className="relative">
                <input type={showP ? 'text' : 'password'} value={form.password} onChange={e => f('password', e.target.value)}
                  placeholder="Minimum 8 characters" className={`${inp} pr-10 ${errors.password ? 'border-red-400' : ''}`}/>
                <button type="button" onClick={() => setShowP(!showP)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showP ? '🙈' : '👁'}</button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
              <div className="relative">
                <input type={showC ? 'text' : 'password'} value={form.confirm} onChange={e => f('confirm', e.target.value)}
                  placeholder="Re-enter password" className={`${inp} pr-10 ${errors.confirm ? 'border-red-400' : ''}`}/>
                <button type="button" onClick={() => setShowC(!showC)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showC ? '🙈' : '👁'}</button>
              </div>
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 mb-5 cursor-pointer">
              <input type="checkbox" checked={form.terms||false} onChange={e => f('terms', e.target.checked)} className="mt-0.5 accent-[#174a37] w-4 h-4 shrink-0"/>
              <span className="text-xs text-gray-500">I agree to the <a href="#" className="text-[#CFB383] hover:underline">Terms of Service</a> and <a href="#" className="text-[#CFB383] hover:underline">Privacy Policy</a></span>
            </label>

            {apiError && <p className="text-red-500 text-sm mb-4 text-center">{apiError}</p>}

            <button type="button" onClick={handleSubmit} disabled={saving}
              className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-semibold hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <><span className="animate-spin text-lg">✦</span> Creating…</> : 'Create Account →'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account? <Link href="/login" className="text-[#CFB383] hover:underline font-medium">Sign In</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
