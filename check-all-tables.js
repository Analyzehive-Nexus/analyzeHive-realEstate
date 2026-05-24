const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const tables = [
  'users',
  'projects',
  'leads_customers',
  'inventory_items',
  'material_demands',
  'vendors',
  'vendor_orders',
  'labour_attendance',
  'daily_progress',
  'financial_ledger',
  'site_photos',
  'notifications',
  'companies',
];

async function check() {
  console.log('========================================');
  console.log('  SUPABASE TABLE DIAGNOSTIC');
  console.log('========================================\n');

  const missing = [];
  const existing = [];

  for (const table of tables) {
    const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });

    if (res.ok) {
      const data = await res.json();
      const countRes = await fetch(`${url}/rest/v1/${table}?select=*`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'count=exact',
          'Range': '0-0'
        }
      });
      const range = countRes.headers.get('content-range');
      const total = range ? range.split('/')[1] : '?';
      console.log(`  ✅  ${table.padEnd(22)} ${String(total).padStart(5)} rows`);
      existing.push(table);
    } else {
      console.log(`  ❌  ${table.padEnd(22)} MISSING`);
      missing.push(table);
    }
  }

  console.log('\n========================================');
  console.log(`  SUMMARY: ${existing.length} exist, ${missing.length} missing`);
  console.log('========================================\n');

  if (missing.length === 0) {
    console.log('🎉 ALL TABLES EXIST! No SQL scripts needed.\n');
  } else {
    console.log('⚠️  The following tables need to be created in Supabase SQL Editor:\n');

    const sqlMap = {
      vendor_orders: `CREATE TABLE IF NOT EXISTS public.vendor_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]',
  delivery_date DATE,
  payment_terms TEXT DEFAULT 'net30',
  notes TEXT,
  total_value NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.vendor_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON public.vendor_orders FOR ALL USING (true) WITH CHECK (true);`,

      companies: `CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  logo TEXT,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON public.companies FOR ALL USING (true) WITH CHECK (true);`,

      site_photos: `CREATE TABLE IF NOT EXISTS public.site_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT,
  project_name TEXT NOT NULL,
  uploaded_by TEXT DEFAULT 'workos-site-001',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.site_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON public.site_photos FOR ALL USING (true) WITH CHECK (true);`,

      notifications: `CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT DEFAULT 'workos-site-001',
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('alert', 'info', 'success', 'warning')) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON public.notifications FOR ALL USING (true) WITH CHECK (true);`,

      daily_progress: `CREATE TABLE IF NOT EXISTS public.daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  floor_area TEXT,
  date DATE NOT NULL,
  completion_percentage NUMERIC DEFAULT 0,
  weather TEXT,
  workers_present INTEGER DEFAULT 0,
  work_done TEXT,
  materials_used JSONB DEFAULT '[]',
  issues TEXT,
  photos TEXT[] DEFAULT '{}',
  submitted_by TEXT DEFAULT 'workos-site-001',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON public.daily_progress FOR ALL USING (true) WITH CHECK (true);`,
    };

    for (const t of missing) {
      if (sqlMap[t]) {
        console.log(`-- TABLE: ${t}`);
        console.log(sqlMap[t]);
        console.log('');
      } else {
        console.log(`-- TABLE: ${t} (no auto-SQL available, check manually)`);
        console.log('');
      }
    }

    console.log('\n📋 Copy ALL the SQL above and paste it into:');
    console.log('   Supabase Dashboard → SQL Editor → New Query → Run\n');
    console.log('   The app works WITHOUT these tables (graceful fallbacks),');
    console.log('   but creating them enables full data persistence.\n');
  }
}

check().catch(console.error);
