const fs = require('fs');
const path = require('path');

const files = [
  "app/sales/pipeline/page.tsx",
  "app/sales/financial/client.tsx",
  "app/sales/visits/components/visits-client.tsx",
  "app/sales/visits/client.tsx",
  "app/sales/leads/components/leads-client.tsx",
  "app/sales/leads/page.tsx",
  "app/sales/components/SalesDashboardClient.tsx",
  "app/sales/properties/page.tsx",
  "app/sales/inventory/components/inventory-client.tsx",
  "app/sales/documents/client.tsx",
  "app/construction/demands/manager-view.tsx",
  "app/construction/demands/admin-view.tsx",
  "app/construction/stock/stock-client.tsx",
  "app/construction/client.tsx",
  "app/construction/assets/assets-client.tsx",
  "app/dashboard/pl/client.tsx",
  "app/dashboard/pl/page.tsx",
  "app/dashboard/financials/financials-client.tsx",
  "app/dashboard/inventory-overview/inventory-client.tsx",
  "app/dashboard/projects/page.tsx",
  "app/dashboard/team/client.tsx",
  "app/dashboard/construction/page.tsx",
  "app/dashboard/client.tsx",
  "app/dashboard/leads-overview/leads-client.tsx",
  "app/dashboard/reports/page.tsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('length === 0')) {
    // Check if EmptyState is imported
    if (!content.includes('import { EmptyState }')) {
      // add import after the last import
      const lastImportIndex = content.lastIndexOf('import ');
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + 
                'import { EmptyState } from "@/components/ui/empty-state";\n' + 
                content.slice(endOfLastImport + 1);
    }
    
    // We will not do complex regex for all files right now. Just inserting imports.
    fs.writeFileSync(file, content);
  }
}
