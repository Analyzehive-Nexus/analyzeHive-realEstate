"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A]/95 backdrop-blur-md border border-[#1E293B] p-3.5 rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-white text-xs space-y-1.5 min-w-[150px]">
        <p className="font-bold text-[#64748B] uppercase tracking-wider text-[9px] border-b border-slate-800 pb-1 mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((pld: any, index: number) => {
            const val = typeof pld.value === 'number' ? pld.value : parseFloat(pld.value);
            const isCurrency = pld.name.toLowerCase().includes('revenue') || 
                             pld.name.toLowerCase().includes('expenses');
                             
            const formattedVal = isCurrency
              ? `₹${val.toFixed(2)}L`
              : `${val}`;
            
            return (
              <div key={index} className="flex items-center justify-between gap-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pld.color || pld.fill }} />
                  <span className="text-[#94A3B8]">{pld.name}:</span>
                </div>
                <span className="font-bold text-white">{formattedVal}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function MDPage() {
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const period = (searchParams?.get("period") as Period) || "month";
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

  const exportCSV = () => {
    if (!data) return;
    const { kpis, projects, revenueVsExpenses, leadsOverTime } = data;
    
    let csvContent = "";
    
    // Section 1: Executive KPIs
    csvContent += "=== EXECUTIVE KPIs ===\n";
    csvContent += "Metric,Value\n";
    csvContent += `Total Revenue,₹${kpis.totalRevenue.toLocaleString("en-IN")}\n`;
    csvContent += `Total Expenses,₹${kpis.totalExpenses.toLocaleString("en-IN")}\n`;
    csvContent += `Net Profit,₹${kpis.netProfit.toLocaleString("en-IN")}\n`;
    csvContent += `Profit Margin,${kpis.profitMargin.toFixed(1)}%\n`;
    csvContent += `Total Leads,${kpis.totalLeads}\n`;
    csvContent += `Converted Leads,${kpis.convertedLeads}\n`;
    csvContent += `Conversion Rate,${kpis.conversionRate.toFixed(1)}%\n`;
    csvContent += `Avg Project Completion,${kpis.avgProjectCompletion.toFixed(0)}%\n\n`;
    
    // Section 2: Projects Overview
    csvContent += "=== PROJECTS OVERVIEW ===\n";
    csvContent += "Project Name,Location,Status,Completion %,Budget (Total),Budget (Spent)\n";
    projects.forEach((p) => {
      csvContent += `"${p.name}","${p.location}","${p.status}",${p.completion_percentage}%,${p.budget_total},${p.budget_spent}\n`;
    });
    csvContent += "\n";
    
    // Section 3: Financial Monthly Trends
    csvContent += "=== FINANCIAL MONTHLY TRENDS ===\n";
    csvContent += "Month,Revenue (₹),Expenses (₹)\n";
    revenueVsExpenses.forEach((item) => {
      csvContent += `${item.period},${item.revenue},${item.expenses}\n`;
    });
    csvContent += "\n";
    
    // Section 4: Leads Growth Trends
    csvContent += "=== LEADS GROWTH TRENDS ===\n";
    csvContent += "Month,Leads Count\n";
    leadsOverTime.forEach((item) => {
      csvContent += `${item.period},${item.count}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `executive_summary_${period}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleGlobalExport = () => {
      exportCSV();
    };
    window.addEventListener("export-dashboard-report", handleGlobalExport);
    return () => {
      window.removeEventListener("export-dashboard-report", handleGlobalExport);
    };
  }, [data, period]);

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
      trend: "+12.4% vs last period",
      isPositive: true,
      gradient: "from-[#F0FDF4] to-[#F5FDF9] border-[#DCFCE7] hover:border-emerald-300",
      iconBg: "bg-emerald-500 text-white shadow-emerald-500/10",
      iconColor: "text-emerald-600",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-250/30",
      sparkColor: "rgba(16,185,129,0.08)",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      trend: "+4.2% vs last period",
      isPositive: false,
      gradient: "from-[#FEF2F2] to-[#FFF5F5] border-[#FEE2E2] hover:border-rose-350",
      iconBg: "bg-rose-500 text-white shadow-rose-500/10",
      iconColor: "text-rose-600",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-250/30",
      sparkColor: "rgba(239,68,68,0.08)",
    },
    {
      label: "Net Profit",
      value: formatCurrency(netProfit),
      icon: TrendingUp,
      trend: "+18.1% vs last period",
      isPositive: true,
      gradient: "from-[#EFF6FF] to-[#F5F9FF] border-[#DBEAFE] hover:border-blue-350",
      iconBg: "bg-blue-600 text-white shadow-blue-600/10",
      iconColor: "text-blue-600",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-250/30",
      sparkColor: "rgba(37,99,235,0.08)",
    },
    {
      label: "Profit Margin",
      value: `${profitMargin.toFixed(1)}%`,
      icon: Target,
      trend: "Optimal Range (>15%)",
      isNeutral: true,
      gradient: "from-[#FAF5FF] to-[#FAF9FF] border-[#F3E8FF] hover:border-purple-350",
      iconBg: "bg-purple-600 text-white shadow-purple-600/10",
      iconColor: "text-purple-600",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-250/30",
      sparkColor: "rgba(147,51,234,0.08)",
    },
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      trend: "Active Lead pool",
      isNeutral: true,
      gradient: "from-[#F8FAFC] to-[#FFFFFF] border-[#E2E8F0] hover:border-slate-350",
      iconBg: "bg-indigo-600 text-white shadow-indigo-650/10",
      iconColor: "text-indigo-600",
      badgeColor: "bg-[#F1F5F9] text-slate-700 border-slate-250/30",
      sparkColor: "rgba(79,70,229,0.06)",
    },
    {
      label: "Converted Leads",
      value: convertedLeads,
      icon: CheckCircle2,
      trend: "Completed onboarding",
      isNeutral: true,
      gradient: "from-[#F0FDFA] to-[#F5FDFD] border-[#CCFBF1] hover:border-teal-350",
      iconBg: "bg-teal-600 text-white shadow-teal-600/10",
      iconColor: "text-teal-600",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-250/30",
      sparkColor: "rgba(13,148,136,0.08)",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      icon: Target,
      trend: "High conversion efficiency",
      isNeutral: true,
      gradient: "from-[#FFFBEB] to-[#FFFDF5] border-[#FEF3C7] hover:border-amber-350",
      iconBg: "bg-amber-500 text-white shadow-amber-500/10",
      iconColor: "text-amber-600",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-250/30",
      sparkColor: "rgba(245,158,11,0.08)",
    },
    {
      label: "Avg Project Completion",
      value: `${avgProjectCompletion.toFixed(0)}%`,
      icon: Building2,
      trend: "Across all active sites",
      isNeutral: true,
      gradient: "from-[#ECFEFF] to-[#F5FDFD] border-[#CFFAFE] hover:border-cyan-350",
      iconBg: "bg-cyan-600 text-white shadow-cyan-600/10",
      iconColor: "text-cyan-600",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-250/30",
      sparkColor: "rgba(8,145,178,0.08)",
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
        <Tabs 
          value={period} 
          onValueChange={(val) => {
            const params = new URLSearchParams(searchParams?.toString() || "");
            params.set("period", val);
            router.push(`${pathname}?${params.toString()}`);
          }}
        >
          <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-11">
            <TabsTrigger value="week" className="rounded-[8px] px-4 text-[12px] font-bold">Week</TabsTrigger>
            <TabsTrigger value="month" className="rounded-[8px] px-4 text-[12px] font-bold">Month</TabsTrigger>
            <TabsTrigger value="quarter" className="rounded-[8px] px-4 text-[12px] font-bold">Quarter</TabsTrigger>
            <TabsTrigger value="year" className="rounded-[8px] px-4 text-[12px] font-bold">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Premium Dashboard KPI Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {kpiCards.map((kpi, i) => (
          <Card 
            key={i} 
            className={`group overflow-hidden bg-gradient-to-br ${kpi.gradient} border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.06)] rounded-[24px] transition-all duration-300 hover:-translate-y-1 relative`}
          >
            {/* Top-right subtle glow orb */}
            <div 
              className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-35 group-hover:scale-150 transition-transform duration-500 pointer-events-none blur-xl"
              style={{ backgroundColor: kpi.sparkColor }}
            />
            
            <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-450 tracking-wider uppercase leading-none">
                  {kpi.label}
                </span>
                <div className={`p-2.5 rounded-xl ${kpi.iconBg} flex items-center justify-center border border-white/40 group-hover:scale-105 transition-transform duration-300`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
              </div>
              
              <div className="mt-5 space-y-2">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {kpi.value}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {kpi.isPositive !== undefined && (
                    <span className={`text-[10px] font-bold px-2.5 py-0.8 rounded-full border flex items-center gap-1 shadow-sm leading-none ${kpi.badgeColor}`}>
                      <span className="text-[11px]">{kpi.isPositive ? "↑" : "↓"}</span> {kpi.trend}
                    </span>
                  )}
                  {kpi.isNeutral && (
                    <span className={`text-[10px] font-bold px-2.5 py-0.8 rounded-full border flex items-center gap-1 shadow-sm leading-none ${kpi.badgeColor}`}>
                      {kpi.trend}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <Card className="rounded-[24px] border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.015)] bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-[#FCFDFE]/60 py-5 px-6">
            <CardTitle className="text-slate-800 text-base font-bold">Revenue vs Expenses</CardTitle>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Monthly comparative trend (in ₹ Lakhs)</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.20}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} tickFormatter={(val) => `₹${val}L`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569' }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" fill="url(#revenueGlow)" stroke="#10B981" strokeWidth={3} dot={{ r: 3, fill: '#10B981', strokeWidth: 1, stroke: '#FFFFFF' }} activeDot={{ r: 5 }} />
                  <Area type="monotone" dataKey="expenses" name="Expenses" fill="url(#expenseGlow)" stroke="#EF4444" strokeWidth={3} dot={{ r: 3, fill: '#EF4444', strokeWidth: 1, stroke: '#FFFFFF' }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leads Over Time Chart */}
        <Card className="rounded-[24px] border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.015)] bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-[#FCFDFE]/60 py-5 px-6">
            <CardTitle className="text-slate-800 text-base font-bold">Leads Over Time</CardTitle>
            <p className="text-xs text-slate-500 font-medium mt-0.5">New leads volume curve</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadsChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="leadsGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569' }} />
                  <Area type="monotone" dataKey="leads" name="Leads" fill="url(#leadsGlow)" stroke="#3B82F6" strokeWidth={3} dot={{ r: 3, fill: '#3B82F6', strokeWidth: 1, stroke: '#FFFFFF' }} activeDot={{ r: 5 }} />
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
