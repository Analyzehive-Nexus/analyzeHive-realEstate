export const dynamic = 'force-dynamic';

import { getAssets } from '@/lib/data';
import AssetsClient from './client';

export default async function AssetsPage() {
  const assets = await getAssets();

  return <AssetsClient initialAssets={assets || []} />
}
