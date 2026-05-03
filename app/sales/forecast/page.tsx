"use client";

import { useState, useEffect } from "react";
import { getForecastData, ForecastPeriod, ForecastData } from "./actions";
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Target,
  CheckCircle2,
  Loader2,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ForecastPage() {
  const [period, setPeriod] = useState<ForecastPeriod>("month");
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getForecastData(period);
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
    const rows = data.monthlyTrend.map((m) => [m.month, m.confirmed, m.projected]);
    const csv = [["Month", "Confirmed Revenue (₹)", "Projected Revenue (₹)"], ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue_forecast_${period}.csv`;
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

  const { confirmedRevenue, projectedRevenue, stretchRevenue, totalPipeline, monthlyTrend } = data;

  // Ensure numbers add up correctly: total = confirmed + projected + (stretch - projected as upside)
  const confirmedTotal = confirmedRevenue;
  const projectedTotal = projectedRevenue;
  const stretchTotal = stretchRevenue;
  const upsidePotential = stretchTotal - projectedTotal;

  // KPI cards
  const kpis = [
    {
      label: "Confirmed Revenue",
      value: formatCurrency(confirmedTotal),
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Projected Revenue",
      value: formatCurrency(projectedTotal),
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Upside Potential",
      value: formatCurrency(upsidePotential),
      icon: ArrowUpRight,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Pipeline Value",
      value: formatCurrency(totalPipeline),
      icon: Building2,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  // Chart data for trend
  const chartData = monthlyTrend.map((item) => ({
    month: item.month.slice(5) + "/" + item.month.slice(2, 4), // format MM/YY
    confirmed: item.confirmed,
    projected: item.projected,
    total: item.confirmed + item.projected,
  }));

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header with period tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Revenue Forecast</h1>
          <p className="text-gray-500 text-sm mt-1">
            Predictive analysis based on active deals and historical payments
          </p>
        </div>
        <div className="flex gap-3">
          <Tabs value={period} onValueChange={(val) => setPeriod(val as ForecastPeriod)}>
            <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-11">
              <TabsTrigger value="month" className="rounded-[8px] px-4 text-[12px] font-bold">
                Last Month
              </TabsTrigger>
              <TabsTrigger value="quarter" className="rounded-[8px] px-4 text-[12px] font-bold">
                Last Quarter
              </TabsTrigger>
              <TabsTrigger value="year" className="rounded-[8px] px-4 text-[12px] font-bold">
                Last Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{kpi.value}</h3>
                <p className="text-xs text-gray-500 uppercase font-bold">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Trajectory</CardTitle>
          <p className="text-sm text-gray-500">Confirmed vs Projected (in ₹ Lakhs)</p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip formatter={(val: number) => formatCurrency(val)} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} iconType="circle" />
                <Bar dataKey="confirmed" name="Confirmed Revenue" fill="#10B981" barSize={32} radius={[4, 4, 0, 0]} />
                <Area
                  type="monotone"
                  dataKey="projected"
                  name="Projected Revenue"
                  fill="#0066FF"
                  fillOpacity={0.3}
                  stroke="#0066FF"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total (Confirmed + Projected)"
                  fill="#F59E0B"
                  fillOpacity={0.2}
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Methodology Section */}
      <Card className="bg-gradient-to-br from-[#F8FAFC] to-white border-gray-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Methodology & Assumptions</h3>
              <p className="text-[12px] text-[#64748B]">Basis for the current projection model</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2 text-[#64748B] list-disc pl-5">
              <li>Confirmed revenue = payments received with status “Received”.</li>
              <li>Projected revenue = leads in “Negotiation” multiplied by 70% probability.</li>
              <li>Stretch (upside) = “Negotiation” (90%) + “Site Visit Scheduled” (40%).</li>
            </ul>
            <ul className="space-y-2 text-[#64748B] list-disc pl-5">
              <li>Average deal values derived from flat types: 1BHK ₹50L, 2BHK ₹80L, 3BHK ₹1.2Cr, 4BHK ₹1.8Cr, Villa ₹2.5Cr.</li>
              <li>Last update based on period selected (Month/Quarter/Year).</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
