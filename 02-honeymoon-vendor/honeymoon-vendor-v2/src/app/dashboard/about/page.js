'use client';
import { useEffect, useState } from 'react';
import { useVendorAuth } from '../../../context/auth';
import VendorService from '../../../lib/services/vendor.service';
import { SuccessModal } from '@/components/Modals';

export default function VendorAboutPage() {
  const { vendor, updateVendor } = useVendorAuth();
  const [editing,  setEditing]  = useState(false);
  const [form,     setForm]     = useState({ about:'', phone:'', location:'', address:'' });
  const [saved,    setSaved]    = useState({ about:'', phone:'', location:'', address:'' });
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState('');
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (vendor) {
      const vals = { about: vendor.about||'', phone: vendor.phone||'', location: vendor.location||'', address: vendor.address||'' };
      setForm(vals); setSaved(vals);
    }
  }, [vendor]);

  const handleEdit  = () => { setForm({ ...saved }); setEditing(true); };
  const handleCancel = () => { setForm({ ...saved }); setEditing(false); setError(''); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const res = await VendorService.updateProfile(form);
      if (updateVendor) updateVendor(res.vendor);
      setSaved({ ...form });
      setSuccess(true);
      setEditing(false);
    } catch (e) { setError(e?.message || 'Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const display = editing ? form : saved;

  return (
    <div className="max-w-3xl w-full min-w-0">
      {success && <SuccessModal message="About Us updated successfully." onOk={() => setSuccess(false)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">About Us</h1>
        {!editing && (
          <button type="button" onClick={handleEdit}
            className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors">
            Edit ↗
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        {editing ? (
          /* Edit mode */
          <div className="flex flex-col gap-4">
            {[
              ['Phone',    'phone',    'tel',  '+971 4 ...'],
              ['Location', 'location', 'text', 'City, Country'],
              ['Address',  'address',  'text', 'Full address'],
            ].map(([l, k, t, ph]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                <input type={t} value={form[k]} onChange={e => f(k, e.target.value)} placeholder={ph}
                  className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1]" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
              <textarea value={form.about} onChange={e => f('about', e.target.value)} rows={6}
                placeholder="Tell customers about your company, experience, and what makes you special..."
                className="w-full border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#f1ebe1] resize-none" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button type="button" onClick={handleCancel}
                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors text-center">
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? 'Saving…' : 'Save Changes ↗'}
              </button>
            </div>
          </div>
        ) : (
          /* Display mode */
          <div className="flex flex-col gap-5">
            {saved.about ? (
              <div>
                <p className="text-[#1a1a1a] text-sm font-semibold mb-1">About</p>
                <p className="text-gray-600 text-sm leading-relaxed">{saved.about}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No description added yet.</p>
            )}
            <div className="border-t border-gray-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                ['📞 Phone',    saved.phone],
                ['📍 Location', saved.location],
                ['🏠 Address',  saved.address],
              ].filter(([,v]) => v).map(([l, v]) => (
                <div key={l}>
                  <p className="text-[#1a1a1a] text-sm font-semibold mb-0.5">{l}</p>
                  <p className="text-gray-600 text-sm">{v}</p>
                </div>
              ))}
            </div>
            {!saved.phone && !saved.location && !saved.about && (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🏢</p>
                <p className="text-gray-500 text-sm mb-4">Your About Us page is empty. Add info that customers will see on your profile.</p>
                <button type="button" onClick={handleEdit}
                  className="bg-[#174a37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">
                  Get Started ↗
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
