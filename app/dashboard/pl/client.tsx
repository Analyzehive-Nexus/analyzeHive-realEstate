import { EmptyState } from "@/components/ui/empty-state";
"use client"

import { Download, TrendingUp, TrendingDown, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { 
  ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
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

// --- CATEGORY MATCHING FOR PL ---
const revenueCategories = ['Flat Sales', 'Advance Bookings', 'Rental Income', 'Other Income'];
const cogsCategories = ['Construction Materials', 'Labour Costs', 'Equipment Costs', 'Subcontractor Costs', 'Construction'];
const opexCategories = ['Marketing', 'Staff Salaries', 'Admin & Office', 'Legal & Prof.', 'Equipment'];

export default function ProfitLossClient({ ledger }: { ledger: any[] }) {

  // Process ledger data into P&L structure
  const breakdown: any = {
    revenue: {},
    cogs: {},
    opex: {},
    belowLign: { Depreciation: 450000, Interest: 250000 } // keep mock for these 
  };
  
  let totalRevenue = 0;
  let totalCogs = 0;
  let totalOpex = 0;

  ledger?.forEach((t: any) => {
    if (t.status !== 'Approved') return;
    
    if (t.transaction_type === 'Income') {
       breakdown.revenue[t.category] = (breakdown.revenue[t.category] || 0) + t.amount;
       totalRevenue += t.amount;
    } else {
       if (cogsCategories.includes(t.category) || t.category === 'Materials' || t.category === 'Labour') {
         breakdown.cogs[t.category] = (breakdown.cogs[t.category] || 0) + t.amount;
         totalCogs += t.amount;
       } else {
         breakdown.opex[t.category] = (breakdown.opex[t.category] || 0) + t.amount;
         totalOpex += t.amount;
       }
    }
  });

  const grossProfit = totalRevenue - totalCogs;
  const ebitda = grossProfit - totalOpex;
  const taxProv = ebitda > 0 ? ebitda * 0.18 : 0;
  const netProfit = ebitda - taxProv - breakdown.belowLign.Depreciation - breakdown.belowLign.Interest;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  // Pie chart data
  const expenseBreakdownData = Object.entries(breakdown.opex).map(([name, value], i) => ({
    name,
    value: Math.round((value as number) / 100000), // In Lakhs
    fill: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5]
  }));

  // Fallbacks if db empty
  const plTrendData = [
    { month: "Apr 25", revenue: 6.2, cogs: 2.8, gp: 3.4 },
    { month: "May", revenue: 5.8, cogs: 2.6, gp: 3.2 },
    { month: "Jun", revenue: 7.1, cogs: 3.1, gp: 4.0 },
  ];

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Profit & Loss Statement</h1>
          <p className="text-slate-500 font-medium mt-1">Detailed financial performance across all projects.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-[12px] border border-[#E8ECF0] shadow-sm">
          {['This Month', 'This Quarter', 'This Year', 'Custom'].map(p => (
            <button
              key={p}
              className={`px-4 py-2 rounded-[8px] text-[13px] font-semibold transition-all ${
                p === 'This Year' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <Button variant="ghost" className="text-[#0066FF] hover:bg-blue-50 font-semibold text-[13px] rounded-[8px] h-[36px] px-3 gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* SECTION 1: FULL P&L TABLE */}
      <section>
        <PearlCard className="p-0 overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <tbody>
              {/* REVENUE HEADER */}
              <tr className="bg-green-50/50 border-b border-green-100">
                <td colSpan={2} className="px-6 py-4 font-bold text-green-700 tracking-widest uppercase text-xs">Revenue</td>
              </tr>
              {Object.entries(breakdown.revenue).map(([cat, val], i) => (
                <tr key={i} className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                  <td className="px-6 py-3 font-medium text-slate-600 pl-10">{cat}</td>
                  <td className="px-6 py-3 font-semibold text-right">{formatCurrency(val as number)}</td>
                </tr>
              ))}
              {Object.keys(breakdown.revenue).length === 0 && (
                <tr className="border-b border-[#E8ECF0]"><td colSpan={2} className="px-6 py-3 text-slate-500 text-center">No revenue recorded</td></tr>
              )}
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <td className="px-6 py-4 font-bold text-[#0F172A] text-[15px]">Total Revenue</td>
                <td className="px-6 py-4 font-bold text-[#10B981] text-[16px] text-right">{formatCurrency(totalRevenue)}</td>
              </tr>

              {/* COGS HEADER */}
              <tr className="bg-amber-50/50 border-b border-amber-100">
                <td colSpan={2} className="px-6 py-4 font-bold text-amber-700 tracking-widest uppercase text-xs">Cost of Goods Sold (COGS)</td>
              </tr>
              {Object.entries(breakdown.cogs).map(([cat, val], i) => (
                <tr key={i} className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                  <td className="px-6 py-3 font-medium text-slate-600 pl-10">{cat}</td>
                  <td className="px-6 py-3 font-semibold text-right">{formatCurrency(val as number)}</td>
                </tr>
              ))}
              {Object.keys(breakdown.cogs).length === 0 && (
                <tr className="border-b border-[#E8ECF0]"><td colSpan={2} className="px-6 py-3 text-slate-500 text-center">No COGS recorded</td></tr>
              )}
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <td className="px-6 py-4 font-bold text-[#0F172A] text-[15px]">Total COGS</td>
                <td className="px-6 py-4 font-bold text-[#F59E0B] text-[16px] text-right">{formatCurrency(totalCogs)}</td>
              </tr>

              {/* GROSS PROFIT HIGHLIGHT */}
              <tr className="bg-emerald-50 border-y-2 border-emerald-200">
                <td className="px-6 py-5 font-bold text-emerald-900 text-[16px] uppercase tracking-wide">Gross Profit</td>
                <td className="px-6 py-5 font-bold text-emerald-700 text-[20px] text-right">{formatCurrency(grossProfit)}</td>
              </tr>

              {/* OPEX HEADER */}
              <tr className="bg-red-50/50 border-b border-red-100">
                <td colSpan={2} className="px-6 py-4 font-bold text-red-700 tracking-widest uppercase text-xs">Operating Expenses (OpEx)</td>
              </tr>
              {Object.entries(breakdown.opex).map(([cat, val], i) => (
                <tr key={i} className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                  <td className="px-6 py-3 font-medium text-slate-600 pl-10">{cat}</td>
                  <td className="px-6 py-3 font-semibold text-right">{formatCurrency(val as number)}</td>
                </tr>
              ))}
              {Object.keys(breakdown.opex).length === 0 && (
                <tr className="border-b border-[#E8ECF0]"><td colSpan={2} className="px-6 py-3 text-slate-500 text-center">No OpEx recorded</td></tr>
              )}
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <td className="px-6 py-4 font-bold text-[#0F172A] text-[15px]">Total OpEx</td>
                <td className="px-6 py-4 font-bold text-[#EF4444] text-[16px] text-right">{formatCurrency(totalOpex)}</td>
              </tr>

              {/* EBITDA HIGHLIGHT */}
              <tr className="bg-indigo-50 border-y-2 border-indigo-200">
                <td className="px-6 py-5 font-bold text-indigo-900 text-[16px] uppercase tracking-wide">EBITDA</td>
                <td className="px-6 py-5 font-bold text-[#0066FF] text-[20px] text-right">{formatCurrency(ebitda)}</td>
              </tr>

              {/* BELOW THE LINE */}
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <td colSpan={2} className="px-6 py-4 font-bold text-slate-600 tracking-widest uppercase text-xs">Below The Line</td>
              </tr>
              <tr className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                <td className="px-6 py-3 font-medium text-slate-600 pl-10">Depreciation (Est)</td>
                <td className="px-6 py-3 font-semibold text-right">{formatCurrency(breakdown.belowLign.Depreciation)}</td>
              </tr>
              <tr className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                <td className="px-6 py-3 font-medium text-slate-600 pl-10">Interest Expense (Est)</td>
                <td className="px-6 py-3 font-semibold text-right">{formatCurrency(breakdown.belowLign.Interest)}</td>
              </tr>
              <tr className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                <td className="px-6 py-3 font-medium text-slate-600 pl-10">Tax Provision (18%)</td>
                <td className="px-6 py-3 font-semibold text-right">{formatCurrency(taxProv)}</td>
              </tr>
              
              {/* NET PROFIT HIGHLIGHT ROW */}
              <tr className="bg-[#10B981] text-white">
                <td className="px-6 py-6 font-black text-[22px] uppercase tracking-wider flex items-center gap-4">
                  Net Profit
                  <Badge className="bg-white/20 text-white border-white/30 text-[13px] hover:bg-white/30 px-3">{profitMargin}% Margin</Badge>
                </td>
                <td className="px-6 py-6 font-black text-[28px] text-right">{formatCurrency(netProfit)}</td>
              </tr>
            </tbody>
          </table>
        </PearlCard>
      </section>

      {/* SECTION 2: CHARTS */}
      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="12-Month P&L Trend" />
          <PearlCard className="flex-1 p-6 pr-10">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={plTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `₹${val}Cr`} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}Cr`} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
                
                <Bar dataKey="revenue" name="Total Revenue" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="cogs" name="COGS" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} />
                <Line type="monotone" dataKey="gp" name="Gross Profit" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="OpEx Breakdown (Lakhs)" />
          <PearlCard className="flex-1 p-6 flex flex-col items-center justify-center">
            {expenseBreakdownData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {expenseBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="w-full mt-4 space-y-2 max-h-[100px] overflow-auto">
                  {expenseBreakdownData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="font-medium text-slate-600">{item.name}</span>
                      </div>
                      <span className="font-bold text-[#0F172A]">₹{item.value}L</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
               <div className="flex h-full items-center justify-center text-slate-500 text-sm">No expenses to breakdown</div>
            )}
          </PearlCard>
        </div>
      </section>

    </div>
  )
}
