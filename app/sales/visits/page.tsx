import { Suspense } from 'react';
import VisitsClient from './client';

export const dynamic = 'force-dynamic';

export default function VisitsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <VisitsClient />
    </Suspense>
  );
}
