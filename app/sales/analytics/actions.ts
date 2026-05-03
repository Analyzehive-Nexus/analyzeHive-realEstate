"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export type Period = "week" | "month" | "quarter" | "year";

export interface AnalyticsData {
  revenueTrend: { period: string; revenue: number; target: number }[];
  sourceDistribution: { name: string; value: number; color: string }[];
  brokerPerformance: { name: string; conversions: number; target: number }[];
  funnelData: { stage: string; count: number }[];
  kpis: {
    totalRevenue: number;
    avgDealSize: number;
    conversionRate: number;
    avgSalesCycle: number;
    topChannel: string;
    momGrowth: number;
  };
}

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

export async function getAnalyticsData(period: Period): Promise<AnalyticsData> {
  const { start, end } = getDateRange(period);
  const startISO = start.toISOString();
  const endISO = end.toISOString();

  const cookieStore = cookies();
  const projectId = cookieStore.get("project_id")?.value;

  // 1. Revenue trend (group by month for simplicity, or week for week period)
  // For demonstration, we'll group by month (use date_trunc for PostgreSQL)
  let revenueTrend: { period: string; revenue: number; target: number }[] = [];

  // Fetch payments within date range (assuming payment_date is date type)
  let paymentsQuery = supabaseAdmin
    .from("payments")
    .select("amount, payment_date")
    .gte("payment_date", startISO.split("T")[0])
    .lte("payment_date", endISO.split("T")[0])
    .eq("status", "Received");

  if (projectId) paymentsQuery = paymentsQuery.eq("project_id", projectId);
  const { data: payments } = await paymentsQuery;

  // Group by month
  const revenueByMonth: Record<string, number> = {};
  payments?.forEach((p) => {
    const month = p.payment_date.slice(0, 7); // YYYY-MM
    revenueByMonth[month] = (revenueByMonth[month] || 0) + p.amount;
  });

  // Generate target values (e.g., 10% above actual or fixed)
  const sortedMonths = Object.keys(revenueByMonth).sort();
  revenueTrend = sortedMonths.map((month) => ({
    period: month,
    revenue: revenueByMonth[month],
    target: Math.round(revenueByMonth[month] * 1.1), // mock target 10% higher
  }));

  // 2. Lead source distribution
  let leadsQuery = supabaseAdmin
    .from("leads_customers")
    .select("source")
    .gte("created_at", startISO)
    .lte("created_at", endISO);

  if (projectId) {
    const { data: project } = await supabaseAdmin.from("projects").select("name").eq("id", projectId).single();
    if (project) leadsQuery = leadsQuery.eq("project_interest", project.name);
  }
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

  const sourceDistribution = Object.entries(sourceCount).map(([name, value]) => ({
    name,
    value,
    color: sourceColors[name] || "#CBD5E1",
  }));

  // 3. Broker performance (conversions per broker)
  let convertedLeadsQuery = supabaseAdmin
    .from("leads_customers")
    .select("assigned_user_id")
    .eq("status", "Converted")
    .gte("created_at", startISO)
    .lte("created_at", endISO);

  if (projectId) {
    const { data: project } = await supabaseAdmin.from("projects").select("name").eq("id", projectId).single();
    if (project) convertedLeadsQuery = convertedLeadsQuery.eq("project_interest", project.name);
  }
  const { data: convertedLeads } = await convertedLeadsQuery;

  const brokerConv: Record<string, number> = {};
  convertedLeads?.forEach((l) => {
    if (l.assigned_user_id) {
      brokerConv[l.assigned_user_id] = (brokerConv[l.assigned_user_id] || 0) + 1;
    }
  });

  // Fetch broker names
  const brokerIds = Object.keys(brokerConv);
  const { data: brokers } = await supabaseAdmin
    .from("users")
    .select("id, name")
    .in("id", brokerIds);

  const brokerMap: Record<string, string> = {};
  brokers?.forEach((b) => (brokerMap[b.id] = b.name));

  const brokerPerformance = Object.entries(brokerConv).map(([id, conv]) => ({
    name: brokerMap[id] || "Unknown",
    conversions: conv,
    target: Math.max(conv, 5), // mock target (e.g., 5)
  }));

  // 4. Funnel data (lead stages)
  let allLeadsQuery = supabaseAdmin
    .from("leads_customers")
    .select("status")
    .gte("created_at", startISO)
    .lte("created_at", endISO);

  if (projectId) {
    const { data: project } = await supabaseAdmin.from("projects").select("name").eq("id", projectId).single();
    if (project) allLeadsQuery = allLeadsQuery.eq("project_interest", project.name);
  }
  const { data: allLeads } = await allLeadsQuery;

  const stageCount: Record<string, number> = {
    "Total Leads": allLeads?.length || 0,
    Contacted: 0,
    "Site Visit Scheduled": 0,
    Negotiation: 0,
    Converted: 0,
  };
  allLeads?.forEach((l) => {
    if (l.status === "Contacted") stageCount.Contacted++;
    else if (l.status === "Site Visit Scheduled") stageCount["Site Visit Scheduled"]++;
    else if (l.status === "Negotiation") stageCount.Negotiation++;
    else if (l.status === "Converted") stageCount.Converted++;
  });

  const funnelData = [
    { stage: "Total Leads", count: stageCount["Total Leads"] },
    { stage: "Contacted", count: stageCount.Contacted },
    { stage: "Site Visit", count: stageCount["Site Visit Scheduled"] },
    { stage: "Negotiation", count: stageCount.Negotiation },
    { stage: "Converted", count: stageCount.Converted },
  ];

  // 5. KPIs
  const totalRevenue = revenueTrend.reduce((sum, r) => sum + r.revenue, 0);
  const totalLeads = allLeads?.length || 0;
  const converted = stageCount.Converted;
  const conversionRate = totalLeads > 0 ? (converted / totalLeads) * 100 : 0;

  // Avg deal size = totalRevenue / converted (if any)
  const avgDealSize = converted > 0 ? totalRevenue / converted : 0;

  // Sales cycle (mock: average days between lead creation and conversion)
  // For simplicity, we'll fetch difference from a few converted leads
  let avgSalesCycle = 0;
  if (converted > 0) {
    let convertedDatesQuery = supabaseAdmin
      .from("leads_customers")
      .select("created_at")
      .eq("status", "Converted")
      .limit(10);
      
    if (projectId) {
      const { data: project } = await supabaseAdmin.from("projects").select("name").eq("id", projectId).single();
      if (project) convertedDatesQuery = convertedDatesQuery.eq("project_interest", project.name);
    }
    const { data: convertedLeadsDates } = await convertedDatesQuery;

    if (convertedLeadsDates && convertedLeadsDates.length) {
      let totalDays = 0;
      convertedLeadsDates.forEach((lead) => {
        const created = new Date(lead.created_at);
        const convertedDate = new Date(lead.created_at); // not accurate, but for mock
        totalDays += 15; // placeholder
      });
      avgSalesCycle = Math.round(totalDays / convertedLeadsDates.length);
    } else {
      avgSalesCycle = 23;
    }
  } else {
    avgSalesCycle = 23;
  }

  // Top channel: source with highest count
  let topChannel = "Direct";
  let maxCount = 0;
  for (const [src, count] of Object.entries(sourceCount)) {
    if (count > maxCount) {
      maxCount = count;
      topChannel = src;
    }
  }

  // Month-over-month growth (compare last month vs previous month)
  let momGrowth = 0;
  if (sortedMonths.length >= 2) {
    const lastMonth = sortedMonths[sortedMonths.length - 1];
    const prevMonth = sortedMonths[sortedMonths.length - 2];
    const lastRev = revenueByMonth[lastMonth] || 0;
    const prevRev = revenueByMonth[prevMonth] || 0;
    momGrowth = prevRev > 0 ? ((lastRev - prevRev) / prevRev) * 100 : 0;
  }

  return {
    revenueTrend,
    sourceDistribution,
    brokerPerformance,
    funnelData,
    kpis: {
      totalRevenue,
      avgDealSize,
      conversionRate,
      avgSalesCycle,
      topChannel: `${topChannel} (${maxCount} leads)`,
      momGrowth,
    },
  };
}
