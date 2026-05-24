const { createClient } = require('@supabase/supabase-js');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  console.log("Supabase URL:", url);
  
  console.log("\n--- Checking assets_equipment table ---");
  const { data: assets, error: err } = await supabase.from('assets_equipment').select('*').limit(1);
  if (err) {
    console.error("Error querying assets_equipment:", err.code, err.message);
  } else {
    console.log("SUCCESS! assets_equipment table exists. Assets count:", assets.length);
    console.log("Sample asset data:", assets[0]);
  }
}

run();
