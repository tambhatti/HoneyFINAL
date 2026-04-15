'use client';
import { usePaginated } from '../../../hooks/useApi';
import { AdminService } from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const StatusBadge = ({ s }) => (
  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{s || '—'}</span>
);

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { items: users, total, loading, refresh, hasMore, nextPage } = usePaginated(
    AdminService.getUsers, { search, status }
  );
  const [confirm, setConfirm] = useState(null);
  const [success, setSuccess] = useState('');

  async function doToggle() {
    const { user } = confirm;
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await AdminService.updateUserStatus(user.id, newStatus);
      setSuccess(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully.`);
      refresh();
    } catch (e) { alert(e?.message || 'Failed to update.'); }
    setConfirm(null);
  }

  return (
    <div className="w-full min-w-0">
      {confirm && <ConfirmModal message={`${confirm.action === 'deactivate' ? 'Deactivate' : 'Activate'} this user?`} onYes={doToggle} onNo={() => setConfirm(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">User Management</h1>
        <Link href="/dashboard/users/add"
          className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors self-start sm:self-auto shrink-0">
          + Add User
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-[#faf8f4] w-full sm:flex-1 sm:max-w-64">
            <span className="text-gray-400 shrink-0">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…"
              className="bg-transparent text-sm outline-none flex-1 min-w-0"/>
          </div>
          <div className="flex gap-2">
            {[['All',''],['Active','Active'],['Inactive','Inactive']].map(([l,v]) => (
              <button key={v} type="button" onClick={() => setStatus(v)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${status===v ? 'bg-[#174a37] text-white' : 'bg-[#F5F5EF] text-gray-600 hover:bg-[#e8dfc5]'}`}>{l}</button>
            ))}
          </div>
          <span className="text-sm text-gray-400 sm:ml-auto">{total} users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-[#faf8f4]">
                {['#','Name','Email','Phone','Joined','Status','Action'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length:8}).map((_,i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({length:7}).map((_,j) => <td key={j} className="py-4 px-4"><div className="h-3 bg-gray-100 rounded animate-pulse"/></td>)}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-gray-400">No users found</td></tr>
              ) : users.map((u, i) => (
                <tr key={u.id} className={`border-b border-gray-50 hover:bg-[#fafaf8] transition-colors ${i%2===0?'':'bg-[#fdfcf9]'}`}>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{i+1}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{u.firstName} {u.lastName}</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">{u.email}</td>
                  <td className="py-3.5 px-4 text-gray-500 text-xs">{u.phone||'—'}</td>
                  <td className="py-3.5 px-4 text-gray-400 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-AE') : '—'}</td>
                  <td className="py-3.5 px-4"><StatusBadge s={u.status}/></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/users/${u.id}`}
                        className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors">
                        View
                      </Link>
                      <button type="button" onClick={() => setConfirm({ user: u, action: u.status === 'Active' ? 'deactivate' : 'activate' })}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors border ${u.status === 'Active' ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100' : 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'}`}>
                        {u.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button onClick={nextPage} disabled={loading} className="text-sm text-[#174a37] font-medium hover:underline disabled:opacity-50">
              {loading ? 'Loading…' : 'Load more ↓'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
