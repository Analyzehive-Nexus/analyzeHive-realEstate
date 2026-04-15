"use client"

import { 
  IndianRupee, TrendingDown, TrendingUp, Users, Target, Building2, 
  MapPin, Clock, ArrowRight, Medal, CheckCircle2, CircleDashed, Circle, AlertTriangle, BarChart3
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { 
  ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, Cell
} from "recharts"

// --- MOCK DATA FALLBACKS ---
const salesVsTargetData = [
  { month: "Oct", actual: 12, target: 15, pct: 80 },
  { month: "Nov", actual: 18, target: 15, pct: 120 },
  { month: "Dec", actual: 22, target: 20, pct: 110 },
  { month: "Jan", actual: 16, target: 20, pct: 80 },
  { month: "Feb", actual: 19, target: 20, pct: 95 },
  { month: "Mar", actual: 23, target: 20, pct: 115 },
];

const constructionBurnData = [
  { month: "Oct", budget: 80, spent: 45 },
  { month: "Nov", budget: 80, spent: 58 },
  { month: "Dec", budget: 80, spent: 71 },
  { month: "Jan", budget: 80, spent: 68 },
  { month: "Feb", budget: 80, spent: 74 },
  { month: "Mar", budget: 80, spent: 77 },
];

const revenueForecastData = [
  { month: "Apr 26", projected: 85, confirmed: 60, target: 90 },
  { month: "May", projected: 92, confirmed: 55, target: 95 },
  { month: "Jun", projected: 78, confirmed: 45, target: 85 },
  { month: "Jul", projected: 105, confirmed: 70, target: 110 },
  { month: "Aug", projected: 98, confirmed: 65, target: 105 },
  { month: "Sep", projected: 120, confirmed: 80, target: 125 },
];

const cashFlowData = [
  { month: "Oct", in: 120, out: -85, net: 35, cumulative: 35 },
  { month: "Nov", in: 145, out: -92, net: 53, cumulative: 88 },
  { month: "Dec", in: 168, out: -78, net: 90, cumulative: 178 },
  { month: "Jan", in: 132, out: -95, net: 37, cumulative: 215 },
  { month: "Feb", in: 158, out: -88, net: 70, cumulative: 285 },
  { month: "Mar", in: 185, out: -102, net: 83, cumulative: 368 },
];

const constLeaderboard = [
  { name: "Ravi Kumar", tasks: 24, ontime: "96%", eff: "Excellent" },
  { name: "Sunil Sharma", tasks: 19, ontime: "88%", eff: "Good" },
  { name: "Pradeep Singh", tasks: 22, ontime: "91%", eff: "Very Good" },
];

// --- FORMAT HELPERS ---
const formatCr = (val: number) => `₹${(val / 10000000).toFixed(1)}Cr`;

const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
    <Button variant="ghost" className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 px-3 text-[13px]">View All</Button>
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
    className={`overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200 ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

export default function DashboardClient({
  finStats,
  leadsStats,
  flatsStats,
  projStats,
  projectsDb,
  brokers
}: any) {

  const totalRev = finStats?.totalRevenue || 0;
  const totalExp = finStats?.totalExpenses || 0;
  const netProfit = finStats?.netProfit || 0;
  const projCount = projStats?.total || 0;
  
  const funnelData = [
    { stage: "Total Leads", count: leadsStats?.total || 0, pct: "100%", drop: null, color: "#1E3A8A" },
    { stage: "Contacted", count: leadsStats?.contacted || 0, pct: "69.7%", drop: ((leadsStats?.total||0)-(leadsStats?.contacted||0)), color: "#2563EB" },
    { stage: "Site Visit", count: leadsStats?.siteVisit || 0, pct: "31.3%", drop: ((leadsStats?.contacted||0)-(leadsStats?.siteVisit||0)), color: "#3B82F6" },
    { stage: "Negotiation", count: leadsStats?.negotiation || 0, pct: "14.4%", drop: ((leadsStats?.siteVisit||0)-(leadsStats?.negotiation||0)), color: "#60A5FA" },
    { stage: "Converted", count: leadsStats?.converted || 0, pct: "8.1%", drop: ((leadsStats?.negotiation||0)-(leadsStats?.converted||0)), color: "#93C5FD" },
    { stage: "Lost", count: leadsStats?.lost || 0, pct: "6.3%", drop: "from neg", color: "#BFDBFE" }
  ];

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* SECTION 1 - EXECUTIVE KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-3">
        {/* ROW 1 */}
        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-[#0066FF] to-blue-400 flex items-center justify-center text-white shadow-md">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 23% vs last mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{formatCr(totalRev)}</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Total Revenue</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">{projCount} projects combined</p>
          </div>
          <svg className="absolute bottom-4 right-4 opacity-20" width="60" height="24" viewBox="0 0 60 24">
            <path d="M0,20 L15,10 L30,15 L45,5 L60,0" fill="none" stroke="#0066FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-red-500 to-rose-400 flex items-center justify-center text-white shadow-md">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 8% vs last mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{formatCr(totalExp)}</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Total Expenses</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">Marketing + Construction</p>
          </div>
          <svg className="absolute bottom-4 right-4 opacity-20" width="60" height="24" viewBox="0 0 60 24">
            <path d="M0,5 L15,15 L30,12 L45,20 L60,24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-md">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 41% vs last mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{formatCr(netProfit)}</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Net Profit</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">{finStats?.profitMargin || 0}% profit margin</p>
          </div>
          <svg className="absolute bottom-4 right-4 opacity-20" width="60" height="24" viewBox="0 0 60 24">
            <path d="M0,24 L15,18 L30,8 L45,12 L60,0" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </InteractivePearlCard>

        {/* ROW 2 */}
        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 12% this mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{leadsStats?.total || 0}</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Total Leads</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">Across all channels</p>
          </div>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
              <Target className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 5% this mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{leadsStats?.converted || 0} units</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Conversions</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">Conversion rate</p>
          </div>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[11px] font-bold">On Schedule</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{projCount} projects</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Active Projects</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">{projStats?.active || 0} active</p>
          </div>
        </InteractivePearlCard>
      </section>

      {/* SECTION 2 - OVERALL P&L SUMMARY */}
      <section>
        <PearlCard className="p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-8 border-b border-[#E8ECF0] pb-4">Profit & Loss Summary (Live Data)</h2>
          
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Income */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#10B981] text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Income
              </h4>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Flat Sales / Bookings</span>
                <span className="font-semibold text-[#0F172A]">₹{totalRev.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t border-[#E8ECF0] flex justify-between items-center mt-2">
                <span className="font-bold text-[15px] text-[#0F172A]">Total Income</span>
                <span className="font-bold text-[18px] text-[#10B981]">₹{totalRev.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Expenses */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#EF4444] text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Expenses
              </h4>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Construction Cost</span>
                <span className="font-semibold text-[#0F172A]">₹{(finStats?.constructionSpend || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Marketing Spend</span>
                <span className="font-semibold text-[#0F172A]">₹{(finStats?.marketingSpend || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Other Ops</span>
                <span className="font-semibold text-[#0F172A]">₹{(totalExp - (finStats?.constructionSpend||0) - (finStats?.marketingSpend||0)).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t border-[#E8ECF0] flex justify-between items-center mt-2">
                <span className="font-bold text-[15px] text-[#0F172A]">Total Expenses</span>
                <span className="font-bold text-[18px] text-[#EF4444]">₹{(totalExp).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4 bg-[#F8FAFC] p-6 rounded-2xl border border-[#E8ECF0]">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Gross Profit</span>
                <span className="font-semibold text-[#0F172A]">₹{(totalRev - totalExp).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-gray-100">
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-widest">Net Profit</span>
                <div className="text-[36px] font-bold text-[#10B981] leading-none mt-1 shadow-sm">₹{netProfit.toLocaleString('en-IN')}</div>
              </div>
              <div className="pt-2">
                 <Badge className="bg-green-100 text-green-700 border-none shadow-none font-bold px-3 py-1 text-[13px] rounded-[6px]">{finStats?.profitMargin || '0'}% Profit Margin</Badge>
              </div>
            </div>
          </div>
        </PearlCard>
      </section>

      {/* SECTION 3 - SALES vs TARGET CHART */}
      <section className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col">
          <SectionHeading title="Monthly Sales Performance" />
          <PearlCard className="flex-1 p-6 pt-8 pr-10">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={salesVsTargetData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="pctFill" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }} />
                
                <Area type="monotone" dataKey="pct" name="Achievement %" fill="url(#pctFill)" stroke="none" />
                <Bar dataKey="actual" name="Actual Sales" fill="#0066FF" radius={[4, 4, 0, 0]} barSize={28} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#F59E0B" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="Sales Breakdown" />
          <PearlCard className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest">This Month Achievement</p>
              <h2 className="text-[48px] font-extrabold text-[#10B981] leading-none mt-2">115%</h2>
            </div>
            
            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center border-b border-[#E8ECF0] pb-3">
                <span className="text-slate-600 font-medium text-[15px]">Units Sold</span>
                <span className="font-bold text-[#0F172A] text-[15px]">{leadsStats?.converted || 0} <span className="text-slate-400 font-medium">units</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E8ECF0] pb-3">
                <span className="text-slate-600 font-medium text-[15px]">Total Revenue</span>
                <span className="font-bold text-[#0F172A] text-[15px]">{formatCr(totalRev)}</span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Overall Pipeline</p>
              <div className="w-full h-4 rounded-full flex overflow-hidden shadow-sm">
                <div className="h-full bg-[#3B82F6]" style={{ width: '40%' }} title="New 40%" />
                <div className="h-full bg-[#10B981]" style={{ width: '30%' }} title="Lost 30%" />
              </div>
              <div className="flex justify-between text-[11px] font-bold mt-2">
                <span className="text-[#3B82F6]">Total Leads: {leadsStats?.total || 0}</span>
                <span className="text-[#10B981]">Site Visits: {leadsStats?.siteVisit || 0}</span>
              </div>
            </div>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 4 - CONSTRUCTION COST BURN */}
      <section className="grid lg:grid-cols-11 gap-8">
        <div className="lg:col-span-6 flex flex-col">
           <SectionHeading title="Construction Spend vs Budget" />
           <PearlCard className="flex-1 p-6 pr-10">
             <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={constructionBurnData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                     </linearGradient>
                   </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }} />
                  
                  <Area type="monotone" dataKey="spent" name="Actual Spend" fill="url(#spendFill)" stroke="#D97706" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line type="stepAfter" dataKey="budget" name="Budget Limit" stroke="#0066FF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </AreaChart>
             </ResponsiveContainer>
           </PearlCard>
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <SectionHeading title="Cost Breakdown" />
          <PearlCard className="flex-1 p-6 flex flex-col">
             <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-3 flex items-center gap-3 mb-6">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="text-amber-800 text-sm font-semibold">⚠️ Based on allocated budgets</span>
             </div>

             <div className="flex items-center gap-6 flex-1">
                <div className="relative h-[180px] w-[180px] shrink-0">
                   <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart innerRadius="75%" outerRadius="100%" data={[{ value: projStats?.totalBudget ? (projStats.totalSpent / projStats.totalBudget) * 100 : 0, fill: '#F59E0B' }]} startAngle={90} endAngle={-270}>
                        <RadialBar background={{ fill: '#E8ECF0' }} dataKey="value" cornerRadius={20} />
                      </RadialBarChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-[#0F172A]">{projStats?.totalBudget ? Math.round((projStats.totalSpent / projStats.totalBudget) * 100) : 0}%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Burn Rate</span>
                   </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Budget</p>
                    <p className="text-lg font-bold text-[#0F172A]">₹{(projStats?.totalBudget || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Spent</p>
                    <p className="text-lg font-bold text-[#F59E0B]">₹{(projStats?.totalSpent || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Remaining</p>
                    <p className="text-lg font-bold text-[#10B981]">₹{((projStats?.totalBudget || 0) - (projStats?.totalSpent || 0)).toLocaleString('en-IN')}</p>
                  </div>
                </div>
             </div>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 5 - LEAD CONVERSION FUNNEL */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Lead Conversion Funnel" />
          <PearlCard className="flex-1 p-10 flex flex-col items-center justify-center bg-[#F8FAFC]">
            {funnelData.map((stage, i) => {
              const safePct = (leadsStats?.total||0) > 0 ? ((stage.count / leadsStats!.total) * 100).toFixed(1) : '0.0'
              return (
              <div key={i} className="flex items-center w-full mb-2 group">
                <div className="w-[100px] text-right pr-4 text-[11px] font-bold text-slate-400 uppercase">
                   {stage.drop && `-${stage.drop}`}
                </div>
                <div className="flex-1 flex justify-center">
                  <div 
                    className="h-10 flex items-center justify-between px-4 text-white font-bold text-sm rounded-[6px] shadow-sm transform transition-all group-hover:scale-[1.02]"
                    style={{
                      width: `${100 - (i * 12)}%`,
                      backgroundColor: stage.color,
                    }}
                  >
                    <span>{stage.stage}</span>
                    <span>{stage.count}</span>
                  </div>
                </div>
                <div className="w-[60px] pl-4 text-left font-bold text-[#0F172A] text-sm">
                  {stage.pct === '100%' ? '100%' : `${safePct}%`}
                </div>
              </div>
            )})}
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="System Brokers & Admins" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4">Broker</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Role</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Email</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {(brokers||[]).slice(0,5).map((s: any, i: number) => (
                   <TableRow key={i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-4">
                       <span className="font-bold text-[14px] text-[#0F172A]">{s.name}</span>
                     </TableCell>
                     <TableCell className="text-[13px] font-bold text-[#0066FF]">{s.role}</TableCell>
                     <TableCell className="text-[14px] font-medium text-slate-600">{s.email}</TableCell>
                   </TableRow>
                 ))}
                 {(!brokers || brokers.length === 0) && (
                   <TableRow><TableCell colSpan={3} className="text-center py-6 text-slate-500">No brokers found</TableCell></TableRow>
                 )}
               </TableBody>
             </Table>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 7 - PROJECT-WISE PROGRESS */}
      <section>
        <SectionHeading title="Project-wise Progress & Status" />
        <div className="grid md:grid-cols-2 gap-6">
          {(projectsDb || []).map((p: any, i: number) => (
            <InteractivePearlCard key={i} className="p-6">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-[20px] font-bold text-[#0F172A] leading-tight mb-2">{p.name}</h3>
                   <div className="flex items-center gap-2">
                     <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[6px] text-[10px] font-bold uppercase"><MapPin className="w-3 h-3 mr-1"/>{p.location}</Badge>
                     <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-700 rounded-[6px] text-[10px] font-bold uppercase">{p.type || 'Project'}</Badge>
                   </div>
                 </div>
                 <div className="text-right flex flex-col items-end">
                    <span className="text-[32px] font-extrabold text-[#0F172A] leading-none">{p.completion_percentage}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Complete</span>
                 </div>
               </div>
               
               <Progress value={p.completion_percentage} className={`h-2 mb-6 ${p.completion_percentage > 90 ? 'bg-emerald-100 [&>div]:bg-[#10B981]' : p.completion_percentage > 50 ? 'bg-blue-100 [&>div]:bg-[#0066FF]' : 'bg-orange-100 [&>div]:bg-[#F59E0B]'}`} />

               <div className="grid grid-cols-2 gap-4 mb-2">
                 <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Budget Total</span>
                    <span className="text-[15px] font-bold text-[#0F172A]">₹{(p.budget_total).toLocaleString('en-IN')}</span>
                 </div>
                 <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Budget Spent</span>
                    <span className="text-[15px] font-bold text-[#0F172A]">₹{(p.budget_spent).toLocaleString('en-IN')}</span>
                 </div>
               </div>
            </InteractivePearlCard>
          ))}
          {(!projectsDb || projectsDb.length === 0) && (
            <div className="col-span-2 text-center py-10 text-slate-500">No projects found</div>
          )}
        </div>
      </section>

      {/* SECTION 9 - CASH FLOW TIMELINE */}
      <section className="pb-10">
        <SectionHeading title="Cash Flow — Last 6 Months" />
        <PearlCard className="p-6">
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={cashFlowData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
               <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
               <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
               <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
               
               <Bar dataKey="in" name="Cash Inflows" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
               <Bar dataKey="out" name="Cash Outflows" fill="#EF4444" radius={[0, 0, 4, 4]} barSize={24} />
               <Line type="monotone" dataKey="cumulative" name="Net Position" stroke="#0066FF" strokeWidth={3} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </PearlCard>
      </section>

    </div>
  )
}
