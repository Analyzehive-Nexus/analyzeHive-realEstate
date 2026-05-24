export const dynamic = 'force-dynamic';

import { getFinancialLedger } from '@/lib/data';
import BudgetClient from './client';

export default async function BudgetPage() {
  const transactions = await getFinancialLedger();

  return <BudgetClient initialTransactions={transactions || []} />
}
