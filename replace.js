const fs = require('fs');
const files = [
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\sales\\visits\\actions.ts",
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\sales\\inventory\\page.tsx",
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\sales\\inventory\\actions.ts",
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\sales\\leads\\actions.ts",
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\construction\\stock\\actions.ts",
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\dashboard\\leads-overview\\page.tsx",
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\dashboard\\inventory-overview\\page.tsx",
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\construction\\demands\\actions.ts",
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\dashboard\\financials\\actions.ts",
  "g:\\Analyzehive Global LLP\\Products\\Flow\\Real Estate\\app\\dashboard\\financials\\page.tsx"
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/supabaseAdmin/g, 'supabase');
  fs.writeFileSync(f, content, 'utf8');
}
console.log("Replaced successfully!");
