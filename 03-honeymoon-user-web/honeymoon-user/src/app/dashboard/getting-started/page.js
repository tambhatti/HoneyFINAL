'use client';
import { useUserAuth } from '../../../context/auth';
import Link from 'next/link';

const steps = [
  { num: 1, title: 'Complete your profile', desc: 'Add your wedding date, location, and budget so AI can find your perfect vendors.', href: '/dashboard/profile', cta: 'Update Profile', done: true },
  { num: 2, title: 'Run your AI planner', desc: 'Let AI analyze 500+ vendors and shortlist the best matches for your requirements.', href: '/dashboard/ai-planner', cta: 'Start AI Planning', done: false },
  { num: 3, title: 'Browse & shortlist vendors', desc: 'Explore curated vendor recommendations and save your favourites.', href: '/dashboard/vendors', cta: 'Browse Vendors', done: false },
  { num: 4, title: 'Request your first booking', desc: 'Send a booking request to your top vendor choice to lock in your date.', href: '/dashboard/vendors', cta: 'Find a Vendor', done: false },
  { num: 5, title: 'Set up your budget', desc: 'Track and manage your wedding spend across all vendor categories.', href: '/dashboard/budget', cta: 'Set Budget', done: false },
  { num: 6, title: 'Invite your team', desc: 'Share access with your partner, family, or wedding coordinator.', href: '/dashboard/invite', cta: 'Invite People', done: false },
];

export default function GettingStartedPage() {
  const { user } = useUserAuth();
  const completed = steps.filter(s => s.done).length;

  return (
    <div className="max-w-[800px] w-full min-w-0 pb-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-baskerville text-[26px] sm:text-[32px] md:text-[36px] text-[#1a1a1a]">Getting Started</h1>
        <p className="text-black/40 text-sm mt-1">Complete these steps to get the most out of HoneyMoon</p>
      </div>

      {/* Progress */}
      <div className="bg-[#174a37] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
          <p className="text-white font-medium">Setup Progress</p>
          <p className="text-[#CFB383] text-sm">{completed}/{steps.length} complete</p>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#CFB383] rounded-full transition-all" style={{ width: `${(completed / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((s, i) => (
          <div key={s.num} className={`bg-white rounded-2xl border overflow-hidden transition-all ${
            s.done ? 'border-[rgba(23_74_55_/_0.2)] opacity-70' : 'border-[rgba(184_154_105_/_0.2)] shadow-[0_0_20px_rgba(0_0_0_/_0.04)]'
          }`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5 p-4 sm:p-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                s.done ? 'bg-[#174a37] text-white' : 'bg-[#F5F5EF] text-[#CFB383]'
              }`}>
                {s.done ? '✓' : s.num}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${s.done ? 'text-[#174a37] line-through' : 'text-[#1a1a1a]'}`}>{s.title}</p>
                <p className="text-black/50 text-sm mt-0.5 leading-5">{s.desc}</p>
              </div>
              {!s.done && (
                <Link href={s.href}
                  className="w-full sm:w-auto text-center shrink-0 bg-[#174a37] text-white text-xs font-medium px-4 py-2.5 rounded-[8px] hover:bg-[#1a5c45] transition-colors whitespace-nowrap">
                  {s.cta} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#F5F5EF] rounded-2xl border border-[rgba(184_154_105_/_0.2)] p-4 sm:p-6 text-center min-w-0">
        <p className="font-baskerville text-[22px] text-[#174a37] mb-2">Need help getting started?</p>
        <p className="text-black/50 text-sm mb-4">Our support team is available Sun–Thu, 9am–6pm GST</p>
        <Link href="/dashboard/chat" className="inline-flex justify-center w-full sm:w-auto bg-[#174a37] text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-[#1a5c45] transition-colors">
          Chat with Support
        </Link>
      </div>
    </div>
  );
}
