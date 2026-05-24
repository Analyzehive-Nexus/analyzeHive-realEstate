"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { 
  createFinancialTransaction, 
  deleteFinancialTransaction, 
  updateFinancialTransactionStatus,
  fetchFinancialTransactions
} from "@/app/construction/actions";

import { 
  Search, Plus, FileDown, Receipt, Calendar, Filter, MoreVertical, 
  Trash2, CheckCircle, Clock, AlertTriangle, Loader2, ArrowUpRight, ArrowDownRight, Edit 
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  BarChart, Bar, AreaChart, Area, ComposedChart, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

// CATEGORY MASTER ALLOCATIONS & BUDGET DEFINITIONS
const CATEGORY_BUDGETS: Record<string, number> = {
  "Civil Work": 8500000,
  "Steel & Structure": 4500000,
  "Electrical": 1200000,
  "Plumbing": 800000,
  "Finishing": 2200000,
  "Equip & Rentals": 1500000,
  "Hardware": 300000,
  "Construction": 15000000,
  "Marketing": 1500000,
  "Salaries": 3000000,
  "Equipment": 2500000,
  "Admin": 500000,
};

const formatCurLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;
const formatCur = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

export default function BudgetClient({ initialTransactions }: { initialTransactions: any[] }) {
  const { toast } = useToast();
  const [localTransactions, setLocalTransactions] = useState<any[]>(initialTransactions);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Dialog State
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCategory, setNewCategory] = useState("Civil Work");
  const [newVendor, setNewVendor] = useState("");
  const [newInvoiceNumber, setNewInvoiceNumber] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Reload transactions
  const reloadData = async () => {
    const fresh = await fetchFinancialTransactions();
    if (fresh.success && fresh.data) {
      setLocalTransactions(fresh.data);
    }
  };

  // Log Expense Transaction
  const handleLogExpense = async () => {
    const amt = parseFloat(newAmount);
    if (!newCategory || !newVendor || !newDate || isNaN(amt) || amt <= 0 || !newDescription) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and provide a valid positive amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const res = await createFinancialTransaction(
      newCategory,
      amt,
      newVendor,
      newInvoiceNumber,
      newDescription,
      newDate
    );
    setIsSubmitting(false);

    if (res.error) {
      toast({
        title: "Submission Error",
        description: res.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Expense Logged",
        description: "New construction expense transaction has been successfully recorded!"
      });
      setIsLogExpenseOpen(false);
      
      // Reset Form
      setNewVendor("");
      setNewInvoiceNumber("");
      setNewAmount("");
      setNewDescription("");
      
      // Reload UI
      await reloadData();
    }
  };

  // Toggle approval status
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Approved" ? "Pending" : "Approved";
    const res = await updateFinancialTransactionStatus(id, nextStatus);
    if (res.error) {
      toast({
        title: "Update Failed",
        description: res.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Status Updated",
        description: `Transaction status has been set to ${nextStatus}.`
      });
      await reloadData();
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this transaction from the financial ledger?")) return;

    const res = await deleteFinancialTransaction(id);
    if (res.error) {
      toast({
        title: "Delete Failed",
        description: res.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been permanently deleted."
      });
      await reloadData();
    }
  };

  // ----------------------------------------------------
  // CALCULATIONS ENGINE (DYNAMICAL BUDGET VS SPENT MATH)
  // ----------------------------------------------------

  // Group approved expenses from database by category
  const categorySpentSums: Record<string, number> = {};
  localTransactions.forEach(tx => {
    if (tx.transaction_type === "Expense" && tx.status === "Approved") {
      const cat = tx.category || "General";
      categorySpentSums[cat] = (categorySpentSums[cat] || 0) + Number(tx.amount || 0);
    }
  });

  // Compile full dynamic budget allocation rows
  const activeCategories = Array.from(new Set([
    ...Object.keys(CATEGORY_BUDGETS),
    ...Object.keys(categorySpentSums)
  ])).filter(Boolean);

  const budgetData = activeCategories.map(cat => {
    const budget = CATEGORY_BUDGETS[cat] || 1000000; // default to 10 Lakhs if not preset
    const spent = categorySpentSums[cat] || 0;
    const remaining = budget - spent;
    const pct = Math.round(budget > 0 ? (spent / budget) * 100 : 0);
    
    let status = "On Track";
    if (pct > 100) status = "Over Budget";
    else if (pct > 85) status = "Warning";

    return { cat, b: budget, s: spent, r: remaining, pct, status };
  }).sort((a, b) => b.b - a.b); // sort by largest budget allocations first

  // KPIs Calculations
  const totalBudget = budgetData.reduce((acc, row) => acc + row.b, 0);
  const totalSpent = budgetData.reduce((acc, row) => acc + row.s, 0);
  const totalRemaining = totalBudget - totalSpent;
  const burnRatePercentage = totalBudget > 0 ? Number(((totalSpent / totalBudget) * 100).toFixed(1)) : 0;

  // Monthly trend chart dynamic calculator
  const monthsOrder = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  const monthSums: Record<string, Record<string, number>> = {};
  monthsOrder.forEach(m => {
    monthSums[m] = { "Civil Work": 0, "Steel & Structure": 0, "Electrical": 0, "Plumbing": 0, "Finishing": 0, "Equip & Rentals": 0, "Construction": 0, "Marketing": 0 };
  });

  localTransactions.forEach(t => {
    if (t.transaction_type !== 'Expense' || t.status !== 'Approved') return;
    const d = new Date(t.transaction_date);
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    if (monthSums[monthName]) {
      const cat = t.category;
      if (monthSums[monthName][cat] === undefined) {
        monthSums[monthName][cat] = 0;
      }
      monthSums[monthName][cat] += (Number(t.amount || 0) / 100000); // Lakhs
    }
  });

  const dynamicMonthlyTrend = monthsOrder.map(m => {
    const sums = monthSums[m];
    return {
      month: m,
      Civil: Number((sums["Civil Work"] || 0).toFixed(1)),
      Steel: Number((sums["Steel & Structure"] || 0).toFixed(1)),
      Elec: Number((sums["Electrical"] || 0).toFixed(1)),
      Plumb: Number((sums["Plumbing"] || 0).toFixed(1)),
      Fin: Number((sums["Finishing"] || 0).toFixed(1)),
      Equip: Number(((sums["Equip & Rentals"] || 0) + (sums["Equipment"] || 0) + (sums["Construction"] || 0)).toFixed(1)),
    };
  });

  // Apply filters on Transaction List
  const filteredTx = localTransactions.filter(tx => {
    const matchSearch = !searchTerm || 
      (tx.desc && tx.desc.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (tx.vendor && tx.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.invoice_number && tx.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCategory = filterCategory === "all" || tx.category === filterCategory;
    const matchStatus = filterStatus === "all" || tx.status === filterStatus;
    const matchDate = !filterDate || (tx.transaction_date && tx.transaction_date.split('T')[0] === filterDate);

    return matchSearch && matchCategory && matchStatus && matchDate;
  });

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#0F172A]">Budget vs Actual</h1>
          <p className="text-sm text-slate-500">Track project finances, category-wise expenditure, and expense history from real database entries.</p>
        </div>
        <Button 
          onClick={() => setIsLogExpenseOpen(true)}
          className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2 h-10 px-5"
        >
          <Plus className="w-4 h-4" /> Log Expense
        </Button>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#0066FF]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Budget</p>
            <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight">{formatCur(totalBudget)}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Spent</p>
            <h3 className="text-[32px] font-bold text-[#F59E0B] leading-tight">{formatCur(totalSpent)}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Remaining</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">{formatCur(totalRemaining)}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Burn Rate Percentage</p>
            <div className="flex items-center gap-3">
              <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight">{burnRatePercentage}%</h3>
              <Badge className="bg-red-50 text-red-700 hover:bg-red-50 shadow-none border-none text-[10px] font-bold uppercase">Target 85%</Badge>
            </div>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* SECTION 1: BUDGET VS SPENT TRACKING */}
      <section className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col">
          <SectionHeading title="Category Allocation Tracker" />
          <PearlCard className="flex-1">
             <ResponsiveTable>
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
             </ResponsiveTable>
          </PearlCard>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="Expenditure Overview" />
          <PearlCard className="flex-1 p-6 flex items-center justify-center">
            <div className="w-full h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={budgetData.map(d => ({ ...d, b: d.b/100000, s: d.s/100000 })).slice(0, 7)} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8ECF0" />
                  <YAxis dataKey="cat" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={80} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(val: number) => `₹${val.toFixed(1)}L`} />
                  <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }} />
                  <Bar dataKey="b" name="Budgeted" fill="#0066FF" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="s" name="Spent" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={12} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 2: MONTHLY SPEND BREAKDOWN */}
      <section>
         <SectionHeading title="Monthly Spend Breakdown (Lakhs)" />
         <PearlCard className="p-6">
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dynamicMonthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(v) => `₹${v}L`} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v) => `₹${v}L`} />
                     <Legend verticalAlign="top" align="center" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                     <Area type="monotone" dataKey="Civil" name="Civil" stackId="1" stroke="#0066FF" fill="#0066FF" fillOpacity={0.4} />
                     <Area type="monotone" dataKey="Steel" name="Steel" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
                     <Area type="monotone" dataKey="Elec" name="Electrical" stackId="1" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                     <Area type="monotone" dataKey="Plumb" name="Plumbing" stackId="1" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.4} />
                     <Area type="monotone" dataKey="Fin" name="Finishing" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.4} />
                     <Area type="monotone" dataKey="Equip" name="Equip & Rentals" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </PearlCard>
      </section>

      {/* SECTION 3: EXPENSE LOGS */}
      <section className="space-y-4">
        <SectionHeading title="Recent Expense Transactions" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
          <div className="flex flex-1 flex-wrap gap-4 items-center w-full">
            <div className="relative w-full max-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search vendor, description, inv..." 
                className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px] bg-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative w-[180px]">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
               <Input 
                 type="date" 
                 value={filterDate}
                 onChange={(e) => setFilterDate(e.target.value)}
                 className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px] text-sm text-slate-600 bg-white" 
               />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px] bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Categories</SelectItem>
                {activeCategories.map((cat, idx) => (
                  <SelectItem key={idx} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Any Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TRANSACTION DIALOG EXPENSE FORM */}
        <Dialog open={isLogExpenseOpen} onOpenChange={setIsLogExpenseOpen}>
          <DialogContent className="sm:max-w-[550px] bg-white border border-slate-100 shadow-2xl rounded-[24px]">
            <DialogHeader className="border-b border-[#F1F5F9] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                  <Receipt className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <DialogTitle className="text-lg font-bold text-[#0F172A]">Log New Construction Expense</DialogTitle>
                  <p className="text-[11px] text-slate-500 mt-0.5">Persist transaction details directly into database ledger.</p>
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-left">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</Label>
                   <Input 
                     type="date" 
                     className="rounded-[8px] bg-white" 
                     value={newDate}
                     onChange={(e) => setNewDate(e.target.value)}
                   />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</Label>
                   <Select value={newCategory} onValueChange={setNewCategory}>
                     <SelectTrigger className="rounded-[8px] bg-white"><SelectValue /></SelectTrigger>
                     <SelectContent className="bg-white">
                       {Object.keys(CATEGORY_BUDGETS).map((cat, idx) => (
                         <SelectItem key={idx} value={cat}>{cat}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor / Payee</Label>
                   <Input 
                     placeholder="e.g. Rajhans Cement Co." 
                     className="rounded-[8px] bg-white" 
                     value={newVendor}
                     onChange={(e) => setNewVendor(e.target.value)}
                   />
                 </div>
                 <div className="space-y-1.5">
                   <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Number</Label>
                   <Input 
                     placeholder="e.g. INV-2026-99" 
                     className="rounded-[8px] bg-white" 
                     value={newInvoiceNumber}
                     onChange={(e) => setNewInvoiceNumber(e.target.value)}
                   />
                 </div>
                 <div className="space-y-1.5 col-span-2">
                   <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (₹)</Label>
                   <Input 
                     type="number" 
                     placeholder="e.g. 250000" 
                     className="rounded-[8px] h-12 text-lg font-bold text-[#0F172A] bg-white" 
                     value={newAmount}
                     onChange={(e) => setNewAmount(e.target.value)}
                   />
                 </div>
                 <div className="space-y-1.5 col-span-2">
                   <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                   <Textarea 
                     placeholder="What was purchased or paid for?" 
                     rows={3} 
                     className="rounded-[8px] bg-white" 
                     value={newDescription}
                     onChange={(e) => setNewDescription(e.target.value)}
                   />
                 </div>
               </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 border-t border-[#F1F5F9] pt-4">
              <Button 
                variant="outline" 
                className="rounded-[10px] h-10 font-semibold text-slate-600 hover:bg-slate-50" 
                onClick={() => setIsLogExpenseOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] h-10 font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center"
                onClick={handleLogExpense}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-1.5" />
                    Logging Expense...
                  </>
                ) : (
                  "Log Construction Expense"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* LEDGER TRANSACTIONS GRID */}
        <PearlCard>
          <ResponsiveTable>
            <Table>
              <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Description & Category</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Vendor / Invoice</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Amount</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTx.map((tx) => {
                  const rawDate = tx.transaction_date || tx.created_at;
                  const formattedDate = rawDate
                    ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : "Unknown";

                  return (
                    <TableRow key={tx.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                      <TableCell className="py-4">
                        <div className="font-bold text-[13px] text-[#0066FF] hover:underline cursor-pointer truncate max-w-[120px]">{tx.id.substring(0, 8)}</div>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">{formattedDate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-[14px] text-[#0F172A]">{tx.description || tx.desc || "Construction Expense"}</div>
                        <Badge variant="outline" className="text-[9px] bg-slate-50 mt-1.5 uppercase font-bold text-slate-500 border-slate-200">{tx.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-[13px] text-slate-700">{tx.vendor || "Direct Payment"}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">{tx.invoice_number || tx.inv || "N/A"}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-black text-[15px] text-[#0F172A]">{formatCur(tx.amount || tx.amt)}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        {tx.status === 'Approved' ? (
                           <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 shadow-none text-[10px] font-bold uppercase rounded-[4px] border border-emerald-200">Approved</Badge>
                        ) : (
                           <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 shadow-none text-[10px] font-bold uppercase rounded-[4px] border border-amber-200">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-full">
                               <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white border border-slate-100 shadow-md rounded-[8px] p-1 w-44 z-50">
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(tx.id, tx.status)}
                              className="text-xs font-bold text-slate-700 hover:bg-slate-50 focus:bg-slate-50 p-2 rounded-[6px] flex gap-2 cursor-pointer"
                            >
                              {tx.status === "Approved" ? (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>Mark Pending</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>Approve Ledger</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="text-xs font-bold text-red-600 hover:bg-red-50 focus:bg-red-50 p-2 rounded-[6px] flex gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span>Delete Record</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ResponsiveTable>
          
          {filteredTx.length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-white font-medium text-sm">
              No transactions match current filtering criteria.
            </div>
          )}
        </PearlCard>
      </section>
    </div>
  );
}
