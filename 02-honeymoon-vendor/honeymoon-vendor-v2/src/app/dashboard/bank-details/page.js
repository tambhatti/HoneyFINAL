'use client';
import { useApi } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useState } from 'react';
import { ConfirmModal, SuccessModal } from '@/components/Modals';
import ModalLayer from '@/components/ModalLayer';

function BankModal({ bank, onClose, onSave }) {
  const [form, setForm] = useState(bank || { bankName:'', accountName:'', iban:'', swift:'', routingNumber:'' });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-bank-modal-title">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[520px] relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm" aria-label="Close">✕</button>
        <h3 id="vendor-bank-modal-title" className="font-baskerville text-2xl text-[#CFB383] mb-6">{bank?.id ? 'Edit' : 'Add'} Bank Account</h3>
        {[
          ['Bank Name','bankName','Enter Bank Name'],
          ['Account Name','accountName','Full name as on account'],
          ['IBAN','iban','AE07 0331 2345 6789'],
          ['SWIFT / BIC Code','swift','e.g. EBILAEAD'],
          ['Routing Number','routingNumber','e.g. 021000021'],
        ].map(([l,k,ph])=>(
          <div key={k} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
            <input value={form[k]||''} onChange={e=>f(k,e.target.value)} placeholder={ph}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#CFB383] bg-[#faf8f4]"/>
          </div>
        ))}
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={() => form.bankName && onSave(form)} className="flex-1 bg-[#CFB383] text-white py-3 rounded-full font-medium hover:bg-[#B8A06E] transition-colors">Save ↗</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </ModalLayer>
  );
}

export default function BankDetailsPage() {
  const { data, loading, refresh } = useApi(VendorService.getBankDetails);
  const [banks, setBanks] = useState([
    { id:1, bankName:'Emirates NBD', accountName:'Tom Albert Events LLC', iban:'AE07 0331 2345 6789 0123 456', swift:'EBILAEAD', routingNumber:'021000021' },
  ]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null); // {type:'edit'|'delete', bank}
  const [success, setSuccess] = useState('');

  async function saveBank(form) {
    try {
      if (modal?.id) {
        await VendorService.updateBankDetail(modal.id, form);
        setSuccess('Bank account updated successfully.');
      } else {
        await VendorService.addBankDetail(form);
        setSuccess('Bank account added.');
      }
      refresh();
    } catch(e) { alert(e?.message||'Failed to save bank details'); }
    setModal(null);
  }

  return (
    <div className="max-w-3xl">
      {/* Pop Up - 83: Edit confirm */}
      {confirm?.type === 'edit' && (
        <ConfirmModal
          message="Are you sure you want to update this bank account?"
          onYes={() => { setConfirm(null); setModal(confirm.bank); }}
          onNo={() => setConfirm(null)}
        />
      )}
      {/* Pop Up - 84: Delete confirm */}
      {confirm?.type === 'delete' && (
        <ConfirmModal
          message="Are you sure you want to delete this bank account?"
          onYes={async () => {
          try { await VendorService.deleteBankDetail(confirm.bank.id); setSuccess('Bank account deleted.'); refresh(); }
          catch(e) { alert(e?.message||'Failed to delete'); }
          setConfirm(null);
        }}
          onNo={() => setConfirm(null)}
        />
      )}
      {modal && <BankModal bank={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={saveBank} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">My Bank Detail</h1>
        <button onClick={() => setModal({})} className="bg-[#174a37] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">
          + Add Bank Account
        </button>
      </div>

      {banks.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-[0_0_20px_rgba(0_0_0_/_0.05)]">
          <div className="text-5xl mb-4 opacity-20">🏦</div>
          <p className="text-gray-400 mb-4">No bank accounts added yet.</p>
          <button onClick={() => setModal({})} className="text-[#CFB383] hover:underline text-sm font-medium">+ Add your first bank account</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {banks.map(b => (
            <div key={b.id} className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] border border-[rgba(184_154_105_/_0.15)]">
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 bg-[#F5F5EF] rounded-xl flex items-center justify-center text-xl">🏦</div>
                <div className="flex gap-2">
                  <button onClick={() => setConfirm({ type:'edit', bank:b })} className="border border-[rgba(184_154_105_/_0.3)] text-[#CFB383] text-sm px-4 py-2 rounded-lg hover:bg-[#F5F5EF] transition-colors">Edit</button>
                  <button onClick={() => setConfirm({ type:'delete', bank:b })} className="border border-red-200 text-red-500 bg-red-50 text-sm px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[['Bank Name',b.bankName],['Account Name',b.accountName],['IBAN',b.iban],['SWIFT / BIC',b.swift],['Routing Number',b.routingNumber]].map(([l,v])=>(
                  <div key={l} className={l==='IBAN'?'sm:col-span-2':''}>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{l}</p>
                    <p className="font-medium text-[#1a1a1a] font-mono text-sm">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
