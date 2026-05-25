const { createClient } = require('@supabase/supabase-js');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function run() {
  console.log('========================================');
  console.log('  SEEDING PREMIUM MOCK DATA');
  console.log('========================================\n');

  console.log('🔗 Connecting to Supabase:', url);

  // 1. Fetch some active leads to link our mock messages to
  console.log('\n📊 Fetching active leads...');
  const { data: leads, error: leadsError } = await supabase
    .from('leads_customers')
    .select('id, name, phone')
    .limit(5);

  if (leadsError) {
    console.error('❌ Error fetching leads:', leadsError.message);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log('⚠️ No leads found. Seeding some dummy leads first...');
    const dummyLeads = [
      { name: 'Amit Sharma', phone: '+919876543210', email: 'amit@example.com', status: 'Contacted', budget_preference: 12000000 },
      { name: 'Sneha Gupta', phone: '+919812345678', email: 'sneha@example.com', status: 'Site Visit Scheduled', budget_preference: 15000000 },
      { name: 'Rajesh Kumar', phone: '+919988776655', email: 'rajesh@example.com', status: 'Negotiation', budget_preference: 8500000 },
      { name: 'Neha Singh', phone: '+919765432109', email: 'neha@example.com', status: 'Converted', budget_preference: 18000000 }
    ];

    const { data: newLeads, error: insertLeadsError } = await supabase
      .from('leads_customers')
      .insert(dummyLeads)
      .select();

    if (insertLeadsError) {
      console.error('❌ Error seeding leads:', insertLeadsError.message);
      return;
    }
    console.log(`✅ Seeded ${newLeads.length} new leads!`);
    leads.push(...newLeads);
  } else {
    console.log(`✅ Found ${leads.length} active leads in database.`);
  }

  // 2. Seed gorgeous mock WhatsApp Messages
  console.log('\n💬 Seeding WhatsApp messages...');
  
  const mockMessages = [];
  const statusOptions = ['READ', 'DELIVERED', 'SENT'];

  const messagesPool = [
    {
      text: "Hello {name}, thank you for visiting Analyzehive Flow! Here is the digital brochure for the 3 BHK Premium residences in Tower B: https://example.com/brochure.pdf",
      status: "READ"
    },
    {
      text: "Hi {name}, your site visit for Flow Heights (Flat 1204) is scheduled for today at 4:30 PM. Our representative Arjun will meet you at the site entrance. Location: https://maps.google.com/?q=Flow+Heights",
      status: "DELIVERED"
    },
    {
      text: "Congratulations {name}! Your booking request for Flat 802 in Tower A has been approved. The document verification link has been sent to your registered email address.",
      status: "READ"
    },
    {
      text: "Dear {name}, we noticed you were interested in properties under ₹1.5 Cr. Here is a curated list of our ongoing luxury inventory matching your preferences: https://example.com/flats",
      status: "SENT"
    },
    {
      text: "Hi {name}, thank you for your time today. We have logged your site visit feedback regarding flat sizes. We will share the revised pricing quote soon.",
      status: "READ"
    }
  ];

  leads.forEach((lead, index) => {
    const template = messagesPool[index % messagesPool.length];
    const messageText = template.text.replace('{name}', lead.name);
    
    mockMessages.push({
      to_phone: lead.phone || `+9198765${String(index).padStart(5, '0')}`,
      message_text: messageText,
      status: template.status,
      lead_id: lead.id,
      created_at: new Date(Date.now() - index * 3600000).toISOString() // space them out hourly
    });
  });

  const { data: newMsgs, error: msgsError } = await supabase
    .from('whatsapp_messages')
    .insert(mockMessages)
    .select();

  if (msgsError) {
    console.error('❌ Error seeding WhatsApp messages:', msgsError.message);
    console.log('\n⚠️ If the whatsapp_messages table is missing, run this in Supabase SQL Editor:');
    console.log(`
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_phone TEXT NOT NULL,
  message_text TEXT NOT NULL,
  status TEXT CHECK (status IN ('SENT', 'DELIVERED', 'READ')) DEFAULT 'SENT',
  lead_id UUID REFERENCES leads_customers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_full_access" ON public.whatsapp_messages FOR ALL USING (true) WITH CHECK (true);
    `);
  } else {
    console.log(`🎉 SUCCESS! Seeded ${newMsgs.length} interactive WhatsApp messages.`);
  }

  console.log('\n========================================');
  console.log('  SEEDING COMPLETED SUCCESSFULLY!');
  console.log('========================================\n');
}

run().catch(console.error);
