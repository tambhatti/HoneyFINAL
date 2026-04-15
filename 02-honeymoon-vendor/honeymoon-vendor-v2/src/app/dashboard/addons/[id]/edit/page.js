'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '../../../../../hooks/useApi';
import VendorService from '../../../../../lib/services/vendor.service';
import { SuccessModal, ConfirmModal } from '@/components/Modals';

const CATEGORIES = ['Venue', 'Photography', 'Beauty', 'Catering', 'Decoration', 'Music', 'Transport'];
const PRICE_TYPES = ['Per Guest', 'Per Hour', 'Per Item', 'Package', 'Fixed'];

export default function EditAddonPage({ params }) {
  const id = params?.id;
  const router = useRouter();
  const { data, loading } = useApi(VendorService.getAddon, id);
  const addon = data?.addon || {};

  const [form, setForm] = useState({ title:'', category:'', priceType:'', price:'', description:'' });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (addon.id) setForm({
      title:       addon.title       || '',
      category:    addon.category    || '',
      priceType:   addon.priceType   || addon.pricing_type || '',
      price:       String(addon.price || ''),
      description: addon.description || '',
    });
  }, [addon.id]);

  async function handleSave() {
    if (!form.title || !form.category || !form.priceType || !form.price) {
      setError('Please fill in all required fields.'); return;
    }
    setSaving(true); setError('');
    try {
      await VendorService.updateAddon(id, { ...form, price: Number(form.price) });
      setSuccess(true);
    } catch (e) { setError(e?.message || 'Failed to update add-on.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await VendorService.deleteAddon(id); router.push('/dashboard/addons'); }
    catch (e) { alert(e?.message || 'Failed to delete.'); }
  }

  if (loading) return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-3 mb-6"><div className="h-8 w-48 bg-gray-100 rounded animate-pulse"/></div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)] space-y-4">
        {Array.from({length:4}).map((_,i)=><div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse"/>)}
      </div>
    </div>
  );

  return (
    <div className="w-full min-w-0 max-w-2xl">
      {success && <SuccessModal message="Add-on updated successfully." onOk={() => router.push('/dashboard/addons')} />}
      {confirm && <ConfirmModal message="Delete this add-on? This cannot be undone." onYes={handleDelete} onNo={() => setConfirm(false)} />}

      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push('/dashboard/addons')}
            className="text-gray-400 hover:text-gray-600 text-lg shrink-0">←</button>
          <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">Edit Add-On</h1>
        </div>
        <button type="button" onClick={() => setConfirm(true)}
          className="text-red-500 text-sm font-medium hover:underline shrink-0">Delete</button>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Add-On Title<span className="text-red-500">*</span></label>
            <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g. Premium Floral Setup"
              className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1]"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Category<span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => f('category', e.target.value)}
                className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1]">
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Price Type<span className="text-red-500">*</span></label>
              <select value={form.priceType} onChange={e => f('priceType', e.target.value)}
                className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1]">
                <option value="">Select Price Type</option>
                {PRICE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Price (AED)<span className="text-red-500">*</span></label>
            <input type="number" value={form.price} onChange={e => f('price', e.target.value)} placeholder="e.g. 500" min="0"
              className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1]"/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Description</label>
            <textarea value={form.description} onChange={e => f('description', e.target.value)} rows={4}
              placeholder="Describe this add-on..."
              className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1] resize-none"/>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" onClick={() => router.push('/dashboard/addons')}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors text-center">Cancel</button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? 'Saving…' : 'Update ↗'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
