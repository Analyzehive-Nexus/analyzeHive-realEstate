export const dynamic = 'force-dynamic';

import { getVendors } from '@/lib/data';
import VendorsClient from './client';

export default async function VendorsPage() {
  const vendors = await getVendors();

  return <VendorsClient initialVendors={vendors || []} />
}
