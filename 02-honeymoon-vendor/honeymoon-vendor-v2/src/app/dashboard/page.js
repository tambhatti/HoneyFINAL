'use client';
import { useApi } from '../../hooks/useApi';
import { VendorService } from '../../lib/services/vendor.service';
import { useVendorAuth } from '../../context/auth';
import Link from 'next/link';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PLACEHOLDER_REVENUE  = MONTHS.map((m,i) => ({ month:m, value: Math.round(15000 + Math.sin(i*0.9)*8000 + i*1200) }));
const PLACEHOLDER_BOOKINGS = MONTHS.map((m,i) => ({ month:m, value: Math.round(3 + Math.sin(i*0.7)*2 + i*0.3) }));

const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[rgba(184,154,105,0.2)] rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-[#1a1a1a] mb-0.5">{label}</p>
      {payload.map(p => <p key={p.dataKey} style={{color:p.color}} className="tabular-nums">{Number(p.value).toLocaleString()}</p>)}
    </div>
  );
};

const StatusBadge = ({ s }) => {
  const m = { 'Upcoming':'text-blue-700 bg-blue-100','Confirmed':'text-blue-700 bg-blue-100','Pending':'text-amber-700 bg-amber-100','Completed':'text-green-700 bg-green-100' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${m[s]||'bg-gray-100 text-gray-500'}`}>{s}</span>;
};

export default function VendorDashboardPage() {
  const { vendor } = useVendorAuth();
  const { data, loading } = useApi(VendorService.getDashboard);
  const stats          = data?.stats        || {};
  const recentBookings = data?.recentBookings || [];
  const revenueChart   = data?.revenueChart  || PLACEHOLDER_REVENUE;
  const bookingChart   = data?.bookingChart  || PLACEHOLDER_BOOKINGS;

  const vendorName = vendor ? (vendor.companyName || `${vendor.firstName||''} ${vendor.lastName||''}`.trim()) : '';

  return (
    <div className="w-full min-w-0">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">
          {vendorName ? `Welcome back, ${vendorName}` : 'Dashboard'}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total Bookings',   value: stats.bookings     ?? '—', icon:'📋', sub:'All time' },
          { label:'Total Revenue',    value: stats.revenue      ? `AED ${Number(stats.revenue).toLocaleString()}` : '—', icon:'💰', sub:'Net of commission' },
          { label:'Average Rating',   value: stats.rating       ? `${stats.rating} ★` : '—', icon:'⭐', sub:`${stats.reviewCount||0} reviews` },
          { label:'Active Services',  value: stats.services     ?? '—', icon:'🛎', sub:'Published' },
        ].map(({ label, value, icon, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
            <div className="text-xl mb-2">{icon}</div>
            <p className="text-gray-400 text-xs uppercase tracking-wide truncate">{label}</p>
            <p className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] mt-0.5 tabular-nums">
              {loading ? <span className="block h-6 w-16 bg-gray-100 rounded animate-pulse" /> : value}
            </p>
            <p className="text-[#174a37] text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
          <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-4">Revenue (AED)</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loading ? PLACEHOLDER_REVENUE : revenueChart} margin={{top:5,right:5,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#174a37" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#174a37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:10,fill:'#9A9080'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#9A9080'}} axisLine={false} tickLine={false} width={50} tickFormatter={v=>v>=1000?`${v/1000}k`:v}/>
                <Tooltip content={<CustomTip/>}/>
                <Area type="monotone" dataKey="value" name="Revenue" stroke="#174a37" strokeWidth={2.5} fill="url(#revGrad)" dot={{r:3,fill:'#174a37',stroke:'#fff',strokeWidth:2}} activeDot={{r:5}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
          <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-4">Bookings</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loading ? PLACEHOLDER_BOOKINGS : bookingChart} margin={{top:5,right:5,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:10,fill:'#9A9080'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#9A9080'}} axisLine={false} tickLine={false} width={25}/>
                <Tooltip content={<CustomTip/>}/>
                <Bar dataKey="value" name="Bookings" fill="#CFB383" radius={[4,4,0,0]} maxBarSize={28}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <h3 className="font-baskerville text-lg text-[#1a1a1a]">Recent Bookings</h3>
          <Link href="/dashboard/bookings" className="text-sm text-[#CFB383] hover:underline">View All →</Link>
        </div>
        {loading ? (
          <div className="divide-y divide-gray-50">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 sm:p-5">
                <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"/><div className="h-3 bg-gray-100 rounded animate-pulse w-1/3"/></div>
              </div>
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No bookings yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentBookings.slice(0,5).map((b,i) => (
              <Link key={b.id||i} href={`/dashboard/bookings/${b.id}`} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 p-4 sm:p-5 hover:bg-[#fafaf8] transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#F5F5EF] flex items-center justify-center text-lg shrink-0">📋</div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{b.user?.firstName} {b.user?.lastName}</p>
                    <p className="text-gray-400 text-xs">{b.service?.name || b.type} · {b.eventDate ? new Date(b.eventDate).toLocaleDateString('en-AE') : '—'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                  <p className="font-medium text-sm tabular-nums">AED {Number(b.totalAmount||0).toLocaleString()}</p>
                  <StatusBadge s={b.status}/>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
