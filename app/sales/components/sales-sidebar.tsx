"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Building2, CalendarCheck, BarChart3, Settings, Wallet, FileCheck, TrendingUp, LogOut } from "lucide-react"
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
  const [profile, setProfile] = useState<{ name: string; role: string; email: string } | null>(null);

  useEffect(() => {
    // 1. Initial render from client-side cookies for speed
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift() || "");
      return null;
    };

    const email = getCookie("user_email") || "navonilsarkar2005@gmail.com";
    const role = getCookie("user_role") || "MD";
    const name = getCookie("user_name") || email.split("@")[0];

    setProfile({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      role: role,
      email: email
    });

    // 2. Fetch authenticated session dynamically in background
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setProfile({
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            role: data.role,
            email: data.email
          });
        }
      })
      .catch((err) => console.warn("Could not fetch active session:", err));
  }, []);

  const activeUser = profile || {
    name: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Demo User",
    role: user?.role || "BROKER",
    email: "admin@analyzehive.com"
  };

  const initials = activeUser.name.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

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
      
      {/* Bottom Profile Standalone Card */}
      <div 
        className="mx-3.5 mb-4 mt-auto p-3 flex flex-col gap-3 rounded-xl border transition-all duration-200"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(255, 255, 255, 0.06)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0066FF] to-[#6366F1] font-bold text-white shadow-md ring-1 ring-white/10">
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden min-w-0 flex-1">
            <span className="truncate text-xs font-bold text-white" title={activeUser.name}>
              {activeUser.name}
            </span>
            <span className="truncate text-[10px] text-slate-400 mt-0.5" title={activeUser.email}>
              {activeUser.email}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
          <span 
            className="inline-flex rounded-full px-2 py-0.5 text-[8.5px] font-extrabold uppercase border"
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#A5B4FC',
              borderColor: 'rgba(99, 102, 241, 0.25)'
            }}
          >
            {activeUser.role}
          </span>
          
          <div className="flex items-center gap-2">
            <Link href="/settings/profile" className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-md" title="Settings">
              <Settings className="h-4 w-4" />
            </Link>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer p-1 hover:bg-white/5 rounded-md outline-none" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
