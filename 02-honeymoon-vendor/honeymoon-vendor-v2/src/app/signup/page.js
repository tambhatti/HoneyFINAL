'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../lib/services/vendor.service';

const STEPS = [
  { title:'Personal Info',      desc:'Tell us about yourself' },
  { title:'Business Details',   desc:'Tell us about your business' },
  { title:'Account Setup',      desc:'Create your credentials' },
];

const EMIRATES  = ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'];
const CATEGORIES = ['Venue','Photography','Beauty','Decoration','Catering','Music','Transport'];

const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] transition-colors";
const lbl = "block text-sm font-medium text-gray-700 mb-1";

function validate(step, form) {
  const errs = {};
  if (step === 1) {
    if (!form.firstName?.trim())  errs.firstName  = 'First name is required';
    if (!form.lastName?.trim())   errs.lastName   = 'Last name is required';
    if (!form.phone?.trim())      errs.phone      = 'Phone number is required';
    if (!form.gender)             errs.gender     = 'Please select a gender';
  }
  if (step === 2) {
    if (!form.business?.trim())  errs.business  = 'Business name is required';
    if (!form.category)          errs.category  = 'Please select a category';
    if (!form.location)          errs.location  = 'Please select a location';
  }
  if (step === 3) {
    if (!form.email?.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.password || form.password.length < 8)               errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm)                           errs.confirm = 'Passwords do not match';
  }
  return errs;
}

