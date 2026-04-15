"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function updateFlatStatusAction(flatId: string, status: string) {
  const { data, error } = await supabase
    .from("flats_inventory")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("flat_id", flatId)
    .select()
    .single()

  if (error) {
    console.error("Failed to update flat status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/sales/inventory")
  return { success: true, data }
}
