'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';
import ModalLayer from '@/components/ModalLayer';

const imgVenue1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgVenue2 = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgVenue3 = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

function EditBudgetModal({ budget, onClose, onSave }) {
  const [form, setForm] = useState({ name: budget.name, total: budget.total, location: budget.location });
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="edit-budget-title">
      <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-5 sm:p-8 shadow-2xl min-w-0">
        <h2 id="edit-budget-title" className="font-baskerville text-[22px] sm:text-[28px] text-[#CFB383] mb-4 sm:mb-6">Edit Budget</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Budget Name<span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-colors" />
          </div>
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Total Budget (AED)<span className="text-red-500">*</span></label>
            <input type="number" value={form.total} onChange={e => setForm(p => ({...p, total: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-colors" />
          </div>
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Location</label>
            <input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-colors" />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row-reverse gap-3 mt-6">
          <button type="button" onClick={async () => {
            if (!form.name || !form.total) return;
            try {
              const UserService = (await import('../../lib/services/user.service')).default;
              if (budget?.id) { await UserService.updateBudget(budget.id, form); }
              else { await UserService.createBudget({ ...form, totalAmount: Number(form.total) }); }
              onSave?.(form);
            } catch(e) { alert(e?.message||'Failed to save budget'); }
          }} className="flex-1 bg-[#174a37] text-white font-medium py-3 rounded-xl hover:bg-[#1a5c45] transition-colors">Save</button>
          <button type="button" onClick={onClose} className="flex-1 border border-[rgba(184_154_105_/_0.3)] text-black/50 font-medium py-3 rounded-xl hover:bg-[#F5F5EF] transition-colors">Cancel</button>
        </div>
      </div>
    </ModalLayer>
  );
}

const initBudgets = [
  { id: 1, name: 'Wedding Budget 2026', total: 200000, spent: 84000, location: 'Dubai', guests: 200, img: imgVenue1,
    items: [{cat:'Venue',budget:80000,spent:45000},{cat:'Photography',budget:15000,spent:8500},{cat:'Beauty',budget:8000,spent:3200},{cat:'Catering',budget:60000,spent:0},{cat:'Decoration',budget:25000,spent:0},{cat:'Music',budget:12000,spent:0}] },
  { id: 2, name: 'Engagement Party', total: 50000, spent: 12000, location: 'Abu Dhabi', guests: 80, img: imgVenue2,
    items: [{cat:'Venue',budget:20000,spent:10000},{cat:'Catering',budget:15000,spent:2000},{cat:'Decoration',budget:10000,spent:0},{cat:'Music',budget:5000,spent:0}] },
  { id: 3, name: 'Rehearsal Dinner', total: 15000, spent: 8000, location: 'Sharjah', guests: 30, img: imgVenue3,
    items: [{cat:'Venue',budget:6000,spent:6000},{cat:'Catering',budget:7000,spent:2000},{cat:'Decoration',budget:2000,spent:0}] },
];


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button type="button" onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-lg hover:bg-[#1a5c45] transition-colors disabled:opacity-50 w-full sm:w-auto">
          {loading ? 'Loading...' : 'Load More ↓'}
        </button>
      )}
    </div>
  );
}

export default function MyBudgetsPage() {
  const { items: apiBudgets, loading, refresh, total, hasMore, nextPage } = usePaginated(UserService.getBudgets, {});
  const [localBudgets, setLocalBudgets] = useState(initBudgets);
  const budgets = apiBudgets?.length ? apiBudgets : localBudgets;
  const [showDelete, setShowDelete] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try { await UserService.deleteBudget(deleteId); refresh(); } catch (e) {
      setLocalBudgets((p) => p.filter((b) => b.id !== deleteId));
    }
    setShowDelete(false);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen min-h-dvh bg-[#F5F5EF] font-sans flex flex-col w-full min-w-0">
      {showDelete && (
        <ModalLayer
          open
          onClose={() => { setShowDelete(false); setDeleteId(null); }}
          aria-label="Budget deleted"
        >
          <div className="bg-white rounded-2xl w-full max-w-[400px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-6 sm:p-8 text-center shadow-2xl min-w-0">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
            </div>
            <p className="text-[#1a1a1a] text-lg font-medium mb-6">Budget Deleted Successfully.</p>
            <button type="button" onClick={confirmDelete} className="bg-[#CFB383] text-white px-10 py-3 rounded-xl hover:bg-[#B8A06E] transition-colors font-medium w-full">
              Okay
            </button>
          </div>
        </ModalLayer>
      )}
      {editBudget && <EditBudgetModal budget={editBudget} onClose={() => setEditBudget(null)} onSave={() => setEditBudget(null)} />}

      <LoggedInNav />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 sm:py-10 w-full min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <h1 className="font-baskerville text-[28px] sm:text-[36px] md:text-[40px] text-[#CFB383]">My Budgets</h1>
          <Link href="/budget-estimation" className="bg-[#174a37] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors text-center sm:text-left w-full sm:w-auto">
            + New Budget
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          {budgets.map(b => {
            const pct = Math.round((b.spent / b.total) * 100);
            const isExpanded = expanded === b.id;
            return (
              <div key={b.id} className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0_0_0_/_0.06)] overflow-hidden">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center p-4 sm:p-5">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a1a] text-base line-clamp-2">{b.name}</p>
                      <p className="text-black/40 text-sm mt-0.5">📍 {b.location} · 👥 {b.guests} guests</p>
                      <div className="mt-2 h-1.5 bg-[#F5F5EF] rounded-full overflow-hidden w-full max-w-xs">
                        <div className="h-full bg-[#CFB383] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-black/40 mt-1">AED {b.spent.toLocaleString()} / {b.total.toLocaleString()} ({pct}% used)</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0 sm:ml-auto">
                    <button type="button" onClick={() => setExpanded(isExpanded ? null : b.id)}
                      className="text-sm text-[#CFB383] border border-[rgba(184_154_105_/_0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors">
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>
                    <button type="button" onClick={() => setEditBudget(b)}
                      className="text-sm text-white bg-[#174a37] px-3 py-1.5 rounded-lg hover:bg-[#1a5c45] transition-colors">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(b.id)}
                      className="text-sm text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[rgba(184_154_105_/_0.1)]">
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {b.items.map((item) => {
                        const ip = Math.round((item.spent / item.budget) * 100);
                        return (
                          <div key={item.cat} className="bg-[#f9f6ef] rounded-xl p-3">
                            <div className="flex justify-between mb-1.5">
                              <span className="text-sm font-medium text-[#1a1a1a]">{item.cat}</span>
                              <span className="text-xs text-black/40">{ip}%</span>
                            </div>
                            <div className="h-1.5 bg-[#e8e0d0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#CFB383] rounded-full" style={{ width: `${ip}%` }} />
                            </div>
                            <p className="text-xs text-black/40 mt-1">AED {item.spent.toLocaleString()} / {item.budget.toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Pagination items={budgets} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
