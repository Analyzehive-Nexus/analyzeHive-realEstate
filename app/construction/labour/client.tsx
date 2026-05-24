"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { 
  upsertLabourAttendance, 
  addLabourWorker, 
  fetchLabourAttendanceForDate, 
  fetchLabourAttendanceTrend,
  fetchWorkerAttendanceHistory
} from "@/app/construction/actions";
import { useToast } from "@/components/ui/toast";

import { useState, useEffect } from "react"
import { 
  Users, UserCheck, UserX, UserMinus, Search, Filter, 
  MapPin, Clock, CalendarCheck, MoreVertical, Plus, Loader2, Trash
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

export default function LabourClient({ initialLabour }: { initialLabour: any[], stats: any }) {
  const { toast } = useToast();
  const [localLabour, setLocalLabour] = useState<any[]>(initialLabour);
  
  // Date tracking initialized from first loaded record's date, or today
  const [selectedDate, setSelectedDate] = useState(
    initialLabour.length > 0 ? initialLabour[0].date : new Date().toISOString().split('T')[0]
  );

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Dialog State
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Forms Fields State
  const [updateStatus, setUpdateStatus] = useState("Present");
  const [updateCheckIn, setUpdateCheckIn] = useState("08:00");
  const [updateCheckOut, setUpdateCheckOut] = useState("17:00");
  const [updateNotes, setUpdateNotes] = useState("");
  const [updateDate, setUpdateDate] = useState("");

  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerRole, setNewWorkerRole] = useState("Mason");
  const [newWorkerPhone, setNewWorkerPhone] = useState("");
  const [newWorkerStatus, setNewWorkerStatus] = useState("Present");

  // Trend & Individual Worker Stats
  const [trendData, setTrendData] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);

  // Load labor list for selectedDate
  useEffect(() => {
    const loadLabourList = async () => {
      const res = await fetchLabourAttendanceForDate(selectedDate);
      if (res.success && res.data) {
        setLocalLabour(res.data);
      }
    };
    loadLabourList();
  }, [selectedDate]);

  // Load attendance aggregate trend and individual history statistics
  const loadTrendAndHistory = async () => {
    const [trendRes, histRes] = await Promise.all([
      fetchLabourAttendanceTrend(),
      fetchWorkerAttendanceHistory()
    ]);
    if (trendRes.success && trendRes.data) {
      setTrendData(trendRes.data);
    }
    if (histRes.success && histRes.data) {
      setHistoryData(histRes.data);
    }
  };

  useEffect(() => {
    loadTrendAndHistory();
  }, [localLabour]);

  // Triggered when an update attendance dialog opens
  const openUpdateDialog = (w: any) => {
    setSelectedWorker(w);
    setUpdateStatus(w.status || "Present");
    setUpdateCheckIn(w.check_in ? w.check_in.substring(0, 5) : "08:00");
    setUpdateCheckOut(w.check_out ? w.check_out.substring(0, 5) : "17:00");
    setUpdateNotes(w.notes || "");
    setUpdateDate(w.date || selectedDate);
    setIsUpdateOpen(true);
  };

  // Submit attendance upsert
  const handleSaveAttendance = async () => {
    if (!selectedWorker) return;
    setIsActionLoading(true);
    
    const res = await upsertLabourAttendance(
      selectedWorker.name,
      selectedWorker.role,
      selectedWorker.phone,
      updateDate,
      updateStatus,
      updateCheckIn,
      updateCheckOut,
      updateNotes
    );
    
    setIsActionLoading(false);

    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Workforce attendance updated successfully." });
      setIsUpdateOpen(false);
      const fresh = await fetchLabourAttendanceForDate(selectedDate);
      if (fresh.success && fresh.data) {
        setLocalLabour(fresh.data);
      }
    }
  };

  // Submit adding new worker
  const handleAddWorkerSubmit = async () => {
    if (!newWorkerName.trim() || !newWorkerPhone.trim()) {
      toast({ title: "Error", description: "Worker Name and Phone number are required.", variant: "destructive" });
      return;
    }

    setIsActionLoading(true);
    const res = await addLabourWorker(
      newWorkerName,
      newWorkerRole,
      newWorkerPhone,
      selectedDate,
      newWorkerStatus
    );
    setIsActionLoading(false);

    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Worker Registered", description: "New worker added successfully." });
      setIsAddWorkerOpen(false);
      setNewWorkerName("");
      setNewWorkerPhone("");
      const fresh = await fetchLabourAttendanceForDate(selectedDate);
      if (fresh.success && fresh.data) {
        setLocalLabour(fresh.data);
      }
    }
  };

  // Recalculate KPIs from real data (localLabour)
  const totalCount = localLabour.length;
  const presentCount = localLabour.filter(w => w.status === 'Present' || w.status === 'Half Day').length;
  const absentCount = localLabour.filter(w => w.status === 'Absent').length;
  const leaveCount = localLabour.filter(w => w.status === 'On Leave').length;
  const attendanceRate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : "0.0";

  // Dynamic attendance role breakdown
  const roleGroups: Record<string, { present: number; total: number }> = {};
  localLabour.forEach(w => {
    const r = w.role || 'General';
    if (!roleGroups[r]) {
      roleGroups[r] = { present: 0, total: 0 };
    }
    roleGroups[r].total += 1;
    if (w.status === 'Present' || w.status === 'Half Day') {
      roleGroups[r].present += 1;
    }
  });

  const computedRoleTable = Object.entries(roleGroups).map(([role, data]) => {
    const pct = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
    return {
      role,
      present: data.present,
      total: data.total,
      pct
    };
  });

  // Dynamic historical records lookup for individuals
  const historyStats: Record<string, { present: number; total: number }> = {};
  historyData.forEach(row => {
    const name = row.worker_name;
    if (!historyStats[name]) {
      historyStats[name] = { present: 0, total: 0 };
    }
    historyStats[name].total += 1;
    if (row.status === 'Present' || row.status === 'Half Day') {
      historyStats[name].present += 1;
    }
  });

  const workers = localLabour.map(w => {
    const hist = historyStats[w.worker_name] || { present: 1, total: 1 };
    const pct = hist.total > 0 ? Math.round((hist.present / hist.total) * 100) : 100;
    const days = `${hist.present}/${hist.total}`;

    return {
      id: w.id || 'Unknown',
      displayId: w.id?.substring(0,8) || 'Unknown',
      name: w.worker_name || 'Unnamed Worker',
      role: w.role || 'General',
      phone: w.phone || w.contact_number || '--',
      status: w.status || 'Absent',
      check_in: w.check_in || '',
      check_out: w.check_out || '',
      notes: w.notes || '',
      date: w.date || selectedDate,
      pct,
      days
    };
  });

  // Filter implementations
  const filteredWorkers = workers.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.phone.includes(searchTerm);
    const matchRole = selectedRole === "all" || w.role.toLowerCase().startsWith(selectedRole.toLowerCase());
    const matchStatus = selectedStatus === "all" || w.status.toLowerCase().replace(' ', '') === selectedStatus.toLowerCase().replace(' ', '');
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Labour & Attendance Tracker</h1>
        <p className="text-sm text-slate-500">Track site workforce, daily attendance, and role-wise availability.</p>
      </div>

      {/* Dynamic Real-Data KPI Cards */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Workers</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500"/> {totalCount}
            </h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Present Today</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-[#10B981]"/> {presentCount}
            </h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Absent</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight flex items-center gap-2">
              <UserX className="w-6 h-6 text-[#EF4444]"/> {absentCount}
            </h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#6366F1]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Attendance Rate</p>
            <h3 className="text-[32px] font-bold text-[#6366F1] leading-tight">{attendanceRate}%</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* Dynamic Real-Data Charts & Breakdown */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Today's Attendance by Role" />
          <PearlCard className="flex-1 p-4 bg-white">
            <ResponsiveTable>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-[#E8ECF0]">
                    <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase">Role</TableHead>
                    <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase text-right">Present/Total</TableHead>
                    <TableHead className="font-semibold text-[11px] text-[#64748B] uppercase text-right">% Availability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {computedRoleTable.map((l, i) => (
                    <TableRow key={i} className="hover:bg-slate-50/50 border-b border-[#E8ECF0]/60 transition-colors">
                      <TableCell className="py-3.5 font-bold text-[13px] text-[#0F172A]">{l.role}</TableCell>
                      <TableCell className="py-3.5 text-right font-semibold text-[13px] text-slate-700">
                        {l.present} <span className="text-slate-400 font-normal">/ {l.total}</span>
                      </TableCell>
                      <TableCell className="py-3.5 text-right w-[120px]">
                        <Badge variant="outline" className={`rounded-[6px] shadow-none text-[10px] ${l.pct < 85 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>{l.pct}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {computedRoleTable.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-slate-400 text-sm">No role data available for today</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="30-Day Workforce Attendance Trend" />
          <PearlCard className="flex-1 p-6 bg-white">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData.length > 0 ? trendData : [{ day: "0", count: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                placeholder="Search worker by name or phone..." 
                className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px] bg-white">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="mason">Mason</SelectItem>
                <SelectItem value="helper">Helper</SelectItem>
                <SelectItem value="electrician">Electrician</SelectItem>
                <SelectItem value="plumber">Plumber</SelectItem>
                <SelectItem value="carpenter">Carpenter</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="halfday">Half Day</SelectItem>
                <SelectItem value="onleave">On Leave</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-[150px]">
               <Input 
                 type="date" 
                 value={selectedDate} 
                 onChange={(e) => setSelectedDate(e.target.value)}
                 className="bg-slate-50 border-slate-200 h-10 rounded-[10px] text-sm" 
               />
            </div>
          </div>
          <Button 
            className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2"
            onClick={() => setIsAddWorkerOpen(true)}
          >
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
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Present / Total days</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.map((w) => (
                  <TableRow key={w.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                    <TableCell>
                      <div className="font-bold text-[14px] text-[#0F172A]">{w.name}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">{w.displayId}</div>
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
                       <Button 
                         variant="outline" 
                         size="sm" 
                         className="h-8 text-[11px] rounded-[6px] font-bold text-[#0066FF] border-[#E8ECF0] hover:bg-blue-50 shadow-sm w-[90px]" 
                         onClick={() => openUpdateDialog(w)}
                       >
                         Update
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredWorkers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-sm">No workforce entries match current filters</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ResponsiveTable>
        </PearlCard>
      </section>

      {/* UPDATE ATTENDANCE DIALOG */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-[16px] border border-slate-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Mark Attendance</DialogTitle>
          </DialogHeader>
          {selectedWorker && (
            <div className="grid gap-4 py-4">
              <div className="p-3 bg-slate-50 rounded-[10px] border border-[#E8ECF0] flex justify-between items-center shadow-sm">
                <div>
                  <div className="font-bold text-[15px] text-[#0F172A]">{selectedWorker.name}</div>
                  <div className="text-[12px] text-slate-500 font-medium">{selectedWorker.role} | {selectedWorker.displayId}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Date</Label>
                <Input 
                  type="date" 
                  value={updateDate} 
                  onChange={(e) => setUpdateDate(e.target.value)} 
                  className="h-10 rounded-[8px]" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Status</Label>
                <Select value={updateStatus} onValueChange={setUpdateStatus}>
                  <SelectTrigger className="h-10 rounded-[8px] bg-white">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Present">Present (Full Day)</SelectItem>
                    <SelectItem value="Half Day">Half Day</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#E8ECF0] pt-4 mt-2">
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold text-[12px]">Check-in Time</Label>
                  <Input 
                    type="time" 
                    value={updateCheckIn} 
                    onChange={(e) => setUpdateCheckIn(e.target.value)} 
                    className="h-10 rounded-[8px]" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 font-semibold text-[12px]">Check-out Time</Label>
                  <Input 
                    type="time" 
                    value={updateCheckOut} 
                    onChange={(e) => setUpdateCheckOut(e.target.value)} 
                    className="h-10 rounded-[8px]" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Notes</Label>
                <Textarea 
                  placeholder="Any remarks..." 
                  rows={2} 
                  className="rounded-[8px]" 
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-[8px] h-10 font-semibold" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm"
              onClick={handleSaveAttendance}
              disabled={isActionLoading}
            >
              {isActionLoading && <Loader2 className="animate-spin w-4 h-4 mr-1" />}
              Save Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD WORKER DIALOG */}
      <Dialog open={isAddWorkerOpen} onOpenChange={setIsAddWorkerOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-[16px] border border-slate-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Add New Worker</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-600 font-semibold">Worker Name</Label>
              <Input 
                placeholder="Ramesh Kumar" 
                className="h-10 rounded-[8px]" 
                value={newWorkerName}
                onChange={(e) => setNewWorkerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600 font-semibold">Role</Label>
              <Select value={newWorkerRole} onValueChange={setNewWorkerRole}>
                <SelectTrigger className="h-10 rounded-[8px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Mason">Mason</SelectItem>
                  <SelectItem value="Helper">Helper</SelectItem>
                  <SelectItem value="Electrician">Electrician</SelectItem>
                  <SelectItem value="Plumber">Plumber</SelectItem>
                  <SelectItem value="Carpenter">Carpenter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600 font-semibold">Contact Number</Label>
              <Input 
                placeholder="e.g. 9811111101" 
                className="h-10 rounded-[8px]" 
                value={newWorkerPhone}
                onChange={(e) => setNewWorkerPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600 font-semibold">Initial Status (Today)</Label>
              <Select value={newWorkerStatus} onValueChange={setNewWorkerStatus}>
                <SelectTrigger className="h-10 rounded-[8px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Half Day">Half Day</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-[8px] h-10 font-semibold" onClick={() => setIsAddWorkerOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm"
              disabled={isActionLoading}
              onClick={handleAddWorkerSubmit}
            >
              {isActionLoading && <Loader2 className="animate-spin w-4 h-4 mr-1" />}
              Add Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

