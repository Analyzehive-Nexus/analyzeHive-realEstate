import { supabase } from "@/lib/supabase";
import FinancialsClient from "./financials-client";

export const dynamic = 'force-dynamic';

export default async function FinancialsPage() {
  const [
    { data: expenses },
    { data: payments },
    { data: leads },
    { data: flats }
  ] = await Promise.all([
    supabase.from("expenses").select("*").order("date", { ascending: false }),
    supabase
      .from("payments")
      .select(`
        *,
        leads_customers(name),
        flats_inventory(project, flat_number)
      `)
      .order("payment_date", { ascending: false }),
    supabase.from("leads_customers").select("id, name").order("name", { ascending: true }),
    supabase.from("flats_inventory").select("flat_id, project, flat_number").order("flat_number", { ascending: true })
  ]);

  // Aggregate expenses for PieChart
  const expenseCategories = ['Marketing', 'Construction', 'Operations', 'Salaries', 'Other'];
  const expenseBreakdown = expenseCategories.map(cat => ({ name: cat, value: 0 }));
  
  expenses?.forEach(exp => {
    const catObj = expenseBreakdown.find(c => c.name === exp.category);
    if (catObj) {
      catObj.value += Number(exp.amount);
    } else {
      // Fallback
      expenseBreakdown.find(c => c.name === 'Other')!.value += Number(exp.amount);
    }
  });

  // Filter out zero-value categories for cleaner chart
  const pieData = expenseBreakdown.filter(d => d.value > 0);

  return (
    <FinancialsClient 
      expenses={expenses || []}
      payments={payments || []}
      leads={leads || []}
      flats={flats || []}
      pieData={pieData}
    />
  );
}
