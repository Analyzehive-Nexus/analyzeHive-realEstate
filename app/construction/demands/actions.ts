"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
// import { withAuth } from "@workos-inc/authkit-nextjs";

export async function createDemandRequest(formData: FormData) {
  // const { user } = await withAuth();
  const user: any = { firstName: "Demo", lastName: "Mode" };
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Unknown User";
  
  const itemId = formData.get("item_id") as string;
  const quantity = parseFloat(formData.get("quantity") as string);

  if (!itemId || !quantity || quantity <= 0) {
    return { error: "Invalid item or quantity" };
  }

  const { error } = await supabase.from("demand_requests").insert({
    item_id: itemId,
    quantity_requested: quantity,
    requested_by: userName,
    status: "Pending",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/construction/demands");
  // Also revalidate layout to update red badge
  revalidatePath("/construction", "layout");
  return { success: true };
}

export async function approveDemandRequest(requestId: string, itemId: string, requestedQuantity: number) {
  // const { user } = await withAuth();
  const user: any = { firstName: "Demo", lastName: "Mode" };
  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Admin";

  // First, fetch current stock to ensure enough quantity
  const { data: stockItem, error: stockFetchError } = await supabase
    .from("stock_items")
    .select("quantity")
    .eq("item_id", itemId)
    .single();

  if (stockFetchError || !stockItem) return { error: "Stock item not found" };

  if (stockItem.quantity < requestedQuantity) {
    return { error: "Insufficient stock quantity" };
  }

  // Update request status
  const { error: reqError } = await supabase
    .from("demand_requests")
    .update({ status: "Approved", reviewed_by: adminName })
    .eq("id", requestId);

  if (reqError) return { error: reqError.message };

  // Deduct stock
  const newQuantity = Number(stockItem.quantity) - requestedQuantity;
  const { error: updError } = await supabase
    .from("stock_items")
    .update({ quantity: newQuantity, last_updated: new Date().toISOString() })
    .eq("item_id", itemId);

  if (updError) return { error: updError.message };

  revalidatePath("/construction/demands");
  revalidatePath("/construction", "layout");
  return { success: true, deducted: requestedQuantity };
}

export async function rejectDemandRequest(requestId: string) {
  // const { user } = await withAuth();
  const user: any = { firstName: "Demo", lastName: "Mode" };
  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Admin";

  const { error } = await supabase
    .from("demand_requests")
    .update({ status: "Rejected", reviewed_by: adminName })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/construction/demands");
  revalidatePath("/construction", "layout");
  return { success: true };
}
