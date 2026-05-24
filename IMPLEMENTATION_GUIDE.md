# Step-by-Step Implementation Guide

## Option 1: Using Supabase Dashboard (Easiest for Beginners)

### Step 1: Access Supabase SQL Editor
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Create Tables One by One

Copy and paste each SQL block below into the SQL Editor and click **RUN**:

---

## **PHASE 1: CREATE CRITICAL TABLES**

### 1. Create Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('ADMIN', 'VP_SALES', 'BROKER', 'SUPERVISOR')) DEFAULT 'BROKER',
  avatar_initials TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Seed test users
INSERT INTO users (name, email, phone, role, avatar_initials) VALUES
  ('Arjun Mehta', 'arjun@flowestate.com', '+91 9876543210', 'VP_SALES', 'AM'),
  ('Priya Sharma', 'priya@flowestate.com', '+91 9876543211', 'BROKER', 'PS'),
  ('Rahul Desai', 'rahul@flowestate.com', '+91 9876543212', 'BROKER', 'RD'),
  ('Sneha Rao', 'sneha@flowestate.com', '+91 9876543213', 'BROKER', 'SR'),
  ('Vikram Singh', 'vikram@flowestate.com', '+91 9876543214', 'BROKER', 'VS'),
  ('Ananya Gupta', 'ananya@flowestate.com', '+91 9876543215', 'BROKER', 'AG'),
  ('Karan Patel', 'karan@flowestate.com', '+91 9876543216', 'BROKER', 'KP'),
  ('Riya Jain', 'riya@flowestate.com', '+91 9876543217', 'BROKER', 'RJ'),
  ('Admin User', 'admin@flowestate.com', '+91 9876543218', 'ADMIN', 'AD');
```

### 2. Fix Foreign Keys in Existing Tables
```sql
-- Add missing columns to leads_customers
ALTER TABLE leads_customers 
  ADD COLUMN IF NOT EXISTS assigned_user_id UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS project_interest TEXT,
  ADD COLUMN IF NOT EXISTS flat_type_interest TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ;

-- Add missing columns to flats_inventory
ALTER TABLE flats_inventory 
  ADD COLUMN IF NOT EXISTS project_ref UUID,
  ADD COLUMN IF NOT EXISTS facing TEXT CHECK (facing IN ('East', 'West', 'North', 'South'));

