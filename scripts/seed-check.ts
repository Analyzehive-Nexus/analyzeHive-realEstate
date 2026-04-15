import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
import path from 'path';

loadEnvConfig(path.resolve(__dirname, '../'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } });

// --- MOCK DATA ---
const STABLE_UUID_USERS = Array.from({length: 9}, (_, i) => `00000000-0000-0000-0000-${String(i+1).padStart(12, '0')}`);
const STABLE_UUID_PROJECTS = Array.from({length: 4}, (_, i) => `11111111-1111-1111-1111-${String(i+1).padStart(12, '0')}`);

const USERS = [
  { id: STABLE_UUID_USERS[0], name: 'Arjun Mehta', email: 'arjun@flowestate.com', role: 'VP_SALES', avatar_initials: 'AM' },
  { id: STABLE_UUID_USERS[1], name: 'Priya Sharma', email: 'priya@flowestate.com', role: 'BROKER', avatar_initials: 'PS' },
  { id: STABLE_UUID_USERS[2], name: 'Rahul Desai', email: 'rahul@flowestate.com', role: 'BROKER', avatar_initials: 'RD' },
  { id: STABLE_UUID_USERS[3], name: 'Sneha Rao', email: 'sneha@flowestate.com', role: 'BROKER', avatar_initials: 'SR' },
  { id: STABLE_UUID_USERS[4], name: 'Vikram Singh', email: 'vikram@flowestate.com', role: 'BROKER', avatar_initials: 'VS' },
  { id: STABLE_UUID_USERS[5], name: 'Ananya Gupta', email: 'ananya@flowestate.com', role: 'BROKER', avatar_initials: 'AG' },
  { id: STABLE_UUID_USERS[6], name: 'Karan Patel', email: 'karan@flowestate.com', role: 'BROKER', avatar_initials: 'KP' },
  { id: STABLE_UUID_USERS[7], name: 'Riya Jain', email: 'riya@flowestate.com', role: 'BROKER', avatar_initials: 'RJ' },
  { id: STABLE_UUID_USERS[8], name: 'Admin User', email: 'admin@flowestate.com', role: 'ADMIN', avatar_initials: 'AD' }
];

const PROJECTS = [
  { id: STABLE_UUID_PROJECTS[0], name: 'Lumina Heights', location: 'Whitefield', status: 'Under Construction' },
  { id: STABLE_UUID_PROJECTS[1], name: 'Aurora Towers', location: 'Indiranagar', status: 'Pre-launch' },
  { id: STABLE_UUID_PROJECTS[2], name: 'Zenith Gardens', location: 'Koramangala', status: 'Completed' },
  { id: STABLE_UUID_PROJECTS[3], name: 'Crescent Park', location: 'Jayanagar', status: 'Under Construction' }
];

