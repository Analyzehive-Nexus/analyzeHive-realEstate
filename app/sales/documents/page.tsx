import { Suspense } from 'react';
import DocumentsClient from './client';

export const dynamic = 'force-dynamic';

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading documents...</div>}>
      <DocumentsClient />
    </Suspense>
  );
}
