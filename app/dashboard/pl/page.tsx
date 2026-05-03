"use client";

import { useState, useEffect } from "react";
import { getPnLData, Period, PnLData } from "./actions";
import { Download, Loader2 } from "lucide-react";
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
  const [data, setData] = useState<PnLData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getPnLData(period);
      setData(result);
      setLoading(false);
    }
    fetchData();
  }, [period]);

  const formatCurrency = (value: number) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

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
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header with period filter and export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Profit & Loss Statement</h1>
          <p className="text-gray-500 text-sm mt-1">
            Income, expenses, and net profit calculation with applicable taxes
          </p>
        </div>
        <div className="flex gap-3">
          <Tabs value={period} onValueChange={(val) => setPeriod(val as Period)}>
            <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-11">
              <TabsTrigger value="month" className="rounded-[8px] px-4 text-[12px] font-bold">
                This Month
              </TabsTrigger>
              <TabsTrigger value="quarter" className="rounded-[8px] px-4 text-[12px] font-bold">
                This Quarter
              </TabsTrigger>
              <TabsTrigger value="year" className="rounded-[8px] px-4 text-[12px] font-bold">
                This Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Math verification badge (optional, shows only if discrepancy) */}
      {!mathValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          ⚠️ Math inconsistency detected. Please refresh or contact support.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 uppercase font-bold">Total Income</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 uppercase font-bold">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 uppercase font-bold">Gross Profit</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(grossProfit)}</p>
            <p className="text-xs text-gray-400">Income – Expenses</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 uppercase font-bold">Tax (18%)</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(tax)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 uppercase font-bold">Net Profit</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(netProfit)}</p>
            <p className="text-xs text-gray-400">Gross Profit – Tax</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No transactions found for the selected period.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            t.type === "Income"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {t.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{t.description || "—"}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
