"use client"

import { useState } from "react"
import { 
  TrendingUp, TrendingDown, IndianRupee, PieChart as PieChartIcon, 
  Target, Clock, Users, Building2, BarChart2, Filter
} from "lucide-react"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Legend, PieChart, Pie, Cell, BarChart, Bar
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// --- Mock Data ---

const revenueData = [
  { name: 'Jan', revenue: 45, target: 50 },
  { name: 'Feb', revenue: 52, target: 50 },
  { name: 'Mar', revenue: 38, target: 55 },
  { name: 'Apr', revenue: 65, target: 55 },
  { name: 'May', revenue: 78, target: 60 },
  { name: 'Jun', revenue: 85, target: 60 },
  { name: 'Jul', revenue: 72, target: 65 },
  { name: 'Aug', revenue: 90, target: 70 },
  { name: 'Sep', revenue: 105, target: 75 },
  { name: 'Oct', revenue: 95, target: 80 },
  { name: 'Nov', revenue: 110, target: 85 },
  { name: 'Dec', revenue: 125, target: 90 },
]

const sourceData = [
  { name: 'Meta Ads', value: 40, color: '#0066FF' },
  { name: 'Google Ads', value: 30, color: '#10B981' },
  { name: '99acres', value: 20, color: '#F59E0B' },
  { name: 'Direct', value: 10, color: '#64748B' },
]

const brokerData = [
  { name: 'Amit M', conversions: 45, target: 40, achievement: 112 },
  { name: 'Neha G', conversions: 38, target: 40, achievement: 95 },
  { name: 'Demo M', conversions: 22, target: 30, achievement: 73 },
  { name: 'Raj S', conversions: 50, target: 45, achievement: 111 },
]

const funnelData = [
  { stage: 'Total Leads', count: 284, color: 'bg-blue-500', width: '100%' },
  { stage: 'Contacted', count: 198, color: 'bg-indigo-500', width: '70%' },
  { stage: 'Site Visits', count: 89, color: 'bg-purple-500', width: '45%' },
  { stage: 'Negotiation', count: 42, color: 'bg-orange-500', width: '25%' },
  { stage: 'Converted', count: 23, color: 'bg-green-500', width: '15%' },
]

const heatmapData = Array.from({ length: 4 }, (_, weekIndex) => 
  Array.from({ length: 7 }, (_, dayIndex) => {
    // Generate some random counts favoring middle of the week
    const baseCount = dayIndex > 0 && dayIndex < 6 ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 4);
    return baseCount;
  })
);