export default function VendorSignUpPage() {
  const router  = useRouter();
  const fileRef = useRef(null);

  const [step,     setStep]     = useState(1);
  const [form,     setForm]     = useState({});
  const [errors,   setErrors]   = useState({});
  const [preview,  setPreview]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const f = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setApiError('Image must be under 5MB'); return; }
    setForm(p => ({ ...p, avatarFile: file }));
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function nextStep() {
    const errs = validate(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    if (step < 3) { setStep(s => s + 1); return; }
    handleSubmit();
  }

  async function handleSubmit() {
    setLoading(true); setApiError('');
    try {
      await AuthService.signup({
        firstName:   form.firstName,
        lastName:    form.lastName,
        phone:       `+971${form.phone.replace(/^0/,'')}`,
        gender:      form.gender,
        uaePass:     form.uaePass || undefined,
        companyName: form.business,
        category:    form.category,
        location:    form.location,
        description: form.description || undefined,
        email:       form.email,
        password:    form.password,
      });
      router.push('/login?signup=success');
    } catch (e) {
      setApiError(e?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] flex flex-col">
      {/* Header */}
      <header className="bg-[#174a37] h-[70px] flex items-center justify-between px-4 sm:px-6 lg:px-10 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#CFB383] rounded-full flex items-center justify-center">
            <img src="/logo-icon.svg" alt="" className="w-6 h-6 object-contain" />
          </div>
          <div className="hidden sm:block">
            <img src="/logo-text.svg" alt="HONEYMOON" className="h-3.5" />
            <img src="/logo-arabic.svg" alt="" className="h-2.5 mt-0.5" />
          </div>
        </Link>
        <p className="text-white/60 text-sm">Already a vendor? <Link href="/login" className="text-[#CFB383] hover:underline font-medium">Login</Link></p>
      </header>

      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-lg">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => {
              const idx = i + 1;
              const done = step > idx, current = step === idx;
              return (
                <div key={idx} className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${done ? 'bg-[#CFB383] text-white' : current ? 'bg-[#174a37] text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {done ? '✓' : idx}
                  </div>
                  <span className={`text-xs hidden sm:block truncate ${current ? 'text-[#1a1a1a] font-medium' : 'text-gray-400'}`}>{s.title}</span>
                  {i < 2 && <div className="flex-1 h-0.5 bg-gray-200 mx-1 shrink-0" />}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-8">
            <h2 className="font-baskerville text-2xl text-[#1a1a1a] mb-1">{STEPS[step-1].title}</h2>
            <p className="text-gray-400 text-sm mb-6">{STEPS[step-1].desc}</p>

            {/* Step 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                {/* Profile photo upload */}
                <div>
                  <label className={lbl}>Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-2xl">👤</span>}
                    </div>
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="text-sm text-[#174a37] border border-[rgba(23,74,55,0.3)] px-4 py-2 rounded-xl hover:bg-[#F5F5EF] transition-colors">
                      Upload Photo
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[['First Name*','firstName','text','Enter first name'],['Last Name*','lastName','text','Enter last name']].map(([l,k,t,p]) => (
                    <div key={k}>
                      <label className={lbl}>{l}</label>
                      <input type={t} value={form[k]||''} onChange={e=>f(k,e.target.value)} placeholder={p} className={`${inp} ${errors[k]?'border-red-400':''}`}/>
                      {errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>}
                    </div>
                  ))}
                </div>
                <div>
                  <label className={lbl}>Phone Number*</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-3 py-2.5 shrink-0 bg-[#faf8f4]">
                      <span>🇦🇪</span><span className="text-xs text-gray-500">+971</span>
                    </div>
                    <input value={form.phone||''} onChange={e=>f('phone',e.target.value)} placeholder="5X XXX XXXX" className={`flex-1 ${inp} ${errors.phone?'border-red-400':''}`}/>
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className={lbl}>Gender*</label>
                  <select value={form.gender||''} onChange={e=>f('gender',e.target.value)} className={`${inp} ${errors.gender?'border-red-400':''}`}>
                    <option value="">Select gender</option><option>Male</option><option>Female</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
                <div>
                  <label className={lbl}>UAE Pass <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input value={form.uaePass||''} onChange={e=>f('uaePass',e.target.value)} placeholder="Enter UAE Pass ID" className={inp}/>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className={lbl}>Business Name*</label>
                  <input value={form.business||''} onChange={e=>f('business',e.target.value)} placeholder="Your business or company name" className={`${inp} ${errors.business?'border-red-400':''}`}/>
                  {errors.business && <p className="text-red-500 text-xs mt-1">{errors.business}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Category*</label>
                    <select value={form.category||''} onChange={e=>f('category',e.target.value)} className={`${inp} ${errors.category?'border-red-400':''}`}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <label className={lbl}>Location*</label>
                    <select value={form.location||''} onChange={e=>f('location',e.target.value)} className={`${inp} ${errors.location?'border-red-400':''}`}>
                      <option value="">Select Emirate</option>
                      {EMIRATES.map(e => <option key={e}>{e}</option>)}
                    </select>
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                  </div>
                </div>
                <div>
                  <label className={lbl}>Business Description <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea value={form.description||''} onChange={e=>f('description',e.target.value)} rows={4}
                    placeholder="Describe your services, experience and what makes you special..." className={`${inp} resize-none`}/>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className={lbl}>Email Address*</label>
                  <input type="email" value={form.email||''} onChange={e=>f('email',e.target.value)} placeholder="vendor@example.com" className={`${inp} ${errors.email?'border-red-400':''}`}/>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className={lbl}>Password*</label>
                  <div className="relative">
                    <input type={showPass?'text':'password'} value={form.password||''} onChange={e=>f('password',e.target.value)} placeholder="Minimum 8 characters" className={`${inp} pr-10 ${errors.password?'border-red-400':''}`}/>
                    <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showPass?'🙈':'👁'}</button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className={lbl}>Confirm Password*</label>
                  <div className="relative">
                    <input type={showConf?'text':'password'} value={form.confirm||''} onChange={e=>f('confirm',e.target.value)} placeholder="Re-enter password" className={`${inp} pr-10 ${errors.confirm?'border-red-400':''}`}/>
                    <button type="button" onClick={()=>setShowConf(!showConf)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showConf?'🙈':'👁'}</button>
                  </div>
                  {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.terms||false} onChange={e=>f('terms',e.target.checked)} className="mt-0.5 accent-[#174a37] w-4 h-4"/>
                  <span className="text-xs text-gray-500">I agree to the <a href="#" className="text-[#CFB383] hover:underline">Terms of Service</a> and <a href="#" className="text-[#CFB383] hover:underline">Privacy Policy</a></span>
                </label>
              </div>
            )}

            {apiError && <p className="text-red-500 text-sm mt-4">{apiError}</p>}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s-1)}
                  className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
              )}
              <button type="button" onClick={nextStep} disabled={loading || (step===3 && !form.terms)}
                className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-semibold hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><span className="animate-spin">✦</span> Creating account…</> : step < 3 ? 'Continue →' : 'Create Account →'}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account? <Link href="/login" className="text-[#CFB383] hover:underline font-medium">Sign In</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
