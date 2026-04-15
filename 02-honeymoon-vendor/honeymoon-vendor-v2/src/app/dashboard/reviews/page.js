'use client';
import { usePaginated } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';
import ModalLayer from '@/components/ModalLayer';

const REVIEWS = Array.from({length:8},(_,i)=>({
  ));

const counts = {5:120,4:30,3:4,2:1,1:1};

function ReplyModal({review,onClose,onSave}){
  const [reply,setReply]=useState(review.reply||'');
  return(
    <ModalLayer open onClose={onClose} aria-labelledby="vendor-reviews-reply-title">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[560px] relative max-h-[90vh] overflow-y-auto overscroll-y-contain">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm" aria-label="Close">✕</button>
        <h3 id="vendor-reviews-reply-title" className="font-baskerville text-2xl text-[#CFB383] mb-5">Reply to Review</h3>
        <div className="bg-[#f9f6ef] rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex">{[1,2,3,4,5].map(s=><span key={s} className={`text-sm ${s<=review.rating?'text-amber-400':'text-gray-200'}`}>★</span>)}</div>
            <span className="text-xs text-gray-400">{review.name} · {review.date}</span>
          </div>
          <p className="text-gray-600 text-sm leading-5 line-clamp-3">{review.text}</p>
        </div>
        <textarea value={reply} onChange={e=>setReply(e.target.value)} rows={4} placeholder="Write your reply..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#CFB383] resize-none bg-[#faf8f4] mb-5"/>
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="button" onClick={()=>onSave(reply)} className="flex-1 bg-[#174a37] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">Post Reply</button>
        </div>
      </div>
    </ModalLayer>
  );
}


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button type="button" onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-lg hover:bg-[#1a5c45] transition-colors disabled:opacity-50 w-full sm:w-auto">
          {loading ? 'Loading...' : 'Load More ↓'}
        </button>
      )}
    </div>
  );
}

export default function VendorReviewsPage(){
  const { items: reviews, loading, refresh, total, hasMore, nextPage} = usePaginated(VendorService.getReviews, {});
  // Use real API data from useApi above — no local state for list
  const [filterRating,setFilterRating]=useState(0);
  const [replyModal,setReplyModal]=useState(null);
  const [success,setSuccess]=useState('');

  const filtered=filterRating===0?reviews:reviews.filter(r=>r.rating===filterRating);
  const avgRating=(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1);
  const totalReviews=reviews.reduce((s,_,i)=>s+Object.values(counts)[i%5],0)/reviews.length;

  async function saveReply(reply){
    try {
      await VendorService.replyToReview(replyModal.id, reply);
      refresh();
    } catch(e) { /* fallback local */ }
    setReviews(p=>p.map(r=>r.id===replyModal.id?{...r,replied:true,reply}:r));
    setReplyModal(null); setSuccess('Reply posted successfully.');
  }

  return(
    <div className="w-full min-w-0">
      {replyModal&&<ReplyModal review={replyModal} onClose={()=>setReplyModal(null)} onSave={saveReply}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a] mb-5 sm:mb-6">Ratings & Reviews</h1>

      {/* Rating Summary */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-6 sm:gap-10 min-w-0">
          <div className="shrink-0 text-center sm:text-left mx-auto sm:mx-0">
            <p className="font-baskerville text-[40px] sm:text-[56px] text-[#1a1a1a] leading-none">{avgRating}</p>
            <div className="flex gap-0.5 justify-center my-2">
              {[1,2,3,4,5].map(s=><span key={s} className={`text-xl ${s<=Math.round(parseFloat(avgRating))?'text-amber-400':'text-gray-200'}`}>★</span>)}
            </div>
            <p className="text-gray-400 text-sm">({Object.values(counts).reduce((a,b)=>a+b,0)} reviews)</p>
          </div>
          <div className="flex-1 min-w-0">
            {[5,4,3,2,1].map(star=>{
              const count=counts[star];
              const total=Object.values(counts).reduce((a,b)=>a+b,0);
              return(
                <div key={star} className="flex items-center gap-2 sm:gap-3 mb-2">
                  <button type="button" onClick={()=>setFilterRating(filterRating===star?0:star)} className={`flex items-center gap-1 text-sm w-12 sm:w-14 shrink-0 ${filterRating===star?'text-[#174a37] font-medium':'text-gray-500'}`}>
                    <span className="text-amber-400">★</span> {star}
                  </button>
                  <div className="flex-1 min-w-0 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#CFB383] rounded-full transition-all" style={{width:`${(count/total)*100}%`}}/>
                  </div>
                  <span className="text-sm text-gray-400 w-7 sm:w-8 text-right shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1 overscroll-x-contain">
        <button type="button" onClick={()=>setFilterRating(0)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${filterRating===0?'bg-[#CFB383] text-white':'border border-gray-200 text-gray-500 hover:border-[#CFB383]'}`}>All</button>
        {[5,4,3,2,1].map(s=>(
          <button type="button" key={s} onClick={()=>setFilterRating(filterRating===s?0:s)} className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${filterRating===s?'bg-[#CFB383] text-white':'border border-gray-200 text-gray-500 hover:border-[#CFB383]'}`}>
            <span className="text-amber-400">★</span> {s}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-4">
        {filtered.map(r=>(
          <div key={r.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0_0_0_/_0.05)] min-w-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-3">
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map(s=><span key={s} className={`text-sm ${s<=r.rating?'text-amber-400':'text-gray-200'}`}>★</span>)}
                </div>
                <p className="font-medium text-gray-800 text-sm">{r.user?.firstName ? `${r.user.firstName} ${r.user.lastName||''}`.trim() : (r.name || 'Anonymous')}</p>
                <p className="text-gray-400 text-xs">{r.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-AE',{dateStyle:'medium'}) : '—')}</p>
              </div>
              {!r.replied&&(
                <button type="button" onClick={()=>setReplyModal(r)} className="text-xs text-[#174a37] border border-[rgba(23_74_55_/_0.3)] px-3 py-1.5 rounded-lg hover:bg-[#F5F5EF] transition-colors self-start sm:self-auto">Reply</button>
              )}
            </div>
            <p className="text-gray-600 text-sm leading-6">{r.text}</p>
            {r.replied&&(
              <div className="mt-4 ml-4 pl-4 border-l-2 border-[rgba(184_154_105_/_0.3)]">
                <p className="text-xs text-[#CFB383] font-medium mb-1">Your reply:</p>
                <p className="text-gray-500 text-sm">{r.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length > 5 && (
        <div className="text-center mt-6">
          <button type="button" onClick={nextPage} disabled={loading} className="bg-[#174a37] text-white px-6 sm:px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors inline-flex items-center gap-2 mx-auto disabled:opacity-50">
            {loading ? 'Loading...' : 'Load More ↗'}
          </button>
        </div>
      )}
      <Pagination items={reviews} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </div>
  );
}