const propertiesTableData = [
  { name: 'Tower A - 3BHK', type: '3BHK', price: '₹75L', inquiries: 145, visits: 42, conversions: 8, revenue: '₹6.0Cr' },
  { name: 'Villas - 4BHK', type: '4BHK', price: '₹1.8Cr', inquiries: 89, visits: 24, conversions: 4, revenue: '₹7.2Cr' },
  { name: 'Tower B - 2BHK', type: '2BHK', price: '₹46L', inquiries: 210, visits: 56, conversions: 12, revenue: '₹5.5Cr' },
  { name: 'Tower A - 2BHK', type: '2BHK', price: '₹45L', inquiries: 185, visits: 48, conversions: 10, revenue: '₹4.5Cr' },
  { name: 'Tower B - 1BHK', type: '1BHK', price: '₹28L', inquiries: 120, visits: 35, conversions: 6, revenue: '₹1.6Cr' },
]

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("month")

  // Custom Bar for Broker Chart to show dynamic colors
  const CustomBar = (props: any) => {
    const { fill, x, y, width, height, payload } = props;
    const color = payload.achievement > 100 ? '#10B981' : payload.achievement >= 80 ? '#3B82F6' : '#F59E0B';
    return <rect x={x} y={y} width={width} height={height} fill={color} rx={4} ry={4} />;
  };

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* SECTION 1 - HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Sales Analytics</h1>
          <p className="text-[#64748B] text-sm mt-1">Deep dive into revenue, conversions, and performance</p>
        </div>
        
        <Tabs value={dateRange} onValueChange={setDateRange}>
          <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-11">
            <TabsTrigger value="week" className="rounded-[8px] px-4 text-[12px] font-bold">This Week</TabsTrigger>
            <TabsTrigger value="month" className="rounded-[8px] px-4 text-[12px] font-bold">This Month</TabsTrigger>
            <TabsTrigger value="quarter" className="rounded-[8px] px-4 text-[12px] font-bold">This Quarter</TabsTrigger>
            <TabsTrigger value="year" className="rounded-[8px] px-4 text-[12px] font-bold">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* SECTION 2 - KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Total Revenue", value: "₹8.4Cr", trend: "+12.5%", isUp: true, icon: IndianRupee, color: "text-[#0066FF]", bg: "bg-blue-50" },
          { label: "Avg Deal Size", value: "₹36.5L", trend: "+2.4%", isUp: true, icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Conversion Rate", value: "8.1%", trend: "-0.5%", isUp: false, icon: PieChartIcon, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Avg Sales Cycle", value: "23 days", trend: "-2 days", isUp: true, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Top Channel", value: "Meta (40%)", trend: "Consistent", isUp: true, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
          { label: "MoM Growth", value: "+23%", trend: "+5% prev", isUp: true, icon: TrendingUp, color: "text-cyan-500", bg: "bg-cyan-50" },
        ].map((kpi, i) => (
          <Card key={i} className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] hover:-translate-y-0.5 transition-transform">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-[8px] ${kpi.bg}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] ${kpi.isUp ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                  {kpi.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.trend}
                </div>
              </div>
              <h3 className="text-[22px] font-bold text-[#0F172A] leading-tight">{kpi.value}</h3>
              <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SECTION 3 - CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Monthly Revenue Trend</h3>
              <p className="text-[12px] text-[#64748B]">Actual vs Target (in Lakhs)</p>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(value) => `₹${value}L`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                    cursor={{ stroke: '#E8ECF0', strokeWidth: 2 }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0066FF" strokeWidth={3} dot={{ r: 4, fill: '#0066FF', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Lead Source Distribution</h3>
              <p className="text-[12px] text-[#64748B]">Breakdown by marketing channel</p>
            </div>
          </div>
          <CardContent className="p-6 flex items-center justify-center">
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    itemStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}
                    formatter={(value) => [`${value}%`, 'Share']}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ fontSize: '13px', fontWeight: 500 }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[2px] pr-[120px]">
                <span className="text-[28px] font-bold text-[#0F172A] leading-none">284</span>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-1">Total Leads</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 4 - CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Broker Performance</h3>
              <p className="text-[12px] text-[#64748B]">Conversions vs Targets</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-[#64748B]">
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> &gt;100%</div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" /> 80-100%</div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> &lt;80%</div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brokerData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    cursor={{ fill: '#F8FAFC' }}
                  />
                  <Bar dataKey="conversions" name="Conversions" shape={<CustomBar />} />
                  <Bar dataKey="target" name="Target" fill="#E2E8F0" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Chart */}
        <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-[#0F172A] text-[16px]">Conversion Pipeline</h3>
            <p className="text-[12px] text-[#64748B]">Leads moving through stages</p>
          </div>
          <CardContent className="p-6 px-10">
            <div className="h-[280px] w-full flex flex-col justify-center gap-[6px]">
              {funnelData.map((stage, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`h-11 ${stage.color} flex items-center justify-between px-4 text-white rounded-[6px] shadow-sm transition-all duration-300 hover:opacity-90 cursor-pointer`}
                    style={{ width: stage.width }}
                  >
                    <span className="text-[12px] font-bold tracking-wide">{stage.stage}</span>
                    <span className="text-[14px] font-bold">{stage.count}</span>
                  </div>
                  {i < funnelData.length - 1 && (
                    <div className="h-4 w-px bg-gray-200 my-0.5" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 5 - HEATMAP */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[#0F172A] text-[16px]">Weekly Lead Activity</h3>
            <p className="text-[12px] text-[#64748B]">Inquiry volume heat distribution</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#64748B]">
            <span>Low</span>
            <div className="w-3 h-3 rounded-[2px] bg-slate-100" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-100" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-300" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-500" />
            <div className="w-3 h-3 rounded-[2px] bg-blue-700" />
            <span>High</span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Header Days */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day, i) => (
                  <div key={i} className="text-center text-[12px] font-bold text-[#64748B] uppercase tracking-wider pb-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grid Cells */}
              <div className="space-y-2">
                {heatmapData.map((week, weekIdx) => (
                  <div key={`week-${weekIdx}`} className="grid grid-cols-7 gap-2">
                    {week.map((count, dayIdx) => {
                      let bgColor = 'bg-slate-100 text-slate-400';
                      if (count > 0 && count <= 3) bgColor = 'bg-blue-100 text-blue-600';
                      else if (count > 3 && count <= 6) bgColor = 'bg-blue-300 text-blue-800';
                      else if (count > 6 && count <= 9) bgColor = 'bg-blue-500 text-white';
                      else if (count > 9) bgColor = 'bg-blue-700 text-white';
                      
                      return (
                        <div 
                          key={`day-${dayIdx}`} 
                          className={`aspect-[3/1] ${bgColor} rounded-[8px] flex items-center justify-center font-bold text-[14px] shadow-sm transition-transform hover:scale-[1.02] cursor-pointer cursor-help`}
                          title={`${count} activities`}
                        >
                          {count}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 6 - TOP PROPERTIES TABLE */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
          <div>
            <h3 className="font-bold text-[#0F172A] text-[16px]">Top Performing Configurations</h3>
          </div>
          <Button variant="outline" className="h-8 rounded-[8px] border-gray-200 text-[#0F172A] text-[12px] font-semibold bg-white">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white border-b border-gray-100">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] py-4 pl-6">Property Name</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Type</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-right">Avg Price</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Inquiries</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Site Visits</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Conversions</TableHead>
                <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-right pr-6">Revenue Gen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propertiesTableData.map((prop, index) => (
                <TableRow key={index} className="hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-50">
                  <TableCell className="pl-6 py-4">
                    <div className="font-bold text-[#0F172A] text-[14px] flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {prop.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] rounded-[6px] border-gray-200 bg-[#F8FAFC] font-bold">{prop.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-[#0F172A]">{prop.price}</TableCell>
                  <TableCell className="text-center text-[#64748B] font-medium">{prop.inquiries}</TableCell>
                  <TableCell className="text-center text-[#64748B] font-medium">{prop.visits}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-emerald-100 text-emerald-700 shadow-none hover:bg-emerald-100 font-bold px-2 py-0.5">{prop.conversions}</Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 font-bold text-[#0066FF]">{prop.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

    </div>
  )
}
