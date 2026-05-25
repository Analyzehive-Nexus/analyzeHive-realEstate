"use client";

import { ReactNode } from "react"
import { MobileSidebarSheet } from "@/components/shared/MobileSidebarSheet"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { SalesSidebar } from "./components/sales-sidebar"
import { Bell, Plus, Search, Grid3X3, HelpCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ModuleSwitcher } from "@/components/shared/ModuleSwitcher"
import { UserProfileDropdown } from "@/components/shared/UserProfileDropdown"

export default function SalesLayout({ children }: { children: ReactNode }) {
  
  const user = { firstName: "Sarah", lastName: "Jenkins", role: "VP SALES" };
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div 
      className="flex font-sans text-[#0F172A] min-h-screen" 
      style={{ background: '#FAFBFC' }}
    >
      {!isMobile && <SalesSidebar user={user} />}
      
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
          {/* Breadcrumb Left */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 hidden md:flex">
            <span>Home</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span>Sales</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-bold">Dashboard</span>
          </div>

          {/* Global Search Center */}
          <div className="hidden md:block flex-1 max-w-md mx-6">
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
            <div className="hidden sm:block"><ModuleSwitcher /></div>
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
