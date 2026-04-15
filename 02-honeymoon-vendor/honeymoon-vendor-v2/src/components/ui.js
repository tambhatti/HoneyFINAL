'use client';
import { useState } from 'react';

/* ── Arrow Up-Right Icon ── */
export function ArrowIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Three-dot Action Menu ── */
export function ActionMenu({ items }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg width="5" height="21" viewBox="0 0 5 21" fill="none">
          <circle cx="2.5" cy="2.5" r="2.5" fill="#666"/>
          <circle cx="2.5" cy="10.5" r="2.5" fill="#666"/>
          <circle cx="2.5" cy="18.5" r="2.5" fill="#666"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}/>
          <div className="absolute right-0 top-8 bg-white border border-[rgba(184_154_105_/_0.2)] rounded-lg shadow-lg z-20 min-w-[140px] py-1 overflow-hidden">
            {items.map((item, i) => (
              <button key={i} onClick={() => { item.onClick(); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-[#F5F5EF] text-left transition-colors ${item.danger ? 'text-red-600' : 'text-[#1a1a1a]'}`}>
                {item.icon && <span className="text-base">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Table Controls (show + search) ── */
export function TableControls({ search, onSearch, onFilter, showFilter }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-black">Show</span>
        <div className="bg-[#f1ebe1] border border-[rgba(184_154_105_/_0.2)] rounded-md px-3 py-1.5 flex items-center gap-1 cursor-pointer">
          <span className="text-sm font-bold text-[#666]">5</span>
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1L4 4L7 1" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onFilter && (
          <button onClick={onFilter} className="bg-[#f1ebe1] border border-[rgba(184_154_105_/_0.2)] rounded-md p-2 hover:bg-[#e8e0d0] transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        )}
        <div className="relative">
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search..."
            className="bg-[#f1ebe1] border border-[rgba(184_154_105_/_0.2)] rounded-md pl-9 pr-4 py-2 text-sm text-[#1a1a1a] outline-none focus:border-[#CFB383] w-64 placeholder:text-[#999]"/>
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#999" strokeWidth="1.5"/>
            <path d="M10 10L13 13" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Pagination ── */
export function Pagination({ current, total, onChange }) {
  const pages = Math.ceil(total / 5) || 1;
  const nums = Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-black">Showing {((current - 1) * 5) + 1} to {Math.min(current * 5, total)} of {total} entries</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(Math.max(1, current - 1))} className="px-3 py-1.5 text-sm text-black hover:bg-gray-100 rounded transition-colors">Previous</button>
        {nums.map(n => (
          <button key={n} onClick={() => onChange(n)}
            className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${n === current ? 'bg-[#1A3828] text-white' : 'text-[#7e7e7e] hover:bg-gray-100'}`}>
            {n}
          </button>
        ))}
        <button onClick={() => onChange(Math.min(pages, current + 1))} className="px-3 py-1.5 text-sm text-black hover:bg-gray-100 rounded transition-colors">Next</button>
      </div>
    </div>
  );
}

/* ── Status Text ── */
export function StatusText({ status }) {
  const map = {
    active: 'text-green-600', completed: 'text-green-600', resolved: 'text-green-600',
    paid: 'text-green-600', approved: 'text-green-600',
    pending: 'text-amber-600', upcoming: 'text-amber-600', requested: 'text-amber-600',
    rejected: 'text-red-600', lost: 'text-red-600', cancelled: 'text-red-600',
    inactive: 'text-gray-500', expired: 'text-gray-500',
    contacted: 'text-blue-600',
    'meeting scheduled': 'text-purple-600', scheduled: 'text-purple-600',
    unpaid: 'text-gray-900',
    converted: 'text-green-600',
  };
  const cls = map[(status || '').toLowerCase()] || 'text-gray-600';
  return <span className={`font-medium capitalize text-sm ${cls}`}>{status}</span>;
}

/* ── Confirm Modal ── */
export function ConfirmModal({ title = 'Are you sure?', message, onConfirm, onCancel, danger = false }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box text-center" onClick={e => e.stopPropagation()}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-100' : 'bg-amber-100'}`}>
          <span className="text-3xl">{danger ? '🗑️' : '⚠️'}</span>
        </div>
        <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{title}</h3>
        {message && <p className="text-sm text-[#666] mb-6">{message}</p>}
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="btn-secondary min-w-[120px]">No</button>
          <button onClick={onConfirm} className={`min-w-[120px] inline-flex items-center justify-center gap-2 font-medium text-base px-6 py-3 rounded-full transition-opacity hover:opacity-90 whitespace-nowrap ${danger ? 'bg-red-600 text-white' : 'bg-[#1A3828] text-white'}`}>Yes</button>
        </div>
      </div>
    </div>
  );
}

/* ── Success Modal ── */
export function SuccessModal({ message = 'Action completed successfully!', onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box text-center" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#16A34A" opacity="0.15"/>
            <path d="M9 16L13.5 20.5L23 11" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Success!</h3>
        <p className="text-sm text-[#666] mb-6">{message}</p>
        <button onClick={onClose} className="btn-primary min-w-[120px] justify-center">Ok</button>
      </div>
    </div>
  );
}

/* ── Toggle Switch ── */
export function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className={`relative inline-flex h-[14.4px] w-[26.7px] items-center rounded-full transition-colors ${checked ? 'bg-[#1a1a1a]' : 'bg-gray-300'}`}>
      <span className={`inline-block h-[9.6px] w-[10.7px] transform rounded-full bg-white transition-transform ${checked ? 'translate-x-[13px]' : 'translate-x-[3px]'}`}/>
    </button>
  );
}
