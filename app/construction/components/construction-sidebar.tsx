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
