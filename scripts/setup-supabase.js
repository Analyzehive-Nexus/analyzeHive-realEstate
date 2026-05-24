const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const sqlQueries = [
  // 1. Create users table
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT CHECK (role IN ('ADMIN', 'VP_SALES', 'BROKER', 'SUPERVISOR')) DEFAULT 'BROKER',
    avatar_initials TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // 2. Enable RLS on users
  `ALTER TABLE users ENABLE ROW LEVEL SECURITY`,

  // 3. Create projects table
  `CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'Pre-launch' CHECK (status IN ('Pre-launch', 'Under Construction', 'Completed')),
    description TEXT,
    budget_total NUMERIC DEFAULT 0,
    budget_spent NUMERIC DEFAULT 0,
    completion_percentage NUMERIC DEFAULT 0,
    start_date DATE,
    expected_completion DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // 4. Enable RLS on projects
  `ALTER TABLE projects ENABLE ROW LEVEL SECURITY`,

  // 5. Add columns to leads_customers
  `ALTER TABLE leads_customers 
    ADD COLUMN IF NOT EXISTS assigned_user_id UUID REFERENCES users(id),
    ADD COLUMN IF NOT EXISTS project_interest TEXT,
    ADD COLUMN IF NOT EXISTS flat_type_interest TEXT,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ`,

  // 6. Add columns to flats_inventory
  `ALTER TABLE flats_inventory 
    ADD COLUMN IF NOT EXISTS project_ref UUID REFERENCES projects(id),
    ADD COLUMN IF NOT EXISTS facing TEXT CHECK (facing IN ('East', 'West', 'North', 'South'))`,

  // 7. Add user reference to demand_requests
  `ALTER TABLE demand_requests
    ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id)`,

  // 8. Create documents table
  `CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads_customers(id) ON DELETE CASCADE,
    document_type TEXT CHECK (document_type IN ('Aadhar', 'PAN', 'Bank Statement', 'Sale Agreement', 'Other')),
    file_url TEXT,
    file_name TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
    verified_by_user_id UUID REFERENCES users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // 9. Enable RLS on documents
  `ALTER TABLE documents ENABLE ROW LEVEL SECURITY`,

  // 10. Create whatsapp_messages table
  `CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads_customers(id) ON DELETE CASCADE,
    to_phone TEXT NOT NULL,
    message_text TEXT NOT NULL,
    status TEXT DEFAULT 'Sent' CHECK (status IN ('Pending', 'Sent', 'Failed', 'Read')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ
  )`,

  // 11. Enable RLS on whatsapp_messages
  `ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY`,

  // 12. Create financial_ledger table
  `CREATE TABLE IF NOT EXISTS financial_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_type TEXT CHECK (transaction_type IN ('Income', 'Expense')),
    amount NUMERIC NOT NULL,
    category TEXT,
    transaction_date DATE NOT NULL,
    description TEXT,
    logged_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // 13. Enable RLS on financial_ledger
  `ALTER TABLE financial_ledger ENABLE ROW LEVEL SECURITY`,

  // 14. Create vendors table
  `CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    category TEXT CHECK (category IN ('Material', 'Labor', 'Equipment', 'Service')) DEFAULT 'Material',
    rating NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // 15. Enable RLS on vendors
  `ALTER TABLE vendors ENABLE ROW LEVEL SECURITY`,

  // 16. Create daily_progress table
  `CREATE TABLE IF NOT EXISTS daily_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    progress_percentage NUMERIC DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    notes TEXT,
    photos JSONB DEFAULT '[]',
    submitted_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // 17. Enable RLS on daily_progress
  `ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY`,

  // 18. Create indexes
  `CREATE INDEX IF NOT EXISTS idx_leads_assigned_user ON leads_customers(assigned_user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_status ON leads_customers(status)`,
  `CREATE INDEX IF NOT EXISTS idx_documents_lead ON documents(lead_id)`,
  `CREATE INDEX IF NOT EXISTS idx_financial_ledger_date ON financial_ledger(transaction_date)`,
  `CREATE INDEX IF NOT EXISTS idx_daily_progress_project ON daily_progress(project_id)`,
  `CREATE INDEX IF NOT EXISTS idx_whatsapp_lead ON whatsapp_messages(lead_id)`,
];

async function executeQueries() {
  console.log("🚀 Starting Supabase database setup...\n");
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < sqlQueries.length; i++) {
    const query = sqlQueries[i];
    const queryName = query.split("\n")[0].substring(0, 60);

    try {
      // Execute raw SQL using Supabase query API
      const { error } = await supabase.rpc("exec_sql", {
        sql: query,
      });

      if (error && !error.toString().includes("already exists")) {
        console.log(
          `⚠️  [${i + 1}/${sqlQueries.length}] ${queryName}... ${error.message}`,
        );
        errorCount++;
      } else {
        console.log(`✅ [${i + 1}/${sqlQueries.length}] ${queryName}...`);
        successCount++;
      }
    } catch (err) {
      console.log(
        `⚠️  [${i + 1}/${sqlQueries.length}] ${queryName}... ${err.message}`,
      );
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✅ Queries Executed: ${successCount}`);
  console.log(`⚠️  Warnings/Skipped: ${errorCount}`);
  console.log("=".repeat(60) + "\n");

  // Seed data
  await seedUsers();
  await seedProjects();
  await seedVendors();

  // Verify setup
  await verifySetup();
}

