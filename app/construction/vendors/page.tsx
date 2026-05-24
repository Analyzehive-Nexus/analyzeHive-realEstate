export const dynamic = 'force-dynamic';

import { getVendors } from '@/lib/data';
import { supabaseAdmin } from '@/lib/supabase';
import VendorsClient from './client';

export default async function VendorsPage() {
  const [vendors, { data: orders }] = await Promise.all([
    getVendors(),
    supabaseAdmin.from('vendor_orders').select('*')
  ]);

  return (
    <VendorsClient 
      initialVendors={vendors || []} 
      initialOrders={orders || []}
    />
  );
}
