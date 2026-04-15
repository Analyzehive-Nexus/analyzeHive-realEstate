import { supabase } from "@/lib/supabase";
import InventoryClient from "./inventory-client";

export const dynamic = 'force-dynamic';

export default async function InventoryOverviewPage() {
  const { data: flats, error } = await supabase
    .from("flats_inventory")
    .select("*")
    .order("project")
    .order("flat_number");

  if (error) console.error("Error fetching flats:", error);

  return <InventoryClient flats={flats || []} />;
}