async function seedUsers() {
  console.log("🌱 Seeding users...");

  const users = [
    {
      name: "Arjun Mehta",
      email: "arjun@flowestate.com",
      phone: "+91 9876543210",
      role: "VP_SALES",
      avatar_initials: "AM",
    },
    {
      name: "Priya Sharma",
      email: "priya@flowestate.com",
      phone: "+91 9876543211",
      role: "BROKER",
      avatar_initials: "PS",
    },
    {
      name: "Rahul Desai",
      email: "rahul@flowestate.com",
      phone: "+91 9876543212",
      role: "BROKER",
      avatar_initials: "RD",
    },
    {
      name: "Sneha Rao",
      email: "sneha@flowestate.com",
      phone: "+91 9876543213",
      role: "BROKER",
      avatar_initials: "SR",
    },
    {
      name: "Vikram Singh",
      email: "vikram@flowestate.com",
      phone: "+91 9876543214",
      role: "BROKER",
      avatar_initials: "VS",
    },
    {
      name: "Ananya Gupta",
      email: "ananya@flowestate.com",
      phone: "+91 9876543215",
      role: "BROKER",
      avatar_initials: "AG",
    },
    {
      name: "Karan Patel",
      email: "karan@flowestate.com",
      phone: "+91 9876543216",
      role: "BROKER",
      avatar_initials: "KP",
    },
    {
      name: "Riya Jain",
      email: "riya@flowestate.com",
      phone: "+91 9876543217",
      role: "BROKER",
      avatar_initials: "RJ",
    },
    {
      name: "Admin User",
      email: "admin@flowestate.com",
      phone: "+91 9876543218",
      role: "ADMIN",
      avatar_initials: "AD",
    },
  ];

  const { data, error } = await supabase
    .from("users")
    .upsert(users, { onConflict: "email" });

  if (error) {
    console.log(`⚠️  Error seeding users: ${error.message}`);
  } else {
    console.log(`✅ Seeded ${users.length} users`);
  }
}

async function seedProjects() {
  console.log("🌱 Seeding projects...");

  const projects = [
    {
      name: "Lumina Heights",
      location: "Whitefield",
      status: "Under Construction",
      budget_total: 50000000,
      completion_percentage: 45,
    },
    {
      name: "Aurora Towers",
      location: "Indiranagar",
      status: "Pre-launch",
      budget_total: 75000000,
      completion_percentage: 10,
    },
    {
      name: "Zenith Gardens",
      location: "Koramangala",
      status: "Completed",
      budget_total: 60000000,
      completion_percentage: 100,
    },
    {
      name: "Crescent Park",
      location: "Jayanagar",
      status: "Under Construction",
      budget_total: 55000000,
      completion_percentage: 35,
    },
  ];

  const { data, error } = await supabase
    .from("projects")
    .upsert(projects, { onConflict: "name" });

  if (error) {
    console.log(`⚠️  Error seeding projects: ${error.message}`);
  } else {
    console.log(`✅ Seeded ${projects.length} projects`);
  }
}

async function seedVendors() {
  console.log("🌱 Seeding vendors...");

  const vendors = [
    {
      name: "Steel Supply Co",
      contact_person: "Rajesh Kumar",
      phone: "+91 9876543220",
      email: "rajesh@steelco.com",
      category: "Material",
    },
    {
      name: "Cement Industries",
      contact_person: "Amit Patel",
      phone: "+91 9876543221",
      email: "amit@cement.com",
      category: "Material",
    },
    {
      name: "Labor Contractors Ltd",
      contact_person: "Mohan Singh",
      phone: "+91 9876543222",
      email: "mohan@labor.com",
      category: "Labor",
    },
    {
      name: "Equipment Rentals",
      contact_person: "Priya Sharma",
      phone: "+91 9876543223",
      email: "priya@equipment.com",
      category: "Equipment",
    },
  ];

  const { data, error } = await supabase
    .from("vendors")
    .upsert(vendors, { onConflict: "name" });

  if (error) {
    console.log(`⚠️  Error seeding vendors: ${error.message}`);
  } else {
    console.log(`✅ Seeded ${vendors.length} vendors\n`);
  }
}

async function verifySetup() {
  console.log("📋 Verifying setup...\n");

  const tables = [
    "users",
    "projects",
    "documents",
    "whatsapp_messages",
    "financial_ledger",
    "vendors",
    "daily_progress",
    "leads_customers",
    "flats_inventory",
    "stock_items",
    "demand_requests",
  ];

  let foundTables = 0;
  let missingTables = 0;

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });

    if (error) {
      console.log(`❌ ${table.padEnd(25)} [NOT FOUND]`);
      missingTables++;
    } else {
      console.log(`✅ ${table.padEnd(25)} [${count} rows]`);
      foundTables++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✅ Tables Found: ${foundTables}/${tables.length}`);
  if (missingTables > 0) {
    console.log(`❌ Tables Missing: ${missingTables}`);
  }
  console.log("=".repeat(60) + "\n");

  if (foundTables === tables.length) {
    console.log("🎉 Database setup completed successfully!\n");
    console.log("✨ Next steps:");
    console.log("   1. Review the tables in Supabase Dashboard");
    console.log("   2. Run: npm run dev");
    console.log("   3. Test the application\n");
  } else {
    console.log("⚠️  Some tables are still missing. Check the errors above.\n");
  }
}

executeQueries().catch(console.error);
