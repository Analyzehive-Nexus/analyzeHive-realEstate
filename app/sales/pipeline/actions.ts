"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getLeadsForPipeline() {
  const session = await getSessionUser();
  if (!session) return [];

  let query = supabaseAdmin.from("leads_customers").select("*");
  if (session.role === "BROKER") {
    query = query.eq("assigned_user_id", session.id);
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const session = await getSessionUser();
  if (!session) return { error: "Unauthorized" };
  
  // Optional: check if BROKER can only update their own leads
  if (session.role === "BROKER") {
    // Check ownership first
    const { data: lead } = await supabaseAdmin
      .from("leads_customers")
      .select("assigned_user_id")
      .eq("id", leadId)
      .single();
    if (!lead || lead.assigned_user_id !== session.id) {
      return { error: "Unauthorized" };
    }
  }

  const { error } = await supabaseAdmin
    .from("leads_customers")
    .update({ status: newStatus })
    .eq("id", leadId);
    
  if (error) return { error: error.message };
  
  revalidatePath("/sales/pipeline");
  return { success: true };
}
