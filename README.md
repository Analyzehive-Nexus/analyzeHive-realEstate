# Analyzehive Flow - Real Estate ERP

This is the foundation layer for the Analyzehive Flow Real Estate ERP build with Next.js 14 App Router, Supabase, and WorkOS.

## Prerequisites
- Node.js (>= 18)
- Supabase Project
- WorkOS account
- Sensy WhatsApp API account

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy the example `.env` file and replace the placeholder keys with actual values.
   ```bash
   cp .env.local.example .env.local
   ```
   
   - **Supabase**: Get the `URL` and `Service Role Key` (do NOT expose this to the frontend) from your project settings.
   - **WorkOS**: Required for authentication middleware. Use `WORKOS_API_KEY` from WorkOS dashboard.
   - **Sensy**: API keys for webhook and WhatsApp reminders.

3. **Supabase Setup**
   Run the included `supabase/schema.sql` file in your Supabase SQL Editor. This will configure your tables and enable strict Row Level Security (RLS) that denies access to public requests. All database interactions should be handled via server-side logic using the Service Role Key.

4. **Run Locally**
   Start the development server:
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to view the application.

## Directory Structure

- `app/dashboard` - MD route
- `app/sales` - VP_SALES, BROKER route
- `app/construction` - SITE_MANAGER, ADMIN route
- `app/api/webhooks` - Integrations (Sensy lead creation and visit reminders)
- `components/ui` - Shadcn components (exportable wrapper)
- `components/shared` - Common layouts and navbars
- `lib/` - Supabase admin client and WorkOS configurations
- `supabase/` - Database SQL schema

## Authentication & Authorization

All routes are protected by `@workos-inc/authkit-nextjs` via `middleware.ts`. Access control relies on ensuring the correct roles are checked server-side before serving shielded paths.
