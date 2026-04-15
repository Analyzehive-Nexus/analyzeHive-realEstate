"use client"

import { useState } from "react"
import { 
  FileText, Search, Plus, Calendar, Clock, MapPin, 
  CloudSun, CloudRain, Sun, HardHat, AlertTriangle, CheckCircle, Image as ImageIcon
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

// Mock array replaced by props

const WeatherIcon = ({ w }: { w: string }) => {
  if (w === 'Sunny') return <Sun className="w-4 h-4 text-amber-500" />;
  if (w === 'Cloudy') return <CloudSun className="w-4 h-4 text-slate-500" />;
  return <CloudRain className="w-4 h-4 text-blue-500" />;
};

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function ProgressClient({ initialReports }: { initialReports: any[] }) {
  const [reportProgress, setReportProgress] = useState([50]);

  const allReports = initialReports.map((r, i) => {
    const d = new Date(r.date);
    return {
      id: r.id?.substring(0,8) || `REP-0${i+1}`,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      site: r.project_id || 'Site', // If there's a project join, use that name
      floor: r.area || 'General Area',
      p: r.completion_percentage || 0,
      by: r.submitted_by_user?.name || 'Staff',
      time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      weather: r.weather_conditions || 'Sunny',
      workers: r.workers_present || 0,
      work: Array.isArray(r.work_completed) ? r.work_completed : typeof r.work_completed === 'string' ? r.work_completed.split('\\n') : [],
      materials: Array.isArray(r.materials_used) ? r.materials_used : [],
      issues: r.issues_blockers || 'None.',
      photos: Array.isArray(r.photos) ? r.photos : []
    };
  });

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Daily Progress Reports</h1>
        <p className="text-sm text-slate-500">Track daily site activities, material usage, and project completion status.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Reports Today</p>
            <div className="flex items-center gap-3">
               <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight">{allReports.length}</h3>
               <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 shadow-none border-none text-[10px] font-bold">Updated</Badge>
            </div>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#0F172A]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Reports This Week</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{allReports.length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Avg Completion</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">{allReports.length > 0 ? (allReports.reduce((acc, r) => acc + r.p, 0) / allReports.length).toFixed(0) : 0}%</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">On Schedule</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">3 / 4</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[200px]">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input type="date" className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Project / Tower" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Towers</SelectItem>
              <SelectItem value="t1">Tower A</SelectItem>
              <SelectItem value="t2">Tower B</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Submitted By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any User</SelectItem>
              <SelectItem value="u1">Ravi Kumar</SelectItem>
              <SelectItem value="u2">Sunil Sharma</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm flex gap-2 font-bold">
                <Plus className="w-4 h-4" /> Submit Daily Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Daily Progress Report</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Project / Tower</Label>
                    <Select>
                      <SelectTrigger className="rounded-[8px]"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ta">Tower A</SelectItem>
                        <SelectItem value="tb">Tower B</SelectItem>
                        <SelectItem value="tc">Tower C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Floor / Area</Label>
                    <Input placeholder="e.g. Floor 12" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" className="rounded-[8px]" defaultValue="2026-03-18" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 items-center bg-slate-50 p-4 rounded-[12px] border border-[#E8ECF0]">
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <Label>Area Completion Status</Label>
                        <span className="font-bold text-[#0066FF]">{reportProgress}%</span>
                     </div>
                     <Slider value={reportProgress} onValueChange={setReportProgress} max={100} step={1} className="[&>span:first-child]:bg-blue-100 [&_[role=slider]]:bg-[#0066FF] [&_[role=slider]]:border-[#0066FF]" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Weather</Label>
                        <Select defaultValue="sunny">
                          <SelectTrigger className="rounded-[8px] bg-white"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sunny"><div className="flex items-center gap-2"><Sun className="w-4 h-4 text-amber-500"/> Sunny</div></SelectItem>
                            <SelectItem value="cloudy"><div className="flex items-center gap-2"><CloudSun className="w-4 h-4 text-slate-500"/> Cloudy</div></SelectItem>
                            <SelectItem value="rainy"><div className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-500"/> Rainy</div></SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Workers Present</Label>
                        <Input type="number" placeholder="0" className="rounded-[8px] bg-white" />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                  <Label>Work Completed Today (Bullet points)</Label>
                  <Textarea placeholder="- Completed reinforcement binding..." rows={4} className="rounded-[8px]" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Materials Used</Label>
                    <Button variant="ghost" size="sm" className="h-6 text-[#0066FF] px-2 text-[11px]"><Plus className="w-3 h-3 mr-1"/> Add Row</Button>
                  </div>
                  <div className="border border-[#E8ECF0] rounded-[8px] overflow-hidden">
                     <div className="grid grid-cols-3 bg-slate-50 border-b border-[#E8ECF0] p-2 text-[11px] font-bold text-slate-500 uppercase">
                        <div className="col-span-2">Material</div>
                        <div>Quantity</div>
                     </div>
                     <div className="grid grid-cols-3 p-2 gap-2">
                        <div className="col-span-2"><Input placeholder="Material name" className="h-8 text-[12px]" /></div>
                        <div><Input placeholder="Qty" className="h-8 text-[12px]" /></div>
                     </div>
                     <div className="grid grid-cols-3 p-2 gap-2 pt-0">
                        <div className="col-span-2"><Input placeholder="Material name" className="h-8 text-[12px]" /></div>
                        <div><Input placeholder="Qty" className="h-8 text-[12px]" /></div>
                     </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Issues / Blockers (Optional)</Label>
                  <Textarea placeholder="Any delays, accidents, or material shortages..." rows={2} className="rounded-[8px]" />
                </div>

                <div className="space-y-2">
                  <Label>Site Photos</Label>
                  <div className="border-2 border-dashed border-[#E8ECF0] rounded-[12px] p-6 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                     <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                     <p className="text-sm font-semibold text-[#0066FF]">Click to upload photos</p>
                     <p className="text-xs mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-[8px]">Cancel</Button>
                <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] font-bold">Submit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* REPORTS LIST */}
      <section className="space-y-6">
         {allReports.map((r) => (
            <PearlCard key={r.id}>
               <div className="flex flex-col md:flex-row border-b border-[#E8ECF0] bg-[#FAFBFC]">
                  {/* Summary Header */}
                  <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-[#E8ECF0] flex flex-col justify-center">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white border border-[#E8ECF0] rounded-[8px] w-12 h-12 flex flex-col items-center justify-center shadow-sm">
                           <span className="text-[10px] font-bold text-slate-500 uppercase">{r.day}</span>
                           <span className="text-[16px] font-bold text-[#0F172A]">{r.date.split(" ")[1].replace(',', '')}</span>
                        </div>
                        <div>
                           <h3 className="font-bold text-[18px] text-[#0F172A] leading-tight flex items-center gap-2">
                             {r.site} <span className="text-slate-300 font-light">|</span> <span className="text-[#0066FF] text-[16px]">{r.floor}</span>
                           </h3>
                           <p className="text-[12px] text-slate-500 font-medium mt-0.5">{r.date}</p>
                        </div>
                     </div>
                     <div className="space-y-1.5 mt-2">
                        <div className="flex justify-between items-end">
                           <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Completion</span>
                           <span className="text-[16px] font-bold text-[#0F172A]">{r.p}%</span>
                        </div>
                        <Progress value={r.p} className={`h-2 ${r.p > 80 ? 'bg-emerald-100 [&>div]:bg-emerald-500' : 'bg-blue-100 [&>div]:bg-[#0066FF]'}`} />
                     </div>
                  </div>

                  {/* Meta Details */}
                  <div className="p-6 md:w-2/3 flex flex-col justify-between bg-white">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                             <WeatherIcon w={r.weather} />
                             <span className="text-[12px] font-bold text-slate-600">{r.weather}</span>
                           </div>
                           <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                             <HardHat className="w-4 h-4 text-slate-500" />
                             <span className="text-[12px] font-bold text-slate-600">{r.workers} Workers</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[12px] text-slate-500 font-medium">Submitted by</p>
                           <p className="text-[14px] font-bold text-[#0F172A]">{r.by}</p>
                           <p className="text-[11px] text-slate-400 mt-0.5">at {r.time}</p>
                        </div>
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-8 flex-1">
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-[#E8ECF0] pb-1">Work Completed</h4>
                           <ul className="space-y-1.5 list-disc pl-4 text-[13px] text-slate-600 font-medium">
                              {r.work.map((wLine: string, idx: number) => <li key={idx} className="pl-1 leading-snug">{wLine}</li>)}
                           </ul>
                        </div>
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-[#E8ECF0] pb-1">Materials Used</h4>
                           <div className="space-y-1.5 text-[13px]">
                             {r.materials.map((m: any, idx: number) => (
                               <div key={idx} className="flex justify-between items-center border-b border-dashed border-[#E8ECF0] pb-1">
                                  <span className="text-slate-600 font-medium">{m.m}</span>
                                  <span className="font-bold text-[#0F172A]">{m.q}</span>
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Footer / Issues / Photos */}
               <div className="p-4 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex-1 flex items-center gap-6">
                     {r.issues && r.issues !== 'None.' && (
                        <div className="flex items-start gap-2 max-w-[400px]">
                           <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                           <p className="text-[12px] text-amber-700 font-medium leading-tight">{r.issues}</p>
                        </div>
                     )}
                     <div className="flex gap-2 ml-auto">
                        {r.photos.map((c: string, idx: number) => (
                           <div key={idx} className={`w-8 h-8 rounded-[6px] ${c} flex items-center justify-center border border-slate-200/50 shadow-sm overflow-hidden relative group cursor-pointer`}>
                             <ImageIcon className="w-3.5 h-3.5 text-black/20" />
                           </div>
                        ))}
                     </div>
                  </div>
                  <Button variant="outline" className="h-9 text-[12px] font-bold rounded-[8px] bg-slate-50 hover:bg-slate-100 text-[#0F172A] border-[#E8ECF0] shadow-sm whitespace-nowrap">View Full Report</Button>
               </div>
            </PearlCard>
         ))}
      </section>

    </div>
  )
}
