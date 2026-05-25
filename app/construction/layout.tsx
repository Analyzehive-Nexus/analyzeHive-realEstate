"use client";

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { MobileSidebarSheet } from "@/components/shared/MobileSidebarSheet"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { ConstructionSidebar } from "./components/construction-sidebar"
import { 
  Bell, 
  Plus, 
  Search, 
  HelpCircle, 
  ChevronRight, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  Copy, 
  ExternalLink 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModuleSwitcher } from "@/components/shared/ModuleSwitcher"
import { UserProfileDropdown } from "@/components/shared/UserProfileDropdown"
import { createBrowserClient } from "@/lib/supabase-browser"
import { 
  fetchNotificationsList, 
  markNotificationAsRead, 
  markAllNotificationsRead 
} from "./actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: 'alert' | 'info' | 'success' | 'warning';
  read: boolean;
  link: string | null;
  created_at: string;
}

function formatTimeAgo(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 0) return "just now";
    
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return "just now";
    
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return "";
  }
}

export default function ConstructionLayout({ children }: { children: ReactNode }) {
  const user = { firstName: "Demo", lastName: "Mode", role: "SITE MANAGER" };
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tableMissing, setTableMissing] = useState(false);
  const [missingSql, setMissingSql] = useState("");
  const [copiedSql, setCopiedSql] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const loadNotifications = async () => {
    const res = await fetchNotificationsList("workos-site-001");
    if (res.success) {
      if (res.tableMissing) {
        setTableMissing(true);
        setMissingSql(res.sql || "");
      } else {
        setTableMissing(false);
        setNotifications(res.data || []);
      }
    }
  };

  useEffect(() => {
    loadNotifications();

    // Setup real-time Supabase subscription
    const supabase = createBrowserClient();
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=eq.workos-site-001',
        },
        (payload) => {
          console.log('Realtime notification change:', payload);
          if (payload.eventType === 'INSERT') {
            const newNotif = payload.new as Notification;
            setNotifications(prev => {
              if (prev.some(n => n.id === newNotif.id)) return prev;
              return [newNotif, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotif = payload.new as Notification;
            setNotifications(prev => prev.map(n => n.id === updatedNotif.id ? updatedNotif : n));
          } else if (payload.eventType === 'DELETE') {
            const oldNotif = payload.old as { id: string };
            setNotifications(prev => prev.filter(n => n.id !== oldNotif.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await markAllNotificationsRead("workos-site-001");
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(missingSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div 
      className="flex font-sans text-[#0F172A] min-h-screen" 
      style={{ background: '#FAFBFC' }}
    >
      {!isMobile && <ConstructionSidebar user={user} />}
      
      <div className={`flex-1 flex flex-col relative ${isMobile ? "pl-0" : "pl-[260px]"}`}>
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
          {/* Breadcrumb Left / Mobile Trigger */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            {isMobile && (
              <MobileSidebarSheet>
                <ConstructionSidebar user={user} />
              </MobileSidebarSheet>
            )}
            <div className="hidden md:flex items-center gap-2">
              <span>Home</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span>Construction</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 font-bold">Dashboard</span>
            </div>
          </div>

          {/* Global Search Center */}
          <div className="hidden md:block flex-1 max-w-md mx-6">
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
            <div className="hidden sm:block"><ModuleSwitcher /></div>
            <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 gap-2 hidden sm:flex h-9">
              <Plus className="h-4 w-4" />
              <span className="tracking-wide">Raise Request</span>
            </Button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
            
            {/* Bell Icon Notification Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 outline-none">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-[14px] min-w-[14px] px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[380px] p-0 mr-4 rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-200 z-[100]" 
                align="end"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-[#0066FF]/10 text-[#0066FF] text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#0066FF] hover:text-[#0052CC] font-semibold flex items-center gap-1 transition-colors hover:underline outline-none"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Body / Notification List */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                  {tableMissing ? (
                    <div className="p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2 animate-bounce" />
                      <h4 className="text-xs font-bold text-slate-900 mb-1">Database Table Missing</h4>
                      <p className="text-[11px] text-slate-500 mb-3 px-2 leading-relaxed">
                        The <code>notifications</code> table does not exist in your Supabase database yet. Click below to copy the SQL, and run it in your Supabase SQL Editor to enable real-time alerts!
                      </p>
                      <div className="relative group max-w-full">
                        <pre className="text-[9px] text-left bg-slate-900 text-slate-300 p-2.5 rounded-md overflow-x-auto max-h-[140px] font-mono leading-relaxed select-all">
                          {missingSql}
                        </pre>
                        <button
                          onClick={handleCopySql}
                          className="absolute right-2 top-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 shadow-md transition-all active:scale-95 outline-none"
                        >
                          {copiedSql ? (
                            <>
                              <Check className="h-3 w-3 text-green-400" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy SQL
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                        <Bell className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-medium text-slate-500">All caught up!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">No new notifications.</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      let IconComponent = Info;
                      let iconBg = "bg-blue-50 text-[#0066FF]";
                      let borderIndicator = "border-l-[#0066FF]";

                      if (n.type === "alert") {
                        IconComponent = AlertTriangle;
                        iconBg = "bg-red-50 text-red-500";
                        borderIndicator = "border-l-red-500";
                      } else if (n.type === "warning") {
                        IconComponent = AlertCircle;
                        iconBg = "bg-amber-50 text-[#D97706]";
                        borderIndicator = "border-l-amber-500";
                      } else if (n.type === "success") {
                        IconComponent = CheckCircle2;
                        iconBg = "bg-emerald-50 text-emerald-500";
                        borderIndicator = "border-l-emerald-500";
                      }

                      return (
                        <div 
                          key={n.id}
                          className={`p-3.5 flex gap-3 transition-colors duration-150 relative border-l-4 ${borderIndicator} ${
                            n.read ? "bg-white hover:bg-slate-50/50" : "bg-blue-50/10 hover:bg-blue-50/20"
                          }`}
                        >
                          {/* Icon */}
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5">
                              <h4 className={`text-xs font-bold text-slate-900 leading-snug truncate ${n.read ? "" : "font-semibold"}`}>
                                {n.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                                {formatTimeAgo(n.created_at)}
                              </span>
                            </div>
                            {n.description && (
                              <p className="text-[11px] text-slate-500 leading-normal mt-0.5 pr-2">
                                {n.description}
                              </p>
                            )}
                            {/* Footer Link / Actions */}
                            <div className="flex items-center gap-3 mt-2">
                              {n.link && (
                                <Link
                                  href={n.link}
                                  onClick={() => handleMarkAsRead(n.id)}
                                  className="text-[10px] text-[#0066FF] hover:text-[#0052CC] font-bold flex items-center gap-0.5 hover:underline"
                                >
                                  View details
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </Link>
                              )}
                              {!n.read && (
                                <button
                                  onClick={() => handleMarkAsRead(n.id)}
                                  className="text-[10px] text-slate-400 hover:text-slate-600 font-medium transition-colors hover:underline outline-none"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Unread blue dot indicator */}
                          {!n.read && (
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-2 w-2 rounded-full bg-[#0066FF]" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Real-time subscription active
                  </span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 hidden sm:flex">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            <UserProfileDropdown />
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
