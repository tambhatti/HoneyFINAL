'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import Link from 'next/link';
export default function PaymentLogDetailPage({ params }) {
  const paymentId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getPaymentLog, paymentId);
  const payment = data?.payment || {};
  return (
    <div className="w-full min-w-0 max-w-2xl">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 sm:mb-6 text-sm text-gray-400 min-w-0">
        <Link href="/dashboard/payment-logs" className="hover:text-[#174a37] shrink-0">Payment Logs</Link>
        <span className="shrink-0">/</span><span className="text-gray-800 truncate min-w-0">{params.id}</span>
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 min-w-0">
          <h1 className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] min-w-0">Transaction Details</h1>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium text-green-700 bg-green-100 shrink-0 self-start sm:self-auto">Success</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['Transaction ID',params.id],['Amount','AED 45,000'],['User','John Harper'],['Vendor','Al Habtoor Palace'],['Method','Visa Card ending 4242'],['Date','15/01/2025 2:34 PM'],['Booking ID','BK-2025-0001'],['Reference','REF-HM-2025-4231']].map(([l,v]) => (
            <div key={l} className="bg-[#f9f6ef] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
              <p className="text-[#1a1a1a] font-medium text-sm mt-1 font-mono">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
