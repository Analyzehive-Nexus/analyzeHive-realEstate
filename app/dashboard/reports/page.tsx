"use client"

import { useState } from "react"
import { FileText, Download, Eye, Calendar, Mail, CheckCircle2, FileBarChart, Filter } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// --- HELPERS ---
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// --- MOCK DATA ---
const categories = ["All", "P&L", "Balance Sheet", "Cash Flow", "Sales", "Construction", "Custom"];

const reports = [
  { name: "Monthly P&L - March 2026", type: "P&L", period: "Mar 2026", date: "Mar 18, 2026", size: "2.4 MB" },
  { name: "Quarterly Sales Report Q1", type: "Sales", period: "Q1 2026", date: "Mar 15, 2026", size: "5.1 MB" },
  { name: "Construction Cost Report", type: "Construction", period: "Mar 2026", date: "Mar 14, 2026", size: "1.8 MB" },
  { name: "Cash Flow Statement - Q1", type: "Cash Flow", period: "Q1 2026", date: "Mar 10, 2026", size: "840 KB" },
  { name: "Lead Analytics Report", type: "Sales", period: "Mar 2026", date: "Mar 05, 2026", size: "3.2 MB" },
  { name: "Annual Balance Sheet FY25", type: "Balance Sheet", period: "FY 2025", date: "Jan 15, 2026", size: "8.5 MB" },
  { name: "Unit Absorption Analysis", type: "Sales", period: "Feb 2026", date: "Feb 28, 2026", size: "1.2 MB" },
  { name: "Vendor Payments Summary", type: "Construction", period: "Feb 2026", date: "Feb 25, 2026", size: "1.5 MB" },
  { name: "Custom Ops Dashboard", type: "Custom", period: "Jan-Mar 26", date: "Mar 12, 2026", size: "4.8 MB" },
];

