export const dynamic = 'force-dynamic';

import { getMaterialDemands } from '@/lib/data';
import DemandsClient from './client';

export default async function DemandsPage() {
  const demands = await getMaterialDemands();

  return <DemandsClient initialDemands={demands || []} />
}
