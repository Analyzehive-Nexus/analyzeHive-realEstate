"use client"

import { useState } from "react"
import { 
  Truck, Search, Filter, Plus, FileDown, Clock, MapPin, Wrench, User,
  Calendar, RotateCcw, AlertTriangle, CheckCircle, MoreVertical
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock array replaced by props

const usageLogs = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 8.0 },
  { day: "Wed", hours: 7.5 },
  { day: "Thu", hours: 5.0 },
  { day: "Fri", hours: 8.5 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 0.0 },
];

const maintHistory = [
  { date: "Feb 15, 2026", type: "Routine Oil Change", by: "TechMech Services", cost: "₹12,400", notes: "Changed filters and hydraulic fluid." },
  { date: "Nov 10, 2025", type: "Part Replacement", by: "TechMech Services", cost: "₹45,000", notes: "Replaced main cylinder seal." },
  { date: "Aug 05, 2025", type: "Routine Inspection", by: "In-house", cost: "₹0", notes: "All check passed." },
];

const StatusBadge = ({ s }: { s: string }) => {
  if (s === 'Active') return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-[6px] tracking-wider font-bold">Active</Badge>;
  if (s === 'Maintenance') return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 shadow-none text-[10px] uppercase rounded-[6px] tracking-wider font-bold">Maintenance</Badge>;
  return <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 shadow-none text-[10px] uppercase rounded-[6px] tracking-wider font-bold">Decommissioned</Badge>;
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

export default function AssetsClient({ initialAssets }: { initialAssets: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const allAssets = initialAssets.map(a => ({
    id: a.id?.substring(0,8) || 'Unknown',
    name: a.asset_name || 'Unnamed Asset',
    type: a.asset_type || 'General',
    status: a.status || 'Active',
    nextService: a.next_maintenance_date ? new Date(a.next_maintenance_date).toLocaleDateString() : '--',
    assigned: 'Site Team', // Mock for now if no assigned user
    location: a.current_location || 'Storage',
    hours: a.total_hours_used || 0,
    purch: a.purchase_date ? new Date(a.purchase_date).toLocaleDateString() : '--',
    cost: a.purchase_cost ? `₹${(a.purchase_cost / 100000).toFixed(1)}L` : '--'
  }));

  const filteredAssets = allAssets.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Asset & Equipment Tracking</h1>
        <p className="text-sm text-slate-500">Monitor machinery, schedules, maintenance logs, and asset allocation.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Assets</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{allAssets.length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Active</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">{allAssets.filter(a => a.status === 'Active').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">In Maintenance</p>
            <h3 className="text-[32px] font-bold text-[#F59E0B] leading-tight">{allAssets.filter(a => a.status === 'Maintenance').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-slate-400">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Decommissioned</p>
            <h3 className="text-[32px] font-bold text-slate-600 leading-tight">{allAssets.filter(a => a.status === 'Decommissioned').length}</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR & VIEW TOGGLE */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search assets..." 
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="excavator">Excavators</SelectItem>
              <SelectItem value="crane">Cranes</SelectItem>
              <SelectItem value="mixer">Mixers</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-100 p-1 rounded-[10px] flex items-center">
             <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className={`h-8 px-3 rounded-[8px] text-[12px] ${viewMode === 'grid' ? 'bg-white text-[#0066FF] shadow-sm font-bold' : 'text-slate-500 font-semibold hover:bg-slate-200/50 hover:text-slate-700'}`}>Grid</Button>
             <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('table')} className={`h-8 px-3 rounded-[8px] text-[12px] ${viewMode === 'table' ? 'bg-white text-[#0066FF] shadow-sm font-bold' : 'text-slate-500 font-semibold hover:bg-slate-200/50 hover:text-slate-700'}`}>Table</Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm flex gap-2 font-bold">
                <Plus className="w-4 h-4" /> Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Register New Asset</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asset Name</Label>
                    <Input placeholder="e.g. Concrete Pump" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Asset Type</Label>
                    <Select>
                      <SelectTrigger className="rounded-[8px]"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pump">Pump</SelectItem>
                        <SelectItem value="crane">Crane</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Asset ID Number</Label>
                    <Input placeholder="AST-009" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Date</Label>
                    <Input type="date" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Cost (₹)</Label>
                    <Input type="number" placeholder="0.00" className="rounded-[8px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Location</Label>
                    <Select>
                      <SelectTrigger className="rounded-[8px]"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                         <SelectItem value="ta">Tower A</SelectItem>
                         <SelectItem value="tb">Tower B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-[8px]">Cancel</Button>
                <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] font-bold">Register Asset</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* ASSETS DISPLAY */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((ast) => {
             const statColor = ast.status === 'Active' ? 'bg-[#10B981]' : ast.status === 'Maintenance' ? 'bg-[#F59E0B]' : 'bg-slate-400'
             return (
            <InteractivePearlCard key={ast.id} className="relative group flex flex-col h-full">
              <div className={`h-1 w-full ${statColor} absolute top-0 left-0 right-0`} />
              <CardContent className="p-6 pt-6 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                   <div className={`h-12 w-12 rounded-[12px] flex items-center justify-center ${ast.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ast.status === 'Maintenance' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      <Truck className="h-6 w-6" />
                   </div>
                   <div className="flex flex-col items-end gap-1.5">
                      <StatusBadge s={ast.status} />
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-[4px]">{ast.id}</span>
                   </div>
                 </div>
                 
                 <h3 className="text-[17px] font-bold text-[#0F172A] leading-tight mb-4">{ast.name}</h3>
                 
                 <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-auto text-[13px]">
                    <div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider mb-1"><MapPin className="w-3 h-3 text-slate-400"/> Location</span>
                      <span className="font-semibold text-[#0F172A]">{ast.location}</span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider mb-1"><User className="w-3 h-3 text-slate-400"/> Assigned To</span>
                      <span className="font-semibold text-[#0F172A]">{ast.assigned}</span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider mb-1"><Clock className="w-3 h-3 text-slate-400"/> Hrs / Month</span>
                      <span className="font-semibold text-[#0F172A]">{ast.hours} <span className="text-slate-400 font-normal ml-0.5">hrs</span></span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-amber-600 text-[11px] uppercase font-bold tracking-wider mb-1"><Wrench className="w-3 h-3 text-amber-500"/> Next Service</span>
                      <span className="font-bold text-amber-700">{ast.nextService}</span>
                    </div>
                 </div>

                 <div className="flex gap-2 mt-6 pt-4 border-t border-[#E8ECF0]">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="flex-1 bg-white border border-[#E8ECF0] text-[#0F172A] hover:bg-slate-50 text-[13px] h-9 rounded-[8px] shadow-sm font-semibold">Details</Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-[500px]">
                        <SheetHeader className="mb-6">
                          <SheetTitle className="text-xl font-bold">{ast.name}</SheetTitle>
                          <div className="flex items-center gap-3 mt-2">
                             <StatusBadge s={ast.status} />
                             <span className="text-[13px] font-medium text-slate-500">ID: <span className="font-mono">{ast.id}</span></span>
                          </div>
                        </SheetHeader>
                        
                        <div className="space-y-6">
                           <div className="grid grid-cols-3 gap-3">
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0]">
                                 <p className="text-[10px] uppercase font-bold text-slate-400">Purchased</p>
                                 <p className="font-semibold text-[13px] text-[#0F172A] mt-1">{ast.purch}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0]">
                                 <p className="text-[10px] uppercase font-bold text-slate-400">Cost</p>
                                 <p className="font-semibold text-[13px] text-[#0F172A] mt-1">{ast.cost}</p>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0]">
                                 <p className="text-[10px] uppercase font-bold text-slate-400">Total Hrs</p>
                                 <p className="font-semibold text-[13px] text-[#0F172A] mt-1">2,450</p>
                              </div>
                           </div>

                           <div>
                             <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">7-Day Usage Log</h4>
                             <div className="h-[200px] border border-[#E8ECF0] rounded-[12px] p-2 bg-white">
                               <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={usageLogs} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0"/>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '8px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                                    <Bar dataKey="hours" name="Hours" fill="#0066FF" radius={[4, 4, 0, 0]} barSize={24} />
                                  </BarChart>
                               </ResponsiveContainer>
                             </div>
                           </div>

                           <div>
                             <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                                Maintenance History
                                <Button variant="ghost" className="h-6 text-[#0066FF] hover:bg-blue-50 hover:text-[#0066FF] text-[11px] px-2 rounded-[6px]"><Plus className="w-3 h-3 mr-1"/> Log</Button>
                             </h4>
                             <div className="divide-y divide-[#E8ECF0] border border-[#E8ECF0] rounded-[12px] bg-white text-[13px]">
                                {maintHistory.map((m, idx) => (
                                  <div key={idx} className="p-3 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-bold text-[#0F172A]">{m.type}</span>
                                      <span className="font-bold text-[#0066FF]">{m.cost}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mb-1.5">{m.date} | By: {m.by}</div>
                                    <p className="text-slate-600 text-[12px] leading-relaxed">{m.notes}</p>
                                  </div>
                                ))}
                             </div>
                           </div>
                           
                           <div className="pt-4 border-t border-[#E8ECF0] flex gap-3">
                              {ast.status === 'Active' ? (
                                <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-[8px] font-bold">Send to Maintenance</Button>
                              ) : (
                                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[8px] font-bold">Mark as Active</Button>
                              )}
                           </div>
                        </div>
                      </SheetContent>
                    </Sheet>

                    <Button className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white text-[13px] h-9 rounded-[8px] shadow-sm font-semibold">Assign</Button>
                 </div>
              </CardContent>
            </InteractivePearlCard>
          )})}
        </div>
      ) : (
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Asset Details</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Type</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Current Assignment</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Location</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Maintenance</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((ast) => (
                <TableRow key={ast.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{ast.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">{ast.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[4px] text-[10px] font-bold tracking-wide uppercase border-slate-200">{ast.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[13px] text-[#0F172A] flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400"/> {ast.assigned}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[13px] text-[#0F172A] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400"/> {ast.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[13px] text-amber-700 flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-amber-500"/> {ast.nextService}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge s={ast.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8 text-[11px] rounded-[6px] font-semibold text-[#0F172A]">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PearlCard>
      )}

    </div>
  )
}
