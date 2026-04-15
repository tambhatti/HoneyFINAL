'use client';
import { useApi } from '../../../hooks/useApi';
import { VendorService } from '../../../lib/services/vendor.service';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentContent() {
  const searchParams = useSearchParams();
  const planId       = searchParams.get('planId')   || '';
  const billing      = searchParams.get('billing')  || 'monthly';
  const amount       = searchParams.get('amount')   || '';

  const [method,     setMethod]     = useState('card');
  const [processing, setProcessing] = useState(false);
  const [error,      setError]      = useState('');

  const handlePay = async () => {
    if (!planId) return setError('No plan selected. Go back and choose a plan.');
    setProcessing(true); setError('');
    try {
      const result = await VendorService.paySubscription({ planId, billing });
      if (result?.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        throw new Error('No payment URL received from gateway.');
      }
    } catch (e) {
      setError(e?.message || 'Payment failed. Please try again.');
    } finally { setProcessing(false); }
  };

  return (
    <div className="max-w-xl w-full min-w-0">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 text-lg shrink-0">←</button>
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">Complete Payment</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Order summary */}
        <div className="px-5 sm:px-6 py-5 bg-[#f9f6ef] border-b border-[rgba(184,154,105,0.2)]">
          <h2 className="font-semibold text-[#1a1a1a] text-sm mb-3">Order Summary</h2>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Subscription Plan</span>
            <span className="font-medium capitalize">{billing} billing</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">Plan ID</span>
            <span className="font-mono text-xs text-gray-500">{planId.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between font-baskerville text-lg">
            <span>Total Due</span>
            <span className="text-[#174a37]">{amount ? `AED ${Number(amount).toLocaleString()}` : '—'}</span>
          </div>
        </div>

        {/* Payment method selection */}
        <div className="px-5 sm:px-6 py-5">
          <h2 className="font-semibold text-[#1a1a1a] text-sm mb-4">Payment Method</h2>
          <div className="flex flex-col gap-3 mb-5">
            {[['card','💳 Credit / Debit Card'],['apple_pay','🍎 Apple Pay']].map(([id, label]) => (
              <label key={id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${method===id ? 'border-[#174a37] bg-[#f9f6ef]' : 'border-gray-200 hover:border-[#CFB383]'}`}>
                <input type="radio" name="method" value={id} checked={method===id} onChange={() => setMethod(id)} className="accent-[#174a37]"/>
                <span className="text-sm font-medium text-[#1a1a1a]">{label}</span>
              </label>
            ))}
          </div>
          <div className="bg-[#f9f6ef] rounded-xl p-4 mb-5">
            <p className="text-sm text-gray-500">
              <span className="font-medium text-[#174a37]">Secure payment</span> via PayTabs. You'll be redirected to the payment gateway to complete the transaction. No card details are stored on this platform.
            </p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button onClick={handlePay} disabled={processing || !planId}
            className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-semibold hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {processing ? <><span className="animate-spin text-lg">✦</span> Redirecting…</> : `Pay${amount ? ` AED ${Number(amount).toLocaleString()}` : ''} →`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">🔒 Secured by PayTabs · SSL encrypted</p>
        </div>
      </div>
    </div>
  );
}

export default function VendorPaymentPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading…</div>}>
      <PaymentContent />
    </Suspense>
  );
}
