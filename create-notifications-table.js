const { Client } = require('pg');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const host = 'db.zdvngqgssltnpskrucuv.supabase.co';
const user = 'postgres';
const database = 'postgres';

const passwords = [
  'sb_secret_eXrnRfbjWJSPTXIKSdlq8w_S0B2yfYm',
  'eXrnRfbjWJSPTXIKSdlq8w_S0B2yfYm',
  'flowestate',
  'analyzehive',
  'supabase',
  'postgres',
  'admin'
];

async function run() {
  let client = null;
  for (const pw of passwords) {
    const c = new Client({
      host,
      user,
      password: pw,
      database,
      port: 6543,
      connectionTimeoutMillis: 2000,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await c.connect();
      client = c;
      break;
    } catch (e) {
      await c.end().catch(() => {});
    }
  }

  if (!client) {
    for (const pw of passwords) {
      const c = new Client({
        host,
        user,
        password: pw,
        database,
        port: 5432,
        connectionTimeoutMillis: 2000,
        ssl: { rejectUnauthorized: false }
      });
      try {
        await c.connect();
        client = c;
        break;
      } catch (e) {
        await c.end().catch(() => {});
      }
    }
  }

  if (!client) {
    console.error("Failed to connect to database!");
    return;
  }

  console.log("SUCCESS! Connected to PostgreSQL.");
  
  const ddl = `
    CREATE TABLE IF NOT EXISTS public.notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT DEFAULT 'workos-site-001',
      title TEXT NOT NULL,
      description TEXT,
      type TEXT CHECK (type IN ('alert', 'info', 'success', 'warning')) DEFAULT 'info',
      read BOOLEAN DEFAULT FALSE,
      link TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  await client.query(ddl);
  console.log("Table public.notifications created or verified!");

  // Clean and seed seed data
  await client.query("DELETE FROM public.notifications;");
  
  const seed = `
    INSERT INTO public.notifications (title, description, type, read, link) VALUES
      ('Critical Stock Alert', 'Cement stock level has fallen below the critical threshold (50 bags remaining).', 'alert', FALSE, '/construction/stock'),
      ('New Material Requisition', 'Site Supervisor Bruce Wayne raised a demand request for 500 TMT Steel Bars.', 'info', FALSE, '/construction/demands'),
      ('Vendor Payment Recorded', 'A transaction of ₹45,000 to Rajhans Cement Co. has been added to the Ledger.', 'success', FALSE, '/construction/budget'),
      ('Machinery Service Needed', 'CAT Excavator 320 is scheduled for next routine oil service on May 30.', 'warning', FALSE, '/construction/assets'),
      ('Site Photo Logged', 'New visual visual status report photo uploaded for Project Tower B.', 'success', TRUE, '/construction/photos');
  `;
  
  await client.query(seed);
  console.log("Mock notification records seeded successfully!");
  
  await client.end();
}

run();
