'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';
export default function AdminSettingsPage() {
  const { data, loading, refresh } = useApi(AdminService.getSettings);
  const [settings, setSettings] = useState({
    emailNotifications: true, smsNotifications: false, bookingAlerts: true,
    newVendorAlerts: true, maintenanceMode: false, twoFactorAuth: true,
  });
  const [success, setSuccess] = useState('');
  const toggle = (k) => setSettings(p => ({...p, [k]: !p[k]}));
  const Toggle = ({k}) => (
    <button type="button" onClick={() => toggle(k)} className={`w-12 h-6 shrink-0 rounded-full transition-colors flex items-center px-0.5 ${settings[k]?'bg-[#174a37] justify-end':'bg-gray-200 justify-start'}`}>
      <div className="w-5 h-5 bg-white rounded-full shadow" />
    </button>
  );
  return (
    <div className="w-full min-w-0 max-w-2xl">
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-5 sm:mb-6">Settings</h1>
      {[
        { title: 'Notifications', items: [['Email Notifications','Receive booking updates via email','emailNotifications'],['SMS Notifications','Receive alerts via SMS','smsNotifications'],['New Booking Alerts','Alert when new booking is made','bookingAlerts'],['New Vendor Alerts','Alert when vendor registers','newVendorAlerts']] },
        { title: 'Security', items: [['Two-Factor Authentication','Add extra security layer','twoFactorAuth'],['Maintenance Mode','Put site in maintenance mode','maintenanceMode']] },
      ].map(section => (
        <div key={section.title} className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] mb-5">
          <h2 className="font-baskerville text-lg sm:text-xl text-[#1a1a1a] mb-4">{section.title}</h2>
          {section.items.map(([l,d,k]) => (
            <div key={k} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-3.5 border-b border-gray-50 last:border-0">
              <div className="min-w-0 pr-2"><p className="font-medium text-sm text-gray-800">{l}</p><p className="text-gray-400 text-xs mt-0.5">{d}</p></div>
              <Toggle k={k} />
            </div>
          ))}
        </div>
      ))}
      <button type="button" onClick={async () => {
        try { await AdminService.updateSettings(settings); setSuccess('Settings saved successfully.'); }
        catch(e) { alert(e?.message||'Failed to save settings'); }
      }} className="bg-[#CFB383] text-white px-8 py-3 rounded-full font-medium hover:bg-[#B8A06E] transition-colors w-full sm:w-auto">Save Settings</button>
    </div>
  );
}
