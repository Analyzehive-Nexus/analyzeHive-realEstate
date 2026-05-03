"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export interface AnalyticsData {
  kpis: {
    totalRevenue: number;
    totalLeads: number;
    conversionRate: number;
    avgProjectCompletion: number;
    pendingDemands: number;
    activeProjects: number;
  };
  revenueTrend: { month: string; revenue: number }[];
  leadSources: { name: string; value: number; color: string }[];
  projectCompletion: { name: string; completion: number }[];
  monthlyExpenses: { month: string; expenses: number }[];
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const cookieStore = cookies();
  const projectId = cookieStore.get("project_id")?.value;

  // Helper to fetch project name if needed for leads
  let projectName = null;
  if (projectId) {
    const { data: project } = await supabaseAdmin.from("projects").select("name").eq("id", projectId).single();
    if (project) projectName = project.name;
  }

  // 1. KPIs -------------------------------------------------
  // Revenue from financial_ledger
  let revenueQuery = supabaseAdmin
    .from("financial_ledger")
    .select("amount")
    .eq("transaction_type", "Income")
    .eq("status", "Approved");
  if (projectId) revenueQuery = revenueQuery.eq("project_id", projectId);
  const { data: revenueData } = await revenueQuery;
  const totalRevenue = revenueData?.reduce((s, r) => s + r.amount, 0) || 0;

  // Total leads
  let totalLeadsQuery = supabaseAdmin
    .from("leads_customers")
    .select("*", { count: "exact", head: true });
  if (projectName) totalLeadsQuery = totalLeadsQuery.eq("project_interest", projectName);
  const { count: totalLeads } = await totalLeadsQuery;

  // Converted leads
  let convertedLeadsQuery = supabaseAdmin
    .from("leads_customers")
    .select("*", { count: "exact", head: true })
    .eq("status", "Converted");
  if (projectName) convertedLeadsQuery = convertedLeadsQuery.eq("project_interest", projectName);
  const { count: convertedLeads } = await convertedLeadsQuery;
  const conversionRate = totalLeads ? (convertedLeads! / totalLeads) * 100 : 0;

  // Projects
  let projectsQuery = supabaseAdmin
    .from("projects")
    .select("completion_percentage, status");
  if (projectId) projectsQuery = projectsQuery.eq("id", projectId);
  const { data: projects } = await projectsQuery;
  const avgProjectCompletion =
    projects && projects.length
      ? projects.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / projects.length
      : 0;
  const activeProjects = projects?.filter((p) => p.status === "Active").length || 0;

  // Pending demands
  let demandsQuery = supabaseAdmin
    .from("material_demands")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending");
  if (projectId) demandsQuery = demandsQuery.eq("project_id", projectId);
  const { count: pendingDemands } = await demandsQuery;

  // 2. Revenue trend (grouped by month)
  let paymentsQuery = supabaseAdmin
    .from("payments")
    .select("amount, payment_date")
    .eq("status", "Received")
    .order("payment_date", { ascending: true });
  if (projectId) paymentsQuery = paymentsQuery.eq("project_id", projectId);
  const { data: payments } = await paymentsQuery;

  const revenueByMonth: Record<string, number> = {};
  payments?.forEach((p) => {
    const month = p.payment_date.slice(0, 7);
    revenueByMonth[month] = (revenueByMonth[month] || 0) + p.amount;
  });
  const revenueTrend = Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue: revenue / 100000, // show in lakhs
  }));

  // 3. Lead sources (from leads_customers)
  let leadsQuery = supabaseAdmin
    .from("leads_customers")
    .select("source");
  if (projectName) leadsQuery = leadsQuery.eq("project_interest", projectName);
  const { data: leads } = await leadsQuery;
  const sourceCount: Record<string, number> = {};
  leads?.forEach((l) => {
    const src = l.source || "Direct";
    sourceCount[src] = (sourceCount[src] || 0) + 1;
  });
  const sourceColors: Record<string, string> = {
    Meta: "#0066FF",
    Google: "#10B981",
    "99acres": "#F59E0B",
    Direct: "#64748B",
    Referral: "#8B5CF6",
  };
  const leadSources = Object.entries(sourceCount).map(([name, value]) => ({
    name,
    value,
    color: sourceColors[name] || "#CBD5E1",
  }));

  // 4. Project completion (bar chart)
  let projectListQuery = supabaseAdmin
    .from("projects")
    .select("name, completion_percentage");
  if (projectId) projectListQuery = projectListQuery.eq("id", projectId);
  const { data: projectList } = await projectListQuery;
  const projectCompletion =
    projectList?.map((p) => ({ name: p.name, completion: p.completion_percentage || 0 })) || [];

  // 5. Monthly expenses (from financial_ledger)
  let expensesQuery = supabaseAdmin
    .from("financial_ledger")
    .select("amount, transaction_date")
    .eq("transaction_type", "Expense")
    .eq("status", "Approved")
    .order("transaction_date", { ascending: true });
  if (projectId) expensesQuery = expensesQuery.eq("project_id", projectId);
  const { data: expenses } = await expensesQuery;

  const expenseByMonth: Record<string, number> = {};
  expenses?.forEach((e) => {
    const month = e.transaction_date.slice(0, 7);
    expenseByMonth[month] = (expenseByMonth[month] || 0) + e.amount;
  });
  const monthlyExpenses = Object.entries(expenseByMonth).map(([month, expenses]) => ({
    month,
    expenses: expenses / 100000,
  }));

  return {
    kpis: {
      totalRevenue,
      totalLeads: totalLeads || 0,
      conversionRate,
      avgProjectCompletion,
      pendingDemands: pendingDemands || 0,
      activeProjects,
    },
    revenueTrend,
    leadSources,
    projectCompletion,
    monthlyExpenses,
  };
}
