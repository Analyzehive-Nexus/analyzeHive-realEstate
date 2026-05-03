"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, LayoutDashboard, TrendingUp } from "lucide-react";

export default function CommandCenterPage() {
  const router = useRouter();

  const modules = [
    {
      title: "Sales Command Center",
      description: "Manage leads, site visits, and sales analytics",
      icon: TrendingUp,
      path: "/sales",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Construction Command Center",
      description: "Track inventory, assets, labour, and project progress",
      icon: Building2,
      path: "/construction",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Executive Dashboard",
      description: "Financial overview, P&L, and high-level KPIs",
      icon: LayoutDashboard,
      path: "/dashboard",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Command Center</h1>
          <p className="text-slate-500">Select a module to continue</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((mod) => (
            <Card
              key={mod.path}
              className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-white border-0"
              onClick={() => router.push(mod.path)}
            >
              <CardHeader className={`rounded-t-xl bg-gradient-to-r ${mod.color} text-white`}>
                <div className="flex justify-between items-center">
                  <mod.icon className="h-8 w-8" />
                  <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Go to →</span>
                </div>
                <CardTitle className="text-xl mt-2">{mod.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600">{mod.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
