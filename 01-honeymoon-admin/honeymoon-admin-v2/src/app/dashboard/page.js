'use client';
import { useApi } from '../../hooks/useApi';
import { AdminService } from '../../lib/services/admin.service';
import { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar
} from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* Placeholder data shown while API loads */
const MONTHS_PLACEHOLDER = MONTHS.map((m, i) => ({
  month: m,
  earning: 8000 + i * 1200 + Math.sin(i) * 2000,
  users:   30  + i * 4   + Math.sin(i * 1.3) * 8,
  vendors: 8   + i * 0.8 + Math.sin(i * 0.9) * 3,
  bookings:18  + i * 2.5 + Math.sin(i * 1.1) * 5,
}));
const CATS = ['Venue','Photography','Beauty','Catering','Decoration','Music','Transport'];
const REGIONS = ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'];
const PLACEHOLDER_CAT = CATS.map((category, i) => ({ category, catValue: 35000 + i * 8000 + Math.sin(i) * 5000 }));
const PLACEHOLDER_REG = REGIONS.map((region, i) => ({ region, regValue: 42000 + i * 6000 + Math.sin(i * 0.8) * 4000 }));

const CHART_CONFIGS = [
  { key:'earning',  label:'Total Earning (AED)',           color:'#174a37', type:'area', xKey:'month' },
  { key:'users',    label:'New Users Registered',          color:'#CFB383', type:'bar',  xKey:'month' },
  { key:'vendors',  label:'New Vendors Registered',        color:'#174a37', type:'area', xKey:'month' },
  { key:'bookings', label:'New Bookings Received',         color:'#CFB383', type:'bar',  xKey:'month' },
  { key:'catValue', label:'Top Performing Category',       color:'#174a37', type:'bar',  xKey:'category' },
  { key:'regValue', label:'Top Performing Region',         color:'#CFB383', type:'bar',  xKey:'region' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-[#1a1a1a] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="tabular-nums">
          {String(p.value).includes('.') ? Number(p.value).toFixed(0) : p.value}
        </p>
      ))}
    </div>
  );
};

function ChartCard({ label, dataKey, color, type, data, xKey = 'month' }) {
  const [period, setPeriod] = useState('Monthly');
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-5 last:mb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <h3 className="text-base font-bold text-[#1a1a1a]">{label}</h3>
        <div className="relative self-start sm:self-auto">
          <button type="button" onClick={() => setOpen(v => !v)}
            className="flex items-center gap-1.5 border border-[#E0D8C8] rounded-lg px-3 py-1.5 bg-white text-xs text-[#1a1a1a] hover:bg-[#fafaf8] transition-colors">
            {period}
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {open && (
            <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-[#E0D8C8] rounded-xl shadow-lg z-10 min-w-[140px] overflow-hidden">
              {['Monthly','6 Months','Yearly'].map(p => (
                <button key={p} type="button" onClick={() => { setPeriod(p); setOpen(false); }}
                  className={`block w-full text-left px-4 py-2.5 text-xs hover:bg-[#F5F5EF] transition-colors ${period === p ? 'bg-[#F5F5EF] font-medium' : ''}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-[200px] sm:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top:5, right:5, left:0, bottom:0 }}>
              <defs>
                <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false} />
              <XAxis dataKey={xKey || 'month'} tick={{ fontSize:11, fill:'#9A9080' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#9A9080' }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill={`url(#grad-${dataKey})`} dot={{ r:3, fill:color, stroke:'#fff', strokeWidth:2 }} activeDot={{ r:5 }} />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top:5, right:5, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false} />
              <XAxis dataKey={xKey || 'month'} tick={{ fontSize:11, fill:'#9A9080' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#9A9080' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={dataKey} fill={color} radius={[4,4,0,0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon, prefix = '', loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-[#F5F5EF] flex items-center justify-center shrink-0 text-[#174a37] text-2xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#6B6050] font-medium uppercase tracking-wide">{label}</p>
        {loading ? (
          <div className="h-7 w-24 bg-gray-100 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mt-0.5 tabular-nums">{prefix}{value ?? '—'}</p>
        )}
      </div>
      {trend && (
        <span className={`text-xl shrink-0 ${trend === 'up' ? '🔼' : '🔽'}`} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: dashData, loading } = useApi(AdminService.getDashboard);
  const stats       = dashData?.stats        || {};
  const PLACEHOLDER = MONTHS_PLACEHOLDER;
  const chartData   = dashData?.chartData    || PLACEHOLDER;
  const recentBookings = dashData?.recentBookings || [];
  const catRows = dashData?.categoryChart || PLACEHOLDER_CAT;
  const regRows = dashData?.regionChart  || PLACEHOLDER_REG;
  const chartRows = chartData?.map
    ? chartData
    : MONTHS_PLACEHOLDER;

  return (
    <div className="w-full min-w-0">
      <h1 className="font-baskerville text-[28px] sm:text-[32px] font-medium mb-6 text-[#1a1a1a]">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Total Revenue"
          value={stats.totalRevenue ?? (typeof stats.earning === 'string' ? stats.earning.replace(/^AED\s*/i, '') : null)}
          prefix={stats.totalRevenue != null ? 'AED ' : ''}
          icon="💰"
          loading={loading}
        />
        <StatCard label="New Users"        value={stats.users}    icon="👥" trend="up"   loading={loading} />
        <StatCard label="New Vendors"      value={stats.vendors}  icon="🏛" trend="down" loading={loading} />
        <StatCard label="New Bookings"     value={stats.bookings} icon="📋" trend="up"   loading={loading} />
      </div>

      {/* Live recharts */}
      {CHART_CONFIGS.map(cfg => {
        let rowData;
        if (cfg.key === 'catValue') rowData = loading ? PLACEHOLDER_CAT : catRows;
        else if (cfg.key === 'regValue') rowData = loading ? PLACEHOLDER_REG : regRows;
        else rowData = loading ? MONTHS_PLACEHOLDER : chartRows;
        return <ChartCard key={cfg.key} {...cfg} data={rowData} />;
      })}

      {/* Recent bookings table */}
      {recentBookings.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mt-5">
          <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Booking ID','User','Vendor','Amount','Status'].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 text-gray-400 font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.slice(0, 5).map((b, i) => (
                  <tr key={b.id || i} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                    <td className="py-3 px-3 text-xs font-mono text-gray-500">#{(b.id || '').slice(-8).toUpperCase()}</td>
                    <td className="py-3 px-3 font-medium text-gray-800">{b.user?.firstName} {b.user?.lastName}</td>
                    <td className="py-3 px-3 text-gray-500">{b.vendor?.companyName}</td>
                    <td className="py-3 px-3 font-medium">AED {Number(b.totalAmount || 0).toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : b.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
