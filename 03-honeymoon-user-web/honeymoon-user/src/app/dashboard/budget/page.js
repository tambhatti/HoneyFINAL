'use client';
import { usePaginated } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import ModalLayer from '@/components/ModalLayer';

const categories = [
  { cat: 'Venue', budgeted: 80000, spent: 45000, color: '#174a37', items: ['Al Habtoor Palace deposit'] },
  { cat: 'Photography', budgeted: 15000, spent: 8500, color: '#CFB383', items: ['Studio Lumière deposit'] },
  { cat: 'Beauty', budgeted: 8000, spent: 3200, color: '#4a7a5c', items: ['Glamour Touch booking'] },
  { cat: 'Catering', budgeted: 60000, spent: 0, color: '#8a6b3c', items: [] },
  { cat: 'Decoration', budgeted: 25000, spent: 0, color: '#2d6b50', items: [] },
  { cat: 'Music & Entertainment', budgeted: 12000, spent: 0, color: '#c9a66b', items: [] },
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

export default function BudgetPage() {
  const { items: budgets, loading, refresh, total, hasMore, nextPage} = usePaginated(UserService.getBudgets, {});
  const [view, setView] = useState('overview');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ category: '', description: '', amount: '' });
  const totalBudget = categories.reduce((s, c) => s + c.budgeted, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const remaining = totalBudget - totalSpent;
  const pct = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="w-full max-w-[1100px] min-w-0 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="font-baskerville text-[28px] sm:text-[32px] md:text-[36px] text-[#1a1a1a]">Budget Estimation</h1>
          <p className="text-black/40 text-sm mt-1">Track and manage your wedding budget</p>
        </div>
        <button type="button" onClick={() => setShowAddExpense(true)} className="bg-[#174a37] text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-[#1a5c45] transition-colors w-full sm:w-auto text-center">
          + Add Expense
        </button>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <ModalLayer open onClose={() => setShowAddExpense(false)} aria-labelledby="budget-add-expense-title">
          <div className="bg-white rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto overscroll-y-contain p-5 sm:p-8 shadow-2xl min-w-0">
            <div className="flex items-start justify-between gap-3 mb-5 min-w-0">
              <h3 id="budget-add-expense-title" className="font-baskerville text-xl sm:text-2xl text-[#CFB383] pr-2">Add Expense</h3>
              <button type="button" onClick={() => setShowAddExpense(false)} className="text-black/30 hover:text-black/60 text-xl shrink-0" aria-label="Close">✕</button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category<span className="text-red-500">*</span></label>
                <select value={expenseForm.category} onChange={e => setExpenseForm(p=>({...p, category: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.cat} value={c.cat}>{c.cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={expenseForm.description} onChange={e => setExpenseForm(p=>({...p, description: e.target.value}))}
                  placeholder="e.g. Venue deposit payment" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (AED)<span className="text-red-500">*</span></label>
                <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm(p=>({...p, amount: e.target.value}))}
                  placeholder="e.g. 5000" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row-reverse gap-3 mt-6">
              <button type="button" onClick={() => { setShowAddExpense(false); setExpenseForm({ category:'', description:'', amount:'' }); }}
                className="flex-1 bg-[#CFB383] text-white py-3 rounded-full font-medium hover:bg-[#B8A06E] transition-colors">Save Expense</button>
              <button type="button" onClick={() => setShowAddExpense(false)}
                className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </ModalLayer>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Budget', value: `AED ${totalBudget.toLocaleString()}`, sub: 'Set by you', color: '#174a37' },
          { label: 'Amount Spent', value: `AED ${totalSpent.toLocaleString()}`, sub: `${pct}% of total`, color: '#CFB383' },
          { label: 'Remaining', value: `AED ${remaining.toLocaleString()}`, sub: `${100 - pct}% left`, color: remaining > 0 ? '#174a37' : '#c0392b' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
            <p className="text-black/40 text-xs uppercase tracking-wider">{label}</p>
            <p className="font-baskerville text-[24px] sm:text-[28px] md:text-[30px] mt-1 break-words tabular-nums" style={{ color }}>{value}</p>
            <p className="text-black/40 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 mb-8 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#1a1a1a]">Overall Spending</span>
          <span className="text-sm text-[#CFB383] font-medium">{pct}%</span>
        </div>
        <div className="h-3 bg-[#F5F5EF] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#174a37] to-[#CFB383] rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-black/40">AED {totalSpent.toLocaleString()} spent</span>
          <span className="text-xs text-black/40">AED {totalBudget.toLocaleString()} total</span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-[rgba(184_154_105_/_0.1)]">
          <h2 className="font-baskerville text-[20px] sm:text-[22px] text-[#1a1a1a]">Category Breakdown</h2>
          <div className="flex gap-2 flex-wrap">
            {['overview', 'detailed'].map(v => (
              <button type="button" key={v} onClick={() => setView(v)}
                className={`text-xs font-medium px-4 py-2 rounded-[8px] transition-colors capitalize ${
                  view === v ? 'bg-[#174a37] text-white' : 'bg-[#F5F5EF] text-black/50 hover:text-black/70'
                }`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-5">
            {categories.map(({ cat, budgeted, spent, color }) => {
              const p = Math.round((spent / budgeted) * 100);
              return (
                <div key={cat}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-[#1a1a1a]">{cat}</span>
                      {spent === 0 && <span className="text-xs text-black/30 bg-[#F5F5EF] px-2 py-0.5 rounded-full">Not started</span>}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:shrink-0">
                      <span className="text-xs text-black/40 tabular-nums">AED {spent.toLocaleString()} / {budgeted.toLocaleString()}</span>
                      <span className="text-xs font-medium text-[#1a1a1a] w-8 text-right tabular-nums">{p}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#F5F5EF] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Pagination items={budgets} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
