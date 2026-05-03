"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Building2, CalendarCheck, BarChart3, Settings, Wallet, FileCheck, TrendingUp } from "lucide-react"
import Logo from "@/components/shared/Logo"
import { ProjectSwitcher } from "@/components/shared/ProjectSwitcher"

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
      <ProjectSwitcher />

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
        <Link href="/settings/profile" className="ml-auto text-slate-400 hover:text-white transition-colors">
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
