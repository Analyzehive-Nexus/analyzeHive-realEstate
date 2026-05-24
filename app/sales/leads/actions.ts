"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function createLeadAction(formData: FormData) {
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const source = formData.get("source") as string
  const assigned_broker = formData.get("assigned_broker") as string

  const { data, error } = await supabaseAdmin
    .from("leads_customers")
    .insert([
      {
        name,
        phone,
        email: email || null,
        source,
        assigned_broker_id: assigned_broker,
        status: "New"
      }
    ])
    .select()
    .single()

  if (error) {
    console.error("Failed to insert lead:", error)
    return { success: false, error: error.message }
  }

  const headersList = headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  try {
    fetch(`${baseUrl}/api/webhooks/lead-created`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead: data })
    })
  } catch(e) {
    console.error("Webhook trigger failed", e)
  }

  revalidatePath("/sales/leads")
  return { success: true, data }
}

export async function updateLeadStatusAction(id: string, status: string) {
  const { error } = await supabaseAdmin
    .from("leads_customers")
    .update({ status })
    .eq("id", id)

  if (error) {
    console.error("Failed to update status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/sales/leads")
  return { success: true }
}

export async function deleteLeadAction(id: string) {
  try {
    if (!id) return { error: "Missing lead ID" };
    const { error } = await supabaseAdmin
      .from("leads_customers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete lead:", error);
      return { error: error.message };
    }

    revalidatePath("/sales/leads");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteLeadAction:", error);
    return { error: error.message };
  }
}
