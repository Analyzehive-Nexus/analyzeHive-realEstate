"use client";

export const dynamic = "force-dynamic";

import { ResponsiveTable } from "@/components/ui/responsive-table";


import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Users, Target, Building2, TrendingUp, Medal, Download } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { 
  ComposedChart, AreaChart, Area, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

// --- HELPERS ---
const SectionHeading = ({ title, onExport }: { title: string, onExport?: () => void }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
    {onExport && (
      <Button variant="ghost" onClick={onExport} className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 px-3 text-[13px] gap-2">
        <Download className="w-4 h-4" /> Export Data
      </Button>
    )}
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
const salesPerformanceData = [
  { month: "Oct 25", revenue: 4.2, target: 5.0, units: 12 },
  { month: "Nov 25", revenue: 6.5, target: 5.0, units: 18 },
  { month: "Dec 25", revenue: 7.8, target: 6.5, units: 22 },
  { month: "Jan 26", revenue: 5.4, target: 6.5, units: 15 },
  { month: "Feb 26", revenue: 6.8, target: 6.5, units: 19 },
  { month: "Mar 26", revenue: 8.4, target: 7.0, units: 23 },
];

const brokerLeaderboard = [
  { rank: 1, name: "Amit M", role: "Sr. Sales Exec", leads: 145, visits: 42, conv: 8, rev: "₹2.8Cr", ach: "160%", trend: "up" },
  { rank: 2, name: "Neha G", role: "Sales Exec", leads: 128, visits: 38, conv: 7, rev: "₹2.4Cr", ach: "140%", trend: "up" },
  { rank: 3, name: "Rahul S", role: "Sales Exec", leads: 115, visits: 29, conv: 5, rev: "₹1.8Cr", ach: "105%", trend: "up" },
  { rank: 4, name: "Priya K", role: "Jr. Exec", leads: 95, visits: 24, conv: 4, rev: "₹1.4Cr", ach: "85%", trend: "down" },
  { rank: 5, name: "Vikram N", role: "Sales Exec", leads: 102, visits: 18, conv: 3, rev: "₹1.1Cr", ach: "60%", trend: "down" },
];

const channelROI = [
  { channel: "Meta Ads", spend: "₹15.2L", leads: 480, conv: 32, rev: "₹11.5Cr", roi: "746%", cpl: "₹3,166", cpa: "₹47,500" },
  { channel: "Google Ads", spend: "₹12.5L", leads: 310, conv: 25, rev: "₹8.8Cr", roi: "694%", cpl: "₹4,032", cpa: "₹50,000" },
  { channel: "99acres", spend: "₹8.0L", leads: 240, conv: 18, rev: "₹6.2Cr", roi: "765%", cpl: "₹3,333", cpa: "₹44,444" },
  { channel: "Direct Walk-ins", spend: "₹2.0L", leads: 85, conv: 15, rev: "₹5.5Cr", roi: "2650%", cpl: "₹2,352", cpa: "₹13,333" },
  { channel: "Channel Partners", spend: "₹4.5L", leads: 60, conv: 12, rev: "₹4.2Cr", roi: "923%", cpl: "₹7,500", cpa: "₹37,500" },
];

const pipelineMovement = [
  { week: "Wk 1", new: 45, contacted: 38, visited: 15, negotiation: 8, won: 3 },
  { week: "Wk 2", new: 52, contacted: 44, visited: 22, negotiation: 10, won: 5 },
  { week: "Wk 3", new: 68, contacted: 55, visited: 28, negotiation: 14, won: 7 },
  { week: "Wk 4", new: 54, contacted: 48, visited: 24, negotiation: 12, won: 8 },
];

function SalesPerformancePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const periodMap: Record<string, string> = {
    week: "This Week",
    month: "This Month",
    quarter: "This Quarter",
    year: "This Year",
  };

  const inversePeriodMap: Record<string, string> = {
    "This Week": "week",
    "This Month": "month",
    "This Quarter": "quarter",
    "This Year": "year",
  };

  const urlPeriod = searchParams?.get("period") || "month";
  const period = periodMap[urlPeriod] || "This Month";

  const handlePeriodChange = (p: string) => {
    const nextUrlPeriod = inversePeriodMap[p] || "month";
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("period", nextUrlPeriod);
    router.push(`${pathname}?${params.toString()}`);
  };

  const exportCSV = () => {
    const rows = brokerLeaderboard.map((b) => [b.name, b.leads, b.conv, b.rev]);
    const csv = [["Broker", "Leads", "Conversions", "Revenue"], ...rows]
      .map(row => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `broker_leaderboard_${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleGlobalExport = () => {
      exportCSV();
    };
    window.addEventListener("export-dashboard-report", handleGlobalExport);
    return () => {
      window.removeEventListener("export-dashboard-report", handleGlobalExport);
    };
  }, [period]);

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Sales Performance</h1>
          <p className="text-slate-500 font-medium mt-1">MD overview of revenue generation, teams, and channels.</p>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-[10px] border border-[#E8ECF0]">
          {['This Week', 'This Month', 'This Quarter', 'This Year'].map(p => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-4 py-2 rounded-[6px] text-[13px] font-bold transition-all ${
                period === p 
                  ? 'bg-white text-[#0066FF] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        <InteractivePearlCard className="p-5 lg:col-span-2">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-[10px] bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">+18% vs Target</Badge>
          </div>
          <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">₹8.4Cr</h3>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Revenue</p>
        </InteractivePearlCard>
        
        <InteractivePearlCard className="p-5 lg:col-span-2">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-[10px] bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <Target className="h-5 w-5" />
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">23 Units</Badge>
          </div>
          <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">115%</h3>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mt-1">Target Achievement</p>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-5">
          <div className="h-10 w-10 rounded-[10px] bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-[28px] font-bold text-[#0F172A] leading-tight">8.5%</h3>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Conversion Rate</p>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-5">
          <div className="h-10 w-10 rounded-[10px] bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <Building2 className="h-5 w-5" />
          </div>
          <h3 className="text-[28px] font-bold text-[#0F172A] leading-tight">₹45.5L</h3>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Customer Acq. Cost</p>
        </InteractivePearlCard>
      </section>

      {/* SECTION 2: PERFORMANCE vs TARGET CHART */}
      <section>
        <SectionHeading title="Revenue vs Target Trend (Consolidated)" />
        <PearlCard className="p-6 pt-10">
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={salesPerformanceData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8}/>
                   <stop offset="95%" stopColor="#0066FF" stopOpacity={0.1}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
               <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B', fontWeight: 500 }} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}Cr`} />
               <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}Cr`} />
               <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
               
               <Area type="monotone" dataKey="revenue" name="Actual Revenue" fill="url(#revFill)" stroke="#0052CC" strokeWidth={3} />
               <Line type="monotone" dataKey="target" name="Target Revenue" stroke="#F59E0B" strokeWidth={3} strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </PearlCard>
      </section>

      {/* SECTION 3: BROKER PERFORMANCE */}
      <section>
        <SectionHeading title="Top Performing Brokers / Agents" onExport={exportCSV} />
        <PearlCard>
          <ResponsiveTable>
<Table>
             <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
               <TableRow className="hover:bg-transparent border-none">
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6 text-center w-[80px]">Rank</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Broker / Agent</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-center">Leads</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-center">Visits</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-center">Cwms</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-right">Revenue</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-right pr-6">Target Achieved</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {brokerLeaderboard.map((b, i) => (
                 <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                   <TableCell className="py-4 pl-6 text-center font-black text-xl text-slate-300">
                     {b.rank === 1 ? <Medal className="w-6 h-6 text-yellow-500 mx-auto" /> : 
                      b.rank === 2 ? <Medal className="w-6 h-6 text-slate-400 mx-auto" /> : 
                      b.rank === 3 ? <Medal className="w-6 h-6 text-amber-600 mx-auto" /> : 
                      <span className="text-slate-400">#{b.rank}</span>}
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                         {b.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-bold text-[#0F172A] text-[14px] leading-tight">{b.name}</p>
                         <p className="text-[11px] font-semibold text-slate-500">{b.role}</p>
                       </div>
                     </div>
                   </TableCell>
                   <TableCell className="text-center font-medium text-slate-600">{b.leads}</TableCell>
                   <TableCell className="text-center font-medium text-slate-600">{b.visits}</TableCell>
                   <TableCell className="text-center font-bold text-[#0F172A]">{b.conv}</TableCell>
                   <TableCell className="text-right font-bold text-[#10B981] text-[15px]">{b.rev}</TableCell>
                   <TableCell className="text-right pr-6">
                     <div className="flex items-center justify-end gap-2">
                       <Badge variant="outline" className={`border-none shadow-none font-bold px-2 py-0.5 ${
                         parseInt(b.ach) >= 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                       }`}>
                         {b.ach}
                       </Badge>
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
</ResponsiveTable>
        </PearlCard>
      </section>

      {/* SECTION 4 & 5: CHANNEL ROI & PIPELINE */}
      <section className="grid lg:grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Channel ROI Analysis" />
          <PearlCard className="flex-1 overflow-x-auto">
             <ResponsiveTable>
<Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase py-3 pl-4">Channel</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">Spend</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-center">Convs</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">CPA</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right pr-4">ROI</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {channelROI.map((c, i) => (
                   <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-3 pl-4 font-bold text-[#0F172A] text-[13px]">{c.channel}</TableCell>
                     <TableCell className="text-right text-[13px] font-medium text-slate-600">{c.spend}</TableCell>
                     <TableCell className="text-center text-[13px] font-bold text-[#0F172A]">{c.conv}</TableCell>
                     <TableCell className="text-right text-[13px] font-semibold text-rose-600">{c.cpa}</TableCell>
                     <TableCell className="text-right pr-4">
                       <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] px-1.5 shadow-none">
                         {c.roi}
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
          <SectionHeading title="Weekly Pipeline Movement" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pipelineMovement} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                 <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                 <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                 <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }} />
                 
                 <Bar dataKey="new" stackId="a" fill="#E2E8F0" name="New Leads" radius={[0, 0, 4, 4]} />
                 <Bar dataKey="contacted" stackId="a" fill="#93C5FD" name="Contacted" />
                 <Bar dataKey="visited" stackId="a" fill="#3B82F6" name="Site Visit" />
                 <Bar dataKey="negotiation" stackId="a" fill="#6366F1" name="Negotiation" />
                 <Bar dataKey="won" stackId="a" fill="#10B981" name="Converted" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

    </div>
  )
}

export default function SalesPerformancePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[400px]">
        <span className="text-slate-500 font-medium">Loading sales analytics...</span>
      </div>
    }>
      <SalesPerformancePageContent />
    </Suspense>
  );
}
