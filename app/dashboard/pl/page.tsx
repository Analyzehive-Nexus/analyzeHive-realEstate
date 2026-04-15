export const dynamic = 'force-dynamic';

import { getFinancialLedger } from '@/lib/data';
import ProfitLossClient from './client';

export default async function ProfitLossPage() {
  const ledger = await getFinancialLedger();

  return <ProfitLossClient ledger={ledger || []} />
}
