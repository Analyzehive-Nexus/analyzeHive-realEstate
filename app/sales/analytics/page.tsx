"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, IndianRupee, PieChart as PieChartIcon,
  Target, Clock, Users, Building2, BarChart2, Filter
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { SkeletonChart } from "@/components/ui/skeleton-chart";
import { getAnalyticsData, Period, AnalyticsData } from "./actions";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getAnalyticsData(period);
      setData(result);
      setLoading(false);
    }
    fetchData();
  }, [period]);

  const formatCurrency = (value: number) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

  if (loading || !data) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  const { revenueTrend, sourceDistribution, brokerPerformance, funnelData, kpis } = data;

  // Custom bar for broker chart
  const CustomBar = (props: any) => {
    const { fill, x, y, width, height, payload } = props;
    const color = payload.conversions >= payload.target ? "#10B981" : "#F59E0B";
    return <rect x={x} y={y} width={width} height={height} fill={color} rx={4} ry={4} />;
  };

  const kpiCards = [
    { label: "Total Revenue", value: formatCurrency(kpis.totalRevenue), icon: IndianRupee, color: "text-[#0066FF]", bg: "bg-blue-50", trend: kpis.momGrowth },
    { label: "Avg Deal Size", value: formatCurrency(kpis.avgDealSize), icon: Target, color: "text-purple-600", bg: "bg-purple-50", trend: 2.4 },
    { label: "Conversion Rate", value: `${kpis.conversionRate.toFixed(1)}%`, icon: PieChartIcon, color: "text-emerald-500", bg: "bg-emerald-50", trend: 1.2 },
    { label: "Avg Sales Cycle", value: `${kpis.avgSalesCycle} days`, icon: Clock, color: "text-amber-500", bg: "bg-amber-50", trend: -5.0 },
    { label: "Top Channel", value: kpis.topChannel, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50", trend: 8.4 },
    { label: "MoM Growth", value: `${kpis.momGrowth.toFixed(1)}%`, icon: TrendingUp, color: "text-cyan-500", bg: "bg-cyan-50", trend: kpis.momGrowth },
  ];

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      {/* Header & Period Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Sales Analytics</h1>
          <p className="text-[#64748B] text-sm mt-1">Deep dive into revenue, conversions, and performance</p>
        </div>

        <Tabs value={period} onValueChange={(val) => setPeriod(val as Period)}>
          <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-11">
            <TabsTrigger value="week" className="rounded-[8px] px-4 text-[12px] font-bold">This Week</TabsTrigger>
            <TabsTrigger value="month" className="rounded-[8px] px-4 text-[12px] font-bold">This Month</TabsTrigger>
            <TabsTrigger value="quarter" className="rounded-[8px] px-4 text-[12px] font-bold">This Quarter</TabsTrigger>
            <TabsTrigger value="year" className="rounded-[8px] px-4 text-[12px] font-bold">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((kpi, i) => (
          <Card key={i} className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] hover:-translate-y-0.5 transition-transform">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-[8px] ${kpi.bg}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] ${kpi.trend >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                  {kpi.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.trend >= 0 ? `+${kpi.trend.toFixed(1)}%` : `${kpi.trend.toFixed(1)}%`}
                </div>
              </div>
              <h3 className="text-[22px] font-bold text-[#0F172A] leading-tight">{kpi.value}</h3>
              <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-[#0F172A] text-[16px]">Monthly Revenue Trend</h3>
            <p className="text-[12px] text-[#64748B]">Actual vs Target (in Lakhs)</p>
          </div>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} />
                  <RechartsTooltip formatter={(val: number) => formatCurrency(val)} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0066FF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Source Distribution Pie Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-[#0F172A] text-[16px]">Lead Source Distribution</h3>
            <p className="text-[12px] text-[#64748B]">Breakdown by marketing channel</p>
          </div>
          <CardContent className="p-6 flex items-center justify-center">
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceDistribution} cx="50%" cy="50%" innerRadius={75} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none">
                    {sourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => [`${val} leads`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[2px] pr-[120px]">
                <span className="text-[28px] font-bold text-[#0F172A] leading-none">{funnelData[0]?.count || 0}</span>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-1">Total Leads</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Broker Performance & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Broker Performance</h3>
              <p className="text-[12px] text-[#64748B]">Conversions vs Target</p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brokerPerformance} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <RechartsTooltip />
                  <Bar dataKey="conversions" name="Conversions" shape={<CustomBar />} />
                  <Bar dataKey="target" name="Target" fill="#E2E8F0" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-[#0F172A] text-[16px]">Conversion Pipeline</h3>
            <p className="text-[12px] text-[#64748B]">Leads moving through stages</p>
          </div>
          <CardContent className="p-6 px-10">
            <div className="h-[280px] w-full flex flex-col justify-center gap-[6px]">
              {funnelData.map((stage, i) => {
                const total = funnelData[0].count;
                const widthPercent = total > 0 ? (stage.count / total) * 100 : 0;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`h-11 flex items-center justify-between px-4 text-white rounded-[6px] shadow-sm transition-all hover:opacity-90 cursor-pointer`}
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: i === 0 ? "#0066FF" : i === 1 ? "#3B82F6" : i === 2 ? "#8B5CF6" : i === 3 ? "#F59E0B" : "#10B981",
                      }}
                    >
                      <span className="text-[12px] font-bold tracking-wide">{stage.stage}</span>
                      <span className="text-[14px] font-bold">{stage.count}</span>
                    </div>
                    {i < funnelData.length - 1 && <div className="h-4 w-px bg-gray-200 my-0.5" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
