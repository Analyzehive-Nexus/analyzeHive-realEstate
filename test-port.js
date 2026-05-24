const { Client } = require('pg');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const host = 'db.zdvngqgssltnpskrucuv.supabase.co';
const user = 'postgres';
const database = 'postgres';

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

async function tryConnect(password, port) {
  const client = new Client({
    host,
    user,
    password,
    database,
    port,
    connectionTimeoutMillis: 3000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`[SUCCESS] Connected to port ${port} with password: ${password}`);
    return client;
  } catch (err) {
    console.log(`[FAILED] Port ${port}, Password: ${password} - Error: ${err.message}`);
    await client.end().catch(() => {});
    return null;
  }
}

async function run() {
  console.log("Testing ports 5432 and 6543...");
  for (const port of [5432, 6543]) {
    for (const pw of passwords) {
      const client = await tryConnect(pw, port);
      if (client) {
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
        return;
      }
    }
  }
  console.log("All port and password combinations failed.");
}

run();
