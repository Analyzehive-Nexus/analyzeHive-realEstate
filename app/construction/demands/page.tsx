import { getMaterialDemands, getInventoryItems } from '@/lib/data';
import { getSessionUser } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabase';
import DemandsClient from './client';

export default async function DemandsPage() {
  const [demands, inventoryItems, sessionUser, { data: dbUsers }] = await Promise.all([
    getMaterialDemands(),
    getInventoryItems(),
    getSessionUser(),
    supabaseAdmin.from('users').select('id, name')
  ]);

  return (
    <DemandsClient 
      initialDemands={demands || []} 
      inventoryItems={inventoryItems || []} 
      sessionUser={sessionUser}
      dbUsers={dbUsers || []}
    />
  );
}
