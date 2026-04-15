import { supabase } from "@/lib/supabase";
import LeadsClient from "./leads-client";

export const dynamic = 'force-dynamic';

export default async function LeadsOverviewPage() {
  const { data: leads, error } = await supabase
    .from("leads_customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching leads:", error);

  return <LeadsClient leads={leads || []} />;
}
