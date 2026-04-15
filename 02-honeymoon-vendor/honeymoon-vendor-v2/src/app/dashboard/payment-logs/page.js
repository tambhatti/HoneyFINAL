'use client';
import { usePaginated } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';

const LOGS = Array.from({ length: 15 }, (_, i) => ({
  id: `TXN${String(i + 1).padStart(6, '0')}`,
  booking: `BK${String(i + 1).padStart(4, '0')}`,
  customer: ['Sarah J.', 'Mohammed A.', 'Priya S.', 'James W.'][i % 4],
  amount: `AED ${(5000 + i * 1200).toLocaleString()}`,
  commission: `AED ${(500 + i * 120).toLocaleString()}`,
  net: `AED ${(4500 + i * 1080).toLocaleString()}`,
  date: `${String((i % 28) + 1).padStart(2, '0')}/01/2025`,
  status: i % 5 === 0 ? 'Pending' : 'Paid',
}));

function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-100"
    >
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button
          type="button"
          onClick={nextPage}
          disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-lg hover:bg-[#1a5c45] transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? 'Loading...' : 'Load More ↓'}
        </button>
      )}
    </div>
  );
}

export default function VendorPaymentLogsPage() {
  const { items, loading, total, hasMore, nextPage } = usePaginated(VendorService.getPaymentLogs, {});
  const rows = items.length ? items : LOGS;

  return (
    <div className="min-w-0">
      <h1 className="font-baskerville text-2xl sm:text-3xl text-[#1a1a1a] mb-6">Payment Logs</h1>
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0_0_0_/_0.05)] overflow-hidden">
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['Transaction', 'Booking', 'Customer', 'Amount', 'Commission', 'Net', 'Date', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-3 sm:px-4 text-gray-500 font-medium text-xs uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-[#fafaf8]">
                  <td className="py-3 px-3 sm:px-4 font-mono text-xs text-gray-500 whitespace-nowrap">{l.id}</td>
                  <td className="py-3 px-3 sm:px-4 font-mono text-xs text-gray-500 whitespace-nowrap">{l.booking}</td>
                  <td className="py-3 px-3 sm:px-4 font-medium text-gray-800">{l.customer}</td>
                  <td className="py-3 px-3 sm:px-4 font-medium text-[#1a1a1a] whitespace-nowrap">{l.amount}</td>
                  <td className="py-3 px-3 sm:px-4 text-red-500 whitespace-nowrap">{l.commission}</td>
                  <td className="py-3 px-3 sm:px-4 text-[#174a37] font-medium whitespace-nowrap">{l.net}</td>
                  <td className="py-3 px-3 sm:px-4 text-gray-400 text-xs whitespace-nowrap">{l.date}</td>
                  <td className="py-3 px-3 sm:px-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        l.status === 'Paid' ? 'text-green-700 bg-green-100' : 'text-amber-700 bg-amber-100'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination items={items} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
