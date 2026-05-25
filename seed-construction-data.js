const { createClient } = require('@supabase/supabase-js');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function seed() {
  console.log('========================================');
  console.log('  SEEDING FRESH CONSTRUCTION MOCK DATA');
  console.log('========================================\n');

  const todayStr = new Date().toISOString().split('T')[0];
  console.log(`📅 Today is: ${todayStr}`);

  // Fetch some inventory items and users to link demands and progress
  const { data: items } = await supabase.from('inventory_items').select('*');
  const { data: users } = await supabase.from('users').select('*');
  const { data: vendors } = await supabase.from('vendors').select('*');

  if (!items || items.length === 0) {
    console.error('❌ No inventory items found. Please run base setup first.');
    return;
  }
  if (!users || users.length === 0) {
    console.error('❌ No users found.');
    return;
  }
  if (!vendors || vendors.length === 0) {
    console.error('❌ No vendors found.');
    return;
  }

  const manager = users.find(u => u.role === 'SITE_MANAGER') || users[0];
  const admin = users.find(u => u.role === 'ADMIN') || users[0];

  // 1. Seed Labour Attendance for the last 14 days
  console.log('👷 Seeding labour attendance...');
  const workers = [
    { name: 'Ramesh Kumar', role: 'Mason', phone: '9811111101' },
    { name: 'Suresh Singh', role: 'Mason', phone: '9811111102' },
    { name: 'Dinesh Patel', role: 'Helper', phone: '9811111103' },
    { name: 'Vijay Yadav', role: 'Helper', phone: '9811111104' },
    { name: 'Ravi Verma', role: 'Electrician', phone: '9811111105' },
    { name: 'Amit Mishra', role: 'Electrician', phone: '9811111106' },
    { name: 'Sunil Sharma', role: 'Plumber', phone: '9811111107' },
    { name: 'Pankaj Gupta', role: 'Plumber', phone: '9811111108' },
    { name: 'Manish Joshi', role: 'Carpenter', phone: '9811111109' },
    { name: 'Sanjay Dutt', role: 'Carpenter', phone: '9811111110' },
  ];

  const attendanceRecords = [];
  const statuses = ['Present', 'Present', 'Present', 'Present', 'Present', 'Half Day', 'Present', 'Absent', 'On Leave'];

  // Seed for 14 days leading up to today
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    workers.forEach((w, idx) => {
      // Add slight randomness to status
      const seedVal = (idx + i) % statuses.length;
      const status = statuses[seedVal];
      
      attendanceRecords.push({
        worker_name: w.name,
        role: w.role,
        phone: w.phone,
        date: dateStr,
        status: status,
        check_in: status === 'Present' || status === 'Half Day' ? '08:00:00' : null,
        check_out: status === 'Present' ? '17:00:00' : (status === 'Half Day' ? '12:00:00' : null),
        notes: status === 'On Leave' ? 'Sick leave approved' : null,
        created_at: new Date(d.getTime()).toISOString()
      });
    });
  }

  // Clear existing attendance for these 14 days to prevent duplicates
  const startDateStr = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString().split('T')[0];
  await supabase.from('labour_attendance').delete().gte('date', startDateStr);

  const { data: insertedAttendance, error: attErr } = await supabase
    .from('labour_attendance')
    .insert(attendanceRecords)
    .select();

  if (attErr) {
    console.error('❌ Error seeding attendance:', attErr.message);
  } else {
    console.log(`✅ Seeded ${insertedAttendance.length} labour attendance rows!`);
  }

  // 2. Seed Daily Progress Reports for the last 10 days
  console.log('📈 Seeding daily progress reports...');
  const progressRecords = [];
  
  for (let i = 0; i < 10; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Progress for Tower A
    progressRecords.push({
      project_name: 'Tower A',
      floor_area: `Floor ${12 - i}`,
      date: dateStr,
      completion_percentage: 60 + (9 - i) * 3,
      weather: i % 3 === 0 ? 'Cloudy' : 'Sunny',
      workers_present: 30 + (i % 5),
      work_done: `Floor slab structure casting and reinforcement layout for Floor ${12 - i}.`,
      materials_used: [
        { name: 'Cement OPC 53', qty: 25 },
        { name: 'Steel TMT 12mm', qty: 12 }
      ],
      submitted_by: manager.id,
      created_at: new Date(d.getTime()).toISOString()
    });

    // Progress for Tower B
    progressRecords.push({
      project_name: 'Tower B',
      floor_area: `Floor ${8 - i}`,
      date: dateStr,
      completion_percentage: 40 + (9 - i) * 4,
      weather: i % 3 === 0 ? 'Cloudy' : 'Sunny',
      workers_present: 25 + (i % 4),
      work_done: `Brick masonry wall layout and electrical piping works for Floor ${8 - i}.`,
      materials_used: [
        { name: 'Red Bricks', qty: 1500 },
        { name: 'Cement OPC 53', qty: 10 }
      ],
      submitted_by: manager.id,
      created_at: new Date(d.getTime()).toISOString()
    });
  }

  await supabase.from('daily_progress').delete().gte('date', startDateStr);
  const { data: insertedProgress, error: progErr } = await supabase
    .from('daily_progress')
    .insert(progressRecords)
    .select();

  if (progErr) {
    console.error('❌ Error seeding progress:', progErr.message);
  } else {
    console.log(`✅ Seeded ${insertedProgress.length} daily progress report rows!`);
  }

  // 3. Seed Material Demands
  console.log('📋 Seeding material demands...');
  const demandRecords = [];
  const demandStatuses = ['Pending', 'Approved', 'Rejected', 'Approved', 'Pending', 'Approved'];

  items.forEach((item, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (index % 5));
    const status = demandStatuses[index % demandStatuses.length];

    demandRecords.push({
      item_id: item.id,
      quantity_requested: 20 + index * 5,
      requested_by_user_id: manager.id,
      approved_by_user_id: status !== 'Pending' ? admin.id : null,
      project_tower: index % 2 === 0 ? 'Tower A' : 'Tower B',
      justification: `Immediate requirement for floor casting and structural laying.`,
      required_by: new Date(d.getTime() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: status,
      created_at: d.toISOString()
    });
  });

  // Clear older demands
  await supabase.from('material_demands').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
  const { data: insertedDemands, error: demErr } = await supabase
    .from('material_demands')
    .insert(demandRecords)
    .select();

  if (demErr) {
    console.error('❌ Error seeding demands:', demErr.message);
  } else {
    console.log(`✅ Seeded ${insertedDemands.length} material demands!`);
  }

  // 4. Seed Financial Ledger Records (for Budget vs Actual charts)
  console.log('💰 Seeding financial ledger...');
  const categories = ['Construction', 'Marketing'];
  const amounts = [150000, 280000, 75000, 45000, 110000, 95000, 420000, 80000];
  const ledgerRecords = [];

  // Seed 15 expenses over the last 30 days to build a rich historical graph
  for (let i = 0; i < 20; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (i * 1.5));
    const dateStr = d.toISOString().split('T')[0];
    const cat = categories[i % categories.length];
    const amt = amounts[i % amounts.length] + (i * 5000);
    const vendor = vendors[i % vendors.length];

    ledgerRecords.push({
      transaction_type: 'Expense',
      category: cat,
      amount: amt,
      description: `Purchase of material / services for ${cat}`,
      invoice_number: `INV-2026-${100 + i}`,
      transaction_date: dateStr,
      status: 'Approved',
      logged_by_user_id: manager.id
    });
  }

  // Also seed some Income to make the finance ledger robust
  ledgerRecords.push({
    transaction_type: 'Income',
    category: 'Construction',
    amount: 1500000,
    description: 'Stage 2 milestone payment received from developer client',
    invoice_number: 'REC-2026-01',
    transaction_date: todayStr,
    status: 'Approved',
    logged_by_user_id: admin.id
  });

  await supabase.from('financial_ledger').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { data: insertedLedger, error: ledErr } = await supabase
    .from('financial_ledger')
    .insert(ledgerRecords)
    .select();

  if (ledErr) {
    console.error('❌ Error seeding ledger:', ledErr.message);
  } else {
    console.log(`✅ Seeded ${insertedLedger.length} ledger transactions!`);
  }

  console.log('\n========================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('========================================\n');
}

seed().catch(console.error);
