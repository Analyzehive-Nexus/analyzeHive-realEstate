"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";


import { useState } from "react"
import { Building2, TrendingUp, BarChart3, Target, CalendarDays, Wallet } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { 
  ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

// --- HELPERS ---
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// --- MOCK DATA ---
const getForecastData = (scenario: string) => {
  const baseData = [
    { month: "Apr 26", base: 110 },
    { month: "May 26", base: 115 },
    { month: "Jun 26", base: 95 },
    { month: "Jul 26", base: 125 },
    { month: "Aug 26", base: 118 },
    { month: "Sep 26", base: 135 },
    { month: "Oct 26", base: 145 },
    { month: "Nov 26", base: 155 },
    { month: "Dec 26", base: 175 },
    { month: "Jan 27", base: 160 },
    { month: "Feb 27", base: 150 },
    { month: "Mar 27", base: 190 },
  ];

  return baseData.map(d => ({
    ...d,
    conservative: Math.round(d.base * 0.85),
    optimistic: Math.round(d.base * 1.25),
  }));
};

const projectForecast = [
  { project: "Analyzehive Heights Tower A", currentRev: "₹45Cr", remRev: "₹15Cr", unitsLeft: 15, expectedCompletion: "Dec 2026", status: "On Track" },
  { project: "Analyzehive Heights Tower B", currentRev: "₹28Cr", remRev: "₹32Cr", unitsLeft: 32, expectedCompletion: "Jun 2027", status: "At Risk" },
  { project: "Analyzehive Villas Phase 1", currentRev: "₹85Cr", remRev: "₹10Cr", unitsLeft: 2, expectedCompletion: "Apr 2026", status: "Ahead" },
  { project: "Analyzehive Commercial Hub", currentRev: "₹25Cr", remRev: "₹175Cr", unitsLeft: 32, expectedCompletion: "Sep 2028", status: "On Track" },
];

const absorptionData = [
  { category: "2 BHK Premium", total: 100, sold: 65, avail: 35, pipeline: 12 },
  { category: "3 BHK Luxury", total: 60, sold: 42, avail: 18, pipeline: 8 },
  { category: "4 BHK Penthouses", total: 10, sold: 4, avail: 6, pipeline: 2 },
  { category: "Commercial Shops", total: 40, sold: 8, avail: 32, pipeline: 15 },
  { category: "Luxury Villas", total: 20, sold: 18, avail: 2, pipeline: 5 },
];

const revenueRecognition = [
  { event: "Tower A Plinth Completion", date: "Apr 15, 2026", type: "Milestone", amount: "₹4.5Cr", prob: "100%" },
  { event: "Villas Handover (Final Tranche)", date: "May 10, 2026", type: "Handover", amount: "₹8.2Cr", prob: "95%" },
  { event: "Tower B Foundation Completion", date: "Jun 20, 2026", type: "Milestone", amount: "₹6.0Cr", prob: "80%" },
  { event: "Commercial Hub Booking Amount", date: "Jul 05, 2026", type: "Sales", amount: "₹12.5Cr", prob: "70%" },
];


export default function ForecastPage() {
  const [scenario, setScenario] = useState("Base");
  const chartData = getForecastData(scenario);

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8ECF0] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Revenue Forecast</h1>
          <p className="text-slate-500 font-medium mt-1">12-month consolidated modeling and unit absorption.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-[12px] border border-[#E8ECF0]">
          {['Conservative', 'Base', 'Optimistic'].map(s => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`px-5 py-2.5 rounded-[8px] text-[13px] font-bold transition-all ${
                scenario === s 
                  ? s === 'Optimistic' ? 'bg-[#10B981] text-white shadow-md' :
                    s === 'Conservative' ? 'bg-[#F59E0B] text-white shadow-md' :
                    'bg-[#0066FF] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: KPI CARDS */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-6">
        <InteractivePearlCard className="p-5 lg:col-span-2 relative">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-[10px] bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">FY26 Projected Revenue</p>
          <h3 className="text-[28px] font-bold text-[#0F172A]">
            {scenario === 'Conservative' ? '₹140.4Cr' : scenario === 'Optimistic' ? '₹206.5Cr' : '₹165.2Cr'}
          </h3>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-5 lg:col-span-2 relative">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-[10px] bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Unsold Inventory Val</p>
          <h3 className="text-[28px] font-bold text-[#0F172A]">₹232.0Cr</h3>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-5 lg:col-span-2 relative">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-[10px] bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Upcoming Collections (Q1)</p>
          <h3 className="text-[28px] font-bold text-[#0F172A]">₹18.7Cr</h3>
        </InteractivePearlCard>
      </section>

      {/* SECTION 2: FORECAST CHART */}
      <section>
        <SectionHeading title="Scenario Modeling (Consolidated)" />
        <PearlCard className="p-6 pt-10">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                 <linearGradient id="baseFill" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2}/>
                   <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                 </linearGradient>
               </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B', fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
              <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
              
              <Area type="monotone" dataKey="base" name="Base Scenario" fill="url(#baseFill)" stroke="#0066FF" strokeWidth={3} />
              {(scenario === 'Conservative' || scenario === 'Base') && <Line type="monotone" dataKey="conservative" name="Conservative" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />}
              {(scenario === 'Optimistic' || scenario === 'Base') && <Line type="monotone" dataKey="optimistic" name="Optimistic" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />}
            </ComposedChart>
          </ResponsiveContainer>
        </PearlCard>
      </section>

      {/* SECTION 3 & 4: TABLES */}
      <section className="grid lg:grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="flex flex-col">
          <SectionHeading title="Project-wise Pipeline" />
          <PearlCard className="flex-1">
             <ResponsiveTable>
<Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6">Project</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Rem. Revenue</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Units Left</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Status</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {projectForecast.map((p, i) => (
                   <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-4 pl-6 font-semibold text-[#0F172A]">{p.project}</TableCell>
                     <TableCell className="font-bold text-[#0F172A]">{p.remRev}</TableCell>
                     <TableCell className="font-medium text-slate-500">{p.unitsLeft}</TableCell>
                     <TableCell>
                       <Badge variant="outline" className={`px-2 py-0.5 border-none shadow-none font-bold ${
                         p.status === 'On Track' ? 'bg-blue-100 text-blue-700' :
                         p.status === 'Ahead' ? 'bg-emerald-100 text-emerald-700' :
                         'bg-amber-100 text-amber-700'
                       }`}>
                         {p.status}
                       </Badge>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
</ResponsiveTable>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="Unit Absorption Analysis" />
          <PearlCard className="flex-1 p-6">
            <div className="space-y-6">
              {absorptionData.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-[#0F172A] text-[14px]">{d.category}</span>
                    <span className="text-[12px] font-bold text-slate-400">
                      Sold: <span className="text-[#10B981]">{d.sold}</span> / Avail: <span className="text-[#F59E0B]">{d.avail}</span>
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full flex overflow-hidden bg-slate-100">
                    <div className="h-full bg-[#10B981]" style={{ width: `${(d.sold / d.total)*100}%` }} title={`Sold ${d.sold}`} />
                    <div className="h-full bg-[#0066FF] opacity-60" style={{ width: `${(d.pipeline / d.total)*100}%` }} title={`Pipeline ${d.pipeline}`} />
                    <div className="h-full bg-[#F59E0B]" style={{ width: `${((d.avail - d.pipeline) / d.total)*100}%` }} title={`Available ${d.avail - d.pipeline}`} />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-6 pt-4 border-t border-[#E8ECF0]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#10B981]"/> Sold</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#0066FF] opacity-60"/> Active Pipeline</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#F59E0B]"/> Available</div>
              </div>
            </div>
          </PearlCard>
        </div>

      </section>

      {/* SECTION 5: REVENUE RECOGNITION */}
      <section>
        <SectionHeading title="Revenue Recognition Schedule" />
        <PearlCard>
          <ResponsiveTable>
<Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6">Expected Event</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Type</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Amount</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Date</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Probability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueRecognition.map((r, i) => (
                <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                  <TableCell className="py-4 pl-6 font-semibold text-[#0F172A]">{r.event}</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="bg-slate-100 text-slate-600 rounded-[6px] shadow-none border-[#E8ECF0]">{r.type}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-[#10B981] text-[15px]">{r.amount}</TableCell>
                  <TableCell className="font-medium text-slate-600 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-slate-400"/> {r.date}</TableCell>
                  <TableCell className="font-bold text-[#0F172A]">{r.prob}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
</ResponsiveTable>
        </PearlCard>
      </section>

    </div>
  )
}
