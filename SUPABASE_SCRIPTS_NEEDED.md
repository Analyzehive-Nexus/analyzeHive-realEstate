# Supabase Scripts Required to Make Application Fully Functional

## Overview
Your application references **11 database tables**, but the current schema only defines **8 tables**. Below is a comprehensive list of all missing scripts and their purposes.

---

## 🔴 CRITICAL ISSUES (Current Schema vs Code Mismatch)

### 1. **TABLE NAMING MISMATCHES**
Your code references different table names than what's in the schema:

| Schema Has | Code Uses | Status |
|-----------|-----------|--------|
| `stock_items` | `inventory_items` | ❌ MISMATCH |
| `demand_requests` | `material_demands` | ❌ MISMATCH |

**Fix Required**: Rename these tables or update data.ts functions to match schema.

---

## 📋 MISSING TABLES (Priority Order)

### **TIER 1: CRITICAL (Without these, app won't work)**

#### 1. **users** Table
- **Purpose**: Store team members, brokers, admins, supervisors
- **Referenced in**: Everywhere (assigned_user, requested_by, verified_by_user, etc.)
- **Script Needed**: `create-users-table.sql`
- **Includes**: Roles (ADMIN, VP_SALES, BROKER, SUPERVISOR), avatar_initials, email, phone

#### 2. **documents** Table  
- **Purpose**: Store uploaded documents (Aadhar, PAN, Bank Statements, Sale Agreements)
- **Referenced in**: Sales > Documents, getLeadById(), getDocuments()
- **Script Needed**: `create-documents-table.sql`
- **Fields**: lead_id, document_type, status (Pending/Verified/Rejected), verified_by_user_id, uploaded_at

#### 3. **projects** Table
- **Purpose**: Store construction projects
- **Referenced in**: Dashboard, Construction, getProjects()
- **Script Needed**: `create-projects-table.sql`
- **Fields**: name, location, status (Pre-launch/Under Construction/Completed), budget_total, budget_spent, completion_percentage

#### 4. **whatsapp_messages** Table
- **Purpose**: Store WhatsApp communications
- **Referenced in**: Sales Dashboard (real-time subscription)
- **Script Needed**: `create-whatsapp-messages-table.sql`
- **Fields**: to_phone, message_text, status, lead_id, sent_at, created_at

---

### **TIER 2: IMPORTANT (For full dashboard functionality)**

#### 5. **financial_ledger** Table
- **Purpose**: Track all financial transactions and income/expense logs
- **Referenced in**: Dashboard, Financial modules, getFinancialLedger()
- **Script Needed**: `create-financial-ledger-table.sql`
- **Fields**: transaction_type (Income/Expense), amount, category, transaction_date, logged_by_user_id, description

#### 6. **vendors** Table
- **Purpose**: Store vendor/supplier information
- **Referenced in**: Construction, getVendors()
- **Script Needed**: `create-vendors-table.sql`
- **Fields**: name, contact_person, phone, email, category (Material/Labor/Equipment)

#### 7. **daily_progress** Table
- **Purpose**: Track daily construction progress updates with photos
- **Referenced in**: Construction > Progress, getDailyProgress()
- **Script Needed**: `create-daily-progress-table.sql`
- **Fields**: project_id, date, progress_percentage, notes, photos (JSONB array), submitted_by_user_id

---

### **TIER 3: OPTIONAL (Already partially handled)**

#### 8. **vendor_orders** Table
- **Purpose**: Track orders placed with vendors
- **Status**: Partially defined in `setup-vendor-orders.js`
- **Script Needed**: Ensure it matches schema expectations

#### 9. **inventory_items** Table (RENAME from stock_items)
- **Current**: Named `stock_items` in schema
- **Script Needed**: Either rename or create alias/new table
- **Fields**: name, category, quantity, unit_of_measurement, status, min_threshold

#### 10. **material_demands** Table (RENAME from demand_requests)
- **Current**: Named `demand_requests` in schema  
- **Script Needed**: Either rename or create new table
- **Fields**: item_id, quantity_requested, requested_by_user_id, status, approved_by_user_id, created_at

---

## 📝 SEED/INITIALIZATION SCRIPTS NEEDED

### 1. **seed-users.js** / **seed-users.sql**
- Insert test team members
- **Data**: 9 users with different roles (from seed-check.ts)
  - 1 VP_SALES, 1 ADMIN, 7 BROKERs
- **Status**: Seed data exists in seed-check.ts but needs SQL script

### 2. **seed-projects.js** / **seed-projects.sql**
- Insert 4 test projects (from seed-check.ts)
  - Lumina Heights, Aurora Towers, Zenith Gardens, Crescent Park
- **Status**: Needs to be extracted from seed-check.ts

