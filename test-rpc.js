const { createClient } = require('@supabase/supabase-js');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);

async function run() {
  console.log("Testing if exec_sql rpc exists...");
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' });
  if (error) {
    console.log("exec_sql error:", error.code, error.message);
  } else {
    console.log("exec_sql exists! Result:", data);
  }

  console.log("Testing if run_sql rpc exists...");
  const { data: data2, error: error2 } = await supabase.rpc('run_sql', { sql: 'SELECT 1' });
  if (error2) {
    console.log("run_sql error:", error2.code, error2.message);
  } else {
    console.log("run_sql exists! Result:", data2);
  }
}

run();
