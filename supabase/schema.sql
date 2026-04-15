-- Supabase Schema for Analyzehive Flow Real Estate ERP

-- --------------------------------------------------------
-- LEADS & SALES
-- --------------------------------------------------------

CREATE TABLE leads_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT CHECK (source IN ('Meta', 'Google', '99acres', 'Direct')),
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Lost')),
  assigned_broker_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE flats_inventory (
  flat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL,
  flat_number TEXT NOT NULL,
  type TEXT CHECK (type IN ('1BHK','2BHK','3BHK','4BHK')),
  floor INTEGER,
  area_sqft NUMERIC,
  price NUMERIC,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available','On Hold','Sold')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE site_visits (
  visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_customers(id),
  flat_id UUID REFERENCES flats_inventory(flat_id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled','Completed','No Show')),
  reminder_sent BOOLEAN DEFAULT FALSE
);

-- --------------------------------------------------------
-- CONSTRUCTION
-- --------------------------------------------------------

CREATE TABLE stock_items (
  item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('Cement','Steel','Bricks','Sand','Other')),
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE demand_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES stock_items(item_id),
  quantity_requested NUMERIC NOT NULL,
  requested_by TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected')),
  reviewed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assets (
  asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Excavator','Generator','Crane','Mixer','Other')),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active','Maintenance','Decommissioned')),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- FINANCE
-- --------------------------------------------------------

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT CHECK (category IN ('Marketing','Construction','Operations','Salaries','Other')),
  amount NUMERIC NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_customers(id),
  flat_id UUID REFERENCES flats_inventory(flat_id),
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending','Received','Overdue'))
);

-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- --------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE leads_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flats_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Block all public access via the 'anon' role
CREATE POLICY "deny_all_public" ON leads_customers FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON flats_inventory FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON site_visits FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON stock_items FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON demand_requests FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON assets FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON expenses FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON payments FOR ALL TO anon USING (false);

-- Note: The service_role key bypasses RLS naturally, so server-side actions will succeed.
