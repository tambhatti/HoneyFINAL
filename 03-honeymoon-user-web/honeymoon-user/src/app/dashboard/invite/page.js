'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';

const imgUnsplash1 = "https://ui-avatars.com/api/?name=User&background=174a37&color=CFB383&size=200";
const imgUnsplash2 = "https://ui-avatars.com/api/?name=Omar+H&background=CFB383&color=fff&size=200";

const roles = ['Viewer', 'Collaborator', 'Admin'];
const team = [
  { name: 'Rashed Kabir', email: 'rashed@gmail.com', role: 'Admin', img: null, initials: 'RK', you: true },
  { name: 'Fatima Al Rashidi', email: 'fatima@gmail.com', role: 'Admin', img: imgUnsplash1, you: false },
  { name: 'Sara Hassan', email: 'sara@gmail.com', role: 'Collaborator', img: imgUnsplash2, you: false },
];

export default function InvitePage() {
  const { data } = useApi(UserService.getLoyalty);
  const referralCode = data?.referralCode || '';
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Collaborator');
  const [sent, setSent] = useState(false);
  const [members, setMembers] = useState(team);
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  const invite = () => {
    if (!email) return;
    setMembers(p => [...p, { name: email.split('@')[0], email, role, img: null, initials: email[0].toUpperCase() }]);
    setEmail('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const copyLink = () => {
    const l = 'https://honeymoon.ae/invite/xyz123';
    setLink(l);
    navigator.clipboard?.writeText(l).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeRole = (idx) => setMembers(p => p.filter((_, i) => i !== idx));

  return (
    <div className="max-w-[800px] w-full min-w-0 pb-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-baskerville text-[26px] sm:text-[32px] md:text-[36px] text-[#1a1a1a]">Invite & Share</h1>
        <p className="text-black/40 text-sm mt-1">Collaborate with your wedding party, family, or coordinator</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Invite form */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-4 sm:p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] min-w-0">
            <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a] mb-4 sm:mb-5">Invite by Email</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch mb-4 min-w-0">
              <input value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && invite()}
                placeholder="name@example.com"
                className="flex-1 min-w-0 border border-[rgba(184_154_105_/_0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] transition-colors" />
              <select value={role} onChange={e => setRole(e.target.value)}
                className="border border-[rgba(184_154_105_/_0.3)] rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-[#CFB383] transition-colors w-full sm:w-auto sm:min-w-[140px]">
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <button type="button" onClick={invite}
              className={`w-full text-sm font-medium py-3 rounded-xl transition-colors ${
                email ? 'bg-[#174a37] text-white hover:bg-[#1a5c45]' : 'bg-[#F5F5EF] text-black/30 cursor-not-allowed'
              }`}>
              {sent ? '✓ Invitation Sent!' : 'Send Invitation'}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-4 sm:p-6 shadow-[0_0_30px_rgba(0_0_0_/_0.04)] min-w-0">
            <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a] mb-2">Share Link</h2>
            <p className="text-black/40 text-sm mb-4">Anyone with this link can join as a Viewer</p>
            <div className="flex flex-col sm:flex-row gap-3 min-w-0">
              <div className="flex-1 min-w-0 bg-[#f9f6ef] border border-[rgba(184_154_105_/_0.2)] rounded-xl px-4 py-2.5 text-sm text-black/40 truncate">
                {link || 'Generate a shareable link...'}
              </div>
              <button type="button" onClick={copyLink}
                className={`w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-xl transition-colors shrink-0 ${
                  copied ? 'bg-green-600 text-white' : 'bg-[#174a37] text-white hover:bg-[#1a5c45]'
                }`}>
                {copied ? '✓ Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        {/* Role descriptions */}
        <div className="lg:col-span-2">
          <div className="bg-[#F5F5EF] rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-5">
            <p className="text-xs font-medium text-[#174a37] uppercase tracking-wider mb-4">Role Permissions</p>
            {[
              { role: 'Viewer', desc: 'Can view vendors, bookings and budget. Cannot make changes.' },
              { role: 'Collaborator', desc: 'Can shortlist vendors, add notes, and suggest changes.' },
              { role: 'Admin', desc: 'Full access to all features including bookings and payments.' },
            ].map(r => (
              <div key={r.role} className="mb-4 last:mb-0">
                <p className="text-sm font-medium text-[#1a1a1a]">{r.role}</p>
                <p className="text-xs text-black/50 mt-0.5 leading-5">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team members */}
      <div className="bg-white rounded-2xl border border-[rgba(184_154_105_/_0.2)] shadow-[0_0_30px_rgba(0_0_0_/_0.04)] mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-[rgba(184_154_105_/_0.1)] min-w-0">
          <h2 className="font-baskerville text-lg sm:text-[22px] text-[#1a1a1a]">Wedding Team</h2>
          <span className="text-sm text-black/40">{members.length} member{members.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="divide-y divide-[rgba(184_154_105_/_0.08)]">
          {members.map((m, i) => (
            <div key={i} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 p-4 sm:p-5 hover:bg-[#faf7f0] transition-colors min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#174a37] flex items-center justify-center">
                {m.img
                  ? <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  : <span className="text-white text-sm font-medium">{m.initials || m.name[0]}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1a1a] flex items-center gap-2">
                  {m.name}
                  {m.you && <span className="text-[10px] text-[#CFB383] bg-[#F5F5EF] px-2 py-0.5 rounded-full">You</span>}
                </p>
                <p className="text-xs text-black/40 mt-0.5">{m.email}</p>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto sm:ml-auto">
                <span className="text-xs font-medium text-[#174a37] bg-[#F5F5EF] px-3 py-1 rounded-full">{m.role}</span>
                {!m.you && (
                  <button type="button" onClick={() => removeRole(i)} className="text-black/20 hover:text-red-400 transition-colors text-lg p-1" aria-label="Remove">×</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
