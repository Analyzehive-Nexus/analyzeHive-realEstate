"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export type Period = "month" | "quarter" | "year";

function getDateRange(period: Period): { start: Date; end: Date } {
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

export interface PnLData {
  totalIncome: number;
  totalExpenses: number;
  grossProfit: number;
  tax: number;
  netProfit: number;
  transactions: {
    id: string;
    date: string;
    type: string;
    category: string;
    amount: number;
    description: string | null;
  }[];
}

export async function getPnLData(period: Period): Promise<PnLData> {
  const { start, end } = getDateRange(period);
  const startDate = start.toISOString().split("T")[0];
  const endDate = end.toISOString().split("T")[0];

  const cookieStore = cookies();
  const projectId = cookieStore.get("project_id")?.value;

  // Fetch all approved transactions within date range
  let query = supabaseAdmin
    .from("financial_ledger")
    .select("id, transaction_type, category, amount, description, transaction_date")
    .eq("status", "Approved")
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate)
    .order("transaction_date", { ascending: false });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching P&L data:", error);
    throw new Error(error.message);
  }

  const transactions = (data || []).map((t) => ({
    id: t.id,
    date: t.transaction_date,
    type: t.transaction_type,
    category: t.category,
    amount: t.amount,
    description: t.description,
  }));

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const grossProfit = totalIncome - totalExpenses;
  const tax = grossProfit * 0.18; // 18% tax
  const netProfit = grossProfit - tax;

  return {
    totalIncome,
    totalExpenses,
    grossProfit,
    tax,
    netProfit,
    transactions,
  };
}
