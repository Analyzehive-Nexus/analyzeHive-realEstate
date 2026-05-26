"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";

import { useState, useEffect } from "react";
import { getPnLData, Period, PnLData } from "./actions";
import {
  Download,
  Loader2,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Scale,
  Receipt,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProfitLossPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [cache, setCache] = useState<Record<Period, PnLData | null>>({
    month: null,
    quarter: null,
    year: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        // Fetch month first to render the page as fast as possible
        const monthData = await getPnLData("month");
        setCache((prev) => ({ ...prev, month: monthData }));
        setLoading(false);

        // Fetch remaining periods in the background silently
        getPnLData("quarter")
          .then((qData) => {
            setCache((prev) => ({ ...prev, quarter: qData }));
          })
          .catch((err) => console.error("Error prefetching quarter data:", err));

        getPnLData("year")
          .then((yData) => {
            setCache((prev) => ({ ...prev, year: yData }));
          })
          .catch((err) => console.error("Error prefetching year data:", err));
      } catch (error) {
        console.error("Failed to load initial P&L data:", error);
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handlePeriodChange = async (newPeriod: Period) => {
    setPeriod(newPeriod);
    if (!cache[newPeriod]) {
      setLoading(true);
      try {
        const result = await getPnLData(newPeriod);
        setCache((prev) => ({ ...prev, [newPeriod]: result }));
      } catch (error) {
        console.error(`Failed to fetch P&L data for ${newPeriod}:`, error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const data = cache[period];

  const exportCSV = () => {
    if (!data) return;
    const rows = data.transactions.map((t) => [
      t.date,
      t.type,
      t.category,
      t.amount,
      t.description || "",
    ]);
    const csvContent = [
      ["Date", "Type", "Category", "Amount (₹)", "Description"],
      ...rows,
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pnl_${period}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  const { totalIncome, totalExpenses, grossProfit, tax, netProfit, transactions } = data;

  // Verify math
  const calculatedGross = totalIncome - totalExpenses;
  const calculatedTax = calculatedGross * 0.18;
  const calculatedNet = calculatedGross - calculatedTax;

  // These should match the returned values
  const mathValid =
    Math.abs(calculatedGross - grossProfit) < 1 &&
    Math.abs(calculatedTax - tax) < 1 &&
    Math.abs(calculatedNet - netProfit) < 1;

  return (
    <div className="p-6 md:p-8 w-full max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header with period filter and export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Profit & Loss Statement</h1>
          <p className="text-gray-500 text-sm mt-1">
            Income, expenses, and net profit calculation with applicable taxes
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={period} onValueChange={(val) => handlePeriodChange(val as Period)}>
            <TabsList className="bg-[#F1F5F9] border border-slate-200/60 p-1 rounded-xl h-11">
              <TabsTrigger
                value="month"
                className="rounded-lg px-4 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
              >
                This Month
              </TabsTrigger>
              <TabsTrigger
                value="quarter"
                className="rounded-lg px-4 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
              >
                This Quarter
              </TabsTrigger>
              <TabsTrigger
                value="year"
                className="rounded-lg px-4 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
              >
                This Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl h-11 px-4 text-xs font-bold"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Math verification badge (optional, shows only if discrepancy) */}
      {!mathValid && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>Math inconsistency detected. Please refresh or contact support.</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {/* Total Income Card */}
        <Card className="bg-gradient-to-br from-emerald-50/60 to-teal-50/20 border-emerald-100/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-300 group h-full">
          <CardContent className="p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[140px]">
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-emerald-950 pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <TrendingUp className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-[10px] font-black text-emerald-800/70 uppercase tracking-widest">Total Income</p>
                <h3 className="text-2xl lg:text-3xl font-black text-emerald-950 mt-1.5 tracking-tight transition-all">
                  {formatCurrency(totalIncome)}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 shrink-0">
                <IndianRupee className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Inflow Transactions</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses Card */}
        <Card className="bg-gradient-to-br from-rose-50/60 to-orange-50/20 border-rose-100/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-300 group h-full">
          <CardContent className="p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[140px]">
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-rose-950 pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <TrendingDown className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-[10px] font-black text-rose-800/70 uppercase tracking-widest">Total Expenses</p>
                <h3 className="text-2xl lg:text-3xl font-black text-rose-950 mt-1.5 tracking-tight transition-all">
                  {formatCurrency(totalExpenses)}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/20 shrink-0">
                <TrendingDown className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-700 font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Outflow Transactions</span>
            </div>
          </CardContent>
        </Card>

        {/* Gross Profit Card */}
        <Card className="bg-gradient-to-br from-blue-50/60 to-indigo-50/20 border-blue-100/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-300 group h-full">
          <CardContent className="p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[140px]">
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-blue-950 pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <Scale className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-[10px] font-black text-blue-800/70 uppercase tracking-widest">Gross Profit</p>
                <h3 className="text-2xl lg:text-3xl font-black text-blue-950 mt-1.5 tracking-tight transition-all">
                  {formatCurrency(grossProfit)}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 shrink-0">
                <Scale className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-blue-600 font-medium">
              <span>Income – Expenses</span>
            </div>
          </CardContent>
        </Card>

        {/* Tax (18%) Card */}
        <Card className="bg-gradient-to-br from-amber-50/60 to-orange-50/20 border-amber-100/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-300 group h-full">
          <CardContent className="p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[140px]">
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-amber-950 pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <Receipt className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-[10px] font-black text-amber-800/70 uppercase tracking-widest">Tax (18%)</p>
                <h3 className="text-2xl lg:text-3xl font-black text-amber-950 mt-1.5 tracking-tight transition-all">
                  {formatCurrency(tax)}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 shrink-0">
                <Receipt className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-amber-600 font-medium">
              <span>Estimated Deductions</span>
            </div>
          </CardContent>
        </Card>

        {/* Net Profit Card */}
        <Card className="bg-gradient-to-br from-purple-50/60 to-fuchsia-50/20 border-purple-100/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-300 group h-full">
          <CardContent className="p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[140px]">
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-purple-950 pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-[10px] font-black text-purple-800/70 uppercase tracking-widest">Net Profit</p>
                <h3 className="text-2xl lg:text-3xl font-black text-purple-950 mt-1.5 tracking-tight transition-all">
                  {formatCurrency(netProfit)}
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20 shrink-0">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-purple-600 font-medium">
              <span>Gross Profit – Tax</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-slate-50/50 py-5 px-6">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Transaction Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <ResponsiveTable>
              <Table>
                <TableHeader className="bg-slate-50/60 border-b border-slate-100">
                  <TableRow>
                    <TableHead className="pl-6 font-bold text-slate-600 py-3.5">Date</TableHead>
                    <TableHead className="font-bold text-slate-600 py-3.5">Type</TableHead>
                    <TableHead className="font-bold text-slate-600 py-3.5">Category</TableHead>
                    <TableHead className="font-bold text-slate-600 py-3.5">Description</TableHead>
                    <TableHead className="text-right pr-6 font-bold text-slate-600 py-3.5">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                        No transactions found for the selected period.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((t) => (
                      <TableRow key={t.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50 last:border-b-0">
                        <TableCell className="pl-6 font-medium text-slate-700 py-4">
                          {new Date(t.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className={
                              t.type === "Income"
                                ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/50 px-2.5 py-0.5 rounded-full font-bold text-xs"
                                : "bg-rose-50/80 text-rose-700 border-rose-200/50 px-2.5 py-0.5 rounded-full font-bold text-xs"
                            }
                          >
                            {t.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 py-4">{t.category}</TableCell>
                        <TableCell className="max-w-[300px] truncate text-slate-500 py-4">
                          {t.description || "—"}
                        </TableCell>
                        <TableCell className="text-right pr-6 font-bold text-slate-900 py-4">
                          {formatCurrency(t.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


