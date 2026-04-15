"use client"

import { useState } from "react"
import { AlertCircle, ArrowDownRight, ArrowUpRight, Ban, Clock, IndianRupee } from "lucide-react"

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
const cashChartData = [
  { time: "Day 1", in: 12, out: -8, net: 4, cumulative: 4 },
  { time: "Day 2", in: 15, out: -9, net: 6, cumulative: 10 },
  { time: "Day 3", in: 8, out: -12, net: -4, cumulative: 6 },
  { time: "Day 4", in: 18, out: -5, net: 13, cumulative: 19 },
  { time: "Day 5", in: 22, out: -15, net: 7, cumulative: 26 },
  { time: "Day 6", in: 5, out: -20, net: -15, cumulative: 11 },
  { time: "Day 7", in: 14, out: -7, net: 7, cumulative: 18 },
  { time: "Day 8", in: 25, out: -10, net: 15, cumulative: 33 },
  { time: "Day 9", in: 10, out: -8, net: 2, cumulative: 35 },
  { time: "Day 10", in: 30, out: -18, net: 12, cumulative: 47 },
];

const inflows = [
  { cat: "Customer Payments", amt: "₹4.5Cr" },
  { cat: "Bank Loan Disbursal", amt: "₹2.0Cr" },
  { cat: "Rental Income", amt: "₹0.18Cr" },
  { cat: "Other Receipts", amt: "₹0.05Cr" },
];

const outflows = [
  { cat: "Contractor Payments", amt: "₹2.8Cr" },
  { cat: "Material Vendors", amt: "₹1.5Cr" },
  { cat: "Marketing Spend", amt: "₹0.45Cr" },
  { cat: "Salaries & Wages", amt: "₹0.35Cr" },
];

const cashEvents = [
  { desc: "Customer Payment Due (Tower A)", amt: "₹45L", date: "Mar 25", type: "in", status: "expected" },
  { desc: "Bank Loan EMI", amt: "-₹18L", date: "Mar 20", type: "out", status: "cleared" },
  { desc: "Vendor Payment (UltraTech)", amt: "-₹12L", date: "Mar 22", type: "out", status: "expected" },
  { desc: "Customer Payment Due (Villas)", amt: "₹65L", date: "Mar 28", type: "in", status: "delayed" },
  { desc: "Contractor Payment (MEP)", amt: "-₹28L", date: "Mar 30", type: "out", status: "expected" },
];

export default function CashFlowPage() {
  const [view, setView] = useState("Daily");

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Cash Flow & Liquidity</h1>
        <p className="text-slate-500 font-medium mt-1">Real-time tracking of inflows, outflows, and operational runway.</p>
      </div>

      {/* SECTION 1: KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5 flex flex-col justify-between">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Cash available</p>
          <div className="flex items-center justify-between">
             <h3 className="text-[32px] font-bold text-[#10B981]">₹8.4Cr</h3>
             <IndianRupee className="w-8 h-8 text-emerald-100" />
          </div>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 flex flex-col justify-between">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2">30-Day Inflows</p>
          <div className="flex items-center justify-between">
             <h3 className="text-[32px] font-bold text-[#0066FF]">₹6.7Cr</h3>
             <ArrowUpRight className="w-8 h-8 text-blue-200" />
          </div>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 flex flex-col justify-between">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2">30-Day Outflows</p>
          <div className="flex items-center justify-between">
             <h3 className="text-[32px] font-bold text-[#EF4444]">₹5.1Cr</h3>
             <ArrowDownRight className="w-8 h-8 text-red-200" />
          </div>
        </InteractivePearlCard>
        
        {/* RUNWAY WARNING */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[16px] p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full opacity-50 blur-xl"></div>
          <p className="text-[12px] font-bold text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Operational Runway
          </p>
          <div>
            <h3 className="text-[32px] font-black text-amber-900 leading-none">5.2 mo</h3>
            <p className="text-amber-700 text-[11px] font-semibold mt-1">Requires attention (&lt; 6 months)</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: FULL WIDTH CHART */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Net Cash Movement</h2>
          <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-[10px] border border-[#E8ECF0]">
            {['Daily', 'Weekly', 'Monthly'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-[6px] text-[12px] font-bold transition-all ${
                  view === v ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <PearlCard className="p-6">
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={cashChartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
               <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
               <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
               <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
               
               <Bar dataKey="in" name="Inflows" fill="#10B981" radius={[4, 4, 0, 0]} barSize={16} />
               <Bar dataKey="out" name="Outflows" fill="#EF4444" radius={[0, 0, 4, 4]} barSize={16} />
               <Line type="monotone" dataKey="cumulative" name="Cumulative Balance" stroke="#0066FF" strokeWidth={3} dot={{ r: 4, fill: '#fff' }} activeDot={{ r: 7 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </PearlCard>
      </section>

      {/* SECTION 3 & 4: TABLES */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* STATEMENT TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeading title="Cash Flow Breakdown (This Month)" />
          <div className="grid md:grid-cols-2 gap-6">
            <PearlCard className="overflow-hidden">
               <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-100 flex justify-between items-center">
                  <h3 className="font-bold text-emerald-800 tracking-wider uppercase text-[13px]">Cash Inflows</h3>
                  <span className="font-black text-emerald-600">₹6.7Cr</span>
               </div>
               <div className="p-5 space-y-4">
                 {inflows.map((inf, i) => (
                   <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                     <span className="text-[14px] font-medium text-slate-600">{inf.cat}</span>
                     <span className="text-[15px] font-bold text-[#0F172A]">{inf.amt}</span>
                   </div>
                 ))}
               </div>
            </PearlCard>
            
            <PearlCard className="overflow-hidden">
               <div className="bg-red-50 px-5 py-4 border-b border-red-100 flex justify-between items-center">
                  <h3 className="font-bold text-red-800 tracking-wider uppercase text-[13px]">Cash Outflows</h3>
                  <span className="font-black text-red-600">₹5.1Cr</span>
               </div>
               <div className="p-5 space-y-4">
                 {outflows.map((outf, i) => (
                   <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                     <span className="text-[14px] font-medium text-slate-600">{outf.cat}</span>
                     <span className="text-[15px] font-bold text-[#0F172A]">{outf.amt}</span>
                   </div>
                 ))}
               </div>
            </PearlCard>
          </div>
        </div>

        {/* TIMELINE */}
        <div>
          <SectionHeading title="Upcoming Cash Events" />
          <PearlCard className="p-0">
            <div className="divide-y divide-[#E8ECF0]">
              {cashEvents.map((evt, i) => (
                <div key={i} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${evt.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {evt.type === 'in' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <span className="font-semibold text-[#0F172A] text-[13px] pr-4 leading-tight">{evt.desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-10">
                    <div className="flex gap-3 items-center">
                      <Badge variant="outline" className={`px-2 py-0 uppercase tracking-widest text-[9px] font-bold border-none ${
                        evt.status === 'expected' ? 'bg-blue-50 text-blue-600' :
                        evt.status === 'delayed' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {evt.status}
                      </Badge>
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {evt.date}</span>
                    </div>
                    <span className={`font-bold text-[15px] ${evt.type === 'in' ? 'text-emerald-600' : 'text-[#0F172A]'}`}>{evt.amt}</span>
                  </div>
                </div>
              ))}
            </div>
          </PearlCard>
        </div>

      </div>

    </div>
  )
}
