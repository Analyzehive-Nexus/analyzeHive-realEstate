import { supabase } from "@/lib/supabase"
import { InventoryClient } from "./components/inventory-client"

export const dynamic = "force-dynamic"

export default async function InventoryPage() {
  const { data: inventory, error } = await supabase
    .from("flats_inventory")
    .select("*")
    .order("project")
    .order("flat_number")

  if (error) {
    console.error("Error fetching inventory:", error)
    return <div className="p-4 text-red-500">Failed to load inventory data.</div>
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Inventory</h1>
        <p className="text-slate-500 text-sm">Manage flat availability and view real-time status.</p>
      </div>

      <InventoryClient initialData={inventory || []} />
    </div>
  )
}
