"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function scheduleVisitAction(formData: FormData) {
  const lead_id = formData.get("lead_id") as string
  const flat_id = formData.get("flat_id") as string
  const scheduled_at = formData.get("scheduled_at") as string

  if (!lead_id || !flat_id || !scheduled_at) {
    return { success: false, error: "Missing required fields" }
  }

  const { data, error } = await supabaseAdmin
    .from("site_visits")
    .insert([{
      lead_id,
      flat_id,
      scheduled_at,
      status: "Scheduled",
      reminder_sent: false
    }])
    .select(`
      visit_id, scheduled_at, status, reminder_sent,
      leads_customers (id, name, phone),
      flats_inventory (flat_id, project, flat_number)
    `)
    .single()

  if (error) {
    console.error("Failed to schedule visit:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/sales/visits")
  return { success: true, data }
}

export async function updateVisitStatusAction(visitId: string, status: string) {
  const { error } = await supabaseAdmin
    .from("site_visits")
    .update({ status })
    .eq("visit_id", visitId)

  if (error) {
    console.error("Failed to update visit status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/sales/visits")
  return { success: true }
}
