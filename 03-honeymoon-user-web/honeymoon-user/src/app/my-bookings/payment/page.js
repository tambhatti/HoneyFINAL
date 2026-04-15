'use client';
import UserService from '../../../lib/services/user.service';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';

function ErrorModal({ message, onClose }) {
  return (
    <ModalLayer open onClose={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[400px] p-8 text-center shadow-2xl">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">✕</div>
        <h3 className="font-baskerville text-xl text-[#1a1a1a] mb-2">Payment Failed</h3>
        <p className="text-black/40 text-sm mb-6">{message}</p>
        <button type="button" onClick={onClose}
          className="w-full bg-[#174a37] text-white py-3 rounded-xl font-medium hover:bg-[#1a5c45] transition-colors">
          Try Again
        </button>
      </div>
    </ModalLayer>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const bookingId    = searchParams.get('bookingId') || '';
  const isCustom     = searchParams.get('custom') === '1';

  const [booking,    setBooking]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [method,     setMethod]     = useState('card');
  const [processing, setProcessing] = useState(false);
  const [errorMsg,   setErrorMsg]   = useState('');

  useEffect(() => {
    if (!bookingId) { setLoading(false); return; }
    (async () => {
      try {
        const r = isCustom
          ? await UserService.getMyCustomQuotation(bookingId)
          : await UserService.getMyBooking(bookingId);
        setBooking(isCustom ? r.quotation : r.booking);
      } catch (e) { setErrorMsg(e?.message); }
      finally { setLoading(false); }
    })();
  }, [bookingId, isCustom]);

  const totalAmount   = booking?.totalAmount || 0;
  const depositAmount = booking?.depositAmount || 0;
  const depositPaid   = booking?.depositPaid || false;
  const chargeAmount  = depositPaid ? (totalAmount - depositAmount) : depositAmount;
  const paymentLabel  = depositPaid ? 'Final Payment' : 'Deposit (first payment)';

  const handlePay = async () => {
    if (!bookingId) return;
    setProcessing(true);
    setErrorMsg('');
    try {
      const result = await UserService.processPayment({ bookingId, method, useCustomQuotation: isCustom });
      if (result?.redirect_url) {
        window.location.href = result.redirect_url;
      } else if (result?.method === 'bank_transfer') {
        alert(`Bank transfer details:\nAccount: ${result.bankDetails?.accountName}\nIBAN: ${result.bankDetails?.iban}\nRef: ${result.bankDetails?.reference}`);
      } else {
        throw new Error('No payment URL received');
      }
    } catch (e) {
      setErrorMsg(e?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingId) return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="text-center">
        <p className="text-black/40 mb-4">No booking specified.</p>
        <Link href="/my-bookings" className="text-[#174a37] hover:underline">Back to bookings</Link>
      </div>
    </div>
  );

  return (
    <>
      {errorMsg && <ErrorModal message={errorMsg} onClose={() => setErrorMsg('')} />}
      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm text-black/40">
          <Link href="/my-bookings" className="hover:text-[#174a37]">My Bookings</Link>
          <span>/</span><span className="text-[#1a1a1a]">Make Payment</span>
        </div>
        <h1 className="font-baskerville text-2xl sm:text-3xl text-[#1a1a1a] mb-6">Make Payment</h1>

        {loading ? (
          <div className="text-center py-10 text-black/40">Loading booking details…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
                <h2 className="font-baskerville text-lg sm:text-xl text-[#1a1a1a] mb-4">Payment Method</h2>
                <div className="flex flex-col gap-3 mb-6">
                  {[['card','💳 Credit / Debit Card'],['apple_pay','🍎 Apple Pay'],['bank_transfer','🏦 Bank Transfer']].map(([id,label])=>(
                    <label key={id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${method===id?'border-[#174a37] bg-[#f9f6ef]':'border-[rgba(184,154,105,0.3)] hover:border-[#CFB383]'}`}>
                      <input type="radio" name="method" value={id} checked={method===id} onChange={()=>setMethod(id)} className="accent-[#174a37]"/>
                      <span className="text-sm font-medium text-[#1a1a1a]">{label}</span>
                    </label>
                  ))}
                </div>
                {method === 'bank_transfer' && (
                  <div className="bg-[#f9f6ef] rounded-xl p-4">
                    <p className="text-sm text-black/50">Bank transfer details will be shown after clicking Pay. Allow 1–2 business days for verification.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_15px_rgba(0,0,0,0.06)] h-fit lg:sticky lg:top-[88px]">
              <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-4">Payment Summary</h3>
              <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-[rgba(184,154,105,0.1)]">
                {booking?.vendor?.companyName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-black/50">Vendor</span>
                    <span className="font-medium">{booking.vendor.companyName}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-black/50">{paymentLabel}</span>
                  <span className="font-medium">AED {chargeAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black/50">VAT (5%)</span>
                  <span className="font-medium">AED {(chargeAmount * 0.05).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-5">
                <span className="font-medium">Total Due</span>
                <span className="font-baskerville text-xl sm:text-2xl text-[#174a37] tabular-nums">
                  AED {(chargeAmount * 1.05).toLocaleString()}
                </span>
              </div>
              <button type="button" onClick={handlePay} disabled={processing}
                className="w-full bg-[#CFB383] text-white py-3.5 rounded-xl font-medium hover:bg-[#B8A06E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {processing ? 'Redirecting…' : `Pay AED ${(chargeAmount * 1.05).toLocaleString()}`}
              </button>
              <p className="text-center text-xs text-black/30 mt-3">🔒 Secured by PayTabs</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default function BookingPaymentPage() {
  return (
    <div className="min-h-screen bg-[#F5F5EF] flex flex-col w-full min-w-0">
      <LoggedInNav />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20 text-black/40">Loading…</div>}>
        <PaymentContent />
      </Suspense>
      <Footer />
    </div>
  );
}
