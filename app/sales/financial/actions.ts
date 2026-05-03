"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function logExpense(formData: FormData) {
  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const transaction_date = formData.get("transaction_date") as string;
  const status = formData.get("status") as string || "Approved";
  const project_id = formData.get("project_id") as string | null;
  const type = "Expense";

  if (!category || !amount || !transaction_date) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabaseAdmin.from("financial_ledger").insert({
    transaction_type: type,
    category,
    amount,
    description,
    transaction_date,
    status,
    project_id,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to log expense:", error);
    return { error: error.message };
  }

  revalidatePath("/sales/financial");
  return { success: true };
}
