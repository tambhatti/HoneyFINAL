'use client';
import { useApi } from '../../../hooks/useApi';
import { AdminService } from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';
import ModalLayer from '@/components/ModalLayer';

function CatModal({ cat, onClose, onSave }) {
  const [form, setForm] = useState(cat ? {
    name: cat.name || '', nameAr: cat.nameAr || '', description: cat.description || '',
    commission: cat.commission || '', status: cat.status || 'Active', icon: cat.icon || ''
  } : { name:'', nameAr:'', description:'', commission:'', status:'Active', icon:'' });
  const [saving, setSaving] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <ModalLayer open onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <h3 className="font-baskerville text-2xl text-[#CFB383] mb-6">{cat?.id ? 'Edit' : 'Add'} Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {[['Category Name (EN)*','name','text'],['Category Name (AR)','nameAr','text']].map(([l,k,t]) => (
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input type={t} value={form[k]} onChange={e=>f(k,e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" dir={k==='nameAr'?'rtl':undefined}/></div>
          ))}
        </div>
        <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={e=>f('description',e.target.value)} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none"/></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
            <input type="number" value={form.commission} onChange={e=>f('commission',e.target.value)} min="0" max="100" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e=>f('status',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]">
              <option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
        </div>
        <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Icon / Image</label>
          <div className="border-2 border-dashed border-[rgba(184,154,105,0.3)] rounded-xl p-6 text-center cursor-pointer hover:border-[#CFB383] transition-colors">
            <p className="text-2xl mb-1 opacity-30">🖼</p><p className="text-gray-400 text-xs">Click to upload</p></div></div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium">Cancel</button>
          <button type="button" disabled={saving || !form.name} onClick={() => onSave(form, setSaving)}
            className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </ModalLayer>
  );
}

const StatusBadge = ({ s }) => (
  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{s}</span>
);

export default function CategoriesPage() {
  const { data, loading, refresh } = useApi(AdminService.getCategories);
  const categories = data?.categories || [];
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const filtered = categories.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase())
  );

  async function saveCategory(form, setSaving) {
    setSaving(true); setError('');
    try {
      if (modal?.id) {
        await AdminService.updateCategory(modal.id, form);
        setSuccess('Category updated successfully.');
      } else {
        await AdminService.createCategory(form);
        setSuccess('Category added successfully.');
      }
      refresh();
      setModal(null);
    } catch (e) {
      setError(e?.message || 'Failed to save category.');
    } finally { setSaving(false); }
  }

  async function deleteCategory() {
    try {
      await AdminService.deleteCategory(confirm.id);
      setSuccess('Category deleted.');
      refresh();
    } catch (e) { setError(e?.message || 'Failed to delete.'); }
    setConfirm(null);
  }

  async function toggleStatus(cat) {
    try {
      const newStatus = cat.status === 'Active' ? 'Inactive' : 'Active';
      await AdminService.updateCategory(cat.id, { status: newStatus });
      refresh();
    } catch { /* silent */ }
  }

  return (
    <div className="w-full min-w-0">
      {modal !== null && <CatModal cat={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={saveCategory} />}
      {confirm && <ConfirmModal message={`Delete "${confirm.name}" category?`} onYes={deleteCategory} onNo={() => setConfirm(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      {error   && <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 text-sm">{error}</div>}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">Category Management</h1>
        <button type="button" onClick={() => setModal({})}
          className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors self-start sm:self-auto shrink-0">
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-[#faf8f4] w-full sm:max-w-64">
            <span className="text-gray-400 shrink-0">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories…"
              className="bg-transparent text-sm outline-none flex-1 min-w-0" />
          </div>
          <p className="text-sm text-gray-400">{filtered.length} categories</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-[#faf8f4]">
                {['#','Name','Description','Commission','Vendors','Bookings','Status','Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="py-4 px-4"><div className="h-3 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-gray-400">No categories found</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} className={`border-b border-gray-50 hover:bg-[#fafaf8] transition-colors ${i % 2 === 0 ? '' : 'bg-[#fdfcf9]'}`}>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{i + 1}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{c.name}</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs max-w-[160px] truncate">{c.description || '—'}</td>
                  <td className="py-3.5 px-4 text-gray-600">{c.commission ? `${c.commission}%` : '—'}</td>
                  <td className="py-3.5 px-4 text-gray-600 tabular-nums">{c._count?.vendors ?? c.vendors ?? '—'}</td>
                  <td className="py-3.5 px-4 text-gray-600 tabular-nums">{c._count?.bookings ?? c.bookings ?? '—'}</td>
                  <td className="py-3.5 px-4"><StatusBadge s={c.status || 'Active'} /></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/categories/${c.id}`}
                        className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors whitespace-nowrap">
                        Edit
                      </Link>
                      <button type="button" onClick={() => toggleStatus(c)}
                        className="text-xs text-[#CFB383] border border-[rgba(184,154,105,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors whitespace-nowrap">
                        {c.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                      <button type="button" onClick={() => setConfirm(c)}
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
      </div>
    </div>
  );
}
