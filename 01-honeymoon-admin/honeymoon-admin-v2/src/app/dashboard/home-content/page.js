'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { SuccessModal, ConfirmModal } from '@/components/Modals';
import ModalLayer from '@/components/ModalLayer';

const IMG1 = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";

function EditSectionModal({ section, onClose, onSave }) {
  const [form, setForm] = useState({ title: section.title, subtitle: section.subtitle, btnText: section.btnText || '' });
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="admin-home-section-title">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[520px] relative max-h-[90vh] overflow-y-auto overscroll-y-contain">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <h3 id="admin-home-section-title" className="font-baskerville text-2xl text-[#CFB383] mb-6">Edit — {section.name}</h3>
        <div className="flex flex-col gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea value={form.subtitle} onChange={e=>setForm(p=>({...p,subtitle:e.target.value}))} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4] resize-none" /></div>
          {form.btnText !== undefined && <div><label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input value={form.btnText} onChange={e=>setForm(p=>({...p,btnText:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]" /></div>}
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            <div className="border-2 border-dashed border-[rgba(184_154_105_/_0.3)] rounded-xl p-6 text-center cursor-pointer hover:border-[#CFB383] transition-colors">
              <div className="text-2xl mb-1 opacity-30">🖼</div><p className="text-gray-400 text-xs">Click to upload image</p></div></div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="button" onClick={() => onSave(form)} className="flex-1 bg-[#CFB383] text-white py-3 rounded-full font-medium hover:bg-[#B8A06E] transition-colors">Save</button>
        </div>
      </div>
    </ModalLayer>
  );
}

const SECTIONS = [
  { id:1, name:'Hero Section', title:'Your Perfect Wedding Starts Here', subtitle:'Discover the finest venues, photographers, and vendors for your dream wedding day.', btnText:'Get Started', img:IMG1 },
  { id:2, name:'How It Works', title:'Plan Your Wedding in 3 Simple Steps', subtitle:'Find vendors, compare packages, and book with confidence.', img:IMG1 },
  { id:3, name:'Features Section', title:'Why Choose HoneyMoon?', subtitle:'Everything you need to plan the perfect wedding, all in one place.', img:IMG1 },
  { id:4, name:'Testimonials', title:'What Couples Say About Us', subtitle:'Join thousands of happy couples who planned their wedding with HoneyMoon.', img:IMG1 },
  { id:5, name:'App Download', title:'Plan On The Go', subtitle:'Download our app and manage your wedding planning from anywhere.', btnText:'Download Now', img:IMG1 },
];

export default function HomeContentPage() {
  const { data, loading, refresh } = useApi(AdminService.getHomeContent);
  const content = data?.content || [];
  // Use real API data — content comes from useApi(AdminService.getHomeContent)
  const [editing, setEditing] = useState(null);
  const [success, setSuccess] = useState('');

  async function saveSection(form) {
    try {
      await AdminService.updateHomeContent(editing.id, form);
      setSuccess('Section updated successfully.');
      refresh();
    } catch(e) { alert(e?.message||'Failed to update'); }
    setEditing(null);
  }

  return (
    <div className="w-full min-w-0">
      {editing && <EditSectionModal section={editing} onClose={() => setEditing(null)} onSave={saveSection} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-5 sm:mb-6">Home Content Management</h1>
      <div className="flex flex-col gap-4">
        {(content.length ? content : SECTIONS).map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
            <div className="w-full sm:w-24 h-40 sm:h-16 rounded-xl overflow-hidden shrink-0">
              <img src={s.img} alt="" className="w-full h-full object-cover" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[#CFB383] text-xs uppercase tracking-wider font-medium">{s.name}</p>
              <h3 className="font-medium text-[#1a1a1a] mt-0.5 line-clamp-2 sm:truncate">{s.title}</h3>
              <p className="text-gray-400 text-sm mt-0.5 line-clamp-2 sm:truncate">{s.subtitle}</p>
            </div>
            <button type="button" onClick={() => setEditing(s)} className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors shrink-0 w-full sm:w-auto text-center">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
