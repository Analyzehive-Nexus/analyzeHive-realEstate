"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addStockItem(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const quantity = parseFloat(formData.get("quantity") as string) || 0;
  const unit = formData.get("unit") as string;

  if (!name || !category || !unit) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabaseAdmin.from("stock_items").insert({
    name,
    category,
    quantity,
    unit,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/construction/stock");
  return { success: true };
}

export async function restockItem(formData: FormData) {
  const itemId = formData.get("item_id") as string;
  const quantityToAdd = parseFloat(formData.get("quantity") as string) || 0;

  if (!itemId || quantityToAdd <= 0) {
    return { error: "Invalid quantity or item" };
  }

  const { data: item, error: fetchError } = await supabaseAdmin
    .from("stock_items")
    .select("quantity")
    .eq("item_id", itemId)
    .single();

  if (fetchError || !item) {
    return { error: "Item not found" };
  }

  const newQuantity = Number(item.quantity) + quantityToAdd;

  const { error: updateError } = await supabaseAdmin
    .from("stock_items")
    .update({ quantity: newQuantity, last_updated: new Date().toISOString() })
    .eq("item_id", itemId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/construction/stock");
  return { success: true };
}
