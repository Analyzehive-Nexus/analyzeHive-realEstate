DEPLOYMENT & OVERVIEW
======================

Summary
-------
This document lists environment variables, Supabase tables, WorkOS roles (where used), staging & production URLs, deployment steps, known limitations, and a short "for my boss" usage guide.

Environment Variables
---------------------
(see `.env.example` — copy to `.env.local` and fill values)

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- WORKOS_API_KEY
- WORKOS_CLIENT_ID
- WORKOS_REDIRECT_URI
- WORKOS_COOKIE_PASSWORD
- SENSY_API_URL
- SENSY_API_KEY
- NEXT_PUBLIC_BROCHURE_URL
- INTERNAL_BROKER_PHONE
- CRON_SECRET

Supabase: Tables & purpose
--------------------------
(Primary tables used by the app)
- users — application users and roles (ADMIN, VP_SALES, BROKER, SUPERVISOR)
- leads_customers — CRM leads pipeline
- flats_inventory — inventory of flats/projects
- site_visits — scheduled site visits
- documents — uploaded KYC/payment docs
- payments — payment records
- financial_ledger — income/expense ledger
- projects — construction projects
- vendors — supplier records
- vendor_orders — purchase orders (POs)
- whatsapp_messages — stored WhatsApp messages
- inventory_items / stock_items — construction materials
- material_demands / demand_requests — material requests
- daily_progress — construction daily progress entries

(Indexes and RLS policies are enabled for performance and security.)

WorkOS Users & Roles
--------------------
This app uses WorkOS for SSO; user identities are managed in the WorkOS dashboard.
Roles used in-app (assign within WorkOS or app db):
- ADMIN — full access
- VP_SALES — high-level sales access
- BROKER — sales agent
- SUPERVISOR — construction supervisor

To list actual users: open WorkOS Dashboard → Directory Sync / SSO (use your WorkOS credentials).

Staging & Production URLs
-------------------------
- Staging URL: https://staging.app.analyzehive.com (configured in .env WORKOS_REDIRECT_URI)
- Production URL: (set by your deployment host, e.g., Vercel) — update `NEXT_PUBLIC_BROCHURE_URL` and envs accordingly.

How to Deploy (quick)
---------------------
1. Ensure environment variables are set in the target host (Vercel / Netlify / custom server).
2. Build and upload DB schema (recommended): use `scripts/setup-supabase.js` or Supabase SQL Editor. The repo contains `scripts/setup-supabase.js` for one-off setup.

Local dev:
```bash
cp .env.example .env
# fill values in .env
npm install
npm run dev
```

Production build & deploy (Vercel recommended):
```bash
npm run build
# deploy via Vercel or push to main branch / CI
```

If using Supabase CLI/migrations:
- Add SQL migration files under `supabase/migrations/`
- `supabase login` → `supabase link --project-ref <ref>` → `supabase db push`

Commit & push
- Use git workflow: create branch → commit → open PR → merge to `main` → deploy.

Known Limitations & Notes
-------------------------
- WorkOS user list is central; this doc includes roles only — actual user provisioning is via WorkOS.
- The app relies on Supabase `service_role` key for server admin actions; keep it secret.
- Some table naming differences exist historically (`stock_items` vs `inventory_items`, `demand_requests` vs `material_demands`) — code maps both where needed.
- `vendor_orders` is auto-created by setup script fallback but prefer running the SQL migration in Supabase for auditability.
- RLS applied to critical tables; service-role bypasses RLS — test with anon keys for client behavior.
- Seed data is included for staging only. Remove or replace for production.

For My Boss — Short Usage Guide
------------------------------
1. Purpose: central ERP for sales, construction, vendors, and finance.
2. How to access: use company SSO (WorkOS) — provide me the user list to onboard.
3. Where to check status: open staging URL and login as ADMIN. Key dashboards:
   - Dashboard → Overview (KPIs)
   - Sales → Leads & Documents
   - Construction → Stock, Vendors, Daily Progress
   - Financials → Ledger & Cashflow
4. To approve vendor POs or payments: navigate to Construction → Vendors and use the action buttons.
5. If you see missing data or permission issues: contact engineering with a screenshot and the affected user email.

Files & Scripts (quick reference)
---------------------------------
- `scripts/setup-supabase.js` — sets up tables + seed data in Supabase (use with service_role key)
- `docs/DEPLOYMENT_AND_OVERVIEW.md` — this file
- `SUPABASE_SCRIPTS_NEEDED.md` — detailed SQL templates
- `IMPLEMENTATION_GUIDE.md` — step-by-step instructions for manual setup

Contact / Support
-----------------
- Developer: (add internal contact) — for deployment and DB access
- Ops: ensure Supabase project access and WorkOS admin credentials

