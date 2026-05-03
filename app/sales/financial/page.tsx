import { Suspense } from "react";
import FinancialClient from "./client";

export const dynamic = "force-dynamic";

export default function FinancialPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading financial data...</div>}>
      <FinancialClient />
    </Suspense>
  );
}
