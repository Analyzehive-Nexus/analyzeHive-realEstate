export const dynamic = 'force-dynamic';

import { Building2, Home, Building, Factory, PlusCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { getProjects } from "@/lib/data"

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
    className={`overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#CBD5E1] transition-all duration-200 ${className} group`}
    style={{
      background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// --- MOCK DATA FALLBACKS ---
const milestones = [
  { project: "Tower A", milestone: "10th Floor Slab Cast", target: "Mar 15, 2026", actual: "Mar 12, 2026", status: "Completed" },
  { project: "Tower B", milestone: "Foundation Completion", target: "Mar 25, 2026", actual: "-", status: "Delayed" },
  { project: "Villas Ph 1", milestone: "Handover Phase 1", target: "Apr 10, 2026", actual: "-", status: "On Track" },
  { project: "Commercial Hub", milestone: "Excavation Finish", target: "May 05, 2026", actual: "-", status: "On Track" },
];

const formatCr = (val: number) => `₹${(val / 10000000).toFixed(1)}Cr`;

export default async function ProjectProgressPage() {
  const projectsData = await getProjects();
  
  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Project Progress</h1>
          <p className="text-slate-500 font-medium mt-1">Status, timelines, and budgets across all developments.</p>
        </div>
      </div>

      {/* SECTION 1: 4 STATUS CARDS */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {(projectsData || []).map((p: any, i: number) => {
          const type = p.type || 'Residential';
          const isRes = type === 'Residential';
          const isLux = type === 'Luxury';
          const icon = isRes ? <Building2 className="w-5 h-5"/> : isLux ? <Home className="w-5 h-5"/> : <Factory className="w-5 h-5"/>;
          const status = p.status || 'On Track';

          return (
          <InteractivePearlCard key={i} className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
               <div className={`h-10 w-10 rounded-[10px] flex items-center justify-center ${
                 isRes ? 'bg-blue-100 text-blue-600' :
                 isLux ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
               }`}>
                 {icon}
               </div>
               <Badge className={`border-none shadow-sm text-[10px] uppercase font-bold tracking-widest ${
                 status === 'Active' || status === 'On Track' ? 'bg-blue-50 text-blue-700' :
                 status === 'Completed' || status === 'Ahead' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
               }`}>
                 {status}
               </Badge>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] leading-tight mb-1">{p.name || `Project ${i+1}`}</h3>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest leading-loose">
                {p.completion_percentage || 0}% Completed
              </p>
            </div>
            <Progress value={p.completion_percentage || 0} className={`h-1.5 mt-4 ${
              (p.completion_percentage||0) > 80 ? 'bg-emerald-100 [&>div]:bg-[#10B981]' : 
              (p.completion_percentage||0) > 40 ? 'bg-blue-100 [&>div]:bg-[#0066FF]' : 'bg-orange-100 [&>div]:bg-[#F59E0B]'
            }`} />
          </InteractivePearlCard>
        )})}
        {(!projectsData || projectsData.length === 0) && <div className="col-span-4 py-8 text-center text-slate-500">No active projects found in database.</div>}
      </section>

      {/* SECTION 2: GANTT CHART */}
      <section>
        <SectionHeading title="Master Construction Timeline" />
        <PearlCard className="p-6 overflow-x-auto">
           {/* Simple static HTML/CSS Gantt layout for demonstration */}
           <div className="min-w-[800px] relative border border-[#E8ECF0] rounded-[10px] bg-[#FAFBFC]">
              {/* Header Row */}
              <div className="flex border-b border-[#E8ECF0] bg-[#F1F5F9] rounded-t-[10px] text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                 <div className="w-[180px] shrink-0 border-r border-[#E8ECF0] p-3 text-[#0F172A]">Project</div>
                 <div className="flex-1 grid grid-cols-12 divide-x divide-white/60">
                    <div className="col-span-3 p-3 flex justify-center">2024 (H2)</div>
                    <div className="col-span-4 p-3 flex justify-center">2025</div>
                    <div className="col-span-3 p-3 flex justify-center">2026</div>
                    <div className="col-span-2 p-3 flex justify-center">2027+</div>
                 </div>
              </div>

              {/* Current Date Marker */}
              <div className="absolute top-[44px] bottom-0 left-[260px] md:left-[42%] w-px bg-red-400 z-10 hidden sm:block">
                 <div className="absolute top-0 -translate-x-1/2 -translate-y-[28px] bg-red-100 border border-red-300 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                   Today ({new Date().toLocaleDateString('en-US', {month: 'short', year: '2-digit'})})
                 </div>
              </div>

              {/* Rows */}
              {(projectsData || []).map((p: any, i: number) => (
                <div key={i} className="flex border-b border-[#E8ECF0]/60 hover:bg-white transition-colors relative">
                  <div className="w-[180px] shrink-0 border-r border-[#E8ECF0] p-3 font-semibold text-[13px] text-[#0F172A] flex items-center">{p.name || `Project ${i+1}`}</div>
                  <div className="flex-1 relative h-12">
                     <div className="absolute top-2.5 bottom-2.5 bg-blue-100 border border-blue-300 rounded-[6px] overflow-hidden group" style={{ left: `${(i * 10) % 30}%`, right: `${Math.max(10, 40 - (i * 15))}%` }}>
                        <div className="h-full bg-blue-500/90" style={{ width: `${p.completion_percentage || 0}%`}}></div>
                        <div className="absolute inset-0 flex items-center px-3 text-[11px] font-bold text-blue-900 justify-between">
                           <span>Start</span> <span>Est. End</span>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
           </div>
        </PearlCard>
      </section>

      {/* SECTION 3 & 4: TABLES */}
      <section className="grid xl:grid-cols-2 gap-8">
        
        {/* MILESTONES (MOCK FALLBACK) */}
        <div className="flex flex-col">
          <SectionHeading title="Milestone Tracker" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase py-3 pl-4">Project / Milestone</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase">Target Date</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase">Status</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {milestones.map((m, i) => (
                   <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-3 pl-4">
                       <p className="font-bold text-[#0F172A] text-[13px]">{m.milestone}</p>
                       <p className="text-[11px] font-semibold text-slate-500">{m.project}</p>
                     </TableCell>
                     <TableCell className="text-[13px] font-medium text-slate-600">{m.target}</TableCell>
                     <TableCell>
                       <Badge variant="outline" className={`border-none shadow-none font-bold px-2 py-0.5 ${
                         m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                         m.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                       }`}>
                         {m.status}
                       </Badge>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="flex flex-col">
          <SectionHeading title="Project Financial Summary" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase py-3 pl-4">Project</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">Budget</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">Spent</TableHead>
                   <TableHead className="text-[10px] font-bold text-[#64748B] uppercase text-right">Remaining</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {(projectsData || []).map((f: any, i: number) => (
                   <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-3 pl-4 font-bold text-[#0F172A] text-[13px]">{f.name}</TableCell>
                     <TableCell className="text-right text-[13px] font-semibold text-slate-700">{formatCr(f.budget_total || 0)}</TableCell>
                     <TableCell className="text-right text-[13px] font-bold text-[#0F172A]">{formatCr(f.budget_spent || 0)}</TableCell>
                     <TableCell className="text-right">
                       <Badge variant="outline" className={`border-none shadow-none font-bold px-2 py-0.5 ${
                         (f.budget_total||0) - (f.budget_spent||0) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {formatCr((f.budget_total||0) - (f.budget_spent||0))}
                       </Badge>
                     </TableCell>
                   </TableRow>
                 ))}
                 {(!projectsData || projectsData.length === 0) && <TableRow><TableCell colSpan={4} className="text-center py-4 text-slate-500">No project financials to display.</TableCell></TableRow>}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

      </section>

    </div>
  )
}
