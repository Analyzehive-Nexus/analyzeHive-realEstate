export const dynamic = 'force-dynamic';

import { getDailyProgress } from '@/lib/data';
import ProgressClient from './client';

export default async function ProgressReportsPage() {
  const reports = await getDailyProgress();

  return <ProgressClient initialReports={reports || []} />
}
