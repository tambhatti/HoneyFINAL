'use client';
import UserService from '../../../../lib/services/user.service';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ModalLayer from '@/components/ModalLayer';

function PaymentErrorModal({ message, onClose }) {
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="checkout-error-title">
      <div className="bg-white rounded-2xl w-full max-w-[440px] p-6 sm:p-10 text-center shadow-2xl">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto mb-6">✕</div>
        <h2 id="checkout-error-title" className="font-baskerville text-2xl text-[#1a1a1a] mb-3">Payment Failed</h2>
        <p className="text-black/50 text-sm mb-8">{message}</p>
        <button type="button" onClick={onClose}
          className="w-full bg-[#174a37] text-white font-medium py-3 rounded-xl hover:bg-[#1a5c45] transition-colors text-sm">
          Try Again
        </button>
      </div>
    </ModalLayer>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  /* B-03: Read bookingId and type from URL — was hardcoded */
  const bookingId          = searchParams.get('bookingId') || '';
  const useCustomQuotation = searchParams.get('custom') === '1';

  const [processing, setProcessing] = useState(false);
  const [method, setMethod]         = useState('card');
  const [errorMsg, setErrorMsg]     = useState('');
  const [booking, setBooking]       = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(true);

  useEffect(() => {
    if (!bookingId) { setLoadingBooking(false); return; }
    (async () => {
      try {
        const res = useCustomQuotation
          ? await UserService.getMyCustomQuotation(bookingId)
          : await UserService.getMyBooking(bookingId);
        setBooking(useCustomQuotation ? res.quotation : res.booking);
      } catch { /* show empty state */ }
      finally { setLoadingBooking(false); }
    })();
  }, [bookingId, useCustomQuotation]);

  const totalAmount   = booking?.totalAmount || 0;
  const depositAmount = booking?.depositAmount || 0;
  const depositPaid   = booking?.depositPaid || false;
  const chargeAmount  = depositPaid ? (totalAmount - depositAmount) : depositAmount;
  const paymentLabel  = depositPaid ? 'Final Payment' : 'Deposit';

  /* B-03: Actually call the payment API and redirect to PayTabs */
  const handlePay = async () => {
    if (!bookingId) return;
    setProcessing(true);
    setErrorMsg('');
    try {
      const result = await UserService.processPayment({ bookingId, method, useCustomQuotation });
      if (result?.redirect_url) {
        /* Redirect to PayTabs hosted payment page */
        window.location.href = result.redirect_url;
      } else if (result?.method === 'bank_transfer') {
        router.push(`/dashboard/payments?bankDetails=${encodeURIComponent(JSON.stringify(result.bankDetails))}`);
      } else {
        throw new Error('No payment URL received from gateway');
      }
    } catch (e) {
      setErrorMsg(e?.message || 'Payment initiation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'card',          label: 'Card',          icon: '💳' },
    { id: 'apple_pay',     label: 'Apple Pay',     icon: '🍎' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  ];

  if (!bookingId) {
    return (
      <div className="w-full max-w-[600px] py-20 text-center">
        <p className="text-black/50 mb-4">No booking specified.</p>
        <Link href="/dashboard/bookings" className="text-[#174a37] hover:underline">Back to bookings</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] min-w-0 pb-6">
      {errorMsg && <PaymentErrorModal message={errorMsg} onClose={() => setErrorMsg('')} />}

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm text-black/40 min-w-0">
        <Link href="/dashboard/payments" className="hover:text-[#174a37] transition-colors">Payments</Link>
        <span>/</span>
        <span className="text-[#1a1a1a]">Checkout</span>
      </div>

      <h1 className="font-baskerville text-[26px] sm:text-[32px] md:text-[36px] text-[#1a1a1a] mb-6 sm:mb-8">Make Payment</h1>

      {loadingBooking ? (
        <div className="text-center py-10 text-black/40">Loading booking details…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment method */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
              <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {paymentMethods.map(m => (
                  <button type="button" key={m.id} onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      method === m.id ? 'border-[#174a37] bg-[#F5F5EF]' : 'border-[rgba(184_154_105_/_0.2)] hover:border-[#CFB383]'
                    }`}>
                    <span className="text-2xl">{m.icon}</span>
                    <span className={`text-xs font-medium ${method === m.id ? 'text-[#174a37]' : 'text-black/60'}`}>{m.label}</span>
                  </button>
                ))}
              </div>
              {method === 'bank_transfer' && (
                <p className="text-sm text-black/50 bg-[#faf8f4] rounded-xl p-4">
                  Bank transfer details will be shown after clicking Pay. Please allow 1–2 business days for verification.
                </p>
              )}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
              <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                {[
                  ['Package Total',      `AED ${totalAmount.toLocaleString()}`],
                  [paymentLabel,         `AED ${chargeAmount.toLocaleString()}`],
                  ['Processing Fee',     'AED 0'],
                  ['VAT (5%)',           `AED ${(chargeAmount * 0.05).toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-black/50">{l}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
                <div className="border-t border-[rgba(184_154_105_/_0.2)] pt-3 flex justify-between items-center">
                  <span className="font-medium">Total Due Now</span>
                  <span className="font-baskerville text-[22px] sm:text-[28px] text-[#174a37] tabular-nums">
                    AED {(chargeAmount * 1.05).toLocaleString()}
                  </span>
                </div>
              </div>
              <button type="button" onClick={handlePay} disabled={processing}
                className="mt-6 w-full bg-[#174a37] text-white font-medium py-4 rounded-xl hover:bg-[#1a5c45] transition-colors shadow-[0_4px_16px_rgba(23_74_55_/_0.2)] disabled:opacity-60 disabled:cursor-not-allowed">
                {processing ? 'Redirecting to payment…' : `Pay AED ${(chargeAmount * 1.05).toLocaleString()}`}
              </button>
              <Link href="/dashboard/bookings"
                className="block text-center text-sm text-black/40 hover:text-[#CFB383] transition-colors mt-4">
                Cancel
              </Link>
            </div>
          </div>

          {/* Booking info sidebar */}
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] h-fit">
            <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-4">Booking #{bookingId.slice(-6).toUpperCase()}</h3>
            <div className="space-y-2 text-sm text-black/60">
              {booking?.vendor?.companyName && <p>🏢 {booking.vendor.companyName}</p>}
              {booking?.eventDate && <p>📅 {new Date(booking.eventDate).toLocaleDateString()}</p>}
              {booking?.location && <p>📍 {booking.location}</p>}
              <p className="text-[#174a37] font-medium">
                {depositPaid ? '✓ Deposit already paid' : `Deposit: AED ${depositAmount.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-black/40">Loading…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