### 3. **seed-inventory.js** / **seed-inventory.sql**
- Insert construction materials
- **Data**: Cement, Steel, Bricks, Sand, Paint, Tiles (from seed-check.ts)
- **Status**: Partially exists, needs SQL script

### 4. **seed-vendors.js** / **seed-vendors.sql**
- Insert vendor contact information
- **Data**: Material suppliers, labor contractors, equipment rentals

---

## 🔧 REPAIR/MIGRATION SCRIPTS NEEDED

### 1. **fix-table-naming.sql**
- Rename `stock_items` → `inventory_items` OR update functions
- Rename `demand_requests` → `material_demands` OR update functions

### 2. **fix-relationships.sql**
- Add missing foreign key relationships
- Add indexes for frequently queried fields
- Fix RLS (Row Level Security) policies

### 3. **add-columns-to-leads.sql**
Referenced but potentially missing from schema:
```sql
ALTER TABLE leads_customers ADD COLUMN IF NOT EXISTS assigned_user_id UUID REFERENCES users(id);
ALTER TABLE leads_customers ADD COLUMN IF NOT EXISTS project_interest TEXT;
ALTER TABLE leads_customers ADD COLUMN IF NOT EXISTS flat_type_interest TEXT;
ALTER TABLE leads_customers ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE leads_customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE leads_customers ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ;
```

### 4. **add-columns-to-flats.sql**
Missing columns from code:
```sql
ALTER TABLE flats_inventory ADD COLUMN IF NOT EXISTS project_ref UUID REFERENCES projects(id);
ALTER TABLE flats_inventory ADD COLUMN IF NOT EXISTS facing TEXT;
ALTER TABLE flats_inventory ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;
```

---

## 📊 CURRENT SCHEMA STATUS

### ✅ Tables That Exist
```
1. leads_customers
2. flats_inventory  
3. site_visits
4. stock_items (misnamed - should be inventory_items)
5. demand_requests (misnamed - should be material_demands)
6. assets
7. expenses
8. payments
```

### ❌ Tables Missing
```
1. users (CRITICAL)
2. documents (CRITICAL)
3. projects (CRITICAL)
4. whatsapp_messages (CRITICAL)
5. financial_ledger (IMPORTANT)
6. vendors (IMPORTANT)
7. daily_progress (IMPORTANT)
```

---

## 🚀 RECOMMENDED IMPLEMENTATION ORDER

1. **Phase 1 (BLOCKING)**
   - Create users table + seed
   - Create projects table + seed
   - Create documents table
   - Fix table naming mismatches

2. **Phase 2 (FUNCTIONAL)**
   - Create whatsapp_messages table
   - Create financial_ledger table
   - Create vendors table
   - Update all RLS policies

3. **Phase 3 (COMPLETE)**
   - Create daily_progress table
   - Add missing columns to existing tables
   - Create all necessary indexes
   - Add trigger functions for updated_at timestamps

---

## 📄 SQL TEMPLATES READY TO CREATE

Below are the table definitions needed:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('ADMIN', 'VP_SALES', 'BROKER', 'SUPERVISOR', 'MANAGER')),
  avatar_initials TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_customers(id) ON DELETE CASCADE,
  document_type TEXT CHECK (document_type IN ('Aadhar', 'PAN', 'Bank Statement', 'Sale Agreement', 'Other')),
  file_url TEXT,
  file_name TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
  verified_by_user_id UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);
```

### Projects Table
```sql
CREATE TABLE projects (
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
```

### WhatsApp Messages Table
```sql
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_customers(id),
  to_phone TEXT NOT NULL,
  message_text TEXT NOT NULL,
  status TEXT DEFAULT 'Sent' CHECK (status IN ('Pending', 'Sent', 'Failed', 'Read')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);
```

### Financial Ledger Table
```sql
CREATE TABLE financial_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT CHECK (transaction_type IN ('Income', 'Expense')),
  amount NUMERIC NOT NULL,
  category TEXT,
  transaction_date DATE NOT NULL,
  description TEXT,
  logged_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Vendors Table
```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  category TEXT CHECK (category IN ('Material', 'Labor', 'Equipment', 'Service')),
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Daily Progress Table
```sql
CREATE TABLE daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  date DATE NOT NULL,
  progress_percentage NUMERIC DEFAULT 0,
  notes TEXT,
  photos JSONB DEFAULT '[]',
  submitted_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎯 ACTION ITEMS

- [ ] Create all 7 missing table scripts
- [ ] Create seed data scripts for users, projects, vendors
- [ ] Create migration scripts to fix naming mismatches
- [ ] Update RLS policies for all new tables
- [ ] Create indexes for frequently queried columns
- [ ] Create trigger functions for auto-updating timestamps
- [ ] Test application with all tables and seed data
- [ ] Document API endpoints for each table

