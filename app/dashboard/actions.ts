"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export type Period = "week" | "month" | "quarter" | "year";

function getDateRange(period: Period): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  let start = new Date(now);

  switch (period) {
    case "week":
      start.setDate(now.getDate() - 7);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      break;
    case "quarter":
      start.setMonth(now.getMonth() - 3);
      break;
    case "year":
      start.setFullYear(now.getFullYear() - 1);
      break;
  }
  return { start, end };
}

export interface DashboardData {
  kpis: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    totalLeads: number;
    convertedLeads: number;
    conversionRate: number;
    totalProjects: number;
    avgProjectCompletion: number;
  };
  revenueVsExpenses: { period: string; revenue: number; expenses: number }[];
  projects: {
    id: string;
    name: string;
    location: string;
    status: string;
    completion_percentage: number;
    budget_total: number;
    budget_spent: number;
  }[];
  leadsOverTime: { period: string; count: number }[];
}

export async function getDashboardData(period: Period): Promise<DashboardData> {
  const { start, end } = getDateRange(period);
  const startISO = start.toISOString();
  const endISO = end.toISOString();

  const cookieStore = cookies();
  const projectId = cookieStore.get("project_id")?.value;

  // 1. Financial KPIs (from financial_ledger or payments + expenses)
  let incomeQuery = supabaseAdmin
    .from("financial_ledger")
    .select("amount, transaction_date")
    .eq("transaction_type", "Income")
    .eq("status", "Approved")
    .gte("transaction_date", startISO.split("T")[0])
    .lte("transaction_date", endISO.split("T")[0]);

  let expenseQuery = supabaseAdmin
    .from("financial_ledger")
    .select("amount, transaction_date")
    .eq("transaction_type", "Expense")
    .eq("status", "Approved")
    .gte("transaction_date", startISO.split("T")[0])
    .lte("transaction_date", endISO.split("T")[0]);

  // 2. Lead KPIs
  let leadsQuery = supabaseAdmin
    .from("leads_customers")
    .select("status, created_at")
    .gte("created_at", startISO)
    .lte("created_at", endISO);

  // 3. Project KPIs
  let projectsQuery = supabaseAdmin
    .from("projects")
    .select("id, name, location, status, completion_percentage, budget_total, budget_spent");

  if (projectId) {
    incomeQuery = incomeQuery.eq("project_id", projectId);
    expenseQuery = expenseQuery.eq("project_id", projectId);
    projectsQuery = projectsQuery.eq("id", projectId);

    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("name")
      .eq("id", projectId)
      .single();
    if (project) {
      leadsQuery = leadsQuery.eq("project_interest", project.name);
    }
  }

  const { data: incomeData } = await incomeQuery;
  const { data: expenseData } = await expenseQuery;
  const { data: leads } = await leadsQuery;
  const { data: projects } = await projectsQuery;

  const totalRevenue = incomeData?.reduce((sum, i) => sum + i.amount, 0) || 0;
  const totalExpenses = expenseData?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const totalLeads = leads?.length || 0;
  const convertedLeads = leads?.filter((l) => l.status === "Converted").length || 0;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  const totalProjects = projects?.length || 0;
  const avgProjectCompletion =
    projects && projects.length > 0
      ? projects.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / projects.length
      : 0;

  // 4. Revenue vs Expenses over time (grouped by month)
  const allTransactions = [...(incomeData || []), ...(expenseData || [])];
  const monthlyMap: Record<string, { revenue: number; expenses: number }> = {};

  allTransactions.forEach((t) => {
    const month = t.transaction_date.slice(0, 7);
    if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, expenses: 0 };
    if (incomeData?.includes(t as any)) monthlyMap[month].revenue += t.amount;
    else monthlyMap[month].expenses += t.amount;
  });

  const revenueVsExpenses = Object.entries(monthlyMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, vals]) => ({
      period: month,
      revenue: vals.revenue,
      expenses: vals.expenses,
    }));

  // 5. Leads over time (grouped by month)
  const leadsByMonth: Record<string, number> = {};
  leads?.forEach((lead) => {
    const month = lead.created_at.slice(0, 7);
    leadsByMonth[month] = (leadsByMonth[month] || 0) + 1;
  });
  const leadsOverTime = Object.entries(leadsByMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({ period: month, count }));

  return {
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
    projects: projects || [],
    leadsOverTime,
  };
}
