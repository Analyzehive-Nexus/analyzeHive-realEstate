# Project structure and source code

Generated for reference. Excludes: `node_modules` (per `.gitignore`), `.next` build output, `package-lock.json`, `logo.png`, log files, `ts_errors*.txt`, `tsconfig.tsbuildinfo`, and `.env.local` (secrets).

## File tree
```
analyzeHive-realEstate/
├── .env.local.example
├── .gitignore
├── README.md
├── app
│   ├── api
│   │   ├── auth
│   │   │   └── callback
│   │   │       └── route.ts
│   │   └── webhooks
│   │       ├── lead-created
│   │       │   └── route.ts
│   │       └── visit-reminder
│   │           └── route.ts
│   ├── construction
│   │   ├── assets
│   │   │   ├── actions.ts
│   │   │   ├── assets-client.tsx
│   │   │   ├── client.tsx
│   │   │   └── page.tsx
│   │   ├── budget
│   │   │   └── page.tsx
│   │   ├── client.tsx
│   │   ├── components
│   │   │   └── construction-sidebar.tsx
│   │   ├── demands
│   │   │   ├── actions.ts
│   │   │   ├── admin-view.tsx
│   │   │   ├── client.tsx
│   │   │   ├── manager-view.tsx
│   │   │   └── page.tsx
│   │   ├── labour
│   │   │   ├── client.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── progress
│   │   │   ├── client.tsx
│   │   │   └── page.tsx
│   │   ├── stock
│   │   │   ├── actions.ts
│   │   │   ├── client.tsx
│   │   │   ├── page.tsx
│   │   │   └── stock-client.tsx
│   │   └── vendors
│   │       ├── client.tsx
│   │       └── page.tsx
│   ├── dashboard
│   │   ├── cashflow
│   │   │   └── page.tsx
│   │   ├── client.tsx
│   │   ├── components
│   │   │   └── dashboard-sidebar.tsx
│   │   ├── dashboard-nav.tsx
│   │   ├── financials
│   │   │   ├── actions.ts
│   │   │   ├── financials-client.tsx
│   │   │   └── page.tsx
│   │   ├── forecast
│   │   │   └── page.tsx
│   │   ├── inventory-overview
│   │   │   ├── inventory-client.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── leads-overview
│   │   │   ├── leads-client.tsx
│   │   │   └── page.tsx
│   │   ├── overview-client.tsx
│   │   ├── page.tsx
│   │   ├── pl
│   │   │   ├── client.tsx
│   │   │   └── page.tsx
│   │   ├── projects
│   │   │   └── page.tsx
│   │   ├── reports
│   │   │   └── page.tsx
│   │   ├── sales
│   │   │   └── page.tsx
│   │   └── team
│   │       ├── client.tsx
│   │       └── page.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── sales
│       ├── analytics
│       │   └── page.tsx
│       ├── components
│       │   ├── SalesDashboardClient.tsx
│       │   └── sales-sidebar.tsx
│       ├── documents
│       │   ├── client.tsx
│       │   └── page.tsx
│       ├── financial
│       │   ├── client.tsx
│       │   └── page.tsx
│       ├── forecast
│       │   └── page.tsx
│       ├── inventory
│       │   ├── actions.ts
│       │   ├── components
│       │   │   └── inventory-client.tsx
│       │   └── page.tsx
│       ├── layout.tsx
│       ├── leads
│       │   ├── actions.ts
│       │   ├── components
│       │   │   └── leads-client.tsx
│       │   └── page.tsx
│       ├── page.tsx
│       ├── properties
│       │   └── page.tsx
│       └── visits
│           ├── actions.ts
│           ├── client.tsx
│           ├── components
│           │   └── visits-client.tsx
│           └── page.tsx
├── components
│   ├── shared
│   │   ├── Logo.tsx
│   │   └── index.ts
│   └── ui
│       ├── badge.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── index.ts
│       ├── input.tsx
│       ├── label.tsx
│       ├── native-select.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── toast.tsx
├── components.json
├── lib
│   ├── data.ts
│   ├── supabase-browser.ts
│   ├── supabase.ts
│   ├── utils.ts
│   └── workos.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── replace.js
├── scripts
│   └── seed-check.ts
├── supabase
│   └── schema.sql
├── tailwind.config.ts
└── tsconfig.json
```

## File contents

### `.env.local.example`
*[Non-text extension omitted]*

### `.gitignore`
```
node_modules
```

### `README.md`
````markdown
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
````

### `app/api/auth/callback/route.ts`
```typescript
import { handleAuth } from '@workos-inc/authkit-nextjs';

export const GET = handleAuth();
```

### `app/api/webhooks/lead-created/route.ts`
```typescript
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { lead } = body

    if (!lead || !lead.phone || !lead.name) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Mock Sensy WhatsApp API config
    const SENSY_API_URL = process.env.SENSY_API_URL || "https://api.sensy.example.com/send"
    const SENSY_API_KEY = process.env.SENSY_API_KEY || "mock-api-key"
    const BROCHURE_URL = process.env.NEXT_PUBLIC_BROCHURE_URL || "https://example.com/brochure.pdf"

    // 1. Send welcoming message to lead
    const leadMessage = `Hi ${lead.name}! Thank you for your interest in our Project. Here is your digital brochure: ${BROCHURE_URL}. Our team will call you shortly.`
    
    // 2. Alert the assigned broker (if known, otherwise a generic internal number)
    const brokerPhone = process.env.INTERNAL_BROKER_PHONE || "+910000000000" // In a real system, fetch broker's phone from profiles
    const internalMessage = `New Lead Alert! Source: ${lead.source}. Name: ${lead.name}. Phone: ${lead.phone}. Assigned to: ${lead.assigned_broker_id || "Unassigned"}`

    console.log(`[Webhook] Simulating Sensy WhatsApp API call to Lead (${lead.phone}):`, leadMessage)
    console.log(`[Webhook] Simulating Sensy WhatsApp API call to Broker (${brokerPhone}):`, internalMessage)

    // Example fetch to Sensy API (mocked):
    /*
    await fetch(SENSY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SENSY_API_KEY}`
      },
      body: JSON.stringify({
        to: lead.phone,
        message: leadMessage
      })
    })
    */

    return NextResponse.json({ success: true, message: "Webhook processed successfully" })
  } catch (error: any) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
```

### `app/api/webhooks/visit-reminder/route.ts`
```typescript
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  // To ensure security in production, verify a secret token passed from the cron job
  // const authHeader = req.headers.get("Authorization")
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }
  
  try {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const { data: visits, error } = await supabase
      .from("site_visits")
      .select(`
        visit_id, scheduled_at, lead_id, flat_id,
        leads_customers (id, name, phone)
      `)
      .eq("reminder_sent", false)
      .eq("status", "Scheduled")
      .gte("scheduled_at", now.toISOString())
      .lte("scheduled_at", tomorrow.toISOString())

    if (error) {
      console.error("Supabase query error:", error)
      throw error
    }

    if (!visits || visits.length === 0) {
      return NextResponse.json({ message: "No upcoming visits to remind" })
    }

    const notifiedVisitIds = []

    for (const visit of visits) {
      const lead: any = Array.isArray(visit.leads_customers) ? visit.leads_customers[0] : visit.leads_customers
      if (!lead || !lead.phone) continue

      const timeString = new Date(visit.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const reminderMsg = `Hi ${lead.name}, this is a friendly reminder for your scheduled site visit tomorrow at ${timeString}. We look forward to seeing you!`

      // Mock Sensy WhatsApp API call
      console.log(`[Cron Webhook] Simulating Sensy reminder to ${lead.phone}:`, reminderMsg)

      notifiedVisitIds.push(visit.visit_id)
    }

    if (notifiedVisitIds.length > 0) {
      const { error: updateError } = await supabase
        .from("site_visits")
        .update({ reminder_sent: true })
        .in("visit_id", notifiedVisitIds)
        
      if (updateError) {
         console.error("Error updating reminder_sent status:", updateError)
      }
    }

    return NextResponse.json({ success: true, remindersSent: notifiedVisitIds.length })
  } catch (error: any) {
    console.error("Visit reminder webhook error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
```

### `app/construction/assets/actions.ts`
```typescript
"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addAsset(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string || "Active";

  if (!name || !type) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase.from("assets").insert({
    name,
    type,
    status
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/construction/assets");
  return { success: true };
}

export async function updateAssetStatus(assetId: string, status: string) {
  if (!assetId || !status) return { error: "Invalid parameters" };

  const { error } = await supabase
    .from("assets")
    .update({ status, last_updated: new Date().toISOString() })
    .eq("asset_id", assetId);

  if (error) return { error: error.message };

  revalidatePath("/construction/assets");
  return { success: true };
}
```

### `app/construction/assets/assets-client.tsx`
```tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Settings2, ShieldCheck, AlertTriangle, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { addAsset, updateAssetStatus } from "./actions";

type Asset = {
  asset_id: string;
  name: string;
  type: string;
  status: string;
  last_updated: string;
};

export default function AssetsClient({ assets }: { assets: Asset[] }) {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddAsset(formData: FormData) {
    setIsLoading(true);
    const result = await addAsset(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Asset added successfully." });
      setIsAddOpen(false);
    }
  }

  async function handleStatusChange(assetId: string, newStatus: string) {
    const result = await updateAssetStatus(assetId, newStatus);
    if (result?.error) {
      toast({ title: "Update Failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Status Updated", description: `Asset status changed to ${newStatus}.` });
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "Decommissioned": return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <ShieldCheck className="h-4 w-4 mr-1.5" />;
      case "Maintenance": return <AlertTriangle className="h-4 w-4 mr-1.5" />;
      case "Decommissioned": return <PowerOff className="h-4 w-4 mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Assets & Machinery</h1>
          <p className="text-slate-500 mt-1">Manage heavy equipment and track their operational status.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Asset</DialogTitle>
            </DialogHeader>
            <form action={handleAddAsset} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Asset Name/Model</Label>
                <Input id="name" name="name" placeholder="e.g. CAT Excavator 320" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Equipment Type</Label>
                  <Select name="type" required defaultValue="Excavator">
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excavator">Excavator</SelectItem>
                      <SelectItem value="Generator">Generator</SelectItem>
                      <SelectItem value="Crane">Crane</SelectItem>
                      <SelectItem value="Mixer">Mixer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Initial Status</Label>
                  <Select name="status" defaultValue="Active">
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Asset'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No assets registered yet.
          </div>
        ) : assets.map(asset => (
          <Card key={asset.asset_id} className="relative overflow-hidden border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
            <div className={`absolute top-0 left-0 w-1 h-full ${asset.status === 'Active' ? 'bg-green-500' : asset.status === 'Maintenance' ? 'bg-yellow-500' : 'bg-slate-400'}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold truncate pr-2" title={asset.name}>
                  {asset.name}
                </CardTitle>
                <Settings2 className="h-5 w-5 text-slate-400 shrink-0" />
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{asset.type}</div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="mt-2 text-xs text-slate-400">
                Last updated: {format(new Date(asset.last_updated), "MMM d, yyyy")}
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
              <Select defaultValue={asset.status} onValueChange={(val) => handleStatusChange(asset.asset_id, val)}>
                <SelectTrigger className={`h-8 border text-xs font-semibold px-2 w-full justify-start ${getStatusColor(asset.status)}`}>
                  <div className="flex items-center">
                    {getStatusIcon(asset.status)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### `app/construction/assets/client.tsx`
```tsx
"use client"

import { useState } from "react"
import { 
  Truck, Search, Filter, Plus, FileDown, Clock, MapPin, Wrench, User,
  Calendar, RotateCcw, AlertTriangle, CheckCircle, MoreVertical
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock array replaced by props

const usageLogs = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 8.0 },
  { day: "Wed", hours: 7.5 },
  { day: "Thu", hours: 5.0 },
  { day: "Fri", hours: 8.5 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 0.0 },
];

const maintHistory = [
  { date: "Feb 15, 2026", type: "Routine Oil Change", by: "TechMech Services", cost: "₹12,400", notes: "Changed filters and hydraulic fluid." },
  { date: "Nov 10, 2025", type: "Part Replacement", by: "TechMech Services", cost: "₹45,000", notes: "Replaced main cylinder seal." },
  { date: "Aug 05, 2025", type: "Routine Inspection", by: "In-house", cost: "₹0", notes: "All check passed." },
];

const StatusBadge = ({ s }: { s: string }) => {
  if (s === 'Active') return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-[6px] tracking-wider font-bold">Active</Badge>;
  if (s === 'Maintenance') return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 shadow-none text-[10px] uppercase rounded-[6px] tracking-wider font-bold">Maintenance</Badge>;
  return <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 shadow-none text-[10px] uppercase rounded-[6px] tracking-wider font-bold">Decommissioned</Badge>;
};

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function AssetsClient({ initialAssets }: { initialAssets: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const allAssets = initialAssets.map(a => ({
    id: a.id?.substring(0,8) || 'Unknown',
    name: a.asset_name || 'Unnamed Asset',
    type: a.asset_type || 'General',
    status: a.status || 'Active',
    nextService: a.next_maintenance_date ? new Date(a.next_maintenance_date).toLocaleDateString() : '--',
    assigned: 'Site Team', // Mock for now if no assigned user
    location: a.current_location || 'Storage',
    hours: a.total_hours_used || 0,
    purch: a.purchase_date ? new Date(a.purchase_date).toLocaleDateString() : '--',
    cost: a.purchase_cost ? `₹${(a.purchase_cost / 100000).toFixed(1)}L` : '--'
  }));

  const filteredAssets = allAssets.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Asset & Equipment Tracking</h1>
        <p className="text-sm text-slate-500">Monitor machinery, schedules, maintenance logs, and asset allocation.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Assets</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{allAssets.length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Active</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">{allAssets.filter(a => a.status === 'Active').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">In Maintenance</p>
            <h3 className="text-[32px] font-bold text-[#F59E0B] leading-tight">{allAssets.filter(a => a.status === 'Maintenance').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-slate-400">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Decommissioned</p>
            <h3 className="text-[32px] font-bold text-slate-600 leading-tight">{allAssets.filter(a => a.status === 'Decommissioned').length}</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR & VIEW TOGGLE */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search assets..." 
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="excavator">Excavators</SelectItem>
              <SelectItem value="crane">Cranes</SelectItem>
              <SelectItem value="mixer">Mixers</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-100 p-1 rounded-[10px] flex items-center">
             <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className={`h-8 px-3 rounded-[8px] text-[12px] ${viewMode === 'grid' ? 'bg-white text-[#0066FF] shadow-sm font-bold' : 'text-slate-500 font-semibold hover:bg-slate-200/50 hover:text-slate-700'}`}>Grid</Button>
             <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('table')} className={`h-8 px-3 rounded-[8px] text-[12px] ${viewMode === 'table' ? 'bg-white text-[#0066FF] shadow-sm font-bold' : 'text-slate-500 font-semibold hover:bg-slate-200/50 hover:text-slate-700'}`}>Table</Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm flex gap-2 font-bold">
                <Plus className="w-4 h-4" /> Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Register New Asset</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asset Name</Label>
                    <Input placeholder="e.g. Concrete Pump" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Asset Type</Label>
                    <Select>
                      <SelectTrigger className="rounded-[8px]"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pump">Pump</SelectItem>
                        <SelectItem value="crane">Crane</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Asset ID Number</Label>
                    <Input placeholder="AST-009" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Date</Label>
                    <Input type="date" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Cost (₹)</Label>
                    <Input type="number" placeholder="0.00" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Location</Label>
                    <Select>
                      <SelectTrigger className="rounded-[8px]"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                         <SelectItem value="ta">Tower A</SelectItem>
                         <SelectItem value="tb">Tower B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-[8px]">Cancel</Button>
                <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] font-bold">Register Asset</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* ASSETS DISPLAY */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((ast) => {
             const statColor = ast.status === 'Active' ? 'bg-[#10B981]' : ast.status === 'Maintenance' ? 'bg-[#F59E0B]' : 'bg-slate-400'
             return (
            <InteractivePearlCard key={ast.id} className="relative group flex flex-col h-full">
              <div className={`h-1 w-full ${statColor} absolute top-0 left-0 right-0`} />
              <CardContent className="p-6 pt-6 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                   <div className={`h-12 w-12 rounded-[12px] flex items-center justify-center ${ast.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ast.status === 'Maintenance' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      <Truck className="h-6 w-6" />
                   </div>
                   <div className="flex flex-col items-end gap-1.5">
                      <StatusBadge s={ast.status} />
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-[4px]">{ast.id}</span>
                   </div>
                 </div>
                 
                 <h3 className="text-[17px] font-bold text-[#0F172A] leading-tight mb-4">{ast.name}</h3>
                 
                 <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-auto text-[13px]">
                    <div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider mb-1"><MapPin className="w-3 h-3 text-slate-400"/> Location</span>
                      <span className="font-semibold text-[#0F172A]">{ast.location}</span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider mb-1"><User className="w-3 h-3 text-slate-400"/> Assigned To</span>
                      <span className="font-semibold text-[#0F172A]">{ast.assigned}</span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider mb-1"><Clock className="w-3 h-3 text-slate-400"/> Hrs / Month</span>
                      <span className="font-semibold text-[#0F172A]">{ast.hours} <span className="text-slate-400 font-normal ml-0.5">hrs</span></span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-amber-600 text-[11px] uppercase font-bold tracking-wider mb-1"><Wrench className="w-3 h-3 text-amber-500"/> Next Service</span>
                      <span className="font-bold text-amber-700">{ast.nextService}</span>
                    </div>
                 </div>

                 <div className="flex gap-2 mt-6 pt-4 border-t border-[#E8ECF0]">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="flex-1 bg-white border border-[#E8ECF0] text-[#0F172A] hover:bg-slate-50 text-[13px] h-9 rounded-[8px] shadow-sm font-semibold">Details</Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-[500px]">
                        <SheetHeader className="mb-6">
                          <SheetTitle className="text-xl font-bold">{ast.name}</SheetTitle>
                          <div className="flex items-center gap-3 mt-2">
                             <StatusBadge s={ast.status} />
                             <span className="text-[13px] font-medium text-slate-500">ID: <span className="font-mono">{ast.id}</span></span>
                          </div>
                        </SheetHeader>
                        
                        <div className="space-y-6">
                           <div className="grid grid-cols-3 gap-3">
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0]">
                                 <p className="text-[10px] uppercase font-bold text-slate-400">Purchased</p>
                                 <p className="font-semibold text-[13px] text-[#0F172A] mt-1">{ast.purch}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0]">
                                 <p className="text-[10px] uppercase font-bold text-slate-400">Cost</p>
                                 <p className="font-semibold text-[13px] text-[#0F172A] mt-1">{ast.cost}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0]">
                                 <p className="text-[10px] uppercase font-bold text-slate-400">Total Hrs</p>
                                 <p className="font-semibold text-[13px] text-[#0F172A] mt-1">2,450</p>
                              </div>
                           </div>

                           <div>
                             <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">7-Day Usage Log</h4>
                             <div className="h-[200px] border border-[#E8ECF0] rounded-[12px] p-2 bg-white">
                               <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={usageLogs} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0"/>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '8px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                                    <Bar dataKey="hours" name="Hours" fill="#0066FF" radius={[4, 4, 0, 0]} barSize={24} />
                                  </BarChart>
                               </ResponsiveContainer>
                             </div>
                           </div>

                           <div>
                             <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                                Maintenance History
                                <Button variant="ghost" className="h-6 text-[#0066FF] hover:bg-blue-50 hover:text-[#0066FF] text-[11px] px-2 rounded-[6px]"><Plus className="w-3 h-3 mr-1"/> Log</Button>
                             </h4>
                             <div className="divide-y divide-[#E8ECF0] border border-[#E8ECF0] rounded-[12px] bg-white text-[13px]">
                                {maintHistory.map((m, idx) => (
                                  <div key={idx} className="p-3 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-bold text-[#0F172A]">{m.type}</span>
                                      <span className="font-bold text-[#0066FF]">{m.cost}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mb-1.5">{m.date} | By: {m.by}</div>
                                    <p className="text-slate-600 text-[12px] leading-relaxed">{m.notes}</p>
                                  </div>
                                ))}
                             </div>
                           </div>
                           
                           <div className="pt-4 border-t border-[#E8ECF0] flex gap-3">
                              {ast.status === 'Active' ? (
                                <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-[8px] font-bold">Send to Maintenance</Button>
                              ) : (
                                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[8px] font-bold">Mark as Active</Button>
                              )}
                           </div>
                        </div>
                      </SheetContent>
                    </Sheet>

                    <Button className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white text-[13px] h-9 rounded-[8px] shadow-sm font-semibold">Assign</Button>
                 </div>
              </CardContent>
            </InteractivePearlCard>
          )})}
        </div>
      ) : (
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Asset Details</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Type</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Current Assignment</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Location</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Maintenance</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((ast) => (
                <TableRow key={ast.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{ast.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">{ast.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[4px] text-[10px] font-bold tracking-wide uppercase border-slate-200">{ast.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[13px] text-[#0F172A] flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400"/> {ast.assigned}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[13px] text-[#0F172A] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400"/> {ast.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[13px] text-amber-700 flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-amber-500"/> {ast.nextService}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge s={ast.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8 text-[11px] rounded-[6px] font-semibold text-[#0F172A]">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PearlCard>
      )}

    </div>
  )
}
```

### `app/construction/assets/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import { getAssets } from '@/lib/data';
import AssetsClient from './client';

export default async function AssetsPage() {
  const assets = await getAssets();

  return <AssetsClient initialAssets={assets || []} />
}
```

### `app/construction/budget/page.tsx`
```tsx
"use client"

import { useState } from "react"
import { 
  IndianRupee, TrendingUp, TrendingDown, PieChart as PieIcon, 
  Search, Plus, FileDown, Receipt, Calendar, Filter, MoreVertical, Building2, Upload
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

import { 
  BarChart, Bar, AreaChart, Area, ComposedChart, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts"

// MOCK DATA
const budgetData = [
  { cat: "Civil Work", b: 8500000, s: 7230000, r: 1270000, pct: 85, status: "On Track" },
  { cat: "Steel & Structure", b: 4500000, s: 3850000, r: 650000, pct: 86, status: "Warning" },
  { cat: "Electrical", b: 1200000, s: 420000, r: 780000, pct: 35, status: "On Track" },
  { cat: "Plumbing", b: 800000, s: 310000, r: 490000, pct: 39, status: "On Track" },
  { cat: "Finishing", b: 2200000, s: 280000, r: 1920000, pct: 13, status: "On Track" },
  { cat: "Equip & Rentals", b: 1500000, s: 1550000, r: -50000, pct: 103, status: "Over Budget" },
];

const monthlyTrend = [
  { month: "Oct", Civil: 12, Steel: 8, Elec: 1, Plumb: 0.5, Fin: 0, Equip: 2 },
  { month: "Nov", Civil: 15, Steel: 10, Elec: 1.5, Plumb: 1, Fin: 0, Equip: 2.5 },
  { month: "Dec", Civil: 18, Steel: 8, Elec: 2, Plumb: 1, Fin: 0.5, Equip: 3 },
  { month: "Jan", Civil: 14, Steel: 5, Elec: 3, Plumb: 2, Fin: 1, Equip: 2.8 },
  { month: "Feb", Civil: 10, Steel: 4, Elec: 4, Plumb: 2, Fin: 3, Equip: 2.5 },
  { month: "Mar", Civil: 8, Steel: 3, Elec: 5, Plumb: 3, Fin: 4, Equip: 2 },
];

const txHistory = [
  { id: "EXP-015", date: "Mar 18", cat: "Civil Work", desc: "RMC Payment - Foundation C", vendor: "Rajhans Cement Co.", amt: 250000, inv: "INV-2026-99", status: "Approved" },
  { id: "EXP-014", date: "Mar 15", cat: "Equip & Rentals", desc: "Crane Rental - Tower B", vendor: "PowerGen Rentals", amt: 75000, inv: "INV-RNT-42", status: "Approved" },
  { id: "EXP-013", date: "Mar 12", cat: "Steel & Structure", desc: "TMT Bars 12mm", vendor: "Steel Plus Pvt Ltd", amt: 120000, inv: "INV-ST-198", status: "Approved" },
  { id: "EXP-012", date: "Mar 10", cat: "Civil Work", desc: "Red Bricks - 8500pcs", vendor: "City Brick Works", amt: 68000, inv: "INV-CBW-05", status: "Approved" },
  { id: "EXP-011", date: "Mar 08", cat: "Plumbing", desc: "PVC Pipes Bulk", vendor: "AquaTech Plumbing", amt: 45000, inv: "INV-AQ-88", status: "Pending" },
  { id: "EXP-010", date: "Mar 05", cat: "Electrical", desc: "Wires & Conduits", vendor: "Vidyut Electricals", amt: 32000, inv: "INV-VE-12", status: "Approved" },
  { id: "EXP-009", date: "Mar 02", cat: "Finishing", desc: "Ceramic Tiles - Tower A", vendor: "Surya Ceramics", amt: 110000, inv: "INV-SC-44", status: "Approved" },
  { id: "EXP-008", date: "Feb 28", cat: "Equip & Rentals", desc: "Excavator Fuel + Maintenance", vendor: "TechMech Services", amt: 24000, inv: "INV-TM-09", status: "Approved" },
  { id: "EXP-007", date: "Feb 25", cat: "Civil Work", desc: "River Sand - 50 tons", vendor: "Kaveri Sand", amt: 85000, inv: "INV-KS-112", status: "Approved" },
  { id: "EXP-006", date: "Feb 20", cat: "Hardware", desc: "Nails & Consumables", vendor: "FastFix Hardware", amt: 15000, inv: "INV-FF-04", status: "Approved" },
  { id: "EXP-005", date: "Feb 18", cat: "Steel & Structure", desc: "Binding Wire", vendor: "Steel Plus Pvt Ltd", amt: 28000, inv: "INV-ST-190", status: "Approved" },
  { id: "EXP-004", date: "Feb 15", cat: "Civil Work", desc: "Raft Foundation Labour", vendor: "Site Payment", amt: 150000, inv: "VCH-02-15", status: "Approved" },
  { id: "EXP-003", date: "Feb 10", cat: "Plumbing", desc: "Fittings Assorted", vendor: "AquaTech Plumbing", amt: 12000, inv: "INV-AQ-81", status: "Approved" },
  { id: "EXP-002", date: "Feb 05", cat: "Electrical", desc: "Temporary DB Boards", vendor: "Vidyut Electricals", amt: 40000, inv: "INV-VE-08", status: "Approved" },
  { id: "EXP-001", date: "Feb 01", cat: "Equip & Rentals", desc: "Mixer Service", vendor: "In-house", amt: 5000, inv: "VCH-02-01", status: "Approved" },
];

const formatCurLakhs = (val: number) => `₹${(val / 100000).toFixed(1)}L`;
const formatCur = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function BudgetPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTx = txHistory.filter(tx => 
    tx.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Budget vs Actual</h1>
        <p className="text-sm text-slate-500">Track project finances, category-wise expenditure, and expense history.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#0066FF]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Budget</p>
            <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight flex items-center gap-2">₹4.80Cr</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Spent</p>
            <h3 className="text-[32px] font-bold text-[#F59E0B] leading-tight flex items-center gap-2">₹3.93Cr</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Remaining</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">₹87L</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Burn Rate Target: 85%</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight flex items-center gap-2">81.9%</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* SECTION 1: BUDGET VS SPENT TRACKING */}
      <section className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col">
          <SectionHeading title="Category Allocation Tracker" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-xs text-[#64748B] uppercase py-4">Expense Category</TableHead>
                   <TableHead className="text-xs text-[#64748B] uppercase">Budget</TableHead>
                   <TableHead className="text-xs text-[#64748B] uppercase">Spent</TableHead>
                   <TableHead className="text-xs text-[#64748B] uppercase text-right">Remaining</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {budgetData.map((b, i) => (
                   <TableRow key={i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                     <TableCell className="py-4 w-2/5">
                        <div className="flex items-center justify-between mb-2">
                           <span className="font-bold text-[14px] text-[#0F172A]">{b.cat}</span>
                           <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-[4px] border ${b.status === 'On Track' ? 'text-[#10B981] bg-emerald-50 border-emerald-200' : b.status === 'Warning' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200'}`}>{b.status}</span>
                        </div>
                        <div className="flex items-center gap-3 w-full">
                           <Progress value={b.pct} className={`h-2 flex-1 ${b.pct > 100 ? 'bg-red-100 [&>div]:bg-red-600' : b.pct > 80 ? 'bg-amber-100 [&>div]:bg-amber-500' : 'bg-emerald-100 [&>div]:bg-[#10B981]'}`} />
                           <span className="text-[11px] font-bold text-slate-500 w-8">{b.pct}%</span>
                        </div>
                     </TableCell>
                     <TableCell className="py-4 font-bold text-[14px] text-slate-600">{formatCurLakhs(b.b)}</TableCell>
                     <TableCell className="py-4 font-bold text-[14px] text-[#0F172A]">{formatCurLakhs(b.s)}</TableCell>
                     <TableCell className="py-4 text-right">
                        <span className={`font-bold text-[14px] ${b.r < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                           {b.r < 0 ? `-${formatCurLakhs(Math.abs(b.r))}` : formatCurLakhs(b.r)}
                        </span>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="Expenditure Overview" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={budgetData.map(d => ({ ...d, b: d.b/100000, s: d.s/100000 }))} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8ECF0" />
                <YAxis dataKey="cat" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={80} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(val: number) => `₹${val.toFixed(1)}L`} />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }} />
                <Bar dataKey="b" name="Budgeted" fill="#0066FF" radius={[0, 4, 4, 0]} barSize={16} />
                <Bar dataKey="s" name="Spent" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={16} />
              </ComposedChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 2: MONTHLY SPEND BREAKDOWN */}
      <section>
         <SectionHeading title="Monthly Spend Breakdown (Lakhs)" />
         <PearlCard className="p-6">
            <div className="flex justify-start mb-6 gap-2">
               <Badge className="bg-blue-100 text-[#0066FF] hover:bg-blue-100 border-[#0066FF] shadow-none cursor-pointer">Civil Work</Badge>
               <Badge className="bg-amber-100 text-[#F59E0B] hover:bg-amber-100 border-[#F59E0B] shadow-none cursor-pointer">Steel</Badge>
               <Badge className="bg-indigo-100 text-indigo-500 hover:bg-indigo-100 border-indigo-500 shadow-none cursor-pointer">Electrical</Badge>
               <Badge className="bg-rose-100 text-rose-500 hover:bg-rose-100 border-rose-500 shadow-none cursor-pointer">Plumbing</Badge>
            </div>
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(v) => `₹${v}L`} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v) => `₹${v}L`} />
                     <Area type="monotone" dataKey="Civil" stackId="1" stroke="#0066FF" fill="#0066FF" fillOpacity={0.8} />
                     <Area type="monotone" dataKey="Steel" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
                     <Area type="monotone" dataKey="Elec" stackId="1" stroke="#6366F1" fill="#6366F1" fillOpacity={0.8} />
                     <Area type="monotone" dataKey="Plumb" stackId="1" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.8} />
                     <Area type="monotone" dataKey="Equip" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </PearlCard>
      </section>

      {/* SECTION 3: EXPENSE LOGS */}
      <section className="space-y-4">
        <SectionHeading title="Recent Expense Transactions" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
          <div className="flex flex-1 gap-4 items-center w-full">
            <div className="relative w-full max-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search description, vendor..." 
                className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-[180px]">
               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input type="date" defaultValue="2026-03-01" className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px] text-sm text-slate-500" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="civil">Civil Work</SelectItem>
                <SelectItem value="steel">Steel & Structure</SelectItem>
                <SelectItem value="elec">Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2">
                <Plus className="w-4 h-4" /> Log Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Log New Expense</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>Date</Label>
                     <Input type="date" className="rounded-[8px]" defaultValue="2026-03-18" />
                   </div>
                   <div className="space-y-2">
                     <Label>Category</Label>
                     <Select>
                       <SelectTrigger className="rounded-[8px]"><SelectValue placeholder="Select" /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="c1">Civil Work</SelectItem>
                         <SelectItem value="c2">Electrical</SelectItem>
                         <SelectItem value="c3">Equip & Rentals</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label>Vendor / Payee</Label>
                     <Input placeholder="Enter vendor name" className="rounded-[8px]" />
                   </div>
                   <div className="space-y-2">
                     <Label>Invoice Number</Label>
                     <Input placeholder="INV-..." className="rounded-[8px]" />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Amount (₹)</Label>
                     <Input type="number" placeholder="0.00" className="rounded-[8px] h-12 text-lg font-bold text-[#0F172A]" />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Description</Label>
                     <Textarea placeholder="What was purchased or paid for?" rows={2} className="rounded-[8px]" />
                   </div>
                   <div className="space-y-2 col-span-2">
                     <Label>Upload Invoice/Receipt (Optional)</Label>
                     <div className="border border-dashed border-[#E8ECF0] rounded-[8px] p-4 flex justify-center items-center bg-slate-50 text-slate-500 text-sm hover:bg-slate-100 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 mr-2" /> Upload Document
                     </div>
                   </div>
                 </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-[8px] font-semibold">Cancel</Button>
                <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] font-bold">Submit Expense</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Transaction ID</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Description & Cat</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Vendor</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Amount</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTx.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[13px] text-[#0066FF] hover:underline cursor-pointer">{tx.id}</div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">{tx.date}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{tx.desc}</div>
                    <Badge variant="outline" className="text-[9px] bg-slate-50 mt-1 uppercase font-bold text-slate-500 border-slate-200">{tx.cat}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-[13px] text-slate-700">{tx.vendor}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{tx.inv}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-black text-[15px] text-[#0F172A]">{formatCur(tx.amt)}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    {tx.status === 'Approved' ? (
                       <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 shadow-none text-[10px] font-bold uppercase rounded-[4px] border border-emerald-200">Approved</Badge>
                    ) : (
                       <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 shadow-none text-[10px] font-bold uppercase rounded-[4px] border border-amber-200">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0066FF] hover:bg-blue-50">
                       <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

    </div>
  )
}
```

### `app/construction/client.tsx`
```tsx
"use client"

import { 
  Package, ClipboardList, Truck, HardHat, AlertTriangle, Phone, Star, Camera, CheckCircle, XCircle 
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
  AreaChart, Area
} from "recharts"

// FORMAT HELPER
const formatCur = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
    <Button variant="ghost" className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 px-3 text-[13px]">View All</Button>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E8ECF0',
    }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#CBD5E1] transition-all duration-200 ${className}`}
    style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// Fallbacks since we don't fetch these explicitly from the backend in lib/data:
const photos = [
  { site: "Tower A - Floor 12 Slab Work", date: "Mar 18", color: "bg-blue-100" },
  { site: "Tower B - Column Casting", date: "Mar 18", color: "bg-orange-100" },
];

const budgetData = [
  { cat: "Civil Work", b: 8500000, s: 5230000, r: 3270000, pct: 62, status: "On Track" },
];

const progressChart = [
  { date: "Mar 12", TowerA: 55, TowerB: 30 },
];

const attendanceTrend = [
  { day: "Mon", count: 62 },
];


export default function ConstructionClient({
  inventoryItems,
  inventoryStats,
  demands,
  assets,
  assetsStats,
  attendance,
  attendanceStats,
  progress,
  vendors
}: {
  inventoryItems: any,
  inventoryStats: any,
  demands: any,
  assets: any,
  assetsStats: any,
  attendance: any,
  attendanceStats: any,
  progress: any,
  vendors: any
}) {

  const stockSummaryChart = [
    { name: "Good", value: inventoryStats?.good || 0, fill: "#10B981" },
    { name: "Low", value: inventoryStats?.low || 0, fill: "#F59E0B" },
    { name: "Critical", value: inventoryStats?.critical || 0, fill: "#EF4444" },
  ];

  // Derive labor table from 'attendance' list
  const laborCountByRole: any = {};
  (attendance || []).forEach((row: any) => {
    if (!laborCountByRole[row.role]) {
      laborCountByRole[row.role] = { present: 0, total: 0 };
    }
    laborCountByRole[row.role].total += 1;
    if (row.status === 'Present' || row.status === 'Half Day') {
      laborCountByRole[row.role].present += 1;
    }
  });

  const labourTable = Object.entries(laborCountByRole).map(([role, stats]: [string, any]) => ({
    role,
    present: stats.present,
    total: stats.total,
    pct: Math.round((stats.present / stats.total) * 100)
  }));

  const presentPercent = attendanceStats?.total ? Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0;

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* SECTION 1 - KPI CARDS */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-[#0066FF] to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <Package className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{inventoryStats?.total || 0}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Total Materials</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>
          
          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
                <ClipboardList className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{(demands || []).filter((d: any) => d.status === 'Pending').length}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Pending Approvals</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>

          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-green-500/30 shrink-0">
                <Truck className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{assetsStats?.active || 0}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Active Assets</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    {assetsStats?.maintenance || 0} maint.
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>

          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
                <HardHat className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{attendanceStats?.total || 0}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Workers Today</p>
                  </div>
                  <div className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    {presentPercent}% att.
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>
        </div>
      </section>

      {/* SECTION 2 - STOCK & MATERIAL TRACKING */}
      <section className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <SectionHeading title="Material Stock" />
          <PearlCard>
            <Table>
              <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Material Name</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Quantity</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Last Updated</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(inventoryItems || []).slice(0, 10).map((item: any, idx: number) => {
                  const status = item.current_stock_level > item.min_threshold * 2 ? 'Good' : item.current_stock_level > item.min_threshold ? 'Low' : 'Critical';
                  return (
                  <TableRow key={item.id || idx} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                    <TableCell>
                      <div className="font-bold text-sm text-[#0F172A]">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.category}</div>
                    </TableCell>
                    <TableCell className="font-medium text-[13px]">{item.current_stock_level} {item.unit_of_measurement}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full shadow-none text-[10px] font-bold uppercase tracking-wider ${
                        status === 'Good' ? 'bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/20' :
                        status === 'Low' ? 'bg-[#F59E0B]/15 text-[#D97706] hover:bg-[#F59E0B]/20' :
                        'bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/20'
                      }`}>
                        {status === 'Critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[12px] text-slate-500">{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-[6px]">Edit</Button>
                       <Button size="sm" className="h-7 text-[11px] rounded-[6px] bg-[#0066FF] hover:bg-[#0052CC] text-white">Restock</Button>
                    </TableCell>
                  </TableRow>
                )})}
                {(!inventoryItems || inventoryItems.length === 0) && (
                  <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">No materials found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </PearlCard>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="Stock Summary" />
          <PearlCard className="flex-1 flex flex-col p-6 items-center justify-center">
            <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockSummaryChart}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8 pointer-events-none">
                <span className="text-3xl font-bold text-[#0F172A]">{inventoryStats?.total || 0}</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Items</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
               <div className="bg-[#10B981]/10 rounded-xl p-3 flex flex-col items-center border border-[#10B981]/20">
                  <span className="text-xs text-[#10B981] font-bold uppercase">Good</span>
                  <span className="text-xl font-bold text-[#0F172A]">{inventoryStats?.good || 0}</span>
               </div>
               <div className="bg-[#F59E0B]/10 rounded-xl p-3 flex flex-col items-center border border-[#F59E0B]/20">
                  <span className="text-xs text-[#D97706] font-bold uppercase">Low</span>
                  <span className="text-xl font-bold text-[#0F172A]">{inventoryStats?.low || 0}</span>
               </div>
               <div className="bg-[#EF4444]/10 rounded-xl p-3 flex flex-col items-center border border-[#EF4444]/20">
                  <span className="text-xs text-[#EF4444] font-bold uppercase">Critical</span>
                  <span className="text-xl font-bold text-[#0F172A]">{inventoryStats?.critical || 0}</span>
               </div>
            </div>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 3 - DEMAND REQUEST APPROVAL FLOW */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Material Demand Requests</h2>
        </div>
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Request ID</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Requested By</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Material & Qty</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Project / Date</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(demands || []).map((req: any) => (
                <TableRow key={req.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                  <TableCell className="font-bold text-[13px] text-[#0066FF]">{req.id.substring(0,8)}</TableCell>
                  <TableCell className="font-medium text-[13px] text-[#0F172A]">{req.requested_by?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <div className="font-bold text-[13px] text-[#0F172A]">{req.item?.name || 'Unknown Item'}</div>
                    <div className="text-xs text-slate-500 font-semibold">{req.quantity_requested} {req.item?.unit_of_measurement || 'units'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[13px] text-[#0F172A]">{req.project_site}</div>
                    <div className="text-xs text-slate-500">{new Date(req.created_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell>
                    {req.status === 'Pending' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 rounded-full shadow-none text-[10px] uppercase">Pending</Badge>}
                    {req.status === 'Approved' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-full shadow-none text-[10px] uppercase border border-emerald-200"><CheckCircle className="w-3 h-3 mr-1"/>Apvd: {req.approved_by?.name || 'SYS'}</Badge>}
                    {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 rounded-full shadow-none text-[10px] uppercase border border-red-200"><XCircle className="w-3 h-3 mr-1"/>Rej: {req.approved_by?.name || 'SYS'}</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" className="h-7 text-[11px] rounded-[6px] bg-[#10B981] hover:bg-[#059669] text-white">✓ Approve</Button>
                        <Button size="sm" className="h-7 text-[11px] rounded-[6px] bg-[#EF4444] hover:bg-[#DC2626] text-white">✗ Reject</Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-[6px]">View Details</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!demands || demands.length === 0) && (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No demands found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

      {/* SECTION 4 - ASSET & EQUIPMENT TRACKER */}
      <section>
        <SectionHeading title="Active Engineering Assets" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(assets || []).slice(0, 8).map((ast: any, i: number) => {
             const statColor = ast.status === 'Active' ? 'bg-[#10B981]' : ast.status === 'Maintenance' ? 'bg-[#F59E0B]' : 'bg-slate-400'
             return (
            <InteractivePearlCard key={ast.id || i} className="relative group">
              <div className={`h-1.5 w-full ${statColor} absolute top-0 left-0 right-0`} />
              <CardContent className="p-6 pt-7">
                 <div className="flex justify-between items-start mb-4">
                   <div className={`h-12 w-12 rounded-[12px] flex items-center justify-center ${ast.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Truck className="h-6 w-6" />
                   </div>
                   <Badge variant="outline" className="text-[10px] rounded-full uppercase font-bold text-slate-500 bg-slate-50 border-slate-200">{ast.category}</Badge>
                 </div>
                 <h3 className="text-lg font-bold text-[#0F172A] leading-tight mb-1">{ast.name}</h3>
                 <p className="text-xs text-slate-400 font-mono mb-4">{ast.id.substring(0,8)}</p>
                 <div className="flex justify-between items-end border-t border-[#E8ECF0] pt-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Location</p>
                      <p className="text-[13px] font-semibold text-[#0F172A]">{ast.location || 'Unknown'}</p>
                    </div>
                    <Badge className={`shadow-none text-[9px] uppercase font-bold ${statColor} text-white`}>{ast.status || 'Unknown'}</Badge>
                 </div>
              </CardContent>
            </InteractivePearlCard>
          )})}
          {(!assets || assets.length === 0) && <div className="col-span-4 text-center py-10 text-gray-500">No assets found</div>}
        </div>
      </section>

      {/* SECTION 5 - DAILY PROGRESS REPORTS */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Daily Progress Reports" />
          <PearlCard className="flex-1">
            <div className="divide-y divide-[#E8ECF0]">
              {(progress || []).slice(0, 4).map((r: any, i: number) => {
                const dateObj = new Date(r.date);
                const dM = dateObj.toLocaleString('en-US', {month: 'short'});
                const dD = dateObj.getDate();
                return (
                <div key={r.id || i} className="p-5 hover:bg-blue-50/30 transition-colors flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="bg-slate-100 rounded-[10px] w-14 h-14 flex flex-col items-center justify-center border border-slate-200 shrink-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{dM}</span>
                      <span className="text-lg font-bold text-[#0F172A]">{dD}</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-[#0F172A] text-[15px]">{r.project_site}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="bg-blue-100 text-[#0066FF] text-[10px] px-2 py-0.5 rounded-full font-bold">{r.completion_pct}% Done</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1"><HardHat className="w-3 h-3"/> {r.workers_present} wkrs</span>
                        <span className="text-xs text-slate-500">{r.weather_conditions}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs text-slate-500 font-medium mb-1.5">{r.submitted_by_user?.name || 'Unknown'}</span>
                    <span className="text-[11px] font-bold text-[#0066FF] cursor-pointer hover:underline">View Full Report</span>
                  </div>
                </div>
              )})}
              {(!progress || progress.length === 0) && <div className="p-10 text-center text-gray-500">No progress reports</div>}
            </div>
          </PearlCard>
        </div>
        
        <div className="flex flex-col">
          <SectionHeading title="7-Day Completion Velocity" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={progressChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val)=>`${val}%`} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
                <Bar dataKey="TowerA" name="Tower A" fill="#0066FF" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="TowerB" name="Tower B" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 6 - LABOUR ATTENDANCE */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Today's Labour Attendance" />
          <PearlCard className="flex-1 p-6 flex items-center gap-8">
            <div className="relative h-40 w-40 shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: presentPercent, fill: '#6366F1' }]} startAngle={90} endAngle={-270}>
                    <RadialBar background={{ fill: '#E8ECF0' }} dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#0F172A]">{presentPercent}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Present</span>
               </div>
            </div>
            <div className="flex-1">
              <Table>
                <TableBody>
                  {labourTable.map((l: any, i: number) => (
                    <TableRow key={i} className="hover:bg-transparent border-b border-[#E8ECF0]/60">
                      <TableCell className="py-2.5 font-semibold text-[13px] text-[#0F172A]">{l.role}</TableCell>
                      <TableCell className="py-2.5 text-right font-medium text-[13px] text-slate-600">
                         {l.present} <span className="text-slate-400">/ {l.total}</span>
                      </TableCell>
                      <TableCell className="py-2.5 text-right w-[60px]">
                         <Badge variant="outline" className={`rounded-[6px] text-[10px] ${l.pct < 85 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>{l.pct}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {labourTable.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-4 text-gray-500">No attendance data</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="Weekly Labour Availability" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#0066FF" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                 <Area type="monotone" dataKey="count" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" dot={{ r: 4, fill: '#0066FF', strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 7 - VENDORS & SUPPLIERS */}
      <section>
        <SectionHeading title="Active Vendor Relationships" />
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Vendor Name</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Category</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Outstanding</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Rating</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(vendors || []).map((v: any, i: number) => (
                <TableRow key={v.id || i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{v.name}</div>
                    <div className="font-medium text-[12px] text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3"/> {v.contact_phone || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[6px] text-[11px] font-semibold">{v.category || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>
                     <div className={`font-bold text-[14px] ${v.outstanding_balance > 50000 ? 'text-red-600' : 'text-[#0F172A]'}`}>₹{(v.outstanding_balance || 0).toLocaleString('en-IN')}</div>
                  </TableCell>
                  <TableCell>
                     <div className="flex text-amber-400 gap-0.5">
                       {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < (v.rating || 4) ? 'fill-current' : 'text-slate-200 fill-slate-200'}`} />
                       ))}
                     </div>
                  </TableCell>
                  <TableCell>
                     {v.status === 'Active' ? 
                       <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-full tracking-wider font-bold">Active</Badge> : 
                       <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 shadow-none text-[10px] uppercase rounded-full tracking-wider font-bold">{v.status || 'Pending'}</Badge>
                     }
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                     <Button variant="outline" size="icon" className="h-8 w-8 rounded-full text-slate-600 hover:text-[#0066FF] hover:border-[#0066FF]"><Phone className="w-3.5 h-3.5"/></Button>
                     <Button size="sm" className="h-8 text-[11px] rounded-[6px] font-semibold bg-white border border-[#E8ECF0] text-[#0F172A] hover:bg-slate-50 shadow-sm">New Order</Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!vendors || vendors.length === 0) && <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No vendors found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

      {/* SECTION 8 - SITE PHOTOS */}
      <section>
        <SectionHeading title="Recent Site Photos" />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {photos.map((p, i) => (
             <InteractivePearlCard key={i} className="p-0 border-none">
               <div className={`h-40 w-full ${p.color} relative flex items-center justify-center`}>
                 <Camera className="w-10 h-10 text-black/10" />
                 <Badge className="absolute top-3 left-3 bg-black/60 hover:bg-black/60 text-white border-none rounded-[6px] text-[10px] uppercase">{p.date}</Badge>
               </div>
               <div className="p-4 bg-white border-t border-[#E8ECF0]">
                  <h4 className="font-semibold text-[13px] text-[#0F172A] leading-tight group-hover:text-[#0066FF] transition-colors">{p.site}</h4>
               </div>
             </InteractivePearlCard>
          ))}
        </div>
      </section>

      {/* SECTION 9 - BUDGET VS ACTUAL SPENDING */}
      <section className="grid lg:grid-cols-2 gap-8 pb-10">
        <div className="flex flex-col">
          <SectionHeading title="Budget Allocation Tracker" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-xs text-[#64748B] uppercase py-3">Category Details</TableHead>
                   <TableHead className="text-xs text-[#64748B] uppercase py-3 text-right">Budget / Spent</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {budgetData.map((b, i) => (
                   <TableRow key={i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-[14px] text-[#0F172A]">{b.cat}</span>
                          {b.status === 'On Track' ? 
                            <span className="text-[10px] font-bold text-[#10B981] uppercase bg-green-50 px-2 py-0.5 rounded-[4px] border border-green-200">On Track</span> : 
                            <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded-[4px] border border-red-200">At Risk</span>
                          }
                        </div>
                        <Progress value={b.pct} className={`h-1.5 ${b.pct > 80 ? 'bg-red-100 [&>div]:bg-red-500' : 'bg-blue-100 [&>div]:bg-[#0066FF]'}`} />
                     </TableCell>
                     <TableCell className="text-right py-4">
                        <div className="font-bold text-[14px] text-[#0F172A]">{formatCur(b.b)}</div>
                        <div className="text-[12px] font-semibold text-slate-500 mt-0.5">{formatCur(b.s)} spent <span className="text-slate-300 mx-1">|</span> {b.pct}%</div>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="Expenditure Analysis (Lakhs)" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={budgetData.map(d => ({ ...d, b: d.b/100000, s: d.s/100000 }))} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8ECF0" />
                <YAxis dataKey="cat" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={90} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(val: number) => `₹${val.toFixed(1)}L`} />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }} />
                <Bar dataKey="b" name="Budgeted" fill="#0066FF" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="s" name="Spent" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

    </div>
  )
}
```

### `app/construction/components/construction-sidebar.tsx`
```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ClipboardList, Truck, HardHat, Users, Handshake, Camera, PieChart, FileCheck, Settings } from "lucide-react"
import Logo from "@/components/shared/Logo"

const menuGroups = [
  {
    label: "MAIN MENU",
    items: [
      { name: "Dashboard", path: "/construction", icon: LayoutDashboard },
      { name: "Stock & Materials", path: "/construction/stock", icon: Package },
      { name: "Demand Requests", path: "/construction/demands", icon: ClipboardList },
      { name: "Assets & Equipment", path: "/construction/assets", icon: Truck },
    ]
  },
  {
    label: "SITE OPERATIONS",
    items: [
      { name: "Daily Progress", path: "/construction/progress", icon: HardHat },
      { name: "Labour Attendance", path: "/construction/labour", icon: Users },
      { name: "Vendor Management", path: "/construction/vendors", icon: Handshake },
      { name: "Site Photos", path: "/construction/photos", icon: Camera },
    ]
  },
  {
    label: "FINANCE",
    items: [
      { name: "Budget vs Actual", path: "/construction/budget", icon: PieChart },
      { name: "Documents", path: "/construction/documents", icon: FileCheck },
    ]
  }
]

export function ConstructionSidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <div 
      className="flex flex-col text-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '260px',
        zIndex: 100,
        overflowY: 'auto',
        background: 'linear-gradient(180deg, #0A1628 0%, #0F2044 50%, #0A1628 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.25)'
      }}
    >
      <Logo />

      <div className="flex flex-1 flex-col overflow-y-auto px-0 py-4 custom-scrollbar">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-6">
            <h4 className="px-6 mb-2" style={{ color: 'rgba(148,163,184,0.7)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {group.label}
            </h4>
            <nav className="flex flex-col gap-0.5 pr-4 pl-2">
              {group.items.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/construction' && pathname?.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center gap-3 py-2.5 pl-4 pr-3 text-sm font-medium transition-all duration-200 rounded-r-[10px]"
                    style={isActive ? {
                      background: 'rgba(99,102,241,0.25)', 
                      color: '#818CF8',
                      borderLeft: '3px solid #6366F1'
                    } : {
                      color: '#94A3B8',
                      borderLeft: '3px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.color = '#E2E8F0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#94A3B8';
                      }
                    }}
                  >
                    <item.icon className="h-5 w-5 shrink-0" style={{ color: isActive ? '#818CF8' : 'currentColor' }} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
      
      <div className="mt-auto p-5 flex items-center gap-3 bg-transparent" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] font-bold text-white shadow-sm ring-2 ring-white/10">
          {user?.firstName?.[0] || "U"}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm" style={{ color: 'white', fontWeight: 600 }}>
            {user?.firstName} {user?.lastName}
          </span>
          <div className="mt-0.5">
            <span 
              className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: 'rgba(99,102,241,0.3)',
                color: '#A5B4FC',
                border: '1px solid rgba(99,102,241,0.4)'
              }}
            >
              {user?.role || "SITE MANAGER"}
            </span>
          </div>
        </div>
        <button className="ml-auto text-slate-400 hover:text-white transition-colors">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
```

### `app/construction/demands/actions.ts`
```typescript
"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
// import { withAuth } from "@workos-inc/authkit-nextjs";

export async function createDemandRequest(formData: FormData) {
  // const { user } = await withAuth();
  const user: any = { firstName: "Demo", lastName: "Mode" };
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Unknown User";
  
  const itemId = formData.get("item_id") as string;
  const quantity = parseFloat(formData.get("quantity") as string);

  if (!itemId || !quantity || quantity <= 0) {
    return { error: "Invalid item or quantity" };
  }

  const { error } = await supabase.from("demand_requests").insert({
    item_id: itemId,
    quantity_requested: quantity,
    requested_by: userName,
    status: "Pending",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/construction/demands");
  // Also revalidate layout to update red badge
  revalidatePath("/construction", "layout");
  return { success: true };
}

export async function approveDemandRequest(requestId: string, itemId: string, requestedQuantity: number) {
  // const { user } = await withAuth();
  const user: any = { firstName: "Demo", lastName: "Mode" };
  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Admin";

  // First, fetch current stock to ensure enough quantity
  const { data: stockItem, error: stockFetchError } = await supabase
    .from("stock_items")
    .select("quantity")
    .eq("item_id", itemId)
    .single();

  if (stockFetchError || !stockItem) return { error: "Stock item not found" };

  if (stockItem.quantity < requestedQuantity) {
    return { error: "Insufficient stock quantity" };
  }

  // Update request status
  const { error: reqError } = await supabase
    .from("demand_requests")
    .update({ status: "Approved", reviewed_by: adminName })
    .eq("id", requestId);

  if (reqError) return { error: reqError.message };

  // Deduct stock
  const newQuantity = Number(stockItem.quantity) - requestedQuantity;
  const { error: updError } = await supabase
    .from("stock_items")
    .update({ quantity: newQuantity, last_updated: new Date().toISOString() })
    .eq("item_id", itemId);

  if (updError) return { error: updError.message };

  revalidatePath("/construction/demands");
  revalidatePath("/construction", "layout");
  return { success: true, deducted: requestedQuantity };
}

export async function rejectDemandRequest(requestId: string) {
  // const { user } = await withAuth();
  const user: any = { firstName: "Demo", lastName: "Mode" };
  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Admin";

  const { error } = await supabase
    .from("demand_requests")
    .update({ status: "Rejected", reviewed_by: adminName })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/construction/demands");
  revalidatePath("/construction", "layout");
  return { success: true };
}
```

### `app/construction/demands/admin-view.tsx`
```tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { approveDemandRequest, rejectDemandRequest } from "./actions";

export default function AdminView({ requests }: { requests: any[] }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  async function handleApprove(requestId: string, itemId: string, quantity: number) {
    setIsLoading(requestId);
    const result = await approveDemandRequest(requestId, itemId, quantity);
    setIsLoading(null);

    if (result?.error) {
      toast({ title: "Approval Failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Approved", description: `Stock updated. ${result.deducted} units deducted.` });
    }
  }

  async function handleReject(requestId: string) {
    setIsLoading(requestId);
    const result = await rejectDemandRequest(requestId);
    setIsLoading(null);

    if (result?.error) {
      toast({ title: "Rejection Failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Rejected", description: "Demand request rejected." });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pending Requests</h1>
        <p className="text-slate-500 mt-1">Review and approve material demands from site managers.</p>
      </div>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-950">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No pending requests.
                </TableCell>
              </TableRow>
            ) : requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="text-slate-500">{format(new Date(req.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">{req.requested_by}</TableCell>
                <TableCell>{req.stock_items?.name || "Unknown Item"}</TableCell>
                <TableCell className="text-right font-medium">{req.quantity_requested} {req.stock_items?.unit}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900">
                    Pending
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(req.id, req.item_id, req.quantity_requested)}
                      disabled={isLoading === req.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleReject(req.id)}
                      disabled={isLoading === req.id}
                      className="h-8"
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

### `app/construction/demands/client.tsx`
```tsx
"use client"

import { useState } from "react"
import { 
  ClipboardList, Search, Filter, Plus, FileDown,
  CheckCircle, XCircle, AlertCircle, Clock, Info, Package
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock array replaced by props
const PriorityBadge = ({ p }: { p: string }) => {
  if (p === 'Urgent') return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 text-[10px] uppercase font-bold shadow-none">Urgent</Badge>;
  if (p === 'Normal') return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] uppercase font-bold shadow-none">Normal</Badge>;
  return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] uppercase font-bold shadow-none">Low</Badge>;
};

const StatusBadge = ({ s, r }: { s: string, r: string | null }) => {
  if (s === 'Pending') return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] uppercase font-bold shadow-none"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
  if (s === 'Approved') return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] uppercase font-bold shadow-none"><CheckCircle className="w-3 h-3 mr-1"/> Apprv: {r}</Badge>;
  return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px] uppercase font-bold shadow-none"><XCircle className="w-3 h-3 mr-1"/> Rej: {r}</Badge>;
};

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function DemandsClient({ initialDemands }: { initialDemands: any[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [isRaiseFormOpen, setIsRaiseFormOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);

  const demandRequests = initialDemands.map(r => ({
    id: r.id?.substring(0,8) || 'Unknown',
    by: r.requested_by_user?.name || 'Unknown User',
    role: r.requested_by_user?.role || 'Staff',
    material: r.material?.item_name || 'Material',
    qty: `${r.quantity} ${r.material?.unit || ''}`,
    site: r.project?.name || 'Site',
    priority: r.priority || 'Normal',
    date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    requiredBy: r.required_date ? new Date(r.required_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
    status: r.status || 'Pending',
    reviewer: r.approved_by_user?.name || null,
    stock: r.material?.quantity || 0,
    unit: r.material?.unit || ''
  }));

  const filteredRequests = demandRequests.filter(r => activeTab === 'all' || r.status.toLowerCase() === activeTab);

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Demand Requests</h1>
        <p className="text-sm text-slate-500">Manage site material requests, approvals, and allocation tracking.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Requests</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{demandRequests.length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Pending Approval</p>
            <div className="flex items-center gap-3">
              <h3 className="text-[32px] font-bold text-[#F59E0B] leading-tight">{demandRequests.filter(r => r.status === 'Pending').length}</h3>
              {demandRequests.filter(r => r.status === 'Pending' && r.priority === 'Urgent').length > 0 && (
                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 shadow-none border-none text-[10px] font-bold">
                  {demandRequests.filter(r => r.status === 'Pending' && r.priority === 'Urgent').length} Urgent
                </Badge>
              )}
            </div>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Approved Processing</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">{demandRequests.filter(r => r.status === 'Approved').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Rejected</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight">{demandRequests.filter(r => r.status === 'Rejected').length}</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* RAISE NEW REQUEST CONFIG */}
      <section className={`transition-all duration-300 ${isRaiseFormOpen ? 'block' : 'hidden'}`}>
        <PearlCard className="p-6 border-[#0066FF] shadow-sm shadow-blue-100">
           <div className="flex justify-between items-center mb-6 border-b border-[#E8ECF0] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0066FF] flex items-center gap-2"><Plus className="w-5 h-5"/> Raise New Material Demand</h3>
                <p className="text-sm text-slate-500 mt-1">Submit a requirement for site operations. Approvals typically take 2-4 hours.</p>
              </div>
              <Button variant="ghost" onClick={() => setIsRaiseFormOpen(false)} className="text-slate-500 hover:bg-slate-100 rounded-[8px]">Cancel</Button>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4 col-span-2">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label className="font-semibold text-slate-700">Material Required</Label>
                     <Select>
                       <SelectTrigger className="bg-slate-50 h-10 rounded-[8px]"><SelectValue placeholder="Search material..." /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="c1">Cement OPC 53</SelectItem>
                         <SelectItem value="s1">Steel TMT 12mm</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label className="font-semibold text-slate-700">Quantity</Label>
                     <Input type="text" placeholder="e.g. 50 bags" className="bg-slate-50 h-10 rounded-[8px]" />
                   </div>
                   <div className="space-y-2">
                     <Label className="font-semibold text-slate-700">Project / Tower</Label>
                     <Select>
                       <SelectTrigger className="bg-slate-50 h-10 rounded-[8px]"><SelectValue placeholder="Select site" /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="t1">Tower A</SelectItem>
                         <SelectItem value="t2">Tower B</SelectItem>
                         <SelectItem value="t3">Tower C</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label className="font-semibold text-slate-700">Priority Level</Label>
                     <Select defaultValue="normal">
                       <SelectTrigger className="bg-slate-50 h-10 rounded-[8px]"><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="urgent">Urgent</SelectItem>
                         <SelectItem value="normal">Normal</SelectItem>
                         <SelectItem value="low">Low</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label className="font-semibold text-slate-700">Required By Date</Label>
                     <Input type="date" className="bg-slate-50 h-10 rounded-[8px]" />
                   </div>
                 </div>
                 <div className="space-y-2">
                    <Label className="font-semibold text-slate-700">Justification / Usage Details</Label>
                    <Textarea placeholder="Explain why this material is needed..." rows={3} className="bg-slate-50 rounded-[8px]" />
                 </div>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 rounded-[12px] p-5 flex flex-col h-full bg-gradient-to-b from-blue-50/50 to-white">
                 <h4 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500"/> Current Stock Lookup</h4>
                 <div className="flex-1 text-center flex flex-col items-center justify-center space-y-3 opacity-60">
                    <Package className="w-10 h-10 text-slate-400" />
                    <p className="text-sm font-medium text-slate-500">Select a material to view current stock levels and alerts.</p>
                 </div>
                 <Button className="w-full mt-auto bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm">Submit Request</Button>
              </div>
           </div>
        </PearlCard>
      </section>

      {/* FILTER BAR & TABS */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#E8ECF0] pb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-[10px]">
             <TabsTrigger value="all" className="rounded-[8px] text-[12px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0066FF]">All</TabsTrigger>
             <TabsTrigger value="pending" className="rounded-[8px] text-[12px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600">Pending</TabsTrigger>
             <TabsTrigger value="approved" className="rounded-[8px] text-[12px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600">Approved</TabsTrigger>
             <TabsTrigger value="rejected" className="rounded-[8px] text-[12px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {!isRaiseFormOpen && (
          <Button onClick={() => setIsRaiseFormOpen(true)} className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2">
            <Plus className="w-4 h-4" /> Raise Request
          </Button>
        )}
      </section>

      {/* REQUESTS TABLE */}
      <section>
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Request Details</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Requested By</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Material & Qty</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Project Site</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0066FF] cursor-pointer hover:underline mb-1">{req.id}</div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge p={req.priority} />
                      <span className="text-[11px] text-slate-500 font-medium">{req.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[13px] text-[#0F172A]">{req.by}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{req.role}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{req.material}</div>
                    <div className="text-[13px] font-semibold text-slate-600 mt-0.5">{req.qty}</div>
                  </TableCell>
                  <TableCell>
                     <div className="font-medium text-[13px] text-[#0F172A]">{req.site}</div>
                     <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3"/> Req by: {req.requiredBy}</div>
                  </TableCell>
                  <TableCell>
                     <StatusBadge s={req.status} r={req.reviewer} />
                  </TableCell>
                  <TableCell className="text-right">
                     {/* APPROVAL DIALOG */}
                     <Dialog>
                       <DialogTrigger asChild>
                         {req.status === 'Pending' ? (
                           <Button size="sm" className="h-8 text-[11px] rounded-[8px] bg-white border border-[#0066FF] text-[#0066FF] hover:bg-blue-50 font-bold shadow-sm" onClick={() => setSelectedReq(req)}>Review</Button>
                         ) : (
                           <Button variant="ghost" size="sm" className="h-8 text-[11px] rounded-[8px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100" onClick={() => setSelectedReq(req)}>View</Button>
                         )}
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                         {selectedReq && (
                           <>
                             <div className="bg-slate-50 p-6 border-b border-[#E8ECF0]">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h2 className="text-xl font-bold text-[#0F172A] mb-1">Request {selectedReq.id}</h2>
                                    <p className="text-sm text-slate-500">Submitted on {selectedReq.date} by <span className="font-bold text-[#0F172A]">{selectedReq.by}</span></p>
                                  </div>
                                  <StatusBadge s={selectedReq.status} r={selectedReq.reviewer} />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                  <div className="bg-white p-3 rounded-[10px] border border-[#E8ECF0] shadow-sm">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Material Requested</p>
                                    <p className="font-bold text-[15px]">{selectedReq.material}</p>
                                    <p className="text-[13px] font-semibold text-[#0066FF] mt-1">{selectedReq.qty}</p>
                                  </div>
                                  <div className="bg-white p-3 rounded-[10px] border border-[#E8ECF0] shadow-sm">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Delivery Site</p>
                                    <p className="font-bold text-[14px]">{selectedReq.site}</p>
                                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1"><PriorityBadge p={selectedReq.priority}/> By {selectedReq.requiredBy}</p>
                                  </div>
                                </div>
                             </div>

                             <div className="p-6">
                                <div className="mb-6 flex items-start gap-3 p-3 bg-blue-50/50 rounded-[10px] border border-blue-100">
                                   <Package className="w-5 h-5 text-[#0066FF] mt-0.5" />
                                   <div>
                                     <h4 className="font-bold text-[13px] text-[#0F172A]">Current Inventory Check</h4>
                                     {selectedReq.stock > parseInt(selectedReq.qty) ? (
                                        <p className="text-sm text-slate-600 mt-1">There is sufficient stock (<span className="font-bold">{selectedReq.stock} {selectedReq.unit}</span>) to fulfill this request.</p>
                                     ) : (
                                        <p className="text-sm text-red-600 font-medium mt-1">Warning: Current stock (<span className="font-bold">{selectedReq.stock} {selectedReq.unit}</span>) is insufficient to fulfill this request.</p>
                                     )}
                                   </div>
                                </div>

                                {selectedReq.status === 'Pending' && (
                                   <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label className="font-semibold">Reviewer Notes</Label>
                                        <Textarea placeholder="Add comments before approving/rejecting..." className="rounded-[8px] bg-slate-50" />
                                      </div>
                                      <div className="flex gap-3 pt-2">
                                        <Button className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-[8px] h-11 font-bold text-[14px] shadow-sm flex items-center gap-2">
                                          <CheckCircle className="w-4 h-4" /> Approve & Allocate
                                        </Button>
                                        <Button className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-[8px] h-11 font-bold text-[14px] shadow-sm flex items-center gap-2">
                                          <XCircle className="w-4 h-4" /> Reject Request
                                        </Button>
                                      </div>
                                   </div>
                                )}
                             </div>
                           </>
                         )}
                       </DialogContent>
                     </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

    </div>
  )
}
```

### `app/construction/demands/manager-view.tsx`
```tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createDemandRequest } from "./actions";

export default function ManagerView({ stockItems, requests }: { stockItems: any[], requests: any[] }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const result = await createDemandRequest(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Failed to Submit", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Request Submitted", description: "Your demand request has been sent for approval." });
    }
  }

  function handleItemChange(val: string) {
    const item = stockItems.find(i => i.item_id === val);
    if (item) setSelectedUnit(item.unit);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Material Requisition</h1>
        <p className="text-slate-500 mt-1">Request materials for ongoing site work.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-lg">New Request</CardTitle>
          <CardDescription>Select material and specify the required quantity.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid gap-2 w-full sm:w-1/2">
              <Label htmlFor="item_id">Select Item</Label>
              <Select name="item_id" required onValueChange={handleItemChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Browse available stock..." />
                </SelectTrigger>
                <SelectContent>
                  {stockItems.map(item => (
                    <SelectItem key={item.item_id} value={item.item_id}>
                      {item.name} (Cur: {item.quantity} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 w-full sm:w-1/4">
              <Label htmlFor="quantity">Quantity Required</Label>
              <div className="relative">
                <Input id="quantity" name="quantity" type="number" step="0.01" min="0.01" required className="pr-16" />
                {selectedUnit && <span className="absolute right-3 top-2 text-sm text-slate-400 select-none">{selectedUnit}</span>}
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white">
              {isLoading ? "Submitting..." : <><Send className="h-4 w-4 mr-2" /> Submit</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">My Recent Requests</h2>
        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Quantity Requested</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Reviewed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="text-slate-500">{format(new Date(req.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">{req.stock_items?.name || "Unknown"}</TableCell>
                  <TableCell className="text-right font-medium">{req.quantity_requested} {req.stock_items?.unit}</TableCell>
                  <TableCell className="text-center">
                    {req.status === "Pending" && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900">Pending</Badge>
                    )}
                    {req.status === "Approved" && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900">Approved</Badge>
                    )}
                    {req.status === "Rejected" && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900">Rejected</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500">{req.reviewed_by || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
```

### `app/construction/demands/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import { getMaterialDemands } from '@/lib/data';
import DemandsClient from './client';

export default async function DemandsPage() {
  const demands = await getMaterialDemands();

  return <DemandsClient initialDemands={demands || []} />
}
```

### `app/construction/labour/client.tsx`
```tsx
"use client"

import { useState } from "react"
import { 
  Users, UserCheck, UserX, UserMinus, Search, Filter, 
  MapPin, Clock, CalendarCheck, MoreVertical, Plus
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// MOCK DATA
const labourTable = [
  { role: "Mason", present: 18, total: 20, pct: 90 },
  { role: "Helper", present: 25, total: 28, pct: 89 },
  { role: "Electrician", present: 8, total: 10, pct: 80 },
  { role: "Plumber", present: 6, total: 7, pct: 86 },
  { role: "Carpenter", present: 10, total: 10, pct: 100 },
];

const attendanceTrend = [
  { day: "01", count: 62 }, { day: "02", count: 65 }, { day: "03", count: 68 }, { day: "04", count: 64 }, { day: "05", count: 67 }, { day: "06", count: 50 }, { day: "07", count: 12 },
  { day: "08", count: 60 }, { day: "09", count: 66 }, { day: "10", count: 69 }, { day: "11", count: 65 }, { day: "12", count: 68 }, { day: "13", count: 52 }, { day: "14", count: 10 },
  { day: "15", count: 63 }, { day: "16", count: 67 }, { day: "17", count: 70 }, { day: "18", count: 66 }, { day: "19", count: 68 }, { day: "20", count: 55 }, { day: "21", count: 15 },
  { day: "22", count: 65 }, { day: "23", count: 68 }, { day: "24", count: 72 }, { day: "25", count: 68 }, { day: "26", count: 70 }, { day: "27", count: 58 }, { day: "28", count: 14 },
  { day: "29", count: 66 }, { day: "30", count: 67 }
];

// Mock array replaced by props

const StatusBadge = ({ s }: { s: string }) => {
  if (s === 'Present') return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold w-full justify-center">Present</Badge>;
  if (s === 'Absent') return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold w-full justify-center">Absent</Badge>;
  if (s === 'Half Day') return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold w-full justify-center">Half Day</Badge>;
  return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold w-full justify-center">On Leave</Badge>;
};

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function LabourClient({ initialLabour, stats }: { initialLabour: any[], stats: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<any>(null);

  const workers = initialLabour.map(w => ({
    id: w.id?.substring(0,8) || 'Unknown',
    name: w.worker_name || 'Unnamed Worker',
    role: w.role || 'General',
    phone: w.contact_number || '--',
    status: w.status || 'Absent',
    pct: 100, // DB doesn't have historical data for pct and days, mocking
    days: "23/23" 
  }));

  const filteredWorkers = workers.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Labour & Attendance</h1>
        <p className="text-sm text-slate-500">Track site workforce, daily attendance, and role-wise availability.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Workers</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight flex items-center gap-2"><Users className="w-6 h-6 text-blue-500"/> {stats?.total || 0}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Present Today</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight flex items-center gap-2"><UserCheck className="w-6 h-6 text-[#10B981]"/> {stats?.present || 0}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Absent</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight flex items-center gap-2"><UserX className="w-6 h-6 text-[#EF4444]"/> {stats?.absent || 0}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Attendance Rate</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{stats?.total > 0 ? ((stats?.present / stats?.total) * 100).toFixed(1) : 0}%</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* TWO COLUMN */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Today's Attendance by Role" />
          <PearlCard className="flex-1 p-4">
            <Table>
               <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-[#E8ECF0]">
                     <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase">Role</TableHead>
                     <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase text-right">Present/Total</TableHead>
                     <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase text-right">%</TableHead>
                     <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase text-right">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                 {labourTable.map((l, i) => (
                   <TableRow key={i} className="hover:bg-slate-50/50 border-b border-[#E8ECF0]/60 transition-colors">
                     <TableCell className="py-3.5 font-bold text-[13px] text-[#0F172A]">{l.role}</TableCell>
                     <TableCell className="py-3.5 text-right font-semibold text-[13px] text-slate-700">
                        {l.present} <span className="text-slate-400 font-normal">/ {l.total}</span>
                     </TableCell>
                     <TableCell className="py-3.5 text-right w-[60px]">
                        <Badge variant="outline" className={`rounded-[6px] shadow-none text-[10px] ${l.pct < 85 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>{l.pct}%</Badge>
                     </TableCell>
                     <TableCell className="py-3.5 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold rounded-[6px] text-[#0066FF] border-[#E8ECF0] shadow-sm hover:bg-blue-50">Mark Entry</Button>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
            </Table>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="30-Day Attendance Trend" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                 <Tooltip cursor={{stroke: '#10B981', strokeWidth: 1, strokeDasharray: '3 3'}} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                 <Area type="monotone" dataKey="count" name="Workers Present" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

      {/* FILTER BAR & FULL TABLE */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
          <div className="flex flex-1 gap-4 items-center w-full">
            <div className="relative w-full max-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search worker..." 
                className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="mason">Mason</SelectItem>
                <SelectItem value="helper">Helper</SelectItem>
                <SelectItem value="elec">Electrician</SelectItem>
                <SelectItem value="plumb">Plumber</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="half">Half Day</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-[150px]">
               <Input type="date" defaultValue="2026-03-18" className="bg-slate-50 border-slate-200 h-10 rounded-[10px] text-sm" />
            </div>
          </div>
          <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2">
            <Plus className="w-4 h-4" /> Add Worker
          </Button>
        </div>

        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Worker</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Role</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Contact</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center w-[120px]">Status (Today)</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Month Att %</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Present / Total</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((w) => (
                <TableRow key={w.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{w.name}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{w.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[4px] text-[10px] font-bold tracking-wide uppercase border-slate-200">{w.role}</Badge>
                  </TableCell>
                  <TableCell>
                     <div className="font-medium text-[13px] text-slate-600">{w.phone}</div>
                  </TableCell>
                  <TableCell className="text-center">
                     <StatusBadge s={w.status} />
                  </TableCell>
                  <TableCell className="text-center">
                     <span className={`font-bold text-[14px] ${w.pct >= 90 ? 'text-emerald-600' : w.pct >= 80 ? 'text-amber-600' : 'text-red-500'}`}>{w.pct}%</span>
                  </TableCell>
                  <TableCell className="text-right">
                     <span className="font-semibold text-[13px] text-[#0F172A]">{w.days} <span className="text-slate-400 font-normal">days</span></span>
                  </TableCell>
                  <TableCell className="text-center">
                     <Dialog>
                       <DialogTrigger asChild>
                         <Button variant="outline" size="sm" className="h-8 text-[11px] rounded-[6px] font-bold text-[#0066FF] border-[#E8ECF0] hover:bg-blue-50 shadow-sm w-[90px]" onClick={() => setSelectedWorker(w)}>Update</Button>
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[400px]">
                         <DialogHeader>
                           <DialogTitle>Mark Attendance</DialogTitle>
                         </DialogHeader>
                         {selectedWorker && (
                           <div className="grid gap-4 py-4">
                             <div className="p-3 bg-slate-50 rounded-[10px] border border-[#E8ECF0] flex justify-between items-center shadow-sm">
                                <div>
                                  <div className="font-bold text-[15px] text-[#0F172A]">{selectedWorker.name}</div>
                                  <div className="text-[12px] text-slate-500 font-medium">{selectedWorker.role} | {selectedWorker.id}</div>
                                </div>
                             </div>
                             
                             <div className="space-y-2">
                               <Label className="text-slate-600 font-semibold">Date</Label>
                               <Input type="date" defaultValue="2026-03-18" className="h-10 rounded-[8px]" />
                             </div>

                             <div className="space-y-2">
                               <Label className="text-slate-600 font-semibold">Status</Label>
                               <Select defaultValue={selectedWorker.status.toLowerCase().replace(' ', '')}>
                                 <SelectTrigger className="h-10 rounded-[8px]">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="present">Present (Full Day)</SelectItem>
                                   <SelectItem value="halfday">Half Day</SelectItem>
                                   <SelectItem value="absent">Absent</SelectItem>
                                   <SelectItem value="onleave">On Leave</SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>

                             <div className="grid grid-cols-2 gap-4 border-t border-[#E8ECF0] pt-4 mt-2">
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold text-[12px]">Check-in Time</Label>
                                 <Input type="time" defaultValue="08:00" className="h-10 rounded-[8px]" />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold text-[12px]">Check-out Time</Label>
                                 <Input type="time" defaultValue="18:00" className="h-10 rounded-[8px]" />
                               </div>
                             </div>

                             <div className="space-y-2">
                               <Label className="text-slate-600 font-semibold">Notes</Label>
                               <Textarea placeholder="Any remarks..." rows={2} className="rounded-[8px]" />
                             </div>
                           </div>
                         )}
                         <DialogFooter>
                           <Button variant="outline" className="rounded-[8px] h-10">Cancel</Button>
                           <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm">Save Attendance</Button>
                         </DialogFooter>
                       </DialogContent>
                     </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

    </div>
  )
}
```

### `app/construction/labour/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import { getLabourAttendance, getAttendanceStats } from '@/lib/data';
import LabourClient from './client';

export default async function LabourPage() {
  const [labour, stats] = await Promise.all([
    getLabourAttendance(), 
    getAttendanceStats()
  ]);

  return <LabourClient initialLabour={labour || []} stats={stats} />
}
```

### `app/construction/layout.tsx`
```tsx
import { ReactNode } from "react"
import { ConstructionSidebar } from "./components/construction-sidebar"
import { Bell, Plus, Search, HelpCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConstructionLayout({ children }: { children: ReactNode }) {
  const user = { firstName: "Demo", lastName: "Mode", role: "SITE MANAGER" }

  return (
    <div 
      className="flex font-sans text-[#0F172A] min-h-screen" 
      style={{ background: '#FAFBFC' }}
    >
      <ConstructionSidebar user={user} />
      
      <div className="flex-1 flex flex-col pl-[260px] relative">
        <header 
          className="flex shrink-0 items-center justify-between px-6"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 90,
            background: 'rgba(255,255,255,0.95)',
            borderBottom: '1px solid #E8ECF0',
            boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
            height: '64px'
          }}
        >
          {/* Breadcrumb Left */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 hidden md:flex">
            <span>Home</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span>Construction</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-bold">Dashboard</span>
          </div>

          {/* Global Search Center */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-[#0066FF] transition-colors" />
              <input 
                type="text" 
                placeholder="Search materials, assets, vendors..." 
                className="w-full h-9 bg-gray-100/80 border-transparent rounded-full pl-9 pr-4 text-sm focus:border-[#0066FF] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 gap-2 hidden sm:flex h-9">
              <Plus className="h-4 w-4" />
              <span className="tracking-wide">Raise Request</span>
            </Button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
            
            <button className="relative text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 flex h-[14px] min-w-[14px] px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                5
              </span>
            </button>
            <button className="text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 hidden sm:flex">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] text-white font-bold shadow-sm ml-1 ring-2 ring-white cursor-pointer hover:ring-blue-100 transition-all">
              {user.firstName[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### `app/construction/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import {
  getInventoryItems,
  getInventoryStats,
  getMaterialDemands,
  getAssets,
  getAssetsStats,
  getLabourAttendance,
  getAttendanceStats,
  getDailyProgress,
  getVendors
} from '@/lib/data';

import ConstructionClient from './client';

export default async function ConstructionPage() {
  const [
    inventoryItems,
    inventoryStats,
    demands,
    assets,
    assetsStats,
    attendance,
    attendanceStats,
    progress,
    vendors
  ] = await Promise.all([
    getInventoryItems(),
    getInventoryStats(),
    getMaterialDemands(),
    getAssets(),
    getAssetsStats(),
    getLabourAttendance(),
    getAttendanceStats(),
    getDailyProgress(),
    getVendors()
  ]);

  return <ConstructionClient 
    inventoryItems={inventoryItems} 
    inventoryStats={inventoryStats} 
    demands={demands} 
    assets={assets} 
    assetsStats={assetsStats} 
    attendance={attendance} 
    attendanceStats={attendanceStats} 
    progress={progress} 
    vendors={vendors} 
  />
}
```

### `app/construction/progress/client.tsx`
```tsx
"use client"

import { useState } from "react"
import { 
  FileText, Search, Plus, Calendar, Clock, MapPin, 
  CloudSun, CloudRain, Sun, HardHat, AlertTriangle, CheckCircle, Image as ImageIcon
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

// Mock array replaced by props

const WeatherIcon = ({ w }: { w: string }) => {
  if (w === 'Sunny') return <Sun className="w-4 h-4 text-amber-500" />;
  if (w === 'Cloudy') return <CloudSun className="w-4 h-4 text-slate-500" />;
  return <CloudRain className="w-4 h-4 text-blue-500" />;
};

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function ProgressClient({ initialReports }: { initialReports: any[] }) {
  const [reportProgress, setReportProgress] = useState([50]);

  const allReports = initialReports.map((r, i) => {
    const d = new Date(r.date);
    return {
      id: r.id?.substring(0,8) || `REP-0${i+1}`,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      site: r.project_id || 'Site', // If there's a project join, use that name
      floor: r.area || 'General Area',
      p: r.completion_percentage || 0,
      by: r.submitted_by_user?.name || 'Staff',
      time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      weather: r.weather_conditions || 'Sunny',
      workers: r.workers_present || 0,
      work: Array.isArray(r.work_completed) ? r.work_completed : typeof r.work_completed === 'string' ? r.work_completed.split('\\n') : [],
      materials: Array.isArray(r.materials_used) ? r.materials_used : [],
      issues: r.issues_blockers || 'None.',
      photos: Array.isArray(r.photos) ? r.photos : []
    };
  });

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Daily Progress Reports</h1>
        <p className="text-sm text-slate-500">Track daily site activities, material usage, and project completion status.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Reports Today</p>
            <div className="flex items-center gap-3">
               <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight">{allReports.length}</h3>
               <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 shadow-none border-none text-[10px] font-bold">Updated</Badge>
            </div>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#0F172A]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Reports This Week</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{allReports.length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Avg Completion</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">{allReports.length > 0 ? (allReports.reduce((acc, r) => acc + r.p, 0) / allReports.length).toFixed(0) : 0}%</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">On Schedule</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">3 / 4</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[200px]">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input type="date" className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Project / Tower" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Towers</SelectItem>
              <SelectItem value="t1">Tower A</SelectItem>
              <SelectItem value="t2">Tower B</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Submitted By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any User</SelectItem>
              <SelectItem value="u1">Ravi Kumar</SelectItem>
              <SelectItem value="u2">Sunil Sharma</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm flex gap-2 font-bold">
                <Plus className="w-4 h-4" /> Submit Daily Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Daily Progress Report</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Project / Tower</Label>
                    <Select>
                      <SelectTrigger className="rounded-[8px]"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ta">Tower A</SelectItem>
                        <SelectItem value="tb">Tower B</SelectItem>
                        <SelectItem value="tc">Tower C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Floor / Area</Label>
                    <Input placeholder="e.g. Floor 12" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" className="rounded-[8px]" defaultValue="2026-03-18" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 items-center bg-slate-50 p-4 rounded-[12px] border border-[#E8ECF0]">
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <Label>Area Completion Status</Label>
                        <span className="font-bold text-[#0066FF]">{reportProgress}%</span>
                     </div>
                     <Slider value={reportProgress} onValueChange={setReportProgress} max={100} step={1} className="[&>span:first-child]:bg-blue-100 [&_[role=slider]]:bg-[#0066FF] [&_[role=slider]]:border-[#0066FF]" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Weather</Label>
                        <Select defaultValue="sunny">
                          <SelectTrigger className="rounded-[8px] bg-white"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sunny"><div className="flex items-center gap-2"><Sun className="w-4 h-4 text-amber-500"/> Sunny</div></SelectItem>
                            <SelectItem value="cloudy"><div className="flex items-center gap-2"><CloudSun className="w-4 h-4 text-slate-500"/> Cloudy</div></SelectItem>
                            <SelectItem value="rainy"><div className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-500"/> Rainy</div></SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Workers Present</Label>
                        <Input type="number" placeholder="0" className="rounded-[8px] bg-white" />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                  <Label>Work Completed Today (Bullet points)</Label>
                  <Textarea placeholder="- Completed reinforcement binding..." rows={4} className="rounded-[8px]" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Materials Used</Label>
                    <Button variant="ghost" size="sm" className="h-6 text-[#0066FF] px-2 text-[11px]"><Plus className="w-3 h-3 mr-1"/> Add Row</Button>
                  </div>
                  <div className="border border-[#E8ECF0] rounded-[8px] overflow-hidden">
                     <div className="grid grid-cols-3 bg-slate-50 border-b border-[#E8ECF0] p-2 text-[11px] font-bold text-slate-500 uppercase">
                        <div className="col-span-2">Material</div>
                        <div>Quantity</div>
                     </div>
                     <div className="grid grid-cols-3 p-2 gap-2">
                        <div className="col-span-2"><Input placeholder="Material name" className="h-8 text-[12px]" /></div>
                        <div><Input placeholder="Qty" className="h-8 text-[12px]" /></div>
                     </div>
                     <div className="grid grid-cols-3 p-2 gap-2 pt-0">
                        <div className="col-span-2"><Input placeholder="Material name" className="h-8 text-[12px]" /></div>
                        <div><Input placeholder="Qty" className="h-8 text-[12px]" /></div>
                     </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Issues / Blockers (Optional)</Label>
                  <Textarea placeholder="Any delays, accidents, or material shortages..." rows={2} className="rounded-[8px]" />
                </div>

                <div className="space-y-2">
                  <Label>Site Photos</Label>
                  <div className="border-2 border-dashed border-[#E8ECF0] rounded-[12px] p-6 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                     <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                     <p className="text-sm font-semibold text-[#0066FF]">Click to upload photos</p>
                     <p className="text-xs mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-[8px]">Cancel</Button>
                <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] font-bold">Submit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* REPORTS LIST */}
      <section className="space-y-6">
         {allReports.map((r) => (
            <PearlCard key={r.id}>
               <div className="flex flex-col md:flex-row border-b border-[#E8ECF0] bg-[#FAFBFC]">
                  {/* Summary Header */}
                  <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-[#E8ECF0] flex flex-col justify-center">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white border border-[#E8ECF0] rounded-[8px] w-12 h-12 flex flex-col items-center justify-center shadow-sm">
                           <span className="text-[10px] font-bold text-slate-500 uppercase">{r.day}</span>
                           <span className="text-[16px] font-bold text-[#0F172A]">{r.date.split(" ")[1].replace(',', '')}</span>
                        </div>
                        <div>
                           <h3 className="font-bold text-[18px] text-[#0F172A] leading-tight flex items-center gap-2">
                             {r.site} <span className="text-slate-300 font-light">|</span> <span className="text-[#0066FF] text-[16px]">{r.floor}</span>
                           </h3>
                           <p className="text-[12px] text-slate-500 font-medium mt-0.5">{r.date}</p>
                        </div>
                     </div>
                     <div className="space-y-1.5 mt-2">
                        <div className="flex justify-between items-end">
                           <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Completion</span>
                           <span className="text-[16px] font-bold text-[#0F172A]">{r.p}%</span>
                        </div>
                        <Progress value={r.p} className={`h-2 ${r.p > 80 ? 'bg-emerald-100 [&>div]:bg-emerald-500' : 'bg-blue-100 [&>div]:bg-[#0066FF]'}`} />
                     </div>
                  </div>

                  {/* Meta Details */}
                  <div className="p-6 md:w-2/3 flex flex-col justify-between bg-white">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                             <WeatherIcon w={r.weather} />
                             <span className="text-[12px] font-bold text-slate-600">{r.weather}</span>
                           </div>
                           <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                             <HardHat className="w-4 h-4 text-slate-500" />
                             <span className="text-[12px] font-bold text-slate-600">{r.workers} Workers</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[12px] text-slate-500 font-medium">Submitted by</p>
                           <p className="text-[14px] font-bold text-[#0F172A]">{r.by}</p>
                           <p className="text-[11px] text-slate-400 mt-0.5">at {r.time}</p>
                        </div>
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-8 flex-1">
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-[#E8ECF0] pb-1">Work Completed</h4>
                           <ul className="space-y-1.5 list-disc pl-4 text-[13px] text-slate-600 font-medium">
                              {r.work.map((wLine: string, idx: number) => <li key={idx} className="pl-1 leading-snug">{wLine}</li>)}
                           </ul>
                        </div>
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-[#E8ECF0] pb-1">Materials Used</h4>
                           <div className="space-y-1.5 text-[13px]">
                             {r.materials.map((m: any, idx: number) => (
                               <div key={idx} className="flex justify-between items-center border-b border-dashed border-[#E8ECF0] pb-1">
                                  <span className="text-slate-600 font-medium">{m.m}</span>
                                  <span className="font-bold text-[#0F172A]">{m.q}</span>
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Footer / Issues / Photos */}
               <div className="p-4 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex-1 flex items-center gap-6">
                     {r.issues && r.issues !== 'None.' && (
                        <div className="flex items-start gap-2 max-w-[400px]">
                           <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                           <p className="text-[12px] text-amber-700 font-medium leading-tight">{r.issues}</p>
                        </div>
                     )}
                     <div className="flex gap-2 ml-auto">
                        {r.photos.map((c: string, idx: number) => (
                           <div key={idx} className={`w-8 h-8 rounded-[6px] ${c} flex items-center justify-center border border-slate-200/50 shadow-sm overflow-hidden relative group cursor-pointer`}>
                             <ImageIcon className="w-3.5 h-3.5 text-black/20" />
                           </div>
                        ))}
                     </div>
                  </div>
                  <Button variant="outline" className="h-9 text-[12px] font-bold rounded-[8px] bg-slate-50 hover:bg-slate-100 text-[#0F172A] border-[#E8ECF0] shadow-sm whitespace-nowrap">View Full Report</Button>
               </div>
            </PearlCard>
         ))}
      </section>

    </div>
  )
}
```

### `app/construction/progress/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import { getDailyProgress } from '@/lib/data';
import ProgressClient from './client';

export default async function ProgressReportsPage() {
  const reports = await getDailyProgress();

  return <ProgressClient initialReports={reports || []} />
}
```

### `app/construction/stock/actions.ts`
```typescript
"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addStockItem(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const quantity = parseFloat(formData.get("quantity") as string) || 0;
  const unit = formData.get("unit") as string;

  if (!name || !category || !unit) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase.from("stock_items").insert({
    name,
    category,
    quantity,
    unit,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/construction/stock");
  return { success: true };
}

export async function restockItem(formData: FormData) {
  const itemId = formData.get("item_id") as string;
  const quantityToAdd = parseFloat(formData.get("quantity") as string) || 0;

  if (!itemId || quantityToAdd <= 0) {
    return { error: "Invalid quantity or item" };
  }

  // First fetch current quantity
  const { data: item, error: fetchError } = await supabase
    .from("stock_items")
    .select("quantity")
    .eq("item_id", itemId)
    .single();

  if (fetchError || !item) {
    return { error: "Item not found" };
  }

  const newQuantity = Number(item.quantity) + quantityToAdd;

  const { error: updateError } = await supabase
    .from("stock_items")
    .update({ quantity: newQuantity, last_updated: new Date().toISOString() })
    .eq("item_id", itemId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/construction/stock");
  return { success: true };
}
```

### `app/construction/stock/client.tsx`
```tsx
"use client"

import { useState } from "react"
import { 
  Package, Search, Filter, Plus, FileDown,
  Edit, Trash2, History, AlertTriangle, CheckCircle, Clock 
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock array replaced by props

const stockHistoryData = [
  { day: "1", qty: 150 }, { day: "5", qty: 140 }, { day: "10", qty: 140 },
  { day: "15", qty: 110 }, { day: "20", qty: 85 }, { day: "25", qty: 120 }, { day: "30", qty: 120 }
];

const txHistory = [
  { date: "Mar 18, 2026", type: "Used", qty: "-10", ref: "Tower A, Fl 12", by: "Ravi Kumar" },
  { date: "Mar 15, 2026", type: "Added", qty: "+50", ref: "PO-2026-089", by: "Amit M" },
  { date: "Mar 10, 2026", type: "Used", qty: "-35", ref: "Tower B, Fl 8", by: "Sunil Sharma" },
  { date: "Mar 05, 2026", type: "Adjusted", qty: "-5", ref: "Damage written off", by: "Amit M" },
];

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function StockClient({ items, stats }: { items: any[], stats: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestock, setSelectedRestock] = useState<any>(null);

  const formatCur = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Stock & Materials Management</h1>
        <p className="text-sm text-slate-500">Track inventory levels, manage restock requests, and monitor material usage.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-5">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Items</p>
            <h3 className="text-[28px] font-bold text-[#0F172A] leading-tight">{stats?.totalItems || 0}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Good Stock</p>
            <h3 className="text-[28px] font-bold text-[#10B981] leading-tight">{items.filter(i => i.status === 'Good').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Low Stock</p>
            <h3 className="text-[28px] font-bold text-[#F59E0B] leading-tight">{items.filter(i => i.status === 'Low').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Critical</p>
            <h3 className="text-[28px] font-bold text-[#EF4444] leading-tight">{items.filter(i => i.status === 'Critical').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
             <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Value</p>
             <h3 className="text-[28px] font-bold text-[#0F172A] leading-tight">₹{(stats?.totalValue / 100000).toFixed(1)}L</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search material..." 
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cement">Cement</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
              <SelectItem value="finishing">Finishing</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm flex gap-2">
                <Plus className="w-4 h-4" /> Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Material</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Material Name</Label>
                    <Input placeholder="e.g. Gypsum Board" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finishing">Finishing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Unit of Measurement</Label>
                    <Input placeholder="e.g. sqft, pcs, bags" />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Threshold</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Cost (₹)</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Quantity</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Preferred Supplier</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select Supplier" /></SelectTrigger>
                      <SelectContent>
                         <SelectItem value="s1">Rajhans Cement Co.</SelectItem>
                         <SelectItem value="s2">Steel Plus Pvt Ltd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-[8px]">Cancel</Button>
                <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px]">Add Material</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* MATERIALS TABLE */}
      <section>
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Material</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Qty / Unit</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Min Threshold</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Unit Cost</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Total Value</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.filter(m => (m.item_name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((item) => {
                const itemValue = (item.quantity || 0) * (item.unit_cost || 0);
                return (
                <TableRow key={item.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                       <span className="font-bold text-[14px] text-[#0F172A]">{item.item_name}</span>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono">{item.id?.substring(0,8)}</span>
                          <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[4px] text-[9px] font-semibold uppercase border-slate-200 tracking-wider">
                            {item.category}
                          </Badge>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{item.quantity} <span className="text-[12px] font-medium text-slate-500">{item.unit}</span></div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Updated: {new Date(item.updated_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium text-sm">{item.min_threshold}</TableCell>
                  <TableCell>
                    <Badge className={`rounded-full shadow-none text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Good' ? 'bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/20' :
                      item.status === 'Low' ? 'bg-[#F59E0B]/15 text-[#D97706] hover:bg-[#F59E0B]/20' :
                      'bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/20'
                    }`}>
                      {item.status === 'Critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-[13px]">{formatCur(item.unit_cost || 0)}</TableCell>
                  <TableCell className="text-right font-bold text-[14px]">{formatCur(itemValue)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                       {/* HISTORY DRAWER */}
                       <Sheet>
                         <SheetTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-[8px]" title="History">
                             <History className="h-4 w-4" />
                           </Button>
                         </SheetTrigger>
                         <SheetContent className="sm:max-w-[450px]">
                           <SheetHeader className="mb-6">
                             <SheetTitle className="text-xl font-bold">{item.item_name}</SheetTitle>
                             <div className="flex items-center gap-2 mt-2">
                               <Badge variant="outline" className="bg-slate-50">{item.category}</Badge>
                               <Badge variant="secondary" className="bg-blue-50 text-blue-700">Stock: {item.quantity} {item.unit}</Badge>
                             </div>
                           </SheetHeader>
                           
                           <div className="space-y-6">
                             <div>
                               <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">30-Day Trend</h4>
                               <div className="h-[200px] border border-[#E8ECF0] rounded-[12px] p-2 bg-slate-50/50">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stockHistoryData}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0"/>
                                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                                      <Line type="monotone" dataKey="qty" stroke="#0066FF" strokeWidth={2.5} dot={{r: 4, fill: '#0066FF'}} activeDot={{r: 6, fill: '#FFFFFF', stroke: '#0066FF', strokeWidth: 2}}/>
                                    </LineChart>
                                 </ResponsiveContainer>
                               </div>
                             </div>

                             <div>
                               <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Transactions</h4>
                               <div className="divide-y divide-[#E8ECF0] border border-[#E8ECF0] rounded-[12px] bg-white">
                                  {txHistory.map((tx, idx) => (
                                    <div key={idx} className="p-3 hover:bg-slate-50 flex justify-between items-center transition-colors">
                                      <div>
                                        <div className="font-bold text-[13px] text-[#0F172A]">{tx.type} <span className="text-slate-400 font-normal mx-1">•</span> {tx.ref}</div>
                                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{tx.date} | By: {tx.by}</div>
                                      </div>
                                      <div className={`font-bold text-[14px] ${tx.qty.startsWith('+') ? 'text-[#10B981]' : tx.qty.startsWith('-') ? 'text-[#0F172A]' : 'text-slate-600'}`}>
                                        {tx.qty}
                                      </div>
                                    </div>
                                  ))}
                               </div>
                             </div>
                           </div>
                         </SheetContent>
                       </Sheet>

                       {/* RESTOCK DIALOG */}
                       <Dialog>
                         <DialogTrigger asChild>
                           <Button variant="outline" size="sm" className="h-8 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 rounded-[8px] bg-orange-50/50 font-semibold" onClick={() => setSelectedRestock(item)}>
                              Request
                           </Button>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-[450px]">
                           <DialogHeader>
                             <DialogTitle>Demand Request</DialogTitle>
                           </DialogHeader>
                           {selectedRestock && (
                             <div className="grid gap-4 py-4">
                               <div className="p-3 bg-slate-50 rounded-[10px] border border-[#E8ECF0] flex justify-between items-center shadow-sm">
                                  <div>
                                    <div className="font-bold text-[14px] text-[#0F172A]">{selectedRestock.item_name}</div>
                                    <div className="text-[12px] text-slate-500 font-medium">Current Stock: {selectedRestock.quantity} {selectedRestock.unit}</div>
                                  </div>
                                  {selectedRestock.status === 'Critical' && <Badge variant="destructive" className="h-5 text-[10px] rounded-full px-2 uppercase shadow-none tracking-wider bg-red-100 text-red-700 hover:bg-red-100 border-none">Critical</Badge>}
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold">Quantity Required ({selectedRestock.unit})</Label>
                                 <Input type="number" placeholder="Enter quantity" className="h-10 rounded-[8px]" />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold">Preferred Supplier</Label>
                                 <Select defaultValue="s1">
                                   <SelectTrigger className="h-10 rounded-[8px]"><SelectValue /></SelectTrigger>
                                   <SelectContent>
                                     <SelectItem value="s1">Supplier {selectedRestock.supplier_id || 'Unknown'}</SelectItem>
                                     <SelectItem value="s2">Other Supplier...</SelectItem>
                                   </SelectContent>
                                 </Select>
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold">Required By Date</Label>
                                 <Input type="date" className="h-10 rounded-[8px]" />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold">Notes / Justification</Label>
                                 <Textarea placeholder="Specific requirements or reason..." rows={3} className="rounded-[8px]" />
                               </div>
                             </div>
                           )}
                           <DialogFooter className="gap-2 sm:gap-0">
                             <Button variant="outline" className="rounded-[8px] h-10">Cancel</Button>
                             <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] h-10 font-bold shadow-sm">Submit Request</Button>
                           </DialogFooter>
                         </DialogContent>
                       </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              );})}
            </TableBody>
          </Table>
        </PearlCard>
      </section>
    </div>
  )
}
```

### `app/construction/stock/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import { getInventoryItems, getInventoryStats } from '@/lib/data';
import StockClient from './client';

export default async function StockPage() {
  const [items, stats] = await Promise.all([
    getInventoryItems(), 
    getInventoryStats()
  ]);

  return <StockClient items={items || []} stats={stats} />
}
```

### `app/construction/stock/stock-client.tsx`
```tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Plus, RefreshCw, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { addStockItem, restockItem } from "./actions";

type StockItem = {
  item_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  last_updated: string;
};

export default function StockClient({ items }: { items: StockItem[] }) {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [restockItemId, setRestockItemId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  async function handleAddStock(formData: FormData) {
    setIsLoading(true);
    const result = await addStockItem(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Stock item added successfully" });
      setIsAddOpen(false);
    }
  }

  async function handleRestock(formData: FormData) {
    setIsLoading(true);
    const result = await restockItem(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Stock updated successfully" });
      setRestockItemId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Stock Inventory</h1>
          <p className="text-slate-500 mt-1">Manage construction materials and view stock levels.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Stock Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Material</DialogTitle>
            </DialogHeader>
            <form action={handleAddStock} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" name="name" placeholder="e.g. UltraTech Cement" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required defaultValue="Cement">
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cement">Cement</SelectItem>
                    <SelectItem value="Steel">Steel</SelectItem>
                    <SelectItem value="Bricks">Bricks</SelectItem>
                    <SelectItem value="Sand">Sand</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Initial Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" step="0.01" min="0" defaultValue="0" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" name="unit" placeholder="Bags, Tons, etc." required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Item'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-950">
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No stock items found.
                </TableCell>
              </TableRow>
            ) : items.map((item) => {
              const needsRestock = item.quantity < 20;
              return (
                <TableRow key={item.item_id} className={needsRestock ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {item.name}
                      {needsRestock && (
                        <span title="Low Stock Warning" className="inline-flex">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white dark:bg-transparent">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={needsRestock ? "text-orange-600 dark:text-orange-400" : ""}>
                      {item.quantity} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {format(new Date(item.last_updated), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={restockItemId === item.item_id} onOpenChange={(open) => setRestockItemId(open ? item.item_id : null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <PackagePlus className="h-4 w-4 mr-1" /> Restock
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restock Item</DialogTitle>
                        </DialogHeader>
                        <form action={handleRestock} className="space-y-4 pt-4">
                          <input type="hidden" name="item_id" value={item.item_id} />
                          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded grid grid-cols-2 text-sm gap-2">
                            <div className="text-slate-500">Item Name:</div>
                            <div className="font-medium text-right">{item.name}</div>
                            <div className="text-slate-500">Current Stock:</div>
                            <div className="font-medium text-right">{item.quantity} {item.unit}</div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity to Add</Label>
                            <Input id="add-quantity" name="quantity" type="number" step="0.01" min="0.01" placeholder="0" required />
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setRestockItemId(null)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Confirm Restock'}</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

### `app/construction/vendors/client.tsx`
```tsx
"use client"

import { useState } from "react"
import { 
  Building2, Search, Filter, Plus, FileDown, Phone,
  Star, ShoppingBag, CreditCard, Box, MapPin, Mail, AlertTriangle
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock array replaced by props

const OrderHistory = [
  { id: "PO-26-089", date: "Mar 15, 2026", items: "Cement OPC (x200)", amt: "₹70,000", status: "Delivered" },
  { id: "PO-26-074", date: "Feb 28, 2026", items: "Cement PPC (x150)", amt: "₹48,000", status: "Delivered" },
  { id: "PO-26-061", date: "Feb 10, 2026", items: "Cement OPC (x300)", amt: "₹1,05,000", status: "Delivered" },
];

const PaymentHistory = [
  { date: "Mar 16, 2026", amt: "₹25,000", ref: "NEFT-HDFCXXXX123", bal: "₹45,000" },
  { date: "Mar 05, 2026", amt: "₹48,000", ref: "UPI-SBIXXXX456", bal: "₹0" },
  { date: "Feb 15, 2026", amt: "₹1,05,000", ref: "CHEQUE-009812", bal: "₹0" },
];

const formatCur = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function VendorsClient({ initialVendors }: { initialVendors: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const vendorsList = initialVendors.map((v, i) => ({
    id: v.id?.substring(0,8) || `VND-10${i+1}`,
    name: v.name || 'Unknown Vendor',
    cat: v.category || 'General',
    contact: v.contact_person || 'N/A',
    phone: v.phone || '--',
    email: v.email || '--',
    out: v.outstanding_balance || 0,
    limit: v.credit_limit || 0,
    date: "Mar 15, 2026", // Mocking last order date
    orders: 0, // Mocking orders
    rating: v.rating || 4,
    status: v.status || 'Active'
  }));

  const filteredVendors = vendorsList.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Vendor & Supplier Management</h1>
        <p className="text-sm text-slate-500">Manage supplier profiles, track orders, monitor outstanding payments, and record invoices.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Vendors</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{vendorsList.length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Active Accounts</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight flex items-center gap-2"><Building2 className="w-6 h-6 text-[#10B981]"/> {vendorsList.filter(v => v.status === 'Active').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Outstanding</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight">₹{(vendorsList.reduce((acc, v) => acc + v.out, 0) / 100000).toFixed(2)}L</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#0066FF]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Orders This Month</p>
            <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-[#0066FF]"/> 14</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR  */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search vendors..." 
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cement">Cement</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2">
          <Plus className="w-4 h-4" /> Add Vendor
        </Button>
      </section>

      {/* VENDORS FULL TABLE */}
      <section>
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Vendor Info</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Contact details</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Outstanding / Limit</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Last Order</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Rating</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((v) => (
                <TableRow key={v.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{v.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono text-slate-400">{v.id}</span>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[4px] text-[9px] font-bold tracking-wider uppercase border-slate-200">{v.cat}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-[13px] text-[#0F172A] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400"/> {v.phone}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{v.contact}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`font-bold text-[15px] ${v.out > 50000 ? 'text-red-600' : 'text-[#0F172A]'}`}>₹{(v.out).toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Limit: ₹{(v.limit).toLocaleString('en-IN')}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium text-[13px] text-slate-700">{v.date}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{v.orders} orders total</div>
                  </TableCell>
                  <TableCell className="text-center">
                     <div className="flex justify-center text-amber-400 gap-0.5">
                       {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < v.rating ? 'fill-current' : 'text-slate-200 fill-slate-200'}`} />
                       ))}
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                     {v.status === 'Active' ? 
                       <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold">Active</Badge> : 
                       <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold border border-slate-200">Pending</Badge>
                     }
                  </TableCell>
                  <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                     <Sheet>
                       <SheetTrigger asChild>
                         <Button variant="outline" size="sm" className="h-8 text-[11px] rounded-[6px] font-bold text-[#0F172A] border-[#E8ECF0] hover:bg-slate-50 shadow-sm" onClick={() => setSelectedVendor(v)}>Profile</Button>
                       </SheetTrigger>
                       <SheetContent className="sm:max-w-[550px] overflow-y-auto">
                         <SheetHeader className="mb-6 border-b border-[#E8ECF0] pb-4">
                           <SheetTitle className="text-2xl font-bold">{v.name}</SheetTitle>
                           <div className="flex items-center gap-2 mt-2">
                             <Badge variant="outline" className="bg-slate-50 text-slate-700 font-bold">{v.cat}</Badge>
                             <div className="flex text-amber-500 gap-0.5 items-center">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-sm font-bold text-[#0F172A]">{v.rating}.0</span>
                             </div>
                             {v.status === 'Active' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold ml-auto border-none">Active Vendor</Badge>}
                           </div>
                         </SheetHeader>
                         
                         <div className="space-y-6">
                           {/* Quick Contacts */}
                           <div className="grid grid-cols-2 gap-3 mb-6">
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0] flex gap-3 items-center">
                                 <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0066FF] flex items-center justify-center shrink-0"><Phone className="w-4 h-4"/></div>
                                 <div className="overflow-hidden">
                                   <p className="text-[10px] uppercase font-bold text-slate-400">Call</p>
                                   <p className="font-semibold text-[13px] text-[#0F172A] truncate">{v.phone}</p>
                                 </div>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0] flex gap-3 items-center">
                                 <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><Mail className="w-4 h-4"/></div>
                                 <div className="overflow-hidden">
                                   <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                                   <p className="font-semibold text-[13px] text-[#0F172A] truncate" title={v.email}>{v.email}</p>
                                 </div>
                              </div>
                           </div>

                           {/* Financials Overview */}
                           <div className="bg-red-50/50 p-6 rounded-[12px] border border-red-100 shadow-sm flex items-center justify-between">
                             <div>
                               <p className="text-[12px] uppercase font-bold text-red-700 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4"/> Current Outstanding Balance</p>
                               <h2 className="text-4xl font-bold text-red-600 tracking-tight">₹{(v.out).toLocaleString('en-IN')}</h2>
                             </div>
                             <Button className="bg-red-600 hover:bg-red-700 text-white rounded-[8px] font-bold shadow-sm shadow-red-200">Record Payment</Button>
                           </div>

                           {/* History Tables */}
                           <div className="space-y-4">
                             <div className="flex justify-between items-center mb-2">
                               <h4 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Recent Orders</h4>
                               <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-[6px] text-[#0066FF] border-[#E8ECF0] hover:bg-blue-50 font-bold px-2">View All</Button>
                             </div>
                             <div className="border border-[#E8ECF0] rounded-[10px] bg-white overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader className="bg-slate-50"><TableRow className="border-none"><TableHead className="py-2 text-[10px]">PO #</TableHead><TableHead className="py-2 text-[10px]">Items</TableHead><TableHead className="py-2 text-[10px] text-right">Amount</TableHead></TableRow></TableHeader>
                                  <TableBody>
                                    {OrderHistory.map((o, ix) => (
                                      <TableRow key={ix} className="border-[#E8ECF0] hover:bg-transparent"><TableCell className="py-2.5 text-[12px] font-bold text-[#0066FF]">{o.id}</TableCell><TableCell className="py-2.5 text-[12px] font-medium text-slate-600">{o.items}</TableCell><TableCell className="py-2.5 text-[12px] font-bold text-right">{o.amt}</TableCell></TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                             </div>

                             <div className="flex justify-between items-center mb-2 mt-6">
                               <h4 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><CreditCard className="w-4 h-4"/> Payment History</h4>
                               <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-[6px] text-slate-500 border-[#E8ECF0] hover:bg-slate-50 font-bold px-2">View All</Button>
                             </div>
                             <div className="border border-[#E8ECF0] rounded-[10px] bg-white overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader className="bg-slate-50"><TableRow className="border-none"><TableHead className="py-2 text-[10px]">Date</TableHead><TableHead className="py-2 text-[10px]">Reference</TableHead><TableHead className="py-2 text-[10px] text-right">Amount</TableHead></TableRow></TableHeader>
                                  <TableBody>
                                    {PaymentHistory.map((p, ix) => (
                                      <TableRow key={ix} className="border-[#E8ECF0] hover:bg-transparent"><TableCell className="py-2.5 text-[12px] font-medium text-slate-500">{p.date}</TableCell><TableCell className="py-2.5 text-[12px] font-mono text-slate-600">{p.ref}</TableCell><TableCell className="py-2.5 text-[12px] font-bold text-emerald-600 text-right">{p.amt}</TableCell></TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                             </div>
                           </div>

                         </div>
                       </SheetContent>
                     </Sheet>

                     <Dialog>
                       <DialogTrigger asChild>
                         <Button size="sm" className="h-8 text-[11px] rounded-[6px] bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold shadow-sm" onClick={() => setSelectedVendor(v)}>New Order</Button>
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[650px]">
                         <DialogHeader>
                           <DialogTitle>Place New Purchase Order</DialogTitle>
                         </DialogHeader>
                         {selectedVendor && (
                            <div className="grid gap-5 py-4">
                               <div className="p-4 bg-slate-50 rounded-[10px] border border-[#E8ECF0] flex justify-between items-center shadow-sm">
                                  <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vendor Selected</div>
                                    <div className="font-bold text-[16px] text-[#0F172A] flex items-center gap-2">{selectedVendor.name} <Badge variant="outline" className="text-[9px] bg-white">{selectedVendor.cat}</Badge></div>
                                  </div>
                               </div>

                               <div className="space-y-3 border p-4 rounded-[12px] border-[#E8ECF0]">
                                 <div className="flex justify-between items-center border-b border-[#E8ECF0] pb-2">
                                   <Label className="font-bold text-[#0F172A]">Order Items</Label>
                                   <Button variant="ghost" size="sm" className="h-7 text-[#0066FF] px-2 text-[11px] hover:bg-blue-50 font-bold"><Plus className="w-3 h-3 mr-1"/> Add Item</Button>
                                 </div>
                                 <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase px-1">
                                    <div className="col-span-5">Material Description</div>
                                    <div className="col-span-2 text-center">Qty</div>
                                    <div className="col-span-2 text-right">Unit Price</div>
                                    <div className="col-span-3 text-right pr-2">Total</div>
                                 </div>
                                 <div className="grid grid-cols-12 gap-2 mt-1">
                                    <div className="col-span-5"><Input placeholder="Item name" className="h-9 text-[13px] rounded-[6px]" /></div>
                                    <div className="col-span-2"><Input type="number" placeholder="Qty" className="h-9 text-[13px] text-center rounded-[6px]" /></div>
                                    <div className="col-span-2"><Input type="number" placeholder="₹" className="h-9 text-[13px] text-right rounded-[6px]" /></div>
                                    <div className="col-span-3"><Input disabled value="₹0.00" className="h-9 text-[13px] bg-slate-50 font-bold text-right rounded-[6px]" /></div>
                                 </div>
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">Expected Delivery Date</Label>
                                    <Input type="date" className="h-10 rounded-[8px]" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">Payment Terms</Label>
                                    <Select defaultValue="net30">
                                      <SelectTrigger className="h-10 rounded-[8px]"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="adv">100% Advance</SelectItem>
                                        <SelectItem value="net15">Net 15 Days</SelectItem>
                                        <SelectItem value="net30">Net 30 Days</SelectItem>
                                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                               </div>

                               <div className="space-y-2">
                                 <Label className="font-semibold text-slate-700">Additional Notes / Instructions</Label>
                                 <Textarea placeholder="Delivery instructions..." rows={2} className="rounded-[8px]" />
                               </div>
                               
                               <div className="p-4 bg-blue-50 rounded-[10px] border border-blue-100 flex justify-between items-center text-blue-900 mt-2">
                                  <span className="font-bold text-[14px]">Total Order Value</span>
                                  <span className="font-black text-[20px] text-[#0066FF]">₹0.00</span>
                               </div>
                            </div>
                         )}
                         <DialogFooter className="gap-2 sm:gap-0 mt-2">
                           <Button variant="outline" className="rounded-[8px] h-10 font-semibold">Cancel</Button>
                           <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm px-6">Generate PO</Button>
                         </DialogFooter>
                       </DialogContent>
                     </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

    </div>
  )
}
```

### `app/construction/vendors/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import { getVendors } from '@/lib/data';
import VendorsClient from './client';

export default async function VendorsPage() {
  const vendors = await getVendors();

  return <VendorsClient initialVendors={vendors || []} />
}
```

### `app/dashboard/cashflow/page.tsx`
```tsx
"use client"

import { useState } from "react"
import { AlertCircle, ArrowDownRight, ArrowUpRight, Ban, Clock, IndianRupee } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { 
  ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

// --- HELPERS ---
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// --- MOCK DATA ---
const cashChartData = [
  { time: "Day 1", in: 12, out: -8, net: 4, cumulative: 4 },
  { time: "Day 2", in: 15, out: -9, net: 6, cumulative: 10 },
  { time: "Day 3", in: 8, out: -12, net: -4, cumulative: 6 },
  { time: "Day 4", in: 18, out: -5, net: 13, cumulative: 19 },
  { time: "Day 5", in: 22, out: -15, net: 7, cumulative: 26 },
  { time: "Day 6", in: 5, out: -20, net: -15, cumulative: 11 },
  { time: "Day 7", in: 14, out: -7, net: 7, cumulative: 18 },
  { time: "Day 8", in: 25, out: -10, net: 15, cumulative: 33 },
  { time: "Day 9", in: 10, out: -8, net: 2, cumulative: 35 },
  { time: "Day 10", in: 30, out: -18, net: 12, cumulative: 47 },
];

const inflows = [
  { cat: "Customer Payments", amt: "₹4.5Cr" },
  { cat: "Bank Loan Disbursal", amt: "₹2.0Cr" },
  { cat: "Rental Income", amt: "₹0.18Cr" },
  { cat: "Other Receipts", amt: "₹0.05Cr" },
];

const outflows = [
  { cat: "Contractor Payments", amt: "₹2.8Cr" },
  { cat: "Material Vendors", amt: "₹1.5Cr" },
  { cat: "Marketing Spend", amt: "₹0.45Cr" },
  { cat: "Salaries & Wages", amt: "₹0.35Cr" },
];

const cashEvents = [
  { desc: "Customer Payment Due (Tower A)", amt: "₹45L", date: "Mar 25", type: "in", status: "expected" },
  { desc: "Bank Loan EMI", amt: "-₹18L", date: "Mar 20", type: "out", status: "cleared" },
  { desc: "Vendor Payment (UltraTech)", amt: "-₹12L", date: "Mar 22", type: "out", status: "expected" },
  { desc: "Customer Payment Due (Villas)", amt: "₹65L", date: "Mar 28", type: "in", status: "delayed" },
  { desc: "Contractor Payment (MEP)", amt: "-₹28L", date: "Mar 30", type: "out", status: "expected" },
];

export default function CashFlowPage() {
  const [view, setView] = useState("Daily");

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Cash Flow & Liquidity</h1>
        <p className="text-slate-500 font-medium mt-1">Real-time tracking of inflows, outflows, and operational runway.</p>
      </div>

      {/* SECTION 1: KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5 flex flex-col justify-between">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Cash available</p>
          <div className="flex items-center justify-between">
             <h3 className="text-[32px] font-bold text-[#10B981]">₹8.4Cr</h3>
             <IndianRupee className="w-8 h-8 text-emerald-100" />
          </div>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 flex flex-col justify-between">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2">30-Day Inflows</p>
          <div className="flex items-center justify-between">
             <h3 className="text-[32px] font-bold text-[#0066FF]">₹6.7Cr</h3>
             <ArrowUpRight className="w-8 h-8 text-blue-200" />
          </div>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 flex flex-col justify-between">
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-2">30-Day Outflows</p>
          <div className="flex items-center justify-between">
             <h3 className="text-[32px] font-bold text-[#EF4444]">₹5.1Cr</h3>
             <ArrowDownRight className="w-8 h-8 text-red-200" />
          </div>
        </InteractivePearlCard>
        
        {/* RUNWAY WARNING */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[16px] p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full opacity-50 blur-xl"></div>
          <p className="text-[12px] font-bold text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Operational Runway
          </p>
          <div>
            <h3 className="text-[32px] font-black text-amber-900 leading-none">5.2 mo</h3>
            <p className="text-amber-700 text-[11px] font-semibold mt-1">Requires attention (&lt; 6 months)</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: FULL WIDTH CHART */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Net Cash Movement</h2>
          <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-[10px] border border-[#E8ECF0]">
            {['Daily', 'Weekly', 'Monthly'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-[6px] text-[12px] font-bold transition-all ${
                  view === v ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <PearlCard className="p-6">
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={cashChartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
               <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
               <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
               <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
               
               <Bar dataKey="in" name="Inflows" fill="#10B981" radius={[4, 4, 0, 0]} barSize={16} />
               <Bar dataKey="out" name="Outflows" fill="#EF4444" radius={[0, 0, 4, 4]} barSize={16} />
               <Line type="monotone" dataKey="cumulative" name="Cumulative Balance" stroke="#0066FF" strokeWidth={3} dot={{ r: 4, fill: '#fff' }} activeDot={{ r: 7 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </PearlCard>
      </section>

      {/* SECTION 3 & 4: TABLES */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* STATEMENT TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeading title="Cash Flow Breakdown (This Month)" />
          <div className="grid md:grid-cols-2 gap-6">
            <PearlCard className="overflow-hidden">
               <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-100 flex justify-between items-center">
                  <h3 className="font-bold text-emerald-800 tracking-wider uppercase text-[13px]">Cash Inflows</h3>
                  <span className="font-black text-emerald-600">₹6.7Cr</span>
               </div>
               <div className="p-5 space-y-4">
                 {inflows.map((inf, i) => (
                   <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                     <span className="text-[14px] font-medium text-slate-600">{inf.cat}</span>
                     <span className="text-[15px] font-bold text-[#0F172A]">{inf.amt}</span>
                   </div>
                 ))}
               </div>
            </PearlCard>
            
            <PearlCard className="overflow-hidden">
               <div className="bg-red-50 px-5 py-4 border-b border-red-100 flex justify-between items-center">
                  <h3 className="font-bold text-red-800 tracking-wider uppercase text-[13px]">Cash Outflows</h3>
                  <span className="font-black text-red-600">₹5.1Cr</span>
               </div>
               <div className="p-5 space-y-4">
                 {outflows.map((outf, i) => (
                   <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                     <span className="text-[14px] font-medium text-slate-600">{outf.cat}</span>
                     <span className="text-[15px] font-bold text-[#0F172A]">{outf.amt}</span>
                   </div>
                 ))}
               </div>
            </PearlCard>
          </div>
        </div>

        {/* TIMELINE */}
        <div>
          <SectionHeading title="Upcoming Cash Events" />
          <PearlCard className="p-0">
            <div className="divide-y divide-[#E8ECF0]">
              {cashEvents.map((evt, i) => (
                <div key={i} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${evt.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {evt.type === 'in' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <span className="font-semibold text-[#0F172A] text-[13px] pr-4 leading-tight">{evt.desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-10">
                    <div className="flex gap-3 items-center">
                      <Badge variant="outline" className={`px-2 py-0 uppercase tracking-widest text-[9px] font-bold border-none ${
                        evt.status === 'expected' ? 'bg-blue-50 text-blue-600' :
                        evt.status === 'delayed' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {evt.status}
                      </Badge>
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {evt.date}</span>
                    </div>
                    <span className={`font-bold text-[15px] ${evt.type === 'in' ? 'text-emerald-600' : 'text-[#0F172A]'}`}>{evt.amt}</span>
                  </div>
                </div>
              ))}
            </div>
          </PearlCard>
        </div>

      </div>

    </div>
  )
}
```

### `app/dashboard/client.tsx`
```tsx
"use client"

import { 
  IndianRupee, TrendingDown, TrendingUp, Users, Target, Building2, 
  MapPin, Clock, ArrowRight, Medal, CheckCircle2, CircleDashed, Circle, AlertTriangle, BarChart3
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { 
  ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, Cell
} from "recharts"

// --- MOCK DATA FALLBACKS ---
const salesVsTargetData = [
  { month: "Oct", actual: 12, target: 15, pct: 80 },
  { month: "Nov", actual: 18, target: 15, pct: 120 },
  { month: "Dec", actual: 22, target: 20, pct: 110 },
  { month: "Jan", actual: 16, target: 20, pct: 80 },
  { month: "Feb", actual: 19, target: 20, pct: 95 },
  { month: "Mar", actual: 23, target: 20, pct: 115 },
];

const constructionBurnData = [
  { month: "Oct", budget: 80, spent: 45 },
  { month: "Nov", budget: 80, spent: 58 },
  { month: "Dec", budget: 80, spent: 71 },
  { month: "Jan", budget: 80, spent: 68 },
  { month: "Feb", budget: 80, spent: 74 },
  { month: "Mar", budget: 80, spent: 77 },
];

const revenueForecastData = [
  { month: "Apr 26", projected: 85, confirmed: 60, target: 90 },
  { month: "May", projected: 92, confirmed: 55, target: 95 },
  { month: "Jun", projected: 78, confirmed: 45, target: 85 },
  { month: "Jul", projected: 105, confirmed: 70, target: 110 },
  { month: "Aug", projected: 98, confirmed: 65, target: 105 },
  { month: "Sep", projected: 120, confirmed: 80, target: 125 },
];

const cashFlowData = [
  { month: "Oct", in: 120, out: -85, net: 35, cumulative: 35 },
  { month: "Nov", in: 145, out: -92, net: 53, cumulative: 88 },
  { month: "Dec", in: 168, out: -78, net: 90, cumulative: 178 },
  { month: "Jan", in: 132, out: -95, net: 37, cumulative: 215 },
  { month: "Feb", in: 158, out: -88, net: 70, cumulative: 285 },
  { month: "Mar", in: 185, out: -102, net: 83, cumulative: 368 },
];

const constLeaderboard = [
  { name: "Ravi Kumar", tasks: 24, ontime: "96%", eff: "Excellent" },
  { name: "Sunil Sharma", tasks: 19, ontime: "88%", eff: "Good" },
  { name: "Pradeep Singh", tasks: 22, ontime: "91%", eff: "Very Good" },
];

// --- FORMAT HELPERS ---
const formatCr = (val: number) => `₹${(val / 10000000).toFixed(1)}Cr`;

const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
    <Button variant="ghost" className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 px-3 text-[13px]">View All</Button>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200 ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

export default function DashboardClient({
  finStats,
  leadsStats,
  flatsStats,
  projStats,
  projectsDb,
  brokers
}: any) {

  const totalRev = finStats?.totalRevenue || 0;
  const totalExp = finStats?.totalExpenses || 0;
  const netProfit = finStats?.netProfit || 0;
  const projCount = projStats?.total || 0;
  
  const funnelData = [
    { stage: "Total Leads", count: leadsStats?.total || 0, pct: "100%", drop: null, color: "#1E3A8A" },
    { stage: "Contacted", count: leadsStats?.contacted || 0, pct: "69.7%", drop: ((leadsStats?.total||0)-(leadsStats?.contacted||0)), color: "#2563EB" },
    { stage: "Site Visit", count: leadsStats?.siteVisit || 0, pct: "31.3%", drop: ((leadsStats?.contacted||0)-(leadsStats?.siteVisit||0)), color: "#3B82F6" },
    { stage: "Negotiation", count: leadsStats?.negotiation || 0, pct: "14.4%", drop: ((leadsStats?.siteVisit||0)-(leadsStats?.negotiation||0)), color: "#60A5FA" },
    { stage: "Converted", count: leadsStats?.converted || 0, pct: "8.1%", drop: ((leadsStats?.negotiation||0)-(leadsStats?.converted||0)), color: "#93C5FD" },
    { stage: "Lost", count: leadsStats?.lost || 0, pct: "6.3%", drop: "from neg", color: "#BFDBFE" }
  ];

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* SECTION 1 - EXECUTIVE KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-3">
        {/* ROW 1 */}
        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-[#0066FF] to-blue-400 flex items-center justify-center text-white shadow-md">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 23% vs last mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{formatCr(totalRev)}</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Total Revenue</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">{projCount} projects combined</p>
          </div>
          <svg className="absolute bottom-4 right-4 opacity-20" width="60" height="24" viewBox="0 0 60 24">
            <path d="M0,20 L15,10 L30,15 L45,5 L60,0" fill="none" stroke="#0066FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-red-500 to-rose-400 flex items-center justify-center text-white shadow-md">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 8% vs last mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{formatCr(totalExp)}</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Total Expenses</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">Marketing + Construction</p>
          </div>
          <svg className="absolute bottom-4 right-4 opacity-20" width="60" height="24" viewBox="0 0 60 24">
            <path d="M0,5 L15,15 L30,12 L45,20 L60,24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-md">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 41% vs last mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{formatCr(netProfit)}</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Net Profit</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">{finStats?.profitMargin || 0}% profit margin</p>
          </div>
          <svg className="absolute bottom-4 right-4 opacity-20" width="60" height="24" viewBox="0 0 60 24">
            <path d="M0,24 L15,18 L30,8 L45,12 L60,0" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </InteractivePearlCard>

        {/* ROW 2 */}
        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 12% this mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{leadsStats?.total || 0}</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Total Leads</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">Across all channels</p>
          </div>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
              <Target className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">↑ 5% this mo</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{leadsStats?.converted || 0} units</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Conversions</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">Conversion rate</p>
          </div>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[11px] font-bold">On Schedule</div>
          </div>
          <div className="mt-4">
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{projCount} projects</h3>
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Active Projects</p>
            <p className="text-[12px] font-medium text-slate-400 mt-2">{projStats?.active || 0} active</p>
          </div>
        </InteractivePearlCard>
      </section>

      {/* SECTION 2 - OVERALL P&L SUMMARY */}
      <section>
        <PearlCard className="p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-8 border-b border-[#E8ECF0] pb-4">Profit & Loss Summary (Live Data)</h2>
          
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Income */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#10B981] text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Income
              </h4>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Flat Sales / Bookings</span>
                <span className="font-semibold text-[#0F172A]">₹{totalRev.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t border-[#E8ECF0] flex justify-between items-center mt-2">
                <span className="font-bold text-[15px] text-[#0F172A]">Total Income</span>
                <span className="font-bold text-[18px] text-[#10B981]">₹{totalRev.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Expenses */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#EF4444] text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Expenses
              </h4>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Construction Cost</span>
                <span className="font-semibold text-[#0F172A]">₹{(finStats?.constructionSpend || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Marketing Spend</span>
                <span className="font-semibold text-[#0F172A]">₹{(finStats?.marketingSpend || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Other Ops</span>
                <span className="font-semibold text-[#0F172A]">₹{(totalExp - (finStats?.constructionSpend||0) - (finStats?.marketingSpend||0)).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 border-t border-[#E8ECF0] flex justify-between items-center mt-2">
                <span className="font-bold text-[15px] text-[#0F172A]">Total Expenses</span>
                <span className="font-bold text-[18px] text-[#EF4444]">₹{(totalExp).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4 bg-[#F8FAFC] p-6 rounded-2xl border border-[#E8ECF0]">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">Gross Profit</span>
                <span className="font-semibold text-[#0F172A]">₹{(totalRev - totalExp).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-gray-100">
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-widest">Net Profit</span>
                <div className="text-[36px] font-bold text-[#10B981] leading-none mt-1 shadow-sm">₹{netProfit.toLocaleString('en-IN')}</div>
              </div>
              <div className="pt-2">
                 <Badge className="bg-green-100 text-green-700 border-none shadow-none font-bold px-3 py-1 text-[13px] rounded-[6px]">{finStats?.profitMargin || '0'}% Profit Margin</Badge>
              </div>
            </div>
          </div>
        </PearlCard>
      </section>

      {/* SECTION 3 - SALES vs TARGET CHART */}
      <section className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col">
          <SectionHeading title="Monthly Sales Performance" />
          <PearlCard className="flex-1 p-6 pt-8 pr-10">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={salesVsTargetData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="pctFill" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }} />
                
                <Area type="monotone" dataKey="pct" name="Achievement %" fill="url(#pctFill)" stroke="none" />
                <Bar dataKey="actual" name="Actual Sales" fill="#0066FF" radius={[4, 4, 0, 0]} barSize={28} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#F59E0B" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="Sales Breakdown" />
          <PearlCard className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest">This Month Achievement</p>
              <h2 className="text-[48px] font-extrabold text-[#10B981] leading-none mt-2">115%</h2>
            </div>
            
            <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center border-b border-[#E8ECF0] pb-3">
                <span className="text-slate-600 font-medium text-[15px]">Units Sold</span>
                <span className="font-bold text-[#0F172A] text-[15px]">{leadsStats?.converted || 0} <span className="text-slate-400 font-medium">units</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E8ECF0] pb-3">
                <span className="text-slate-600 font-medium text-[15px]">Total Revenue</span>
                <span className="font-bold text-[#0F172A] text-[15px]">{formatCr(totalRev)}</span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Overall Pipeline</p>
              <div className="w-full h-4 rounded-full flex overflow-hidden shadow-sm">
                <div className="h-full bg-[#3B82F6]" style={{ width: '40%' }} title="New 40%" />
                <div className="h-full bg-[#10B981]" style={{ width: '30%' }} title="Lost 30%" />
              </div>
              <div className="flex justify-between text-[11px] font-bold mt-2">
                <span className="text-[#3B82F6]">Total Leads: {leadsStats?.total || 0}</span>
                <span className="text-[#10B981]">Site Visits: {leadsStats?.siteVisit || 0}</span>
              </div>
            </div>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 4 - CONSTRUCTION COST BURN */}
      <section className="grid lg:grid-cols-11 gap-8">
        <div className="lg:col-span-6 flex flex-col">
           <SectionHeading title="Construction Spend vs Budget" />
           <PearlCard className="flex-1 p-6 pr-10">
             <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={constructionBurnData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                     </linearGradient>
                   </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }} />
                  
                  <Area type="monotone" dataKey="spent" name="Actual Spend" fill="url(#spendFill)" stroke="#D97706" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line type="stepAfter" dataKey="budget" name="Budget Limit" stroke="#0066FF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </AreaChart>
             </ResponsiveContainer>
           </PearlCard>
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <SectionHeading title="Cost Breakdown" />
          <PearlCard className="flex-1 p-6 flex flex-col">
             <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-3 flex items-center gap-3 mb-6">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="text-amber-800 text-sm font-semibold">⚠️ Based on allocated budgets</span>
             </div>

             <div className="flex items-center gap-6 flex-1">
                <div className="relative h-[180px] w-[180px] shrink-0">
                   <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart innerRadius="75%" outerRadius="100%" data={[{ value: projStats?.totalBudget ? (projStats.totalSpent / projStats.totalBudget) * 100 : 0, fill: '#F59E0B' }]} startAngle={90} endAngle={-270}>
                        <RadialBar background={{ fill: '#E8ECF0' }} dataKey="value" cornerRadius={20} />
                      </RadialBarChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-[#0F172A]">{projStats?.totalBudget ? Math.round((projStats.totalSpent / projStats.totalBudget) * 100) : 0}%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Burn Rate</span>
                   </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Budget</p>
                    <p className="text-lg font-bold text-[#0F172A]">₹{(projStats?.totalBudget || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Spent</p>
                    <p className="text-lg font-bold text-[#F59E0B]">₹{(projStats?.totalSpent || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Remaining</p>
                    <p className="text-lg font-bold text-[#10B981]">₹{((projStats?.totalBudget || 0) - (projStats?.totalSpent || 0)).toLocaleString('en-IN')}</p>
                  </div>
                </div>
             </div>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 5 - LEAD CONVERSION FUNNEL */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Lead Conversion Funnel" />
          <PearlCard className="flex-1 p-10 flex flex-col items-center justify-center bg-[#F8FAFC]">
            {funnelData.map((stage, i) => {
              const safePct = (leadsStats?.total||0) > 0 ? ((stage.count / leadsStats!.total) * 100).toFixed(1) : '0.0'
              return (
              <div key={i} className="flex items-center w-full mb-2 group">
                <div className="w-[100px] text-right pr-4 text-[11px] font-bold text-slate-400 uppercase">
                   {stage.drop && `-${stage.drop}`}
                </div>
                <div className="flex-1 flex justify-center">
                  <div 
                    className="h-10 flex items-center justify-between px-4 text-white font-bold text-sm rounded-[6px] shadow-sm transform transition-all group-hover:scale-[1.02]"
                    style={{
                      width: `${100 - (i * 12)}%`,
                      backgroundColor: stage.color,
                    }}
                  >
                    <span>{stage.stage}</span>
                    <span>{stage.count}</span>
                  </div>
                </div>
                <div className="w-[60px] pl-4 text-left font-bold text-[#0F172A] text-sm">
                  {stage.pct === '100%' ? '100%' : `${safePct}%`}
                </div>
              </div>
            )})}
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="System Brokers & Admins" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4">Broker</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Role</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Email</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {(brokers||[]).slice(0,5).map((s: any, i: number) => (
                   <TableRow key={i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-4">
                       <span className="font-bold text-[14px] text-[#0F172A]">{s.name}</span>
                     </TableCell>
                     <TableCell className="text-[13px] font-bold text-[#0066FF]">{s.role}</TableCell>
                     <TableCell className="text-[14px] font-medium text-slate-600">{s.email}</TableCell>
                   </TableRow>
                 ))}
                 {(!brokers || brokers.length === 0) && (
                   <TableRow><TableCell colSpan={3} className="text-center py-6 text-slate-500">No brokers found</TableCell></TableRow>
                 )}
               </TableBody>
             </Table>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 7 - PROJECT-WISE PROGRESS */}
      <section>
        <SectionHeading title="Project-wise Progress & Status" />
        <div className="grid md:grid-cols-2 gap-6">
          {(projectsDb || []).map((p: any, i: number) => (
            <InteractivePearlCard key={i} className="p-6">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-[20px] font-bold text-[#0F172A] leading-tight mb-2">{p.name}</h3>
                   <div className="flex items-center gap-2">
                     <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[6px] text-[10px] font-bold uppercase"><MapPin className="w-3 h-3 mr-1"/>{p.location}</Badge>
                     <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-700 rounded-[6px] text-[10px] font-bold uppercase">{p.type || 'Project'}</Badge>
                   </div>
                 </div>
                 <div className="text-right flex flex-col items-end">
                    <span className="text-[32px] font-extrabold text-[#0F172A] leading-none">{p.completion_percentage}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Complete</span>
                 </div>
               </div>
               
               <Progress value={p.completion_percentage} className={`h-2 mb-6 ${p.completion_percentage > 90 ? 'bg-emerald-100 [&>div]:bg-[#10B981]' : p.completion_percentage > 50 ? 'bg-blue-100 [&>div]:bg-[#0066FF]' : 'bg-orange-100 [&>div]:bg-[#F59E0B]'}`} />

               <div className="grid grid-cols-2 gap-4 mb-2">
                 <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Budget Total</span>
                    <span className="text-[15px] font-bold text-[#0F172A]">₹{(p.budget_total).toLocaleString('en-IN')}</span>
                 </div>
                 <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Budget Spent</span>
                    <span className="text-[15px] font-bold text-[#0F172A]">₹{(p.budget_spent).toLocaleString('en-IN')}</span>
                 </div>
               </div>
            </InteractivePearlCard>
          ))}
          {(!projectsDb || projectsDb.length === 0) && (
            <div className="col-span-2 text-center py-10 text-slate-500">No projects found</div>
          )}
        </div>
      </section>

      {/* SECTION 9 - CASH FLOW TIMELINE */}
      <section className="pb-10">
        <SectionHeading title="Cash Flow — Last 6 Months" />
        <PearlCard className="p-6">
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={cashFlowData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
               <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
               <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
               <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
               
               <Bar dataKey="in" name="Cash Inflows" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
               <Bar dataKey="out" name="Cash Outflows" fill="#EF4444" radius={[0, 0, 4, 4]} barSize={24} />
               <Line type="monotone" dataKey="cumulative" name="Net Position" stroke="#0066FF" strokeWidth={3} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </PearlCard>
      </section>

    </div>
  )
}
```

### `app/dashboard/components/dashboard-sidebar.tsx`
```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, TrendingUp, BarChart3, Wallet, Users, HardHat, Building2, Award, FileText, PieChart, Settings } from "lucide-react"
import Logo from "@/components/shared/Logo"

const menuGroups = [
  {
    label: "OVERVIEW",
    items: [
      { name: "Executive Summary", path: "/dashboard", icon: LayoutDashboard },
      { name: "P&L Statement", path: "/dashboard/pl", icon: TrendingUp },
      { name: "Revenue Forecast", path: "/dashboard/forecast", icon: BarChart3 },
      { name: "Cash Flow", path: "/dashboard/cashflow", icon: Wallet },
    ]
  },
  {
    label: "OPERATIONS",
    items: [
      { name: "Sales Performance", path: "/dashboard/sales", icon: Users },
      { name: "Construction Status", path: "/dashboard/construction", icon: HardHat },
      { name: "Project Progress", path: "/dashboard/projects", icon: Building2 },
      { name: "Team Performance", path: "/dashboard/team", icon: Award },
    ]
  },
  {
    label: "REPORTS",
    items: [
      { name: "Financial Reports", path: "/dashboard/reports", icon: FileText },
      { name: "Analytics", path: "/dashboard/analytics", icon: PieChart },
    ]
  }
]

export function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <div 
      className="flex flex-col text-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '260px',
        zIndex: 100,
        overflowY: 'auto',
        background: 'linear-gradient(180deg, #0A1628 0%, #0F2044 50%, #0A1628 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.25)'
      }}
    >
      <Logo />

      <div className="flex flex-1 flex-col overflow-y-auto px-0 py-4 custom-scrollbar">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-6">
            <h4 className="px-6 mb-2" style={{ color: 'rgba(148,163,184,0.7)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {group.label}
            </h4>
            <nav className="flex flex-col gap-0.5 pr-4 pl-2">
              {group.items.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname?.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center gap-3 py-2.5 pl-4 pr-3 text-sm font-medium transition-all duration-200 rounded-r-[10px]"
                    style={isActive ? {
                      background: 'rgba(99,102,241,0.25)', 
                      color: '#818CF8',
                      borderLeft: '3px solid #6366F1'
                    } : {
                      color: '#94A3B8',
                      borderLeft: '3px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.color = '#E2E8F0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#94A3B8';
                      }
                    }}
                  >
                    <item.icon className="h-5 w-5 shrink-0" style={{ color: isActive ? '#818CF8' : 'currentColor' }} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
      
      <div className="mt-auto p-5 flex items-center gap-3 bg-transparent" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] font-bold text-white shadow-sm ring-2 ring-white/10">
          {user?.firstName?.[0] || "U"}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm" style={{ color: 'white', fontWeight: 600 }}>
            {user?.firstName} {user?.lastName}
          </span>
          <div className="mt-0.5">
             <span 
              className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: 'rgba(245,158,11,0.2)',
                color: '#F59E0B',
                border: '1px solid rgba(245,158,11,0.3)'
              }}
            >
              {user?.role || "MANAGING DIRECTOR"}
            </span>
          </div>
        </div>
        <button className="ml-auto text-slate-400 hover:text-white transition-colors">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
```

### `app/dashboard/dashboard-nav.tsx`
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LineChart, Users, Key } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Financials", href: "/dashboard/financials", icon: LineChart },
  { name: "Leads", href: "/dashboard/leads-overview", icon: Users },
  { name: "Inventory", href: "/dashboard/inventory-overview", icon: Key },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-3 hide-scrollbar">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
              isActive 
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
            {item.name}
          </Link>
        )
      })}
    </nav>
  );
}
```

### `app/dashboard/financials/actions.ts`
```typescript
"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function logExpense(formData: FormData) {
  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;

  if (!category || !amount || !date) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase.from("expenses").insert({
    category,
    amount,
    description,
    date
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/financials");
  revalidatePath("/dashboard"); // Update KPI
  return { success: true };
}

export async function recordPayment(formData: FormData) {
  const leadId = formData.get("leadId") as string;
  const flatId = formData.get("flatId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string;
  
  // Implicitly mark new recorded payments as Received
  const status = formData.get("status") as string || "Received";

  if (!leadId || !flatId || !amount || !date) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase.from("payments").insert({
    lead_id: leadId,
    flat_id: flatId,
    amount,
    payment_date: date,
    status
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/financials");
  revalidatePath("/dashboard"); // Update Revenue KPI
  return { success: true };
}
```

### `app/dashboard/financials/financials-client.tsx`
```tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Receipt, IndianRupee } from "lucide-react";
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { logExpense, recordPayment } from "./actions";

type FinancialsClientProps = {
  expenses: any[];
  payments: any[];
  leads: { id: string; name: string }[];
  flats: { flat_id: string; project: string; flat_number: string }[];
  pieData: { name: string; value: number }[];
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

export default function FinancialsClient({ expenses, payments, leads, flats, pieData }: FinancialsClientProps) {
  const { toast } = useToast();
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Format currency
  const formatCur = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  async function handleLogExpense(formData: FormData) {
    setIsLoading(true);
    const result = await logExpense(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Expense logged successfully." });
      setIsExpenseOpen(false);
    }
  }

  async function handleRecordPayment(formData: FormData) {
    setIsLoading(true);
    const result = await recordPayment(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Payment recorded successfully." });
      setIsPaymentOpen(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financials</h1>
        <p className="text-slate-500 mt-1">Track company expenses and incoming payments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 border-slate-200">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>All-time expenses by category</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            {pieData.length === 0 ? (
              <div className="text-slate-500">No expense data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatCur(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <CardTitle className="text-lg flex items-center gap-2"><Receipt className="h-5 w-5 text-red-500" /> Recent Expenses</CardTitle>
                <CardDescription className="mt-1">Operational costs and outbound transactions</CardDescription>
              </div>
              <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 mt-4 sm:mt-0">
                    <Plus className="h-4 w-4 mr-1" /> Log Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log New Expense</DialogTitle>
                  </DialogHeader>
                  <form action={handleLogExpense} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select name="category" required defaultValue="Operations">
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Construction">Construction</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Salaries">Salaries</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Date</Label>
                        <Input type="date" name="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Amount (₹)</Label>
                      <Input type="number" name="amount" required min="1" placeholder="e.g. 50000" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Input name="description" placeholder="Brief details about the expense" />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Expense'}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="p-0 overflow-auto max-h-[250px] flex-1">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center h-20 text-slate-500">No expenses logged.</TableCell></TableRow>
                  ) : expenses.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="text-slate-500 text-sm">{format(new Date(e.date), "MMM d, yyyy")}</TableCell>
                      <TableCell><Badge variant="secondary" className="font-normal">{e.category}</Badge></TableCell>
                      <TableCell className="text-sm truncate max-w-[200px]" title={e.description}>{e.description || "-"}</TableCell>
                      <TableCell className="text-right font-medium text-red-600">-{formatCur(e.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <CardTitle className="text-lg flex items-center gap-2"><IndianRupee className="h-5 w-5 text-emerald-500" /> Incoming Payments</CardTitle>
            <CardDescription className="mt-1">Payments collected from leads for inventory.</CardDescription>
          </div>
          <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-1" /> Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment Received</DialogTitle>
              </DialogHeader>
              <form action={handleRecordPayment} className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label>Lead / Customer</Label>
                  <Select name="leadId" required>
                    <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                    <SelectContent className="max-h-56">
                      {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Purchased Flat</Label>
                  <Select name="flatId" required>
                    <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
                    <SelectContent className="max-h-56">
                      {flats.map(f => <SelectItem key={f.flat_id} value={f.flat_id}>{f.project} - {f.flat_number}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Amount Received (₹)</Label>
                    <Input type="number" name="amount" required min="1" placeholder="e.g. 500000" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment Date</Label>
                    <Input type="date" name="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Payment'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="p-0 overflow-auto max-h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24 text-slate-500">No payments recorded.</TableCell></TableRow>
              ) : payments.map(p => (
                <TableRow key={p.payment_id}>
                  <TableCell className="text-slate-500">{format(new Date(p.payment_date), "MMM d, yyyy")}</TableCell>
                  <TableCell className="font-medium">{p.leads_customers?.name || "Unknown"}</TableCell>
                  <TableCell className="text-slate-600">{p.flats_inventory ? `${p.flats_inventory.project}-${p.flats_inventory.flat_number}` : "-"}</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">+{formatCur(p.amount)}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={p.status === 'Received' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-yellow-100 text-yellow-800'}>
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
    </div>
  );
}
```

### `app/dashboard/financials/page.tsx`
```tsx
import { supabase } from "@/lib/supabase";
import FinancialsClient from "./financials-client";

export const dynamic = 'force-dynamic';

export default async function FinancialsPage() {
  const [
    { data: expenses },
    { data: payments },
    { data: leads },
    { data: flats }
  ] = await Promise.all([
    supabase.from("expenses").select("*").order("date", { ascending: false }),
    supabase
      .from("payments")
      .select(`
        *,
        leads_customers(name),
        flats_inventory(project, flat_number)
      `)
      .order("payment_date", { ascending: false }),
    supabase.from("leads_customers").select("id, name").order("name", { ascending: true }),
    supabase.from("flats_inventory").select("flat_id, project, flat_number").order("flat_number", { ascending: true })
  ]);

  // Aggregate expenses for PieChart
  const expenseCategories = ['Marketing', 'Construction', 'Operations', 'Salaries', 'Other'];
  const expenseBreakdown = expenseCategories.map(cat => ({ name: cat, value: 0 }));
  
  expenses?.forEach(exp => {
    const catObj = expenseBreakdown.find(c => c.name === exp.category);
    if (catObj) {
      catObj.value += Number(exp.amount);
    } else {
      // Fallback
      expenseBreakdown.find(c => c.name === 'Other')!.value += Number(exp.amount);
    }
  });

  // Filter out zero-value categories for cleaner chart
  const pieData = expenseBreakdown.filter(d => d.value > 0);

  return (
    <FinancialsClient 
      expenses={expenses || []}
      payments={payments || []}
      leads={leads || []}
      flats={flats || []}
      pieData={pieData}
    />
  );
}
```

### `app/dashboard/forecast/page.tsx`
```tsx
"use client"

import { useState } from "react"
import { Building2, TrendingUp, BarChart3, Target, CalendarDays, Wallet } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { 
  ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

// --- HELPERS ---
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// --- MOCK DATA ---
const getForecastData = (scenario: string) => {
  const baseData = [
    { month: "Apr 26", base: 110 },
    { month: "May 26", base: 115 },
    { month: "Jun 26", base: 95 },
    { month: "Jul 26", base: 125 },
    { month: "Aug 26", base: 118 },
    { month: "Sep 26", base: 135 },
    { month: "Oct 26", base: 145 },
    { month: "Nov 26", base: 155 },
    { month: "Dec 26", base: 175 },
    { month: "Jan 27", base: 160 },
    { month: "Feb 27", base: 150 },
    { month: "Mar 27", base: 190 },
  ];

  return baseData.map(d => ({
    ...d,
    conservative: Math.round(d.base * 0.85),
    optimistic: Math.round(d.base * 1.25),
  }));
};

const projectForecast = [
  { project: "Analyzehive Heights Tower A", currentRev: "₹45Cr", remRev: "₹15Cr", unitsLeft: 15, expectedCompletion: "Dec 2026", status: "On Track" },
  { project: "Analyzehive Heights Tower B", currentRev: "₹28Cr", remRev: "₹32Cr", unitsLeft: 32, expectedCompletion: "Jun 2027", status: "At Risk" },
  { project: "Analyzehive Villas Phase 1", currentRev: "₹85Cr", remRev: "₹10Cr", unitsLeft: 2, expectedCompletion: "Apr 2026", status: "Ahead" },
  { project: "Analyzehive Commercial Hub", currentRev: "₹25Cr", remRev: "₹175Cr", unitsLeft: 32, expectedCompletion: "Sep 2028", status: "On Track" },
];

const absorptionData = [
  { category: "2 BHK Premium", total: 100, sold: 65, avail: 35, pipeline: 12 },
  { category: "3 BHK Luxury", total: 60, sold: 42, avail: 18, pipeline: 8 },
  { category: "4 BHK Penthouses", total: 10, sold: 4, avail: 6, pipeline: 2 },
  { category: "Commercial Shops", total: 40, sold: 8, avail: 32, pipeline: 15 },
  { category: "Luxury Villas", total: 20, sold: 18, avail: 2, pipeline: 5 },
];

const revenueRecognition = [
  { event: "Tower A Plinth Completion", date: "Apr 15, 2026", type: "Milestone", amount: "₹4.5Cr", prob: "100%" },
  { event: "Villas Handover (Final Tranche)", date: "May 10, 2026", type: "Handover", amount: "₹8.2Cr", prob: "95%" },
  { event: "Tower B Foundation Completion", date: "Jun 20, 2026", type: "Milestone", amount: "₹6.0Cr", prob: "80%" },
  { event: "Commercial Hub Booking Amount", date: "Jul 05, 2026", type: "Sales", amount: "₹12.5Cr", prob: "70%" },
];


export default function ForecastPage() {
  const [scenario, setScenario] = useState("Base");
  const chartData = getForecastData(scenario);

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8ECF0] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Revenue Forecast</h1>
          <p className="text-slate-500 font-medium mt-1">12-month consolidated modeling and unit absorption.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-[12px] border border-[#E8ECF0]">
          {['Conservative', 'Base', 'Optimistic'].map(s => (
            <button
              key={s}
              onClick={() => setScenario(s)}
              className={`px-5 py-2.5 rounded-[8px] text-[13px] font-bold transition-all ${
                scenario === s 
                  ? s === 'Optimistic' ? 'bg-[#10B981] text-white shadow-md' :
                    s === 'Conservative' ? 'bg-[#F59E0B] text-white shadow-md' :
                    'bg-[#0066FF] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <InteractivePearlCard className="p-5 lg:col-span-2 relative">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-[10px] bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">FY26 Projected Revenue</p>
          <h3 className="text-[28px] font-bold text-[#0F172A]">
            {scenario === 'Conservative' ? '₹140.4Cr' : scenario === 'Optimistic' ? '₹206.5Cr' : '₹165.2Cr'}
          </h3>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-5 lg:col-span-2 relative">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-[10px] bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Unsold Inventory Val</p>
          <h3 className="text-[28px] font-bold text-[#0F172A]">₹232.0Cr</h3>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-5 lg:col-span-2 relative">
          <div className="flex items-start justify-between">
            <div className="h-10 w-10 rounded-[10px] bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Upcoming Collections (Q1)</p>
          <h3 className="text-[28px] font-bold text-[#0F172A]">₹18.7Cr</h3>
        </InteractivePearlCard>
      </section>

      {/* SECTION 2: FORECAST CHART */}
      <section>
        <SectionHeading title="Scenario Modeling (Consolidated)" />
        <PearlCard className="p-6 pt-10">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                 <linearGradient id="baseFill" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2}/>
                   <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                 </linearGradient>
               </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B', fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
              <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
              
              <Area type="monotone" dataKey="base" name="Base Scenario" fill="url(#baseFill)" stroke="#0066FF" strokeWidth={3} />
              {(scenario === 'Conservative' || scenario === 'Base') && <Line type="monotone" dataKey="conservative" name="Conservative" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />}
              {(scenario === 'Optimistic' || scenario === 'Base') && <Line type="monotone" dataKey="optimistic" name="Optimistic" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />}
            </ComposedChart>
          </ResponsiveContainer>
        </PearlCard>
      </section>

      {/* SECTION 3 & 4: TABLES */}
      <section className="grid lg:grid-cols-2 gap-8">
        
        <div className="flex flex-col">
          <SectionHeading title="Project-wise Pipeline" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6">Project</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Rem. Revenue</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Units Left</TableHead>
                   <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Status</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {projectForecast.map((p, i) => (
                   <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-4 pl-6 font-semibold text-[#0F172A]">{p.project}</TableCell>
                     <TableCell className="font-bold text-[#0F172A]">{p.remRev}</TableCell>
                     <TableCell className="font-medium text-slate-500">{p.unitsLeft}</TableCell>
                     <TableCell>
                       <Badge variant="outline" className={`px-2 py-0.5 border-none shadow-none font-bold ${
                         p.status === 'On Track' ? 'bg-blue-100 text-blue-700' :
                         p.status === 'Ahead' ? 'bg-emerald-100 text-emerald-700' :
                         'bg-amber-100 text-amber-700'
                       }`}>
                         {p.status}
                       </Badge>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="Unit Absorption Analysis" />
          <PearlCard className="flex-1 p-6">
            <div className="space-y-6">
              {absorptionData.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-[#0F172A] text-[14px]">{d.category}</span>
                    <span className="text-[12px] font-bold text-slate-400">
                      Sold: <span className="text-[#10B981]">{d.sold}</span> / Avail: <span className="text-[#F59E0B]">{d.avail}</span>
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full flex overflow-hidden bg-slate-100">
                    <div className="h-full bg-[#10B981]" style={{ width: `${(d.sold / d.total)*100}%` }} title={`Sold ${d.sold}`} />
                    <div className="h-full bg-[#0066FF] opacity-60" style={{ width: `${(d.pipeline / d.total)*100}%` }} title={`Pipeline ${d.pipeline}`} />
                    <div className="h-full bg-[#F59E0B]" style={{ width: `${((d.avail - d.pipeline) / d.total)*100}%` }} title={`Available ${d.avail - d.pipeline}`} />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-6 pt-4 border-t border-[#E8ECF0]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#10B981]"/> Sold</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#0066FF] opacity-60"/> Active Pipeline</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#F59E0B]"/> Available</div>
              </div>
            </div>
          </PearlCard>
        </div>

      </section>

      {/* SECTION 5: REVENUE RECOGNITION */}
      <section>
        <SectionHeading title="Revenue Recognition Schedule" />
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6">Expected Event</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Type</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Amount</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Date</TableHead>
                <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Probability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueRecognition.map((r, i) => (
                <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                  <TableCell className="py-4 pl-6 font-semibold text-[#0F172A]">{r.event}</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="bg-slate-100 text-slate-600 rounded-[6px] shadow-none border-[#E8ECF0]">{r.type}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-[#10B981] text-[15px]">{r.amount}</TableCell>
                  <TableCell className="font-medium text-slate-600 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-slate-400"/> {r.date}</TableCell>
                  <TableCell className="font-bold text-[#0F172A]">{r.prob}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

    </div>
  )
}
```

### `app/dashboard/inventory-overview/inventory-client.tsx`
```tsx
"use client";

import { Home, Key, Lock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Flat = {
  flat_id: string;
  project: string;
  flat_number: string;
  type: string;
  floor: number;
  area_sqft: number;
  price: number;
  status: string;
  updated_at: string;
};

export default function InventoryClient({ flats }: { flats: Flat[] }) {
  
  const totalFlats = flats.length;
  const available = flats.filter(f => f.status === 'Available').length;
  const onHold = flats.filter(f => f.status === 'On Hold').length;
  const sold = flats.filter(f => f.status === 'Sold').length;

  const formatCur = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Available': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Available</Badge>;
      case 'On Hold': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">On Hold</Badge>;
      case 'Sold': return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">Sold</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Overview</h1>
        <p className="text-slate-500 mt-1">Track the status and availability of all project units.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Flats</CardTitle>
            <Home className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalFlats}</div>
            <p className="text-xs text-slate-400 mt-1">Across all projects</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Available</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{available}</div>
            <p className="text-xs text-slate-400 mt-1">Ready to sell</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">On Hold</CardTitle>
            <Lock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{onHold}</div>
            <p className="text-xs text-slate-400 mt-1">Pending finalize</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Sold</CardTitle>
            <Key className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{sold}</div>
            <p className="text-xs text-slate-400 mt-1">Successfully closed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 overflow-hidden mt-6">
        <div className="p-0 overflow-auto max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm">
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Flat Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Floor</TableHead>
                <TableHead className="text-right">Area (sqft)</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flats.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center h-24 text-slate-500">No inventory found.</TableCell></TableRow>
              ) : flats.map(f => (
                <TableRow key={f.flat_id}>
                  <TableCell className="font-semibold">{f.project}</TableCell>
                  <TableCell>{f.flat_number}</TableCell>
                  <TableCell><Badge variant="outline" className="font-normal">{f.type}</Badge></TableCell>
                  <TableCell className="text-center">{f.floor || '-'}</TableCell>
                  <TableCell className="text-right font-medium">{f.area_sqft || '-'}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-700">{f.price ? formatCur(f.price) : '-'}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(f.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
```

### `app/dashboard/inventory-overview/page.tsx`
```tsx
import { supabase } from "@/lib/supabase";
import InventoryClient from "./inventory-client";

export const dynamic = 'force-dynamic';

export default async function InventoryOverviewPage() {
  const { data: flats, error } = await supabase
    .from("flats_inventory")
    .select("*")
    .order("project")
    .order("flat_number");

  if (error) console.error("Error fetching flats:", error);

  return <InventoryClient flats={flats || []} />;
}
```

### `app/dashboard/layout.tsx`
```tsx
import { ReactNode } from "react"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { Bell, Search, HelpCircle, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = { firstName: "CEO", lastName: "Admin", role: "MANAGING DIRECTOR" }

  return (
    <div 
      className="flex font-sans text-[#0F172A] min-h-screen" 
      style={{ background: '#FAFBFC' }}
    >
      <DashboardSidebar user={user} />
      
      <div className="flex-1 flex flex-col pl-[260px] relative">
        <header 
          className="flex shrink-0 flex-col px-6"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 90,
            background: 'rgba(255,255,255,0.95)',
            borderBottom: '1px solid #E8ECF0',
            boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
            height: '110px'
          }}
        >
          <div className="flex items-center justify-between h-[64px] border-b border-[#E8ECF0]">
            {/* Breadcrumb Left */}
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 hidden md:flex">
              <span>Home</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span>Executive</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 font-bold">Dashboard</span>
            </div>

            {/* Global Search Center */}
            <div className="flex-1 max-w-md mx-6">
              <div className="relative group">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-[#0066FF] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search projects, reports, metrics..." 
                  className="w-full h-9 bg-gray-100/80 border-transparent rounded-full pl-9 pr-4 text-sm focus:border-[#0066FF] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 gap-2 hidden sm:flex h-9">
                <Download className="h-4 w-4" />
                <span className="tracking-wide">Export Report</span>
              </Button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
              
              <button className="relative text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 flex h-[14px] min-w-[14px] px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                  3
                </span>
              </button>
              <button className="text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 hidden sm:flex">
                <HelpCircle className="h-5 w-5" />
              </button>
              
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] text-white font-bold shadow-sm ml-1 ring-2 ring-white cursor-pointer hover:ring-blue-100 transition-all">
                {user.firstName[0]}
              </div>
            </div>
          </div>
          <div className="flex items-center h-[45px] gap-6">
             <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-300 h-full transition-colors flex items-center pt-0.5">This Week</button>
             <button className="text-[13px] font-semibold text-[#0066FF] border-b-2 border-[#0066FF] h-full transition-colors flex items-center pt-0.5">This Month</button>
             <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-300 h-full transition-colors flex items-center pt-0.5">This Quarter</button>
             <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-300 h-full transition-colors flex items-center pt-0.5">This Year</button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### `app/dashboard/leads-overview/leads-client.tsx`
```tsx
"use client";

import { Download } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: string;
  status: string;
  created_at: string;
};

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ["ID,Name,Phone,Email,Source,Status,Created At"];
    const rows = leads.map(l => 
      `"${l.id}","${l.name}","${l.phone}","${l.email || ''}","${l.source}","${l.status}","${l.created_at}"`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analyzehive_leads_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'New': return <Badge variant="outline" className="bg-blue-50 text-blue-700">New</Badge>;
      case 'Contacted': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Contacted</Badge>;
      case 'Site Visit Scheduled': return <Badge variant="outline" className="bg-orange-50 text-orange-700">Site Visit</Badge>;
      case 'Negotiation': return <Badge variant="outline" className="bg-purple-50 text-purple-700">Negotiation</Badge>;
      case 'Converted': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Converted</Badge>;
      case 'Lost': return <Badge variant="outline" className="bg-slate-50 text-slate-700">Lost</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leads Directory</h1>
          <p className="text-slate-500 mt-1">Read-only comprehensive view of all prospects and customers.</p>
        </div>
        
        <Button onClick={handleExportCSV} variant="outline" className="bg-white">
          <Download className="h-4 w-4 mr-2" /> Export to CSV
        </Button>
      </div>

      <Card className="border-slate-200">
        <div className="p-0 overflow-auto max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm border-b">
              <TableRow>
                <TableHead>Date Added</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24 text-slate-500">No leads found.</TableCell></TableRow>
              ) : leads.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="text-slate-500">{format(new Date(l.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="font-semibold">{l.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{l.phone}</span>
                      <span className="text-xs text-slate-400">{l.email}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="font-normal">{l.source}</Badge></TableCell>
                  <TableCell>{getStatusBadge(l.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
```

### `app/dashboard/leads-overview/page.tsx`
```tsx
import { supabase } from "@/lib/supabase";
import LeadsClient from "./leads-client";

export const dynamic = 'force-dynamic';

export default async function LeadsOverviewPage() {
  const { data: leads, error } = await supabase
    .from("leads_customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching leads:", error);

  return <LeadsClient leads={leads || []} />;
}
```

### `app/dashboard/overview-client.tsx`
```tsx
"use client";

import { Users, TrendingUp, IndianRupee, FileMinus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

type OverviewProps = {
  totalLeads: number;
  convertedLeads: number;
  totalRevenue: number;
  totalExpenses: number;
  funnelData: { name: string; count: number }[];
  financialData: { monthKey: string; name: string; revenue: number; expenses: number }[];
};

export default function OverviewClient({
  totalLeads,
  convertedLeads,
  totalRevenue,
  totalExpenses,
  funnelData,
  financialData
}: OverviewProps) {
  
  // Format currency dynamically
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Overview</h1>
        <p className="text-slate-500 mt-1">High-level summary of your real estate operations and financials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalLeads}</div>
            <p className="text-xs text-slate-400 mt-1">All time pipeline</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Converted Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{convertedLeads}</div>
            <p className="text-xs text-slate-400 mt-1">
              {totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0}% conversion rate
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-slate-400 mt-1">Received payments</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Expenses</CardTitle>
            <FileMinus className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-slate-400 mt-1">All recorded costs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Lead Funnel</CardTitle>
            <CardDescription>Distribution of leads across sales stages</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Financial performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financialData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : value >= 1000 ? `₹${(value / 1000).toFixed(1)}k` : `₹${value}`} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), undefined]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### `app/dashboard/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import {
  getFinancialStats,
  getLeadsStats,
  getFlatsStats,
  getProjectsStats,
  getProjects,
  getBrokers
} from '@/lib/data';

import DashboardClient from './client';

export default async function DashboardPage() {
  const [
    finStats,
    leadsStats,
    flatsStats,
    projStats,
    projectsDb,
    brokers
  ] = await Promise.all([
    getFinancialStats(),
    getLeadsStats(),
    getFlatsStats(),
    getProjectsStats(),
    getProjects(),
    getBrokers()
  ]);

  return <DashboardClient 
    finStats={finStats} 
    leadsStats={leadsStats} 
    flatsStats={flatsStats} 
    projStats={projStats} 
    projectsDb={projectsDb} 
    brokers={brokers} 
  />
}
```

### `app/dashboard/pl/client.tsx`
```tsx
"use client"

import { Download, TrendingUp, TrendingDown, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { 
  ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"

// --- HELPERS ---
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

// --- CATEGORY MATCHING FOR PL ---
const revenueCategories = ['Flat Sales', 'Advance Bookings', 'Rental Income', 'Other Income'];
const cogsCategories = ['Construction Materials', 'Labour Costs', 'Equipment Costs', 'Subcontractor Costs', 'Construction'];
const opexCategories = ['Marketing', 'Staff Salaries', 'Admin & Office', 'Legal & Prof.', 'Equipment'];

export default function ProfitLossClient({ ledger }: { ledger: any[] }) {

  // Process ledger data into P&L structure
  const breakdown: any = {
    revenue: {},
    cogs: {},
    opex: {},
    belowLign: { Depreciation: 450000, Interest: 250000 } // keep mock for these 
  };
  
  let totalRevenue = 0;
  let totalCogs = 0;
  let totalOpex = 0;

  ledger?.forEach((t: any) => {
    if (t.status !== 'Approved') return;
    
    if (t.transaction_type === 'Income') {
       breakdown.revenue[t.category] = (breakdown.revenue[t.category] || 0) + t.amount;
       totalRevenue += t.amount;
    } else {
       if (cogsCategories.includes(t.category) || t.category === 'Materials' || t.category === 'Labour') {
         breakdown.cogs[t.category] = (breakdown.cogs[t.category] || 0) + t.amount;
         totalCogs += t.amount;
       } else {
         breakdown.opex[t.category] = (breakdown.opex[t.category] || 0) + t.amount;
         totalOpex += t.amount;
       }
    }
  });

  const grossProfit = totalRevenue - totalCogs;
  const ebitda = grossProfit - totalOpex;
  const taxProv = ebitda > 0 ? ebitda * 0.18 : 0;
  const netProfit = ebitda - taxProv - breakdown.belowLign.Depreciation - breakdown.belowLign.Interest;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  // Pie chart data
  const expenseBreakdownData = Object.entries(breakdown.opex).map(([name, value], i) => ({
    name,
    value: Math.round((value as number) / 100000), // In Lakhs
    fill: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5]
  }));

  // Fallbacks if db empty
  const plTrendData = [
    { month: "Apr 25", revenue: 6.2, cogs: 2.8, gp: 3.4 },
    { month: "May", revenue: 5.8, cogs: 2.6, gp: 3.2 },
    { month: "Jun", revenue: 7.1, cogs: 3.1, gp: 4.0 },
  ];

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Profit & Loss Statement</h1>
          <p className="text-slate-500 font-medium mt-1">Detailed financial performance across all projects.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-[12px] border border-[#E8ECF0] shadow-sm">
          {['This Month', 'This Quarter', 'This Year', 'Custom'].map(p => (
            <button
              key={p}
              className={`px-4 py-2 rounded-[8px] text-[13px] font-semibold transition-all ${
                p === 'This Year' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <Button variant="ghost" className="text-[#0066FF] hover:bg-blue-50 font-semibold text-[13px] rounded-[8px] h-[36px] px-3 gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* SECTION 1: FULL P&L TABLE */}
      <section>
        <PearlCard className="p-0 overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <tbody>
              {/* REVENUE HEADER */}
              <tr className="bg-green-50/50 border-b border-green-100">
                <td colSpan={2} className="px-6 py-4 font-bold text-green-700 tracking-widest uppercase text-xs">Revenue</td>
              </tr>
              {Object.entries(breakdown.revenue).map(([cat, val], i) => (
                <tr key={i} className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                  <td className="px-6 py-3 font-medium text-slate-600 pl-10">{cat}</td>
                  <td className="px-6 py-3 font-semibold text-right">{formatCurrency(val as number)}</td>
                </tr>
              ))}
              {Object.keys(breakdown.revenue).length === 0 && (
                <tr className="border-b border-[#E8ECF0]"><td colSpan={2} className="px-6 py-3 text-slate-500 text-center">No revenue recorded</td></tr>
              )}
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <td className="px-6 py-4 font-bold text-[#0F172A] text-[15px]">Total Revenue</td>
                <td className="px-6 py-4 font-bold text-[#10B981] text-[16px] text-right">{formatCurrency(totalRevenue)}</td>
              </tr>

              {/* COGS HEADER */}
              <tr className="bg-amber-50/50 border-b border-amber-100">
                <td colSpan={2} className="px-6 py-4 font-bold text-amber-700 tracking-widest uppercase text-xs">Cost of Goods Sold (COGS)</td>
              </tr>
              {Object.entries(breakdown.cogs).map(([cat, val], i) => (
                <tr key={i} className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                  <td className="px-6 py-3 font-medium text-slate-600 pl-10">{cat}</td>
                  <td className="px-6 py-3 font-semibold text-right">{formatCurrency(val as number)}</td>
                </tr>
              ))}
              {Object.keys(breakdown.cogs).length === 0 && (
                <tr className="border-b border-[#E8ECF0]"><td colSpan={2} className="px-6 py-3 text-slate-500 text-center">No COGS recorded</td></tr>
              )}
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <td className="px-6 py-4 font-bold text-[#0F172A] text-[15px]">Total COGS</td>
                <td className="px-6 py-4 font-bold text-[#F59E0B] text-[16px] text-right">{formatCurrency(totalCogs)}</td>
              </tr>

              {/* GROSS PROFIT HIGHLIGHT */}
              <tr className="bg-emerald-50 border-y-2 border-emerald-200">
                <td className="px-6 py-5 font-bold text-emerald-900 text-[16px] uppercase tracking-wide">Gross Profit</td>
                <td className="px-6 py-5 font-bold text-emerald-700 text-[20px] text-right">{formatCurrency(grossProfit)}</td>
              </tr>

              {/* OPEX HEADER */}
              <tr className="bg-red-50/50 border-b border-red-100">
                <td colSpan={2} className="px-6 py-4 font-bold text-red-700 tracking-widest uppercase text-xs">Operating Expenses (OpEx)</td>
              </tr>
              {Object.entries(breakdown.opex).map(([cat, val], i) => (
                <tr key={i} className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                  <td className="px-6 py-3 font-medium text-slate-600 pl-10">{cat}</td>
                  <td className="px-6 py-3 font-semibold text-right">{formatCurrency(val as number)}</td>
                </tr>
              ))}
              {Object.keys(breakdown.opex).length === 0 && (
                <tr className="border-b border-[#E8ECF0]"><td colSpan={2} className="px-6 py-3 text-slate-500 text-center">No OpEx recorded</td></tr>
              )}
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <td className="px-6 py-4 font-bold text-[#0F172A] text-[15px]">Total OpEx</td>
                <td className="px-6 py-4 font-bold text-[#EF4444] text-[16px] text-right">{formatCurrency(totalOpex)}</td>
              </tr>

              {/* EBITDA HIGHLIGHT */}
              <tr className="bg-indigo-50 border-y-2 border-indigo-200">
                <td className="px-6 py-5 font-bold text-indigo-900 text-[16px] uppercase tracking-wide">EBITDA</td>
                <td className="px-6 py-5 font-bold text-[#0066FF] text-[20px] text-right">{formatCurrency(ebitda)}</td>
              </tr>

              {/* BELOW THE LINE */}
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <td colSpan={2} className="px-6 py-4 font-bold text-slate-600 tracking-widest uppercase text-xs">Below The Line</td>
              </tr>
              <tr className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                <td className="px-6 py-3 font-medium text-slate-600 pl-10">Depreciation (Est)</td>
                <td className="px-6 py-3 font-semibold text-right">{formatCurrency(breakdown.belowLign.Depreciation)}</td>
              </tr>
              <tr className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                <td className="px-6 py-3 font-medium text-slate-600 pl-10">Interest Expense (Est)</td>
                <td className="px-6 py-3 font-semibold text-right">{formatCurrency(breakdown.belowLign.Interest)}</td>
              </tr>
              <tr className="border-b border-[#E8ECF0] hover:bg-slate-50/50">
                <td className="px-6 py-3 font-medium text-slate-600 pl-10">Tax Provision (18%)</td>
                <td className="px-6 py-3 font-semibold text-right">{formatCurrency(taxProv)}</td>
              </tr>
              
              {/* NET PROFIT HIGHLIGHT ROW */}
              <tr className="bg-[#10B981] text-white">
                <td className="px-6 py-6 font-black text-[22px] uppercase tracking-wider flex items-center gap-4">
                  Net Profit
                  <Badge className="bg-white/20 text-white border-white/30 text-[13px] hover:bg-white/30 px-3">{profitMargin}% Margin</Badge>
                </td>
                <td className="px-6 py-6 font-black text-[28px] text-right">{formatCurrency(netProfit)}</td>
              </tr>
            </tbody>
          </table>
        </PearlCard>
      </section>

      {/* SECTION 2: CHARTS */}
      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="12-Month P&L Trend" />
          <PearlCard className="flex-1 p-6 pr-10">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={plTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `₹${val}Cr`} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}Cr`} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
                
                <Bar dataKey="revenue" name="Total Revenue" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="cogs" name="COGS" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} />
                <Line type="monotone" dataKey="gp" name="Gross Profit" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="OpEx Breakdown (Lakhs)" />
          <PearlCard className="flex-1 p-6 flex flex-col items-center justify-center">
            {expenseBreakdownData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {expenseBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}L`} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="w-full mt-4 space-y-2 max-h-[100px] overflow-auto">
                  {expenseBreakdownData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="font-medium text-slate-600">{item.name}</span>
                      </div>
                      <span className="font-bold text-[#0F172A]">₹{item.value}L</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
               <div className="flex h-full items-center justify-center text-slate-500 text-sm">No expenses to breakdown</div>
            )}
          </PearlCard>
        </div>
      </section>

    </div>
  )
}
```

### `app/dashboard/pl/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import { getFinancialLedger } from '@/lib/data';
import ProfitLossClient from './client';

export default async function ProfitLossPage() {
  const ledger = await getFinancialLedger();

  return <ProfitLossClient ledger={ledger || []} />
}
```

### `app/dashboard/projects/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import { Building2, Home, Building, Factory, PlusCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { getProjects } from "@/lib/data"

// --- HELPERS ---
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#CBD5E1] transition-all duration-200 ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// --- MOCK DATA FALLBACKS ---
const milestones = [
  { project: "Tower A", milestone: "10th Floor Slab Cast", target: "Mar 15, 2026", actual: "Mar 12, 2026", status: "Completed" },
  { project: "Tower B", milestone: "Foundation Completion", target: "Mar 25, 2026", actual: "-", status: "Delayed" },
  { project: "Villas Ph 1", milestone: "Handover Phase 1", target: "Apr 10, 2026", actual: "-", status: "On Track" },
  { project: "Commercial Hub", milestone: "Excavation Finish", target: "May 05, 2026", actual: "-", status: "On Track" },
];

const formatCr = (val: number) => `₹${(val / 10000000).toFixed(1)}Cr`;

export default async function ProjectProgressPage() {
  const projectsData = await getProjects();
  
  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Project Progress</h1>
          <p className="text-slate-500 font-medium mt-1">Status, timelines, and budgets across all developments.</p>
        </div>
      </div>

      {/* SECTION 1: 4 STATUS CARDS */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(projectsData || []).map((p: any, i: number) => {
          const type = p.type || 'Residential';
          const isRes = type === 'Residential';
          const isLux = type === 'Luxury';
          const icon = isRes ? <Building2 className="w-5 h-5"/> : isLux ? <Home className="w-5 h-5"/> : <Factory className="w-5 h-5"/>;
          const status = p.status || 'On Track';

          return (
          <InteractivePearlCard key={i} className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
               <div className={`h-10 w-10 rounded-[10px] flex items-center justify-center ${
                 isRes ? 'bg-blue-100 text-blue-600' :
                 isLux ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
               }`}>
                 {icon}
               </div>
               <Badge className={`border-none shadow-sm text-[10px] uppercase font-bold tracking-widest ${
                 status === 'Active' || status === 'On Track' ? 'bg-blue-50 text-blue-700' :
                 status === 'Completed' || status === 'Ahead' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
               }`}>
                 {status}
               </Badge>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] leading-tight mb-1">{p.name || `Project ${i+1}`}</h3>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest leading-loose">
                {p.completion_percentage || 0}% Completed
              </p>
            </div>
            <Progress value={p.completion_percentage || 0} className={`h-1.5 mt-4 ${
              (p.completion_percentage||0) > 80 ? 'bg-emerald-100 [&>div]:bg-[#10B981]' : 
              (p.completion_percentage||0) > 40 ? 'bg-blue-100 [&>div]:bg-[#0066FF]' : 'bg-orange-100 [&>div]:bg-[#F59E0B]'
            }`} />
          </InteractivePearlCard>
        )})}
        {(!projectsData || projectsData.length === 0) && <div className="col-span-4 py-8 text-center text-slate-500">No active projects found in database.</div>}
      </section>

      {/* SECTION 2: GANTT CHART */}
      <section>
        <SectionHeading title="Master Construction Timeline" />
        <PearlCard className="p-6 overflow-x-auto">
           {/* Simple static HTML/CSS Gantt layout for demonstration */}
           <div className="min-w-[800px] relative border border-[#E8ECF0] rounded-[10px] bg-[#FAFBFC]">
              {/* Header Row */}
              <div className="flex border-b border-[#E8ECF0] bg-[#F1F5F9] rounded-t-[10px] text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                 <div className="w-[180px] shrink-0 border-r border-[#E8ECF0] p-3 text-[#0F172A]">Project</div>
                 <div className="flex-1 grid grid-cols-12 divide-x divide-white/60">
                    <div className="col-span-3 p-3 flex justify-center">2024 (H2)</div>
                    <div className="col-span-4 p-3 flex justify-center">2025</div>
                    <div className="col-span-3 p-3 flex justify-center">2026</div>
                    <div className="col-span-2 p-3 flex justify-center">2027+</div>
                 </div>
              </div>

              {/* Current Date Marker */}
              <div className="absolute top-[44px] bottom-0 left-[260px] md:left-[42%] w-px bg-red-400 z-10 hidden sm:block">
                 <div className="absolute top-0 -translate-x-1/2 -translate-y-[28px] bg-red-100 border border-red-300 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                   Today ({new Date().toLocaleDateString('en-US', {month: 'short', year: '2-digit'})})
                 </div>
              </div>

              {/* Rows */}
              {(projectsData || []).map((p: any, i: number) => (
                <div key={i} className="flex border-b border-[#E8ECF0]/60 hover:bg-white transition-colors relative">
                  <div className="w-[180px] shrink-0 border-r border-[#E8ECF0] p-3 font-semibold text-[13px] text-[#0F172A] flex items-center">{p.name || `Project ${i+1}`}</div>
                  <div className="flex-1 relative h-12">
                     <div className="absolute top-2.5 bottom-2.5 bg-blue-100 border border-blue-300 rounded-[6px] overflow-hidden group" style={{ left: `${(i * 10) % 30}%`, right: `${Math.max(10, 40 - (i * 15))}%` }}>
                        <div className="h-full bg-blue-500/90" style={{ width: `${p.completion_percentage || 0}%`}}></div>
                        <div className="absolute inset-0 flex items-center px-3 text-[11px] font-bold text-blue-900 justify-between">
                           <span>Start</span> <span>Est. End</span>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
           </div>
        </PearlCard>
      </section>

      {/* SECTION 3 & 4: TABLES */}
      <section className="grid xl:grid-cols-2 gap-8">
        
        {/* MILESTONES (MOCK FALLBACK) */}
        <div className="flex flex-col">
          <SectionHeading title="Milestone Tracker" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase py-3 pl-4">Project / Milestone</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase">Target Date</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase">Status</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {milestones.map((m, i) => (
                   <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-3 pl-4">
                       <p className="font-bold text-[#0F172A] text-[13px]">{m.milestone}</p>
                       <p className="text-[11px] font-semibold text-slate-500">{m.project}</p>
                     </TableCell>
                     <TableCell className="text-[13px] font-medium text-slate-600">{m.target}</TableCell>
                     <TableCell>
                       <Badge variant="outline" className={`border-none shadow-none font-bold px-2 py-0.5 ${
                         m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                         m.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                       }`}>
                         {m.status}
                       </Badge>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="flex flex-col">
          <SectionHeading title="Project Financial Summary" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase py-3 pl-4">Project</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">Budget</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">Spent</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">Remaining</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {(projectsData || []).map((f: any, i: number) => (
                   <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-3 pl-4 font-bold text-[#0F172A] text-[13px]">{f.name}</TableCell>
                     <TableCell className="text-right text-[13px] font-semibold text-slate-700">{formatCr(f.budget_total || 0)}</TableCell>
                     <TableCell className="text-right text-[13px] font-bold text-[#0F172A]">{formatCr(f.budget_spent || 0)}</TableCell>
                     <TableCell className="text-right">
                       <Badge variant="outline" className={`border-none shadow-none font-bold px-2 py-0.5 ${
                         (f.budget_total||0) - (f.budget_spent||0) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {formatCr((f.budget_total||0) - (f.budget_spent||0))}
                       </Badge>
                     </TableCell>
                   </TableRow>
                 ))}
                 {(!projectsData || projectsData.length === 0) && <TableRow><TableCell colSpan={4} className="text-center py-4 text-slate-500">No project financials to display.</TableCell></TableRow>}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

      </section>

    </div>
  )
}
```

### `app/dashboard/reports/page.tsx`
```tsx
"use client"

import { useState } from "react"
import { FileText, Download, Eye, Calendar, Mail, CheckCircle2, FileBarChart, Filter } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// --- HELPERS ---
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// --- MOCK DATA ---
const categories = ["All", "P&L", "Balance Sheet", "Cash Flow", "Sales", "Construction", "Custom"];

const reports = [
  { name: "Monthly P&L - March 2026", type: "P&L", period: "Mar 2026", date: "Mar 18, 2026", size: "2.4 MB" },
  { name: "Quarterly Sales Report Q1", type: "Sales", period: "Q1 2026", date: "Mar 15, 2026", size: "5.1 MB" },
  { name: "Construction Cost Report", type: "Construction", period: "Mar 2026", date: "Mar 14, 2026", size: "1.8 MB" },
  { name: "Cash Flow Statement - Q1", type: "Cash Flow", period: "Q1 2026", date: "Mar 10, 2026", size: "840 KB" },
  { name: "Lead Analytics Report", type: "Sales", period: "Mar 2026", date: "Mar 05, 2026", size: "3.2 MB" },
  { name: "Annual Balance Sheet FY25", type: "Balance Sheet", period: "FY 2025", date: "Jan 15, 2026", size: "8.5 MB" },
  { name: "Unit Absorption Analysis", type: "Sales", period: "Feb 2026", date: "Feb 28, 2026", size: "1.2 MB" },
  { name: "Vendor Payments Summary", type: "Construction", period: "Feb 2026", date: "Feb 25, 2026", size: "1.5 MB" },
  { name: "Custom Ops Dashboard", type: "Custom", period: "Jan-Mar 26", date: "Mar 12, 2026", size: "4.8 MB" },
];

export default function ReportsPage() {
  const [activeCat, setActiveCat] = useState("All");
  const filteredReports = activeCat === "All" ? reports : reports.filter(r => r.type === activeCat);

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Financial Reports</h1>
          <p className="text-slate-500 font-medium mt-1">Access, download, and schedule executive reports.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <Button className="bg-[#0066FF] hover:bg-blue-700 text-white font-semibold rounded-[10px] px-6 h-10 shadow-md">
              <Calendar className="w-4 h-4 mr-2" /> Schedule New
           </Button>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-8">
            {/* CATEGORIES */}
            <div className="flex gap-3 overflow-x-auto pb-2">
               {categories.map(c => (
                  <button
                     key={c}
                     onClick={() => setActiveCat(c)}
                     className={`px-5 py-2 whitespace-nowrap rounded-[10px] text-[13px] font-bold transition-all border ${
                        activeCat === c 
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md' 
                        : 'bg-white text-slate-600 border-[#E8ECF0] hover:border-slate-300 hover:text-[#0F172A]'
                     }`}
                  >
                     {c}
                  </button>
               ))}
            </div>

            {/* REPORTS GRID */}
            <div>
               <SectionHeading title={`${activeCat} Reports (${filteredReports.length})`} />
               <div className="grid md:grid-cols-2 gap-5">
                  {filteredReports.map((r, i) => (
                     <InteractivePearlCard key={i} className="p-5 flex flex-col justify-between h-full">
                        <div>
                           <div className="flex justify-between items-start mb-3">
                              <Badge variant="outline" className={`px-2 py-0.5 border-none font-bold uppercase tracking-widest text-[9px] ${
                                 r.type === 'P&L' ? 'bg-blue-50 text-blue-700' :
                                 r.type === 'Sales' ? 'bg-emerald-50 text-emerald-700' :
                                 r.type === 'Construction' ? 'bg-orange-50 text-orange-700' :
                                 r.type === 'Cash Flow' ? 'bg-teal-50 text-teal-700' :
                                 'bg-purple-50 text-purple-700'
                              }`}>
                                 {r.type}
                              </Badge>
                              <span className="text-[11px] font-semibold text-slate-400">{r.size} • PDF</span>
                           </div>
                           <h3 className="text-[16px] font-bold text-[#0F172A] leading-snug mb-2">{r.name}</h3>
                           <p className="text-[12px] font-medium text-slate-500 mb-6 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {r.period} • Gen: {r.date}
                           </p>
                        </div>
                        <div className="flex gap-3 border-t border-[#E8ECF0] pt-4">
                           <Button variant="outline" className="flex-1 border-[#E8ECF0] hover:bg-slate-50 text-slate-600 font-semibold gap-2 rounded-[8px] h-9">
                              <Eye className="w-4 h-4 text-slate-400" /> Preview
                           </Button>
                           <Button className="flex-[1.5] bg-[#F8FAFC] border border-[#E8ECF0] hover:border-slate-300 hover:bg-white text-[#0F172A] shadow-sm font-semibold gap-2 rounded-[8px] h-9">
                              <Download className="w-4 h-4 text-[#0066FF]" /> Download
                           </Button>
                        </div>
                     </InteractivePearlCard>
                  ))}
               </div>
               
               {filteredReports.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-[#E8ECF0] rounded-[16px] bg-[#FAFBFC]">
                     <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                     <h3 className="text-[15px] font-bold text-slate-600">No reports found</h3>
                     <p className="text-[13px] font-medium text-slate-500 mt-1">Try selecting a different category.</p>
                  </div>
               )}
            </div>
         </div>

         {/* SCHEDULE REPORT FORM */}
         <div className="xl:col-span-1">
            <PearlCard className="p-6">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E8ECF0]">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                     <FileBarChart className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="text-lg font-bold text-[#0F172A] tracking-tight leading-tight">Generate Custom Report</h2>
                     <p className="text-[12px] font-medium text-slate-500">Schedule daily, weekly, or monthly.</p>
                  </div>
               </div>

               <form className="space-y-6">
                  <div>
                     <Label className="text-[13px] font-bold text-slate-700">Report Type</Label>
                     <select className="w-full mt-1.5 h-10 bg-slate-50 border border-[#E8ECF0] rounded-[8px] px-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option>Executive Consolidation</option>
                        <option>Detailed P&L</option>
                        <option>Sales & Marketing</option>
                        <option>Construction Tracking</option>
                     </select>
                  </div>

                  <div>
                     <Label className="text-[13px] font-bold text-slate-700">Date Range</Label>
                     <select className="w-full mt-1.5 h-10 bg-slate-50 border border-[#E8ECF0] rounded-[8px] px-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option>Last 30 Days</option>
                        <option>This Quarter</option>
                        <option>Year to Date</option>
                        <option>Custom Range</option>
                     </select>
                  </div>

                  <div>
                     <Label className="text-[13px] font-bold text-slate-700 mb-2 block">Include Sections</Label>
                     <div className="space-y-2.5 bg-slate-50 p-4 rounded-[10px] border border-[#E8ECF0]">
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300" defaultChecked />
                           <span className="text-[14px] font-medium text-slate-700">Summary Dashboard</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300" defaultChecked />
                           <span className="text-[14px] font-medium text-slate-700">Financial Statements</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300" defaultChecked />
                           <span className="text-[14px] font-medium text-slate-700">Project Variances</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300" />
                           <span className="text-[14px] font-medium text-slate-700">Raw Data (Excel)</span>
                        </label>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label className="text-[13px] font-bold text-slate-700">Format</Label>
                        <select className="w-full mt-1.5 h-10 bg-slate-50 border border-[#E8ECF0] rounded-[8px] px-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                           <option>PDF</option>
                           <option>Excel</option>
                           <option>Both</option>
                        </select>
                     </div>
                     <div>
                        <Label className="text-[13px] font-bold text-slate-700">Frequency</Label>
                        <select className="w-full mt-1.5 h-10 bg-slate-50 border border-[#E8ECF0] rounded-[8px] px-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                           <option>Once (Now)</option>
                           <option>Weekly (Mon)</option>
                           <option>Monthly (1st)</option>
                        </select>
                     </div>
                  </div>

                  <div>
                     <Label className="text-[13px] font-bold text-slate-700">Email Recipients</Label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input type="text" defaultValue="md@analyzehive.com" className="w-full mt-1.5 h-10 pl-9 bg-slate-50 border-[#E8ECF0] rounded-[8px] text-[14px] font-medium focus-visible:ring-1 focus-visible:ring-[#0066FF] focus-visible:border-[#0066FF]" />
                     </div>
                  </div>

                  <Button className="w-full h-11 bg-[#0F172A] hover:bg-black text-white font-bold rounded-[8px] shadow-md mt-4 text-[14px]">
                     Schedule Report
                  </Button>
               </form>
            </PearlCard>
         </div>
      </div>

    </div>
  )
}
```

### `app/dashboard/sales/page.tsx`
```tsx
"use client"

import { useState } from "react"
import { Users, Target, Building2, TrendingUp, Medal, Download } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { 
  ComposedChart, AreaChart, Area, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"

// --- HELPERS ---
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
    <Button variant="ghost" className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 px-3 text-[13px] gap-2">
      <Download className="w-4 h-4" /> Export Data
    </Button>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// --- MOCK DATA ---
const salesPerformanceData = [
  { month: "Oct 25", revenue: 4.2, target: 5.0, units: 12 },
  { month: "Nov 25", revenue: 6.5, target: 5.0, units: 18 },
  { month: "Dec 25", revenue: 7.8, target: 6.5, units: 22 },
  { month: "Jan 26", revenue: 5.4, target: 6.5, units: 15 },
  { month: "Feb 26", revenue: 6.8, target: 6.5, units: 19 },
  { month: "Mar 26", revenue: 8.4, target: 7.0, units: 23 },
];

const brokerLeaderboard = [
  { rank: 1, name: "Amit M", role: "Sr. Sales Exec", leads: 145, visits: 42, conv: 8, rev: "₹2.8Cr", ach: "160%", trend: "up" },
  { rank: 2, name: "Neha G", role: "Sales Exec", leads: 128, visits: 38, conv: 7, rev: "₹2.4Cr", ach: "140%", trend: "up" },
  { rank: 3, name: "Rahul S", role: "Sales Exec", leads: 115, visits: 29, conv: 5, rev: "₹1.8Cr", ach: "105%", trend: "up" },
  { rank: 4, name: "Priya K", role: "Jr. Exec", leads: 95, visits: 24, conv: 4, rev: "₹1.4Cr", ach: "85%", trend: "down" },
  { rank: 5, name: "Vikram N", role: "Sales Exec", leads: 102, visits: 18, conv: 3, rev: "₹1.1Cr", ach: "60%", trend: "down" },
];

const channelROI = [
  { channel: "Meta Ads", spend: "₹15.2L", leads: 480, conv: 32, rev: "₹11.5Cr", roi: "746%", cpl: "₹3,166", cpa: "₹47,500" },
  { channel: "Google Ads", spend: "₹12.5L", leads: 310, conv: 25, rev: "₹8.8Cr", roi: "694%", cpl: "₹4,032", cpa: "₹50,000" },
  { channel: "99acres", spend: "₹8.0L", leads: 240, conv: 18, rev: "₹6.2Cr", roi: "765%", cpl: "₹3,333", cpa: "₹44,444" },
  { channel: "Direct Walk-ins", spend: "₹2.0L", leads: 85, conv: 15, rev: "₹5.5Cr", roi: "2650%", cpl: "₹2,352", cpa: "₹13,333" },
  { channel: "Channel Partners", spend: "₹4.5L", leads: 60, conv: 12, rev: "₹4.2Cr", roi: "923%", cpl: "₹7,500", cpa: "₹37,500" },
];

const pipelineMovement = [
  { week: "Wk 1", new: 45, contacted: 38, visited: 15, negotiation: 8, won: 3 },
  { week: "Wk 2", new: 52, contacted: 44, visited: 22, negotiation: 10, won: 5 },
  { week: "Wk 3", new: 68, contacted: 55, visited: 28, negotiation: 14, won: 7 },
  { week: "Wk 4", new: 54, contacted: 48, visited: 24, negotiation: 12, won: 8 },
];

export default function SalesPerformancePage() {
  const [period, setPeriod] = useState("This Month");

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Sales Performance</h1>
          <p className="text-slate-500 font-medium mt-1">MD overview of revenue generation, teams, and channels.</p>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-[10px] border border-[#E8ECF0]">
          {['This Month', 'Last Month', 'This Quarter', 'YTD'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-[6px] text-[13px] font-bold transition-all ${
                period === p 
                  ? 'bg-white text-[#0066FF] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        <InteractivePearlCard className="p-5 lg:col-span-2">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-[10px] bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">+18% vs Target</Badge>
          </div>
          <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">₹8.4Cr</h3>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Revenue</p>
        </InteractivePearlCard>
        
        <InteractivePearlCard className="p-5 lg:col-span-2">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 rounded-[10px] bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <Target className="h-5 w-5" />
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">23 Units</Badge>
          </div>
          <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">115%</h3>
          <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mt-1">Target Achievement</p>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-5">
          <div className="h-10 w-10 rounded-[10px] bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-[28px] font-bold text-[#0F172A] leading-tight">8.5%</h3>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Conversion Rate</p>
        </InteractivePearlCard>

        <InteractivePearlCard className="p-5">
          <div className="h-10 w-10 rounded-[10px] bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <Building2 className="h-5 w-5" />
          </div>
          <h3 className="text-[28px] font-bold text-[#0F172A] leading-tight">₹45.5L</h3>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Customer Acq. Cost</p>
        </InteractivePearlCard>
      </section>

      {/* SECTION 2: PERFORMANCE vs TARGET CHART */}
      <section>
        <SectionHeading title="Revenue vs Target Trend (Consolidated)" />
        <PearlCard className="p-6 pt-10">
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart data={salesPerformanceData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8}/>
                   <stop offset="95%" stopColor="#0066FF" stopOpacity={0.1}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
               <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B', fontWeight: 500 }} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}Cr`} />
               <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(v)=>`₹${v}Cr`} />
               <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
               
               <Area type="monotone" dataKey="revenue" name="Actual Revenue" fill="url(#revFill)" stroke="#0052CC" strokeWidth={3} />
               <Line type="monotone" dataKey="target" name="Target Revenue" stroke="#F59E0B" strokeWidth={3} strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </PearlCard>
      </section>

      {/* SECTION 3: BROKER PERFORMANCE */}
      <section>
        <SectionHeading title="Top Performing Brokers / Agents" />
        <PearlCard>
          <Table>
             <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
               <TableRow className="hover:bg-transparent border-none">
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6 text-center w-[80px]">Rank</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Broker / Agent</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-center">Leads</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-center">Visits</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-center">Cwms</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-right">Revenue</TableHead>
                 <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-right pr-6">Target Achieved</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {brokerLeaderboard.map((b, i) => (
                 <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                   <TableCell className="py-4 pl-6 text-center font-black text-xl text-slate-300">
                     {b.rank === 1 ? <Medal className="w-6 h-6 text-yellow-500 mx-auto" /> : 
                      b.rank === 2 ? <Medal className="w-6 h-6 text-slate-400 mx-auto" /> : 
                      b.rank === 3 ? <Medal className="w-6 h-6 text-amber-600 mx-auto" /> : 
                      <span className="text-slate-400">#{b.rank}</span>}
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                         {b.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-bold text-[#0F172A] text-[14px] leading-tight">{b.name}</p>
                         <p className="text-[11px] font-semibold text-slate-500">{b.role}</p>
                       </div>
                     </div>
                   </TableCell>
                   <TableCell className="text-center font-medium text-slate-600">{b.leads}</TableCell>
                   <TableCell className="text-center font-medium text-slate-600">{b.visits}</TableCell>
                   <TableCell className="text-center font-bold text-[#0F172A]">{b.conv}</TableCell>
                   <TableCell className="text-right font-bold text-[#10B981] text-[15px]">{b.rev}</TableCell>
                   <TableCell className="text-right pr-6">
                     <div className="flex items-center justify-end gap-2">
                       <Badge variant="outline" className={`border-none shadow-none font-bold px-2 py-0.5 ${
                         parseInt(b.ach) >= 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                       }`}>
                         {b.ach}
                       </Badge>
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
        </PearlCard>
      </section>

      {/* SECTION 4 & 5: CHANNEL ROI & PIPELINE */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Channel ROI Analysis" />
          <PearlCard className="flex-1 overflow-x-auto">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase py-3 pl-4">Channel</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">Spend</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-center">Convs</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">CPA</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right pr-4">ROI</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {channelROI.map((c, i) => (
                   <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-3 pl-4 font-bold text-[#0F172A] text-[13px]">{c.channel}</TableCell>
                     <TableCell className="text-right text-[13px] font-medium text-slate-600">{c.spend}</TableCell>
                     <TableCell className="text-center text-[13px] font-bold text-[#0F172A]">{c.conv}</TableCell>
                     <TableCell className="text-right text-[13px] font-semibold text-rose-600">{c.cpa}</TableCell>
                     <TableCell className="text-right pr-4">
                       <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] px-1.5 shadow-none">
                         {c.roi}
                       </Badge>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="Weekly Pipeline Movement" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pipelineMovement} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                 <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                 <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                 <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }} />
                 
                 <Bar dataKey="new" stackId="a" fill="#E2E8F0" name="New Leads" radius={[0, 0, 4, 4]} />
                 <Bar dataKey="contacted" stackId="a" fill="#93C5FD" name="Contacted" />
                 <Bar dataKey="visited" stackId="a" fill="#3B82F6" name="Site Visit" />
                 <Bar dataKey="negotiation" stackId="a" fill="#6366F1" name="Negotiation" />
                 <Bar dataKey="won" stackId="a" fill="#10B981" name="Converted" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

    </div>
  )
}
```

### `app/dashboard/team/client.tsx`
```tsx
"use client"

import { Users, UserPlus, FileCheck, CheckCircle2, TrendingUp, Medal, Star } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#CBD5E1] transition-all duration-200 ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

export default function TeamClient({ salesTeam, constTeam }: { salesTeam: any[], constTeam: any[] }) {

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Team Performance</h1>
        <p className="text-slate-500 font-medium mt-1">Cross-functional team metrics, leaderboards, and HR overviews.</p>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <div className="border-b border-[#E8ECF0] mb-8">
          <TabsList className="bg-transparent h-auto p-0 flex space-x-6 justify-start">
            <TabsTrigger 
              value="sales" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0066FF] data-[state=active]:text-[#0066FF] data-[state=active]:shadow-none data-[state=active]:bg-transparent px-2 pb-3 pt-0 text-[15px] font-bold text-slate-500"
            >
              Sales Team
            </TabsTrigger>
            <TabsTrigger 
              value="construction" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F59E0B] data-[state=active]:text-[#F59E0B] data-[state=active]:shadow-none data-[state=active]:bg-transparent px-2 pb-3 pt-0 text-[15px] font-bold text-slate-500"
            >
              Construction Team
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ======================= SALES TEAM VIEW ======================= */}
        <TabsContent value="sales" className="space-y-10 focus-visible:outline-none mt-0">
          
          <section className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 flex flex-col">
              <SectionHeading title="Team Target Progress" />
              <PearlCard className="flex-1 p-6 flex flex-col justify-between">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <p className="font-bold text-[#0F172A]">Team Revenue Target</p>
                       <span className="font-extrabold text-[24px] text-[#0F172A]">115%</span>
                    </div>
                    <Progress value={115} className="h-2.5 mb-2 bg-blue-100 [&>div]:bg-[#0066FF]" />
                    <p className="text-[12px] font-medium text-slate-500">
                      Target achieved for the month
                   </p>
                 </div>

                 <div className="mt-8 pt-6 border-t border-[#E8ECF0]">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Team Composition</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-600">Total Members</span>
                      <span className="font-bold text-[#0F172A]">{salesTeam.length}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-600">Top Performers</span>
                      <span className="font-bold text-[#10B981]">{salesTeam.filter(s => parseInt(s.ach)>=100).length}</span>
                    </div>
                 </div>
              </PearlCard>
            </div>

            <div className="lg:col-span-3">
              <SectionHeading title="Top Individuals" />
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                 {salesTeam.slice(0, 4).map((member, i) => (
                    <InteractivePearlCard key={i} className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${member.avatarColor}`}>
                            {member.name.charAt(0)}
                         </div>
                         <Badge className={`${
                           member.ach === 'Excellent' || parseInt(member.ach) >= 120 ? 'bg-[#10B981] text-white hover:bg-[#10B981]' : 
                           member.ach === 'Good' || member.ach === 'Very Good' || parseInt(member.ach) >= 100 ? 'bg-blue-500 text-white hover:bg-blue-500' : 'bg-amber-500 text-white hover:bg-amber-500'
                         } border-none font-bold px-2 py-0`}>
                            {member.ach} Target
                         </Badge>
                      </div>
                      <div>
                         <h3 className="font-bold text-[16px] text-[#0F172A]">{member.name}</h3>
                         <p className="text-[12px] font-medium text-slate-500">{member.role}</p>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-end border-t border-[#E8ECF0] pt-4">
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
                            <p className="font-bold text-[18px] text-[#0F172A]">{member.metrics.rev}</p>
                         </div>
                         <div className="w-[60px] h-[30px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={member.trend}>
                                 <YAxis domain={['auto', 'auto']} hide />
                                 <Line type="monotone" dataKey="v" stroke="#0066FF" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                         </div>
                      </div>
                    </InteractivePearlCard>
                 ))}
                 {salesTeam.length === 0 && <div className="col-span-4 text-center py-10 text-slate-500">No sales team data available.</div>}
              </div>
            </div>
          </section>

          <section className="grid xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 flex flex-col">
              <SectionHeading title="Full Leaderboard" />
              <PearlCard className="flex-1">
                 <Table>
                   <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                     <TableRow className="hover:bg-transparent border-none">
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6 w-[80px]">Rank</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Name</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Conversions</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Revenue</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-right pr-6">Rating/Tgt</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {salesTeam.map((m, i) => (
                       <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                         <TableCell className="py-4 pl-6 text-xl text-slate-300">
                           {m.rank === 1 ? <Medal className="w-5 h-5 text-yellow-500" /> : 
                            m.rank === 2 ? <Medal className="w-5 h-5 text-slate-400" /> : 
                            m.rank === 3 ? <Medal className="w-5 h-5 text-amber-600" /> : 
                            <span className="font-bold text-[14px] ml-1 text-slate-400">{m.rank}</span>}
                         </TableCell>
                         <TableCell className="font-bold text-[#0F172A]">{m.name}</TableCell>
                         <TableCell className="font-medium text-slate-600">{m.metrics.conv}</TableCell>
                         <TableCell className="font-semibold text-[#0F172A]">{m.metrics.rev}</TableCell>
                         <TableCell className="text-right pr-6">
                            <span className="font-bold text-[13px] text-[#0066FF]">{m.ach}</span>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
              </PearlCard>
            </div>

            <div className="flex flex-col">
              <SectionHeading title="HR & Operations Overview" />
              <div className="grid gap-4 flex-1">
                 {/* Static HR Metrics for now */}
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-blue-100`}>
                       <Users className="w-5 h-5 text-blue-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Overall Attendance</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">94.5%</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-emerald-100`}>
                       <CheckCircle2 className="w-5 h-5 text-emerald-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Employee Retention</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">92.0%</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-purple-100`}>
                       <UserPlus className="w-5 h-5 text-purple-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">New Hires (Mar)</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">12</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-amber-100`}>
                       <FileCheck className="w-5 h-5 text-amber-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Open Roles</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">5</h3>
                    </div>
                 </PearlCard>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* ======================= CONSTRUCTION TEAM VIEW ======================= */}
        <TabsContent value="construction" className="space-y-10 focus-visible:outline-none mt-0">
          
          <section className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 flex flex-col">
              <SectionHeading title="Team Target Progress" />
              <PearlCard className="flex-1 p-6 flex flex-col justify-between">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <p className="font-bold text-[#0F172A]">Team Task Goal</p>
                       <span className="font-extrabold text-[24px] text-[#0F172A]">92%</span>
                    </div>
                    <Progress value={92} className="h-2.5 mb-2 bg-orange-100 [&>div]:bg-[#F59E0B]" />
                    <p className="text-[12px] font-medium text-slate-500">
                      Overall schedule compliance
                   </p>
                 </div>

                 <div className="mt-8 pt-6 border-t border-[#E8ECF0]">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Team Composition</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-600">Total Members</span>
                      <span className="font-bold text-[#0F172A]">{constTeam.length}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-600">Top Performers</span>
                      <span className="font-bold text-[#10B981]">{constTeam.filter(s => s.ach==='Excellent'||s.ach==='Good').length}</span>
                    </div>
                 </div>
              </PearlCard>
            </div>

            <div className="lg:col-span-3">
              <SectionHeading title="Top Individuals" />
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                 {constTeam.slice(0, 4).map((member, i) => (
                    <InteractivePearlCard key={i} className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${member.avatarColor}`}>
                            {member.name.charAt(0)}
                         </div>
                         <Badge className={`${
                           member.ach === 'Excellent' || parseInt(member.ach) >= 120 ? 'bg-[#10B981] text-white hover:bg-[#10B981]' : 
                           member.ach === 'Good' || member.ach === 'Very Good' || parseInt(member.ach) >= 100 ? 'bg-blue-500 text-white hover:bg-blue-500' : 'bg-amber-500 text-white hover:bg-amber-500'
                         } border-none font-bold px-2 py-0`}>
                            {member.ach}
                         </Badge>
                      </div>
                      <div>
                         <h3 className="font-bold text-[16px] text-[#0F172A]">{member.name}</h3>
                         <p className="text-[12px] font-medium text-slate-500">{member.role}</p>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-end border-t border-[#E8ECF0] pt-4">
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports</p>
                            <p className="font-bold text-[18px] text-[#0F172A]">{member.metrics.tasks}</p>
                         </div>
                         <div className="w-[60px] h-[30px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={member.trend}>
                                 <YAxis domain={['auto', 'auto']} hide />
                                 <Line type="monotone" dataKey="v" stroke="#F59E0B" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                         </div>
                      </div>
                    </InteractivePearlCard>
                 ))}
                 {constTeam.length === 0 && <div className="col-span-4 text-center py-10 text-slate-500">No construction reports data available.</div>}
              </div>
            </div>
          </section>

          <section className="grid xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 flex flex-col">
              <SectionHeading title="Full Leaderboard" />
              <PearlCard className="flex-1">
                 <Table>
                   <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                     <TableRow className="hover:bg-transparent border-none">
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6 w-[80px]">Rank</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Name</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Reports</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Avg Rating</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-right pr-6">Status</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {constTeam.map((m, i) => (
                       <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                         <TableCell className="py-4 pl-6 text-xl text-slate-300">
                           {m.rank === 1 ? <Medal className="w-5 h-5 text-yellow-500" /> : 
                            m.rank === 2 ? <Medal className="w-5 h-5 text-slate-400" /> : 
                            m.rank === 3 ? <Medal className="w-5 h-5 text-amber-600" /> : 
                            <span className="font-bold text-[14px] ml-1 text-slate-400">{m.rank}</span>}
                         </TableCell>
                         <TableCell className="font-bold text-[#0F172A]">{m.name}</TableCell>
                         <TableCell className="font-medium text-slate-600">{m.metrics.tasks}</TableCell>
                         <TableCell className="font-semibold text-[#0F172A]">{m.metrics.onTime}</TableCell>
                         <TableCell className="text-right pr-6">
                            <span className="font-bold text-[13px] text-[#F59E0B]">{m.ach}</span>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
              </PearlCard>
            </div>

            <div className="flex flex-col">
              <SectionHeading title="HR & Operations Overview" />
              <div className="grid gap-4 flex-1">
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-blue-100`}>
                       <Users className="w-5 h-5 text-blue-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Overall Attendance</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">94.5%</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-emerald-100`}>
                       <CheckCircle2 className="w-5 h-5 text-emerald-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Employee Retention</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">92.0%</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-purple-100`}>
                       <UserPlus className="w-5 h-5 text-purple-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">New Hires (Mar)</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">12</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-amber-100`}>
                       <FileCheck className="w-5 h-5 text-amber-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Open Roles</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">5</h3>
                    </div>
                 </PearlCard>
              </div>
            </div>
          </section>

        </TabsContent>

      </Tabs>

    </div>
  )
}
```

### `app/dashboard/team/page.tsx`
```tsx
export const dynamic = 'force-dynamic';

import { getBrokers, getLeads, getDailyProgress } from "@/lib/data"
import TeamClient from './client';

const formatCr = (val: number) => `₹${(val / 10000000).toFixed(1)}Cr`;

export default async function TeamPerformancePage() {
  const [brokersData, leadsData, progressData] = await Promise.all([
    getBrokers(),
    getLeads(),
    getDailyProgress()
  ]);

  // Aggregate Sales Team Data
  const brokerStats: Record<string, any> = {};
  brokersData?.forEach((b: any) => {
    brokerStats[b.id] = {
      name: b.name,
      role: b.role,
      conv: 0,
      rev: 0,
      leads: 0,
      avatarColor: "bg-blue-100 text-blue-700"
    };
  });

  leadsData?.forEach((l: any) => {
    if (l.assigned_user_id && brokerStats[l.assigned_user_id]) {
       brokerStats[l.assigned_user_id].leads += 1;
       if (l.status === 'Converted') {
         brokerStats[l.assigned_user_id].conv += 1;
         // Assume each conversion brings ~1.2Cr revenue
         brokerStats[l.assigned_user_id].rev += 12000000;
       }
    }
  });

  const salesTeam = Object.values(brokerStats).map((b: any, i: number) => ({
    ...b,
    metrics: { rev: formatCr(b.rev), conv: b.conv },
    ach: b.conv >= 5 ? "120%" : b.conv >= 3 ? "100%" : "80%",
    trend: [{v: Math.random()*5},{v: Math.random()*5+2},{v: Math.random()*5+4},{v: b.conv}],
    rank: 0,
    avatarColor: ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700'][i % 4]
  })).sort((a,b) => b.conv - a.conv).map((b, i) => ({...b, rank: i + 1}));

  // Aggregate Construction Team Data
  const constStats: Record<string, any> = {};
  progressData?.forEach((p: any) => {
    if (p.submitted_by_user) {
      const uid = p.submitted_by_user.id;
      if (!constStats[uid]) {
        constStats[uid] = {
          name: p.submitted_by_user.name,
          role: "Site Manager",
          tasks: 0,
          sumPct: 0
        };
      }
      constStats[uid].tasks += 1;
      constStats[uid].sumPct += p.completion_pct || 0;
    }
  });

  const constTeam = Object.values(constStats).map((c: any, i: number) => {
    const avgPct = c.tasks > 0 ? c.sumPct / c.tasks : 0;
    return {
      ...c,
      metrics: { tasks: c.tasks, onTime: `${Math.round(avgPct)}%` },
      ach: avgPct > 90 ? "Excellent" : avgPct > 70 ? "Good" : "Needs Imp.",
      trend: [{v: Math.random()*10},{v: Math.random()*15},{v: Math.random()*20},{v: c.tasks}],
      rank: 0,
      avatarColor: ['bg-orange-100 text-orange-700', 'bg-teal-100 text-teal-700', 'bg-indigo-100 text-indigo-700'][i % 3]
    };
  }).sort((a,b) => b.tasks - a.tasks).map((c, i) => ({...c, rank: i + 1}));

  return <TeamClient salesTeam={salesTeam} constTeam={constTeam} />
}
```

### `app/error.tsx`
```tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 text-center">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Something went wrong!</h2>
      <p className="text-slate-500 max-w-md">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
```

### `app/global-error.tsx`
```tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-950 p-4 text-center text-slate-50">
        <h2 className="text-2xl font-bold">Critical Application Error</h2>
        <p className="text-slate-400 max-w-md">
          {error.message || "A critical error occurred at the root level."}
        </p>
        <button
          onClick={() => reset()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
```

### `app/globals.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}

* {
  font-family: 'Inter', sans-serif;
}

.glass-sidebar {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(15, 23, 42, 0.85);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-navbar {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.75);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
}

.card-hover {
  transition: all 0.2s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

### `app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analyzehive Flow - ERP",
  description: "Real Estate ERP foundation",
};

import { ToastProvider } from "@/components/ui/toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

### `app/page.tsx`
```tsx
import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const signInUrl = await getSignInUrl({
    redirectUri: 'http://localhost:3000/api/auth/callback',
  });

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left side: branding/gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 flex-col justify-center p-16 text-white relative overflow-hidden">
        {/* Decorative circle shapes like in the image */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 border-[40px] border-blue-400/10 rounded-full" />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] border-[20px] border-blue-400/5 rounded-full" />
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-12 h-12" />
            <span className="text-4xl font-bold tracking-tight">Analyzehive</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mt-2">Flow</h1>
          <p className="text-xl text-blue-100/80 max-w-md leading-relaxed">
            The most complete Real Estate ERP & CRM system for modern developers and property managers.
          </p>
          <button className="mt-8 px-8 py-3 bg-blue-500/30 border border-blue-400/30 rounded-full backdrop-blur-sm hover:bg-blue-500/40 transition-all font-semibold self-start text-sm">
            Read More
          </button>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Hello Again!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Welcome Back</p>
          </div>

          <div className="space-y-6 pt-8">
            <a 
              href={signInUrl}
              className="flex w-full justify-center items-center py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
            >
              Sign in with WorkOS
            </a>
          </div>
        </div>
        
        {/* Footer info for mobile */}
        <div className="lg:hidden mt-auto pt-12 flex items-center gap-2 opacity-50">
          <Building2 className="w-5 h-5" />
          <span className="font-bold">Analyzehive Flow</span>
        </div>
      </div>
    </div>
  );
}
```

### `app/sales/analytics/page.tsx`
```tsx
"use client"

import { useState } from "react"
import { 
  TrendingUp, TrendingDown, IndianRupee, PieChart as PieChartIcon, 
  Target, Clock, Users, Building2, BarChart2, Filter
} from "lucide-react"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Legend, PieChart, Pie, Cell, BarChart, Bar
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// --- Mock Data ---

const revenueData = [
  { name: 'Jan', revenue: 45, target: 50 },
  { name: 'Feb', revenue: 52, target: 50 },
  { name: 'Mar', revenue: 38, target: 55 },
  { name: 'Apr', revenue: 65, target: 55 },
  { name: 'May', revenue: 78, target: 60 },
  { name: 'Jun', revenue: 85, target: 60 },
  { name: 'Jul', revenue: 72, target: 65 },
  { name: 'Aug', revenue: 90, target: 70 },
  { name: 'Sep', revenue: 105, target: 75 },
  { name: 'Oct', revenue: 95, target: 80 },
  { name: 'Nov', revenue: 110, target: 85 },
  { name: 'Dec', revenue: 125, target: 90 },
]

const sourceData = [
  { name: 'Meta Ads', value: 40, color: '#0066FF' },
  { name: 'Google Ads', value: 30, color: '#10B981' },
  { name: '99acres', value: 20, color: '#F59E0B' },
  { name: 'Direct', value: 10, color: '#64748B' },
]

const brokerData = [
  { name: 'Amit M', conversions: 45, target: 40, achievement: 112 },
  { name: 'Neha G', conversions: 38, target: 40, achievement: 95 },
  { name: 'Demo M', conversions: 22, target: 30, achievement: 73 },
  { name: 'Raj S', conversions: 50, target: 45, achievement: 111 },
]

const funnelData = [
  { stage: 'Total Leads', count: 284, color: 'bg-blue-500', width: '100%' },
  { stage: 'Contacted', count: 198, color: 'bg-indigo-500', width: '70%' },
  { stage: 'Site Visits', count: 89, color: 'bg-purple-500', width: '45%' },
  { stage: 'Negotiation', count: 42, color: 'bg-orange-500', width: '25%' },
  { stage: 'Converted', count: 23, color: 'bg-green-500', width: '15%' },
]

const heatmapData = Array.from({ length: 4 }, (_, weekIndex) => 
  Array.from({ length: 7 }, (_, dayIndex) => {
    // Generate some random counts favoring middle of the week
    const baseCount = dayIndex > 0 && dayIndex < 6 ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 4);
    return baseCount;
  })
);

const propertiesTableData = [
  { name: 'Tower A - 3BHK', type: '3BHK', price: '₹75L', inquiries: 145, visits: 42, conversions: 8, revenue: '₹6.0Cr' },
  { name: 'Villas - 4BHK', type: '4BHK', price: '₹1.8Cr', inquiries: 89, visits: 24, conversions: 4, revenue: '₹7.2Cr' },
  { name: 'Tower B - 2BHK', type: '2BHK', price: '₹46L', inquiries: 210, visits: 56, conversions: 12, revenue: '₹5.5Cr' },
  { name: 'Tower A - 2BHK', type: '2BHK', price: '₹45L', inquiries: 185, visits: 48, conversions: 10, revenue: '₹4.5Cr' },
  { name: 'Tower B - 1BHK', type: '1BHK', price: '₹28L', inquiries: 120, visits: 35, conversions: 6, revenue: '₹1.6Cr' },
]

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("month")

  // Custom Bar for Broker Chart to show dynamic colors
  const CustomBar = (props: any) => {
    const { fill, x, y, width, height, payload } = props;
    const color = payload.achievement > 100 ? '#10B981' : payload.achievement >= 80 ? '#3B82F6' : '#F59E0B';
    return <rect x={x} y={y} width={width} height={height} fill={color} rx={4} ry={4} />;
  };

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* SECTION 1 - HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Sales Analytics</h1>
          <p className="text-[#64748B] text-sm mt-1">Deep dive into revenue, conversions, and performance</p>
        </div>
        
        <Tabs value={dateRange} onValueChange={setDateRange}>
          <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-11">
            <TabsTrigger value="week" className="rounded-[8px] px-4 text-[12px] font-bold">This Week</TabsTrigger>
            <TabsTrigger value="month" className="rounded-[8px] px-4 text-[12px] font-bold">This Month</TabsTrigger>
            <TabsTrigger value="quarter" className="rounded-[8px] px-4 text-[12px] font-bold">This Quarter</TabsTrigger>
            <TabsTrigger value="year" className="rounded-[8px] px-4 text-[12px] font-bold">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* SECTION 2 - KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Total Revenue", value: "₹8.4Cr", trend: "+12.5%", isUp: true, icon: IndianRupee, color: "text-[#0066FF]", bg: "bg-blue-50" },
          { label: "Avg Deal Size", value: "₹36.5L", trend: "+2.4%", isUp: true, icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Conversion Rate", value: "8.1%", trend: "-0.5%", isUp: false, icon: PieChartIcon, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Avg Sales Cycle", value: "23 days", trend: "-2 days", isUp: true, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Top Channel", value: "Meta (40%)", trend: "Consistent", isUp: true, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
          { label: "MoM Growth", value: "+23%", trend: "+5% prev", isUp: true, icon: TrendingUp, color: "text-cyan-500", bg: "bg-cyan-50" },
        ].map((kpi, i) => (
          <Card key={i} className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] hover:-translate-y-0.5 transition-transform">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-[8px] ${kpi.bg}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] ${kpi.isUp ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                  {kpi.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.trend}
                </div>
              </div>
              <h3 className="text-[22px] font-bold text-[#0F172A] leading-tight">{kpi.value}</h3>
              <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SECTION 3 - CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Monthly Revenue Trend</h3>
              <p className="text-[12px] text-[#64748B]">Actual vs Target (in Lakhs)</p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(value) => `₹${value}L`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                    cursor={{ stroke: '#E8ECF0', strokeWidth: 2 }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0066FF" strokeWidth={3} dot={{ r: 4, fill: '#0066FF', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Lead Source Distribution</h3>
              <p className="text-[12px] text-[#64748B]">Breakdown by marketing channel</p>
            </div>
          </div>
          <CardContent className="p-6 flex items-center justify-center">
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}
                    formatter={(value) => [`${value}%`, 'Share']}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '13px', fontWeight: 500 }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[2px] pr-[120px]">
                <span className="text-[28px] font-bold text-[#0F172A] leading-none">284</span>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-1">Total Leads</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 4 - CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Broker Performance</h3>
              <p className="text-[12px] text-[#64748B]">Conversions vs Targets</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-[#64748B]">
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> &gt;100%</div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" /> 80-100%</div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> &lt;80%</div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brokerData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    cursor={{ fill: '#F8FAFC' }}
                  />
                  <Bar dataKey="conversions" name="Conversions" shape={<CustomBar />} />
                  <Bar dataKey="target" name="Target" fill="#E2E8F0" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-[#0F172A] text-[16px]">Conversion Pipeline</h3>
            <p className="text-[12px] text-[#64748B]">Leads moving through stages</p>
          </div>
          <CardContent className="p-6 px-10">
            <div className="h-[280px] w-full flex flex-col justify-center gap-[6px]">
              {funnelData.map((stage, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`h-11 ${stage.color} flex items-center justify-between px-4 text-white rounded-[6px] shadow-sm transition-all duration-300 hover:opacity-90 cursor-pointer`}
                    style={{ width: stage.width }}
                  >
                    <span className="text-[12px] font-bold tracking-wide">{stage.stage}</span>
                    <span className="text-[14px] font-bold">{stage.count}</span>
                  </div>
                  {i < funnelData.length - 1 && (
                    <div className="h-4 w-px bg-gray-200 my-0.5" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 5 - HEATMAP */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#0F172A] text-[16px]">Weekly Lead Activity</h3>
            <p className="text-[12px] text-[#64748B]">Inquiry volume heat distribution</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#64748B]">
            <span>Low</span>
            <div className="w-3 h-3 rounded-[2px] bg-slate-100" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-100" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-300" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-500" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-700" />
            <span>High</span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Header Days */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day, i) => (
                  <div key={i} className="text-center text-[12px] font-bold text-[#64748B] uppercase tracking-wider pb-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grid Cells */}
              <div className="space-y-2">
                {heatmapData.map((week, weekIdx) => (
                  <div key={`week-${weekIdx}`} className="grid grid-cols-7 gap-2">
                    {week.map((count, dayIdx) => {
                      let bgColor = 'bg-slate-100 text-slate-400';
                      if (count > 0 && count <= 3) bgColor = 'bg-blue-100 text-blue-600';
                      else if (count > 3 && count <= 6) bgColor = 'bg-blue-300 text-blue-800';
                      else if (count > 6 && count <= 9) bgColor = 'bg-blue-500 text-white';
                      else if (count > 9) bgColor = 'bg-blue-700 text-white';
                      
                      return (
                        <div 
                          key={`day-${dayIdx}`} 
                          className={`aspect-[3/1] ${bgColor} rounded-[8px] flex items-center justify-center font-bold text-[14px] shadow-sm transition-transform hover:scale-[1.02] cursor-pointer cursor-help`}
                          title={`${count} activities`}
                        >
                          {count}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 6 - TOP PROPERTIES TABLE */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
          <div>
            <h3 className="font-bold text-[#0F172A] text-[16px]">Top Performing Configurations</h3>
          </div>
          <Button variant="outline" className="h-8 rounded-[8px] border-gray-200 text-[#0F172A] text-[12px] font-semibold bg-white">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white border-b border-gray-100">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] py-4 pl-6">Property Name</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Type</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-right">Avg Price</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Inquiries</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Site Visits</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Conversions</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-right pr-6">Revenue Gen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propertiesTableData.map((prop, index) => (
                <TableRow key={index} className="hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-50">
                  <TableCell className="pl-6 py-4">
                    <div className="font-bold text-[#0F172A] text-[14px] flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {prop.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] rounded-[6px] border-gray-200 bg-[#F8FAFC] font-bold">{prop.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-[#0F172A]">{prop.price}</TableCell>
                  <TableCell className="text-center text-[#64748B] font-medium">{prop.inquiries}</TableCell>
                  <TableCell className="text-center text-[#64748B] font-medium">{prop.visits}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-emerald-100 text-emerald-700 shadow-none hover:bg-emerald-100 font-bold px-2 py-0.5">{prop.conversions}</Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 font-bold text-[#0066FF]">{prop.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

    </div>
  )
}
```

### `app/sales/components/SalesDashboardClient.tsx`
```tsx
'use client';

import { createBrowserClient } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';
import { 
  Building2, LayoutDashboard, Users, Calendar, MessageCircle, TrendingUp, IndianRupee, Search, MoreHorizontal, MessageSquare, Phone, MapPin, Clock, GripVertical, CheckSquare, Hexagon,
  Eye, Edit, Trash2, Plus, X
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

// Helper styles
function getStatusColor(status: string) {
  if (!status) return "bg-gray-100 text-gray-700 border-none";
  switch (status.toLowerCase()) {
    case 'new': case 'available': return "bg-blue-100 text-[#0066FF] border-none"
    case 'contacted': case 'on hold': return "bg-yellow-100 text-yellow-700 border-none"
    case 'site visit scheduled': case 'site visit': return "bg-purple-100 text-purple-700 border-none"
    case 'negotiation': return "bg-orange-100 text-orange-700 border-none"
    case 'converted': case 'sold': case 'confirmed': return "bg-green-100 text-green-700 border-none"
    case 'lost': return "bg-red-100 text-red-700 border-none"
    case 'scheduled': return "bg-indigo-100 text-indigo-700 border-none"
    case 'pending': return "bg-slate-100 text-slate-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

function getSourceColor(source: string) {
  if (!source) return "bg-gray-100 text-gray-700 border-none";
  switch (source.toLowerCase()) {
    case 'meta': return "bg-indigo-100 text-indigo-700 border-none"
    case 'google': return "bg-orange-100 text-orange-700 border-none"
    case '99acres': return "bg-teal-100 text-teal-700 border-none"
    case 'direct': return "bg-slate-100 text-slate-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

const whatsappData = [
  { text: "Brochure sent to Rajesh Kumar", time: "2 min ago", status: "Delivered" },
  { text: "Reminder sent to Priya Sharma", time: "1 hr ago", status: "Read" },
];

export default function SalesDashboardClient() {
  const supabase = createBrowserClient();
  const [leads, setLeads] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '', phone: '', email: '',
    source: '', status: '',
    assignedUserId: '', notes: '',
    projectInterest: '', flatTypeInterest: ''
  });
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    source: 'Direct', assignedUserId: '',
    projectInterest: '', flatTypeInterest: '',
    notes: ''
  });
  const [visitForm, setVisitForm] = useState({
    flatId: '', visitDate: '',
    visitTime: '', brokerId: '', notes: ''
  });
  const [availableFlats, setAvailableFlats] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
    fetchBrokers();
    fetchAvailableFlats();

    // Real-time subscriptions
    const leadsChannel = supabase
      .channel('home-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads_customers' }, () => fetchAllData())
      .subscribe();

    const flatsChannel = supabase
      .channel('home-flats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flats_inventory' }, () => fetchAllData())
      .subscribe();

    const visitsChannel = supabase
      .channel('home-visits')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_visits' }, () => fetchAllData())
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(flatsChannel);
      supabase.removeChannel(visitsChannel);
    };
  }, []);

  const fetchAllData = async () => {
    const [
      { data: leadsData },
      { data: flatsData },
      { data: visitsData }
    ] = await Promise.all([
      supabase
        .from('leads_customers')
        .select('*, assigned_user:users(id,name,avatar_initials)')
        .order('created_at', { ascending: false }),
      supabase
        .from('flats_inventory')
        .select('*')
        .order('project')
        .order('flat_number'),
      supabase
        .from('site_visits')
        .select(`
          *,
          lead:leads_customers(id,name,phone),
          flat:flats_inventory(flat_id,flat_number,project,type),
          broker:users(id,name,avatar_initials)
        `)
        .order('scheduled_at', { ascending: true })
    ]);

    setLeads(leadsData || []);
    setFlats(flatsData || []);
    setVisits(visitsData || []);
    setLoading(false);
  };

  const fetchBrokers = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, name, role')
      .in('role', ['BROKER', 'VP_SALES', 'MD']);
    setBrokers(data || []);
  };

  const fetchAvailableFlats = async () => {
    const { data } = await supabase
      .from('flats_inventory')
      .select('flat_id, flat_number, project, type, price')
      .in('status', ['Available', 'On Hold'])
      .order('project')
      .order('flat_number');
    setAvailableFlats(data || []);
  };

  const updateLeadStatus = async (id: string, status: string) => {
    // Update local state immediately (optimistic UI)
    setLeads(prev => prev.map(l => 
      l.id === id ? { ...l, status, last_activity: new Date().toISOString() } : l
    ));

    const { error } = await supabase
      .from('leads_customers')
      .update({
        status,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
      fetchAllData(); // Restore on failure
    } else {
      toast({ 
        title: `Status updated`,
        description: `Moved to ${status}`
      });
    }
  };

  const handleSaveEdit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedLead) return;

    // Update local state immediately (optimistic UI)
    setLeads(prev => prev.map(l =>
      l.id === selectedLead.id
        ? {
            ...l,
            name: editForm.name,
            phone: editForm.phone,
            email: editForm.email,
            source: editForm.source,
            status: editForm.status,
            assigned_user_id: editForm.assignedUserId,
            notes: editForm.notes,
            project_interest: editForm.projectInterest,
            flat_type_interest: editForm.flatTypeInterest,
            updated_at: new Date().toISOString()
          }
        : l
    ));

    setShowEditSheet(false);
    setSelectedLead(null);

    const { error } = await supabase
      .from('leads_customers')
      .update({
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email || null,
        source: editForm.source,
        status: editForm.status,
        assigned_user_id: editForm.assignedUserId || null,
        project_interest: editForm.projectInterest || null,
        flat_type_interest: editForm.flatTypeInterest || null,
        notes: editForm.notes || null,
        updated_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      })
      .eq('id', selectedLead.id);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
      fetchAllData(); // Restore on failure
    } else {
      toast({ title: 'Lead updated successfully' });
    }
  };

  const handleAddLead = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Name and phone are required',
        variant: 'destructive'
      });
      return;
    }

    setAddLoading(true);

    const { data, error } = await supabase
      .from('leads_customers')
      .insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        source: formData.source || 'Direct',
        status: 'New',
        assigned_user_id: formData.assignedUserId || null,
        project_interest: formData.projectInterest || null,
        flat_type_interest: formData.flatTypeInterest || null,
        notes: formData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      })
      .select('*, assigned_user:users(id, name, avatar_initials)')
      .single();

    if (error) {
      toast({
        title: 'Error adding lead',
        description: error.message,
        variant: 'destructive'
      });
      setAddLoading(false);
      return;
    }

    // Add new lead to top of list immediately (optimistic UI fallback - actually it's adding the real data)
    setLeads(prev => [data, ...prev]);

    toast({
      title: 'Lead added!',
      description: `${formData.name} added successfully`
    });

    setFormData({
      name: '', phone: '', email: '',
      source: 'Direct', assignedUserId: '',
      projectInterest: '', flatTypeInterest: '',
      notes: ''
    });
    setShowAddSheet(false);
    setAddLoading(false);
  };

  const deleteLead = async (id: string) => {
    // Remove from local state IMMEDIATELY (optimistic UI)
    setLeads(prev => prev.filter(l => l.id !== id));

    const { error } = await supabase
      .from('leads_customers')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive'
      });
      fetchAllData(); // Restore on failure
    } else {
      toast({ title: 'Lead deleted successfully' });
    }
  };

  // Calculate ALL KPI values from real data
  const totalLeads = leads.length;
  
  const todayVisits = visits.filter(v => {
    const today = new Date().toISOString().split('T')[0];
    return v.scheduled_at?.startsWith(today);
  }).length;
  
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  
  const soldFlats = flats.filter(f => f.status === 'Sold');
  const revenuePipeline = soldFlats.reduce((sum, f) => sum + (f.price || 0), 0);

  const unitsSold = soldFlats.length;

  const kanbanData = {
    New: { color: "border-blue-500", items: leads.filter(l => l.status === 'New') },
    Contacted: { color: "border-yellow-400", items: leads.filter(l => l.status === 'Contacted') },
    SiteVisit: { color: "border-purple-500", items: leads.filter(l => l.status === 'Site Visit Scheduled') },
    Negotiation: { color: "border-orange-500", items: leads.filter(l => l.status === 'Negotiation') },
    Converted: { color: "border-green-500", items: leads.filter(l => l.status === 'Converted') },
    Lost: { color: "border-red-500", items: leads.filter(l => l.status === 'Lost') }
  };

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* SECTION 1 - KPI Cards */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card 
            className="overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8ECF0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '20px',
              cursor: 'pointer'
            }}
          >
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-[#0066FF] to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <Users className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{totalLeads}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Total Leads</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8ECF0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '20px',
              cursor: 'pointer'
            }}
          >
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{todayVisits}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Visits Today</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8ECF0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '20px',
              cursor: 'pointer'
            }}
          >
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-green-500/30 shrink-0">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{convertedLeads}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Converted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8ECF0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '20px',
              cursor: 'pointer'
            }}
          >
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
                <IndianRupee className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">₹{(revenuePipeline/10000000).toFixed(1)}Cr</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Revenue Pipeline</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* MID SECTION - Kanban & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SECTION 2 - Lead Pipeline Kanban Board */}
        <section className="lg:col-span-2 space-y-4 flex flex-col h-[500px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Pipeline Kanban</h2>
            <Button variant="outline" className="text-[#64748B] rounded-[10px] text-[13px] font-semibold h-8 border-gray-200">View Board</Button>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 h-full">
            {Object.entries(kanbanData).map(([stage, colInfo]) => (
              <div key={stage} className={`min-w-[300px] max-w-[300px] bg-[#F8FAFC] rounded-xl p-3 flex flex-col h-full border-t-[3px] shadow-sm ${colInfo.color}`}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-[#0F172A] text-[14px]">
                    {stage.replace(/([A-Z])/g, ' $1').trim()} 
                    <span className="ml-2 text-[12px] text-gray-500 font-medium">({colInfo.items.length})</span>
                  </h3>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {colInfo.items.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center mt-4">No leads</div>
                  ) : colInfo.items.map((lead: any, i: number) => (
                    <div key={i} className="p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group relative" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
                      <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-4 w-4 text-gray-300 hover:text-gray-500" />
                      </div>
                      <div className="font-bold text-[#0F172A] text-[14px] group-hover:text-[#0066FF] transition-colors">{lead.name}</div>
                      <div className="text-[#64748B] text-[13px] mt-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> {lead.phone}</div>
                      <div className="flex items-center justify-between mt-4">
                        <Badge variant="secondary" className={`${getSourceColor(lead.source)} text-[11px] rounded-full px-2.5 py-0.5 font-semibold`}>{lead.source}</Badge>
                        <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-medium">
                          <Clock className="w-3 h-3" /> {new Date(lead.created_at).toLocaleDateString()}
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                            {lead.assigned_user?.avatar_initials || 'UN'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7 - WhatsApp Activity Feed */}
        <section className="lg:col-span-1 space-y-4 flex flex-col h-[500px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#25D366]" /> WhatsApp Activity
            </h2>
          </div>
          <Card className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
            <div className="p-3 border-b border-gray-100 bg-[#F8FAFC]">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-200/50 p-1 rounded-[10px]">
                  <TabsTrigger value="all" className="rounded-[8px] text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-gray-500">All</TabsTrigger>
                  <TabsTrigger value="sent" className="rounded-[8px] text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-gray-500">Sent</TabsTrigger>
                  <TabsTrigger value="delivered" className="rounded-[8px] text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-gray-500">Deliv</TabsTrigger>
                  <TabsTrigger value="read" className="rounded-[8px] text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-gray-500">Read</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardContent className="p-0 flex-1 overflow-auto">
              <div className="divide-y divide-gray-100">
                {whatsappData.map((activity, i) => {
                  const statusColor = activity.status === 'Read' ? 'bg-[#3B82F6]' : activity.status === 'Delivered' ? 'bg-[#9CA3AF]' : 'bg-[#D1D5DB]'
                  return (
                  <div key={i} className="p-4 hover:bg-[#F0F4F8]/50 transition-colors flex items-start gap-3 group cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MessageCircle className="h-4 w-4 text-[#10B981]" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[13px] font-medium text-[#0F172A] group-hover:text-[#0066FF] transition-colors pr-2 leading-tight">{activity.text}</p>
                      <div className="flex flex-row gap-2 items-center justify-between mt-2">
                        <p className="text-[11px] text-[#64748B] font-semibold">{activity.time}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-[#64748B] uppercase">{activity.status}</span>
                          <div className={`h-2 w-2 rounded-full ${statusColor}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </CardContent>
            <div className="p-3 border-t border-gray-100 bg-[#F8FAFC]">
               <Button className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold shadow-sm rounded-[10px]">Open Web WhatsApp</Button>
            </div>
          </Card>
        </section>
      </div>

      {/* SECTION 3 - Leads Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Active Leads Database</h2>
          <Button
            onClick={() => setShowAddSheet(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
        <Card className="overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
          
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-white items-center">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search name, phone, email..." className="w-full pl-9 rounded-[10px] border-gray-200 bg-[#F8FAFC] focus:bg-white text-sm" />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="meta">Meta Ads</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F8FAFC] border-b border-gray-200">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[50px] text-center pl-4">
                    <CheckSquare className="w-4 h-4 text-gray-400" />
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] py-4">Lead Info</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Contact</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Platform</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Pipeline Status</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Assigned To</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Date Added</TableHead>
                  <TableHead className="text-right pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.slice(0, 10).map((lead: any, index: number) => (
                  <TableRow key={lead.id} className={`group hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]/50'}`}>
                    <TableCell className="w-[50px] text-center pl-4">
                      <div className="w-4 h-4 border border-gray-300 rounded-[4px] mx-auto group-hover:border-[#0066FF] transition-colors" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-bold text-[#0F172A] text-[14px]">{lead.name}</div>
                      <div className="text-[12px] text-gray-400 font-medium">ID: {lead.id.substring(0,8)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] font-medium text-[#0F172A] flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400"/> {lead.phone}</div>
                      <div className="text-[12px] text-[#64748B]">{lead.email || 'No email'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getSourceColor(lead.source)} text-[11px] rounded-full uppercase`}>{lead.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(lead.status)} shadow-none text-[11px] rounded-full font-bold uppercase tracking-wide`}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#0066FF] to-indigo-400 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                          {lead.assigned_user?.avatar_initials || 'UN'}
                        </div>
                        <span className="text-[13px] font-medium text-[#0F172A]">{lead.assigned_user?.name || 'Unassigned'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-[#64748B] font-medium">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
                            >
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg">
                            {/* View Details */}
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                setSelectedLead(lead);
                                setEditForm({
                                  name: lead.name || '',
                                  phone: lead.phone || '',
                                  email: lead.email || '',
                                  source: lead.source || '',
                                  status: lead.status || 'New',
                                  assignedUserId: lead.assigned_user_id || '',
                                  notes: lead.notes || '',
                                  projectInterest: lead.project_interest || '',
                                  flatTypeInterest: lead.flat_type_interest || ''
                                });
                                setShowEditSheet(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-blue-500" />
                              View Details
                            </DropdownMenuItem>

                            {/* Edit Lead */}
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                setSelectedLead(lead);
                                setEditForm({
                                  name: lead.name || '',
                                  phone: lead.phone || '',
                                  email: lead.email || '',
                                  source: lead.source || '',
                                  status: lead.status || 'New',
                                  assignedUserId: lead.assigned_user_id || '',
                                  notes: lead.notes || '',
                                  projectInterest: lead.project_interest || '',
                                  flatTypeInterest: lead.flat_type_interest || ''
                                });
                                setShowEditSheet(true);
                              }}
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                              Edit Lead
                            </DropdownMenuItem>

                            {/* Schedule Visit */}
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                setSelectedLead(lead);
                                setVisitForm({
                                  flatId: '',
                                  visitDate: '',
                                  visitTime: '',
                                  brokerId: lead.assigned_user_id || '',
                                  notes: ''
                                });
                                setShowScheduleDialog(true);
                              }}
                            >
                              <Calendar className="w-4 h-4 text-purple-500" />
                              Schedule Visit
                            </DropdownMenuItem>

                            {/* WhatsApp */}
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                const phone = lead.phone?.replace(/\D/g, '');
                                window.open(`https://wa.me/91${phone}`, '_blank');
                              }}
                            >
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              WhatsApp
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-blue-600"
                              onClick={() => updateLeadStatus(lead.id, 'Contacted')}
                            >
                              <TrendingUp className="w-4 h-4" />
                              Mark as Contacted
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-purple-600"
                              onClick={() => updateLeadStatus(lead.id, 'Site Visit Scheduled')}
                            >
                              <Calendar className="w-4 h-4" />
                              Mark Site Visit Scheduled
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-orange-600"
                              onClick={() => updateLeadStatus(lead.id, 'Negotiation')}
                            >
                              <TrendingUp className="w-4 h-4" />
                              Mark as Negotiation
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-green-600"
                              onClick={() => updateLeadStatus(lead.id, 'Converted')}
                            >
                              <TrendingUp className="w-4 h-4" />
                              Mark as Converted
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => {
                                if (window.confirm(`Delete lead ${lead.name}? This cannot be undone.`)) {
                                  deleteLead(lead.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>

      {/* BOTTOM LAYOUT - Inventory & Scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* SECTION 5 - Flat Inventory */}
        <section className="lg:col-span-3 space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Available Inventory</h2>
            <Button variant="ghost" className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px]">Filter View</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flats.slice(0, 6).map((inv: any, i: number) => {
              const bColor = inv.status === 'Available' ? 'bg-emerald-500' : inv.status === 'Sold' ? 'bg-red-500' : 'bg-amber-500'
              return (
              <Card key={i} className="relative overflow-hidden group shadow-[0_2px_8px_rgba(0,0,0,0.04)] card-hover hover:border-[#CBD5E1] transition-all duration-200" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
                <div className={`h-2 w-full ${bColor} absolute top-0 left-0 right-0`} />
                <CardContent className="p-5 pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">{inv.flat_number}</h3>
                    <Badge variant="outline" className="text-[11px] rounded-full tracking-wider font-bold border-gray-200 text-gray-500 bg-[#F8FAFC]">
                      {inv.type}
                    </Badge>
                  </div>
                  <div className="space-y-2 mt-4 mb-5">
                    <p className="text-[13px] text-[#64748B] flex items-center gap-2 font-medium"><MapPin className="w-4 h-4 text-gray-400" /> Floor {inv.floor || '1'}</p>
                    <p className="text-[13px] text-[#64748B] flex items-center gap-2 font-medium"><Hexagon className="w-4 h-4 text-gray-400" /> {inv.area_sqft} sq.ft area</p>
                  </div>
                  <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-[0.05em]">Asking Price</p>
                      <p className="text-[16px] font-bold text-[#0F172A]">₹{(inv.price / 100000).toFixed(1)}L</p>
                    </div>
                    <Badge className={`${getStatusColor(inv.status)} text-[10px] rounded-full shadow-none font-bold uppercase tracking-wide`}>{inv.status}</Badge>
                  </div>
                  
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md rounded-[10px] font-medium">View Plot Details</Button>
                  </div>
                </CardContent>
              </Card>
            )})}
            {flats.length === 0 && <div className="col-span-3 text-center py-10 text-gray-500">No inventory found</div>}
          </div>
        </section>

        {/* SECTION 6 - Site Visit Scheduler */}
        <section className="lg:col-span-2 space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0066FF]" /> Agenda & Visits
            </h2>
            <Button variant="ghost" className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 text-[13px]">Open Cal</Button>
          </div>
          <Card className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
            <div className="p-4 border-b border-gray-100 bg-[#F8FAFC] flex justify-between items-center">
              <div className="font-bold text-[#0F172A] text-[15px]">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-[8px] text-gray-500 bg-white border-gray-200"><span className="text-[12px] font-bold">{"<"}</span></Button>
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-[8px] text-gray-500 bg-white border-gray-200"><span className="text-[12px] font-bold">{">"}</span></Button>
              </div>
            </div>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-gray-100">
                {visits.slice(0, 5).map((visit: any, i: number) => (
                  <div key={i} className="p-4 hover:bg-[#F0F4F8]/60 transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#F8FAFC] border border-gray-200 text-[#0F172A] font-bold rounded-[10px] flex flex-col items-center justify-center shadow-sm shrink-0">
                        <span className="text-[9px] uppercase text-gray-400 font-semibold leading-none mb-0.5">{new Date(visit.scheduled_at).toLocaleDateString('en-US', {weekday: 'short'})}</span>
                        <span className="text-[13px] leading-none">{new Date(visit.scheduled_at).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[14px] text-[#0F172A] group-hover:text-[#0066FF] transition-colors">{visit.lead?.name || 'Unknown'}</p>
                        <p className="text-[12px] font-medium text-[#64748B] flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" /> {new Date(visit.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge className={`${getStatusColor(visit.status)} text-[10px] rounded-full shadow-none font-bold uppercase`}>{visit.status || 'Pending'}</Badge>
                      <p className="text-[12px] font-bold text-gray-400 tracking-wide">#{visit.flat?.flat_number || 'TBD'}</p>
                    </div>
                  </div>
                ))}
                {visits.length === 0 && <div className="p-10 text-center text-gray-500">No scheduled visits</div>}
              </div>
            </CardContent>
          </Card>
        </section>

      </div>

      {/* ADD LEAD DIALOG */}
      <Dialog open={showAddSheet} onOpenChange={setShowAddSheet}>
        <DialogContent
          className="max-w-[560px] w-full rounded-2xl p-0 overflow-hidden max-h-[90vh]"
        >
          {/* Dark header */}
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">
                Add New Lead
              </DialogTitle>
              <p className="text-blue-300 text-sm mt-1">
                Fill in the details below
              </p>
            </div>
            <button
              onClick={() => setShowAddSheet(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable form */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form
              id="add-lead-form"
              onSubmit={handleAddLead}
              className="px-6 py-5 space-y-4"
            >
              {/* Row 1: Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email + Source */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Lead Source *</Label>
                  <Select
                    value={formData.source}
                    onValueChange={val => setFormData(p => ({ ...p, source: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meta">Meta</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="99acres">99acres</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Broker + Project */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Assign Broker</Label>
                  <Select
                    value={formData.assignedUserId}
                    onValueChange={val => setFormData(p => ({ ...p, assignedUserId: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent>
                      {brokers.map(b => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Project Interest</Label>
                  <Select
                    value={formData.projectInterest}
                    onValueChange={val => setFormData(p => ({ ...p, projectInterest: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                      <SelectItem value="Villas">Villas</SelectItem>
                      <SelectItem value="Commercial Hub">Commercial Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4: Flat Type */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Flat Type Interest</Label>
                <Select
                  value={formData.flatTypeInterest}
                  onValueChange={val => setFormData(p => ({ ...p, flatTypeInterest: val }))}
                >
                  <SelectTrigger className="rounded-[10px] h-10">
                    <SelectValue placeholder="Select flat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1BHK">1BHK</SelectItem>
                    <SelectItem value="2BHK">2BHK</SelectItem>
                    <SelectItem value="3BHK">3BHK</SelectItem>
                    <SelectItem value="4BHK">4BHK</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="rounded-[10px] resize-none"
                />
              </div>
            </form>
          </div>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button
              type="submit"
              form="add-lead-form"
              disabled={addLoading}
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
            >
              {addLoading ? 'Adding...' : 'Add Lead'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-[10px] h-10 px-6"
              onClick={() => {
                setShowAddSheet(false);
                setFormData({
                  name: '', phone: '', email: '',
                  source: 'Direct', assignedUserId: '',
                  projectInterest: '',
                  flatTypeInterest: '', notes: ''
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT LEAD DIALOG */}
      <Dialog open={showEditSheet} onOpenChange={setShowEditSheet}>
        <DialogContent
          className="max-w-[560px] w-full rounded-2xl p-0 overflow-hidden max-h-[90vh]"
        >
          {/* Dark header */}
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">
                Edit Lead
              </DialogTitle>
              <p className="text-blue-300 text-sm mt-1">
                {selectedLead?.name} · {selectedLead?.phone}
              </p>
            </div>
            <button
              onClick={() => setShowEditSheet(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable form */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="px-6 py-5 space-y-4">
              {/* Row 1: Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    value={editForm.name}
                    onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone *</Label>
                  <Input
                    value={editForm.phone}
                    onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
              </div>

              {/* Row 2: Email + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={val => setEditForm(p => ({ ...p, status: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Site Visit Scheduled">Site Visit Scheduled</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Source + Broker */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Source</Label>
                  <Select
                    value={editForm.source}
                    onValueChange={val => setEditForm(p => ({ ...p, source: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meta">Meta</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="99acres">99acres</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Assigned Broker</Label>
                  <Select
                    value={editForm.assignedUserId}
                    onValueChange={val => setEditForm(p => ({ ...p, assignedUserId: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent>
                      {brokers.map(b => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4: Project + Flat Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Project Interest</Label>
                  <Select
                    value={editForm.projectInterest}
                    onValueChange={val => setEditForm(p => ({ ...p, projectInterest: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                      <SelectItem value="Villas">Villas</SelectItem>
                      <SelectItem value="Commercial Hub">Commercial Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Flat Type</Label>
                  <Select
                    value={editForm.flatTypeInterest}
                    onValueChange={val => setEditForm(p => ({ ...p, flatTypeInterest: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="4BHK">4BHK</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Notes</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="rounded-[10px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
              onClick={handleSaveEdit}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              className="rounded-[10px] h-10 px-6"
              onClick={() => setShowEditSheet(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SCHEDULE VISIT DIALOG */}
      <Dialog
        open={showScheduleDialog}
        onOpenChange={(open) => {
          setShowScheduleDialog(open);
          if (!open) {
            setSelectedLead(null);
            setVisitForm({
              flatId: '', visitDate: '',
              visitTime: '', brokerId: '', notes: ''
            });
          }
        }}
      >
        <DialogContent className="max-w-[480px] rounded-2xl p-0 overflow-hidden">
          <div className="bg-[#0A1628] px-6 py-5">
            <DialogTitle className="text-white text-lg font-semibold">
              Schedule Site Visit
            </DialogTitle>
            {selectedLead && (
              <p className="text-blue-300 text-sm mt-1">
                {selectedLead.name} · {selectedLead.phone}
              </p>
            )}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!visitForm.visitDate || !visitForm.visitTime) {
                toast({
                  title: 'Date and time required',
                  variant: 'destructive'
                });
                return;
              }

              const scheduledAt = new Date(
                visitForm.visitDate + 'T' + visitForm.visitTime + ':00'
              ).toISOString();

              const { error } = await supabase
                .from('site_visits')
                .insert({
                  lead_id: selectedLead.id,
                  flat_id: visitForm.flatId || null,
                  assigned_user_id:
                    visitForm.brokerId ||
                    selectedLead.assigned_user_id ||
                    null,
                  scheduled_at: scheduledAt,
                  status: 'Scheduled',
                  reminder_sent: false,
                  notes: visitForm.notes || null,
                  created_at: new Date().toISOString()
                });

              if (!error) {
                await supabase
                  .from('leads_customers')
                  .update({
                    status: 'Site Visit Scheduled',
                    last_activity: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', selectedLead.id);

                toast({
                  title: 'Visit scheduled!',
                  description: `${selectedLead.name} — ${
                    new Date(scheduledAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  } at ${visitForm.visitTime}`
                });
                setShowScheduleDialog(false);
                setSelectedLead(null);
                setVisitForm({
                  flatId: '', visitDate: '',
                  visitTime: '', brokerId: '', notes: ''
                });
              } else {
                toast({
                  title: 'Failed to schedule',
                  description: error.message,
                  variant: 'destructive'
                });
              }
            }}
            className="px-6 py-5 space-y-4"
          >
            <div className="space-y-1.5">
              <Label>Property (optional)</Label>
              <Select
                value={visitForm.flatId}
                onValueChange={val => setVisitForm(p => ({...p, flatId: val}))}
              >
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="Select flat" />
                </SelectTrigger>
                <SelectContent>
                  {availableFlats.map(f => (
                    <SelectItem key={f.flat_id} value={f.flat_id}>
                      {f.flat_number} — {f.project} ({f.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={visitForm.visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setVisitForm(p => ({ ...p, visitDate: e.target.value }))}
                  className="rounded-[10px]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={visitForm.visitTime}
                  onChange={e => setVisitForm(p => ({ ...p, visitTime: e.target.value }))}
                  className="rounded-[10px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Assign Broker</Label>
              <Select
                value={visitForm.brokerId}
                onValueChange={val => setVisitForm(p => ({ ...p, brokerId: val }))}
              >
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="Select broker" />
                </SelectTrigger>
                <SelectContent>
                  {brokers.map(b => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                placeholder="Special instructions..."
                value={visitForm.notes}
                onChange={e => setVisitForm(p => ({ ...p, notes: e.target.value }))}
                rows={2}
                className="rounded-[10px] resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
              >
                Confirm Visit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-[10px] h-10 px-6"
                onClick={() => {
                  setShowScheduleDialog(false);
                  setSelectedLead(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

### `app/sales/components/sales-sidebar.tsx`
```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Building2, CalendarCheck, BarChart3, Settings, Wallet, FileCheck, TrendingUp } from "lucide-react"
import Logo from "@/components/shared/Logo"

const menuGroups = [
  {
    label: "MAIN MENU",
    items: [
      { name: "Dashboard", path: "/sales", icon: LayoutDashboard },
      { name: "Leads", path: "/sales/leads", icon: Users },
      { name: "Site Visits", path: "/sales/visits", icon: CalendarCheck },
      { name: "Properties", path: "/sales/properties", icon: Building2 },
    ]
  },
  {
    label: "ANALYTICS & FINANCE",
    items: [
      { name: "Analytics", path: "/sales/analytics", icon: BarChart3 },
      { name: "Financial", path: "/sales/financial", icon: Wallet },
      { name: "Documents Verification", path: "/sales/documents", icon: FileCheck },
      { name: "Revenue Forecast", path: "/sales/forecast", icon: TrendingUp },
    ]
  }
]

export function SalesSidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <div 
      className="flex flex-col text-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '260px',
        zIndex: 100,
        overflowY: 'auto',
        background: 'linear-gradient(180deg, #0A1628 0%, #0F2044 50%, #0A1628 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.25)'
      }}
    >
      {/* Logo Area */}
      <Logo />

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto px-0 py-4 custom-scrollbar">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-6">
            <h4 className="px-6 mb-2" style={{ color: 'rgba(148,163,184,0.7)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {group.label}
            </h4>
            <nav className="flex flex-col gap-0.5 pr-4 pl-2">
              {group.items.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/sales' && pathname?.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center gap-3 py-2.5 pl-4 pr-3 text-sm font-medium transition-all duration-200 rounded-r-[10px]"
                    style={isActive ? {
                      background: 'rgba(99,102,241,0.25)', 
                      color: '#818CF8',
                      borderLeft: '3px solid #6366F1'
                    } : {
                      color: '#94A3B8',
                      borderLeft: '3px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.color = '#E2E8F0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#94A3B8';
                      }
                    }}
                  >
                    <item.icon className="h-5 w-5 shrink-0" style={{ color: isActive ? '#818CF8' : 'currentColor' }} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
      
      {/* Bottom Profile */}
      <div className="mt-auto p-5 flex items-center gap-3 bg-transparent" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] font-bold text-white shadow-sm ring-2 ring-white/10">
          {user?.firstName?.[0] || "U"}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm" style={{ color: 'white', fontWeight: 600 }}>
            {user?.firstName} {user?.lastName}
          </span>
          <div className="mt-0.5">
            <span 
              className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: 'rgba(99,102,241,0.3)',
                color: '#A5B4FC',
                border: '1px solid rgba(99,102,241,0.4)'
              }}
            >
              {user?.role || "BROKER"}
            </span>
          </div>
        </div>
        <button className="ml-auto text-slate-400 hover:text-white transition-colors">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
```

### `app/sales/documents/client.tsx`
```tsx
"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@/lib/supabase-browser'
import { 
  FileText, CheckCircle2, Clock, XCircle, Search, Calendar,
  Download, Eye, Check, X, FileCheck, FileWarning, AlertCircle,
  Plus, UploadCloud, Loader2
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/toast"

function getStatusStyle(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'verified': return { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 }
    case 'pending': return { bg: "bg-amber-100", text: "text-amber-700", icon: Clock }
    case 'reviewing': return { bg: "bg-blue-100", text: "text-blue-700", icon: AlertCircle }
    case 'rejected': return { bg: "bg-red-100", text: "text-red-700", icon: XCircle }
    default: return { bg: "bg-gray-100", text: "text-gray-700", icon: FileText }
  }
}

export default function DocumentsClient() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    leadId: '', documentType: 'Aadhaar Card'
  });

  const { toast } = useToast();
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    const channel = supabase
      .channel('documents-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => fetchData())
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: docsData } = await supabase
      .from('documents')
      .select(`
        *,
        lead:leads_customers(id, name),
        verified_by_user:users(id, name)
      `)
      .order('uploaded_at', { ascending: false });

    if (docsData) setDocuments(docsData);

    const { data: leadsData } = await supabase.from('leads_customers').select('id, name');
    if (leadsData) setLeads(leadsData);

    setLoading(false);
  };

  const uploadDocument = async () => {
    if (!formData.leadId || !formData.documentType) {
      toast({ title: 'Error', description: 'Please select lead and document type', variant: 'destructive' });
      return;
    }
    setUploading(true);
    
    // Simulate file upload delay
    await new Promise(r => setTimeout(r, 800));
    
    const mockUrl = `https://mock-storage.flowestate.local/docs/${formData.leadId}/${Date.now()}.pdf`;
    
    const { error } = await supabase
      .from('documents')
      .insert({
        lead_id: formData.leadId,
        document_type: formData.documentType,
        file_url: mockUrl,
        status: 'Pending'
      });
      
    setUploading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Document uploaded successfully' });
      setShowUploadDialog(false);
      setFormData({ leadId: '', documentType: 'Aadhaar Card' });
    }
  };

  const updateDocumentStatus = async (docId: string, status: string) => {
    // In a real app we'd get the current user ID for verified_by
    const { error } = await supabase
      .from('documents')
      .update({ 
        status,
        updated_at: new Date().toISOString()
        // verified_by: currentUserId -> mock omitted for now
      })
      .eq('id', docId);
      
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Document marked as ${status}` });
      if (selectedDoc?.id === docId) {
        setSelectedDoc({ ...selectedDoc, status });
      }
    }
  };

  const documentsDataUI = documents.map(d => ({
    ...d,
    leadName: d.lead?.name || 'Unknown Lead',
    dateStr: new Date(d.uploaded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    verifiedByName: d.verified_by_user?.name || '-',
    size: '1.2 MB'
  }));

  const filteredDocs = documentsDataUI.filter(d => 
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.leadName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDocs = documents.length;
  const verifiedDocs = documents.filter(d => d.status === 'Verified').length;
  const pendingDocs = documents.filter(d => d.status === 'Pending').length;
  const rejectedDocs = documents.filter(d => d.status === 'Rejected').length;

  if (loading) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 animate-pulse text-center pt-20">
         <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#0066FF]" />
         <p className="text-gray-500 mt-4 font-medium">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Document Verification</h1>
          <p className="text-[#64748B] text-sm mt-1">Review and approve KYC and property documents</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Docs", value: totalDocs, icon: FileText, color: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/30" },
            { label: "Verified", value: verifiedDocs, icon: FileCheck, color: "from-emerald-500 to-emerald-400", shadow: "shadow-emerald-500/30" },
            { label: "Pending", value: pendingDocs, icon: Clock, color: "from-amber-500 to-amber-400", shadow: "shadow-amber-500/30" },
            { label: "Rejected", value: rejectedDocs, icon: FileWarning, color: "from-red-500 to-red-400", shadow: "shadow-red-500/30" },
          ].map((kpi, i) => (
            <Card 
              key={i}
              className="overflow-hidden bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1]"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-[12px] bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-md ${kpi.shadow} shrink-0`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">{kpi.value}</h3>
                  <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em] mt-1">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FILTER BAR */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex-1 w-full flex flex-wrap gap-3">
            <div className="relative w-full md:max-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                 placeholder="Search lead or doc ID..." 
                 className="w-full pl-9 rounded-[10px] border-gray-200 bg-[#F8FAFC] focus:bg-white text-sm" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-[10px] bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold shadow-md">
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Lead Name</label>
                    <Select value={formData.leadId} onValueChange={v => setFormData({...formData, leadId: v})}>
                      <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                        <SelectValue placeholder="Select Lead..." />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(l => (
                          <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Document Type</label>
                    <Select value={formData.documentType} onValueChange={v => setFormData({...formData, documentType: v})}>
                      <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                        <SelectValue placeholder="Select Type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                        <SelectItem value="PAN Card">PAN Card</SelectItem>
                        <SelectItem value="Income Proof">Income Proof</SelectItem>
                        <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                        <SelectItem value="Sale Agreement">Sale Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-[12px] p-8 text-center bg-gray-50 flex flex-col items-center justify-center mt-2 cursor-pointer hover:bg-gray-100">
                    <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-semibold text-gray-600">Click to upload file</p>
                    <p className="text-xs text-gray-400">PDF, JPG or PNG (max. 10MB)</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)} className="rounded-[10px] font-semibold">Cancel</Button>
                  <Button onClick={uploadDocument} disabled={uploading} className="rounded-[10px] font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white">
                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Upload File
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* DOCUMENTS TABLE */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No documents found</h3>
          <p className="text-gray-500 mb-6">Upload documents to start verification.</p>
        </div>
      ) : (
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8FAFC] border-b border-gray-200">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] py-4 pl-6">Doc ID</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Lead Name</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Document Type</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Uploaded Date</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Status</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Verified By</TableHead>
                <TableHead className="text-right pr-6 text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc, index) => {
                const style = getStatusStyle(doc.status);
                const Icon = style.icon;
                
                return (
                  <TableRow key={doc.id} className="group hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-100 bg-white">
                    <TableCell className="pl-6 py-4">
                      <div className="font-bold text-[#0F172A] text-[13px]">{(doc.id || '').substring(0,8)}...</div>
                      <div className="text-[11px] text-gray-400 font-medium">{doc.size}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-[#0F172A] text-[14px]">{doc.leadName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-[13px] font-medium text-[#0F172A]">{doc.document_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] text-[#64748B] font-medium">{doc.dateStr}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${style.bg} ${style.text} shadow-none text-[11px] rounded-full font-bold uppercase tracking-wide px-2.5 flex items-center gap-1 w-fit`}>
                        <Icon className="w-3 h-3" /> {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-[13px] font-medium text-[#64748B]">{doc.verifiedByName}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-[8px] text-[#0066FF] hover:text-[#0052CC] hover:bg-blue-50 bg-[#F0F4F8] sm:bg-transparent"
                              onClick={() => setSelectedDoc(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none rounded-[20px] shadow-2xl">
                            <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
                              
                              {/* Left Side: Document Preview (60%) */}
                              <div className="w-full md:w-[60%] bg-[#E2E8F0] p-6 flex flex-col items-center justify-center relative">
                                <div className="absolute top-4 right-4">
                                  <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white text-[#0F172A] border-gray-200 rounded-[8px] h-8 shadow-sm">
                                    <Download className="w-4 h-4 mr-1.5" /> Download
                                  </Button>
                                </div>
                                  <div className="w-full max-w-[400px] aspect-[3/4] bg-white rounded-[12px] shadow-lg border border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                    <FileText className="w-16 h-16 mb-4 text-[#CBD5E1]" />
                                    <h3 className="text-lg font-bold text-[#0F172A]">{selectedDoc?.document_type}</h3>
                                    <p className="text-sm mt-1">{selectedDoc?.leadName}</p>
                                    <p className="text-xs mt-4 px-4 py-1.5 bg-gray-100 rounded-full">{(selectedDoc?.id || '').substring(0,8)}... • {selectedDoc?.size}</p>
                                  </div>
                              </div>

                              {/* Right Side: Details & Actions (40%) */}
                              <div className="w-full md:w-[40%] bg-white p-6 flex flex-col h-full overflow-y-auto">
                                <DialogHeader className="mb-6 text-left">
                                  <DialogTitle className="text-2xl font-bold text-[#0F172A]">Document Review</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6 flex-1">
                                  {/* Doc Info */}
                                  <div className="space-y-3 p-4 bg-[#F8FAFC] rounded-[12px] border border-gray-100">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                      <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Doc ID</span>
                                      <span className="text-[13px] font-bold text-[#0F172A]">{selectedDoc?.id?.substring(0,8)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                      <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Lead</span>
                                      <span className="text-[13px] font-bold text-[#0066FF]">{selectedDoc?.leadName}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                      <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Type</span>
                                      <span className="text-[13px] font-bold text-[#0F172A]">{selectedDoc?.document_type}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Current Status</span>
                                      <Badge className={`${getStatusStyle(selectedDoc?.status || '').bg} ${getStatusStyle(selectedDoc?.status || '').text} shadow-none text-[10px] rounded-[6px] font-bold uppercase`}>
                                        {selectedDoc?.status}
                                      </Badge>
                                    </div>
                                  </div>

                                  {/* Verification Checklist */}
                                  <div className="space-y-3">
                                    <h4 className="text-[13px] font-bold text-[#0F172A]">Verification Checklist</h4>
                                    <div className="space-y-2.5">
                                      {[
                                        "Name perfectly matches lead record",
                                        "Document is not expired",
                                        "Image is clear and legible",
                                        "All pages/corners are visible"
                                      ].map((item, i) => (
                                        <div key={i} className="flex items-start space-x-2">
                                          <Checkbox id={`check-${i}`} className="mt-0.5 border-gray-300 text-[#10B981] rounded-[4px] data-[state=checked]:bg-[#10B981] data-[state=checked]:border-[#10B981]" />
                                          <label htmlFor={`check-${i}`} className="text-[13px] font-medium text-[#64748B] leading-tight cursor-pointer">
                                            {item}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                                  <Button onClick={() => updateDocumentStatus(selectedDoc.id, 'Verified')} className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] shadow-sm font-semibold h-11" disabled={selectedDoc?.status === 'Verified'}>
                                    <Check className="w-4 h-4 mr-2" /> Approve Document
                                  </Button>
                                  <Button onClick={() => updateDocumentStatus(selectedDoc.id, 'Rejected')} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-[10px] font-semibold h-11" disabled={selectedDoc?.status === 'Rejected'}>
                                    <X className="w-4 h-4 mr-2" /> Reject
                                  </Button>
                                </div>
                              </div>

                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button onClick={() => updateDocumentStatus(doc.id, 'Verified')} disabled={doc.status === 'Verified'} variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-[#10B981] hover:text-[#059669] hover:bg-emerald-50 bg-[#F0FDF4] sm:bg-transparent disabled:opacity-50">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => updateDocumentStatus(doc.id, 'Rejected')} disabled={doc.status === 'Rejected'} variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-red-500 hover:text-red-700 hover:bg-red-50 bg-[#FEF2F2] sm:bg-transparent disabled:opacity-50">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
      )}

    </div>
  )
}
```

### `app/sales/documents/page.tsx`
```tsx
export const dynamic = 'force-dynamic';
import DocumentsClient from './client';

export default function DocumentsPage() {
  return <DocumentsClient />
}
```

### `app/sales/financial/client.tsx`
```tsx
"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@/lib/supabase-browser'
import { 
  Wallet, DollarSign, TrendingUp, Clock, Search, Plus, 
  ArrowDownRight, ArrowUpRight, FileText, CheckCircle2, 
  XCircle, Filter, Loader2, IndianRupee
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"

function getStatusStyle(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'completed': return { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 }
    case 'pending': return { bg: "bg-amber-100", text: "text-amber-700", icon: Clock }
    case 'failed': return { bg: "bg-red-100", text: "text-red-700", icon: XCircle }
    default: return { bg: "bg-gray-100", text: "text-gray-700", icon: FileText }
  }
}

export default function FinancialClient() {
  const [ledger, setLedger] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingLoading, setAddingLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    leadId: '', amount: '', type: 'Credit', receiptNo: '', status: 'Completed', notes: ''
  });

  const { toast } = useToast();
  const supabase = createBrowserClient();

  // Generate a random receipt number for the mock workflow
  const generateReceiptNo = () => `RCT-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    const channel = supabase
      .channel('financial-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_ledger' }, () => fetchData())
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: ledgerData, error } = await supabase
      .from('financial_ledger')
      .select(`
        *,
        lead:leads_customers(id, name, phone, project_interest)
      `)
      .order('transaction_date', { ascending: false });

    if (ledgerData) setLedger(ledgerData);

    const { data: leadsData } = await supabase.from('leads_customers').select('id, name, phone, project_interest').eq('status', 'Converted'); // Or any other appropriate filter
    if (leadsData) setLeads(leadsData);
    
    if(!leadsData || leadsData.length === 0) {
       // fallback generic leads
       const { data: allLeadsData } = await supabase.from('leads_customers').select('id, name, phone, project_interest').limit(50);
       if (allLeadsData) setLeads(allLeadsData);
    }

    setLoading(false);
  };

  const addPayment = async () => {
    if (!formData.leadId || !formData.amount) {
      toast({ title: 'Validation Error', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    
    setAddingLoading(true);
    
    const { error } = await supabase
      .from('financial_ledger')
      .insert({
        lead_id: formData.leadId,
        amount: parseFloat(formData.amount),
        type: formData.type,
        receipt_no: formData.receiptNo || generateReceiptNo(),
        status: formData.status,
        notes: formData.notes,
        transaction_date: new Date().toISOString()
      });
      
    setAddingLoading(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Payment recorded successfully' });
      setShowAddDialog(false);
      setFormData({ leadId: '', amount: '', type: 'Credit', receiptNo: '', status: 'Completed', notes: '' });
    }
  };

  const formatCur = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  // Compute stats
  const totalRevenue = ledger.filter(l => l.type === 'Credit' && l.status === 'Completed').reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  const pendingPayments = ledger.filter(l => l.status === 'Pending').reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  
  // Get active distinct deals based on completed payments (unique lead_id)
  const activeDeals = new Set(ledger.filter(l => l.type === 'Credit' && l.status === 'Completed' && l.lead_id).map(l => l.lead_id)).size;

  const filteredLedger = ledger.filter(l => 
    l.receipt_no?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 animate-pulse text-center pt-20">
         <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#0066FF]" />
         <p className="text-gray-500 mt-4 font-medium">Loading financial ledger...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Financial Ledger</h1>
          <p className="text-[#64748B] text-sm mt-1">Track all incoming payments, booking amounts, and pending dues</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Revenue", value: formatCur(totalRevenue), icon: IndianRupee, color: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/30" },
            { label: "Pending Payments", value: formatCur(pendingPayments), icon: Clock, color: "from-amber-500 to-amber-400", shadow: "shadow-amber-500/30" },
            { label: "Active Deals", value: activeDeals.toString(), icon: TrendingUp, color: "from-emerald-500 to-emerald-400", shadow: "shadow-emerald-500/30" },
            { label: "Recent Txns", value: ledger.length > 50 ? "50+" : ledger.length.toString(), icon: Wallet, color: "from-purple-600 to-purple-400", shadow: "shadow-purple-500/30" },
          ].map((kpi, i) => (
            <Card 
              key={i}
              className="overflow-hidden bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1]"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-[12px] bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-md ${kpi.shadow} shrink-0`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-[#0F172A] leading-none">{kpi.value}</h3>
                  <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em] mt-1">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FILTER BAR */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex-1 w-full flex flex-wrap gap-3">
            <div className="relative w-full md:max-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                 placeholder="Search by receipt or name..." 
                 className="w-full pl-9 rounded-[10px] border-gray-200 bg-[#F8FAFC] focus:bg-white text-sm" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-[10px] border-gray-200 bg-white text-[#64748B]">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-[10px] bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold shadow-md">
                  <Plus className="mr-2 h-4 w-4" /> Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Record New Payment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Lead / Customer</label>
                    <Select value={formData.leadId} onValueChange={v => setFormData({...formData, leadId: v})}>
                      <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                        <SelectValue placeholder="Select Customer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(l => (
                          <SelectItem key={l.id} value={l.id}>{l.name} - {l.project_interest || 'General'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Amount (₹)</label>
                    <Input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="500000" className="rounded-[10px] border-gray-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Transaction Type</label>
                      <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                        <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                          <SelectValue placeholder="Type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Credit">Credit IN</SelectItem>
                          <SelectItem value="Debit">Debit OUT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Status</label>
                      <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                        <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                          <SelectValue placeholder="Status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Receipt No (Optional)</label>
                    <Input value={formData.receiptNo} onChange={e => setFormData({...formData, receiptNo: e.target.value})} placeholder="Auto-generated if left blank" className="rounded-[10px] border-gray-200" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-[10px] font-semibold">Cancel</Button>
                  <Button onClick={addPayment} disabled={addingLoading} className="rounded-[10px] font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white">
                    {addingLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* LEDGER TABLE */}
      {filteredLedger.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No transactions found</h3>
          <p className="text-gray-500 mb-6">Record your first payment to see it here.</p>
        </div>
      ) : (
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8FAFC] border-b border-gray-200">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] py-4 pl-6">Receipt No</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Date</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Customer</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Project</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Type</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Status</TableHead>
                <TableHead className="text-right pr-6 text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLedger.map((txn, index) => {
                const style = getStatusStyle(txn.status);
                const Icon = style.icon;
                const dateStr = new Date(txn.transaction_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                const isCredit = txn.type === 'Credit';
                
                return (
                  <TableRow key={txn.id} className="group hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-100 bg-white">
                    <TableCell className="pl-6 py-4">
                      <div className="font-bold text-[#0F172A] text-[13px]">{txn.receipt_no}</div>
                      <div className="text-[11px] text-gray-400 font-medium">Txn ID: {(txn.id || '').substring(0,8)}...</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] text-[#64748B] font-medium">{dateStr}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-[#0F172A] text-[14px]">{txn.lead?.name || 'Unknown'}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{txn.lead?.phone || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[13px] font-medium text-[#0F172A]">{txn.lead?.project_interest || 'General'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-medium text-[13px]">
                         {isCredit ? (
                           <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                         ) : (
                           <ArrowUpRight className="w-4 h-4 text-red-500" />
                         )}
                         <span className={isCredit ? 'text-emerald-600' : 'text-red-600'}>
                           {txn.type}
                         </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${style.bg} ${style.text} shadow-none text-[11px] rounded-full font-bold uppercase tracking-wide px-2.5 flex items-center gap-1 w-fit`}>
                        <Icon className="w-3 h-3" /> {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className={`font-bold text-[15px] ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isCredit ? '+' : '-'}{formatCur(txn.amount)}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
      )}

    </div>
  )
}
```

### `app/sales/financial/page.tsx`
```tsx
export const dynamic = 'force-dynamic';
import FinancialClient from './client';

export default function FinancialPage() {
  return <FinancialClient />
}
```

### `app/sales/forecast/page.tsx`
```tsx
"use client"

import { useState } from "react"
import { 
  TrendingUp, AlertTriangle, ArrowUpRight, BarChart3, 
  Calendar, Building2, Target, CheckCircle2
} from "lucide-react"
import { 
  ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// --- Mock Data ---

const forecastData = [
  { name: 'Jan', actual: 45, projected: 45, pipeline: 0 },
  { name: 'Feb', actual: 52, projected: 52, pipeline: 0 },
  { name: 'Mar', actual: 38, projected: 40, pipeline: 15 },
  { name: 'Apr', actual: 0, projected: 65, pipeline: 45 },
  { name: 'May', actual: 0, projected: 78, pipeline: 60 },
  { name: 'Jun', actual: 0, projected: 85, pipeline: 80 },
  { name: 'Jul', actual: 0, projected: 72, pipeline: 90 },
  { name: 'Aug', actual: 0, projected: 90, pipeline: 110 },
  { name: 'Sep', actual: 0, projected: 105, pipeline: 140 },
  { name: 'Oct', actual: 0, projected: 95, pipeline: 160 },
  { name: 'Nov', actual: 0, projected: 110, pipeline: 180 },
  { name: 'Dec', actual: 0, projected: 125, pipeline: 210 },
]

const projectForecastData = [
  { name: 'Tower A', units: 14, potential: '₹8.4Cr', expected: 'Q2 2026', probability: 75 },
  { name: 'Tower B', units: 22, potential: '₹12.5Cr', expected: 'Q3 2026', probability: 60 },
  { name: 'Villas', units: 6, potential: '₹9.8Cr', expected: 'Q4 2026', probability: 45 },
  { name: 'Commercial Phase 1', units: 10, potential: '₹15.0Cr', expected: 'Q1 2027', probability: 30 },
]

const pipelineStages = [
  { name: 'Awareness / New', count: 124, value: '₹42.5Cr', percentage: 100, color: 'bg-blue-200' },
  { name: 'Contacted / Engaged', count: 86, value: '₹28.4Cr', percentage: 70, color: 'bg-blue-400' },
  { name: 'Site Visit', count: 42, value: '₹15.2Cr', percentage: 45, color: 'bg-indigo-500' },
  { name: 'Negotiation', count: 18, value: '₹7.8Cr', percentage: 25, color: 'bg-purple-600' },
  { name: 'Closing', count: 6, value: '₹3.2Cr', percentage: 10, color: 'bg-emerald-500' },
]

export default function ForecastPage() {
  const [viewState, setViewState] = useState("monthly")

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* SECTION 1 - HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Revenue Forecast</h1>
          <p className="text-[#64748B] text-sm mt-1">Predictive analysis and pipeline health monitor</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Projected Annual", value: "₹13.58Cr", icon: Target, color: "text-[#0066FF]", bg: "bg-blue-50" },
            { label: "Confirmed Pipeline", value: "₹9.45Cr", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "At Risk Revenue", value: "₹2.10Cr", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
            { label: "Upside Potential", value: "₹4.13Cr", icon: ArrowUpRight, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((kpi, i) => (
            <Card key={i} className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden group hover:border-[#CBD5E1] transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-[12px] ${kpi.bg}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-[32px] font-bold text-[#0F172A] leading-none mb-1">{kpi.value}</h3>
                  <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 2 - COMPOSED CHART */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-[#0F172A] text-[18px]">Revenue Trajectory</h3>
            <p className="text-[12px] text-[#64748B]">Actuals vs Projections vs Pipeline coverage (in Lakhs)</p>
          </div>
          <Tabs value={viewState} onValueChange={setViewState}>
            <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-10">
              <TabsTrigger value="monthly" className="rounded-[8px] px-4 text-[12px] font-bold">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly" className="rounded-[8px] px-4 text-[12px] font-bold">Quarterly</TabsTrigger>
              <TabsTrigger value="annual" className="rounded-[8px] px-4 text-[12px] font-bold">Annual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardContent className="p-6">
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(value) => `₹${value}L`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  cursor={{ fill: '#F8FAFC' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
                
                <Area type="monotone" dataKey="projected" name="Projected Trajectory" fill="url(#colorProjected)" stroke="#0066FF" strokeWidth={2} strokeDasharray="5 5" />
                <Bar dataKey="actual" name="Actual Closed" barSize={32} fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pipeline" name="Weighted Pipeline" barSize={32} fill="#CBD5E1" radius={[4, 4, 0, 0]} stackId="a" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3 - TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col (2/3) - Project Wise Table */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A] text-[16px] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0066FF]" /> Project-wise Forecast
              </h3>
            </div>
            <div className="overflow-x-auto flex-1 p-0">
              <Table>
                <TableHeader className="bg-white border-b border-gray-100">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] py-4 pl-6">Project Area</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Units Left</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-right">Potential Revenue</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Expected Close</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-right pr-6">Win Probability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectForecastData.map((proj, idx) => (
                    <TableRow key={idx} className="hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-50">
                      <TableCell className="pl-6 py-4">
                        <span className="font-bold text-[#0F172A] text-[14px]">{proj.name}</span>
                      </TableCell>
                      <TableCell className="text-center font-medium text-[#64748B]">{proj.units}</TableCell>
                      <TableCell className="text-right font-bold text-[#0066FF] text-[14px]">{proj.potential}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[10px] rounded-[6px] border-gray-200 bg-[#F8FAFC] font-bold text-gray-600">{proj.expected}</Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-[13px] font-bold text-[#0F172A]">{proj.probability}%</span>
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${proj.probability > 70 ? 'bg-emerald-500' : proj.probability > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                              style={{ width: `${proj.probability}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Right Col (1/3) - Pipeline Stages */}
        <div className="space-y-6">
          <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] h-full flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-[#0F172A] text-[16px] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" /> Pipeline by Stage
              </h3>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col justify-center">
              <div className="space-y-6">
                {pipelineStages.map((stage, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[13px] font-bold text-[#0F172A]">{stage.name}</p>
                        <p className="text-[11px] font-semibold text-[#64748B]">{stage.count} active deals</p>
                      </div>
                      <p className="text-[14px] font-bold text-[#0066FF]">{stage.value}</p>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stage.color} rounded-full transition-all duration-1000 ease-out`} 
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 4 - ASSUMPTIONS & NOTES */}
      <Card className="bg-gradient-to-br from-[#F8FAFC] to-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Methodology & Assumptions</h3>
              <p className="text-[12px] text-[#64748B]">Basis for the current projection model</p>
            </div>
            <Button variant="outline" className="h-8 rounded-[8px] bg-white border-gray-200 text-[#0F172A] font-semibold text-[12px]">
              <Calendar className="w-3.5 h-3.5 mr-1.5" /> Update Forecast
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-[13px] font-medium text-[#64748B] list-disc pl-5">
              <li>Weighted pipeline applies historical conversion rates (8.1%) to current active deals.</li>
              <li>Expected close dates are based on median sales cycle length (23 days).</li>
            </ul>
            <ul className="space-y-2 text-[13px] font-medium text-[#64748B] list-disc pl-5">
              <li>Excludes verbal commitments until minimum token amount (₹1L) is received.</li>
              <li>Last model calibration: <span className="font-bold text-[#0F172A]">Mar 15, 2026</span>.</li>
            </ul>
          </div>
        </div>
      </Card>

    </div>
  )
}
```

### `app/sales/inventory/actions.ts`
```typescript
"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function updateFlatStatusAction(flatId: string, status: string) {
  const { data, error } = await supabase
    .from("flats_inventory")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("flat_id", flatId)
    .select()
    .single()

  if (error) {
    console.error("Failed to update flat status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/sales/inventory")
  return { success: true, data }
}
```

### `app/sales/inventory/components/inventory-client.tsx`
```tsx
"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NativeSelect as Select } from "@/components/ui/native-select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { updateFlatStatusAction } from "../actions"

type Flat = {
  flat_id: string
  project: string
  flat_number: string
  type: string
  floor: number
  area_sqft: number
  price: number
  status: string
  updated_at: string
}

const statusColors: Record<string, any> = {
  "Available": "success",
  "On Hold": "warning",
  "Sold": "destructive"
}

export function InventoryClient({ initialData }: { initialData: Flat[] }) {
  const [data, setData] = useState<Flat[]>(initialData)
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterProject, setFilterProject] = useState("All")
  
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null)
  const [newStatus, setNewStatus] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  
  const { toast } = useToast()

  const projects = useMemo(() => {
    const list = Array.from(new Set(data.map(f => f.project)))
    return list.sort()
  }, [data])

  const filteredData = data.filter(flat => {
    if (filterStatus !== "All" && flat.status !== filterStatus) return false
    if (filterProject !== "All" && flat.project !== filterProject) return false
    return true
  })

  function openStatusDialog(flat: Flat) {
    setSelectedFlat(flat)
    setNewStatus(flat.status)
  }

  async function handleUpdateStatus() {
    if (!selectedFlat) return
    setIsUpdating(true)
    
    const res = await updateFlatStatusAction(selectedFlat.flat_id, newStatus)
    
    if (res.success) {
      setData(data.map(f => f.flat_id === selectedFlat.flat_id ? { ...f, status: newStatus } : f))
      toast({ title: "Status updated successfully" })
      setSelectedFlat(null)
    } else {
      toast({ title: "Update failed", description: res.error, variant: "destructive" })
    }
    
    setIsUpdating(false)
  }

  // Format currency
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(amount)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant={filterStatus === "All" ? "default" : "outline"} 
              onClick={() => setFilterStatus("All")}
            >
              All
            </Button>
            <Button 
              variant={filterStatus === "Available" ? "default" : "outline"} 
              className={filterStatus === "Available" ? "bg-emerald-500 hover:bg-emerald-600 border-transparent text-white dark:bg-emerald-600 dark:hover:bg-emerald-700" : ""}
              onClick={() => setFilterStatus("Available")}
            >
              Available
            </Button>
            <Button 
              variant={filterStatus === "On Hold" ? "default" : "outline"} 
              className={filterStatus === "On Hold" ? "bg-amber-500 hover:bg-amber-600 border-transparent text-white dark:bg-amber-600 dark:hover:bg-amber-700" : ""}
              onClick={() => setFilterStatus("On Hold")}
            >
              On Hold
            </Button>
            <Button 
              variant={filterStatus === "Sold" ? "default" : "outline"} 
              className={filterStatus === "Sold" ? "bg-red-500 hover:bg-red-600 border-transparent text-white dark:bg-red-600 dark:hover:bg-red-700" : ""}
              onClick={() => setFilterStatus("Sold")}
            >
              Sold
            </Button>
          </div>

          <div className="ml-0 sm:ml-4 w-48">
            <Select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </div>
        </div>
        
        <div className="flex items-center text-sm font-medium text-slate-500">
          Showing {filteredData.length} units
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.map(flat => (
          <Card 
            key={flat.flat_id} 
            className="cursor-pointer hover:shadow-md transition-shadow group relative overflow-hidden"
            onClick={() => openStatusDialog(flat)}
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${flat.status === 'Available' ? 'bg-emerald-500' : flat.status === 'On Hold' ? 'bg-amber-500' : 'bg-red-500'}`} />
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="uppercase tracking-wider text-xs mb-1">{flat.project}</CardDescription>
                  <CardTitle className="text-xl">{flat.flat_number}</CardTitle>
                </div>
                <Badge variant={statusColors[flat.status] || "default"}>{flat.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mt-2">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs text-muted-foreground">Type</span>
                  <span className="font-medium">{flat.type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs text-muted-foreground">Floor</span>
                  <span className="font-medium">{flat.floor}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs text-muted-foreground">Area</span>
                  <span className="font-medium">{flat.area_sqft} sqft</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs text-muted-foreground">Price</span>
                  <span className="font-medium">{formatINR(flat.price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No inventory found matching criteria.
          </div>
        )}
      </div>

      {/* Status Update Dialog */}
      <Dialog open={!!selectedFlat} onOpenChange={(v) => { if(!v) setSelectedFlat(null) }}>
        {selectedFlat && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Inventory Status</DialogTitle>
              <DialogDescription>
                Flat {selectedFlat.flat_number} from {selectedFlat.project} is currently {selectedFlat.status}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Label className="mb-2 block">New Status</Label>
              <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Available">Available</option>
                <option value="On Hold">On Hold</option>
                <option value="Sold">Sold</option>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedFlat(null)} disabled={isUpdating}>Cancel</Button>
              <Button onClick={handleUpdateStatus} disabled={isUpdating || newStatus === selectedFlat.status}>
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
```

### `app/sales/inventory/page.tsx`
```tsx
import { supabase } from "@/lib/supabase"
import { InventoryClient } from "./components/inventory-client"

export const dynamic = "force-dynamic"

export default async function InventoryPage() {
  const { data: inventory, error } = await supabase
    .from("flats_inventory")
    .select("*")
    .order("project")
    .order("flat_number")

  if (error) {
    console.error("Error fetching inventory:", error)
    return <div className="p-4 text-red-500">Failed to load inventory data.</div>
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Inventory</h1>
        <p className="text-slate-500 text-sm">Manage flat availability and view real-time status.</p>
      </div>

      <InventoryClient initialData={inventory || []} />
    </div>
  )
}
```

### `app/sales/layout.tsx`
```tsx
import { ReactNode } from "react"
import { SalesSidebar } from "./components/sales-sidebar"
import { Bell, Plus, Search, Grid3X3, HelpCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function SalesLayout({ children }: { children: ReactNode }) {
  const user = { firstName: "Demo", lastName: "Mode", role: "BROKER" }

  return (
    <div 
      className="flex font-sans text-[#0F172A] min-h-screen" 
      style={{ background: '#FAFBFC' }}
    >
      <SalesSidebar user={user} />
      
      <div className="flex-1 flex flex-col pl-[260px] relative">
        <header 
          className="flex shrink-0 items-center justify-between px-6"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 90,
            background: 'rgba(255,255,255,0.95)',
            borderBottom: '1px solid #E8ECF0',
            boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
            height: '64px'
          }}
        >
          {/* Breadcrumb Left */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 hidden md:flex">
            <span>Home</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span>Sales</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-bold">Dashboard</span>
          </div>

          {/* Global Search Center */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-[#0066FF] transition-colors" />
              <input 
                type="text" 
                placeholder="Search leads, flats, contacts..." 
                className="w-full h-9 bg-gray-100/80 border-transparent rounded-full pl-9 pr-4 text-sm focus:border-[#0066FF] focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 gap-2 hidden sm:flex h-9">
                  <Plus className="h-4 w-4" />
                  <span className="tracking-wide">Add Lead</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-[480px] overflow-y-auto rounded-l-[16px]">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl font-bold text-[#0F172A]">Add New Lead</SheetTitle>
                  <SheetDescription className="text-slate-500">
                    Fill in the details below. A WhatsApp brochure will be sent automatically.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[13px] font-medium text-gray-700">Full Name <span className="text-red-500">*</span></Label>
                    <Input id="name" placeholder="E.g. Rajesh Kumar" required className="rounded-[10px] border-gray-200 focus:border-[#0066FF] focus:ring-[#0066FF]/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[13px] font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" required className="rounded-[10px] border-gray-200 focus:border-[#0066FF] focus:ring-[#0066FF]/20" />
                  </div>
                  {/* ... Separator internal to form if needed ... */}
                  <hr className="border-gray-100" />
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[13px] font-medium text-gray-700">Email Address</Label>
                    <Input id="email" type="email" placeholder="rajesh@example.com" className="rounded-[10px] border-gray-200 focus:border-[#0066FF] focus:ring-[#0066FF]/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-gray-700">Lead Source</Label>
                    <Select defaultValue="meta">
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue placeholder="Select a source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meta">Meta Ads</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="99acres">99acres</SelectItem>
                        <SelectItem value="direct">Direct Walk-in</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-gray-700">Assigned Broker</Label>
                    <Select defaultValue="me">
                      <SelectTrigger className="rounded-[10px]">
                        <SelectValue placeholder="Select broker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="me">Demo Mode (Me)</SelectItem>
                        <SelectItem value="amit">Amit Singh</SelectItem>
                        <SelectItem value="neha">Neha Gupta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-[13px] font-medium text-gray-700">Notes & Requirements</Label>
                    <textarea 
                      id="notes" 
                      className="flex min-h-[100px] w-full rounded-[10px] border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all shadow-sm"
                      placeholder="Enter any initial preferences or requirements..."
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-6">
                  <Button type="submit" className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold h-12 text-[15px] rounded-[10px] shadow-md shadow-blue-500/20">
                    Add Lead & Send Brochure
                  </Button>
                  <p className="text-xs text-center text-slate-500">
                    WhatsApp brochure will be sent instantly
                  </p>
                </div>
              </SheetContent>
            </Sheet>

            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
            
            <button className="text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 hidden sm:flex">
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button className="relative text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 flex h-[14px] min-w-[14px] px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                3
              </span>
            </button>
            <button className="text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 hidden sm:flex">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] text-white font-bold shadow-sm ml-1 ring-2 ring-white cursor-pointer hover:ring-blue-100 transition-all">
              {user.firstName[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### `app/sales/leads/actions.ts`
```typescript
"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function createLeadAction(formData: FormData) {
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const source = formData.get("source") as string
  const assigned_broker = formData.get("assigned_broker") as string

  // Insert into DB
  const { data, error } = await supabase
    .from("leads_customers")
    .insert([
      {
        name,
        phone,
        email: email || null,
        source,
        assigned_broker_id: assigned_broker, // Storing broker name/id here
        status: "New"
      }
    ])
    .select()
    .single()

  if (error) {
    console.error("Failed to insert lead:", error)
    return { success: false, error: error.message }
  }

  // Determine the baseline URL to trigger the webhook
  // In a real app this would be an env var like process.env.NEXT_PUBLIC_APP_URL
  const headersList = headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  // Trigger Lead Created Webhook
  try {
    fetch(`${baseUrl}/api/webhooks/lead-created`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead: data })
    })
  } catch(e) {
    console.error("Webhook trigger failed", e)
  }

  revalidatePath("/sales/leads")
  return { success: true, data }
}

export async function updateLeadStatusAction(id: string, status: string) {
  const { error } = await supabase
    .from("leads_customers")
    .update({ status })
    .eq("id", id)

  if (error) {
    console.error("Failed to update status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/sales/leads")
  return { success: true }
}
```

### `app/sales/leads/components/leads-client.tsx`
```tsx
"use client"

import { useState } from "react"
import { createLeadAction, updateLeadStatusAction } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { NativeSelect as Select } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/toast"
import { Search, Plus } from "lucide-react"

type Lead = {
  id: string
  name: string
  phone: string
  email: string | null
  source: string
  status: string
  assigned_broker_id: string
  created_at: string
}

const statusColors: Record<string, any> = {
  "New": "default",
  "Contacted": "secondary",
  "Site Visit Scheduled": "warning",
  "Negotiation": "warning",
  "Converted": "success",
  "Lost": "destructive"
}

export function LeadsClient({ initialData, currentBrokerName }: { initialData: Lead[], currentBrokerName: string }) {
  const [data, setData] = useState<Lead[]>(initialData)
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterSource, setFilterSource] = useState("All")
  const [search, setSearch] = useState("")

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmiting, setIsSubmitting] = useState(false)

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  const { toast } = useToast()

  const filteredData = data.filter(lead => {
    if (filterStatus !== "All" && lead.status !== filterStatus) return false
    if (filterSource !== "All" && lead.source !== filterSource) return false
    if (search && !lead.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const res = await createLeadAction(formData)
    if (res.success) {
      toast({ title: "Lead created successfully", variant: "default" })
      // Optimistic update wrapper since revalidatePath doesn't immediately push new data if not refreshed yet
      setData([res.data, ...data])
      setIsAddOpen(false)
    } else {
      toast({ title: "Error creating lead", description: res.error, variant: "destructive" })
    }
    setIsSubmitting(false)
  }

  async function handleStatusChange(leadId: string, newStatus: string) {
    const res = await updateLeadStatusAction(leadId, newStatus)
    if (res.success) {
      setData(data.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null)
      toast({ title: "Status updated" })
    } else {
      toast({ title: "Update failed", description: res.error, variant: "destructive" })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="relative max-w-sm w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search by name..." 
              className="pl-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Site Visit Scheduled">Site Visit Scheduled</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </Select>

          <Select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="w-40">
            <option value="All">All Sources</option>
            <option value="Meta">Meta</option>
            <option value="Google">Google</option>
            <option value="99acres">99acres</option>
            <option value="Direct">Direct</option>
          </Select>
        </div>
        
        <Button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-950 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Broker</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-slate-500">No leads found.</TableCell>
              </TableRow>
            ) : filteredData.map(lead => (
              <TableRow key={lead.id} onClick={() => setSelectedLead(lead)} className="cursor-pointer">
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell><Badge variant="outline">{lead.source}</Badge></TableCell>
                <TableCell><Badge variant={statusColors[lead.status] || "default"}>{lead.status}</Badge></TableCell>
                <TableCell className="text-slate-500">{lead.assigned_broker_id || "Unassigned"}</TableCell>
                <TableCell className="text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" required placeholder="+91 9999999999" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address <span className="text-slate-400 font-normal">(optional)</span></Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source">Source</Label>
                <Select id="source" name="source" defaultValue="Direct">
                  <option value="Direct">Direct</option>
                  <option value="Meta">Meta</option>
                  <option value="Google">Google</option>
                  <option value="99acres">99acres</option>
                </Select>
              </div>
              <input type="hidden" name="assigned_broker" value={currentBrokerName} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSubmiting}>Cancel</Button>
              <Button type="submit" disabled={isSubmiting}>{isSubmiting ? "Saving..." : "Add Lead"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lead Detail Sheet */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => { if (!open) setSelectedLead(null) }}>
        {selectedLead && (
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-2xl">{selectedLead.name}</SheetTitle>
              <SheetDescription>Created on {new Date(selectedLead.created_at).toLocaleString()}</SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-slate-500">Phone</Label>
                  <div className="font-medium">{selectedLead.phone}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-slate-500">Email</Label>
                  <div className="font-medium">{selectedLead.email || "-"}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-slate-500">Source</Label>
                  <div><Badge variant="outline">{selectedLead.source}</Badge></div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-slate-500">Broker</Label>
                  <div className="font-medium">{selectedLead.assigned_broker_id || "Unassigned"}</div>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h4 className="font-semibold mb-4 text-lg">Update Status</h4>
                <div className="grid gap-2">
                  <Label>Current Status</Label>
                  <Select 
                    value={selectedLead.status} 
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 right-6">
              <Button variant="outline" onClick={() => setSelectedLead(null)}>Close</Button>
            </div>
          </SheetContent>
        )}
      </Sheet>

    </div>
  )
}
```

### `app/sales/leads/page.tsx`
```tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/toast';
import { 
  Users, UserPlus, PhoneCall, Calendar, CheckCircle2, 
  Search, Download, Plus, Eye, MessageCircle, Edit, Trash2,
  MapPin, Phone, Building2, Loader2, Filter, XCircle, FileText
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

const LEAD_STATUSES = [
  { value: 'New', color: 'blue' },
  { value: 'Contacted', color: 'yellow' },
  { value: 'Site Visit Scheduled', color: 'purple' },
  { value: 'Negotiation', color: 'orange' },
  { value: 'Converted', color: 'green' },
  { value: 'Lost', color: 'red' }
];

function getStatusColor(status: string) {
  switch ((status||'').toLowerCase()) {
    case 'new': return "bg-blue-100 text-[#0066FF] border-none"
    case 'contacted': return "bg-yellow-100 text-yellow-700 border-none"
    case 'site visit scheduled': case 'site visit': return "bg-purple-100 text-purple-700 border-none"
    case 'negotiation': return "bg-orange-100 text-orange-700 border-none"
    case 'converted': return "bg-green-100 text-green-700 border-none"
    case 'lost': return "bg-red-100 text-red-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

function getSourceColor(source: string) {
  switch ((source||'').toLowerCase()) {
    case 'meta': return "bg-indigo-100 text-indigo-700 border-none"
    case 'google': return "bg-orange-100 text-orange-700 border-none"
    case '99acres': return "bg-teal-100 text-teal-700 border-none"
    case 'direct': return "bg-slate-100 text-slate-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

export default function LeadsPage() {
  const { toast } = useToast();
  const supabase = createBrowserClient();
  
  const [leads, setLeads] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [brokerFilter, setBrokerFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Add lead sheet state
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Direct',
    assignedUserId: '',
    projectInterest: '',
    flatTypeInterest: '',
    notes: ''
  });

  // Edit lead sheet state
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: '', phone: '', email: '',
    source: '', assignedUserId: '',
    projectInterest: '', flatTypeInterest: '',
    notes: '', status: ''
  });

  // Schedule Visit state
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedLeadForVisit, setSelectedLeadForVisit] = useState<any | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [visitForm, setVisitForm] = useState({
    flatId: '',
    visitDate: '',
    visitTime: '',
    brokerId: '',
    notes: ''
  });
  const [availableFlats, setAvailableFlats] = useState<any[]>([]);

  useEffect(() => {
    fetchLeads();
    fetchBrokers();
    fetchAvailableFlats();

    const channel = supabase
      .channel('leads-page-' + Date.now())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads_customers'
      }, (payload) => {
        console.log('Lead change detected:', payload.eventType);
        fetchLeads(); // Refetch all leads
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('leads_customers')
      .select(`
        *,
        assigned_user:users(
          id, name, avatar_initials
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Leads fetch error:', error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setLeads(data || []);
    setLoading(false);
  };

  const fetchBrokers = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, name, avatar_initials, role')
      .in('role', ['BROKER', 'VP_SALES', 'MD', 'ADMIN']);
    setBrokers(data || []);
  };

  const fetchAvailableFlats = async () => {
    const { data } = await supabase
      .from('flats_inventory')
      .select('flat_id, flat_number, project, type, price')
      .in('status', ['Available', 'On Hold'])
      .order('project')
      .order('flat_number');
    setAvailableFlats(data || []);
  };

  // Filtered leads using useMemo
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !searchQuery ||
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        lead.status === statusFilter;

      const matchesSource = sourceFilter === 'all' ||
        lead.source === sourceFilter;

      const matchesBroker = brokerFilter === 'all' ||
        lead.assigned_user_id === brokerFilter;

      const matchesDateFrom = !dateFrom ||
        new Date(lead.created_at) >= new Date(dateFrom);

      const matchesDateTo = !dateTo ||
        new Date(lead.created_at) <= new Date(dateTo);

      return matchesSearch && matchesStatus &&
        matchesSource && matchesBroker &&
        matchesDateFrom && matchesDateTo;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter, brokerFilter, dateFrom, dateTo]);

  // KPI stats from real data
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const contacted = leads.filter(l => l.status === 'Contacted').length;
  const siteVisits = leads.filter(l => l.status?.includes('Site Visit')).length;
  const converted = leads.filter(l => l.status === 'Converted').length;

  // Add lead function
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Validation Error',
        description: 'Name and phone are required',
        variant: 'destructive'
      });
      return;
    }

    setAddLoading(true);

    const { data, error } = await supabase
      .from('leads_customers')
      .insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        source: formData.source || 'Direct',
        status: 'New',
        assigned_user_id: formData.assignedUserId || null,
        project_interest: formData.projectInterest || null,
        flat_type_interest: formData.flatTypeInterest || null,
        notes: formData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      })
      .select('*, assigned_user:users(id, name, avatar_initials)')
      .single();

    if (error) {
      toast({
        title: 'Error adding lead',
        description: error.message,
        variant: 'destructive'
      });
      setAddLoading(false);
      return;
    }

    // Add new lead to state immediately
    setLeads(prev => [data, ...prev]);

    toast({
      title: 'Lead added successfully',
      description: `${formData.name} has been added`
    });

    setFormData({
      name: '', phone: '', email: '',
      source: 'Direct', assignedUserId: '',
      projectInterest: '', flatTypeInterest: '',
      notes: ''
    });
    setShowAddSheet(false);
    setAddLoading(false);
  };

  // Update lead status
  const updateLeadStatus = async (id: string, status: string) => {
    // Optimistic UI update
    setLeads(prev => prev.map(l => 
      l.id === id ? { ...l, status, last_activity: new Date().toISOString() } : l
    ));

    const { error } = await supabase
      .from('leads_customers')
      .update({
        status,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      fetchLeads(); // Fallback on error
    } else {
      toast({ title: `Status updated to ${status}` });
    }
  };

  // Edit handlers
  const handleEditClick = (lead: any) => {
    setEditingLead(lead);
    setEditForm({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      source: lead.source || '',
      assignedUserId: lead.assigned_user_id || '',
      projectInterest: lead.project_interest || '',
      flatTypeInterest: lead.flat_type_interest || '',
      notes: lead.notes || '',
      status: lead.status || 'New'
    });
    setShowEditSheet(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    // Optimistic UI update
    setLeads(prev => prev.map(l =>
      l.id === editingLead.id
        ? {
            ...l,
            name: editForm.name,
            phone: editForm.phone,
            email: editForm.email,
            source: editForm.source,
            status: editForm.status,
            assigned_user_id: editForm.assignedUserId,
            notes: editForm.notes,
            project_interest: editForm.projectInterest,
            flat_type_interest: editForm.flatTypeInterest,
            updated_at: new Date().toISOString()
          }
        : l
    ));

    setShowEditSheet(false);
    setEditingLead(null);

    const { error } = await supabase
      .from('leads_customers')
      .update({
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email || null,
        source: editForm.source,
        status: editForm.status,
        assigned_user_id: editForm.assignedUserId || null,
        project_interest: editForm.projectInterest || null,
        flat_type_interest: editForm.flatTypeInterest || null,
        notes: editForm.notes || null,
        updated_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      })
      .eq('id', editingLead.id);

    if (error) {
      toast({
        title: 'Error updating lead',
        description: error.message,
        variant: 'destructive'
      });
      fetchLeads(); // Fallback on error
    } else {
      toast({ title: 'Lead updated successfully' });
    }
  };

  // Schedule Visit handler
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitForm.visitDate || !visitForm.visitTime) {
      toast({
        title: 'Required fields missing',
        description: 'Please select date and time',
        variant: 'destructive'
      });
      return;
    }

    setScheduleLoading(true);

    const scheduledAt = new Date(
      visitForm.visitDate + 'T' + 
      visitForm.visitTime + ':00'
    ).toISOString();

    const { error: visitError } = await supabase
      .from('site_visits')
      .insert({
        lead_id: selectedLeadForVisit.id,
        flat_id: visitForm.flatId || null,
        assigned_user_id: 
          visitForm.brokerId || 
          selectedLeadForVisit.assigned_user_id || 
          null,
        scheduled_at: scheduledAt,
        status: 'Scheduled',
        reminder_sent: false,
        notes: visitForm.notes || null,
        created_at: new Date().toISOString()
      });

    if (visitError) {
      toast({
        title: 'Failed to schedule visit',
        description: visitError.message,
        variant: 'destructive'
      });
      setScheduleLoading(false);
      return;
    }

    // Update lead status to Site Visit Scheduled
    await supabase
      .from('leads_customers')
      .update({
        status: 'Site Visit Scheduled',
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedLeadForVisit.id);

    const formattedDate = new Date(scheduledAt)
      .toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    const formattedTime = new Date(scheduledAt)
      .toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

    toast({
      title: 'Site visit scheduled!',
      description: 
        `${selectedLeadForVisit.name} — ` +
        `${formattedDate} at ${formattedTime}`
    });

    // Reset form and close
    setVisitForm({
      flatId: '', visitDate: '',
      visitTime: '', brokerId: '', notes: ''
    });
    setShowScheduleDialog(false);
    setSelectedLeadForVisit(null);
    setScheduleLoading(false);
  };

  // Delete lead
  const deleteLead = async (id: string) => {
    // Optimistic UI update
    setLeads(prev => prev.filter(l => l.id !== id));

    const { error } = await supabase
      .from('leads_customers')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      fetchLeads(); // Fallback on error
    } else {
      toast({ title: 'Lead deleted' });
      if (selectedLead?.id === id) setSelectedLead(null);
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = [
      'Name', 'Phone', 'Email', 'Source',
      'Status', 'Assigned Broker', 'Created Date'
    ];
    const rows = filteredLeads.map(l => [
      l.name || '',
      l.phone || '',
      l.email || '',
      l.source || '',
      l.status || '',
      l.assigned_user?.name || '',
      new Date(l.created_at).toLocaleDateString('en-IN')
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'CSV exported successfully' });
  };

  if (error) {
    return (
      <div className="p-12 text-center space-y-4">
        <XCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold">Error loading leads</h2>
        <p className="text-gray-500 max-w-md mx-auto">{error}</p>
        <Button onClick={fetchLeads} variant="outline" className="rounded-[10px]">
          <Loader2 className="mr-2 h-4 w-4" /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Lead Management</h1>
            <p className="text-[#64748B] text-sm mt-1">Manage, filter, and track all your prospective buyers</p>
          </div>
          <Button
            onClick={() => setShowAddSheet(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <Card key={i} className="bg-white border-[#E8ECF0] rounded-[16px]">
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-[10px]" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            [
              { label: "Total", value: totalLeads, icon: Users, color: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/30" },
              { label: "New Today", value: newLeads, icon: UserPlus, color: "from-cyan-500 to-cyan-400", shadow: "shadow-cyan-500/30" },
              { label: "Contacted", value: contacted, icon: PhoneCall, color: "from-yellow-500 to-amber-400", shadow: "shadow-yellow-500/30" },
              { label: "Site Visit", value: siteVisits, icon: Calendar, color: "from-purple-600 to-purple-400", shadow: "shadow-purple-500/30" },
              { label: "Converted", value: converted, icon: CheckCircle2, color: "from-green-500 to-emerald-400", shadow: "shadow-green-500/30" },
            ].map((kpi, i) => (
              <Card 
                key={i}
                className="overflow-hidden bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1]"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-[10px] bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-md ${kpi.shadow} shrink-0`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-[#0F172A] leading-none">{kpi.value}</h3>
                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mt-1">{kpi.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      {/* FILTER BAR */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                   placeholder="Search name, phone, email..." 
                   className="w-full pl-9 rounded-[10px] border-gray-200 bg-[#F8FAFC] focus:bg-white text-sm" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Site Visit Scheduled">Site Visit Scheduled</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Converted">Converted</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full md:w-[150px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Meta">Meta</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="99acres">99acres</SelectItem>
                  <SelectItem value="Direct">Direct</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button onClick={exportCSV} variant="outline" className="rounded-[10px] border-gray-200 bg-white text-[#0F172A] font-semibold">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-50 items-center">
            <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mr-2">Advanced:</span>
            <Select value={brokerFilter} onValueChange={setBrokerFilter}>
              <SelectTrigger className="w-[180px] h-8 text-xs rounded-[8px] border-none bg-gray-100">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brokers</SelectItem>
                {brokers.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
               <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-xs w-[130px] rounded-[8px] bg-gray-100 border-none" />
               <span className="text-xs text-gray-400">to</span>
               <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-xs w-[130px] rounded-[8px] bg-gray-100 border-none" />
            </div>
            {(statusFilter !== 'all' || sourceFilter !== 'all' || brokerFilter !== 'all' || searchQuery || dateFrom || dateTo) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setStatusFilter('all'); setSourceFilter('all'); setBrokerFilter('all');
                  setSearchQuery(''); setDateFrom(''); setDateTo('');
                }}
                className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* ADD LEAD DIALOG */}
      <Dialog open={showAddSheet} onOpenChange={setShowAddSheet}>
        <DialogContent
          className="max-w-[560px] w-full rounded-2xl p-0 overflow-hidden max-h-[90vh]"
        >
          {/* Dark header */}
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">
                Add New Lead
              </DialogTitle>
              <p className="text-blue-300 text-sm mt-1">
                Fill in the details below
              </p>
            </div>
            <button
              onClick={() => setShowAddSheet(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable form */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form
              id="add-lead-form"
              onSubmit={handleAddLead}
              className="px-6 py-5 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Lead Source *</Label>
                  <Select
                    value={formData.source}
                    onValueChange={val => setFormData(p => ({ ...p, source: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meta">Meta</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="99acres">99acres</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Assign Broker</Label>
                  <Select
                    value={formData.assignedUserId}
                    onValueChange={val => setFormData(p => ({ ...p, assignedUserId: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent>
                      {brokers.map(b => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Project Interest</Label>
                  <Select
                    value={formData.projectInterest}
                    onValueChange={val => setFormData(p => ({ ...p, projectInterest: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                      <SelectItem value="Villas">Villas</SelectItem>
                      <SelectItem value="Commercial Hub">Commercial Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Flat Type Interest</Label>
                <Select
                  value={formData.flatTypeInterest}
                  onValueChange={val => setFormData(p => ({ ...p, flatTypeInterest: val }))}
                >
                  <SelectTrigger className="rounded-[10px] h-10">
                    <SelectValue placeholder="Select flat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1BHK">1BHK</SelectItem>
                    <SelectItem value="2BHK">2BHK</SelectItem>
                    <SelectItem value="3BHK">3BHK</SelectItem>
                    <SelectItem value="4BHK">4BHK</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="rounded-[10px] resize-none"
                />
              </div>
            </form>
          </div>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button
              type="submit"
              form="add-lead-form"
              disabled={addLoading}
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
            >
              {addLoading ? 'Adding...' : 'Add Lead'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-[10px] h-10 px-6"
              onClick={() => {
                setShowAddSheet(false);
                setFormData({
                  name: '', phone: '', email: '',
                  source: 'Direct', assignedUserId: '',
                  projectInterest: '',
                  flatTypeInterest: '', notes: ''
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* LEADS TABLE */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                ))}
             </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">{searchQuery ? 'No results found' : 'No leads found'}</h3>
              <p className="text-gray-500 mb-6">{searchQuery ? 'Try adjusting your filters' : 'Add your first lead'}</p>
              {!searchQuery && <Button onClick={() => setShowAddSheet(true)} className="rounded-[10px] bg-[#0066FF]">Add First Lead</Button>}
            </div>
          ) : (
          <Table>
            <TableHeader className="bg-[#F8FAFC] border-b border-gray-200">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[50px] text-center pl-4 text-[12px] font-semibold text-[#64748B] uppercase">#</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] py-4">Name + ID</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Phone + Email</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Source</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Status</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Broker</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Project</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Dates</TableHead>
                <TableHead className="text-right pr-6 text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead, index) => {
                const brokerInitial1 = lead.assigned_user?.name?.charAt(0) || 'U';
                const brokerInitial2 = lead.assigned_user?.name?.split(' ')[1]?.charAt(0) || '';
                const brokerName = lead.assigned_user?.name || 'Unassigned';
                const projectName = lead.project_interest || lead.preferred_project || 'Any';
                
                return (
                <TableRow key={lead.id} className={`group hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]/30'}`}>
                  <TableCell className="w-[50px] text-center pl-4 text-gray-400 font-medium text-sm">{index + 1}</TableCell>
                  <TableCell className="py-4">
                    <div className="font-bold text-[#0F172A] text-[14px]">{lead.name}</div>
                    <div className="text-[12px] text-gray-400 font-medium">ID: {(lead.id || '').substring(0,8)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[13px] font-medium text-[#0F172A] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400"/> {lead.phone}</div>
                    <div className="text-[12px] text-[#64748B]">{lead.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getSourceColor(lead.source)} text-[11px] rounded-full uppercase border-transparent`}>{lead.source || 'Direct'}</Badge>
                  </TableCell>
                   <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(newStatus) => updateLeadStatus(lead.id, newStatus)}
                    >
                      <SelectTrigger className="w-[160px] h-7 text-xs border-0 p-0 focus:ring-0 bg-transparent hover:bg-gray-50 rounded-full px-2">
                        <Badge className={`${getStatusColor(lead.status)} shadow-none text-[11px] rounded-full font-bold uppercase tracking-wide border-transparent pointer-events-none`}>
                          {lead.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_STATUSES.map(s => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#0066FF] to-indigo-400 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">{brokerInitial1}{brokerInitial2}</div>
                      <span className="text-[13px] font-medium text-[#0F172A]">{brokerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#0F172A]">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" /> {projectName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[13px] text-[#0F172A] font-medium">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {new Date(lead.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Last active: {lead.last_activity ? 
                        new Date(lead.last_activity).toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit', hour12: true
                        }) : 'N/A'
                      }
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-[#64748B] hover:text-[#0066FF] hover:bg-blue-50" onClick={() => setSelectedLead(lead)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[90vw] sm:max-w-[520px] p-0 border-l border-gray-200">
                          <div className="p-6 border-b border-gray-100 bg-[#F8FAFC]">
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0066FF] to-indigo-500 text-white font-bold flex items-center justify-center text-[20px] shadow-md">
                                {selectedLead?.name?.split(' ')[0]?.[0] || 'U'}{selectedLead?.name?.split(' ')[1]?.[0] || ''}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h2 className="text-xl font-bold text-[#0F172A]">{selectedLead?.name}</h2>
                                  <Badge className={`${getStatusColor(selectedLead?.status || '')} shadow-none text-[11px] rounded-full font-bold uppercase border-transparent`}>{selectedLead?.status}</Badge>
                                </div>
                                <p className="text-sm text-[#64748B] mb-2">ID: {(selectedLead?.id || '').substring(0,8)} • Added {new Date(selectedLead?.created_at || Date.now()).toLocaleDateString()}</p>
                                <Badge variant="outline" className={`${getSourceColor(selectedLead?.source || '')} text-[10px] rounded-full uppercase border-transparent`}>{selectedLead?.source || 'Direct'}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-250px)]">
                            <div className="space-y-3">
                              <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Contact Info</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#F8FAFC] p-3 rounded-[12px] border border-gray-100">
                                  <p className="text-[11px] text-[#64748B] uppercase font-bold mb-1">Phone</p>
                                  <p className="text-[14px] font-semibold text-[#0F172A]">{selectedLead?.phone}</p>
                                </div>
                                <div className="bg-[#F8FAFC] p-3 rounded-[12px] border border-gray-100">
                                  <p className="text-[11px] text-[#64748B] uppercase font-bold mb-1">Email</p>
                                  <p className="text-[14px] font-semibold text-[#0F172A]">{selectedLead?.email || 'N/A'}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Project Interest</h3>
                                <p className="text-sm font-semibold">{selectedLead?.project_interest || 'Any / All'}</p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Assigned To</h3>
                                <p className="text-sm font-semibold">{selectedLead?.assigned_user?.name || 'Unassigned'}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Notes</h3>
                              <div className="bg-[#F8FAFC] p-4 rounded-[12px] border border-gray-100 min-h-[100px] text-sm text-[#0F172A]">
                                {selectedLead?.notes || 'No notes added yet.'}
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                               <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Update Status</h3>
                               <div className="flex flex-wrap gap-2">
                                  {['New', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Lost'].map(st => (
                                    <Button 
                                      key={st} 
                                      variant={selectedLead?.status === st ? "default" : "outline"} 
                                      onClick={() => updateLeadStatus(selectedLead?.id, st)}
                                      className={`text-[11px] h-8 rounded-full px-4 ${selectedLead?.status === st ? 'bg-[#0066FF]' : ''}`}
                                    >
                                      {st}
                                    </Button>
                                  ))}
                               </div>
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex flex-wrap gap-2">
                            <Button onClick={() => updateLeadStatus(selectedLead?.id, 'Converted')} className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] shadow-md font-semibold h-11">
                               <CheckCircle2 className="w-4 h-4 mr-2" /> Convert Lead
                            </Button>
                            <Button onClick={() => deleteLead(selectedLead?.id)} variant="ghost" className="border-none text-red-500 hover:bg-red-50 hover:text-red-600 rounded-[10px] h-11 px-6">
                               <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Button onClick={() => handleEditClick(lead)} variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-[#64748B] hover:text-[#0066FF] hover:bg-blue-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedLeadForVisit(lead);
                          setVisitForm({
                            flatId: lead.flat_id || '',
                            visitDate: '',
                            visitTime: '',
                            brokerId: lead.assigned_user_id || '',
                            notes: ''
                          });
                          setShowScheduleDialog(true);
                        }} 
                        variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-[#25D366] hover:text-[#1DA851] hover:bg-green-50"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => deleteLead(lead.id)} variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-red-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                )})}
            </TableBody>
          </Table>
          )}
        </div>
      </Card>

      {/* EDIT LEAD DIALOG */}
      <Dialog open={showEditSheet} onOpenChange={setShowEditSheet}>
        <DialogContent
          className="max-w-[560px] w-full rounded-2xl p-0 overflow-hidden max-h-[90vh]"
        >
          {/* Dark header */}
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">
                Edit Lead
              </DialogTitle>
              <p className="text-blue-300 text-sm mt-1">
                Update lead information and status
              </p>
            </div>
            <button
              onClick={() => setShowEditSheet(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable form */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form
              id="edit-lead-form"
              onSubmit={handleSaveEdit}
              className="px-6 py-5 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={editForm.name}
                    onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    placeholder="10-digit number"
                    value={editForm.phone}
                    onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={editForm.email}
                    onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Lead Source *</Label>
                  <Select
                    value={editForm.source}
                    onValueChange={val => setEditForm(p => ({ ...p, source: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meta">Meta</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="99acres">99acres</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Current Status *</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={val => setEditForm(p => ({ ...p, status: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Assign Broker</Label>
                  <Select
                    value={editForm.assignedUserId}
                    onValueChange={val => setEditForm(p => ({ ...p, assignedUserId: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent>
                      {brokers.map(b => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Project Interest</Label>
                  <Select
                    value={editForm.projectInterest}
                    onValueChange={val => setEditForm(p => ({ ...p, projectInterest: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                      <SelectItem value="Villas">Villas</SelectItem>
                      <SelectItem value="Commercial Hub">Commercial Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Flat Type</Label>
                  <Select
                    value={editForm.flatTypeInterest}
                    onValueChange={val => setEditForm(p => ({ ...p, flatTypeInterest: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select flat type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="4BHK">4BHK</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={editForm.notes}
                  onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="rounded-[10px] resize-none"
                />
              </div>
            </form>
          </div>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button
              type="submit"
              form="edit-lead-form"
              disabled={addLoading}
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
            >
              {addLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-[10px] h-10 px-6"
              onClick={() => setShowEditSheet(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SCHEDULE VISIT DIALOG */}
      <Dialog
        open={showScheduleDialog}
        onOpenChange={(open) => {
          setShowScheduleDialog(open);
          if (!open) {
            setSelectedLeadForVisit(null);
            setVisitForm({
              flatId: '', visitDate: '',
              visitTime: '', brokerId: '', notes: ''
            });
          }
        }}
      >
        <DialogContent className="max-w-[480px] rounded-2xl p-0 overflow-hidden">
          <div className="bg-[#0A1628] px-6 py-5">
            <DialogTitle className="text-white text-lg font-semibold">
              Schedule Site Visit
            </DialogTitle>
            {selectedLeadForVisit && (
              <p className="text-blue-300 text-sm mt-1">
                {selectedLeadForVisit.name} · {selectedLeadForVisit.phone}
              </p>
            )}
          </div>

          <form onSubmit={handleScheduleSubmit} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Select Property</Label>
              <Select
                value={visitForm.flatId}
                onValueChange={val => setVisitForm(p => ({...p, flatId: val}))}
              >
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="Choose a flat (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {availableFlats.map(flat => (
                    <SelectItem key={flat.flat_id} value={flat.flat_id}>
                      {flat.flat_number} — {flat.project} ({flat.type}) — ₹{(flat.price/100000).toFixed(1)}L
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Visit Date *</Label>
                <Input
                  type="date"
                  value={visitForm.visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setVisitForm(p => ({...p, visitDate: e.target.value}))}
                  className="rounded-[10px]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Visit Time *</Label>
                <Input
                  type="time"
                  value={visitForm.visitTime}
                  onChange={e => setVisitForm(p => ({...p, visitTime: e.target.value}))}
                  className="rounded-[10px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Assign Broker</Label>
              <Select
                value={visitForm.brokerId}
                onValueChange={val => setVisitForm(p => ({...p, brokerId: val}))}
              >
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="Select broker" />
                </SelectTrigger>
                <SelectContent>
                  {brokers.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Notes</Label>
              <Textarea
                placeholder="Special instructions or notes..."
                value={visitForm.notes}
                onChange={e => setVisitForm(p => ({...p, notes: e.target.value}))}
                className="rounded-[10px] resize-none"
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={scheduleLoading}
                className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
              >
                {scheduleLoading ? 'Scheduling...' : 'Confirm Visit'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-[10px] h-10 px-6"
                onClick={() => {
                  setShowScheduleDialog(false);
                  setSelectedLeadForVisit(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### `app/sales/page.tsx`
```tsx
'use client';

import SalesDashboardClient from './components/SalesDashboardClient';

export default function SalesPage() {
  return <SalesDashboardClient />;
}
```

### `app/sales/properties/page.tsx`
```tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogTitle
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Plus, LayoutGrid, List, MoreHorizontal,
  Edit, Trash2, Eye, MapPin, 
  Building2, X, Clock, Tag, 
  IndianRupee, TrendingUp, Hexagon,
  Home, CheckCircle2, UserPlus, CreditCard,
  Loader2, Filter, Search, Download, Trash
} from 'lucide-react';

const SortIcon = ({ field, sortField, sortDir }: { field: string, sortField: string, sortDir: string }) => {
  if (sortField !== field) return <div className="inline-block w-4 h-4 ml-1 opacity-0" />;
  return sortDir === 'asc' ? 
    <TrendingUp className="w-3.5 h-3.5 inline ml-1 text-blue-500" /> : 
    <TrendingUp className="w-3.5 h-3.5 inline ml-1 text-blue-500 rotate-180 transition-transform" />;
};

export default function PropertiesPage() {
  const supabase = createBrowserClient();
  const { toast } = useToast();

  // Data state
  const [flats, setFlats] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [groupByProject, setGroupByProject] = useState(false);

  // Filter state
  const [projectFilter, setProjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('flat_number');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<any>(null);

  // Form states
  const [formLoading, setFormLoading] = useState(false);
  const [flatForm, setFlatForm] = useState({
    flatNumber: '',
    project: '',
    type: '',
    floor: '',
    areaSqft: '',
    price: '',
    facing: '',
    status: 'Available',
    carParking: '1',
    possessionDate: '',
    bookingAmount: '',
    discountPercent: '0',
    description: ''
  });

  const [bookingForm, setBookingForm] = useState({
    leadId: '',
    paymentType: 'Booking',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Bank Transfer',
    referenceNumber: '',
    notes: ''
  });

  // --- HELPERS ---

  const getFlatPayments = (flatId: string) => {
    if (!flatId) return [];
    return payments.filter(p => String(p.flat_id) === String(flatId));
  };
  const getFlatTotalPaid = (flatId: string) => {
    if (!flatId) return 0;
    return getFlatPayments(flatId).reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  // --- DATA FETCHING ---

  const fetchFlats = async () => {
    const { data, error } = await supabase
      .from('flats_inventory')
      .select(`
        *,
        assigned_lead:leads_customers(
          id, name, phone, email, status
        )
      `)
      .order('project')
      .order('flat_number');
    if (!error) setFlats(data || []);
  };

  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads_customers')
      .select('id, name, phone, email, status')
      .not('status', 'eq', 'Lost')
      .order('name');
    setLeads(data || []);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Payments error:', error);
      setPayments([]);
      return;
    }

    if (!data || data.length === 0) {
      setPayments([]);
      return;
    }

    // Get unique flat IDs
    const flatIds = Array.from(new Set(
      data.filter(p => p.flat_id).map(p => String(p.flat_id))
    ));

    // Get unique lead IDs  
    const leadIds = Array.from(new Set(
      data.filter(p => p.lead_id).map(p => String(p.lead_id))
    ));

    // Fetch related flats
    let flatsMap: any = {};
    if (flatIds.length > 0) {
      const { data: flatsData } = await supabase
        .from('flats_inventory')
        .select('flat_id, flat_number, project, type')
        .in('flat_id', flatIds);
      flatsData?.forEach(f => {
        flatsMap[String(f.flat_id)] = f;
      });
    }

    // Fetch related leads
    let leadsMap: any = {};
    if (leadIds.length > 0) {
      const { data: leadsData } = await supabase
        .from('leads_customers')
        .select('id, name, phone, email')
        .in('id', leadIds);
      leadsData?.forEach(l => {
        leadsMap[String(l.id)] = l;
      });
    }

    // Join manually
    const enriched = data.map(p => ({
      ...p,
      flat: p.flat_id ? flatsMap[String(p.flat_id)] || null : null,
      lead: p.lead_id ? leadsMap[String(p.lead_id)] || null : null
    }));

    setPayments(enriched);
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchFlats(),
      fetchLeads(),
      fetchPayments()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();

    const flatsChannel = supabase
      .channel('properties-flats')
      .on('postgres_changes', {
        event: '*', schema: 'public',
        table: 'flats_inventory'
      }, () => fetchFlats())
      .subscribe();

    const paymentsChannel = supabase
      .channel('properties-payments')
      .on('postgres_changes', {
        event: '*', schema: 'public',
        table: 'payments'
      }, () => fetchPayments())
      .subscribe();

    return () => {
      supabase.removeChannel(flatsChannel);
      supabase.removeChannel(paymentsChannel);
    };
  }, []);

  // --- HELPERS ---

  const formatPrice = (price: number) => {
    if (!price) return '₹0';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'On Hold': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Sold': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // --- COMPUTED ---

  const filteredFlats = useMemo(() => {
    return flats.filter(flat => {
      const matchesSearch = !searchQuery ||
        flat.flat_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flat.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flat.type?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = projectFilter === 'all' || flat.project === projectFilter;
      const matchesType = typeFilter === 'all' || flat.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || flat.status === statusFilter;
      const matchesFloor = floorFilter === 'all' || String(flat.floor) === floorFilter;
      return matchesSearch && matchesProject && matchesType && matchesStatus && matchesFloor;
    });
  }, [flats, searchQuery, projectFilter, typeFilter, statusFilter, floorFilter]);

  const sortedFlats = useMemo(() => {
    return [...filteredFlats].sort((a, b) => {
      const aVal = a[sortField as keyof typeof a] || '';
      const bVal = b[sortField as keyof typeof b] || '';
      const dir = sortDir === 'asc' ? 1 : -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [filteredFlats, sortField, sortDir]);

  const projects = useMemo(() => Array.from(new Set(flats.map(f => f.project).filter(Boolean))), [flats]);
  const floors = useMemo(() => Array.from(new Set(flats.map(f => f.floor).filter(Boolean))).sort((a: any, b: any) => a - b), [flats]);

  const kpis = useMemo(() => {
    const total = flats.length;
    const avail = flats.filter(f => f.status === 'Available').length;
    const hold = flats.filter(f => f.status === 'On Hold').length;
    const sold = flats.filter(f => f.status === 'Sold').length;
    const rev = flats.filter(f => f.status === 'Sold').reduce((sum, f) => sum + (f.price || 0), 0);
    const pipe = flats.filter(f => f.status === 'On Hold').reduce((sum, f) => sum + (f.price || 0), 0);
    const val = flats.filter(f => f.status === 'Available').reduce((sum, f) => sum + (f.price || 0), 0);
    const soldP = total > 0 ? Math.round((sold / total) * 100) : 0;
    const avgSqft = flats.filter(f => f.area_sqft > 0).length > 0 
      ? Math.round(flats.filter(f => f.area_sqft > 0).reduce((sum, f) => sum + f.price / f.area_sqft, 0) / flats.filter(f => f.area_sqft > 0).length)
      : 0;
      
    return { total, avail, hold, sold, rev, pipe, val, soldP, avgSqft };
  }, [flats]);

  // --- OPERATIONS ---

  const resetFlatForm = () => setFlatForm({
    flatNumber: '', project: '', type: '', floor: '', areaSqft: '', price: '',
    facing: '', status: 'Available', carParking: '1', possessionDate: '',
    bookingAmount: '', discountPercent: '0', description: ''
  });

  const handleAddFlat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!flatForm.flatNumber || !flatForm.project || !flatForm.type) {
      toast({ title: 'Fields missing', description: 'Number, project and type required', variant: 'destructive' });
      return;
    }

    setFormLoading(true);
    const { data, error } = await supabase
      .from('flats_inventory')
      .insert({
        flat_number: flatForm.flatNumber,
        project: flatForm.project,
        type: flatForm.type,
        floor: parseInt(flatForm.floor) || 1,
        area_sqft: parseFloat(flatForm.areaSqft) || 0,
        price: parseFloat(flatForm.price) || 0,
        facing: flatForm.facing || null,
        status: flatForm.status,
        car_parking: parseInt(flatForm.carParking) || 1,
        possession_date: flatForm.possessionDate || null,
        booking_amount: parseFloat(flatForm.bookingAmount) || 0,
        discount_percent: parseFloat(flatForm.discountPercent) || 0,
        description: flatForm.description || null,
        updated_at: new Date().toISOString()
      })
      .select('*, assigned_lead:leads_customers(*)')
      .single();

    setFormLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setFlats(prev => [...prev, data]);
    toast({ title: 'Success!', description: `${flatForm.flatNumber} added` });
    setShowAddDialog(false);
    resetFlatForm();
  };

  const handleEditFlat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedFlat) return;

    setFormLoading(true);
    const { error } = await supabase
      .from('flats_inventory')
      .update({
        flat_number: flatForm.flatNumber,
        project: flatForm.project,
        type: flatForm.type,
        floor: parseInt(flatForm.floor) || 1,
        area_sqft: parseFloat(flatForm.areaSqft) || 0,
        price: parseFloat(flatForm.price) || 0,
        facing: flatForm.facing || null,
        status: flatForm.status,
        car_parking: parseInt(flatForm.carParking) || 1,
        possession_date: flatForm.possessionDate || null,
        booking_amount: parseFloat(flatForm.bookingAmount) || 0,
        discount_percent: parseFloat(flatForm.discountPercent) || 0,
        description: flatForm.description || null,
        updated_at: new Date().toISOString()
      })
      .eq('flat_id', selectedFlat.flat_id);

    setFormLoading(false);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      return;
    }

    setFlats(prev => prev.map(f => f.flat_id === selectedFlat.flat_id ? {
      ...f,
      flat_number: flatForm.flatNumber,
      project: flatForm.project,
      type: flatForm.type,
      floor: parseInt(flatForm.floor),
      area_sqft: parseFloat(flatForm.areaSqft),
      price: parseFloat(flatForm.price),
      facing: flatForm.facing,
      status: flatForm.status,
      booking_amount: parseFloat(flatForm.bookingAmount),
      discount_percent: parseFloat(flatForm.discountPercent),
      description: flatForm.description
    } : f));

    toast({ title: 'Updated!' });
    setShowEditDialog(false);
    setSelectedFlat(null);
  };

  const handleDeleteFlat = async (flat: any) => {
    if (!window.confirm(`Delete ${flat.flat_number}?`)) return;

    setFlats(prev => prev.filter(f => f.flat_id !== flat.flat_id));
    const { error } = await supabase.from('flats_inventory').delete().eq('flat_id', flat.flat_id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      fetchFlats();
    } else {
      toast({ title: 'Deleted' });
    }
  };

  const handleBookFlat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!bookingForm.leadId || !bookingForm.amount || !bookingForm.paymentDate) {
      toast({ title: 'Required fields missing', variant: 'destructive' });
      return;
    }

    setFormLoading(true);
    const { error: pErr } = await supabase.from('payments').insert({
      flat_id: selectedFlat.flat_id,
      lead_id: bookingForm.leadId,
      payment_type: bookingForm.paymentType,
      amount: parseFloat(bookingForm.amount),
      payment_date: bookingForm.paymentDate,
      payment_mode: bookingForm.paymentMode,
      reference_number: bookingForm.referenceNumber || null,
      notes: bookingForm.notes || null,
      status: 'Received',
      created_at: new Date().toISOString()
    });

    if (pErr) {
      toast({ title: 'Payment failed', description: pErr.message, variant: 'destructive' });
      setFormLoading(false);
      return;
    }

    const newStatus = bookingForm.paymentType === 'Full Payment' ? 'Sold' : 'On Hold';
    await supabase.from('flats_inventory').update({
      status: newStatus,
      assigned_lead_id: bookingForm.leadId,
      updated_at: new Date().toISOString()
    }).eq('flat_id', selectedFlat.flat_id);

    // Update lead status
    await supabase.from('leads_customers').update({
      status: newStatus === 'Sold' ? 'Converted' : 'Negotiation',
      updated_at: new Date().toISOString()
    }).eq('id', bookingForm.leadId);

    const bookedLead = leads.find(l => l.id === bookingForm.leadId);
    setFlats(prev => prev.map(f => f.flat_id === selectedFlat.flat_id ? {
      ...f, status: newStatus, assigned_lead_id: bookingForm.leadId, assigned_lead: bookedLead
    } : f));

    setFormLoading(false);
    toast({ title: newStatus === 'Sold' ? 'Sold!' : 'Booked!' });
    setShowBookingDialog(false);
    setSelectedFlat(null);
    fetchPayments();
  };

  const handleReleaseFlat = async (flat: any) => {
    if (!window.confirm(`Release ${flat.flat_number}?`)) return;
    setFlats(prev => prev.map(f => f.flat_id === flat.flat_id ? { ...f, status: 'Available', assigned_lead_id: null, assigned_lead: null } : f));
    await supabase.from('flats_inventory').update({
      status: 'Available', assigned_lead_id: null, updated_at: new Date().toISOString()
    }).eq('flat_id', flat.flat_id);
    toast({ title: 'Released' });
  };

  const handleEditClick = (flat: any) => {
    setSelectedFlat(flat);
    setFlatForm({
      flatNumber: flat.flat_number || '',
      project: flat.project || '',
      type: flat.type || '',
      floor: String(flat.floor || ''),
      areaSqft: String(flat.area_sqft || ''),
      price: String(flat.price || ''),
      facing: flat.facing || '',
      status: flat.status || 'Available',
      carParking: String(flat.car_parking || '1'),
      possessionDate: flat.possession_date || '',
      bookingAmount: String(flat.booking_amount || ''),
      discountPercent: String(flat.discount_percent || '0'),
      description: flat.description || ''
    });
    setShowEditDialog(true);
  };

  // --- SUB-COMPONENTS ---

  const FlatCard = ({ flat }: { flat: any }) => {
    const isHot = (flat.price / flat.area_sqft) < (kpis.avgSqft * 0.95) && flat.status === 'Available';
    const recentUpdate = flat.updated_at && (new Date().getTime() - new Date(flat.updated_at).getTime()) < 30 * 24 * 60 * 60 * 1000;
    const discountedPrice = flat.price * (1 - (parseFloat(flat.discount_percent || 0) / 100));

    return (
      <Card className={`relative overflow-hidden group shadow-sm bg-white border-t-4 ${
        flat.status === 'Available' ? 'border-t-emerald-500' :
        flat.status === 'On Hold' ? 'border-t-amber-500' : 'border-t-blue-500'
      } rounded-2xl hover:shadow-xl transition-all duration-300`}>
        <CardContent className="p-5 pt-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-2xl font-bold text-[#0F172A] leading-tight flex items-center gap-2">
                {flat.flat_number}
                {isHot && <Badge className="bg-red-500 text-white rounded-md text-[10px] font-bold px-1.5 h-4">HOT</Badge>}
              </h3>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{flat.project}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge variant="outline" className={`${getStatusColor(flat.status)} rounded-full px-2 py-0 border-transparent text-[10px] font-bold uppercase`}>
                {flat.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] rounded-lg bg-gray-50 text-gray-500 border-gray-100 font-bold">{flat.type}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 mt-4 mb-5">
            <div className="flex items-center gap-2">
              <Hexagon className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Area</p>
                <p className="text-[13px] font-semibold text-[#0F172A]">{flat.area_sqft} sqft</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Floor</p>
                <p className="text-[13px] font-semibold text-[#0F172A]">{flat.floor}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="border-t border-gray-50 pt-3">
              <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Final Price</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-[22px] font-bold text-[#0066FF]">{formatPrice(discountedPrice)}</span>
                 {flat.discount_percent > 0 && (
                   <span className="text-xs text-gray-400 line-through">₹{(flat.price/100000).toFixed(1)}L</span>
                 )}
              </div>
              <div className="flex items-center justify-between mt-1">
                 <span className="text-[11px] text-gray-400 font-medium">₹{Math.round(flat.price/flat.area_sqft).toLocaleString()}/sqft</span>
                 {recentUpdate && <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3"/>Price Updated</span>}
              </div>
            </div>

            {flat.assigned_lead && (
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                 <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Assigned Buyer</p>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#0F172A]">{flat.assigned_lead.name}</span>
                    <Badge className="bg-blue-100 text-blue-700 text-[9px] rounded-md">{Math.round((getFlatTotalPaid(flat.flat_id)/flat.price)*100)}% Paid</Badge>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => { setSelectedFlat(flat); setShowDetailDialog(true); }}
                className="rounded-xl border-gray-100 h-9 font-semibold hover:bg-gray-50 text-gray-700"
              >
                Details
              </Button>
              {flat.status === 'Available' ? (
                <Button 
                  size="sm"
                  onClick={() => { setSelectedFlat(flat); setShowBookingDialog(true); }}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white h-9 font-semibold"
                >
                  Book
                </Button>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => handleReleaseFlat(flat)}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white h-9 font-semibold"
                >
                  Release
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PropertyActions = ({ flat }: { flat: any }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl border-gray-100 shadow-xl p-1">
        <DropdownMenuItem onClick={() => { setSelectedFlat(flat); setShowDetailDialog(true); }} className="rounded-lg py-2 cursor-pointer">
          <Eye className="w-4 h-4 mr-2 text-gray-500" /> View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEditClick(flat)} className="rounded-lg py-2 cursor-pointer">
          <Edit className="w-4 h-4 mr-2 text-gray-500" /> Edit Property
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-50" />
        <DropdownMenuItem 
          onClick={() => { setSelectedFlat(flat); setShowBookingDialog(true); }} 
          className="rounded-lg py-2 cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
        >
          <Plus className="w-4 h-4 mr-2" /> Book / Pay
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleQuickStatusChange(flat, 'Available')}
          className="rounded-lg py-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Mark Available
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-50" />
        <DropdownMenuItem 
          onClick={() => handleDeleteFlat(flat)}
          className="rounded-lg py-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
        >
          <Trash className="w-4 h-4 mr-2" /> Delete Property
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleQuickStatusChange = async (flat: any, status: string) => {
    setFlats(prev => prev.map(f => f.flat_id === flat.flat_id ? { ...f, status } : f));
    await supabase.from('flats_inventory').update({ status }).eq('flat_id', flat.flat_id);
    toast({ title: `${flat.flat_number} updated to ${status}` });
  };

  // --- RENDER HELPERS ---

  if (loading) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
        <p className="text-gray-500 font-medium">Loading property inventory...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans bg-[#F8FAFC]">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Property Inventory</h1>
          <p className="text-[#64748B] text-sm mt-1">Managing {flats.length} units across {projects.length} projects</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl border border-gray-100">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'table' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <List className="w-4 h-4" />
            Table
          </button>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </Button>
        </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Units', value: kpis.total, sub: `${kpis.avail} available`, icon: Building2, color: 'blue' },
          { label: 'Available', value: kpis.avail, sub: `${kpis.soldP}% sold`, icon: CheckCircle2, color: 'emerald' },
          { label: 'On Hold', value: kpis.hold, sub: `Pipe: ${formatPrice(kpis.pipe)}`, icon: Clock, color: 'amber' },
          { label: 'Sold', value: kpis.sold, sub: `Rev: ${formatPrice(kpis.rev)}`, icon: Tag, color: 'indigo' },
          { label: 'Inventory Value', value: formatPrice(kpis.val), sub: 'Unsold stock', icon: IndianRupee, color: 'purple' },
          { label: 'Avg Price/sqft', value: `₹${kpis.avgSqft.toLocaleString()}`, sub: 'All projects', icon: TrendingUp, color: 'orange' },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 
                ${kpi.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  kpi.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  kpi.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  kpi.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] leading-none mb-1.5">{kpi.value}</h3>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">{kpi.label}</p>
                <p className="text-xs text-gray-400 font-medium">{kpi.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Filter Bar */}
      <Card className="border-none shadow-sm bg-white overflow-visible">
        <div className="p-4 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by flat number, project, or type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-gray-100 bg-[#F1F5F9]/50 rounded-xl focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[150px] rounded-xl h-10 border-gray-100">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] rounded-xl h-10 border-gray-100">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="1BHK">1BHK</SelectItem>
                <SelectItem value="2BHK">2BHK</SelectItem>
                <SelectItem value="3BHK">3BHK</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] rounded-xl h-10 border-gray-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>

            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-[110px] rounded-xl h-10 border-gray-100">
                <SelectValue placeholder="Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                {floors.map(f => <SelectItem key={f} value={String(f)}>Floor {f}</SelectItem>)}
              </SelectContent>
            </Select>

            {(searchQuery || projectFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all' || floorFilter !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setProjectFilter('all');
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setFloorFilter('all');
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10 px-3 rounded-xl"
              >
                Clear
              </Button>
            )}

            <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

            <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-[#F8FAFC] border border-gray-200">
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">Group</span>
              <button
                onClick={() => setGroupByProject(!groupByProject)}
                className={`w-10 h-5 rounded-full relative transition-colors ${groupByProject ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${groupByProject ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Main Inventory View */}
      <div className="space-y-8">
        {viewMode === 'grid' ? (
          groupByProject ? (
            projects.map(project => {
              const projectFlats = sortedFlats.filter(f => f.project === project);
              const projectAvail = projectFlats.filter(f => f.status === 'Available').length;
              if (projectFlats.length === 0) return null;
              
              return (
                <div key={project} className="space-y-4">
                  <div className="flex items-center justify-between py-3 px-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-[#0066FF]" />
                      <span className="font-bold text-[#0F172A] text-lg">{project}</span>
                      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-100 rounded-lg font-medium">
                        {projectAvail} avail / {projectFlats.length} total
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                       <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-lg">{projectAvail} Available</Badge>
                       <Badge className="bg-amber-50 text-amber-600 border-amber-100 rounded-lg">{projectFlats.filter(f=>f.status==='On Hold').length} On Hold</Badge>
                       <Badge className="bg-blue-50 text-blue-600 border-blue-100 rounded-lg">{projectFlats.filter(f=>f.status==='Sold').length} Sold</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projectFlats.map(flat => <FlatCard key={flat.flat_id} flat={flat} />)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedFlats.map(flat => <FlatCard key={flat.flat_id} flat={flat} />)}
              {sortedFlats.length === 0 && (
                <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <Home className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">No properties found matching your filters</p>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('flat_number')}>
                      Flat # / Project <SortIcon field="flat_number" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('type')}>
                      Type / Floor <SortIcon field="type" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('area_sqft')}>
                      Area / Facing <SortIcon field="area_sqft" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('price')}>
                      Price <SortIcon field="price" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('status')}>
                      Status <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Paid</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedFlats.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400">No properties found</td></tr>
                  ) : (
                    sortedFlats.map((flat, index) => {
                      const flatPaymentsTotal = getFlatTotalPaid(flat.flat_id);
                      const discountedPrice = flat.discount_percent > 0 ? flat.price * (1 - flat.discount_percent / 100) : flat.price;
                      return (
                        <tr key={flat.flat_id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-900 text-sm">{flat.flat_number}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{flat.project}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{flat.type}</span>
                            <div className="text-xs text-gray-500 mt-1">Floor {flat.floor || 1}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{flat.area_sqft ? `${flat.area_sqft} sqft` : '—'}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{flat.facing ? `${flat.facing}-facing` : '—'}</div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="text-sm font-semibold text-gray-900">{formatPrice(discountedPrice)}</div>
                            {flat.discount_percent > 0 && <div className="text-xs text-gray-400 line-through mt-0.5">{formatPrice(flat.price)}</div>}
                            {flat.area_sqft > 0 && <div className="text-xs text-gray-400 mt-0.5">₹{Math.round(flat.price / flat.area_sqft).toLocaleString('en-IN')}/sqft</div>}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(flat.status)}`}>{flat.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            {flat.assigned_lead ? (
                              <div>
                                <div className="text-sm font-medium text-gray-900">{flat.assigned_lead.name}</div>
                                <div className="text-xs text-gray-500">{flat.assigned_lead.phone}</div>
                              </div>
                            ) : <span className="text-gray-400 text-sm">—</span>}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {flatPaymentsTotal > 0 ? (
                              <div>
                                <div className="text-sm font-medium text-green-700">{formatPrice(flatPaymentsTotal)}</div>
                                <div className="text-xs text-gray-400">{Math.round((flatPaymentsTotal / flat.price) * 100)}% paid</div>
                              </div>
                            ) : <span className="text-gray-400 text-sm">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              {flat.status === 'Available' && (
                                <button onClick={() => { setSelectedFlat(flat); setBookingForm({ leadId: '', paymentType: 'Booking', amount: String(flat.booking_amount || ''), paymentDate: new Date().toISOString().split('T')[0], paymentMode: 'Bank Transfer', referenceNumber: '', notes: '' }); setShowBookingDialog(true); }} className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Book</button>
                              )}
                              {flat.status !== 'Available' && (
                                <button onClick={() => { setSelectedFlat(flat); setBookingForm({ leadId: flat.assigned_lead_id || '', paymentType: 'Installment', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMode: 'Bank Transfer', referenceNumber: '', notes: '' }); setShowBookingDialog(true); }} className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">+ Pay</button>
                              )}
                              <button onClick={() => handleEditClick(flat)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Edit className="w-3.5 h-3.5 text-gray-500" /></button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><MoreHorizontal className="w-3.5 h-3.5 text-gray-500" /></button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedFlat(flat); setShowDetailDialog(true); }}><Eye className="w-4 h-4 text-blue-500" /> View Details</DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleEditClick(flat)}><Edit className="w-4 h-4 text-gray-500" /> Edit Property</DropdownMenuItem>
                                  {flat.status !== 'Available' && (
                                    <DropdownMenuItem className="gap-2 cursor-pointer text-amber-600" onClick={() => handleReleaseFlat(flat)}><CheckCircle2 className="w-4 h-4" /> Release to Available</DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDeleteFlat(flat)}><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {sortedFlats.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50 border-t-2 border-gray-200">
                      <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-gray-600">{sortedFlats.length} properties</td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-gray-900">{formatPrice(sortedFlats.reduce((sum, f) => sum + (f.price || 0), 0))}</td>
                      <td colSpan={2} className="px-4 py-3 text-xs text-gray-500">{sortedFlats.filter(f => f.status === 'Available').length} available · {sortedFlats.filter(f => f.status === 'Sold').length} sold</td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-green-700">{formatPrice(sortedFlats.reduce((sum, f) => sum + getFlatTotalPaid(f.flat_id), 0))}</td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. Project Summary Bottom Section */}
      <div className="mt-12 space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
           <Building2 className="w-5 h-5 text-[#0066FF]" />
           Project-wise Summary
        </h2>
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-3xl">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider py-4">Project Name</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">Total Units</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">Available</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">On Hold</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">Sold</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">% Sold</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">Sold Value</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider text-right pr-6">Inventory Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(p => {
                const pf = flats.filter(f => f.project === p);
                const ps = pf.filter(f => f.status === 'Sold').length;
                const pa = pf.filter(f => f.status === 'Available').length;
                const ph = pf.filter(f => f.status === 'On Hold').length;
                const sv = pf.filter(f => f.status === 'Sold').reduce((s, f) => s + f.price, 0);
                const iv = pf.filter(f => f.status === 'Available').reduce((s, f) => s + f.price, 0);
                return (
                  <TableRow key={p} className="border-gray-50 hover:bg-[#F8FAFC]">
                    <TableCell className="font-bold text-[#0F172A] py-4">{p}</TableCell>
                    <TableCell className="font-semibold text-gray-600">{pf.length}</TableCell>
                    <TableCell className="text-emerald-600 font-semibold">{pa}</TableCell>
                    <TableCell className="text-amber-600 font-semibold">{ph}</TableCell>
                    <TableCell className="text-blue-600 font-semibold">{ps}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: `${Math.round((ps/pf.length)*100)}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-500">{Math.round((ps/pf.length)*100)}%</span>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-[#0F172A]">{formatPrice(sv)}</TableCell>
                    <TableCell className="text-right font-bold text-[#0F172A] pr-6">{formatPrice(iv)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* 6. MODALS / DIALOGS */}

      {/* ADD PROPERTY DIALOG */}
      <Dialog open={showAddDialog} onOpenChange={(open) => { setShowAddDialog(open); if (!open) resetFlatForm(); }}>
        <DialogContent className="max-w-[640px] rounded-2xl p-0 overflow-hidden max-h-[90vh]">
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">Add New Property</DialogTitle>
              <p className="text-blue-300 text-sm mt-1">Add a flat or unit to inventory</p>
            </div>
            <button onClick={() => setShowAddDialog(false)} className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-5">
            <form id="add-flat-form" onSubmit={handleAddFlat} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Flat / Unit Number *</Label>
                  <Input placeholder="e.g. A-101" value={flatForm.flatNumber} onChange={e => setFlatForm(p => ({ ...p, flatNumber: e.target.value }))} className="rounded-[10px] h-10" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Project / Tower *</Label>
                  <Select value={flatForm.project} onValueChange={val => setFlatForm(p => ({ ...p, project: val }))}>
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                      <SelectItem value="Villas">Villas</SelectItem>
                      <SelectItem value="Commercial Hub">Commercial Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Flat Type *</Label>
                  <Select value={flatForm.type} onValueChange={val => setFlatForm(p => ({ ...p, type: val }))}>
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="4BHK">4BHK</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Floor Number</Label>
                  <Input type="number" placeholder="e.g. 3" value={flatForm.floor} onChange={e => setFlatForm(p => ({ ...p, floor: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Area (sq ft)</Label>
                  <Input type="number" placeholder="e.g. 1200" value={flatForm.areaSqft} onChange={e => setFlatForm(p => ({ ...p, areaSqft: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Facing Direction</Label>
                  <Select value={flatForm.facing} onValueChange={val => setFlatForm(p => ({ ...p, facing: val }))}>
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select facing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North-East">North-East</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Base Price (₹)</Label>
                  <Input type="number" placeholder="e.g. 4500000" value={flatForm.price} onChange={e => setFlatForm(p => ({ ...p, price: e.target.value }))} className="rounded-[10px] h-10" />
                  {flatForm.price && <p className="text-xs text-gray-400">= {formatPrice(parseFloat(flatForm.price))}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Booking Amount (₹)</Label>
                  <Input type="number" placeholder="e.g. 100000" value={flatForm.bookingAmount} onChange={e => setFlatForm(p => ({ ...p, bookingAmount: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
              </div>
            </form>
          </div>

          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button onClick={handleAddFlat} disabled={formLoading} className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl h-10">
              {formLoading ? 'Adding...' : 'Add Property'}
            </Button>
            <Button variant="outline" className="rounded-xl h-10 px-6" onClick={() => setShowAddDialog(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT PROPERTY DIALOG */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[640px] rounded-2xl p-0 overflow-hidden max-h-[90vh]">
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">Edit Property</DialogTitle>
              <p className="text-blue-300 text-sm mt-1">{selectedFlat?.flat_number} · {selectedFlat?.project}</p>
            </div>
            <button onClick={() => setShowEditDialog(false)} className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-5">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Flat Number</Label>
                  <Input value={flatForm.flatNumber} onChange={e => setFlatForm(p => ({ ...p, flatNumber: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={flatForm.status} onValueChange={val => setFlatForm(p => ({ ...p, status: val }))}>
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                   <Label>Base Price (₹)</Label>
                   <Input type="number" value={flatForm.price} onChange={e => setFlatForm(p => ({ ...p, price: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
                <div className="space-y-1.5">
                   <Label>Discount (%)</Label>
                   <Input type="number" value={flatForm.discountPercent} onChange={e => setFlatForm(p => ({ ...p, discountPercent: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
              </div>
            </form>
          </div>

          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button onClick={handleEditFlat} disabled={formLoading} className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl h-10">
              {formLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" className="rounded-xl h-10 px-6" onClick={() => setShowEditDialog(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BOOKING DIALOG */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-[500px] rounded-2xl p-0 overflow-hidden">
          <div className="bg-[#0A1628] px-6 py-5">
            <DialogTitle className="text-white text-lg font-semibold">Book / Record Payment</DialogTitle>
            {selectedFlat && (
              <div className="flex gap-3 mt-2 text-blue-300 text-sm">
                <span>{selectedFlat.flat_number}</span>
                <span>·</span>
                <span>{selectedFlat.project}</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">{formatPrice(selectedFlat.price)}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleBookFlat} className="px-0 py-0 space-y-0">
            {(() => {
              const existingPayments = selectedFlat ? getFlatPayments(selectedFlat.flat_id) : [];
              const totalPaid = selectedFlat ? getFlatTotalPaid(selectedFlat.flat_id) : 0;
              if (existingPayments.length === 0) return null;

              return (
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 shadow-inner">
                  <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-2">Previous Payments</p>
                  <div className="space-y-1">
                    {existingPayments.map((p: any) => (
                      <div key={p.id} className="flex justify-between text-xs text-blue-800">
                        <span>{p.payment_type} · {new Date(p.payment_date).toLocaleDateString('en-IN')}</span>
                        <span className="font-bold">{formatPrice(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs font-bold text-blue-900 border-t border-blue-200 mt-2 pt-2">
                    <span>Total Paid</span>
                    <span>{formatPrice(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-blue-700 mt-1">
                    <span>Outstanding</span>
                    <span className="font-bold">{formatPrice((selectedFlat?.price || 0) - totalPaid)}</span>
                  </div>
                </div>
              );
            })()}

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Assign to Lead / Buyer *</Label>
                <Select value={bookingForm.leadId} onValueChange={val => setBookingForm(p => ({ ...p, leadId: val }))}>
                  <SelectTrigger className="rounded-[10px] h-10">
                    <SelectValue placeholder="Select buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name} — {l.phone}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Amount (₹) *</Label>
                  <Input type="number" value={bookingForm.amount} onChange={e => setBookingForm(p => ({ ...p, amount: e.target.value }))} className="rounded-[10px] h-10" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Payment Date *</Label>
                  <Input type="date" value={bookingForm.paymentDate} onChange={e => setBookingForm(p => ({ ...p, paymentDate: e.target.value }))} className="rounded-[10px] h-10" required />
                </div>
              </div>
              <Button type="submit" disabled={formLoading} className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl h-11 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                {formLoading ? 'Processing...' : 'Confirm Payment & Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DETAIL DIALOG */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-[700px] rounded-2xl p-0 overflow-hidden max-h-[90vh]">
          <div className="bg-[#F8FAFC] border-b border-gray-100 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-bold text-lg text-[#0F172A]">{selectedFlat?.flat_number}</div>
              <div>
                 <DialogTitle className="text-xl font-bold text-[#0F172A]">{selectedFlat?.project}</DialogTitle>
                 <Badge className={`${getStatusColor(selectedFlat?.status || '')} rounded-full text-[10px] font-bold uppercase mt-1`}>{selectedFlat?.status}</Badge>
              </div>
            </div>
            <button onClick={() => setShowDetailDialog(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-8">
             <div className="grid grid-cols-4 gap-4 p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                {[
                  { label: 'Type', val: selectedFlat?.type },
                  { label: 'Floor', val: selectedFlat?.floor },
                  { label: 'Area', val: `${selectedFlat?.area_sqft} sq.ft` },
                  { label: 'Price', val: formatPrice(selectedFlat?.price || 0) },
                ].map((d, i) => (
                  <div key={i}>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{d.label}</p>
                    <p className="text-sm font-bold text-[#0F172A]">{d.val}</p>
                  </div>
                ))}
             </div>

             {selectedFlat?.assigned_lead && (
               <div className="space-y-3">
                  <h4 className="font-bold text-[#0F172A] flex items-center gap-2"><UserPlus className="w-4 h-4 text-blue-500" /> Buyer Information</h4>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">Name</p>
                      <p className="font-bold text-[#0F172A]">{selectedFlat.assigned_lead.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">Phone</p>
                      <p className="font-bold text-[#0F172A]">{selectedFlat.assigned_lead.phone}</p>
                    </div>
                  </div>
               </div>
             )}

             {(() => {
                const flatPayments = selectedFlat ? getFlatPayments(selectedFlat.flat_id) : [];
                const totalPaid = selectedFlat ? getFlatTotalPaid(selectedFlat.flat_id) : 0;
                const remaining = selectedFlat ? (selectedFlat.price || 0) - totalPaid : 0;
                const paidPercent = selectedFlat?.price > 0 ? Math.round((totalPaid / selectedFlat.price) * 100) : 0;

                return (
                  <div className="space-y-5">
                    <h4 className="font-bold text-[#0F172A] flex items-center gap-2">
                       <CreditCard className="w-4 h-4 text-emerald-500" /> Payment History
                    </h4>

                    {selectedFlat?.price > 0 && selectedFlat?.status !== 'Available' && (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                          <span>Paid: {formatPrice(totalPaid)}</span>
                          <span>Remaining: {formatPrice(remaining)}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${paidPercent}%` }} />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2 text-right font-medium">
                          {paidPercent}% of {formatPrice(selectedFlat.price)} recovered
                        </p>
                      </div>
                    )}

                    {flatPayments.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-gray-400 font-medium">No payments recorded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {flatPayments.map((payment: any) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#0F172A]">{payment.payment_type}</p>
                                <p className="text-[11px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
                                  {new Date(payment.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  {payment.payment_mode && <span>• {payment.payment_mode}</span>}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#0F172A]">{formatPrice(payment.amount)}</p>
                              <Badge className={`mt-1 text-[9px] font-bold uppercase px-1.5 h-4 border-transparent ${payment.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {payment.status || 'Received'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white mt-4">
                          <span className="text-sm font-bold uppercase tracking-wider">Total Collection</span>
                          <span className="text-lg font-bold">{formatPrice(totalPaid)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
             })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### `app/sales/visits/actions.ts`
```typescript
"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function scheduleVisitAction(formData: FormData) {
  const lead_id = formData.get("lead_id") as string
  const flat_id = formData.get("flat_id") as string
  const scheduled_at = formData.get("scheduled_at") as string // ISO datetime string

  if (!lead_id || !flat_id || !scheduled_at) {
    return { success: false, error: "Missing required fields" }
  }

  const { data, error } = await supabase
    .from("site_visits")
    .insert([{
      lead_id,
      flat_id,
      scheduled_at,
      status: "Scheduled",
      reminder_sent: false
    }])
    .select(`
      visit_id, scheduled_at, status, reminder_sent,
      leads_customers (id, name, phone),
      flats_inventory (flat_id, project, flat_number)
    `)
    .single()

  if (error) {
    console.error("Failed to schedule visit:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/sales/visits")
  return { success: true, data }
}

export async function updateVisitStatusAction(visitId: string, status: string) {
  const { error } = await supabase
    .from("site_visits")
    .update({ status })
    .eq("visit_id", visitId)

  if (error) {
    console.error("Failed to update visit status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/sales/visits")
  return { success: true }
}
```

### `app/sales/visits/client.tsx`
```tsx
"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@/lib/supabase-browser'
import { 
  Calendar as CalendarIcon, Clock, MapPin, Phone, MessageCircle, 
  CheckCircle2, XCircle, UserPlus, ChevronLeft, ChevronRight,
  MoreVertical, Plus, Trash2, Loader2, RefreshCw
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

function getStatusColor(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'scheduled': return "bg-blue-100 text-[#0066FF] border-none"
    case 'completed': return "bg-green-100 text-green-700 border-none"
    case 'no show': return "bg-red-100 text-red-700 border-none"
    case 'rescheduled': return "bg-orange-100 text-orange-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

export default function VisitsClient() {
  const [visits, setVisits] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [addingLoading, setAddingLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("today");
  
  const [formData, setFormData] = useState({
    leadId: '', flatId: '', scheduledDate: new Date().toISOString().split('T')[0], 
    scheduledTime: '10:00', assignedBrokerId: '', notes: ''
  });

  const { toast } = useToast();
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    const channel = supabase
      .channel('visits-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_visits' }, () => fetchData())
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch visits
    const { data: visitsData, error: visitsError } = await supabase
      .from('site_visits')
      .select(`
        *,
        lead:leads_customers(id, name, phone),
        flat:flats_inventory(flat_id, flat_number, project),
        broker:users(id, name)
      `)
      .order('scheduled_at', { ascending: true });

    if (visitsData) setVisits(visitsData);

    // Fetch dependencies for dropdowns
    const { data: leadsData } = await supabase.from('leads_customers').select('id, name, phone');
    if (leadsData) setLeads(leadsData);
    
    const { data: flatsData } = await supabase.from('flats_inventory').select('flat_id, flat_number, project');
    if (flatsData) setFlats(flatsData);

    const { data: brokersData } = await supabase.from('users').select('id, name').in('role', ['BROKER', 'VP_SALES', 'ADMIN']);
    if (brokersData) setBrokers(brokersData);

    setLoading(false);
  };

  const addVisit = async () => {
    if (!formData.leadId || !formData.flatId || !formData.scheduledDate || !formData.scheduledTime) {
      toast({ title: 'Validation Error', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    
    setAddingLoading(true);
    
    const datetime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}:00`).toISOString();
    
    const { error } = await supabase
      .from('site_visits')
      .insert({
        lead_id: formData.leadId,
        flat_id: formData.flatId,
        broker_id: formData.assignedBrokerId || null,
        scheduled_at: datetime,
        status: 'Scheduled',
        notes: formData.notes
      });
      
    setAddingLoading(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Site visit scheduled successfully' });
      setShowAddDialog(false);
      setFormData({ leadId: '', flatId: '', scheduledDate: new Date().toISOString().split('T')[0], scheduledTime: '10:00', assignedBrokerId: '', notes: '' });
    }
  };

  const updateVisitStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('site_visits')
      .update({ status })
      .eq('id', id);
      
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Visit marked as ${status}` });
    }
  };

  const deleteVisit = async (id: string) => {
    const { error } = await supabase
      .from('site_visits')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Visit deleted' });
    }
  };

  // Prepare derived data for UI
  const visitsDataUI = visits.map(v => {
    const d = new Date(v.scheduled_at);
    return {
      ...v,
      dateObj: d,
      dateStr: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      timeStr: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      leadName: v.lead?.name || 'Unknown Lead',
      leadPhone: v.lead?.phone || 'N/A',
      propertyName: v.flat ? `${v.flat.project} - ${v.flat.flat_number}` : 'Unknown Property',
      brokerName: v.broker?.name || 'Unassigned',
      status: v.status || 'Scheduled'
    };
  });

  const getFilteredVisits = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (activeTab) {
      case "today":
        return visitsDataUI.filter(v => {
          const vDate = new Date(v.dateObj);
          vDate.setHours(0,0,0,0);
          return vDate.getTime() === today.getTime();
        });
      case "upcoming":
        return visitsDataUI.filter(v => {
          const vDate = new Date(v.dateObj);
          vDate.setHours(0,0,0,0);
          return vDate.getTime() > today.getTime() && v.status === "Scheduled";
        });
      case "completed":
        return visitsDataUI.filter(v => v.status === "Completed");
      case "noshow":
        return visitsDataUI.filter(v => v.status === "No Show");
      default:
        return visitsDataUI;
    }
  }

  const visitDates = visitsDataUI.map(v => v.dateObj);

  // KPIs
  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);
  const totalVisits = visits.length;
  const todayVisits = visitsDataUI.filter(v => {
    const d = new Date(v.dateObj);
    d.setHours(0,0,0,0);
    return d.getTime() === todayDate.getTime();
  }).length;
  const completedVisits = visits.filter(v => v.status === 'Completed').length;
  const noShows = visits.filter(v => v.status === 'No Show').length;

  if (loading) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 animate-pulse text-center pt-20">
         <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#0066FF]" />
         <p className="text-gray-500 mt-4 font-medium">Loading visits schedule...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Site Visit Scheduler</h1>
          <p className="text-[#64748B] text-sm mt-1">Manage broker appointments and property tours</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Today's Visits", value: todayVisits, icon: Clock, color: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/30" },
            { label: "Total Visits", value: totalVisits, icon: CalendarIcon, color: "from-purple-600 to-purple-400", shadow: "shadow-purple-500/30" },
            { label: "Completed", value: completedVisits, icon: CheckCircle2, color: "from-emerald-500 to-emerald-400", shadow: "shadow-emerald-500/30" },
            { label: "No Shows", value: noShows, icon: XCircle, color: "from-red-500 to-red-400", shadow: "shadow-red-500/30" },
          ].map((kpi, i) => (
            <Card 
              key={i}
              className="overflow-hidden bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1]"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-[12px] bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-md ${kpi.shadow} shrink-0`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">{kpi.value}</h3>
                  <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em] mt-1">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* DUAL COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-12 inline-flex">
                <TabsTrigger value="today" className="rounded-[8px] px-6 text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm">
                  Today
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="rounded-[8px] px-6 text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-[8px] px-6 text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="noshow" className="rounded-[8px] px-6 text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm">
                  No Show
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0 space-y-4 outline-none">
              {getFilteredVisits().length > 0 ? (
                getFilteredVisits().map((visit) => (
                  <Card key={visit.id} className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden hover:border-[#CBD5E1] transition-colors">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      {/* Left Date/Time Badge */}
                      <div className="bg-[#F8FAFC] border-b sm:border-b-0 sm:border-r border-gray-100 p-4 flex sm:flex-col items-center justify-center sm:w-32 shrink-0 gap-3 sm:gap-1">
                        <div className="text-center">
                          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">{visit.dateObj.toLocaleDateString("en-US", { month: "short" })}</p>
                          <p className="text-[28px] font-bold text-[#0F172A] leading-none">{visit.dateObj.getDate()}</p>
                        </div>
                        <div className="hidden sm:block w-8 h-[1px] bg-gray-200 my-1" />
                        <div className="flex items-center text-[#0066FF] font-bold text-[13px]">
                          <Clock className="w-3.5 h-3.5 mr-1" /> {visit.timeStr}
                        </div>
                      </div>
                      
                      {/* Right Detail Panel */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 mt-1 rounded-full bg-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-700 shadow-inner">
                              {(visit.leadName || 'U').split(' ')[0]?.[0] || 'U'}{(visit.leadName || '').split(' ')[1]?.[0] || ''}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="text-[16px] font-bold text-[#0F172A]">{visit.leadName}</h3>
                                <Badge className={`${getStatusColor(visit.status)} shadow-none text-[10px] rounded-full font-bold uppercase tracking-wide px-2 py-0`}>
                                  {visit.status}
                                </Badge>
                              </div>
                              <p className="text-[13px] text-[#64748B] flex items-center gap-1.5 font-medium mb-1">
                                <Phone className="w-3.5 h-3.5" /> {visit.leadPhone}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-[10px] rounded-full tracking-wider font-bold border-gray-200 text-gray-500 bg-white shadow-sm">
                                  <MapPin className="w-3 h-3 mr-1 text-orange-400" /> {visit.propertyName}
                                </Badge>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
                                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] font-bold">
                                    {(visit.brokerName || 'U').split(' ')[0]?.[0] || 'U'}
                                  </div>
                                  <span className="text-[10px] font-bold text-[#64748B]">{visit.brokerName}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Desktop action buttons */}
                          <div className="hidden sm:flex flex-col gap-2 items-end">
                            {visit.status === 'Scheduled' ? (
                              <>
                                <Button onClick={() => updateVisitStatus(visit.id, 'Completed')} className="h-8 bg-[#10B981] hover:bg-[#059669] text-white rounded-[8px] shadow-sm font-semibold text-[12px] w-[130px]">
                                  Mark Complete
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-8 rounded-[8px] border-gray-200 text-[#0F172A] hover:bg-gray-50 font-semibold text-[12px] w-[130px]">
                                      Manage <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[180px]">
                                    <DropdownMenuItem onClick={() => updateVisitStatus(visit.id, 'Rescheduled')}>
                                      <RefreshCw className="mr-2 h-4 w-4" /> Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateVisitStatus(visit.id, 'No Show')}>
                                      <XCircle className="mr-2 h-4 w-4" /> Mark No Show
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => deleteVisit(visit.id)} className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete Visit
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </>
                            ) : (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => deleteVisit(visit.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {visit.notes && (
                          <div className="bg-orange-50/50 border border-orange-100 rounded-[8px] p-2.5 mt-2">
                            <p className="text-[12px] text-orange-800 font-medium">📋 Notes: {visit.notes}</p>
                          </div>
                        )}
                        
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-[16px] border border-[#E8ECF0]">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-[#0F172A]">No visits found</h3>
                  <p className="text-sm text-[#64748B]">There are no visits for this category.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN: Calendar */}
        <div className="space-y-6">
          <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden sticky top-6">
            <div className="bg-[#F8FAFC] border-b border-gray-100 p-4">
              <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#0066FF]" /> Master Calendar
              </h3>
            </div>
            <CardContent className="p-4 pt-4 flex flex-col items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md w-full"
                modifiers={{ booked: visitDates }}
                modifiersStyles={{
                  booked: { fontWeight: 'bold', backgroundColor: '#EFF6FF', color: '#0066FF', borderRadius: '50%' }
                }}
                classNames={{
                  head_cell: "text-muted-foreground font-semibold text-[11px] uppercase tracking-wider w-9",
                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 rounded-full hover:bg-gray-100",
                  day_selected: "bg-[#0066FF] text-white hover:bg-[#0066FF] hover:text-white focus:bg-[#0066FF] focus:text-white rounded-full",
                  day_today: "bg-gray-100 text-gray-900 rounded-full",
                }}
              />
              
              <div className="w-full h-px bg-gray-100 my-4" />
              
              <div className="w-full">
                <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em] mb-2">{date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Selected Date"}</p>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                  {visitsDataUI.filter(v => v.dateObj.getDate() === date?.getDate() && v.dateObj.getMonth() === date?.getMonth()).length > 0 ? (
                     visitsDataUI.filter(v => v.dateObj.getDate() === date?.getDate() && v.dateObj.getMonth() === date?.getMonth()).map(v => (
                      <div key={v.id} className="flex items-center gap-3 p-2 rounded-[8px] hover:bg-gray-50 border border-transparent hover:border-gray-100">
                        <div className={`w-2 h-2 rounded-full ${v.status === 'Completed' ? 'bg-green-500' : 'bg-[#0066FF]'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-[#0F172A] truncate">{v.leadName}</p>
                          <p className="text-[11px] font-medium text-[#64748B] truncate">{v.timeStr} • {v.propertyName}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[13px] text-gray-500 italic p-2">No visits scheduled for this date.</p>
                  )}
                </div>
              </div>

              <div className="w-full mt-6">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-md font-semibold h-11">
                      <Plus className="mr-2 h-4 w-4" /> Schedule New Visit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Schedule Site Visit</DialogTitle>
                      <DialogDescription>
                        Set up a new property tour for an existing lead.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Lead Name</label>
                        <Select value={formData.leadId} onValueChange={(v) => setFormData({...formData, leadId: v})}>
                          <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                            <SelectValue placeholder="Search connected lead..." />
                          </SelectTrigger>
                          <SelectContent>
                            {leads.map(l => (
                              <SelectItem key={l.id} value={l.id}>{l.name} ({l.phone})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Property</label>
                        <Select value={formData.flatId} onValueChange={(v) => setFormData({...formData, flatId: v})}>
                          <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                            <SelectValue placeholder="Select Property..." />
                          </SelectTrigger>
                          <SelectContent>
                            {flats.map(f => (
                              <SelectItem key={f.flat_id} value={f.flat_id}>{f.project} - {f.flat_number}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Date</label>
                          <Input type="date" value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} className="rounded-[10px] border-gray-200" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Time</label>
                          <Input type="time" value={formData.scheduledTime} onChange={e => setFormData({...formData, scheduledTime: e.target.value})} className="rounded-[10px] border-gray-200" />
                        </div>
                      </div>
                       <div className="space-y-2">
                        <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Assign Broker</label>
                        <Select value={formData.assignedBrokerId} onValueChange={v => setFormData({...formData, assignedBrokerId: v})}>
                          <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                            <SelectValue placeholder="Select Broker" />
                          </SelectTrigger>
                          <SelectContent>
                            {brokers.map(b => (
                              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Additional Notes</label>
                        <Textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Any specific requirements?" className="rounded-[10px] border-gray-200 bg-[#F8FAFC]" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-[10px] font-semibold border-gray-200">Cancel</Button>
                      <Button onClick={addVisit} disabled={addingLoading} className="rounded-[10px] font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white">
                        {addingLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Confirm Booking
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}
```

### `app/sales/visits/components/visits-client.tsx`
```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { NativeSelect as Select } from "@/components/ui/native-select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"
import { scheduleVisitAction, updateVisitStatusAction } from "../actions"
import { Calendar as CalendarIcon, List, Plus } from "lucide-react"

type Visit = {
  visit_id: string
  scheduled_at: string
  status: string
  reminder_sent: boolean
  lead: { id: string, name: string, phone: string }
  flat: { flat_id: string, project: string, flat_number: string }
}

export function VisitsClient({ initialVisits, leads, flats }: { 
  initialVisits: Visit[], 
  leads: any[], 
  flats: any[] 
}) {
  const [visits, setVisits] = useState<Visit[]>(initialVisits)
  const [view, setView] = useState<"list" | "calendar">("list")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleScheduleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    // Validate datetime
    const dt = formData.get("scheduled_at") as string
    if (!dt) {
      toast({ title: "Date/Time is required", variant: "destructive" })
      setIsSubmitting(false)
      return
    }

    // Convert local datetime-local value to ISO UTC string
    const isoDate = new Date(dt).toISOString()
    formData.set("scheduled_at", isoDate)

    const res = await scheduleVisitAction(formData)
    if (res.success) {
      // Optimistic update
      const data = res.data as any;
      const newVisit = {
        ...data,
        lead: Array.isArray(data.leads_customers) ? data.leads_customers[0] : data.leads_customers,
        flat: Array.isArray(data.flats_inventory) ? data.flats_inventory[0] : data.flats_inventory,
      } as Visit;
      setVisits(prev => [...prev, newVisit].sort((a,b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()))
      toast({ title: "Visit Scheduled Successfully" })
      setIsAddOpen(false)
    } else {
      toast({ title: "Error scheduling visit", description: res.error, variant: "destructive" })
    }
    setIsSubmitting(false)
  }

  async function handleStatusChange(visitId: string, status: string) {
    const res = await updateVisitStatusAction(visitId, status)
    if (res.success) {
      setVisits(visits.map(v => v.visit_id === visitId ? { ...v, status } : v))
      toast({ title: "Status updated" })
    } else {
      toast({ title: "Failed to update status", variant: "destructive" })
    }
  }

  // Simplified calendar rendering logic for current month
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1
    if (day > 0 && day <= daysInMonth) {
      return new Date(today.getFullYear(), today.getMonth(), day)
    }
    return null
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Button 
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" /> List View
          </Button>
          <Button 
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" /> Monthly View
          </Button>
        </div>
        
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2"/> Schedule Visit
        </Button>
      </div>

      {view === "list" ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-950 dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reminder Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-slate-500">No scheduled visits.</TableCell>
                </TableRow>
              ) : visits.map(visit => {
                const isPast = new Date(visit.scheduled_at) < new Date() && visit.status === "Scheduled"
                return (
                  <TableRow key={visit.visit_id}>
                    <TableCell className="font-medium">
                      {visit.lead?.name} <span className="text-xs text-slate-400 block">{visit.lead?.phone}</span>
                    </TableCell>
                    <TableCell>{visit.flat?.project} - {visit.flat?.flat_number}</TableCell>
                    <TableCell>
                      <div className={isPast ? "text-red-500 font-medium" : ""}>
                        {new Date(visit.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={visit.status}
                        onChange={(e) => handleStatusChange(visit.visit_id, e.target.value)}
                        className="h-8 w-32 text-xs"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="No Show">No Show</option>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {visit.reminder_sent ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                         <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800 text-center">
            <h3 className="text-xl font-semibold mb-6">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:border-slate-800 rounded-lg overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                 <div key={d} className="bg-slate-50 dark:bg-slate-900 py-2 text-sm font-semibold">{d}</div>
              ))}
              {calendarDays.map((date, i) => {
                if (!date) return <div key={i} className="bg-white dark:bg-slate-950 p-2 min-h-[100px]" />
                const dayVisits = visits.filter(v => new Date(v.scheduled_at).toDateString() === date.toDateString())
                const isToday = date.toDateString() === today.toDateString()
                
                return (
                  <div key={i} className={`bg-white dark:bg-slate-950 p-2 min-h-[120px] text-left border-t border-slate-100 dark:border-slate-800 relative ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {date.getDate()}
                    </span>
                    <div className="mt-2 flex flex-col gap-1">
                      {dayVisits.map(v => (
                        <div key={v.visit_id} 
                             className={`text-xs p-1 rounded border-l-2 ${v.status === 'Completed' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : v.status === 'No Show' ? 'border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400' : 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'} truncate cursor-pointer hover:opacity-80`}
                             title={`${new Date(v.scheduled_at).toLocaleTimeString([], {timeStyle: 'short'})} ${v.lead?.name}`}
                        >
                          {new Date(v.scheduled_at).toLocaleTimeString([], {timeStyle: 'short'})} <br/> {v.lead?.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
        </div>
      )}

      {/* Schedule Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <form onSubmit={handleScheduleSubmit}>
            <DialogHeader>
              <DialogTitle>Schedule Site Visit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="lead_id">Select Lead</Label>
                <Select id="lead_id" name="lead_id" required defaultValue="">
                  <option value="" disabled>-- Choose a Lead --</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.phone})</option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flat_id">Select Flat</Label>
                <Select id="flat_id" name="flat_id" required defaultValue="">
                  <option value="" disabled>-- Choose Available Flat --</option>
                  {flats.map(f => (
                    <option key={f.flat_id} value={f.flat_id}>{f.project} - {f.flat_number}</option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduled_at">Date & Time</Label>
                {/* Fallback to native datetime-local for simpler robust UI */}
                <Input type="datetime-local" id="scheduled_at" name="scheduled_at" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Scheduling..." : "Schedule Visit"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

### `app/sales/visits/page.tsx`
```tsx
export const dynamic = 'force-dynamic';
import VisitsClient from './client';

export default function VisitsPage() {
  return <VisitsClient />
}
```

### `components.json`
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### `components/shared/Logo.tsx`
```tsx
import Image from 'next/image';

/* 
========================================
HOW TO ADD YOUR COMPANY LOGO
========================================
1. Save your logo as PNG with transparent background
2. Place it in the /public folder as "logo.png"
3. In this file, replace the gradient "A" div with:

    <Image 
      src="/logo.png" 
      width={140} 
      height={36} 
      alt="Your Company Logo"
      style={{ objectFit: 'contain' }}
    />

4. Remove the gradient box and text divs below it
========================================
*/

export default function Logo() {
  return (
    <div style={{
      padding: '20px 20px 16px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      {/* 
        LOGO PLACEHOLDER
        To replace with your logo:
        1. Add your logo file to /public/logo.png
        2. Change the src below to "/logo.png"
        3. Adjust width and height as needed
      */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Logo image - replace src with your logo */}
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, #0066FF, #6366F1)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: '700',
          color: 'white',
          flexShrink: 0
        }}>
          A
        </div>
        <div>
          <div style={{
            color: 'white',
            fontWeight: '700',
            fontSize: '16px',
            lineHeight: '1.2',
            letterSpacing: '-0.3px'
          }}>
            Analyzehive
          </div>
          <div style={{
            color: '#60A5FA',
            fontWeight: '500',
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            Flow
          </div>
        </div>
      </div>
    </div>
  );
}
```

### `components/shared/index.ts`
```typescript
// Shared components (navbar, sidebar, layout elements) will go here
```

### `components/ui/badge.tsx`
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
    outline: "text-slate-950",
    success: "border-transparent bg-emerald-500 text-white hover:bg-emerald-600",
    warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600",
  }
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
```

### `components/ui/button.tsx`
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### `components/ui/calendar.tsx`
```tsx
"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
```

### `components/ui/card.tsx`
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### `components/ui/checkbox.tsx`
```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("grid place-content-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

### `components/ui/dialog.tsx`
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

// A simplified generic dialog component for Analyzehive flow using an overlay approach
// Since we don't have radix-ui available, this is a basic state-driven dialog.

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // If no state provided, fallback to uncontrolled
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open !== undefined ? open : internalOpen

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => {
          setInternalOpen(false)
          if (onOpenChange) onOpenChange(false)
        }}
      />
      <div className="relative z-50 w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lg sm:rounded-xl dark:border-slate-800 dark:bg-slate-950">
        {children}
      </div>
    </div>
  )
}

export function DialogTrigger({ asChild, onClick, children }: { asChild?: boolean, onClick?: () => void, children: React.ReactNode }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick })
  }
  return <div onClick={onClick}>{children}</div>
}

export function DialogContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("grid gap-4", className)}>{children}</div>
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-500", className)} {...props} />
}
```

### `components/ui/dropdown-menu.tsx`
```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

### `components/ui/index.ts`
```typescript
// Exportable UI components will go here
```

### `components/ui/input.tsx`
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### `components/ui/label.tsx`
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }
```

### `components/ui/native-select.tsx`
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
NativeSelect.displayName = "NativeSelect"

export { NativeSelect }
```

### `components/ui/progress.tsx`
```tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
```

### `components/ui/select.tsx`
```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

### `components/ui/sheet.tsx`
```tsx
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open !== undefined ? open : internalOpen

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="fixed inset-0 bg-black/80 transition-opacity" 
        onClick={() => {
          setInternalOpen(false)
          if (onOpenChange) onOpenChange(false)
        }}
      />
      <div className="relative z-50 h-full w-3/4 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out sm:max-w-sm dark:bg-slate-950">
        {children}
      </div>
    </div>
  )
}

export function SheetTrigger({ children, onClick, asChild }: { children: React.ReactNode, onClick?: () => void, asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, { onClick })
  }
  return <div onClick={onClick} className="inline-block">{children}</div>
}

export function SheetContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: string }) {
  return <div className={cn("grid gap-4", className)} {...props}>{children}</div>
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold text-slate-950 dark:text-slate-50", className)} {...props} />
}

export function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
}
```

### `components/ui/sidebar.tsx`
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-12 border-r bg-white dark:bg-slate-950 w-64 h-screen fixed inset-y-0 left-0 z-20 flex flex-col", className)}>
      <div className="space-y-4 py-4 h-full flex flex-col">
        {children}
      </div>
    </div>
  )
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-3 py-2", className)}>{children}</div>
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 px-3 py-2 overflow-auto", className)}>{children}</div>
}

export function SidebarGroup({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("py-2", className)}>{children}</div>
}

export function SidebarGroupLabel({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 text-xs font-semibold tracking-tight text-slate-500", className)}>{children}</div>
}

export function SidebarGroupContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("w-full", className)}>{children}</div>
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex w-full min-w-0 flex-col gap-1", className)}>{children}</ul>
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("relative", className)}>{children}</li>
}

export function SidebarMenuButton({ className, children, isActive, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-slate-950 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 active:bg-slate-100 active:text-slate-900 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:ring-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:active:bg-slate-800 dark:active:text-slate-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        isActive && "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

### `components/ui/skeleton.tsx`
```tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-100 dark:bg-slate-800", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

### `components/ui/slider.tsx`
```tsx
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
```

### `components/ui/switch.tsx`
```tsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

### `components/ui/table.tsx`
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("border-t bg-slate-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-slate-800/50", className)} {...props} />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800", className)} {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("h-10 px-2 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400", className)} {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
))
TableCaption.displayName = "TableCaption"

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
```

### `components/ui/tabs.tsx`
```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

### `components/ui/textarea.tsx`
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
```

### `components/ui/toast.tsx`
```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

// A simple toast system
type ToastContextType = {
  toasts: ToastProps[]
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <Toaster toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  // Provide shadcn-like API
  return { toast: context.toast, dismiss: context.dismiss }
}

function Toaster({ toasts, dismiss }: { toasts: ToastProps[], dismiss: (id: string) => void }) {
  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, variant }) {
        return (
          <div
            key={id}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all mb-2",
              variant === "destructive" ? "destructive group border-red-500 bg-red-500 text-slate-50" : "border-slate-200 bg-white text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
            )}
          >
            <div className="grid gap-1">
              {title && <div className="text-sm font-semibold">{title}</div>}
              {description && <div className="text-sm opacity-90">{description}</div>}
            </div>
            <button
              onClick={() => dismiss(id)}
              className="absolute right-2 top-2 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            >
              x
            </button>
          </div>
        )
      })}
    </div>
  )
}
```

### `lib/data.ts`
```typescript
import { supabase } from './supabase';

// ==========================================
// SALES FUNCTIONS
// ==========================================

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads_customers')
    .select(`
      *,
      assigned_user:users(id, name, avatar_initials)
    `)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getLeadById(id: string) {
  const { data, error } = await supabase
    .from('leads_customers')
    .select(`
      *,
      assigned_user:users(id, name, avatar_initials),
      site_visits(*),
      documents(*),
      payments(*)
    `)
    .eq('id', id)
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function getLeadsStats() {
  const { data, error } = await supabase
    .from('leads_customers')
    .select('status, source');
  if (error) { console.error(error); return null; }
  
  const total = data.length;
  const newLeads = data.filter(
    l => l.status === 'New').length;
  const contacted = data.filter(
    l => l.status === 'Contacted').length;
  const siteVisit = data.filter(
    l => l.status === 'Site Visit Scheduled').length;
  const negotiation = data.filter(
    l => l.status === 'Negotiation').length;
  const converted = data.filter(
    l => l.status === 'Converted').length;
  const lost = data.filter(
    l => l.status === 'Lost').length;

  return { 
    total, newLeads, contacted, 
    siteVisit, negotiation, 
    converted, lost 
  };
}

export async function createLead(lead: {
  name: string;
  phone: string;
  email?: string;
  source: string;
  assigned_user_id?: string;
  project_interest?: string;
  flat_type_interest?: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('leads_customers')
    .insert(lead)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function updateLeadStatus(
  id: string, 
  status: string
) {
  const { data, error } = await supabase
    .from('leads_customers')
    .update({ 
      status, 
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function getFlatsInventory() {
  const { data, error } = await supabase
    .from('flats_inventory')
    .select('*')
    .order('project')
    .order('flat_number');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getFlatsStats() {
  const { data, error } = await supabase
    .from('flats_inventory')
    .select('status');
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    available: data.filter(
      f => f.status === 'Available').length,
    onHold: data.filter(
      f => f.status === 'On Hold').length,
    sold: data.filter(
      f => f.status === 'Sold').length,
  };
}

export async function updateFlatStatus(
  flatId: string, 
  status: string
) {
  const { data, error } = await supabase
    .from('flats_inventory')
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq('flat_id', flatId)
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function getSiteVisits() {
  const { data, error } = await supabase
    .from('site_visits')
    .select(`
      *,
      lead:leads_customers(
        id, name, phone, email
      ),
      flat:flats_inventory(
        flat_id, flat_number, 
        project, type
      ),
      broker:users(id, name, avatar_initials)
    `)
    .order('scheduled_at', { ascending: true });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      lead:leads_customers(id, name, phone),
      verified_by_user:users(id, name)
    `)
    .order('uploaded_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      lead:leads_customers(id, name, phone),
      flat:flats_inventory(
        flat_id, flat_number, project
      )
    `)
    .order('payment_date', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getBrokers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('role', ['BROKER', 'VP_SALES'])
    .eq('status', 'Active');
  if (error) { console.error(error); return []; }
  return data;
}

// ==========================================
// CONSTRUCTION FUNCTIONS
// ==========================================

export async function getInventoryItems() {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('category')
    .order('name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getInventoryStats() {
  const { data, error } = await supabase
    .from('inventory_items')
    .select(
      'current_stock_level, min_threshold'
    );
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    good: data.filter(
      i => i.current_stock_level > 
        i.min_threshold * 2).length,
    low: data.filter(
      i => i.current_stock_level > 
        i.min_threshold && 
        i.current_stock_level <= 
        i.min_threshold * 2).length,
    critical: data.filter(
      i => i.current_stock_level <= 
        i.min_threshold).length,
  };
}

export async function getMaterialDemands() {
  const { data, error } = await supabase
    .from('material_demands')
    .select(`
      *,
      item:inventory_items(
        id, name, category, 
        unit_of_measurement
      ),
      requested_by:users(id, name),
      approved_by:users(id, name)
    `)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function approveDemand(
  id: string, 
  approvedBy: string
) {
  const { data: demand } = await supabase
    .from('material_demands')
    .select('*, item:inventory_items(*)')
    .eq('id', id)
    .single();

  if (!demand) return null;

  const { error: updateError } = await supabase
    .from('material_demands')
    .update({
      status: 'Approved',
      approved_by_user_id: approvedBy,
    })
    .eq('id', id);

  if (updateError) return null;

  await supabase
    .from('inventory_items')
    .update({
      current_stock_level: 
        demand.item.current_stock_level - 
        demand.quantity_requested,
      updated_at: new Date().toISOString()
    })
    .eq('id', demand.item_id);

  return true;
}

export async function rejectDemand(
  id: string, 
  rejectedBy: string
) {
  const { error } = await supabase
    .from('material_demands')
    .update({
      status: 'Rejected',
      approved_by_user_id: rejectedBy,
    })
    .eq('id', id);
  if (error) return null;
  return true;
}

export async function getAssets() {
  const { data, error } = await supabase
    .from('assets_equipment')
    .select(`
      *,
      assigned_user:users(id, name)
    `)
    .order('status')
    .order('name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getAssetsStats() {
  const { data, error } = await supabase
    .from('assets_equipment')
    .select('status');
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    active: data.filter(
      a => a.status === 'Active').length,
    maintenance: data.filter(
      a => a.status === 'Maintenance').length,
    decommissioned: data.filter(
      a => a.status === 'Decommissioned').length,
  };
}

export async function getLabourAttendance(
  date?: string
) {
  const targetDate = date || 
    new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('labour_attendance')
    .select('*')
    .eq('date', targetDate)
    .order('role')
    .order('worker_name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getAttendanceStats(
  date?: string
) {
  const targetDate = date || 
    new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('labour_attendance')
    .select('status, role')
    .eq('date', targetDate);
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    present: data.filter(
      l => l.status === 'Present').length,
    absent: data.filter(
      l => l.status === 'Absent').length,
    halfDay: data.filter(
      l => l.status === 'Half Day').length,
    onLeave: data.filter(
      l => l.status === 'On Leave').length,
  };
}

export async function getDailyProgress() {
  const { data, error } = await supabase
    .from('daily_progress')
    .select(`
      *,
      submitted_by_user:users(id, name)
    `)
    .order('date', { ascending: false })
    .limit(20);
  if (error) { console.error(error); return []; }
  return data;
}

export async function getVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('name');
  if (error) { console.error(error); return []; }
  return data;
}

// ==========================================
// FINANCE / MD FUNCTIONS
// ==========================================

export async function getFinancialLedger() {
  const { data, error } = await supabase
    .from('financial_ledger')
    .select(`
      *,
      logged_by:users(id, name)
    `)
    .order('transaction_date', 
      { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getFinancialStats() {
  const { data, error } = await supabase
    .from('financial_ledger')
    .select('transaction_type, amount, category')
    .eq('status', 'Approved');
  if (error) { console.error(error); return null; }
  
  const totalRevenue = data
    .filter(t => t.transaction_type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = data
    .filter(t => t.transaction_type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 
    ? (netProfit / totalRevenue * 100).toFixed(1) 
    : '0';

  const marketingSpend = data
    .filter(t => 
      t.transaction_type === 'Expense' && 
      t.category === 'Marketing')
    .reduce((sum, t) => sum + t.amount, 0);

  const constructionSpend = data
    .filter(t => 
      t.transaction_type === 'Expense' && 
      t.category === 'Construction')
    .reduce((sum, t) => sum + t.amount, 0);

  return { 
    totalRevenue, totalExpenses, 
    netProfit, profitMargin,
    marketingSpend, constructionSpend
  };
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function getProjectsStats() {
  const { data, error } = await supabase
    .from('projects')
    .select(
      'status, completion_percentage, ' +
      'budget_total, budget_spent'
    );
  if (error) { console.error(error); return null; }
  
  return {
    total: data.length,
    active: data.filter(
      (p: any) => p.status === 'Active').length,
    completed: data.filter(
      (p: any) => p.status === 'Completed').length,
    avgCompletion: (
      data.reduce((sum: number, p: any) => 
        sum + p.completion_percentage, 0
      ) / data.length
    ).toFixed(1),
    totalBudget: data.reduce(
      (sum: number, p: any) => sum + p.budget_total, 0),
    totalSpent: data.reduce(
      (sum: number, p: any) => sum + p.budget_spent, 0),
  };
}
```

### `lib/supabase-browser.ts`
```typescript
'use client';
import { createClient } from '@supabase/supabase-js';

export const createBrowserClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

### `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side client (uses anon key)
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Server-side client (uses service role key - bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
```

### `lib/utils.ts`
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `lib/workos.ts`
```typescript
// lib/workos.ts contains helpers and configurations for the WorkOS session.
// In actual usage, rely on authkit-nextjs functions.
export const getWorkOSClientId = () => {
    return process.env.WORKOS_CLIENT_ID || "";
};
```

### `middleware.ts`
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### `next-env.d.ts`
```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
```

### `next.config.mjs`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

### `package.json`
```json
{
  "name": "analyzehive-flow",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@supabase/supabase-js": "^2.40.0",
    "@workos-inc/authkit-nextjs": "^2.17.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.350.0",
    "next": "^14.2.0",
    "react": "^18",
    "react-day-picker": "^9.14.0",
    "react-dom": "^18",
    "recharts": "^2.12.0",
    "tailwind-merge": "^2.6.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

### `postcss.config.mjs`
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

### `replace.js`
```javascript
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
```

### `scripts/seed-check.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
import path from 'path';

loadEnvConfig(path.resolve(__dirname, '../'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } });

// --- MOCK DATA ---
const STABLE_UUID_USERS = Array.from({length: 9}, (_, i) => `00000000-0000-0000-0000-${String(i+1).padStart(12, '0')}`);
const STABLE_UUID_PROJECTS = Array.from({length: 4}, (_, i) => `11111111-1111-1111-1111-${String(i+1).padStart(12, '0')}`);

const USERS = [
  { id: STABLE_UUID_USERS[0], name: 'Arjun Mehta', email: 'arjun@flowestate.com', role: 'VP_SALES', avatar_initials: 'AM' },
  { id: STABLE_UUID_USERS[1], name: 'Priya Sharma', email: 'priya@flowestate.com', role: 'BROKER', avatar_initials: 'PS' },
  { id: STABLE_UUID_USERS[2], name: 'Rahul Desai', email: 'rahul@flowestate.com', role: 'BROKER', avatar_initials: 'RD' },
  { id: STABLE_UUID_USERS[3], name: 'Sneha Rao', email: 'sneha@flowestate.com', role: 'BROKER', avatar_initials: 'SR' },
  { id: STABLE_UUID_USERS[4], name: 'Vikram Singh', email: 'vikram@flowestate.com', role: 'BROKER', avatar_initials: 'VS' },
  { id: STABLE_UUID_USERS[5], name: 'Ananya Gupta', email: 'ananya@flowestate.com', role: 'BROKER', avatar_initials: 'AG' },
  { id: STABLE_UUID_USERS[6], name: 'Karan Patel', email: 'karan@flowestate.com', role: 'BROKER', avatar_initials: 'KP' },
  { id: STABLE_UUID_USERS[7], name: 'Riya Jain', email: 'riya@flowestate.com', role: 'BROKER', avatar_initials: 'RJ' },
  { id: STABLE_UUID_USERS[8], name: 'Admin User', email: 'admin@flowestate.com', role: 'ADMIN', avatar_initials: 'AD' }
];

const PROJECTS = [
  { id: STABLE_UUID_PROJECTS[0], name: 'Lumina Heights', location: 'Whitefield', status: 'Under Construction' },
  { id: STABLE_UUID_PROJECTS[1], name: 'Aurora Towers', location: 'Indiranagar', status: 'Pre-launch' },
  { id: STABLE_UUID_PROJECTS[2], name: 'Zenith Gardens', location: 'Koramangala', status: 'Completed' },
  { id: STABLE_UUID_PROJECTS[3], name: 'Crescent Park', location: 'Jayanagar', status: 'Under Construction' }
];

const LEADS = Array.from({length: 20}, (_, i) => ({
  name: `Lead ${i+1}`,
  phone: `+919876543${String(i).padStart(3, '0')}`,
  email: `lead${i+1}@example.com`,
  source: ['Meta', 'Google', '99acres', 'Direct'][i % 4],
  status: ['New', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Lost'][i % 6],
  assigned_user_id: STABLE_UUID_USERS[(i % 7) + 1],
  project_interest: PROJECTS[i % 4].name,
  flat_type_interest: ['1BHK', '2BHK', '3BHK', '4BHK'][i % 4],
  notes: `Looking for good investment.`,
  created_at: new Date(Date.now() - i * 86400000).toISOString()
}));

const FLATS = Array.from({length: 32}, (_, i) => ({
  project: PROJECTS[i % 4].name,
  project_ref: STABLE_UUID_PROJECTS[i % 4],
  flat_number: `${['A','B','C'][i%3]}-${(Math.floor(i/4)+1)*100 + (i%4 + 1)}`,
  type: ['1BHK', '2BHK', '3BHK', '4BHK'][i % 4],
  floor: Math.floor(i / 4) + 1,
  area_sqft: 800 + (i % 4) * 400,
  price: 5000000 + (i % 4) * 3000000,
  facing: ['East', 'West', 'North', 'South'][i % 4],
  status: ['Available', 'On Hold', 'Sold'][i % 3],
  updated_at: new Date().toISOString()
}));

const VISITS = Array.from({length: 6}, (_, i) => ({
  lead_id: null, // will be mapped
  flat_id: null, // will be mapped
  assigned_user_id: STABLE_UUID_USERS[(i % 7) + 1],
  scheduled_at: new Date(Date.now() + i * 86400000).toISOString(),
  status: ['Scheduled', 'Completed', 'No Show'][i % 3],
  reminder_sent: false,
  notes: 'Customer specifically requested early morning visit.'
}));

const DOCUMENTS = Array.from({length: 15}, (_, i) => ({
  lead_id: null,
  document_type: ['Aadhar', 'PAN', 'Bank Statement', 'Sale Agreement'][i % 4],
  status: ['Pending', 'Verified', 'Rejected'][i % 3],
  verified_by_user_id: STABLE_UUID_USERS[0],
  uploaded_at: new Date(Date.now() - i * 86400000).toISOString(),
  verified_at: i % 3 === 1 ? new Date().toISOString() : null
}));

const INVENTORY = Array.from({length: 15}, (_, i) => ({
  name: ['Cement', 'Steel', 'Bricks', 'Sand', 'Paint', 'Tiles'][i % 6] + ` Grade ${i}`,
  category: ['Cement', 'Steel', 'Bricks', 'Sand', 'Other'][i % 5],
  quantity: (i + 1) * 100,
  unit: ['Bags', 'Tons', 'Nos', 'CFT', 'Liters'][i % 5],
  status: 'In Stock',
  last_updated: new Date().toISOString()
}));

const MATERIAL_DEMANDS = Array.from({length: 8}, (_, i) => ({
  item_id: null,
  quantity_requested: (i + 1) * 20,
  requested_by: `Supervisor ${i+1}`,
  status: ['Pending', 'Approved', 'Rejected'][i % 3],
  reviewed_by: STABLE_UUID_USERS[0],
  created_at: new Date(Date.now() - i * 86400000).toISOString()
}));

const ASSETS = Array.from({length: 8}, (_, i) => ({
  name: ['Excavator Model X', 'Generator 500KVA', 'Tower Crane Q', 'Concrete Mixer'][i % 4] + ` - ${i}`,
  type: ['Excavator', 'Generator', 'Crane', 'Mixer', 'Other'][i % 5],
  status: ['Active', 'Maintenance', 'Decommissioned'][i % 3],
  last_updated: new Date().toISOString()
}));

const LABOUR = Array.from({length: 20}, (_, i) => ({
  name: `Labourer ${i+1}`,
  role: ['Mason', 'Carpenter', 'Plumber', 'Electrician', 'Helper'][i % 5],
  attendance_status: ['Present', 'Absent', 'Half Day'][i % 3],
  date: new Date().toISOString().split('T')[0],
  wages: 500 + (i % 4) * 100
}));

const DAILY_PROGRESS = Array.from({length: 8}, (_, i) => ({
  project: STABLE_UUID_PROJECTS[i % 4],
  date: new Date(Date.now() - (i % 2) * 86400000).toISOString().split('T')[0],
  block_subtask: `Block ${['A','B'][i%2]} Slab ${i+1}`,
  completion_pct: 10 * (i + 1),
  status: 'In Progress',
  notes: 'Slight delay due to rain'
}));

const VENDORS = Array.from({length: 8}, (_, i) => ({
  name: `Vendor ${i+1} Corp`,
  category: ['Materials', 'Services', 'Equipment'][i % 3],
  contact_person: `Contact ${i+1}`,
  phone: `+9188888888${i}`,
  email: `vendor${i+1}@example.com`,
  status: 'Active'
}));

const LEDGER = Array.from({length: 15}, (_, i) => ({
  transaction_type: i % 2 === 0 ? 'Income' : 'Expense',
  category: i % 2 === 0 ? 'Sales' : ['Marketing', 'Construction', 'Operations', 'Salaries'][i % 4],
  amount: 10000 + i * 5000,
  description: `Payment for XYZ ${i}`,
  transaction_date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  status: 'Approved'
}));

// --- SEEDER FUNCS ---
async function clearTable(table: string) {
  await supabaseAdmin.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000') // delete all trick by not equal to a dummy id
  // wait, for tables without 'id', this fails.
  // We're just appending if empty.
}

async function checkAndSeed() {
  console.log('Starting seed check...');
  
  const tables = [
    { name: 'users', data: USERS, needed: 9 },
    { name: 'projects', data: PROJECTS, needed: 4 },
    { name: 'leads_customers', data: LEADS, needed: 20 },
    { name: 'flats_inventory', data: FLATS, needed: 32 },
    // site_visits need lead_id and flat_id mapping
    { name: 'inventory_items', data: INVENTORY, needed: 15 },
    { name: 'assets_equipment', data: ASSETS, needed: 8 },
    { name: 'labour_attendance', data: LABOUR, needed: 20 },
    { name: 'daily_progress', data: DAILY_PROGRESS, needed: 8 },
    { name: 'vendors', data: VENDORS, needed: 8 },
    { name: 'financial_ledger', data: LEDGER, needed: 15 },
  ];

  for (const t of tables) {
    try {
      const { count, error } = await supabaseAdmin.from(t.name).select('*', { count: 'exact', head: true });
      if (error) {
        if (error.code === '42P01') {
          console.error(`Table ${t.name} does not exist! Please create it first.`);
          continue;
        }
        console.error(`Error checking ${t.name}:`, error.message);
        continue;
      }
      
      if (count === 0) {
        console.log(`Seeding ${t.name} with ${t.needed} rows...`);
        const { error: insertErr } = await supabaseAdmin.from(t.name).insert(t.data);
        if (insertErr) console.error(`Failed seeding ${t.name}:`, insertErr.message);
        else console.log(`${t.name} seeded successfully.`);
      } else {
        console.log(`${t.name} already has ${count} rows. Skipping.`);
      }
    } catch (e: any) {
      console.error(`Error with ${t.name}:`, e.message);
    }
  }

  // Dependent tables
  try {
    const { data: leadsData } = await supabaseAdmin.from('leads_customers').select('id').limit(20);
    const { data: flatsData } = await supabaseAdmin.from('flats_inventory').select('flat_id').limit(32);
    const { data: inventoryData } = await supabaseAdmin.from('inventory_items').select('id').limit(15);
    
    // Site Visits
    const { count: vCount } = await supabaseAdmin.from('site_visits').select('*', { count: 'exact', head: true });
    if (vCount === 0 && leadsData?.length && flatsData?.length) {
      console.log('Seeding site_visits...');
      const mappedVisits = VISITS.map((v, i) => ({
        ...v,
        lead_id: leadsData[i % leadsData.length].id,
        flat_id: flatsData[i % flatsData.length].flat_id
      }));
      await supabaseAdmin.from('site_visits').insert(mappedVisits);
      console.log('site_visits seeded.');
    } else {
      console.log('site_visits already has data or missing dependencies.');
    }

    // Documents
    const { count: dCount } = await supabaseAdmin.from('documents').select('*', { count: 'exact', head: true });
    if (dCount === 0 && leadsData?.length) {
      console.log('Seeding documents...');
      const mappedDocs = DOCUMENTS.map((d, i) => ({
        ...d,
        lead_id: leadsData[i % leadsData.length].id
      }));
      await supabaseAdmin.from('documents').insert(mappedDocs);
      console.log('documents seeded.');
    } else {
      console.log('documents already has data or missing dependencies.');
    }

    // Material Demands
    const { count: mCount } = await supabaseAdmin.from('material_demands').select('*', { count: 'exact', head: true });
    if (mCount === 0 && inventoryData?.length) {
      console.log('Seeding material_demands...');
      const mappedDemands = MATERIAL_DEMANDS.map((m, i) => ({
        ...m,
        item_id: inventoryData[i % inventoryData.length].id
      }));
      await supabaseAdmin.from('material_demands').insert(mappedDemands);
      console.log('material_demands seeded.');
    } else {
      console.log('material_demands already has data or missing dependencies.');
    }

  } catch(e: any) {
    console.error('Error in dependent tables:', e.message);
  }
}

checkAndSeed().then(() => {
  console.log('Seed check complete.');
  process.exit();
});
```

### `supabase/schema.sql`
```sql
-- Supabase Schema for Analyzehive Flow Real Estate ERP

-- --------------------------------------------------------
-- LEADS & SALES
-- --------------------------------------------------------

CREATE TABLE leads_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT CHECK (source IN ('Meta', 'Google', '99acres', 'Direct')),
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Lost')),
  assigned_broker_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE flats_inventory (
  flat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project TEXT NOT NULL,
  flat_number TEXT NOT NULL,
  type TEXT CHECK (type IN ('1BHK','2BHK','3BHK','4BHK')),
  floor INTEGER,
  area_sqft NUMERIC,
  price NUMERIC,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available','On Hold','Sold')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE site_visits (
  visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_customers(id),
  flat_id UUID REFERENCES flats_inventory(flat_id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled','Completed','No Show')),
  reminder_sent BOOLEAN DEFAULT FALSE
);

-- --------------------------------------------------------
-- CONSTRUCTION
-- --------------------------------------------------------

CREATE TABLE stock_items (
  item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('Cement','Steel','Bricks','Sand','Other')),
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE demand_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES stock_items(item_id),
  quantity_requested NUMERIC NOT NULL,
  requested_by TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected')),
  reviewed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assets (
  asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Excavator','Generator','Crane','Mixer','Other')),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active','Maintenance','Decommissioned')),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- FINANCE
-- --------------------------------------------------------

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT CHECK (category IN ('Marketing','Construction','Operations','Salaries','Other')),
  amount NUMERIC NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads_customers(id),
  flat_id UUID REFERENCES flats_inventory(flat_id),
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending','Received','Overdue'))
);

-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- --------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE leads_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flats_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Block all public access via the 'anon' role
CREATE POLICY "deny_all_public" ON leads_customers FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON flats_inventory FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON site_visits FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON stock_items FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON demand_requests FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON assets FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON expenses FOR ALL TO anon USING (false);
CREATE POLICY "deny_all_public" ON payments FOR ALL TO anon USING (false);

-- Note: The service_role key bypasses RLS naturally, so server-side actions will succeed.
```

### `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
