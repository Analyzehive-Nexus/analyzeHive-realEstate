const { createClient } = require('@supabase/supabase-js');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function run() {
  console.log("Supabase URL:", url);
  
  console.log("\n--- Checking vendors table ---");
  const { data: vendors, error: vErr } = await supabase.from('vendors').select('*');
  if (vErr) {
    console.error("Error querying vendors:", vErr.code, vErr.message);
  } else {
    console.log("SUCCESS! vendors table exists. Count:", vendors.length);
    if (vendors.length > 0) {
      console.log("Sample vendor columns:", Object.keys(vendors[0]));
      console.log("Sample vendor data:", vendors[0]);
    }
  }

  console.log("\n--- Checking vendor_orders table ---");
  const { data: orders, error: oErr } = await supabase.from('vendor_orders').select('*');
  if (oErr) {
    console.error("Error querying vendor_orders:", oErr.code, oErr.message);
  } else {
    console.log("SUCCESS! vendor_orders table exists. Count:", orders.length);
    if (orders.length > 0) {
      console.log("Sample order columns:", Object.keys(orders[0]));
      console.log("Sample order data:", orders[0]);
    }
  }
}

run();
