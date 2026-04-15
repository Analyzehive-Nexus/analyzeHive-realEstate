"use client"

import { useState } from "react"
import { 
  IndianRupee, TrendingUp, TrendingDown, PieChart as PieIcon, 
  Search, Plus, FileDown, Receipt, Calendar, Filter, MoreVertical, Building2, Upload
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

import { 
  BarChart, Bar, AreaChart, Area, ComposedChart, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts"

// MOCK DATA
const budgetData = [
  { cat: "Civil Work", b: 8500000, s: 7230000, r: 1270000, pct: 85, status: "On Track" },
  { cat: "Steel & Structure", b: 4500000, s: 3850000, r: 650000, pct: 86, status: "Warning" },
  { cat: "Electrical", b: 1200000, s: 420000, r: 780000, pct: 35, status: "On Track" },
  { cat: "Plumbing", b: 800000, s: 310000, r: 490000, pct: 39, status: "On Track" },
  { cat: "Finishing", b: 2200000, s: 280000, r: 1920000, pct: 13, status: "On Track" },
  { cat: "Equip & Rentals", b: 1500000, s: 1550000, r: -50000, pct: 103, status: "Over Budget" },
];

const monthlyTrend = [
  { month: "Oct", Civil: 12, Steel: 8, Elec: 1, Plumb: 0.5, Fin: 0, Equip: 2 },
  { month: "Nov", Civil: 15, Steel: 10, Elec: 1.5, Plumb: 1, Fin: 0, Equip: 2.5 },
  { month: "Dec", Civil: 18, Steel: 8, Elec: 2, Plumb: 1, Fin: 0.5, Equip: 3 },
  { month: "Jan", Civil: 14, Steel: 5, Elec: 3, Plumb: 2, Fin: 1, Equip: 2.8 },
  { month: "Feb", Civil: 10, Steel: 4, Elec: 4, Plumb: 2, Fin: 3, Equip: 2.5 },
  { month: "Mar", Civil: 8, Steel: 3, Elec: 5, Plumb: 3, Fin: 4, Equip: 2 },
];

const txHistory = [
  { id: "EXP-015", date: "Mar 18", cat: "Civil Work", desc: "RMC Payment - Foundation C", vendor: "Rajhans Cement Co.", amt: 250000, inv: "INV-2026-99", status: "Approved" },
  { id: "EXP-014", date: "Mar 15", cat: "Equip & Rentals", desc: "Crane Rental - Tower B", vendor: "PowerGen Rentals", amt: 75000, inv: "INV-RNT-42", status: "Approved" },
  { id: "EXP-013", date: "Mar 12", cat: "Steel & Structure", desc: "TMT Bars 12mm", vendor: "Steel Plus Pvt Ltd", amt: 120000, inv: "INV-ST-198", status: "Approved" },
  { id: "EXP-012", date: "Mar 10", cat: "Civil Work", desc: "Red Bricks - 8500pcs", vendor: "City Brick Works", amt: 68000, inv: "INV-CBW-05", status: "Approved" },
  { id: "EXP-011", date: "Mar 08", cat: "Plumbing", desc: "PVC Pipes Bulk", vendor: "AquaTech Plumbing", amt: 45000, inv: "INV-AQ-88", status: "Pending" },
  { id: "EXP-010", date: "Mar 05", cat: "Electrical", desc: "Wires & Conduits", vendor: "Vidyut Electricals", amt: 32000, inv: "INV-VE-12", status: "Approved" },
  { id: "EXP-009", date: "Mar 02", cat: "Finishing", desc: "Ceramic Tiles - Tower A", vendor: "Surya Ceramics", amt: 110000, inv: "INV-SC-44", status: "Approved" },
  { id: "EXP-008", date: "Feb 28", cat: "Equip & Rentals", desc: "Excavator Fuel + Maintenance", vendor: "TechMech Services", amt: 24000, inv: "INV-TM-09", status: "Approved" },
  { id: "EXP-007", date: "Feb 25", cat: "Civil Work", desc: "River Sand - 50 tons", vendor: "Kaveri Sand", amt: 85000, inv: "INV-KS-112", status: "Approved" },
  { id: "EXP-006", date: "Feb 20", cat: "Hardware", desc: "Nails & Consumables", vendor: "FastFix Hardware", amt: 15000, inv: "INV-FF-04", status: "Approved" },
  { id: "EXP-005", date: "Feb 18", cat: "Steel & Structure", desc: "Binding Wire", vendor: "Steel Plus Pvt Ltd", amt: 28000, inv: "INV-ST-190", status: "Approved" },
  { id: "EXP-004", date: "Feb 15", cat: "Civil Work", desc: "Raft Foundation Labour", vendor: "Site Payment", amt: 150000, inv: "VCH-02-15", status: "Approved" },
  { id: "EXP-003", date: "Feb 10", cat: "Plumbing", desc: "Fittings Assorted", vendor: "AquaTech Plumbing", amt: 12000, inv: "INV-AQ-81", status: "Approved" },
  { id: "EXP-002", date: "Feb 05", cat: "Electrical", desc: "Temporary DB Boards", vendor: "Vidyut Electricals", amt: 40000, inv: "INV-VE-08", status: "Approved" },
  { id: "EXP-001", date: "Feb 01", cat: "Equip & Rentals", desc: "Mixer Service", vendor: "In-house", amt: 5000, inv: "VCH-02-01", status: "Approved" },
];

const formatCurLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;
const formatCur = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function BudgetPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTx = txHistory.filter(tx => 
    tx.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Budget vs Actual</h1>
        <p className="text-sm text-slate-500">Track project finances, category-wise expenditure, and expense history.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#0066FF]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Budget</p>
            <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight flex items-center gap-2">₹4.80Cr</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Spent</p>
            <h3 className="text-[32px] font-bold text-[#F59E0B] leading-tight flex items-center gap-2">₹3.93Cr</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Remaining</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">₹87L</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Burn Rate Target: 85%</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight flex items-center gap-2">81.9%</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* SECTION 1: BUDGET VS SPENT TRACKING */}
      <section className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col">
          <SectionHeading title="Category Allocation Tracker" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-xs text-[#64748B] uppercase py-4">Expense Category</TableHead>
                   <TableHead className="text-xs text-[#64748B] uppercase">Budget</TableHead>
                   <TableHead className="text-xs text-[#64748B] uppercase">Spent</TableHead>
                   <TableHead className="text-xs text-[#64748B] uppercase text-right">Remaining</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {budgetData.map((b, i) => (
                   <TableRow key={i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                     <TableCell className="py-4 w-2/5">
                        <div className="flex items-center justify-between mb-2">
                           <span className="font-bold text-[14px] text-[#0F172A]">{b.cat}</span>
                           <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-[4px] border ${b.status === 'On Track' ? 'text-[#10B981] bg-emerald-50 border-emerald-200' : b.status === 'Warning' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200'}`}>{b.status}</span>
                        </div>
                        <div className="flex items-center gap-3 w-full">
                           <Progress value={b.pct} className={`h-2 flex-1 ${b.pct > 100 ? 'bg-red-100 [&>div]:bg-red-600' : b.pct > 80 ? 'bg-amber-100 [&>div]:bg-amber-500' : 'bg-emerald-100 [&>div]:bg-[#10B981]'}`} />
                           <span className="text-[11px] font-bold text-slate-500 w-8">{b.pct}%</span>
                        </div>
                     </TableCell>
                     <TableCell className="py-4 font-bold text-[14px] text-slate-600">{formatCurLakhs(b.b)}</TableCell>
                     <TableCell className="py-4 font-bold text-[14px] text-[#0F172A]">{formatCurLakhs(b.s)}</TableCell>
                     <TableCell className="py-4 text-right">
                        <span className={`font-bold text-[14px] ${b.r < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                           {b.r < 0 ? `-${formatCurLakhs(Math.abs(b.r))}` : formatCurLakhs(b.r)}
                        </span>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="Expenditure Overview" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={budgetData.map(d => ({ ...d, b: d.b/100000, s: d.s/100000 }))} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8ECF0" />
                <YAxis dataKey="cat" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={80} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(val: number) => `₹${val.toFixed(1)}L`} />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }} />
                <Bar dataKey="b" name="Budgeted" fill="#0066FF" radius={[0, 4, 4, 0]} barSize={16} />
                <Bar dataKey="s" name="Spent" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={16} />
              </ComposedChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 2: MONTHLY SPEND BREAKDOWN */}
      <section>
         <SectionHeading title="Monthly Spend Breakdown (Lakhs)" />
         <PearlCard className="p-6">
            <div className="flex justify-start mb-6 gap-2">
               <Badge className="bg-blue-100 text-[#0066FF] hover:bg-blue-100 border-[#0066FF] shadow-none cursor-pointer">Civil Work</Badge>
               <Badge className="bg-amber-100 text-[#F59E0B] hover:bg-amber-100 border-[#F59E0B] shadow-none cursor-pointer">Steel</Badge>
               <Badge className="bg-indigo-100 text-indigo-500 hover:bg-indigo-100 border-indigo-500 shadow-none cursor-pointer">Electrical</Badge>
               <Badge className="bg-rose-100 text-rose-500 hover:bg-rose-100 border-rose-500 shadow-none cursor-pointer">Plumbing</Badge>
            </div>
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(v) => `₹${v}L`} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v) => `₹${v}L`} />
                     <Area type="monotone" dataKey="Civil" stackId="1" stroke="#0066FF" fill="#0066FF" fillOpacity={0.8} />
                     <Area type="monotone" dataKey="Steel" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
                     <Area type="monotone" dataKey="Elec" stackId="1" stroke="#6366F1" fill="#6366F1" fillOpacity={0.8} />
                     <Area type="monotone" dataKey="Plumb" stackId="1" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.8} />
                     <Area type="monotone" dataKey="Equip" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </PearlCard>
      </section>

      {/* SECTION 3: EXPENSE LOGS */}
      <section className="space-y-4">
        <SectionHeading title="Recent Expense Transactions" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
          <div className="flex flex-1 gap-4 items-center w-full">
            <div className="relative w-full max-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search description, vendor..." 
                className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-[180px]">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input type="date" defaultValue="2026-03-01" className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px] text-sm text-slate-500" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="civil">Civil Work</SelectItem>
                <SelectItem value="steel">Steel & Structure</SelectItem>
                <SelectItem value="elec">Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2">
                <Plus className="w-4 h-4" /> Log Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Log New Expense</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>Date</Label>
                     <Input type="date" className="rounded-[8px]" defaultValue="2026-03-18" />
                   </div>
                   <div className="space-y-2">
                     <Label>Category</Label>
                     <Select>
                       <SelectTrigger className="rounded-[8px]"><SelectValue placeholder="Select" /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="c1">Civil Work</SelectItem>
                         <SelectItem value="c2">Electrical</SelectItem>
                         <SelectItem value="c3">Equip & Rentals</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label>Vendor / Payee</Label>
                     <Input placeholder="Enter vendor name" className="rounded-[8px]" />
                   </div>
                   <div className="space-y-2">
                     <Label>Invoice Number</Label>
                     <Input placeholder="INV-..." className="rounded-[8px]" />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Amount (₹)</Label>
                     <Input type="number" placeholder="0.00" className="rounded-[8px] h-12 text-lg font-bold text-[#0F172A]" />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Description</Label>
                     <Textarea placeholder="What was purchased or paid for?" rows={2} className="rounded-[8px]" />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Upload Invoice/Receipt (Optional)</Label>
                     <div className="border border-dashed border-[#E8ECF0] rounded-[8px] p-4 flex justify-center items-center bg-slate-50 text-slate-500 text-sm hover:bg-slate-100 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 mr-2" /> Upload Document
                     </div>
                   </div>
                 </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-[8px] font-semibold">Cancel</Button>
                <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] font-bold">Submit Expense</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Transaction ID</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Description & Cat</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Vendor</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Amount</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTx.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[13px] text-[#0066FF] hover:underline cursor-pointer">{tx.id}</div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">{tx.date}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{tx.desc}</div>
                    <Badge variant="outline" className="text-[9px] bg-slate-50 mt-1 uppercase font-bold text-slate-500 border-slate-200">{tx.cat}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-[13px] text-slate-700">{tx.vendor}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{tx.inv}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-black text-[15px] text-[#0F172A]">{formatCur(tx.amt)}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    {tx.status === 'Approved' ? (
                       <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 shadow-none text-[10px] font-bold uppercase rounded-[4px] border border-emerald-200">Approved</Badge>
                    ) : (
                       <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 shadow-none text-[10px] font-bold uppercase rounded-[4px] border border-amber-200">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0066FF] hover:bg-blue-50">
                       <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

    </div>
  )
}
