'use client';
import { useUserAuth } from '../../../context/auth';
import { useState } from 'react';
import ModalLayer from '@/components/ModalLayer';

export default function SettingsPage() {
  const { logout, user } = useUserAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    aiRecommendations: true,
    budgetAlerts: true,
    marketingEmails: false,
    language: 'en',
    currency: 'AED',
    timezone: 'Asia/Dubai',
  });
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ k }) => (
    <button type="button" onClick={() => toggle(k)}
      className={`relative w-12 h-6 shrink-0 rounded-full transition-colors ${settings[k] ? 'bg-[#174a37]' : 'bg-[#d4d4d4]'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings[k] ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="w-full min-w-0 max-w-[800px] pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 min-w-0">
        <div className="min-w-0">
          <h1 className="font-baskerville text-[28px] sm:text-[34px] md:text-[36px] text-[#1a1a1a]">Settings</h1>
          <p className="text-black/40 text-sm mt-1">Manage your account preferences</p>
        </div>
        <button type="button" onClick={save}
          className={`text-sm font-medium px-5 py-2.5 rounded-[10px] transition-all shrink-0 self-start sm:self-auto w-full sm:w-auto ${saved ? 'bg-green-600 text-white' : 'bg-[#174a37] text-white hover:bg-[#1a5c45]'}`}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Notifications</h2>
          <div className="flex flex-col gap-5">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates about bookings, payments, and messages via email' },
              { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Get important alerts sent to your phone number' },
              { key: 'aiRecommendations', label: 'AI Recommendations', desc: 'Let the AI proactively suggest new vendor matches' },
              { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Get notified when spending approaches your budget limits' },
              { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive tips, wedding ideas, and promotional offers' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-medium text-[#1a1a1a]">{label}</p>
                  <p className="text-xs text-black/40 mt-0.5 max-w-[500px]">{desc}</p>
                </div>
                <Toggle k={key} />
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { key: 'language', label: 'Language', opts: [{ v: 'en', l: 'English' }, { v: 'ar', l: 'العربية' }] },
              { key: 'currency', label: 'Currency', opts: [{ v: 'AED', l: 'AED — UAE Dirham' }, { v: 'USD', l: 'USD — US Dollar' }] },
              { key: 'timezone', label: 'Timezone', opts: [{ v: 'Asia/Dubai', l: 'Gulf Standard Time (GST)' }, { v: 'UTC', l: 'UTC' }] },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">{label}</label>
                <select value={settings[key]} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full border border-[rgba(184_154_105_/_0.3)] rounded-xl px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#CFB383] bg-white transition-all">
                  {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)]">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Account</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-[#f9f6ef] rounded-xl min-w-0">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#1a1a1a]">Download My Data</p>
                <p className="text-xs text-black/40 mt-0.5">Export all your wedding planning data as a PDF report</p>
              </div>
              <button type="button" onClick={() => {
                const w = window.open('', '_blank');
                w.document.write(`<html><head><title>My Wedding Data Export</title><style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:20px;color:#1a1a1a}h1{color:#174a37;border-bottom:2px solid #CFB383;padding-bottom:12px}h2{color:#CFB383;margin-top:24px}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #eee;font-size:14px}th{color:#666;font-weight:normal}.footer{margin-top:40px;text-align:center;color:#999;font-size:12px}</style></head><body><h1>Honeymoon — Wedding Planning Data Export</h1><p>Exported on ${new Date().toLocaleDateString()}</p><h2>Profile</h2><table><tr><td>Name</td><td>${user?.firstName || ''} ${user?.lastName || ''}</td></tr><tr><td>Email</td><td>${user?.email || 'user@example.com'}</td></tr><tr><td>Phone</td><td>${user?.phone || '—'}</td></tr></table><h2>Settings</h2><table><tr><td>Language</td><td>${settings.language === 'en' ? 'English' : 'Arabic'}</td></tr><tr><td>Currency</td><td>${settings.currency}</td></tr><tr><td>Timezone</td><td>${settings.timezone}</td></tr></table><h2>Bookings Summary</h2><p>Your booking data will appear here when connected to the API.</p><h2>Budget Summary</h2><p>Your budget data will appear here when connected to the API.</p><h2>Vendor Shortlist</h2><p>Your saved vendors will appear here when connected to the API.</p><div class="footer"><p>Honeymoon Events Platform — Data Export Report</p></div></body></html>`);
                w.document.close();
                w.print();
              }} className="border border-[rgba(184_154_105_/_0.3)] text-[#CFB383] text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-[#F5F5EF] transition-colors self-start sm:self-auto shrink-0">
                Download ↓
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-red-50 rounded-xl border border-red-100 min-w-0">
              <div className="min-w-0">
                <p className="text-sm font-medium text-red-700">Delete Account</p>
                <p className="text-xs text-red-400 mt-0.5">Permanently delete your account and all associated data</p>
              </div>
              <button type="button" onClick={() => setConfirmDelete(true)} className="bg-red-100 text-red-600 text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-red-200 transition-colors self-start sm:self-auto shrink-0">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {confirmDelete && (
        <ModalLayer open onClose={() => setConfirmDelete(false)} closeOnBackdrop={false} aria-labelledby="settings-delete-title">
          <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 sm:p-8 shadow-2xl text-center max-h-[90vh] overflow-y-auto overscroll-y-contain min-w-0">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h3 id="settings-delete-title" className="font-baskerville text-xl text-[#1a1a1a] mb-2">Delete Your Account?</h3>
            <p className="text-black/40 text-sm mb-6">This action is permanent. All your wedding planning data, bookings, and preferences will be permanently deleted.</p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button type="button" onClick={() => setConfirmDelete(false)} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="button" onClick={() => { setConfirmDelete(false); logout(); }} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">Delete Account</button>
            </div>
          </div>
        </ModalLayer>
      )}
    </div>
  );
}
