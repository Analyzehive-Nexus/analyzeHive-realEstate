"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";


import { useState, useEffect } from "react";
import { getCashFlowData, Period, CashFlowData } from "./actions";
import { Download, Loader2, TrendingUp, TrendingDown } from "lucide-react";
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CashFlowPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<CashFlowData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getCashFlowData(period);
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
    const csv = [["Date", "Type", "Category", "Amount (₹)", "Description"], ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cashflow_${period}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  const { totalInflow, totalOutflow, netCashFlow, monthlyData, transactions } = data;

  const chartData = monthlyData.map((m) => ({
    month: m.month,
    inflow: m.inflow / 100000,
    outflow: m.outflow / 100000,
  }));

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cash Flow</h1>
          <p className="text-gray-500">Track inflows, outflows, and net position</p>
        </div>
        <div className="flex gap-3">
          <Tabs value={period} onValueChange={(val) => setPeriod(val as Period)}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 uppercase">Total Inflow</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalInflow)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 uppercase">Total Outflow</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOutflow)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 uppercase">Net Cash Flow</p>
            <p className={`text-2xl font-bold ${netCashFlow >= 0 ? "text-blue-600" : "text-orange-600"}`}>
              {formatCurrency(netCashFlow)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trend (₹ Lakhs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `₹${v}L`} />
                <Tooltip formatter={(v) => `₹${v}L`} />
                <Area type="monotone" dataKey="inflow" name="Inflow" fill="#10B981" stroke="#10B981" />
                <Area type="monotone" dataKey="outflow" name="Outflow" fill="#EF4444" stroke="#EF4444" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable>
<Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === "Income" ? "success" : "destructive"}>
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.description || "-"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(t.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
</ResponsiveTable>
        </CardContent>
      </Card>
    </div>
  );
}
