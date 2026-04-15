'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VendorService from '../../../../lib/services/vendor.service';
import { SuccessModal } from '@/components/Modals';

const CATEGORIES = ['Venue', 'Photography', 'Beauty', 'Catering', 'Decoration', 'Music', 'Transport'];
const PRICE_TYPES = ['Per Guest', 'Per Hour', 'Per Item', 'Package', 'Fixed'];

export default function AddAddonPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title:'', category:'', priceType:'', price:'', description:'' });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const [success, setSuccess] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSave() {
    if (!form.title || !form.category || !form.priceType || !form.price) {
      setError('Please fill in all required fields.'); return;
    }
    setSaving(true); setError('');
    try {
      await VendorService.createAddon({ ...form, price: Number(form.price), status: 'Active' });
      setSuccess(true);
    } catch (e) { setError(e?.message || 'Failed to save add-on.'); }
    finally { setSaving(false); }
  }

  return (
    <div className="w-full min-w-0 max-w-2xl">
      {success && <SuccessModal message="Add-on created successfully." onOk={() => router.push('/dashboard/addons')} />}

      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => router.push('/dashboard/addons')}
          className="text-gray-400 hover:text-gray-600 text-lg shrink-0">←</button>
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">Add New Add-On</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Add-On Title<span className="text-red-500">*</span></label>
            <input value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g. Premium Floral Setup"
              className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1]"/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Category<span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => f('category', e.target.value)}
                className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1]">
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Price Type */}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Price Type<span className="text-red-500">*</span></label>
              <select value={form.priceType} onChange={e => f('priceType', e.target.value)}
                className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1]">
                <option value="">Select Price Type</option>
                {PRICE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Price (AED)<span className="text-red-500">*</span></label>
            <input type="number" value={form.price} onChange={e => f('price', e.target.value)} placeholder="e.g. 500" min="0"
              className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1]"/>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1">Description</label>
            <textarea value={form.description} onChange={e => f('description', e.target.value)} rows={4}
              placeholder="Describe this add-on..."
              className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1] resize-none"/>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" onClick={() => router.push('/dashboard/addons')}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors text-center">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? 'Saving…' : 'Add Add-On ↗'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
