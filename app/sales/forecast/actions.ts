"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export type ForecastPeriod = "month" | "quarter" | "year";

function getDateRange(period: ForecastPeriod): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  let start = new Date(now);

  switch (period) {
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

export interface ForecastData {
  confirmedRevenue: number;      // payments received (actual)
  projectedRevenue: number;      // from leads in negotiation (high probability)
  stretchRevenue: number;        // optimistic: leads in site visit + negotiation
  totalPipeline: number;         // total value of all active leads
  monthlyTrend: { month: string; confirmed: number; projected: number }[];
}

export async function getForecastData(period: ForecastPeriod): Promise<ForecastData> {
  const { start, end } = getDateRange(period);
  const startISO = start.toISOString();
  const endISO = end.toISOString();

  const cookieStore = cookies();
  const projectId = cookieStore.get("project_id")?.value;

  // 1. Confirmed revenue = payments received within period
  let paymentsQuery = supabaseAdmin
    .from("payments")
    .select("amount, payment_date")
    .gte("payment_date", startISO.split("T")[0])
    .lte("payment_date", endISO.split("T")[0])
    .eq("status", "Received");

  // Fetch active leads (not lost, not converted) within period
  let leadsQuery = supabaseAdmin
    .from("leads_customers")
    .select("status, flat_type_interest, created_at")
    .gte("created_at", startISO)
    .lte("created_at", endISO)
    .not("status", "in", "(Converted, Lost)");

  if (projectId) {
    paymentsQuery = paymentsQuery.eq("project_id", projectId);
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("name")
      .eq("id", projectId)
      .single();
    if (project) {
      leadsQuery = leadsQuery.eq("project_interest", project.name);
    }
  }

  const { data: payments } = await paymentsQuery;
  const { data: leads } = await leadsQuery;

  const confirmedRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  // 2. Leads with their potential value (join with flats_inventory)
  // We'll estimate value from flat_type_interest and project_interest.
  // For simplicity, we assign average prices per flat type (configurable).
  const avgPrices: Record<string, number> = {
    "1BHK": 5000000,
    "2BHK": 8000000,
    "3BHK": 12000000,
    "4BHK": 18000000,
    "Villa": 25000000,
  };

  // Projected = leads in Negotiation (high probability) * 0.7 weight
  // Stretch = leads in Site Visit Scheduled (medium) * 0.4 + Negotiation * 0.9
  let projectedRevenue = 0;
  let stretchRevenue = 0;
  let totalPipeline = 0;

  leads?.forEach((lead) => {
    const value = avgPrices[lead.flat_type_interest || "2BHK"] || 8000000;
    totalPipeline += value;

    if (lead.status === "Negotiation") {
      projectedRevenue += value * 0.7;
      stretchRevenue += value * 0.9;
    } else if (lead.status === "Site Visit Scheduled") {
      stretchRevenue += value * 0.4;
    }
  });

  // Build monthly trend (group by month)
  const monthlyMap: Record<string, { confirmed: number; projected: number }> = {};

  // Add confirmed payments by month
  payments?.forEach((p) => {
    const month = p.payment_date.slice(0, 7); // YYYY-MM
    if (!monthlyMap[month]) monthlyMap[month] = { confirmed: 0, projected: 0 };
    monthlyMap[month].confirmed += p.amount;
  });

  // Add projected by month from leads created that month
  leads?.forEach((lead) => {
    const month = lead.created_at.slice(0, 7);
    if (!monthlyMap[month]) monthlyMap[month] = { confirmed: 0, projected: 0 };
    const value = avgPrices[lead.flat_type_interest || "2BHK"] || 8000000;
    if (lead.status === "Negotiation") {
      monthlyMap[month].projected += value * 0.7;
    } else if (lead.status === "Site Visit Scheduled") {
      monthlyMap[month].projected += value * 0.4;
    }
  });

  const monthlyTrend = Object.entries(monthlyMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, data]) => ({
      month,
      confirmed: data.confirmed,
      projected: data.projected,
    }));

  return {
    confirmedRevenue,
    projectedRevenue,
    stretchRevenue,
    totalPipeline,
    monthlyTrend,
  };
}
