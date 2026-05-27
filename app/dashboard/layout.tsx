"use client";

import { ReactNode, Suspense } from "react"
import { MobileSidebarSheet } from "@/components/shared/MobileSidebarSheet"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { Bell, Search, HelpCircle, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModuleSwitcher } from "@/components/shared/ModuleSwitcher"
import { UserProfileDropdown } from "@/components/shared/UserProfileDropdown"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

function PeriodFilterButtons() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPeriod = searchParams?.get("period") || "month";

  const handlePeriodChange = (period: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("period", period);
    router.push(`${pathname}?${params.toString()}`);
  };

  const buttons = [
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Quarter", value: "quarter" },
    { label: "This Year", value: "year" },
  ];

  return (
    <div className="flex items-center h-[45px] gap-6">
      {buttons.map((btn) => {
        const isActive = currentPeriod === btn.value;
        return (
          <button
            key={btn.value}
            onClick={() => handlePeriodChange(btn.value)}
            className={`text-[13px] font-semibold h-full transition-colors flex items-center pt-0.5 border-b-2 ${
              isActive
                ? "text-[#0066FF] border-[#0066FF]"
                : "text-slate-500 hover:text-slate-900 border-transparent hover:border-slate-300"
            }`}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  
  const user = { firstName: "CEO", lastName: "Admin", role: "MANAGING DIRECTOR" };
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div 
      className="flex font-sans text-[#0F172A] min-h-screen" 
      style={{ background: '#FAFBFC' }}
    >
      {!isMobile && <DashboardSidebar user={user} />}
      
      <div className={`flex-1 flex flex-col relative ${isMobile ? "pl-0" : "pl-[260px]"}`}>
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
            {isMobile && (
              <MobileSidebarSheet>
                <DashboardSidebar user={user} />
              </MobileSidebarSheet>
            )}
            {/* Breadcrumb Left */}
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 hidden md:flex">
              <span>Home</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span>Executive</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 font-bold">Dashboard</span>
            </div>

            {/* Global Search Center */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
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
              <div className="hidden sm:block"><ModuleSwitcher /></div>
              <Button 
                onClick={() => {
                  const event = new CustomEvent("export-dashboard-report");
                  window.dispatchEvent(event);
                }}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 gap-2 hidden sm:flex h-9"
              >
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
              <UserProfileDropdown />
            </div>
          </div>
          <Suspense fallback={<div className="h-[45px]" />}>
            <PeriodFilterButtons />
          </Suspense>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