-- Add user reference to demand_requests
ALTER TABLE demand_requests
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id);
```

### 3. Create Projects Table
```sql
CREATE TABLE IF NOT EXISTS projects (
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
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Seed projects
INSERT INTO projects (name, location, status) VALUES
  ('Lumina Heights', 'Whitefield', 'Under Construction'),
  ('Aurora Towers', 'Indiranagar', 'Pre-launch'),
  ('Zenith Gardens', 'Koramangala', 'Completed'),
  ('Crescent Park', 'Jayanagar', 'Under Construction');

-- Link projects to flats
UPDATE flats_inventory 
SET project_ref = (
  SELECT id FROM projects WHERE name = flats_inventory.project LIMIT 1
);
```

### 4. Create Documents Table
```sql
CREATE TABLE IF NOT EXISTS documents (
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
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

---

## **PHASE 2: CREATE FUNCTIONAL TABLES**

### 5. Create WhatsApp Messages Table
```sql
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_customers(id) ON DELETE CASCADE,
  to_phone TEXT NOT NULL,
  message_text TEXT NOT NULL,
  status TEXT DEFAULT 'Sent' CHECK (status IN ('Pending', 'Sent', 'Failed', 'Read')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
```

### 6. Create Financial Ledger Table
```sql
CREATE TABLE IF NOT EXISTS financial_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT CHECK (transaction_type IN ('Income', 'Expense')),
  amount NUMERIC NOT NULL,
  category TEXT,
  transaction_date DATE NOT NULL,
  description TEXT,
  logged_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE financial_ledger ENABLE ROW LEVEL SECURITY;
```

### 7. Create Vendors Table
```sql
CREATE TABLE IF NOT EXISTS vendors (
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
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Seed vendors
INSERT INTO vendors (name, contact_person, phone, email, category) VALUES
  ('Steel Supply Co', 'Rajesh Kumar', '+91 9876543220', 'rajesh@steelco.com', 'Material'),
  ('Cement Industries', 'Amit Patel', '+91 9876543221', 'amit@cement.com', 'Material'),
  ('Labor Contractors Ltd', 'Mohan Singh', '+91 9876543222', 'mohan@labor.com', 'Labor'),
  ('Equipment Rentals', 'Priya Sharma', '+91 9876543223', 'priya@equipment.com', 'Equipment');
```

---

## **PHASE 3: FIX NAMING MISMATCHES**

### 8. Rename Mismatched Tables
```sql
-- Option A: Rename existing tables
ALTER TABLE stock_items RENAME TO inventory_items;
ALTER TABLE demand_requests RENAME TO material_demands;

-- If code still references old names, update your data.ts instead
-- (See FIX section below)
```

---

## **PHASE 4: OPTIONAL BUT RECOMMENDED**

### 9. Create Daily Progress Table
```sql
CREATE TABLE IF NOT EXISTS daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  progress_percentage NUMERIC DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  notes TEXT,
  photos JSONB DEFAULT '[]',
  submitted_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
```

### 10. Create Useful Indexes
```sql
-- Speed up queries
CREATE INDEX IF NOT EXISTS idx_leads_assigned_user ON leads_customers(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads_customers(status);
CREATE INDEX IF NOT EXISTS idx_documents_lead ON documents(lead_id);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_date ON financial_ledger(transaction_date);
CREATE INDEX IF NOT EXISTS idx_daily_progress_project ON daily_progress(project_id);
```

---

## **UPDATE YOUR CODE**

If you renamed tables, update [lib/data.ts](lib/data.ts):

### Find and Replace in data.ts:
```typescript
// Change FROM:
.from('stock_items')
// Change TO:
.from('inventory_items')

// Change FROM:
.from('demand_requests')
// Change TO:
.from('material_demands')
```

---

## Option 2: Using SQL Files + CLI (Recommended for Production)

### Step 1: Create SQL Migration Files
Create these files in your project:

```bash
supabase/migrations/
├── 001_create_users_table.sql
├── 002_create_projects_table.sql
├── 003_create_documents_table.sql
├── 004_create_whatsapp_messages.sql
├── 005_create_financial_ledger.sql
├── 006_create_vendors_table.sql
├── 007_create_daily_progress.sql
└── 008_seed_initial_data.sql
```

### Step 2: Push to Supabase via CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

---

## Option 3: Using Node.js Script (Programmatic)

Create [scripts/setup-database.ts](scripts/setup-database.ts):

```typescript
import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
import path from 'path';

loadEnvConfig(path.resolve(__dirname, '../'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function setupDatabase() {
  console.log('🚀 Setting up database tables...\n');

  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('exec_sql', {
      query: `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'BROKER',
        avatar_initials TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );`
    });
    if (usersError) console.error('❌ Users table:', usersError);
    else console.log('✅ Users table created');

    // Create projects table
    const { error: projectsError } = await supabase.rpc('exec_sql', {
      query: `CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        location TEXT,
        status TEXT DEFAULT 'Pre-launch',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );`
    });
    if (projectsError) console.error('❌ Projects table:', projectsError);
    else console.log('✅ Projects table created');

    // Seed data
    const { error: seedError } = await supabase
      .from('users')
      .insert([
        { name: 'Admin User', email: 'admin@flowestate.com', role: 'ADMIN', avatar_initials: 'AD' },
        { name: 'Arjun Mehta', email: 'arjun@flowestate.com', role: 'VP_SALES', avatar_initials: 'AM' },
      ]);
    if (seedError) console.error('❌ Seeding:', seedError);
    else console.log('✅ Seed data inserted');

    console.log('\n✨ Database setup complete!');
  } catch (err) {
    console.error('🔥 Error:', err);
  }
}

setupDatabase();
```

Run it:
```bash
npx ts-node scripts/setup-database.ts
```

---

## ✅ Verification Checklist

After running scripts, verify everything works:

```javascript
// Create a test file: check-setup.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  console.log('📋 Checking tables...\n');

  const tables = [
    'users',
    'projects',
    'documents',
    'whatsapp_messages',
    'financial_ledger',
    'vendors',
    'daily_progress',
    'leads_customers',
    'flats_inventory',
    'inventory_items',
    'material_demands'
  ];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ ${table}: TABLE NOT FOUND`);
    } else {
      console.log(`✅ ${table}: ${count} rows`);
    }
  }
}

verify();
```

Run it:
```bash
node check-setup.js
```

---

## 🚨 Troubleshooting

### Issue: "Table already exists"
**Solution**: Add `IF NOT EXISTS` to CREATE TABLE statements (already included above)

### Issue: "Foreign key constraint violated"
**Solution**: Create referenced tables first (users → projects → documents)

### Issue: "RLS policy denies access"
**Solution**: Check RLS policies in Supabase Dashboard > Authentication > Policies

### Issue: "Service key not working"
**Solution**: 
1. Go to Supabase Dashboard
2. Settings > API
3. Copy the service_role key again
4. Update .env.local

---

## 📝 Recommended Execution Order

1. ✅ Create `users` table first (most dependencies)
2. ✅ Create `projects` table
3. ✅ Add foreign key columns to `leads_customers` and `flats_inventory`
4. ✅ Create `documents` table
5. ✅ Create `whatsapp_messages` table
6. ✅ Create `financial_ledger` table
7. ✅ Create `vendors` table
8. ✅ Create `daily_progress` table
9. ✅ Fix table naming (rename or update code)
10. ✅ Create indexes
11. ✅ Run verification script

---

## 🎯 Next Steps

After setup:
- [ ] Test the application locally
- [ ] Check all dashboards load data
- [ ] Verify real-time subscriptions work
- [ ] Test CRUD operations in each module
- [ ] Check for any console errors
- [ ] Run the application end-to-end

