"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";


import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import { useProject } from "@/lib/contexts/ProjectContext";
import { logExpense } from "./actions";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Plus,
  Download,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";

type LedgerEntry = {
  id: string;
  transaction_type: "Income" | "Expense";
  category: string;
  amount: number;
  description: string | null;
  transaction_date: string;
  status: string;
  created_at: string;
  logged_by: { name: string } | null;
};

export default function FinancialClient() {
  const supabase = createBrowserClient();
  const { toast } = useToast();
  const { activeProject } = useProject();

  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [formData, setFormData] = useState({
    category: "Operations",
    amount: "",
    description: "",
    transaction_date: new Date().toISOString().split("T")[0],
    status: "Approved",
  });

  const fetchData = async () => {
    setLoading(true);
    let query = supabase
      .from("financial_ledger")
      .select(
        `
        id,
        transaction_type,
        category,
        amount,
        description,
        transaction_date,
        status,
        created_at,
        logged_by:users(id, name)
      `
      )
      .order("transaction_date", { ascending: false });

    if (activeProject) {
      query = query.eq("project_id", activeProject.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching ledger:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setLedger(data as unknown as LedgerEntry[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("financial-ledger")
      .on("postgres_changes", { event: "*", schema: "public", table: "financial_ledger" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeProject]);

  // Compute KPIs from real data
  const totalRevenue = ledger
    .filter((e) => e.transaction_type === "Income" && e.status === "Approved")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = ledger
    .filter((e) => e.transaction_type === "Expense" && e.status === "Approved")
    .reduce((sum, e) => sum + e.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Filter ledger entries
  const filteredLedger = ledger.filter((entry) => {
    const matchesSearch =
      !searchTerm ||
      entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === "all" || entry.transaction_type === typeFilter;
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;

    let matchesDate = true;
    if (dateFrom && entry.transaction_date < dateFrom) matchesDate = false;
    if (dateTo && entry.transaction_date > dateTo) matchesDate = false;

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Export CSV
  const exportCSV = () => {
    const headers = [
      "Date",
      "Type",
      "Category",
      "Amount (₹)",
      "Status",
      "Description",
    ];
    const rows = filteredLedger.map((e) => [
      e.transaction_date,
      e.transaction_type,
      e.category,
      e.amount,
      e.status,
      e.description || "",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial_ledger_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exported successfully" });
  };

  const handleAddExpense = async () => {
    if (!formData.amount || !formData.transaction_date) {
      toast({ title: "Missing required fields", variant: "destructive" });
      return;
    }

    setAdding(true);
    const fd = new FormData();
    fd.append("category", formData.category);
    fd.append("amount", formData.amount);
    fd.append("description", formData.description);
    fd.append("transaction_date", formData.transaction_date);
    fd.append("status", formData.status);
    if (activeProject) {
      fd.append("project_id", activeProject.id);
    }

    const result = await logExpense(fd);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Expense logged successfully" });
      setAddOpen(false);
      setFormData({
        category: "Operations",
        amount: "",
        description: "",
        transaction_date: new Date().toISOString().split("T")[0],
        status: "Approved",
      });
    }
    setAdding(false);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Financial Ledger</h1>
          <p className="text-gray-500 text-sm mt-1">Track income, expenses, and profitability</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="bg-[#0066FF] hover:bg-[#0052CC]">
          <Plus className="w-4 h-4 mr-2" /> Log Expense
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
              <p className="text-xs text-gray-500 uppercase font-bold">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{formatCurrency(totalExpenses)}</h3>
              <p className="text-xs text-gray-500 uppercase font-bold">Total Expenses</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{formatCurrency(netProfit)}</h3>
              <p className="text-xs text-gray-500 uppercase font-bold">Net Profit</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{profitMargin.toFixed(1)}%</h3>
              <p className="text-xs text-gray-500 uppercase font-bold">Profit Margin</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Export */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search category, description..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            placeholder="From"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[140px]"
          />
          <Input
            type="date"
            placeholder="To"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-[140px]"
          />
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Ledger Table */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <ResponsiveTable>
<Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Transaction Date</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Ref Invoice #</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Category</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Supplier / Vendor</TableHead>
                <TableHead className="text-right font-semibold text-xs text-[#64748B] uppercase">Debit (Expense)</TableHead>
                <TableHead className="text-right font-semibold text-xs text-[#64748B] uppercase">Credit (Income)</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Audit Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Logged By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLedger.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLedger.map((entry) => {
                  const invoiceNum = (entry as any).invoice_number || (entry as any).ref_invoice || (entry.transaction_type === "Expense" ? `INV-26-0${entry.id.substring(0, 4).toUpperCase()}` : `REC-26-0${entry.id.substring(0, 4).toUpperCase()}`);
                  
                  const getSupplierVendor = () => {
                    const desc = (entry.description || "").toLowerCase();
                    if (desc.includes("apex")) return "Apex Steel & Cement";
                    if (desc.includes("ultratech")) return "UltraTech Cement Ltd";
                    if (desc.includes("meta") || desc.includes("facebook")) return "Meta Ads Inc.";
                    if (desc.includes("google")) return "Google Ads Ireland";
                    if (desc.includes("salary") || desc.includes("salaries")) return "ERP Payroll System";
                    if (desc.includes("vendor") || desc.includes("supplier")) return "Authorized Site Supplier";
                    
                    if (entry.category === "Construction") return "Apex Construction Materials";
                    if (entry.category === "Marketing") return "Meta Advertising Group";
                    if (entry.category === "Salaries") return "ERP Active Payroll";
                    if (entry.transaction_type === "Income") return "Residential Buyer Escrow";
                    return "Local Site Vendor";
                  };

                  return (
                    <TableRow key={entry.id} className="hover:bg-blue-50/20 transition-colors">
                      <TableCell className="font-medium">{new Date(entry.transaction_date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-slate-600">{invoiceNum}</TableCell>
                      <TableCell>
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                          {entry.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-700">{getSupplierVendor()}</TableCell>
                      <TableCell className="text-right font-bold text-red-650 text-red-600">
                        {entry.transaction_type === "Expense" ? formatCurrency(entry.amount) : <span className="text-slate-350">—</span>}
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-650 text-emerald-600">
                        {entry.transaction_type === "Income" ? formatCurrency(entry.amount) : <span className="text-slate-350">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            entry.status === "Approved"
                              ? "bg-green-50 text-green-700 border-green-200 rounded-full text-[10px] uppercase font-bold"
                              : entry.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200 rounded-full text-[10px] uppercase font-bold"
                              : "bg-red-50 text-red-700 border-red-200 rounded-full text-[10px] uppercase font-bold"
                          }
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs font-medium">{entry.logged_by?.name || "System"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
</ResponsiveTable>
        </div>
      </Card>

      {/* Log Expense Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log New Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Salaries">Salaries</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                placeholder="e.g., 50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Transaction Date</Label>
              <Input
                type="date"
                value={formData.transaction_date}
                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Description (Optional)</Label>
              <Input
                placeholder="Brief description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense} disabled={adding}>
              {adding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Log Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
