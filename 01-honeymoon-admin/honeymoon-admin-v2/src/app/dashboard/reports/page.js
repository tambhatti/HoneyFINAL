'use client';
import { useApi } from '../../../hooks/useApi';
import { AdminService } from '../../../lib/services/admin.service';
import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PIE_COLORS = ['#174a37','#CFB383','#2d7a5a','#e8c98a','#0e5c3f','#b89a65'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-3 shadow-lg text-sm">
      {label && <p className="font-semibold text-[#1a1a1a] mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="tabular-nums">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

/* Build placeholder chart data */
const buildMonthly = (base, variance) =>
  MONTHS.map((m, i) => ({ month: m, value: Math.round(base + Math.sin(i * 0.8) * variance + i * base * 0.05) }));

export default function AdminReportsPage() {
  const { data, loading } = useApi(AdminService.getReports);
  const reports = data || {};
  const [period, setPeriod] = useState('Monthly');

  /* Use real data when available, fallback to placeholders */
  const revenueData  = reports.revenueChart  || buildMonthly(40000, 12000);
  const bookingData  = reports.bookingChart  || buildMonthly(35, 15);
  const userGrowth   = reports.userChart     || buildMonthly(80, 25);
  const categoryData = reports.categoryBreakdown || [
    { name:'Venue', value:38 },{ name:'Photography', value:22 },{ name:'Catering', value:16 },
    { name:'Beauty', value:12 },{ name:'Decoration', value:8 },{ name:'Music', value:4 },
  ];

  const stats = reports.stats || {};

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="font-baskerville text-[26px] sm:text-3xl text-[#1a1a1a]">Reports</h1>
        <div className="flex gap-2 flex-wrap">
          {['Monthly','Quarterly','Yearly'].map(p => (
            <button key={p} type="button" onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${period===p ? 'bg-[#174a37] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#F5F5EF]'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Total Revenue',       stats.revenue  ? `AED ${Number(stats.revenue).toLocaleString()}`  : 'AED 1.2M', '💰'],
          ['Bookings This Month', stats.bookings ?? '48', '📋'],
          ['Active Vendors',      stats.vendors  ?? '156', '🏛'],
          ['Registered Users',    stats.users    ?? '2,840', '👥'],
        ].map(([l, v, ic]) => (
          <div key={l} className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 mb-2"><span className="text-xl">{ic}</span></div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
            <p className="font-baskerville text-xl sm:text-2xl text-[#1a1a1a] mt-1 tabular-nums">
              {loading ? <span className="block h-6 w-20 bg-gray-100 rounded animate-pulse" /> : v}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-5">
        <h2 className="font-baskerville text-lg text-[#1a1a1a] mb-5">Revenue Overview</h2>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top:5, right:5, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'#9A9080' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:'#9A9080' }} axisLine={false} tickLine={false} width={50}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}/>
              <Tooltip content={<CustomTooltip />}/>
              <Bar dataKey="value" name="Revenue (AED)" fill="#174a37" radius={[4,4,0,0]} maxBarSize={36}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings + User growth side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
          <h2 className="font-baskerville text-lg text-[#1a1a1a] mb-5">Bookings Trend</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingData} margin={{ top:5, right:5, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize:10, fill:'#9A9080' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10, fill:'#9A9080' }} axisLine={false} tickLine={false} width={30}/>
                <Tooltip content={<CustomTooltip />}/>
                <Line type="monotone" dataKey="value" name="Bookings" stroke="#CFB383" strokeWidth={2.5} dot={{ r:3, fill:'#CFB383', stroke:'#fff', strokeWidth:2 }} activeDot={{ r:5 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
          <h2 className="font-baskerville text-lg text-[#1a1a1a] mb-5">User Growth</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowth} margin={{ top:5, right:5, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize:10, fill:'#9A9080' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10, fill:'#9A9080' }} axisLine={false} tickLine={false} width={30}/>
                <Tooltip content={<CustomTooltip />}/>
                <Bar dataKey="value" name="New Users" fill="#2d7a5a" radius={[3,3,0,0]} maxBarSize={28}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category breakdown pie */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <h2 className="font-baskerville text-lg text-[#1a1a1a] mb-5">Bookings by Category</h2>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="h-[220px] w-full max-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}/>
                <span className="text-gray-600">{c.name}</span>
                <span className="font-semibold text-[#1a1a1a] tabular-nums">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
