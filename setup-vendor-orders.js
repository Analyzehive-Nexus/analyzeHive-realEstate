// Setup vendor_orders table using Supabase REST API
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  console.log('=== Checking vendor_orders table ===');
  console.log('Supabase URL:', url);

  // 1. Test if vendor_orders table exists by trying to select from it
  const testRes = await fetch(`${url}/rest/v1/vendor_orders?select=id&limit=1`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    }
  });

  console.log('vendor_orders test status:', testRes.status);
  const testBody = await testRes.text();
  console.log('vendor_orders test body:', testBody);

  if (testRes.ok) {
    console.log('\n✅ vendor_orders table already exists!');
  } else {
    console.log('\n❌ vendor_orders table does NOT exist. Attempting to create via SQL...');

    // Try using the Supabase SQL API (available via the management API)
    const sqlRes = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS public.vendor_orders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
            items JSONB DEFAULT '[]',
            delivery_date DATE,
            payment_terms TEXT DEFAULT 'net30',
            notes TEXT,
            total_value NUMERIC DEFAULT 0,
            status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Delivered', 'Cancelled')),
            created_at TIMESTAMPTZ DEFAULT NOW()
          );

          ALTER TABLE public.vendor_orders ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow full access with service role" ON public.vendor_orders
            FOR ALL USING (true) WITH CHECK (true);
        `
      })
    });

    console.log('SQL exec status:', sqlRes.status);
    const sqlBody = await sqlRes.text();
    console.log('SQL exec body:', sqlBody);

    if (!sqlRes.ok) {
      console.log('\n⚠️ exec_sql RPC not available. The table needs to be created manually.');
      console.log('\nPlease run this SQL in your Supabase Dashboard > SQL Editor:\n');
      console.log(`
CREATE TABLE IF NOT EXISTS public.vendor_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]',
  delivery_date DATE,
  payment_terms TEXT DEFAULT 'net30',
  notes TEXT,
  total_value NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Delivered', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vendor_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access with service role" ON public.vendor_orders
  FOR ALL USING (true) WITH CHECK (true);
      `);
    }
  }

  // 2. Also verify vendors table
  console.log('\n=== Checking vendors table ===');
  const vendorsRes = await fetch(`${url}/rest/v1/vendors?select=id,name,category,outstanding_amount,credit_limit,rating,status&limit=5`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    }
  });
  
  console.log('vendors table status:', vendorsRes.status);
  if (vendorsRes.ok) {
    const vendorsData = await vendorsRes.json();
    console.log('vendors count (first 5):', vendorsData.length);
    vendorsData.forEach(v => console.log(`  - ${v.name} | ${v.category} | Outstanding: ${v.outstanding_amount} | Status: ${v.status}`));
  } else {
    console.log('vendors table error:', await vendorsRes.text());
  }
}

main().catch(console.error);
