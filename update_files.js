const fs = require('fs');
const path = require('path');

function findFiles(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(file, filter));
    } else if (filter(file)) {
      results.push(file);
    }
  });
  return results;
}

const layouts = [
  'app/dashboard/layout.tsx',
  'app/sales/layout.tsx',
  'app/construction/layout.tsx'
];

layouts.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  // Add 'use client' at top
  if (!code.includes('"use client"') && !code.includes("'use client'")) {
    code = '"use client";\n\n' + code;
  }

  // Add imports
  if (!code.includes('MobileSidebarSheet')) {
    code = code.replace(/import \{ ReactNode \} from "react"/, 
      'import { ReactNode } from "react"\nimport { MobileSidebarSheet } from "@/components/shared/MobileSidebarSheet"\nimport { useMediaQuery } from "@/hooks/useMediaQuery"');
  }

  // Add isMobile
  if (!code.includes('useMediaQuery')) {
    code = code.replace(/(const user = .*)/, '$1\n  const isMobile = useMediaQuery("(max-width: 768px)");');
  }

  // Hide global search on mobile
  code = code.replace(/className="flex-1 max-w-md mx-6"/g, 'className="hidden md:block flex-1 max-w-md mx-6"');
  
  // Also ModuleSwitcher in layouts
  code = code.replace(/<ModuleSwitcher \/>/, '<div className="hidden sm:block"><ModuleSwitcher /></div>');

  // Update Sidebar rendering
  if (file.includes('dashboard')) {
    code = code.replace(/<DashboardSidebar user=\{user\} \/>/, '{!isMobile && <DashboardSidebar user={user} />}');
    code = code.replace(/className="flex-1 flex flex-col pl-\[260px\] relative"/, 'className={`flex-1 flex flex-col relative ${isMobile ? "pl-0" : "pl-[260px]"}`}');
    code = code.replace(/(<div className="flex items-center justify-between h-\[64px\].*?>)/, '$1\n            {isMobile && (\n              <MobileSidebarSheet>\n                <DashboardSidebar user={user} />\n              </MobileSidebarSheet>\n            )}');
  } else if (file.includes('sales')) {
    code = code.replace(/<SalesSidebar user=\{user\} \/>/, '{!isMobile && <SalesSidebar user={user} />}');
    code = code.replace(/className="flex-1 flex flex-col pl-\[260px\] relative"/, 'className={`flex-1 flex flex-col relative ${isMobile ? "pl-0" : "pl-[260px]"}`}');
    code = code.replace(/(<header .*?>)/, '$1\n          <div className="flex items-center gap-2">\n            {isMobile && (\n              <MobileSidebarSheet>\n                <SalesSidebar user={user} />\n              </MobileSidebarSheet>\n            )}\n          </div>');
  } else if (file.includes('construction')) {
    code = code.replace(/<ConstructionSidebar user=\{user\} \/>/, '{!isMobile && <ConstructionSidebar user={user} />}');
    code = code.replace(/className="flex-1 flex flex-col pl-\[260px\] relative"/, 'className={`flex-1 flex flex-col relative ${isMobile ? "pl-0" : "pl-[260px]"}`}');
    code = code.replace(/(<header .*?>)/, '$1\n          <div className="flex items-center gap-2">\n            {isMobile && (\n              <MobileSidebarSheet>\n                <ConstructionSidebar user={user} />\n              </MobileSidebarSheet>\n            )}\n          </div>');
  }

  fs.writeFileSync(file, code);
  console.log('Updated ' + file);
});

const sidebars = [
  'app/dashboard/components/dashboard-sidebar.tsx',
  'app/sales/components/sales-sidebar.tsx',
  'app/construction/components/construction-sidebar.tsx'
];

sidebars.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/className="ml-auto text-slate-400 hover:text-white transition-colors"/g, 'className="ml-auto text-slate-400 hover:text-white transition-colors shrink-0"');
  fs.writeFileSync(file, code);
  console.log('Updated ' + file);
});

const allTsxFiles = findFiles('app', f => f.endsWith('.tsx'));
allTsxFiles.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  let originalCode = code;
  
  // KPI cards grid: md:grid-cols-4 -> grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
  code = code.replace(/className="([^"]*)md:grid-cols-4([^"]*)"/g, (match, p1, p2) => {
    if (match.includes('grid-cols-1')) return match;
    return `className="${p1}grid-cols-1 sm:grid-cols-2 lg:grid-cols-4${p2}"`;
  });

  code = code.replace(/className="([^"]*)md:grid-cols-5([^"]*)"/g, (match, p1, p2) => {
    if (match.includes('grid-cols-1')) return match;
    return `className="${p1}grid-cols-1 sm:grid-cols-2 lg:grid-cols-5${p2}"`;
  });
  
  code = code.replace(/className="([^"]*)md:grid-cols-3([^"]*)"/g, (match, p1, p2) => {
    if (match.includes('grid-cols-1')) return match;
    return `className="${p1}grid-cols-1 sm:grid-cols-2 lg:grid-cols-3${p2}"`;
  });

  code = code.replace(/className="([^"]*)grid-cols-2([^"]*)"/g, (match, p1, p2) => {
    if (match.includes('grid-cols-1') || match.includes('sm:grid-cols-2') || match.includes('md:grid-cols-2')) return match;
    return `className="${p1}grid-cols-1 md:grid-cols-2${p2}"`;
  });

  // Safely wrap <Table> with <ResponsiveTable>
  // Only replace the root <Table> and </Table>, ensuring we don't match <TableCell>
  if (code.match(/<Table\b(?!Head|Row|Cell|Body)/) && !code.includes('ResponsiveTable')) {
    // Only exact <Table> or <Table ...> but NOT <TableCell>
    code = code.replace(/<Table\b([^>]*)>/g, '<ResponsiveTable>\n<Table$1>');
    code = code.replace(/<\/Table>/g, '</Table>\n</ResponsiveTable>');
    
    // Add import right after use client or at top
    const importStatement = 'import { ResponsiveTable } from "@/components/ui/responsive-table";\n';
    if (code.includes('"use client"')) {
      code = code.replace(/"use client";?/, '"use client";\n' + importStatement);
    } else if (code.includes("'use client'")) {
      code = code.replace(/'use client';?/, "'use client';\n" + importStatement);
    } else {
      code = importStatement + code;
    }
  }

  // Ensure "use client" for specific components
  const clientFiles = [
    'app/construction/assets/client.tsx',
    'app/construction/budget/page.tsx',
    'app/construction/client.tsx',
    'app/construction/demands/client.tsx',
    'app/construction/labour/client.tsx'
  ];
  
  if (clientFiles.some(c => file.endsWith(c))) {
    if (!code.includes('"use client"') && !code.includes("'use client'")) {
       code = '"use client";\n\n' + code;
    }
  }

  if (code !== originalCode) {
    fs.writeFileSync(file, code);
    console.log('Updated logic in ' + file);
  }
});
