'use client';
import { AuthService } from '../../lib/services/user.service';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const imgRectangle7 = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const imgGroup180 = "/logo-icon.svg";

export default function OTPPage() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const [timer, setTimer] = useState(59);
  const inputs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleVerify = () => {
    if (otp.join('').length === 6) setVerified(true);
  };

  return (
    <div className="min-h-screen min-h-dvh flex w-full min-w-0">
      <div className="hidden lg:flex flex-1 relative overflow-hidden min-w-0">
        <img src={imgRectangle7} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#174a37]/75" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <img src={imgGroup180} alt="" className="h-12 w-auto" />
          </Link>
          <div>
            <h2 className="font-baskerville text-[36px] xl:text-[48px] leading-tight xl:leading-[56px] text-white capitalize mb-4">Verify your identity</h2>
            <p className="text-white/60 text-lg max-w-[360px] leading-7">We take security seriously. A quick verification keeps your account safe.</p>
          </div>
          <p className="text-white/30 text-sm">© 2025 HoneyMoon. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 lg:max-w-[520px] flex items-center justify-center p-4 sm:p-8 bg-white min-w-0">
        <div className="w-full max-w-[400px] min-w-0">
          {verified ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F5F5EF] rounded-full flex items-center justify-center text-[#174a37] text-3xl mx-auto mb-6">✓</div>
              <h1 className="font-baskerville text-[28px] sm:text-[34px] md:text-[36px] text-[#1a1a1a] mb-2">Verified!</h1>
              <p className="text-black/40 mb-8">Your account has been verified successfully.</p>
              <Link href="/dashboard" className="block w-full bg-[#174a37] text-white text-sm font-medium py-3.5 rounded-xl hover:bg-[#1a5c45] transition-colors text-center">
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-baskerville text-[28px] sm:text-[34px] md:text-[36px] text-[#1a1a1a] mb-2">Enter OTP</h1>
              <p className="text-black/40 mb-2 text-sm break-words">We sent a 6-digit code to <span className="text-[#1a1a1a] font-medium">r*****@gmail.com</span></p>
              <p className="text-black/30 text-xs mb-8">Code expires in 00:{String(timer).padStart(2, '0')}</p>

              <div className="flex gap-1.5 sm:gap-3 mb-8 justify-center flex-wrap max-w-full px-1">
                {otp.map((digit, i) => (
                  <input key={i} ref={el => inputs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className={`w-9 h-11 sm:w-12 sm:h-14 text-center text-lg sm:text-[24px] font-baskerville border-2 rounded-lg sm:rounded-xl outline-none transition-all shrink-0 ${
                      digit ? 'border-[#174a37] bg-[#F5F5EF] text-[#174a37]' : 'border-[rgba(184_154_105_/_0.3)] focus:border-[#CFB383]'
                    }`} />
                ))}
              </div>

              <button type="button" onClick={handleVerify}
                className={`w-full text-sm font-medium py-3.5 rounded-xl transition-colors mb-4 ${
                  otp.join('').length === 6 ? 'bg-[#174a37] text-white hover:bg-[#1a5c45]' : 'bg-[#F5F5EF] text-black/30 cursor-not-allowed'
                }`}>
                Verify OTP
              </button>

              <p className="text-center text-sm text-black/40">
                Didn't receive it?{' '}
                {timer === 0 ? (
                  <button type="button" onClick={() => { setResent(true); setTimer(59); }} className="text-[#CFB383] font-medium hover:underline">Resend code</button>
                ) : (
                  <span className="text-black/30">Resend in {timer}s</span>
                )}
              </p>
              {resent && <p className="text-center text-xs text-green-600 mt-2">Code resent successfully!</p>}

              <div className="mt-8 text-center">
                <Link href="/login" className="text-sm text-black/40 hover:text-[#CFB383] transition-colors">← Back to login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
