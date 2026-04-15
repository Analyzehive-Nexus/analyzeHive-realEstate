import { ReactNode } from "react"
import { ConstructionSidebar } from "./components/construction-sidebar"
import { Bell, Plus, Search, HelpCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConstructionLayout({ children }: { children: ReactNode }) {
  const user = { firstName: "Demo", lastName: "Mode", role: "SITE MANAGER" }

  return (
    <div 
      className="flex font-sans text-[#0F172A] min-h-screen" 
      style={{ background: '#FAFBFC' }}
    >
      <ConstructionSidebar user={user} />
      
      <div className="flex-1 flex flex-col pl-[260px] relative">
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
            <span>Construction</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-bold">Dashboard</span>
          </div>

          {/* Global Search Center */}
          <div className="flex-1 max-w-md mx-6">
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
            <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 gap-2 hidden sm:flex h-9">
              <Plus className="h-4 w-4" />
              <span className="tracking-wide">Raise Request</span>
            </Button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
            
            <button className="relative text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 flex h-[14px] min-w-[14px] px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                5
              </span>
            </button>
            <button className="text-slate-500 hover:text-slate-800 transition-colors h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 hidden sm:flex">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] text-white font-bold shadow-sm ml-1 ring-2 ring-white cursor-pointer hover:ring-blue-100 transition-all">
              {user.firstName[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
