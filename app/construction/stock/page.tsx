export const dynamic = 'force-dynamic';

import { getInventoryItems, getInventoryStats } from '@/lib/data';
import StockClient from './client';

export default async function StockPage() {
  const [items, stats] = await Promise.all([
    getInventoryItems(), 
    getInventoryStats()
  ]);

  return <StockClient items={items || []} stats={stats} />
}
