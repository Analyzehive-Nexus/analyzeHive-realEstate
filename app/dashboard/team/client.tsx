"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";


import { Users, UserPlus, FileCheck, CheckCircle2, TrendingUp, Medal, Star, Download } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"
import { EmptyState } from "@/components/ui/empty-state";
const SectionHeading = ({ title, onExport }: { title: string, onExport?: () => void }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
    {onExport && (
      <Button variant="ghost" onClick={onExport} className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 px-3 text-[13px] gap-2">
        <Download className="w-4 h-4" /> Export Data
      </Button>
    )}
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

export default function TeamClient({ salesTeam, constTeam }: { salesTeam: any[], constTeam: any[] }) {

  const exportSalesCSV = () => {
    const rows = salesTeam.map((b) => [b.name, b.metrics.conv, b.metrics.rev, b.ach]);
    const csv = [["Broker", "Conversions", "Revenue", "Rating"], ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_team.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportConstCSV = () => {
    const rows = constTeam.map((b) => [b.name, b.metrics.tasks, b.metrics.onTime, b.ach]);
    const csv = [["Member", "Reports", "Avg Rating", "Status"], ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `construction_team.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Team Performance</h1>
        <p className="text-slate-500 font-medium mt-1">Cross-functional team metrics, leaderboards, and HR overviews.</p>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <div className="border-b border-[#E8ECF0] mb-8">
          <TabsList className="bg-transparent h-auto p-0 flex space-x-6 justify-start">
            <TabsTrigger 
              value="sales" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0066FF] data-[state=active]:text-[#0066FF] data-[state=active]:shadow-none data-[state=active]:bg-transparent px-2 pb-3 pt-0 text-[15px] font-bold text-slate-500"
            >
              Sales Team
            </TabsTrigger>
            <TabsTrigger 
              value="construction" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F59E0B] data-[state=active]:text-[#F59E0B] data-[state=active]:shadow-none data-[state=active]:bg-transparent px-2 pb-3 pt-0 text-[15px] font-bold text-slate-500"
            >
              Construction Team
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ======================= SALES TEAM VIEW ======================= */}
        <TabsContent value="sales" className="space-y-10 focus-visible:outline-none mt-0">
          
          <section className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 flex flex-col">
              <SectionHeading title="Team Target Progress" />
              <PearlCard className="flex-1 p-6 flex flex-col justify-between">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <p className="font-bold text-[#0F172A]">Team Revenue Target</p>
                       <span className="font-extrabold text-[24px] text-[#0F172A]">115%</span>
                    </div>
                    <Progress value={115} className="h-2.5 mb-2 bg-blue-100 [&>div]:bg-[#0066FF]" />
                    <p className="text-[12px] font-medium text-slate-500">
                      Target achieved for the month
                   </p>
                 </div>

                 <div className="mt-8 pt-6 border-t border-[#E8ECF0]">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Team Composition</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-600">Total Members</span>
                      <span className="font-bold text-[#0F172A]">{salesTeam.length}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-600">Top Performers</span>
                      <span className="font-bold text-[#10B981]">{salesTeam.filter(s => parseInt(s.ach)>=100).length}</span>
                    </div>
                 </div>
              </PearlCard>
            </div>

            <div className="lg:col-span-3">
              <SectionHeading title="Top Individuals" />
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                 {salesTeam.slice(0, 4).map((member, i) => (
                    <InteractivePearlCard key={i} className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${member.avatarColor}`}>
                            {member.name.charAt(0)}
                         </div>
                         <Badge className={`${
                           member.ach === 'Excellent' || parseInt(member.ach) >= 120 ? 'bg-[#10B981] text-white hover:bg-[#10B981]' : 
                           member.ach === 'Good' || member.ach === 'Very Good' || parseInt(member.ach) >= 100 ? 'bg-blue-500 text-white hover:bg-blue-500' : 'bg-amber-500 text-white hover:bg-amber-500'
                         } border-none font-bold px-2 py-0`}>
                            {member.ach} Target
                         </Badge>
                      </div>
                      <div>
                         <h3 className="font-bold text-[16px] text-[#0F172A]">{member.name}</h3>
                         <p className="text-[12px] font-medium text-slate-500">{member.role}</p>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-end border-t border-[#E8ECF0] pt-4">
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
                            <p className="font-bold text-[18px] text-[#0F172A]">{member.metrics.rev}</p>
                         </div>
                         <div className="w-[60px] h-[30px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={member.trend}>
                                 <YAxis domain={['auto', 'auto']} hide />
                                 <Line type="monotone" dataKey="v" stroke="#0066FF" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                         </div>
                      </div>
                    </InteractivePearlCard>
                 ))}
                 {salesTeam.length === 0 && <div className="col-span-4 text-center py-10 text-slate-500">No sales team data available.</div>}
              </div>
            </div>
          </section>

          <section className="grid xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 flex flex-col">
              <SectionHeading title="Full Leaderboard" onExport={exportSalesCSV} />
              <PearlCard className="flex-1">
                 <ResponsiveTable>
<Table>
                   <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                     <TableRow className="hover:bg-transparent border-none">
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6 w-[80px]">Rank</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Name</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Conversions</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Revenue</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-right pr-6">Rating/Tgt</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {salesTeam.map((m, i) => (
                       <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                         <TableCell className="py-4 pl-6 text-xl text-slate-300">
                           {m.rank === 1 ? <Medal className="w-5 h-5 text-yellow-500" /> : 
                            m.rank === 2 ? <Medal className="w-5 h-5 text-slate-400" /> : 
                            m.rank === 3 ? <Medal className="w-5 h-5 text-amber-600" /> : 
                            <span className="font-bold text-[14px] ml-1 text-slate-400">{m.rank}</span>}
                         </TableCell>
                         <TableCell className="font-bold text-[#0F172A]">{m.name}</TableCell>
                         <TableCell className="font-medium text-slate-600">{m.metrics.conv}</TableCell>
                         <TableCell className="font-semibold text-[#0F172A]">{m.metrics.rev}</TableCell>
                         <TableCell className="text-right pr-6">
                            <span className="font-bold text-[13px] text-[#0066FF]">{m.ach}</span>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
</ResponsiveTable>
              </PearlCard>
            </div>

            <div className="flex flex-col">
              <SectionHeading title="HR & Operations Overview" />
              <div className="grid gap-4 flex-1">
                 {/* Static HR Metrics for now */}
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-blue-100`}>
                       <Users className="w-5 h-5 text-blue-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Overall Attendance</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">94.5%</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-emerald-100`}>
                       <CheckCircle2 className="w-5 h-5 text-emerald-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Employee Retention</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">92.0%</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-purple-100`}>
                       <UserPlus className="w-5 h-5 text-purple-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">New Hires (Mar)</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">12</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-amber-100`}>
                       <FileCheck className="w-5 h-5 text-amber-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Open Roles</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">5</h3>
                    </div>
                 </PearlCard>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* ======================= CONSTRUCTION TEAM VIEW ======================= */}
        <TabsContent value="construction" className="space-y-10 focus-visible:outline-none mt-0">
          
          <section className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 flex flex-col">
              <SectionHeading title="Team Target Progress" />
              <PearlCard className="flex-1 p-6 flex flex-col justify-between">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <p className="font-bold text-[#0F172A]">Team Task Goal</p>
                       <span className="font-extrabold text-[24px] text-[#0F172A]">92%</span>
                    </div>
                    <Progress value={92} className="h-2.5 mb-2 bg-orange-100 [&>div]:bg-[#F59E0B]" />
                    <p className="text-[12px] font-medium text-slate-500">
                      Overall schedule compliance
                   </p>
                 </div>

                 <div className="mt-8 pt-6 border-t border-[#E8ECF0]">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Team Composition</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-600">Total Members</span>
                      <span className="font-bold text-[#0F172A]">{constTeam.length}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-600">Top Performers</span>
                      <span className="font-bold text-[#10B981]">{constTeam.filter(s => s.ach==='Excellent'||s.ach==='Good').length}</span>
                    </div>
                 </div>
              </PearlCard>
            </div>

            <div className="lg:col-span-3">
              <SectionHeading title="Top Individuals" />
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                 {constTeam.slice(0, 4).map((member, i) => (
                    <InteractivePearlCard key={i} className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${member.avatarColor}`}>
                            {member.name.charAt(0)}
                         </div>
                         <Badge className={`${
                           member.ach === 'Excellent' || parseInt(member.ach) >= 120 ? 'bg-[#10B981] text-white hover:bg-[#10B981]' : 
                           member.ach === 'Good' || member.ach === 'Very Good' || parseInt(member.ach) >= 100 ? 'bg-blue-500 text-white hover:bg-blue-500' : 'bg-amber-500 text-white hover:bg-amber-500'
                         } border-none font-bold px-2 py-0`}>
                            {member.ach}
                         </Badge>
                      </div>
                      <div>
                         <h3 className="font-bold text-[16px] text-[#0F172A]">{member.name}</h3>
                         <p className="text-[12px] font-medium text-slate-500">{member.role}</p>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-end border-t border-[#E8ECF0] pt-4">
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports</p>
                            <p className="font-bold text-[18px] text-[#0F172A]">{member.metrics.tasks}</p>
                         </div>
                         <div className="w-[60px] h-[30px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={member.trend}>
                                 <YAxis domain={['auto', 'auto']} hide />
                                 <Line type="monotone" dataKey="v" stroke="#F59E0B" strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                         </div>
                      </div>
                    </InteractivePearlCard>
                 ))}
                 {constTeam.length === 0 && <div className="col-span-4 text-center py-10 text-slate-500">No construction reports data available.</div>}
              </div>
            </div>
          </section>

          <section className="grid xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 flex flex-col">
              <SectionHeading title="Full Leaderboard" onExport={exportConstCSV} />
              <PearlCard className="flex-1">
                 <ResponsiveTable>
<Table>
                   <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                     <TableRow className="hover:bg-transparent border-none">
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase py-4 pl-6 w-[80px]">Rank</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Name</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Reports</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase">Avg Rating</TableHead>
                       <TableHead className="text-xs font-semibold text-[#64748B] uppercase text-right pr-6">Status</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {constTeam.map((m, i) => (
                       <TableRow key={i} className="hover:bg-slate-50 border-b border-[#E8ECF0]/60">
                         <TableCell className="py-4 pl-6 text-xl text-slate-300">
                           {m.rank === 1 ? <Medal className="w-5 h-5 text-yellow-500" /> : 
                            m.rank === 2 ? <Medal className="w-5 h-5 text-slate-400" /> : 
                            m.rank === 3 ? <Medal className="w-5 h-5 text-amber-600" /> : 
                            <span className="font-bold text-[14px] ml-1 text-slate-400">{m.rank}</span>}
                         </TableCell>
                         <TableCell className="font-bold text-[#0F172A]">{m.name}</TableCell>
                         <TableCell className="font-medium text-slate-600">{m.metrics.tasks}</TableCell>
                         <TableCell className="font-semibold text-[#0F172A]">{m.metrics.onTime}</TableCell>
                         <TableCell className="text-right pr-6">
                            <span className="font-bold text-[13px] text-[#F59E0B]">{m.ach}</span>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
</ResponsiveTable>
              </PearlCard>
            </div>

            <div className="flex flex-col">
              <SectionHeading title="HR & Operations Overview" />
              <div className="grid gap-4 flex-1">
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-blue-100`}>
                       <Users className="w-5 h-5 text-blue-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Overall Attendance</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">94.5%</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-emerald-100`}>
                       <CheckCircle2 className="w-5 h-5 text-emerald-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Employee Retention</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">92.0%</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-purple-100`}>
                       <UserPlus className="w-5 h-5 text-purple-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">New Hires (Mar)</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">12</h3>
                    </div>
                 </PearlCard>
                 <PearlCard className="flex items-center p-5 gap-5">
                    <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center bg-amber-100`}>
                       <FileCheck className="w-5 h-5 text-amber-600"/>
                    </div>
                    <div>
                       <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Open Roles</p>
                       <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">5</h3>
                    </div>
                 </PearlCard>
              </div>
            </div>
          </section>

        </TabsContent>

      </Tabs>

    </div>
  )
}
