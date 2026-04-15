"use client"

import { useState } from "react"
import { 
  TrendingUp, AlertTriangle, ArrowUpRight, BarChart3, 
  Calendar, Building2, Target, CheckCircle2
} from "lucide-react"
import { 
  ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// --- Mock Data ---

const forecastData = [
  { name: 'Jan', actual: 45, projected: 45, pipeline: 0 },
  { name: 'Feb', actual: 52, projected: 52, pipeline: 0 },
  { name: 'Mar', actual: 38, projected: 40, pipeline: 15 },
  { name: 'Apr', actual: 0, projected: 65, pipeline: 45 },
  { name: 'May', actual: 0, projected: 78, pipeline: 60 },
  { name: 'Jun', actual: 0, projected: 85, pipeline: 80 },
  { name: 'Jul', actual: 0, projected: 72, pipeline: 90 },
  { name: 'Aug', actual: 0, projected: 90, pipeline: 110 },
  { name: 'Sep', actual: 0, projected: 105, pipeline: 140 },
  { name: 'Oct', actual: 0, projected: 95, pipeline: 160 },
  { name: 'Nov', actual: 0, projected: 110, pipeline: 180 },
  { name: 'Dec', actual: 0, projected: 125, pipeline: 210 },
]

const projectForecastData = [
  { name: 'Tower A', units: 14, potential: '₹8.4Cr', expected: 'Q2 2026', probability: 75 },
  { name: 'Tower B', units: 22, potential: '₹12.5Cr', expected: 'Q3 2026', probability: 60 },
  { name: 'Villas', units: 6, potential: '₹9.8Cr', expected: 'Q4 2026', probability: 45 },
  { name: 'Commercial Phase 1', units: 10, potential: '₹15.0Cr', expected: 'Q1 2027', probability: 30 },
]

const pipelineStages = [
  { name: 'Awareness / New', count: 124, value: '₹42.5Cr', percentage: 100, color: 'bg-blue-200' },
  { name: 'Contacted / Engaged', count: 86, value: '₹28.4Cr', percentage: 70, color: 'bg-blue-400' },
  { name: 'Site Visit', count: 42, value: '₹15.2Cr', percentage: 45, color: 'bg-indigo-500' },
  { name: 'Negotiation', count: 18, value: '₹7.8Cr', percentage: 25, color: 'bg-purple-600' },
  { name: 'Closing', count: 6, value: '₹3.2Cr', percentage: 10, color: 'bg-emerald-500' },
]

export default function ForecastPage() {
  const [viewState, setViewState] = useState("monthly")

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* SECTION 1 - HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Revenue Forecast</h1>
          <p className="text-[#64748B] text-sm mt-1">Predictive analysis and pipeline health monitor</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Projected Annual", value: "₹13.58Cr", icon: Target, color: "text-[#0066FF]", bg: "bg-blue-50" },
            { label: "Confirmed Pipeline", value: "₹9.45Cr", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "At Risk Revenue", value: "₹2.10Cr", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
            { label: "Upside Potential", value: "₹4.13Cr", icon: ArrowUpRight, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((kpi, i) => (
            <Card key={i} className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden group hover:border-[#CBD5E1] transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-[12px] ${kpi.bg}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-[32px] font-bold text-[#0F172A] leading-none mb-1">{kpi.value}</h3>
                  <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 2 - COMPOSED CHART */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-[#0F172A] text-[18px]">Revenue Trajectory</h3>
            <p className="text-[12px] text-[#64748B]">Actuals vs Projections vs Pipeline coverage (in Lakhs)</p>
          </div>
          <Tabs value={viewState} onValueChange={setViewState}>
            <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-10">
              <TabsTrigger value="monthly" className="rounded-[8px] px-4 text-[12px] font-bold">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly" className="rounded-[8px] px-4 text-[12px] font-bold">Quarterly</TabsTrigger>
              <TabsTrigger value="annual" className="rounded-[8px] px-4 text-[12px] font-bold">Annual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardContent className="p-6">
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(value) => `₹${value}L`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  cursor={{ fill: '#F8FAFC' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
                
                <Area type="monotone" dataKey="projected" name="Projected Trajectory" fill="url(#colorProjected)" stroke="#0066FF" strokeWidth={2} strokeDasharray="5 5" />
                <Bar dataKey="actual" name="Actual Closed" barSize={32} fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pipeline" name="Weighted Pipeline" barSize={32} fill="#CBD5E1" radius={[4, 4, 0, 0]} stackId="a" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3 - TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col (2/3) - Project Wise Table */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A] text-[16px] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0066FF]" /> Project-wise Forecast
              </h3>
            </div>
            <div className="overflow-x-auto flex-1 p-0">
              <Table>
                <TableHeader className="bg-white border-b border-gray-100">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] py-4 pl-6">Project Area</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Units Left</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-right">Potential Revenue</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-center">Expected Close</TableHead>
                    <TableHead className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] text-right pr-6">Win Probability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectForecastData.map((proj, idx) => (
                    <TableRow key={idx} className="hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-50">
                      <TableCell className="pl-6 py-4">
                        <span className="font-bold text-[#0F172A] text-[14px]">{proj.name}</span>
                      </TableCell>
                      <TableCell className="text-center font-medium text-[#64748B]">{proj.units}</TableCell>
                      <TableCell className="text-right font-bold text-[#0066FF] text-[14px]">{proj.potential}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[10px] rounded-[6px] border-gray-200 bg-[#F8FAFC] font-bold text-gray-600">{proj.expected}</Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-[13px] font-bold text-[#0F172A]">{proj.probability}%</span>
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${proj.probability > 70 ? 'bg-emerald-500' : proj.probability > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                              style={{ width: `${proj.probability}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Right Col (1/3) - Pipeline Stages */}
        <div className="space-y-6">
          <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] h-full flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-[#0F172A] text-[16px] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" /> Pipeline by Stage
              </h3>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col justify-center">
              <div className="space-y-6">
                {pipelineStages.map((stage, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[13px] font-bold text-[#0F172A]">{stage.name}</p>
                        <p className="text-[11px] font-semibold text-[#64748B]">{stage.count} active deals</p>
                      </div>
                      <p className="text-[14px] font-bold text-[#0066FF]">{stage.value}</p>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stage.color} rounded-full transition-all duration-1000 ease-out`} 
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 4 - ASSUMPTIONS & NOTES */}
      <Card className="bg-gradient-to-br from-[#F8FAFC] to-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-[#0F172A] text-[16px]">Methodology & Assumptions</h3>
              <p className="text-[12px] text-[#64748B]">Basis for the current projection model</p>
            </div>
            <Button variant="outline" className="h-8 rounded-[8px] bg-white border-gray-200 text-[#0F172A] font-semibold text-[12px]">
              <Calendar className="w-3.5 h-3.5 mr-1.5" /> Update Forecast
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-[13px] font-medium text-[#64748B] list-disc pl-5">
              <li>Weighted pipeline applies historical conversion rates (8.1%) to current active deals.</li>
              <li>Expected close dates are based on median sales cycle length (23 days).</li>
            </ul>
            <ul className="space-y-2 text-[13px] font-medium text-[#64748B] list-disc pl-5">
              <li>Excludes verbal commitments until minimum token amount (₹1L) is received.</li>
              <li>Last model calibration: <span className="font-bold text-[#0F172A]">Mar 15, 2026</span>.</li>
            </ul>
          </div>
        </div>
      </Card>

    </div>
  )
}
