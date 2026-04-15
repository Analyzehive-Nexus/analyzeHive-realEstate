"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addAsset(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string || "Active";

  if (!name || !type) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase.from("assets").insert({
    name,
    type,
    status
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/construction/assets");
  return { success: true };
}

export async function updateAssetStatus(assetId: string, status: string) {
  if (!assetId || !status) return { error: "Invalid parameters" };

  const { error } = await supabase
    .from("assets")
    .update({ status, last_updated: new Date().toISOString() })
    .eq("asset_id", assetId);

  if (error) return { error: error.message };

  revalidatePath("/construction/assets");
  return { success: true };
}
