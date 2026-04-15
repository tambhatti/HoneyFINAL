'use client';
import { usePaginated } from '../../../hooks/useApi';
import { VendorService } from '../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const StatusBadge = ({ s }) => (
  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s === 'active' || s === 'Active' ? 'text-green-700 bg-green-100' : s === 'pending' ? 'text-amber-700 bg-amber-100' : 'text-gray-500 bg-gray-100'}`}>{s}</span>
);

export default function VendorServicesPage() {
  const { items: services, loading, refresh, total, hasMore, nextPage } = usePaginated(VendorService.getServices, {});
  const [search,  setSearch]  = useState('');
  const [confirm, setConfirm] = useState(null);
  const [success, setSuccess] = useState('');

  async function handleDelete() {
    try { await VendorService.deleteService(confirm.id); setSuccess('Service deleted.'); refresh(); } catch (e) { alert(e?.message || 'Failed to delete.'); }
    setConfirm(null);
  }

  async function toggleStatus(svc) {
    try { await VendorService.toggleServiceStatus(svc.id); refresh(); } catch (e) { console.error(e); }
  }

  const shown = services.filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full min-w-0">
      {confirm && <ConfirmModal message={`Delete "${confirm.name}"? This cannot be undone.`} onYes={handleDelete} onNo={() => setConfirm(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">Service Management</h1>
        <Link href="/dashboard/services/add" className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors self-start sm:self-auto shrink-0">
          + Add Service
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-[#faf8f4] w-full sm:max-w-64">
            <span className="text-gray-400 shrink-0">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services…"
              className="bg-transparent text-sm outline-none flex-1 min-w-0"/>
          </div>
          <span className="text-sm text-gray-400 sm:ml-auto">{total} services</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-[#faf8f4]">
                {['#','Service Name','Category','Price','Bookings','Status','Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length:4}).map((_,i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({length:7}).map((_,j) => <td key={j} className="py-4 px-4"><div className="h-3 bg-gray-100 rounded animate-pulse"/></td>)}
                  </tr>
                ))
              ) : shown.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center">
                  <p className="text-gray-400 text-sm mb-3">No services yet</p>
                  <Link href="/dashboard/services/add" className="text-[#174a37] text-sm font-medium hover:underline">Add your first service →</Link>
                </td></tr>
              ) : shown.map((svc, i) => (
                <tr key={svc.id} className={`border-b border-gray-50 hover:bg-[#fafaf8] transition-colors ${i%2===0?'':'bg-[#fdfcf9]'}`}>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{i+1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {svc.images?.[0] && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <img src={svc.images[0]} alt="" className="w-full h-full object-cover"/>
                        </div>
                      )}
                      <span className="font-medium text-gray-800 truncate max-w-[160px]">{svc.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">{svc.category}</td>
                  <td className="py-3.5 px-4 font-medium tabular-nums">AED {Number(svc.basePrice || svc.price || 0).toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-gray-500 tabular-nums">{svc._count?.bookings ?? svc.bookings ?? 0}</td>
                  <td className="py-3.5 px-4"><StatusBadge s={svc.status || 'active'}/></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/dashboard/services/${svc.id}/edit`}
                        className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors whitespace-nowrap">
                        Edit
                      </Link>
                      <button type="button" onClick={() => toggleStatus(svc)}
                        className="text-xs text-[#CFB383] border border-[rgba(184,154,105,0.4)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors whitespace-nowrap">
                        {svc.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button type="button" onClick={() => setConfirm(svc)}
                        className="text-xs text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button onClick={nextPage} disabled={loading} className="text-sm text-[#174a37] font-medium hover:underline disabled:opacity-50">
              {loading ? 'Loading…' : 'Load more ↓'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
