"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData, AnalyticsData } from "./actions";
import { useProject } from "@/lib/contexts/ProjectContext";
import {
  IndianRupee,
  Users,
  Target,
  Building2,
  ClipboardList,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { activeProject } = useProject();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getAnalyticsData();
      setData(result);
      setLoading(false);
    }
    fetchData();
  }, [activeProject]);

  const formatCurrency = (value: number) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="animate-spin w-8 h-8 text-[#0066FF]" />
      </div>
    );
  }

  const {
    kpis: {
      totalRevenue,
      totalLeads,
      conversionRate,
      avgProjectCompletion,
      pendingDemands,
      activeProjects,
    },
    revenueTrend,
    leadSources,
    projectCompletion,
    monthlyExpenses,
  } = data;

  const kpiCards = [
    { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: IndianRupee, color: "bg-green-100 text-green-600" },
    { label: "Total Leads", value: totalLeads, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Conversion Rate", value: `${conversionRate.toFixed(1)}%`, icon: Target, color: "bg-purple-100 text-purple-600" },
    { label: "Avg Completion", value: `${avgProjectCompletion.toFixed(0)}%`, icon: Building2, color: "bg-indigo-100 text-indigo-600" },
    { label: "Pending Demands", value: pendingDemands, icon: ClipboardList, color: "bg-amber-100 text-amber-600" },
    { label: "Active Projects", value: activeProjects, icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600" },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Analytics Dashboard</h1>
        <p className="text-gray-500">Executive insights across sales, construction, and finance</p>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((kpi, i) => (
          <Card key={i} className="bg-white border-gray-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-full ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-gray-500 uppercase font-bold">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend - Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend (₹ Lakhs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(val) => `₹${val}L`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0066FF" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two columns: Lead Source Pie + Project Completion Bar */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadSources} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {leadSources.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Completion (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectCompletion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="completion" name="Completion %" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Expenses - Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses (₹ Lakhs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(val) => `₹${val}L`} />
                <Area type="monotone" dataKey="expenses" name="Expenses" fill="#EF4444" stroke="#EF4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
