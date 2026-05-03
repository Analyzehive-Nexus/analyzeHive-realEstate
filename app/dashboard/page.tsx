"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import { getDashboardData, Period, DashboardData } from "./actions";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MDPage() {
  const supabase = createBrowserClient();
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getDashboardData(period);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Real-time subscriptions for leads, projects, financial_ledger
    const leadsChannel = supabase
      .channel("md-leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads_customers" }, () => fetchData())
      .subscribe();

    const projectsChannel = supabase
      .channel("md-projects")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchData())
      .subscribe();

    const financeChannel = supabase
      .channel("md-finance")
      .on("postgres_changes", { event: "*", schema: "public", table: "financial_ledger" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(financeChannel);
    };
  }, [period]);

  const formatCurrency = (value: number) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  const {
    kpis: {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      totalLeads,
      convertedLeads,
      conversionRate,
      totalProjects,
      avgProjectCompletion,
    },
    revenueVsExpenses,
    projects,
    leadsOverTime,
  } = data;

  // Format charts: revenue/expenses in Lakhs for Y-axis
  const chartData = revenueVsExpenses.map((item) => ({
    period: item.period,
    revenue: item.revenue / 100000,
    expenses: item.expenses / 100000,
  }));

  const leadsChartData = leadsOverTime.map((item) => ({
    period: item.period,
    leads: item.count,
  }));

  const kpiCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Net Profit",
      value: formatCurrency(netProfit),
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Profit Margin",
      value: `${profitMargin.toFixed(1)}%`,
      icon: Target,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Converted",
      value: convertedLeads,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      icon: Target,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Avg Project Completion",
      value: `${avgProjectCompletion.toFixed(0)}%`,
      icon: Building2,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header with period filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">MD Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Executive overview of sales, finance, and projects</p>
        </div>
        <Tabs value={period} onValueChange={(val) => setPeriod(val as Period)}>
          <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-11">
            <TabsTrigger value="week" className="rounded-[8px] px-4 text-[12px] font-bold">Week</TabsTrigger>
            <TabsTrigger value="month" className="rounded-[8px] px-4 text-[12px] font-bold">Month</TabsTrigger>
            <TabsTrigger value="quarter" className="rounded-[8px] px-4 text-[12px] font-bold">Quarter</TabsTrigger>
            <TabsTrigger value="year" className="rounded-[8px] px-4 text-[12px] font-bold">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 8 KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {kpiCards.map((kpi, i) => (
          <Card key={i} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4 flex flex-col items-start gap-2">
              <div className={`p-2 rounded-full ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <p className="text-sm text-gray-500">Monthly trend (in ₹ Lakhs)</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}L`} />
                  <Tooltip formatter={(val) => `₹${val}L`} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stackId="1" fill="#10B981" fillOpacity={0.6} stroke="#10B981" />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stackId="1" fill="#EF4444" fillOpacity={0.6} stroke="#EF4444" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leads Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Over Time</CardTitle>
            <p className="text-sm text-gray-500">New leads per month</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadsChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="leads" name="Leads" fill="#3B82F6" fillOpacity={0.6} stroke="#3B82F6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0F172A]">Projects Overview</h2>
          <Badge variant="outline">{totalProjects} Total Projects</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white border-gray-200"
              onClick={() => {
                setSelectedProject(project);
                setSheetOpen(true);
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{project.name}</h3>
                  <Badge
                    className={
                      project.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : project.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">{project.location}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Completion</span>
                    <span>{project.completion_percentage || 0}%</span>
                  </div>
                  <Progress value={project.completion_percentage || 0} className="h-2" />
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-semibold">{formatCurrency(project.budget_total || 0)}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-500">Spent:</span>
                  <span className="font-semibold text-amber-600">{formatCurrency(project.budget_spent || 0)}</span>
                </div>
                <Button variant="ghost" size="sm" className="mt-4 w-full text-[#0066FF]">
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Project Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {selectedProject && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl">{selectedProject.name}</SheetTitle>
                <SheetDescription>{selectedProject.location}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status</span>
                  <Badge
                    className={
                      selectedProject.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : selectedProject.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }
                  >
                    {selectedProject.status}
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold">Completion</span>
                  <div className="mt-2">
                    <Progress value={selectedProject.completion_percentage || 0} className="h-2" />
                    <p className="text-sm text-gray-500 mt-1">{selectedProject.completion_percentage || 0}% Complete</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Financial Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Budget</span>
                      <span className="font-bold">{formatCurrency(selectedProject.budget_total || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount Spent</span>
                      <span className="font-bold text-amber-600">{formatCurrency(selectedProject.budget_spent || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency((selectedProject.budget_total || 0) - (selectedProject.budget_spent || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
