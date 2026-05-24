export const dynamic = 'force-dynamic';

import { getAssets } from '@/lib/data';
import { supabaseAdmin } from '@/lib/supabase';
import AssetsClient from './client';

export default async function AssetsPage() {
  const [assets, { data: users }] = await Promise.all([
    getAssets(),
    supabaseAdmin.from('users').select('id, name').order('name')
  ]);

  return (
    <AssetsClient 
      initialAssets={assets || []} 
      users={users || []} 
    />
  );
}
