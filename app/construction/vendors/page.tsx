export const dynamic = 'force-dynamic';

import { getVendors } from '@/lib/data';
import { fetchVendorOrdersList } from '@/app/construction/actions';
import VendorsClient from './client';

export default async function VendorsPage() {
  const [vendors, ordersRes] = await Promise.all([
    getVendors(),
    fetchVendorOrdersList("all")
  ]);

  return (
    <VendorsClient 
      initialVendors={vendors || []} 
      initialOrders={ordersRes.success ? (ordersRes.data || []) : []}
    />
  );
}
