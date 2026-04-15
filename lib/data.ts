import { supabase } from './supabase';

// ==========================================
// SALES FUNCTIONS
// ==========================================

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads_customers')
    .select(`
      *,
      assigned_user:users(id, name, avatar_initials)
    `)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getLeadById(id: string) {
  const { data, error } = await supabase
    .from('leads_customers')
    .select(`
      *,
      assigned_user:users(id, name, avatar_initials),
      site_visits(*),
      documents(*),
      payments(*)
    `)
    .eq('id', id)
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function getLeadsStats() {
  const { data, error } = await supabase
    .from('leads_customers')
    .select('status, source');
  if (error) { console.error(error); return null; }
  
  const total = data.length;
  const newLeads = data.filter(
    l => l.status === 'New').length;
  const contacted = data.filter(
    l => l.status === 'Contacted').length;
  const siteVisit = data.filter(
    l => l.status === 'Site Visit Scheduled').length;
  const negotiation = data.filter(
    l => l.status === 'Negotiation').length;
  const converted = data.filter(
    l => l.status === 'Converted').length;
  const lost = data.filter(
    l => l.status === 'Lost').length;

  return { 
    total, newLeads, contacted, 
    siteVisit, negotiation, 
    converted, lost 
  };
}

export async function createLead(lead: {
  name: string;
  phone: string;
  email?: string;
  source: string;
  assigned_user_id?: string;
  project_interest?: string;
  flat_type_interest?: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('leads_customers')
    .insert(lead)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function updateLeadStatus(
  id: string, 
  status: string
) {
  const { data, error } = await supabase
    .from('leads_customers')
    .update({ 
      status, 
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function getFlatsInventory() {
  const { data, error } = await supabase
    .from('flats_inventory')
    .select('*')
    .order('project')
    .order('flat_number');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getFlatsStats() {
  const { data, error } = await supabase
    .from('flats_inventory')
    .select('status');
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    available: data.filter(
      f => f.status === 'Available').length,
    onHold: data.filter(
      f => f.status === 'On Hold').length,
    sold: data.filter(
      f => f.status === 'Sold').length,
  };
}

export async function updateFlatStatus(
  flatId: string, 
  status: string
) {
  const { data, error } = await supabase
    .from('flats_inventory')
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq('flat_id', flatId)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function getSiteVisits() {
  const { data, error } = await supabase
    .from('site_visits')
    .select(`
      *,
      lead:leads_customers(
        id, name, phone, email
      ),
      flat:flats_inventory(
        flat_id, flat_number, 
        project, type
      ),
      broker:users(id, name, avatar_initials)
    `)
    .order('scheduled_at', { ascending: true });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      lead:leads_customers(id, name, phone),
      verified_by_user:users(id, name)
    `)
    .order('uploaded_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      lead:leads_customers(id, name, phone),
      flat:flats_inventory(
        flat_id, flat_number, project
      )
    `)
    .order('payment_date', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getBrokers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('role', ['BROKER', 'VP_SALES'])
    .eq('status', 'Active');
  if (error) { console.error(error); return []; }
  return data;
}

// ==========================================
// CONSTRUCTION FUNCTIONS
// ==========================================

export async function getInventoryItems() {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('category')
    .order('name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getInventoryStats() {
  const { data, error } = await supabase
    .from('inventory_items')
    .select(
      'current_stock_level, min_threshold'
    );
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    good: data.filter(
      i => i.current_stock_level > 
        i.min_threshold * 2).length,
    low: data.filter(
      i => i.current_stock_level > 
        i.min_threshold && 
        i.current_stock_level <= 
        i.min_threshold * 2).length,
    critical: data.filter(
      i => i.current_stock_level <= 
        i.min_threshold).length,
  };
}

export async function getMaterialDemands() {
  const { data, error } = await supabase
    .from('material_demands')
    .select(`
      *,
      item:inventory_items(
        id, name, category, 
        unit_of_measurement
      ),
      requested_by:users(id, name),
      approved_by:users(id, name)
    `)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function approveDemand(
  id: string, 
  approvedBy: string
) {
  const { data: demand } = await supabase
    .from('material_demands')
    .select('*, item:inventory_items(*)')
    .eq('id', id)
    .single();

  if (!demand) return null;

  const { error: updateError } = await supabase
    .from('material_demands')
    .update({
      status: 'Approved',
      approved_by_user_id: approvedBy,
    })
    .eq('id', id);

  if (updateError) return null;

  await supabase
    .from('inventory_items')
    .update({
      current_stock_level: 
        demand.item.current_stock_level - 
        demand.quantity_requested,
      updated_at: new Date().toISOString()
    })
    .eq('id', demand.item_id);

  return true;
}

export async function rejectDemand(
  id: string, 
  rejectedBy: string
) {
  const { error } = await supabase
    .from('material_demands')
    .update({
      status: 'Rejected',
      approved_by_user_id: rejectedBy,
    })
    .eq('id', id);
  if (error) return null;
  return true;
}

export async function getAssets() {
  const { data, error } = await supabase
    .from('assets_equipment')
    .select(`
      *,
      assigned_user:users(id, name)
    `)
    .order('status')
    .order('name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getAssetsStats() {
  const { data, error } = await supabase
    .from('assets_equipment')
    .select('status');
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    active: data.filter(
      a => a.status === 'Active').length,
    maintenance: data.filter(
      a => a.status === 'Maintenance').length,
    decommissioned: data.filter(
      a => a.status === 'Decommissioned').length,
  };
}

export async function getLabourAttendance(
  date?: string
) {
  const targetDate = date || 
    new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('labour_attendance')
    .select('*')
    .eq('date', targetDate)
    .order('role')
    .order('worker_name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getAttendanceStats(
  date?: string
) {
  const targetDate = date || 
    new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('labour_attendance')
    .select('status, role')
    .eq('date', targetDate);
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    present: data.filter(
      l => l.status === 'Present').length,
    absent: data.filter(
      l => l.status === 'Absent').length,
    halfDay: data.filter(
      l => l.status === 'Half Day').length,
    onLeave: data.filter(
      l => l.status === 'On Leave').length,
  };
}

export async function getDailyProgress() {
  const { data, error } = await supabase
    .from('daily_progress')
    .select(`
      *,
      submitted_by_user:users(id, name)
    `)
    .order('date', { ascending: false })
    .limit(20);
  if (error) { console.error(error); return []; }
  return data;
}

export async function getVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('name');
  if (error) { console.error(error); return []; }
  return data;
}

// ==========================================
// FINANCE / MD FUNCTIONS
// ==========================================

export async function getFinancialLedger() {
  const { data, error } = await supabase
    .from('financial_ledger')
    .select(`
      *,
      logged_by:users(id, name)
    `)
    .order('transaction_date', 
      { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getFinancialStats() {
  const { data, error } = await supabase
    .from('financial_ledger')
    .select('transaction_type, amount, category')
    .eq('status', 'Approved');
  if (error) { console.error(error); return null; }
  
  const totalRevenue = data
    .filter(t => t.transaction_type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = data
    .filter(t => t.transaction_type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 
    ? (netProfit / totalRevenue * 100).toFixed(1) 
    : '0';

  const marketingSpend = data
    .filter(t => 
      t.transaction_type === 'Expense' && 
      t.category === 'Marketing')
    .reduce((sum, t) => sum + t.amount, 0);

  const constructionSpend = data
    .filter(t => 
      t.transaction_type === 'Expense' && 
      t.category === 'Construction')
    .reduce((sum, t) => sum + t.amount, 0);

  return { 
    totalRevenue, totalExpenses, 
    netProfit, profitMargin,
    marketingSpend, constructionSpend
  };
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getProjectsStats() {
  const { data, error } = await supabase
    .from('projects')
    .select(
      'status, completion_percentage, ' +
      'budget_total, budget_spent'
    );
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    active: data.filter(
      (p: any) => p.status === 'Active').length,
    completed: data.filter(
      (p: any) => p.status === 'Completed').length,
    avgCompletion: (
      data.reduce((sum: number, p: any) => 
        sum + p.completion_percentage, 0
      ) / data.length
    ).toFixed(1),
    totalBudget: data.reduce(
      (sum: number, p: any) => sum + p.budget_total, 0),
    totalSpent: data.reduce(
      (sum: number, p: any) => sum + p.budget_spent, 0),
  };
}
