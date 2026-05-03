"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building2, LayoutDashboard, TrendingUp, LayoutGrid } from "lucide-react";

const modules = [
  { name: "Sales", path: "/sales", icon: TrendingUp },
  { name: "Construction", path: "/construction", icon: Building2 },
  { name: "Executive", path: "/dashboard", icon: LayoutDashboard },
];

export function ModuleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current module based on path
  const currentModule =
    modules.find((m) => pathname.startsWith(m.path)) ||
    { name: "Command Center", icon: LayoutGrid };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 bg-white border-slate-200 shadow-sm"
      onClick={() => router.push("/command-center")}
    >
      <currentModule.icon className="h-4 w-4" />
      <span className="font-medium hidden sm:inline">{currentModule.name}</span>
      <span className="font-medium sm:hidden">Menu</span>
    </Button>
  );
}