const LEADS = Array.from({length: 20}, (_, i) => ({
  name: `Lead ${i+1}`,
  phone: `+919876543${String(i).padStart(3, '0')}`,
  email: `lead${i+1}@example.com`,
  source: ['Meta', 'Google', '99acres', 'Direct'][i % 4],
  status: ['New', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Lost'][i % 6],
  assigned_user_id: STABLE_UUID_USERS[(i % 7) + 1],
  project_interest: PROJECTS[i % 4].name,
  flat_type_interest: ['1BHK', '2BHK', '3BHK', '4BHK'][i % 4],
  notes: `Looking for good investment.`,
  created_at: new Date(Date.now() - i * 86400000).toISOString()
}));

const FLATS = Array.from({length: 32}, (_, i) => ({
  project: PROJECTS[i % 4].name,
  project_ref: STABLE_UUID_PROJECTS[i % 4],
  flat_number: `${['A','B','C'][i%3]}-${(Math.floor(i/4)+1)*100 + (i%4 + 1)}`,
  type: ['1BHK', '2BHK', '3BHK', '4BHK'][i % 4],
  floor: Math.floor(i / 4) + 1,
  area_sqft: 800 + (i % 4) * 400,
  price: 5000000 + (i % 4) * 3000000,
  facing: ['East', 'West', 'North', 'South'][i % 4],
  status: ['Available', 'On Hold', 'Sold'][i % 3],
  updated_at: new Date().toISOString()
}));

const VISITS = Array.from({length: 6}, (_, i) => ({
  lead_id: null, // will be mapped
  flat_id: null, // will be mapped
  assigned_user_id: STABLE_UUID_USERS[(i % 7) + 1],
  scheduled_at: new Date(Date.now() + i * 86400000).toISOString(),
  status: ['Scheduled', 'Completed', 'No Show'][i % 3],
  reminder_sent: false,
  notes: 'Customer specifically requested early morning visit.'
}));

const DOCUMENTS = Array.from({length: 15}, (_, i) => ({
  lead_id: null,
  document_type: ['Aadhar', 'PAN', 'Bank Statement', 'Sale Agreement'][i % 4],
  status: ['Pending', 'Verified', 'Rejected'][i % 3],
  verified_by_user_id: STABLE_UUID_USERS[0],
  uploaded_at: new Date(Date.now() - i * 86400000).toISOString(),
  verified_at: i % 3 === 1 ? new Date().toISOString() : null
}));

const INVENTORY = Array.from({length: 15}, (_, i) => ({
  name: ['Cement', 'Steel', 'Bricks', 'Sand', 'Paint', 'Tiles'][i % 6] + ` Grade ${i}`,
  category: ['Cement', 'Steel', 'Bricks', 'Sand', 'Other'][i % 5],
  quantity: (i + 1) * 100,
  unit: ['Bags', 'Tons', 'Nos', 'CFT', 'Liters'][i % 5],
  status: 'In Stock',
  last_updated: new Date().toISOString()
}));

const MATERIAL_DEMANDS = Array.from({length: 8}, (_, i) => ({
  item_id: null,
  quantity_requested: (i + 1) * 20,
  requested_by: `Supervisor ${i+1}`,
  status: ['Pending', 'Approved', 'Rejected'][i % 3],
  reviewed_by: STABLE_UUID_USERS[0],
  created_at: new Date(Date.now() - i * 86400000).toISOString()
}));

const ASSETS = Array.from({length: 8}, (_, i) => ({
  name: ['Excavator Model X', 'Generator 500KVA', 'Tower Crane Q', 'Concrete Mixer'][i % 4] + ` - ${i}`,
  type: ['Excavator', 'Generator', 'Crane', 'Mixer', 'Other'][i % 5],
  status: ['Active', 'Maintenance', 'Decommissioned'][i % 3],
  last_updated: new Date().toISOString()
}));

const LABOUR = Array.from({length: 20}, (_, i) => ({
  name: `Labourer ${i+1}`,
  role: ['Mason', 'Carpenter', 'Plumber', 'Electrician', 'Helper'][i % 5],
  attendance_status: ['Present', 'Absent', 'Half Day'][i % 3],
  date: new Date().toISOString().split('T')[0],
  wages: 500 + (i % 4) * 100
}));

const DAILY_PROGRESS = Array.from({length: 8}, (_, i) => ({
  project: STABLE_UUID_PROJECTS[i % 4],
  date: new Date(Date.now() - (i % 2) * 86400000).toISOString().split('T')[0],
  block_subtask: `Block ${['A','B'][i%2]} Slab ${i+1}`,
  completion_pct: 10 * (i + 1),
  status: 'In Progress',
  notes: 'Slight delay due to rain'
}));

const VENDORS = Array.from({length: 8}, (_, i) => ({
  name: `Vendor ${i+1} Corp`,
  category: ['Materials', 'Services', 'Equipment'][i % 3],
  contact_person: `Contact ${i+1}`,
  phone: `+9188888888${i}`,
  email: `vendor${i+1}@example.com`,
  status: 'Active'
}));

const LEDGER = Array.from({length: 15}, (_, i) => ({
  transaction_type: i % 2 === 0 ? 'Income' : 'Expense',
  category: i % 2 === 0 ? 'Sales' : ['Marketing', 'Construction', 'Operations', 'Salaries'][i % 4],
  amount: 10000 + i * 5000,
  description: `Payment for XYZ ${i}`,
  transaction_date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  status: 'Approved'
}));

// --- SEEDER FUNCS ---
async function clearTable(table: string) {
  await supabaseAdmin.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000') // delete all trick by not equal to a dummy id
  // wait, for tables without 'id', this fails.
  // We're just appending if empty.
}

async function checkAndSeed() {
  console.log('Starting seed check...');
  
  const tables = [
    { name: 'users', data: USERS, needed: 9 },
    { name: 'projects', data: PROJECTS, needed: 4 },
    { name: 'leads_customers', data: LEADS, needed: 20 },
    { name: 'flats_inventory', data: FLATS, needed: 32 },
    // site_visits need lead_id and flat_id mapping
    { name: 'inventory_items', data: INVENTORY, needed: 15 },
    { name: 'assets_equipment', data: ASSETS, needed: 8 },
    { name: 'labour_attendance', data: LABOUR, needed: 20 },
    { name: 'daily_progress', data: DAILY_PROGRESS, needed: 8 },
    { name: 'vendors', data: VENDORS, needed: 8 },
    { name: 'financial_ledger', data: LEDGER, needed: 15 },
  ];

  for (const t of tables) {
    try {
      const { count, error } = await supabaseAdmin.from(t.name).select('*', { count: 'exact', head: true });
      if (error) {
        if (error.code === '42P01') {
          console.error(`Table ${t.name} does not exist! Please create it first.`);
          continue;
        }
        console.error(`Error checking ${t.name}:`, error.message);
        continue;
      }
      
      if (count === 0) {
        console.log(`Seeding ${t.name} with ${t.needed} rows...`);
        const { error: insertErr } = await supabaseAdmin.from(t.name).insert(t.data);
        if (insertErr) console.error(`Failed seeding ${t.name}:`, insertErr.message);
        else console.log(`${t.name} seeded successfully.`);
      } else {
        console.log(`${t.name} already has ${count} rows. Skipping.`);
      }
    } catch (e: any) {
      console.error(`Error with ${t.name}:`, e.message);
    }
  }

  // Dependent tables
  try {
    const { data: leadsData } = await supabaseAdmin.from('leads_customers').select('id').limit(20);
    const { data: flatsData } = await supabaseAdmin.from('flats_inventory').select('flat_id').limit(32);
    const { data: inventoryData } = await supabaseAdmin.from('inventory_items').select('id').limit(15);
    
    // Site Visits
    const { count: vCount } = await supabaseAdmin.from('site_visits').select('*', { count: 'exact', head: true });
    if (vCount === 0 && leadsData?.length && flatsData?.length) {
      console.log('Seeding site_visits...');
      const mappedVisits = VISITS.map((v, i) => ({
        ...v,
        lead_id: leadsData[i % leadsData.length].id,
        flat_id: flatsData[i % flatsData.length].flat_id
      }));
      await supabaseAdmin.from('site_visits').insert(mappedVisits);
      console.log('site_visits seeded.');
    } else {
      console.log('site_visits already has data or missing dependencies.');
    }

    // Documents
    const { count: dCount } = await supabaseAdmin.from('documents').select('*', { count: 'exact', head: true });
    if (dCount === 0 && leadsData?.length) {
      console.log('Seeding documents...');
      const mappedDocs = DOCUMENTS.map((d, i) => ({
        ...d,
        lead_id: leadsData[i % leadsData.length].id
      }));
      await supabaseAdmin.from('documents').insert(mappedDocs);
      console.log('documents seeded.');
    } else {
      console.log('documents already has data or missing dependencies.');
    }

    // Material Demands
    const { count: mCount } = await supabaseAdmin.from('material_demands').select('*', { count: 'exact', head: true });
    if (mCount === 0 && inventoryData?.length) {
      console.log('Seeding material_demands...');
      const mappedDemands = MATERIAL_DEMANDS.map((m, i) => ({
        ...m,
        item_id: inventoryData[i % inventoryData.length].id
      }));
      await supabaseAdmin.from('material_demands').insert(mappedDemands);
      console.log('material_demands seeded.');
    } else {
      console.log('material_demands already has data or missing dependencies.');
    }

  } catch(e: any) {
    console.error('Error in dependent tables:', e.message);
  }
}

checkAndSeed().then(() => {
  console.log('Seed check complete.');
  process.exit();
});
