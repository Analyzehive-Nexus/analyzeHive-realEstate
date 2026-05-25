"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut, Settings, User, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  name: string;
}

export function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Helper to read cookies on the client side for instant rendering
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift() || "");
      return null;
    };

    const id = getCookie("user_id");
    const email = getCookie("user_email") || "navonilsarkar2005@gmail.com";
    const role = getCookie("user_role") || "MD";
    const name = getCookie("user_name") || email.split("@")[0];

    if (id || email) {
      setUser({
        id: id || "dev-user-001",
        email,
        role,
        name: name.charAt(0).toUpperCase() + name.slice(1),
      });
    }

    // 2. Query the Server API in background to get the exact authenticated email and database name
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser({
            id: data.id,
            email: data.email,
            role: data.role,
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          });
        }
      })
      .catch((err) => console.warn("Could not fetch active session:", err));

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toUpperCase()) {
      case "MD":
        return "from-purple-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "VP_SALES":
      case "VP SALES":
        return "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30";
      case "SITE_MANAGER":
      case "SITE MANAGER":
        return "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30";
      case "ADMIN":
        return "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30";
      default:
        return "from-slate-500/20 to-slate-600/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] text-white font-bold text-[14px] shadow-md shadow-blue-500/10 ml-1 ring-2 ring-white/80 cursor-pointer hover:ring-blue-300 active:scale-95 transition-all outline-none"
      >
        {initials[0]}
      </button>

      {/* Stunning Dropdown Card */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-76 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-4 shadow-2xl animate-in fade-in-50 slide-in-from-top-2 duration-200 z-[999]"
          style={{ transformOrigin: "top right" }}
        >
          {/* User Profile Card Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#6366F1] font-black text-white text-[15px] shadow-md shadow-blue-500/10">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 text-sm truncate flex items-center gap-1">
                {user.name}
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </span>
              <span className="text-[11px] text-slate-500 truncate mt-0.5">
                {user.email}
              </span>
            </div>
          </div>

          {/* User Role Badge */}
          <div className="py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Workspace Role</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${getRoleBadgeColor(user.role)}`}
            >
              <Shield className="w-3 h-3" />
              {user.role}
            </span>
          </div>

          {/* Navigation Options */}
          <div className="py-2 flex flex-col gap-1 border-b border-slate-100">
            <Link
              href="/settings/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0066FF] hover:bg-blue-50/50 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              My Profile Settings
            </Link>
            <Link
              href="/settings/company"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0066FF] hover:bg-blue-50/50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Company Account Settings
            </Link>
          </div>

          {/* Logout Button */}
          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50/60 rounded-lg transition-colors outline-none cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              Logout from Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
