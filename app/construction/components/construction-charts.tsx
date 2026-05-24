"use client";

import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
  AreaChart, Area
} from "recharts";

interface StockSummaryChartProps {
  stockSummaryChart: any[];
  totalItems: number;
}

export function StockSummaryChart({ stockSummaryChart, totalItems }: StockSummaryChartProps) {
  return (
    <div className="h-[240px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={stockSummaryChart}
            innerRadius={70}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {stockSummaryChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8 pointer-events-none">
        <span className="text-3xl font-bold text-[#0F172A]">{totalItems}</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Items</span>
      </div>
    </div>
  );
}

interface CompletionVelocityChartProps {
  progressChart: any[];
}

export function CompletionVelocityChart({ progressChart }: CompletionVelocityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={progressChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val)=>`${val}%`} />
        <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
        <Bar dataKey="TowerA" name="Tower A" fill="#0066FF" radius={[4, 4, 0, 0]} barSize={24} />
        <Bar dataKey="TowerB" name="Tower B" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface LabourAttendanceChartProps {
  presentPercent: number;
}

export function LabourAttendanceChart({ presentPercent }: LabourAttendanceChartProps) {
  return (
    <div className="relative h-40 w-40 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: presentPercent, fill: '#6366F1' }]} startAngle={90} endAngle={-270}>
          <RadialBar background={{ fill: '#E8ECF0' }} dataKey="value" cornerRadius={20} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#0F172A]">{presentPercent}%</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Present</span>
      </div>
    </div>
  );
}

interface WeeklyLabourAvailabilityChartProps {
  attendanceTrend: any[];
}

export function WeeklyLabourAvailabilityChart({ attendanceTrend }: WeeklyLabourAvailabilityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0066FF" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
        <Area type="monotone" dataKey="count" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" dot={{ r: 4, fill: '#0066FF', strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface ExpenditureAnalysisChartProps {
  budgetData: any[];
}

export function ExpenditureAnalysisChart({ budgetData }: ExpenditureAnalysisChartProps) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={budgetData.map(d => ({ ...d, b: d.b/100000, s: d.s/100000 }))} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8ECF0" />
        <YAxis dataKey="cat" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={90} />
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
        <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(val: number) => `₹${val.toFixed(1)}L`} />
        <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }} />
        <Bar dataKey="b" name="Budgeted" fill="#0066FF" radius={[0, 4, 4, 0]} barSize={12} />
        <Bar dataKey="s" name="Spent" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
}
