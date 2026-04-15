'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, SuccessModal, ConfirmModal } from '@/components/ui';

export default function EditCategoryPage({ params }) {
  const catId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getCategory, catId);
  const category = data?.category || {};
  const router = useRouter();
  const [form, setForm] = useState({ name: 'Venues', nameAr: 'أماكن', description: 'Wedding venue services across UAE', status: 'active', commission: '12' });
  const [success, setSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <div className="fade-in w-full min-w-0 max-w-xl sm:max-w-[580px] mx-auto px-1">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 min-w-0">
        <button type="button" onClick={() => router.back()} className="btn-secondary px-3 py-1.5 text-sm self-start">← Back</button>
        <h1 className="page-title m-0 min-w-0">Edit Category</h1>
      </div>
      <div className="card p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl border-2 border-dashed border-gray-200">🏛</div>
          <button className="btn-secondary text-sm">Change Icon</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Category Name (EN)" required>
            <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} className="input" />
          </Field>
          <Field label="Category Name (AR)">
            <input value={form.nameAr} onChange={e => setForm(p=>({...p,nameAr:e.target.value}))} className="input" dir="rtl" />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))}
            rows={3} className="input min-h-[5rem] resize-y" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Commission (%)">
            <input type="number" value={form.commission} onChange={e => setForm(p=>({...p,commission:e.target.value}))} className="input" min={0} max={100} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))} className="input">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-6">
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary w-full sm:w-auto disabled:opacity-60">Save Changes</button>
          <button type="button" onClick={() => setDeleteConfirm(true)} className="btn-secondary text-red-600 border-red-300 hover:bg-red-50 w-full sm:w-auto">Delete Category</button>
          <button type="button" onClick={() => router.back()} className="btn-secondary w-full sm:w-auto">Cancel</button>
        </div>
      </div>
      {success && <SuccessModal message="Category Updated Successfully." onClose={() => { setSuccess(false); router.push('/dashboard/categories'); }} />}
      {deleteConfirm && <ConfirmModal message="Are you sure you want to delete this category?" onConfirm={() => { setDeleteConfirm(false); router.push('/dashboard/categories'); }} onCancel={() => setDeleteConfirm(false)} />}
    </div>
  );
}
