"use client"

import { 
  Package, ClipboardList, Truck, HardHat, AlertTriangle, Phone, Star, Camera, CheckCircle, XCircle 
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar,
  AreaChart, Area
} from "recharts"

// FORMAT HELPER
const formatCur = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
    <Button variant="ghost" className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 px-3 text-[13px]">View All</Button>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E8ECF0',
    }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#CBD5E1] transition-all duration-200 ${className}`}
    style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// Fallbacks since we don't fetch these explicitly from the backend in lib/data:
const photos = [
  { site: "Tower A - Floor 12 Slab Work", date: "Mar 18", color: "bg-blue-100" },
  { site: "Tower B - Column Casting", date: "Mar 18", color: "bg-orange-100" },
];

const budgetData = [
  { cat: "Civil Work", b: 8500000, s: 5230000, r: 3270000, pct: 62, status: "On Track" },
];

const progressChart = [
  { date: "Mar 12", TowerA: 55, TowerB: 30 },
];

const attendanceTrend = [
  { day: "Mon", count: 62 },
];


export default function ConstructionClient({
  inventoryItems,
  inventoryStats,
  demands,
  assets,
  assetsStats,
  attendance,
  attendanceStats,
  progress,
  vendors
}: {
  inventoryItems: any,
  inventoryStats: any,
  demands: any,
  assets: any,
  assetsStats: any,
  attendance: any,
  attendanceStats: any,
  progress: any,
  vendors: any
}) {

  const stockSummaryChart = [
    { name: "Good", value: inventoryStats?.good || 0, fill: "#10B981" },
    { name: "Low", value: inventoryStats?.low || 0, fill: "#F59E0B" },
    { name: "Critical", value: inventoryStats?.critical || 0, fill: "#EF4444" },
  ];

  // Derive labor table from 'attendance' list
  const laborCountByRole: any = {};
  (attendance || []).forEach((row: any) => {
    if (!laborCountByRole[row.role]) {
      laborCountByRole[row.role] = { present: 0, total: 0 };
    }
    laborCountByRole[row.role].total += 1;
    if (row.status === 'Present' || row.status === 'Half Day') {
      laborCountByRole[row.role].present += 1;
    }
  });

  const labourTable = Object.entries(laborCountByRole).map(([role, stats]: [string, any]) => ({
    role,
    present: stats.present,
    total: stats.total,
    pct: Math.round((stats.present / stats.total) * 100)
  }));

  const presentPercent = attendanceStats?.total ? Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0;

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* SECTION 1 - KPI CARDS */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-[#0066FF] to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <Package className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{inventoryStats?.total || 0}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Total Materials</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>
          
          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
                <ClipboardList className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{(demands || []).filter((d: any) => d.status === 'Pending').length}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Pending Approvals</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>

          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-green-500/30 shrink-0">
                <Truck className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{assetsStats?.active || 0}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Active Assets</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    {assetsStats?.maintenance || 0} maint.
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>

          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
                <HardHat className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{attendanceStats?.total || 0}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Workers Today</p>
                  </div>
                  <div className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    {presentPercent}% att.
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>
        </div>
      </section>

      {/* SECTION 2 - STOCK & MATERIAL TRACKING */}
      <section className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <SectionHeading title="Material Stock" />
          <PearlCard>
            <Table>
              <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Material Name</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Quantity</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Last Updated</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(inventoryItems || []).slice(0, 10).map((item: any, idx: number) => {
                  const status = item.current_stock_level > item.min_threshold * 2 ? 'Good' : item.current_stock_level > item.min_threshold ? 'Low' : 'Critical';
                  return (
                  <TableRow key={item.id || idx} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                    <TableCell>
                      <div className="font-bold text-sm text-[#0F172A]">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.category}</div>
                    </TableCell>
                    <TableCell className="font-medium text-[13px]">{item.current_stock_level} {item.unit_of_measurement}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full shadow-none text-[10px] font-bold uppercase tracking-wider ${
                        status === 'Good' ? 'bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/20' :
                        status === 'Low' ? 'bg-[#F59E0B]/15 text-[#D97706] hover:bg-[#F59E0B]/20' :
                        'bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/20'
                      }`}>
                        {status === 'Critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[12px] text-slate-500">{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-[6px]">Edit</Button>
                       <Button size="sm" className="h-7 text-[11px] rounded-[6px] bg-[#0066FF] hover:bg-[#0052CC] text-white">Restock</Button>
                    </TableCell>
                  </TableRow>
                )})}
                {(!inventoryItems || inventoryItems.length === 0) && (
                  <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">No materials found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </PearlCard>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="Stock Summary" />
          <PearlCard className="flex-1 flex flex-col p-6 items-center justify-center">
            <div className="h-[240px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockSummaryChart}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8 pointer-events-none">
                <span className="text-3xl font-bold text-[#0F172A]">{inventoryStats?.total || 0}</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Items</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
               <div className="bg-[#10B981]/10 rounded-xl p-3 flex flex-col items-center border border-[#10B981]/20">
                  <span className="text-xs text-[#10B981] font-bold uppercase">Good</span>
                  <span className="text-xl font-bold text-[#0F172A]">{inventoryStats?.good || 0}</span>
               </div>
               <div className="bg-[#F59E0B]/10 rounded-xl p-3 flex flex-col items-center border border-[#F59E0B]/20">
                  <span className="text-xs text-[#D97706] font-bold uppercase">Low</span>
                  <span className="text-xl font-bold text-[#0F172A]">{inventoryStats?.low || 0}</span>
               </div>
               <div className="bg-[#EF4444]/10 rounded-xl p-3 flex flex-col items-center border border-[#EF4444]/20">
                  <span className="text-xs text-[#EF4444] font-bold uppercase">Critical</span>
                  <span className="text-xl font-bold text-[#0F172A]">{inventoryStats?.critical || 0}</span>
               </div>
            </div>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 3 - DEMAND REQUEST APPROVAL FLOW */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Material Demand Requests</h2>
        </div>
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Request ID</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Requested By</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Material & Qty</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Project / Date</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(demands || []).map((req: any) => (
                <TableRow key={req.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                  <TableCell className="font-bold text-[13px] text-[#0066FF]">{req.id.substring(0,8)}</TableCell>
                  <TableCell className="font-medium text-[13px] text-[#0F172A]">{req.requested_by?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <div className="font-bold text-[13px] text-[#0F172A]">{req.item?.name || 'Unknown Item'}</div>
                    <div className="text-xs text-slate-500 font-semibold">{req.quantity_requested} {req.item?.unit_of_measurement || 'units'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[13px] text-[#0F172A]">{req.project_site}</div>
                    <div className="text-xs text-slate-500">{new Date(req.created_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell>
                    {req.status === 'Pending' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 rounded-full shadow-none text-[10px] uppercase">Pending</Badge>}
                    {req.status === 'Approved' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-full shadow-none text-[10px] uppercase border border-emerald-200"><CheckCircle className="w-3 h-3 mr-1"/>Apvd: {req.approved_by?.name || 'SYS'}</Badge>}
                    {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 rounded-full shadow-none text-[10px] uppercase border border-red-200"><XCircle className="w-3 h-3 mr-1"/>Rej: {req.approved_by?.name || 'SYS'}</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" className="h-7 text-[11px] rounded-[6px] bg-[#10B981] hover:bg-[#059669] text-white">✓ Approve</Button>
                        <Button size="sm" className="h-7 text-[11px] rounded-[6px] bg-[#EF4444] hover:bg-[#DC2626] text-white">✗ Reject</Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-[6px]">View Details</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!demands || demands.length === 0) && (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No demands found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

      {/* SECTION 4 - ASSET & EQUIPMENT TRACKER */}
      <section>
        <SectionHeading title="Active Engineering Assets" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(assets || []).slice(0, 8).map((ast: any, i: number) => {
             const statColor = ast.status === 'Active' ? 'bg-[#10B981]' : ast.status === 'Maintenance' ? 'bg-[#F59E0B]' : 'bg-slate-400'
             return (
            <InteractivePearlCard key={ast.id || i} className="relative group">
              <div className={`h-1.5 w-full ${statColor} absolute top-0 left-0 right-0`} />
              <CardContent className="p-6 pt-7">
                 <div className="flex justify-between items-start mb-4">
                   <div className={`h-12 w-12 rounded-[12px] flex items-center justify-center ${ast.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Truck className="h-6 w-6" />
                   </div>
                   <Badge variant="outline" className="text-[10px] rounded-full uppercase font-bold text-slate-500 bg-slate-50 border-slate-200">{ast.category}</Badge>
                 </div>
                 <h3 className="text-lg font-bold text-[#0F172A] leading-tight mb-1">{ast.name}</h3>
                 <p className="text-xs text-slate-400 font-mono mb-4">{ast.id.substring(0,8)}</p>
                 <div className="flex justify-between items-end border-t border-[#E8ECF0] pt-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Location</p>
                      <p className="text-[13px] font-semibold text-[#0F172A]">{ast.location || 'Unknown'}</p>
                    </div>
                    <Badge className={`shadow-none text-[9px] uppercase font-bold ${statColor} text-white`}>{ast.status || 'Unknown'}</Badge>
                 </div>
              </CardContent>
            </InteractivePearlCard>
          )})}
          {(!assets || assets.length === 0) && <div className="col-span-4 text-center py-10 text-gray-500">No assets found</div>}
        </div>
      </section>

      {/* SECTION 5 - DAILY PROGRESS REPORTS */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Daily Progress Reports" />
          <PearlCard className="flex-1">
            <div className="divide-y divide-[#E8ECF0]">
              {(progress || []).slice(0, 4).map((r: any, i: number) => {
                const dateObj = new Date(r.date);
                const dM = dateObj.toLocaleString('en-US', {month: 'short'});
                const dD = dateObj.getDate();
                return (
                <div key={r.id || i} className="p-5 hover:bg-blue-50/30 transition-colors flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="bg-slate-100 rounded-[10px] w-14 h-14 flex flex-col items-center justify-center border border-slate-200 shrink-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{dM}</span>
                      <span className="text-lg font-bold text-[#0F172A]">{dD}</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-[#0F172A] text-[15px]">{r.project_site}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="bg-blue-100 text-[#0066FF] text-[10px] px-2 py-0.5 rounded-full font-bold">{r.completion_pct}% Done</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1"><HardHat className="w-3 h-3"/> {r.workers_present} wkrs</span>
                        <span className="text-xs text-slate-500">{r.weather_conditions}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs text-slate-500 font-medium mb-1.5">{r.submitted_by_user?.name || 'Unknown'}</span>
                    <span className="text-[11px] font-bold text-[#0066FF] cursor-pointer hover:underline">View Full Report</span>
                  </div>
                </div>
              )})}
              {(!progress || progress.length === 0) && <div className="p-10 text-center text-gray-500">No progress reports</div>}
            </div>
          </PearlCard>
        </div>
        
        <div className="flex flex-col">
          <SectionHeading title="7-Day Completion Velocity" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={progressChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val)=>`${val}%`} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }} />
                <Bar dataKey="TowerA" name="Tower A" fill="#0066FF" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="TowerB" name="Tower B" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 6 - LABOUR ATTENDANCE */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Today's Labour Attendance" />
          <PearlCard className="flex-1 p-6 flex items-center gap-8">
            <div className="relative h-40 w-40 shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: presentPercent, fill: '#6366F1' }]} startAngle={90} endAngle={-270}>
                    <RadialBar background={{ fill: '#E8ECF0' }} dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#0F172A]">{presentPercent}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Present</span>
               </div>
            </div>
            <div className="flex-1">
              <Table>
                <TableBody>
                  {labourTable.map((l: any, i: number) => (
                    <TableRow key={i} className="hover:bg-transparent border-b border-[#E8ECF0]/60">
                      <TableCell className="py-2.5 font-semibold text-[13px] text-[#0F172A]">{l.role}</TableCell>
                      <TableCell className="py-2.5 text-right font-medium text-[13px] text-slate-600">
                         {l.present} <span className="text-slate-400">/ {l.total}</span>
                      </TableCell>
                      <TableCell className="py-2.5 text-right w-[60px]">
                         <Badge variant="outline" className={`rounded-[6px] text-[10px] ${l.pct < 85 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>{l.pct}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {labourTable.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-4 text-gray-500">No attendance data</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="Weekly Labour Availability" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#0066FF" stopOpacity={0.15}/>
                     <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                 <Area type="monotone" dataKey="count" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" dot={{ r: 4, fill: '#0066FF', strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 7 - VENDORS & SUPPLIERS */}
      <section>
        <SectionHeading title="Active Vendor Relationships" />
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Vendor Name</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Category</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Outstanding</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Rating</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(vendors || []).map((v: any, i: number) => (
                <TableRow key={v.id || i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{v.name}</div>
                    <div className="font-medium text-[12px] text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3"/> {v.contact_phone || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[6px] text-[11px] font-semibold">{v.category || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>
                     <div className={`font-bold text-[14px] ${v.outstanding_balance > 50000 ? 'text-red-600' : 'text-[#0F172A]'}`}>₹{(v.outstanding_balance || 0).toLocaleString('en-IN')}</div>
                  </TableCell>
                  <TableCell>
                     <div className="flex text-amber-400 gap-0.5">
                       {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < (v.rating || 4) ? 'fill-current' : 'text-slate-200 fill-slate-200'}`} />
                       ))}
                     </div>
                  </TableCell>
                  <TableCell>
                     {v.status === 'Active' ? 
                       <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-full tracking-wider font-bold">Active</Badge> : 
                       <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 shadow-none text-[10px] uppercase rounded-full tracking-wider font-bold">{v.status || 'Pending'}</Badge>
                     }
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                     <Button variant="outline" size="icon" className="h-8 w-8 rounded-full text-slate-600 hover:text-[#0066FF] hover:border-[#0066FF]"><Phone className="w-3.5 h-3.5"/></Button>
                     <Button size="sm" className="h-8 text-[11px] rounded-[6px] font-semibold bg-white border border-[#E8ECF0] text-[#0F172A] hover:bg-slate-50 shadow-sm">New Order</Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!vendors || vendors.length === 0) && <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No vendors found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

      {/* SECTION 8 - SITE PHOTOS */}
      <section>
        <SectionHeading title="Recent Site Photos" />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {photos.map((p, i) => (
             <InteractivePearlCard key={i} className="p-0 border-none">
               <div className={`h-40 w-full ${p.color} relative flex items-center justify-center`}>
                 <Camera className="w-10 h-10 text-black/10" />
                 <Badge className="absolute top-3 left-3 bg-black/60 hover:bg-black/60 text-white border-none rounded-[6px] text-[10px] uppercase">{p.date}</Badge>
               </div>
               <div className="p-4 bg-white border-t border-[#E8ECF0]">
                  <h4 className="font-semibold text-[13px] text-[#0F172A] leading-tight group-hover:text-[#0066FF] transition-colors">{p.site}</h4>
               </div>
             </InteractivePearlCard>
          ))}
        </div>
      </section>

      {/* SECTION 9 - BUDGET VS ACTUAL SPENDING */}
      <section className="grid lg:grid-cols-2 gap-8 pb-10">
        <div className="flex flex-col">
          <SectionHeading title="Budget Allocation Tracker" />
          <PearlCard className="flex-1">
             <Table>
               <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                 <TableRow className="hover:bg-transparent border-none">
                   <TableHead className="text-xs text-[#64748B] uppercase py-3">Category Details</TableHead>
                   <TableHead className="text-xs text-[#64748B] uppercase py-3 text-right">Budget / Spent</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {budgetData.map((b, i) => (
                   <TableRow key={i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                     <TableCell className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-[14px] text-[#0F172A]">{b.cat}</span>
                          {b.status === 'On Track' ? 
                            <span className="text-[10px] font-bold text-[#10B981] uppercase bg-green-50 px-2 py-0.5 rounded-[4px] border border-green-200">On Track</span> : 
                            <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded-[4px] border border-red-200">At Risk</span>
                          }
                        </div>
                        <Progress value={b.pct} className={`h-1.5 ${b.pct > 80 ? 'bg-red-100 [&>div]:bg-red-500' : 'bg-blue-100 [&>div]:bg-[#0066FF]'}`} />
                     </TableCell>
                     <TableCell className="text-right py-4">
                        <div className="font-bold text-[14px] text-[#0F172A]">{formatCur(b.b)}</div>
                        <div className="text-[12px] font-semibold text-slate-500 mt-0.5">{formatCur(b.s)} spent <span className="text-slate-300 mx-1">|</span> {b.pct}%</div>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="Expenditure Analysis (Lakhs)" />
          <PearlCard className="flex-1 p-6">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={budgetData.map(d => ({ ...d, b: d.b/100000, s: d.s/100000 }))} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8ECF0" />
                <YAxis dataKey="cat" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={90} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val)=>`₹${val}L`} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} formatter={(val: number) => `₹${val.toFixed(1)}L`} />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }} />
                <Bar dataKey="b" name="Budgeted" fill="#0066FF" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="s" name="Spent" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </PearlCard>
        </div>
      </section>

    </div>
  )
}
