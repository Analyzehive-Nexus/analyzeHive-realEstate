"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function logExpense(formData: FormData) {
  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;

  if (!category || !amount || !date) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase.from("expenses").insert({
    category,
    amount,
    description,
    date
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/financials");
  revalidatePath("/dashboard"); // Update KPI
  return { success: true };
}

export async function recordPayment(formData: FormData) {
  const leadId = formData.get("leadId") as string;
  const flatId = formData.get("flatId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string;
  
  // Implicitly mark new recorded payments as Received
  const status = formData.get("status") as string || "Received";

  if (!leadId || !flatId || !amount || !date) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase.from("payments").insert({
    lead_id: leadId,
    flat_id: flatId,
    amount,
    payment_date: date,
    status
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/financials");
  revalidatePath("/dashboard"); // Update Revenue KPI
  return { success: true };
}
