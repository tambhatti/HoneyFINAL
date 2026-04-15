'use client';
import { useState } from 'react';

// ── Reusable Table Controls ───────────────────────────────────────────────────
export function TableControls({ search, setSearch, onSearch, placeholder = 'Search...', rightContent }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <div className="flex items-center gap-2 bg-[#F0ECE0] rounded-lg px-3.5 py-2 w-full sm:w-auto sm:min-w-[260px]">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9A9080" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch?.()}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>
      {rightContent}
    </div>
  );
}

// ── Show per page + pagination ─────────────────────────────────────────────────
export function TablePagination({ page, setPage, total, perPage, setPerPage }) {
  const totalPages = Math.ceil(total / perPage);
  const pages = [];
  for (let i = 1; i <= Math.min(totalPages, 7); i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
      <div className="flex items-center gap-2 text-sm text-[#6B6050]">
        Show
        <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
          className="w-[60px] px-2 py-1 text-sm border border-[#e5e0d4] rounded">
          {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        entries
      </div>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <PageBtn label="← Prev" disabled={page <= 1} onClick={() => setPage(p => p - 1)} />
        {pages.map(p => (
          <PageBtn key={p} label={p} active={p === page} onClick={() => setPage(p)} />
        ))}
        <PageBtn label="Next →" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} />
      </div>
    </div>
  );
}

function PageBtn({ label, active, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`min-w-[32px] h-8 rounded-full border-none text-sm px-1 transition-all
        ${active ? 'bg-[#1A3828] text-white font-semibold' : ''}
        ${disabled ? 'text-[#C0B8A8] cursor-default' : active ? '' : 'text-[#1A1A1A] cursor-pointer hover:bg-[#F5F5EF]'}
      `}
    >{label}</button>
  );
}

// ── Three-dot menu ─────────────────────────────────────────────────────────────
export function ActionMenu({ actions }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="bg-transparent border-none cursor-pointer text-xl text-[#6B6050] px-2 py-1 rounded-md hover:bg-[#F5F5EF] transition-colors">⋮</button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-10" />
          <div className="absolute right-0 top-full bg-white rounded-xl shadow-xl min-w-[130px] z-20 overflow-hidden border border-[rgba(184_154_105_/_0.15)]">
            {actions.map(({ label, onClick, danger }) => (
              <button key={label} onClick={() => { onClick(); setOpen(false); }}
                className={`block w-full text-left px-4 py-2.5 text-sm border-b border-[#F0EBE0] last:border-0 bg-transparent cursor-pointer hover:bg-[#FDFAF4] transition-colors
                  ${danger ? 'text-red-600' : 'text-[#1A1A1A]'}`}>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
export function StatusText({ status }) {
  const map = {
    active: { color: '#16A34A', label: 'Active' },
    inactive: { color: '#9A9080', label: 'Inactive' },
    pending: { color: '#D97706', label: 'Pending' },
    completed: { color: '#16A34A', label: 'Completed' },
    rejected: { color: '#DC2626', label: 'Rejected' },
    upcoming: { color: '#D97706', label: 'Upcoming' },
    resolved: { color: '#16A34A', label: 'Resolved' },
    contacted: { color: '#2563EB', label: 'Contacted' },
    meeting_scheduled: { color: '#7C3AED', label: 'Meeting Scheduled' },
    lost: { color: '#DC2626', label: 'Lost' },
    converted: { color: '#16A34A', label: 'Converted' },
    paid: { color: '#16A34A', label: 'Paid' },
    unpaid: { color: '#1A1A1A', label: 'Unpaid' },
    expired: { color: '#DC2626', label: 'Expired' },
    received: { color: '#16A34A', label: 'Received' },
    returned: { color: '#DC2626', label: 'Returned' },
    requested: { color: '#D97706', label: 'Requested' },
    approved: { color: '#16A34A', label: 'Approved' },
  };
  const cfg = map[status?.toLowerCase?.()] || { color: '#6B6050', label: status || '—' };
  return <span style={{ color: cfg.color, fontWeight: 600, fontSize: 13 }}>{cfg.label}</span>;
}
