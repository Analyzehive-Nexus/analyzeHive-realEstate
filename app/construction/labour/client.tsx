"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";


import { useState } from "react"
import { 
  Users, UserCheck, UserX, UserMinus, Search, Filter, 
  MapPin, Clock, CalendarCheck, MoreVertical, Plus
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// MOCK DATA
const labourTable = [
  { role: "Mason", present: 18, total: 20, pct: 90 },
  { role: "Helper", present: 25, total: 28, pct: 89 },
  { role: "Electrician", present: 8, total: 10, pct: 80 },
  { role: "Plumber", present: 6, total: 7, pct: 86 },
  { role: "Carpenter", present: 10, total: 10, pct: 100 },
];

const attendanceTrend = [
  { day: "01", count: 62 }, { day: "02", count: 65 }, { day: "03", count: 68 }, { day: "04", count: 64 }, { day: "05", count: 67 }, { day: "06", count: 50 }, { day: "07", count: 12 },
  { day: "08", count: 60 }, { day: "09", count: 66 }, { day: "10", count: 69 }, { day: "11", count: 65 }, { day: "12", count: 68 }, { day: "13", count: 52 }, { day: "14", count: 10 },
  { day: "15", count: 63 }, { day: "16", count: 67 }, { day: "17", count: 70 }, { day: "18", count: 66 }, { day: "19", count: 68 }, { day: "20", count: 55 }, { day: "21", count: 15 },
  { day: "22", count: 65 }, { day: "23", count: 68 }, { day: "24", count: 72 }, { day: "25", count: 68 }, { day: "26", count: 70 }, { day: "27", count: 58 }, { day: "28", count: 14 },
  { day: "29", count: 66 }, { day: "30", count: 67 }
];

// Mock array replaced by props

const StatusBadge = ({ s }: { s: string }) => {
  if (s === 'Present') return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold w-full justify-center">Present</Badge>;
  if (s === 'Absent') return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold w-full justify-center">Absent</Badge>;
  if (s === 'Half Day') return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold w-full justify-center">Half Day</Badge>;
  return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold w-full justify-center">On Leave</Badge>;
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

export default function LabourClient({ initialLabour, stats }: { initialLabour: any[], stats: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<any>(null);

  const workers = initialLabour.map(w => ({
    id: w.id?.substring(0,8) || 'Unknown',
    name: w.worker_name || 'Unnamed Worker',
    role: w.role || 'General',
    phone: w.contact_number || '--',
    status: w.status || 'Absent',
    pct: 100, // DB doesn't have historical data for pct and days, mocking
    days: "23/23" 
  }));

  const filteredWorkers = workers.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Labour & Attendance</h1>
        <p className="text-sm text-slate-500">Track site workforce, daily attendance, and role-wise availability.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Workers</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight flex items-center gap-2"><Users className="w-6 h-6 text-blue-500"/> {stats?.total || 0}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Present Today</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight flex items-center gap-2"><UserCheck className="w-6 h-6 text-[#10B981]"/> {stats?.present || 0}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Absent</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight flex items-center gap-2"><UserX className="w-6 h-6 text-[#EF4444]"/> {stats?.absent || 0}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Attendance Rate</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{stats?.total > 0 ? ((stats?.present / stats?.total) * 100).toFixed(1) : 0}%</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* TWO COLUMN */}
      <section className="grid lg:grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Today's Attendance by Role" />
          <PearlCard className="flex-1 p-4">
            <ResponsiveTable>
<Table>
               <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-[#E8ECF0]">
                     <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase">Role</TableHead>
                     <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase text-right">Present/Total</TableHead>
                     <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase text-right">%</TableHead>
                     <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase text-right">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                 {labourTable.map((l, i) => (
                   <TableRow key={i} className="hover:bg-slate-50/50 border-b border-[#E8ECF0]/60 transition-colors">
                     <TableCell className="py-3.5 font-bold text-[13px] text-[#0F172A]">{l.role}</TableCell>
                     <TableCell className="py-3.5 text-right font-semibold text-[13px] text-slate-700">
                        {l.present} <span className="text-slate-400 font-normal">/ {l.total}</span>
                     </TableCell>
                     <TableCell className="py-3.5 text-right w-[60px]">
                        <Badge variant="outline" className={`rounded-[6px] shadow-none text-[10px] ${l.pct < 85 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>{l.pct}%</Badge>
                     </TableCell>
                     <TableCell className="py-3.5 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold rounded-[6px] text-[#0066FF] border-[#E8ECF0] shadow-sm hover:bg-blue-50">Mark Entry</Button>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
            </Table>
</ResponsiveTable>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="30-Day Attendance Trend" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                 <Tooltip cursor={{stroke: '#10B981', strokeWidth: 1, strokeDasharray: '3 3'}} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                 <Area type="monotone" dataKey="count" name="Workers Present" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

      {/* FILTER BAR & FULL TABLE */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
          <div className="flex flex-1 gap-4 items-center w-full">
            <div className="relative w-full max-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search worker..." 
                className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="mason">Mason</SelectItem>
                <SelectItem value="helper">Helper</SelectItem>
                <SelectItem value="elec">Electrician</SelectItem>
                <SelectItem value="plumb">Plumber</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="half">Half Day</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-[150px]">
               <Input type="date" defaultValue="2026-03-18" className="bg-slate-50 border-slate-200 h-10 rounded-[10px] text-sm" />
            </div>
          </div>
          <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2">
            <Plus className="w-4 h-4" /> Add Worker
          </Button>
        </div>

        <PearlCard>
          <ResponsiveTable>
<Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Worker</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Role</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Contact</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center w-[120px]">Status (Today)</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Month Att %</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Present / Total</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((w) => (
                <TableRow key={w.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{w.name}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{w.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[4px] text-[10px] font-bold tracking-wide uppercase border-slate-200">{w.role}</Badge>
                  </TableCell>
                  <TableCell>
                     <div className="font-medium text-[13px] text-slate-600">{w.phone}</div>
                  </TableCell>
                  <TableCell className="text-center">
                     <StatusBadge s={w.status} />
                  </TableCell>
                  <TableCell className="text-center">
                     <span className={`font-bold text-[14px] ${w.pct >= 90 ? 'text-emerald-600' : w.pct >= 80 ? 'text-amber-600' : 'text-red-500'}`}>{w.pct}%</span>
                  </TableCell>
                  <TableCell className="text-right">
                     <span className="font-semibold text-[13px] text-[#0F172A]">{w.days} <span className="text-slate-400 font-normal">days</span></span>
                  </TableCell>
                  <TableCell className="text-center">
                     <Dialog>
                       <DialogTrigger asChild>
                         <Button variant="outline" size="sm" className="h-8 text-[11px] rounded-[6px] font-bold text-[#0066FF] border-[#E8ECF0] hover:bg-blue-50 shadow-sm w-[90px]" onClick={() => setSelectedWorker(w)}>Update</Button>
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[400px]">
                         <DialogHeader>
                           <DialogTitle>Mark Attendance</DialogTitle>
                         </DialogHeader>
                         {selectedWorker && (
                           <div className="grid gap-4 py-4">
                             <div className="p-3 bg-slate-50 rounded-[10px] border border-[#E8ECF0] flex justify-between items-center shadow-sm">
                                <div>
                                  <div className="font-bold text-[15px] text-[#0F172A]">{selectedWorker.name}</div>
                                  <div className="text-[12px] text-slate-500 font-medium">{selectedWorker.role} | {selectedWorker.id}</div>
                                </div>
                             </div>
                             
                             <div className="space-y-2">
                               <Label className="text-slate-600 font-semibold">Date</Label>
                               <Input type="date" defaultValue="2026-03-18" className="h-10 rounded-[8px]" />
                             </div>

                             <div className="space-y-2">
                               <Label className="text-slate-600 font-semibold">Status</Label>
                               <Select defaultValue={selectedWorker.status.toLowerCase().replace(' ', '')}>
                                 <SelectTrigger className="h-10 rounded-[8px]">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="present">Present (Full Day)</SelectItem>
                                   <SelectItem value="halfday">Half Day</SelectItem>
                                   <SelectItem value="absent">Absent</SelectItem>
                                   <SelectItem value="onleave">On Leave</SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#E8ECF0] pt-4 mt-2">
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold text-[12px]">Check-in Time</Label>
                                 <Input type="time" defaultValue="08:00" className="h-10 rounded-[8px]" />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold text-[12px]">Check-out Time</Label>
                                 <Input type="time" defaultValue="18:00" className="h-10 rounded-[8px]" />
                               </div>
                             </div>

                             <div className="space-y-2">
                               <Label className="text-slate-600 font-semibold">Notes</Label>
                               <Textarea placeholder="Any remarks..." rows={2} className="rounded-[8px]" />
                             </div>
                           </div>
                         )}
                         <DialogFooter>
                           <Button variant="outline" className="rounded-[8px] h-10">Cancel</Button>
                           <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm">Save Attendance</Button>
                         </DialogFooter>
                       </DialogContent>
                     </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
</ResponsiveTable>
        </PearlCard>
      </section>

    </div>
  )
}
