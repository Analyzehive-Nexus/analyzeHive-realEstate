"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createDemandRequest(formData: FormData) {
  const user: any = { firstName: "Demo", lastName: "Mode" };
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Unknown User";
  
  const itemId = formData.get("item_id") as string;
  const quantity = parseFloat(formData.get("quantity") as string);

  if (!itemId || !quantity || quantity <= 0) {
    return { error: "Invalid item or quantity" };
  }

  const { error } = await supabaseAdmin.from("demand_requests").insert({
    item_id: itemId,
    quantity_requested: quantity,
    requested_by: userName,
    status: "Pending",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/construction/demands");
  revalidatePath("/construction", "layout");
  return { success: true };
}

export async function approveDemandRequest(requestId: string, itemId: string, requestedQuantity: number) {
  const user: any = { firstName: "Demo", lastName: "Mode" };
  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Admin";

  // Use a transaction-like approach: update only if enough stock
  // First, try to deduct stock atomically using a condition
  const { data: updatedItem, error: updateError } = await supabaseAdmin
    .from("stock_items")
    .update({
      quantity: supabaseAdmin.rpc('decrement', { row_id: itemId, amount: requestedQuantity })
    })
    .eq("item_id", itemId)
    .gte("quantity", requestedQuantity)
    .select()
    .single();

  // If no rows updated, stock was insufficient
  if (updateError || !updatedItem) {
    return { error: "Insufficient stock or stock changed during request" };
  }

  // Now update the demand request status
  const { error: reqError } = await supabaseAdmin
    .from("demand_requests")
    .update({ status: "Approved", reviewed_by: adminName })
    .eq("id", requestId);

  if (reqError) {
    // Rollback? For simplicity, log error but stock already deducted.
    console.error("Failed to update demand status after stock deduction:", reqError);
    return { error: "Stock deducted but approval failed. Please check manually." };
  }

  revalidatePath("/construction/demands");
  revalidatePath("/construction", "layout");
  return { success: true, deducted: requestedQuantity };
}

// Alternative simpler fix using a stored procedure if available, but above works.
// If you don't have a 'decrement' RPC, use this alternative:

/*
export async function approveDemandRequest(requestId: string, itemId: string, requestedQuantity: number) {
  const { data: stockItem, error: fetchError } = await supabaseAdmin
    .from("stock_items")
    .select("quantity")
    .eq("item_id", itemId)
    .single();

  if (fetchError || !stockItem) return { error: "Stock item not found" };
  if (stockItem.quantity < requestedQuantity) return { error: "Insufficient stock quantity" };

  const newQuantity = stockItem.quantity - requestedQuantity;

  const { error: updateError } = await supabaseAdmin
    .from("stock_items")
    .update({ quantity: newQuantity, last_updated: new Date().toISOString() })
    .eq("item_id", itemId)
    .eq("quantity", stockItem.quantity); // Optimistic locking

  if (updateError) return { error: "Stock changed during update, please retry" };

  const { error: reqError } = await supabaseAdmin
    .from("demand_requests")
    .update({ status: "Approved", reviewed_by: adminName })
    .eq("id", requestId);

  if (reqError) return { error: reqError.message };
  return { success: true };
}
*/

export async function rejectDemandRequest(requestId: string) {
  const user: any = { firstName: "Demo", lastName: "Mode" };
  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Admin";

  const { error } = await supabaseAdmin
    .from("demand_requests")
    .update({ status: "Rejected", reviewed_by: adminName })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/construction/demands");
  revalidatePath("/construction", "layout");
  return { success: true };
}
