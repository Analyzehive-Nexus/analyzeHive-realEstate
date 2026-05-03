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

export interface CashFlowData {
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  monthlyData: { month: string; inflow: number; outflow: number }[];
  transactions: {
    id: string;
    date: string;
    type: string;
    category: string;
    amount: number;
    description: string | null;
  }[];
}

export async function getCashFlowData(period: Period): Promise<CashFlowData> {
  const { start, end } = getDateRange(period);
  const startDate = start.toISOString().split("T")[0];
  const endDate = end.toISOString().split("T")[0];

  const cookieStore = cookies();
  const projectId = cookieStore.get("project_id")?.value;

  let query = supabaseAdmin
    .from("financial_ledger")
    .select("id, transaction_type, category, amount, description, transaction_date")
    .eq("status", "Approved")
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate)
    .order("transaction_date", { ascending: true });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const transactions = (data || []).map((t) => ({
    id: t.id,
    date: t.transaction_date,
    type: t.transaction_type,
    category: t.category,
    amount: t.amount,
    description: t.description,
  }));

  const totalInflow = transactions
    .filter((t) => t.type === "Income")
    .reduce((s, t) => s + t.amount, 0);
  const totalOutflow = transactions
    .filter((t) => t.type === "Expense")
    .reduce((s, t) => s + t.amount, 0);
  const netCashFlow = totalInflow - totalOutflow;

  // Group by month
  const monthlyMap: Record<string, { inflow: number; outflow: number }> = {};
  transactions.forEach((t) => {
    const month = t.date.slice(0, 7);
    if (!monthlyMap[month]) monthlyMap[month] = { inflow: 0, outflow: 0 };
    if (t.type === "Income") monthlyMap[month].inflow += t.amount;
    else monthlyMap[month].outflow += t.amount;
  });

  const monthlyData = Object.entries(monthlyMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, vals]) => ({ month, inflow: vals.inflow, outflow: vals.outflow }));

  return { totalInflow, totalOutflow, netCashFlow, monthlyData, transactions };
}
