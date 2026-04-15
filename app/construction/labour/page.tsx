export const dynamic = 'force-dynamic';

import { getLabourAttendance, getAttendanceStats } from '@/lib/data';
import LabourClient from './client';

export default async function LabourPage() {
  const [labour, stats] = await Promise.all([
    getLabourAttendance(), 
    getAttendanceStats()
  ]);

  return <LabourClient initialLabour={labour || []} stats={stats} />
}