export default function ReportsPage() {
  const [activeCat, setActiveCat] = useState("All");
  const filteredReports = activeCat === "All" ? reports : reports.filter(r => r.type === activeCat);

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Financial Reports</h1>
          <p className="text-slate-500 font-medium mt-1">Access, download, and schedule executive reports.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <Button className="bg-[#0066FF] hover:bg-blue-700 text-white font-semibold rounded-[10px] px-6 h-10 shadow-md">
              <Calendar className="w-4 h-4 mr-2" /> Schedule New
           </Button>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-8">
            {/* CATEGORIES */}
            <div className="flex gap-3 overflow-x-auto pb-2">
               {categories.map(c => (
                  <button
                     key={c}
                     onClick={() => setActiveCat(c)}
                     className={`px-5 py-2 whitespace-nowrap rounded-[10px] text-[13px] font-bold transition-all border ${
                        activeCat === c 
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md' 
                        : 'bg-white text-slate-600 border-[#E8ECF0] hover:border-slate-300 hover:text-[#0F172A]'
                     }`}
                  >
                     {c}
                  </button>
               ))}
            </div>

            {/* REPORTS GRID */}
            <div>
               <SectionHeading title={`${activeCat} Reports (${filteredReports.length})`} />
               <div className="grid md:grid-cols-2 gap-5">
                  {filteredReports.map((r, i) => (
                     <InteractivePearlCard key={i} className="p-5 flex flex-col justify-between h-full">
                        <div>
                           <div className="flex justify-between items-start mb-3">
                              <Badge variant="outline" className={`px-2 py-0.5 border-none font-bold uppercase tracking-widest text-[9px] ${
                                 r.type === 'P&L' ? 'bg-blue-50 text-blue-700' :
                                 r.type === 'Sales' ? 'bg-emerald-50 text-emerald-700' :
                                 r.type === 'Construction' ? 'bg-orange-50 text-orange-700' :
                                 r.type === 'Cash Flow' ? 'bg-teal-50 text-teal-700' :
                                 'bg-purple-50 text-purple-700'
                              }`}>
                                 {r.type}
                              </Badge>
                              <span className="text-[11px] font-semibold text-slate-400">{r.size} • PDF</span>
                           </div>
                           <h3 className="text-[16px] font-bold text-[#0F172A] leading-snug mb-2">{r.name}</h3>
                           <p className="text-[12px] font-medium text-slate-500 mb-6 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {r.period} • Gen: {r.date}
                           </p>
                        </div>
                        <div className="flex gap-3 border-t border-[#E8ECF0] pt-4">
                           <Button variant="outline" className="flex-1 border-[#E8ECF0] hover:bg-slate-50 text-slate-600 font-semibold gap-2 rounded-[8px] h-9">
                              <Eye className="w-4 h-4 text-slate-400" /> Preview
                           </Button>
                           <Button className="flex-[1.5] bg-[#F8FAFC] border border-[#E8ECF0] hover:border-slate-300 hover:bg-white text-[#0F172A] shadow-sm font-semibold gap-2 rounded-[8px] h-9">
                              <Download className="w-4 h-4 text-[#0066FF]" /> Download
                           </Button>
                        </div>
                     </InteractivePearlCard>
                  ))}
               </div>
               
               {filteredReports.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-[#E8ECF0] rounded-[16px] bg-[#FAFBFC]">
                     <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                     <h3 className="text-[15px] font-bold text-slate-600">No reports found</h3>
                     <p className="text-[13px] font-medium text-slate-500 mt-1">Try selecting a different category.</p>
                  </div>
               )}
            </div>
         </div>

         {/* SCHEDULE REPORT FORM */}
         <div className="xl:col-span-1">
            <PearlCard className="p-6">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E8ECF0]">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                     <FileBarChart className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="text-lg font-bold text-[#0F172A] tracking-tight leading-tight">Generate Custom Report</h2>
                     <p className="text-[12px] font-medium text-slate-500">Schedule daily, weekly, or monthly.</p>
                  </div>
               </div>

               <form className="space-y-6">
                  <div>
                     <Label className="text-[13px] font-bold text-slate-700">Report Type</Label>
                     <select className="w-full mt-1.5 h-10 bg-slate-50 border border-[#E8ECF0] rounded-[8px] px-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option>Executive Consolidation</option>
                        <option>Detailed P&L</option>
                        <option>Sales & Marketing</option>
                        <option>Construction Tracking</option>
                     </select>
                  </div>

                  <div>
                     <Label className="text-[13px] font-bold text-slate-700">Date Range</Label>
                     <select className="w-full mt-1.5 h-10 bg-slate-50 border border-[#E8ECF0] rounded-[8px] px-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                        <option>Last 30 Days</option>
                        <option>This Quarter</option>
                        <option>Year to Date</option>
                        <option>Custom Range</option>
                     </select>
                  </div>

                  <div>
                     <Label className="text-[13px] font-bold text-slate-700 mb-2 block">Include Sections</Label>
                     <div className="space-y-2.5 bg-slate-50 p-4 rounded-[10px] border border-[#E8ECF0]">
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300" defaultChecked />
                           <span className="text-[14px] font-medium text-slate-700">Summary Dashboard</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300" defaultChecked />
                           <span className="text-[14px] font-medium text-slate-700">Financial Statements</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300" defaultChecked />
                           <span className="text-[14px] font-medium text-slate-700">Project Variances</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300" />
                           <span className="text-[14px] font-medium text-slate-700">Raw Data (Excel)</span>
                        </label>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label className="text-[13px] font-bold text-slate-700">Format</Label>
                        <select className="w-full mt-1.5 h-10 bg-slate-50 border border-[#E8ECF0] rounded-[8px] px-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                           <option>PDF</option>
                           <option>Excel</option>
                           <option>Both</option>
                        </select>
                     </div>
                     <div>
                        <Label className="text-[13px] font-bold text-slate-700">Frequency</Label>
                        <select className="w-full mt-1.5 h-10 bg-slate-50 border border-[#E8ECF0] rounded-[8px] px-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]">
                           <option>Once (Now)</option>
                           <option>Weekly (Mon)</option>
                           <option>Monthly (1st)</option>
                        </select>
                     </div>
                  </div>

                  <div>
                     <Label className="text-[13px] font-bold text-slate-700">Email Recipients</Label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input type="text" defaultValue="md@analyzehive.com" className="w-full mt-1.5 h-10 pl-9 bg-slate-50 border-[#E8ECF0] rounded-[8px] text-[14px] font-medium focus-visible:ring-1 focus-visible:ring-[#0066FF] focus-visible:border-[#0066FF]" />
                     </div>
                  </div>

                  <Button className="w-full h-11 bg-[#0F172A] hover:bg-black text-white font-bold rounded-[8px] shadow-md mt-4 text-[14px]">
                     Schedule Report
                  </Button>
               </form>
            </PearlCard>
         </div>
      </div>

    </div>
  )
}
