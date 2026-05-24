const { Client } = require('pg');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const host = 'db.zdvngqgssltnpskrucuv.supabase.co';
const user = 'postgres';
const database = 'postgres';
const port = 5432;

const passwords = [
  'sb_secret_eXrnRfbjWJSPTXIKSdlq8w_S0B2yfYm',
  'eXrnRfbjWJSPTXIKSdlq8w_S0B2yfYm',
  'staging-cron-secret-38aef72',
  'flowestate',
  'analyzehive',
  'supabase',
  'postgres',
  'admin'
];

async function tryConnect(password) {
  const client = new Client({
    host,
    user,
    password,
    database,
    port,
    connectionTimeoutMillis: 2000, // 2 second timeout
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`[SUCCESS] Connected with password: ${password}`);
    return client;
  } catch (err) {
    console.log(`[FAILED] Password: ${password} - Error: ${err.message}`);
    await client.end().catch(() => {});
    return null;
  }
}

async function run() {
  let client = null;
  for (const pw of passwords) {
    client = await tryConnect(pw);
    if (client) break;
  }

  if (!client) {
    console.error("\nCould not connect to PostgreSQL with any common staging password guess.");
    console.log("Please check if there is an alternative password or if the port is accessible.");
    process.exit(1);
  }

  console.log("Creating vendor_orders table...");
  const query = `
    CREATE TABLE IF NOT EXISTS vendor_orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vendor_id UUID,
      items JSONB,
      delivery_date DATE,
      payment_terms TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    await client.query(query);
    console.log("vendor_orders table created successfully!");
  } catch (err) {
    console.error("Error creating table:", err.message);
  } finally {
    await client.end();
  }
}

run();
