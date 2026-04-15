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
