"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addAsset(
  name: string,
  type: string,
  serialNumber?: string,
  purchaseDate?: string,
  purchaseCost?: number,
  location?: string
) {
  try {
    if (!name || !type) {
      return { error: "Asset Name and Type are required." };
    }

    const { data, error } = await supabaseAdmin
      .from("assets_equipment")
      .insert({
        asset_name: name,
        asset_type: type,
        serial_number: serialNumber || null,
        purchase_date: purchaseDate || null,
        purchase_cost: purchaseCost || 0,
        current_location: location || "Storage",
        total_hours_used: 0,
        status: "Active",
        next_maintenance_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/assets");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in addAsset action:", error);
    return { error: error.message };
  }
}

export async function updateAssetStatus(assetId: string, status: string) {
  try {
    if (!assetId || !status) {
      return { error: "Missing asset ID or status parameter." };
    }

    const payload: any = { status };
    if (status === "Active") {
      payload.last_maintenance_date = new Date().toISOString().split("T")[0];
      payload.next_maintenance_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    }

    const { data, error } = await supabaseAdmin
      .from("assets_equipment")
      .update(payload)
      .eq("id", assetId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/assets");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in updateAssetStatus action:", error);
    return { error: error.message };
  }
}

export async function assignAsset(
  assetId: string,
  assignedUserId: string | null,
  location: string
) {
  try {
    if (!assetId) {
      return { error: "Missing asset ID parameter." };
    }

    const { data, error } = await supabaseAdmin
      .from("assets_equipment")
      .update({
        assigned_user_id: assignedUserId || null,
        current_location: location || "Storage"
      })
      .eq("id", assetId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/assets");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in assignAsset action:", error);
    return { error: error.message };
  }
}
