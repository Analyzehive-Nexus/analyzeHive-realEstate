"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp, TrendingDown, IndianRupee, PieChart as PieChartIcon,
  Target, Clock, Users, Building2, BarChart2, Filter, ChevronRight,
  TrendingUp as TrendUpIcon, ShieldAlert, Sparkles, HelpCircle, ArrowRight,
  Play, Pause, X, ShieldCheck, CheckCircle2, Loader2, Sparkle
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { SkeletonChart } from "@/components/ui/skeleton-chart";
import { useProject } from "@/lib/contexts/ProjectContext";
import { getAnalyticsData, Period, AnalyticsData } from "./actions";

// Premium dark glassmorphism tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A]/95 backdrop-blur-md border border-[#1E293B] p-3.5 rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.25)] text-white text-xs space-y-1.5 min-w-[150px]">
        <p className="font-bold text-[#64748B] uppercase tracking-wider text-[9px] border-b border-slate-800 pb-1 mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((pld: any, index: number) => {
            const val = typeof pld.value === 'number' ? pld.value : parseFloat(pld.value);
            const isCurrency = pld.name.toLowerCase().includes('revenue') || 
                             pld.name.toLowerCase().includes('target') || 
                             pld.name.toLowerCase().includes('deal') || 
                             pld.name.toLowerCase().includes('size');
                             
            const formattedVal = isCurrency
              ? (val >= 1e7 ? `₹${(val / 1e7).toFixed(2)}Cr` : val >= 1e5 ? `₹${(val / 1e5).toFixed(1)}L` : `₹${val.toLocaleString("en-IN")}`)
              : `${val}`;
            
            return (
              <div key={index} className="flex items-center justify-between gap-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pld.color || pld.fill }} />
                  <span className="text-[#94A3B8]">{pld.name}:</span>
                </div>
                <span className="font-bold text-white">{formattedVal}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { activeProject } = useProject();

  // Interactive Selection States
  const [selectedSource, setSelectedSource] = useState<string>("Meta");
  const [selectedConfig, setSelectedConfig] = useState<string>("3BHK");
  const [selectedStage, setSelectedStage] = useState<string>("New");
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalPlaybook, setModalPlaybook] = useState<any | null>(null);
  const [isApplyingOptimization, setIsApplyingOptimization] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!data) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      try {
        const result = await getAnalyticsData(period, activeProject?.id);
        setData(result);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
    fetchData();
  }, [period, activeProject]);

  const handleApplyOptimization = () => {
    setIsApplyingOptimization(true);
    setTimeout(() => {
      setIsApplyingOptimization(false);
      setOptimizationApplied(true);
      setTimeout(() => {
        setModalPlaybook(null);
        setOptimizationApplied(false);
      }, 1500);
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

  // Generate dynamic, real-time AI strategic insights from data aggregates
  const aiInsights = useMemo(() => {
    if (!data) return [];
    
    const { sourceDistribution, weeklyLeadActivity, topConfigurations, kpis } = data;
    
    const peakDayObj = weeklyLeadActivity.reduce((max, d) => {
      const sum = d.Morning + d.Afternoon + d.Evening + d.Night;
      return sum > max.sum ? { day: d.day, sum } : max;
    }, { day: "Wednesday", sum: 0 });

    const topConfigName = topConfigurations[0]?.name || "3BHK";
    const topConfigPerc = topConfigurations[0]?.percentage || 40;
    const topChanName = kpis.topChannel.split(" ")[0];

    return [
      {
        title: "Marketing Budget Reallocation Advisement",
        text: `${topChanName} Ads are leading lead acquisition at ${sourceDistribution.find(s => s.name === topChanName)?.value || 12} inquiries. Recommend reallocating 15% budget from other channels to ${topChanName} to leverage this peak velocity.`,
        type: "success",
        metric: "8.4x Conversion Target",
        playbook: {
          title: "Ad Spend Reallocation Campaign",
          impact: `Boosts overall lead acquisition rate by 18.5% with zero extra spend on ${topChanName} channels.`,
          steps: [
            "Audit active ad budgets across all secondary portals.",
            `Shift 15% budget from low-ROI channels specifically to the peak ${topChanName} campaign.`,
            "Optimize age and demographic targeting around local residential areas."
          ],
          btnText: "Approve Ad Shift"
        }
      },
      {
        title: "Sales Engagement Window",
        text: `Inquiry traffic peaks significantly on ${peakDayObj.day}s, specifically during the Evening slot. Ensure sales brokers are online and instant auto-replies are armed during this timeframe.`,
        type: "warning",
        metric: "Peak Day: " + peakDayObj.day,
        playbook: {
          title: "Sales Broker Alignment Campaign",
          impact: "Reduces response lag by 35% on peak days.",
          steps: [
            `Schedule 2 priority brokers for active backup duty on ${peakDayObj.day} Evenings.`,
            "Activate CRM instant automated brochure auto-responder triggers.",
            "Set priority Slack/SMS notifications for incoming evening leads."
          ],
          btnText: "Schedule Active Rosters"
        }
      },
      {
        title: "Inventory Pipeline Sizing Match",
        text: `${topConfigName} units account for ${topConfigPerc}% of total customer interest. We suggest launching the next listing block of ${topConfigName} layouts early to satisfy this demand.`,
        type: "info",
        metric: `${topConfigPerc}% Configuration Demand`,
        playbook: {
          title: "Inventory Allocation Boost",
          impact: "Locks in early premium buyer commitments for next listing phase.",
          steps: [
            `Draft early-bird brochure specific to ${topConfigName} layouts.`,
            "Pre-allocate next 6 Tower B floorplans to key VIP client inquiries.",
            "Initiate a drip email campaign to priority high-budget leads."
          ],
          btnText: "Release Early Inventory"
        }
      }
    ];
  }, [data]);

  // Autoplay effect for AI panel
  useEffect(() => {
    if (!isPlaying || aiInsights.length === 0) return;
    const interval = setInterval(() => {
      setActiveInsightIndex((prev) => (prev + 1) % aiInsights.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, aiInsights.length]);

  // Clickable Lead Source detailed audit mapping
  const sourceAudits: Record<string, { cpl: string, conversion: string, roas: string, alert: string, strategy: string }> = {
    Meta: {
      cpl: "₹1,240",
      conversion: "14.8%",
      roas: "8.4x",
      alert: "Excellent ROI. Leads show exceptionally high interest in premium 3BHK units.",
      strategy: "Recommend raising the Meta ad-set budget for Tower A units by 15% for the upcoming weekend."
    },
    Google: {
      cpl: "₹1,850",
      conversion: "11.2%",
      roas: "5.6x",
      alert: "Strong search intent, but higher acquisition cost. Leads are looking for key terms like 'ready to move'.",
      strategy: "Refine Google search keywords to negative-match 'cheap' and focus budgets on 'luxury residences'."
    },
    "99acres": {
      cpl: "₹2,100",
      conversion: "6.5%",
      roas: "3.2x",
      alert: "Generic portal queries. Lead qualification cycles take 12 days longer than social channels.",
      strategy: "Arm automated brochure download alerts on CRM to quicken portal lead velocity."
    },
    Direct: {
      cpl: "₹0 (Organic)",
      conversion: "22.4%",
      roas: "N/A",
      alert: "Unmatched lead quality. In-person walk-ins exhibit highly converted behaviors.",
      strategy: "Increase receptionist greetings and provide physical scale walkthroughs on first site visit."
    },
    Referral: {
      cpl: "₹45,000 commission",
      conversion: "31.0%",
      roas: "12.0x",
      alert: "Outstanding closing ratios. Residents and direct broker referrals show high conversions.",
      strategy: "Launch a referral bonus (e.g. ₹50k voucher) for existing residents who introduce new buyers."
    }
  };

  // Clickable Configuration detailed supply-demand audit mapping
  const configAudits: Record<string, { demand: string, budget: string, status: string, advice: string }> = {
    "1BHK": {
      demand: "Moderate Demand (12%)",
      budget: "₹45L - ₹60L",
      status: "Inventory Shortage",
      advice: "Only 2 units remaining. High velocity among young buyers. Raise remaining flat pricing by 3%."
    },
    "2BHK": {
      demand: "Strong Volume (28%)",
      budget: "₹75L - ₹95L",
      status: "Balanced Supply",
      advice: "14 units available. Top configurations requested by nuclear families. Regular follow-ups recommended."
    },
    "3BHK": {
      demand: "Peak Demand (42%)",
      budget: "₹1.2Cr - ₹1.5Cr",
      status: "High Demand Velocity",
      advice: "Priya Sharma has converted 5 deals here. Consider launching Tower B inventory early to capture spillover demand."
    },
    "4BHK": {
      demand: "Elite Segment (10%)",
      budget: "₹1.8Cr - ₹2.2Cr",
      status: "Sufficient Inventory",
      advice: "6 units left. Longer sales cycle. Suggest scheduling site tours with VIP private car transport."
    },
    Villa: {
      demand: "Exquisite Luxury (8%)",
      budget: "₹3.5Cr - ₹4.5Cr",
      status: "Very Limited Supply",
      advice: "Villas construction is 95% complete. High visual appeal. Send drone video footage in WhatsApp updates."
    },
    Unspecified: {
      demand: "General Inquiries",
      budget: "Variable",
      status: "N/A",
      advice: "Leads have not selected a specific size. Set up profiling calls to identify buyer budget sizes."
    }
  };

  // Clickable Funnel Stage detailed audit mapping
  const funnelAudits: Record<string, { avgTime: string, conversion: string, bottleneck: string, action: string }> = {
    New: {
      avgTime: "1.2 hours",
      conversion: "91.0%",
      bottleneck: "Awaiting initial broker call verification.",
      action: "Activate automated lead routing to assign incoming inquiries to active brokers within 15 minutes."
    },
    Contacted: {
      avgTime: "3.2 days",
      conversion: "64.5%",
      bottleneck: "Client scheduling conflicts for in-person walk-ins.",
      action: "Trigger automatic video tours and PDF price brochures via active WhatsApp integrations."
    },
    "Site Visit Scheduled": {
      avgTime: "5.6 days",
      conversion: "48.2%",
      bottleneck: "Brokers missing scheduled client visit check-ins.",
      action: "Arm automated SMS/Email reminders 2 hours prior to scheduled visitor walk-in times."
    },
    Negotiation: {
      avgTime: "12.4 days",
      conversion: "72.0%",
      bottleneck: "Discount approvals holding up ledger contract generation.",
      action: "Deploy standardized margin guidelines and authorize broker-level caps."
    },
    Converted: {
      avgTime: "Closed Won",
      conversion: "100%",
      bottleneck: "Post-conversion documentation onboarding delay.",
      action: "Onboard customer welcome sequence and assign transaction records to legal desk."
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48 rounded-[8px]" />
          <Skeleton className="h-10 w-64 rounded-[12px]" />
        </div>
        <div className="grid grid-cols-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  const { revenueTrend, sourceDistribution, brokerPerformance, funnelData, weeklyLeadActivity, topConfigurations, kpis } = data;

  // Custom rounded bar for broker chart
  const CustomBar = (props: any) => {
    const { fill, x, y, width, height, payload } = props;
    const color = payload.conversions >= payload.target ? "#10B981" : "#F59E0B";
    return <rect x={x} y={y} width={width} height={height} fill={color} rx={6} ry={6} />;
  };

  const kpiCards = [
    { 
      label: "Total Revenue", 
      value: formatCurrency(kpis.totalRevenue), 
      icon: IndianRupee, 
      color: "text-[#0066FF]", 
      bg: "bg-blue-50/50", 
      trend: kpis.momGrowth, 
      desc: "Revenue this period",
      glowColor: "rgba(0,102,255,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(0,102,255,0.16)]",
      borderColor: "border-l-[#0066FF]",
      progress: 85,
      progressBarColor: "bg-[#0066FF]"
    },
    { 
      label: "Avg Deal Size", 
      value: formatCurrency(kpis.avgDealSize), 
      icon: Target, 
      color: "text-purple-650 text-purple-600", 
      bg: "bg-purple-50/50", 
      trend: 2.4, 
      desc: "Avg size of won lead",
      glowColor: "rgba(168,85,247,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(168,85,247,0.16)]",
      borderColor: "border-l-purple-600",
      progress: 92,
      progressBarColor: "bg-purple-600"
    },
    { 
      label: "Conversion Rate", 
      value: `${kpis.conversionRate.toFixed(1)}%`, 
      icon: PieChartIcon, 
      color: "text-emerald-500", 
      bg: "bg-emerald-50/50", 
      trend: 1.2, 
      desc: "Leads converted to buyers",
      glowColor: "rgba(16,185,129,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(16,185,129,0.16)]",
      borderColor: "border-l-emerald-500",
      progress: 76,
      progressBarColor: "bg-emerald-500"
    },
    { 
      label: "Avg Sales Cycle", 
      value: `${kpis.avgSalesCycle} days`, 
      icon: Clock, 
      color: "text-amber-500", 
      bg: "bg-amber-50/50", 
      trend: -5.0, 
      desc: "Average time to close",
      glowColor: "rgba(245,158,11,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(245,158,11,0.16)]",
      borderColor: "border-l-amber-500",
      progress: 88,
      progressBarColor: "bg-amber-500"
    },
    { 
      label: "Top Channel", 
      value: kpis.topChannel.split(" ")[0], 
      icon: Users, 
      color: "text-indigo-500", 
      bg: "bg-indigo-50/50", 
      trend: 8.4, 
      desc: kpis.topChannel,
      glowColor: "rgba(99,102,241,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(99,102,241,0.16)]",
      borderColor: "border-l-indigo-500",
      progress: 90,
      progressBarColor: "bg-indigo-500"
    },
    { 
      label: "MoM Growth", 
      value: `${kpis.momGrowth.toFixed(1)}%`, 
      icon: TrendingUp, 
      color: "text-cyan-500", 
      bg: "bg-cyan-50/50", 
      trend: kpis.momGrowth, 
      desc: "MoM sales aggregate change",
      glowColor: "rgba(6,182,212,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(6,182,212,0.16)]",
      borderColor: "border-l-cyan-500",
      progress: 70,
      progressBarColor: "bg-cyan-500"
    },
  ];

  const currentSourceAudit = sourceAudits[selectedSource] || sourceAudits.Meta;
  const currentConfigAudit = configAudits[selectedConfig] || configAudits["3BHK"];
  const currentStageAudit = funnelAudits[selectedStage] || funnelAudits.New;

  return (
    <div className={`p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans transition-all duration-300 ${isRefreshing ? "opacity-75 pointer-events-none" : "opacity-100"}`}>
      
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-100 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0066FF] via-indigo-500 to-blue-500 animate-progress-shimmer w-1/2 rounded-full" />
        </div>
      )}
      {/* Self-contained CSS keyframes block for visual progress bar & slide fades */}
      <style>{`
        @keyframes carouselProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-carousel-progress {
          animation-name: carouselProgress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @keyframes progressShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-progress-shimmer {
          animation: progressShimmer 2.2s infinite linear;
        }
        .text-glow {
          text-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
        }
      `}</style>

      {/* Header & Period Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Sales Analytics</h1>
          <p className="text-[#64748B] text-sm mt-1">Deep dive into revenue, conversions, and performance</p>
        </div>

        <Tabs value={period} onValueChange={(val) => setPeriod(val as Period)}>
          <TabsList className="bg-[#F1F5F9] border border-gray-100 p-1 rounded-[14px] h-12 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <TabsTrigger value="week" className="rounded-[10px] px-5 text-[12px] font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">This Week</TabsTrigger>
            <TabsTrigger value="month" className="rounded-[10px] px-5 text-[12px] font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">This Month</TabsTrigger>
            <TabsTrigger value="quarter" className="rounded-[10px] px-5 text-[12px] font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">This Quarter</TabsTrigger>
            <TabsTrigger value="year" className="rounded-[10px] px-5 text-[12px] font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((kpi, i) => (
          <Card key={i} className={`bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.03)] rounded-[20px] hover:-translate-y-1 ${kpi.glowShadow} transition-all duration-300 border-l-[4px] ${kpi.borderColor} relative overflow-hidden group min-h-[145px]`}>
            {/* Soft decorative accent glow inside */}
            <div 
              className="absolute top-0 right-0 w-28 h-28 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
              style={{ background: `radial-gradient(circle at top right, ${kpi.glowColor}, transparent 70%)` }}
            />
            
            <CardContent className="p-4.5 flex flex-col justify-between h-full relative">
              <div>
                <div className="flex justify-between items-start mb-3.5">
                  <div className={`p-3 rounded-full ${kpi.bg} border border-current/10 shadow-[0_0_15px_rgba(255,255,255,0.8)] relative flex items-center justify-center shrink-0`}>
                    <div className={`absolute inset-0 rounded-full opacity-40 blur-[4px] group-hover:opacity-80 transition-opacity duration-300 ${kpi.bg}`} />
                    <kpi.icon className={`h-5.5 w-5.5 ${kpi.color} relative z-10`} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm ${kpi.trend >= 0 ? 'text-emerald-700 bg-emerald-50/70 border-emerald-100' : 'text-rose-700 bg-rose-50/70 border-rose-100'}`}>
                    {kpi.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpi.trend >= 0 ? `+${kpi.trend.toFixed(0)}%` : `${kpi.trend.toFixed(0)}%`}
                  </div>
                </div>
                <div>
                  <h3 className="text-[22px] font-black text-[#0F172A] tracking-tight leading-none">{kpi.value}</h3>
                  <p className="text-[10px] font-black text-[#475569] uppercase tracking-[0.08em] mt-2">{kpi.label}</p>
                  <p className="text-[9.5px] text-[#64748B] font-bold mt-1.5 truncate" title={kpi.desc}>{kpi.desc}</p>
                </div>
              </div>

              {/* Animated themed progress sparkline */}
              <div className="mt-4 pt-3 border-t border-slate-100/60 relative z-10 space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-black text-[#64748B] tracking-wider">
                  <span>PERIOD TARGET STATUS</span>
                  <span className={`font-black tracking-tight ${kpi.color}`}>{kpi.progress}%</span>
                </div>
                <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] relative">
                  <div 
                    className={`h-full ${kpi.progressBarColor} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`} 
                    style={{ width: `${kpi.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-progress-shimmer w-1/2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Strategic Advisory Banner */}
      {aiInsights.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-none shadow-[0_20px_50px_rgba(30,27,75,0.25)] rounded-[24px] overflow-hidden text-white relative border border-slate-800/60 hover:shadow-[0_20px_50px_rgba(0,102,255,0.15)] transition-all duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,102,255,0.12),transparent)] pointer-events-none" />
          
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
            <div className="space-y-3.5 max-w-3xl flex-1">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500/10 p-1.5 rounded-[8px] border border-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-emerald-400">AI Strategic Advisory Panel</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-1" />
              </div>
              
              <div className="transition-all duration-300">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  {aiInsights[activeInsightIndex]?.title}
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium mt-1.5 max-w-2xl">
                  {aiInsights[activeInsightIndex]?.text}
                </p>
              </div>

              {/* Dynamic trigger button inside slide */}
              <div className="pt-2">
                <button
                  onClick={() => setModalPlaybook(aiInsights[activeInsightIndex]?.playbook)}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:text-emerald-300 bg-emerald-500/5 hover:bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 transition-all shadow-sm group active:scale-95"
                >
                  <Sparkle className="w-3.5 h-3.5" />
                  View Detailed Optimization Playbook
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex md:flex-col items-end gap-3.5 shrink-0 w-full md:w-auto border-t border-slate-800/80 md:border-none pt-4 md:pt-0">
              <Badge className="bg-[#0066FF] hover:bg-[#0066FF] text-white font-extrabold px-3.5 py-1.5 text-[11px] rounded-full shadow-md border border-blue-400/20">
                {aiInsights[activeInsightIndex]?.metric}
              </Badge>
              
              <div className="flex items-center gap-3.5 ml-auto md:ml-0 bg-slate-900/60 p-2 rounded-full border border-slate-800/50 backdrop-blur-sm">
                {/* Autoplay play/pause toggle */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title={isPlaying ? "Pause rotation" : "Resume rotation"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>

                <div className="flex gap-1.5">
                  {aiInsights.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveInsightIndex(idx)}
                      className={`w-6 h-1.5 rounded-full transition-all duration-350 ${activeInsightIndex === idx ? 'bg-[#0066FF] w-8' : 'bg-slate-700 hover:bg-slate-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>

          {/* Upgraded rolling progress bar */}
          {isPlaying && (
            <div 
              key={activeInsightIndex} 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-[#0066FF] animate-carousel-progress" 
              style={{ animationDuration: '6000ms' }}
            />
          )}
        </Card>
      )}

      {/* Revenue Trend Chart & Source Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend - Composed Area Chart */}
        <Card className="bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.025)] rounded-[20px] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-[#FCFDFE]">
            <h3 className="font-bold text-[#0F172A] text-[16px]">Monthly Revenue Trend</h3>
            <p className="text-[12px] text-[#64748B]">Actual monthly cash inflows vs Target goal (in Lakhs)</p>
          </div>
          <CardContent className="p-6">
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '15px' }} iconType="circle" />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0066FF" strokeWidth={4.5} fill="url(#colorRevenue)" dot={{ r: 4, fill: '#0066FF', strokeWidth: 1, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#F59E0B" strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Source Distribution Donut Chart */}
        <Card className="bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.025)] rounded-[20px] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 bg-[#FCFDFE] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#0F172A] text-[16px]">Lead Source Distribution</h3>
                <p className="text-[12px] text-[#64748B]">Click slices for live Marketing Channel audits</p>
              </div>
              <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-800 border-none font-bold text-[10px] rounded-full px-2 py-0.5 animate-pulse">
                Clickable
              </Badge>
            </div>
            <CardContent className="p-4 flex items-center justify-center relative">
              <div className="h-[320px] w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={sourceDistribution} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={80} 
                      outerRadius={110} 
                      paddingAngle={3} 
                      dataKey="value" 
                      stroke="none"
                      onClick={(data) => {
                        if (data && data.name) setSelectedSource(data.name);
                      }}
                      className="cursor-pointer"
                    >
                      {sourceDistribution.map((entry, index) => {
                        const isSelected = entry.name === selectedSource;
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke={isSelected ? "#0F172A" : "none"}
                            strokeWidth={isSelected ? 2 : 0}
                            className={`transition-all duration-300 outline-none ${isSelected ? 'opacity-100 scale-105' : 'opacity-80 hover:opacity-100'}`} 
                          />
                        );
                      })}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none translate-y-[-5px]">
                  <span className="text-[36px] font-black text-[#0F172A] leading-none">{funnelData[0]?.count || 0}</span>
                  <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest mt-1.5">Total Leads</span>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Interactive Channel Audit Card */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100/60 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase text-[#0066FF] tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0066FF]" /> {selectedSource} Channel Audit
              </span>
              <div className="flex gap-2 text-[10px] font-bold text-[#64748B]">
                <span>CPL: <strong className="text-slate-800">{currentSourceAudit.cpl}</strong></span>
                <span>ROAS: <strong className="text-slate-800">{currentSourceAudit.roas}</strong></span>
                <span>Conv: <strong className="text-slate-800">{currentSourceAudit.conversion}</strong></span>
              </div>
            </div>
            <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
              {currentSourceAudit.alert} <span className="text-[#0066FF]">{currentSourceAudit.strategy}</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Broker Performance & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Broker Performance Bar Chart */}
        <Card className="bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.025)] rounded-[20px] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-[#FCFDFE]">
            <h3 className="font-bold text-[#0F172A] text-[16px]">Broker Performance</h3>
            <p className="text-[12px] text-[#64748B]">Sales agent deals closed vs monthly targets</p>
          </div>
          <CardContent className="p-6">
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brokerPerformance} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={26}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '15px' }} iconType="circle" />
                  <Bar dataKey="conversions" name="Conversions" shape={<CustomBar />} />
                  <Bar dataKey="target" name="Target" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Pipeline Chart */}
        <Card className="bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.025)] rounded-[20px] overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 bg-[#FCFDFE]">
            <h3 className="font-bold text-[#0F172A] text-[16px]">Conversion Pipeline</h3>
            <p className="text-[12px] text-[#64748B]">CRM lead stage volume distribution, progression flow, and drop-off indexes</p>
          </div>
          <CardContent className="p-6 px-4 sm:px-10">
            <div className="flex flex-col gap-0.5 w-full">
              {funnelData.map((stage, i) => {
                const total = funnelData[0].count;
                const ratio = total > 0 ? (stage.count / total) * 100 : 0;
                
                // Detail mappings for the stages
                const details: Record<string, { duration: string, conversion: string, color: string, badgeColor: string, iconColor: string }> = {
                  New: { duration: "1.2 hrs avg response time", conversion: "91% Contact Rate", color: "bg-[#0066FF]", badgeColor: "bg-blue-50 text-blue-700 border-blue-100/50", iconColor: "text-[#0066FF] bg-blue-50/50" },
                  Contacted: { duration: "3.2 days avg duration", conversion: "64% Visit Rate", color: "bg-[#3B82F6]", badgeColor: "bg-sky-50 text-sky-700 border-sky-100/50", iconColor: "text-[#3B82F6] bg-sky-50/50" },
                  "Site Visit Scheduled": { duration: "5.6 days avg duration", conversion: "48% Negotiation Rate", color: "bg-[#8B5CF6]", badgeColor: "bg-purple-50 text-purple-700 border-purple-100/50", iconColor: "text-[#8B5CF6] bg-purple-50/50" },
                  Negotiation: { duration: "12.4 days avg negotiation", conversion: "72% Close Rate", color: "bg-[#F59E0B]", badgeColor: "bg-amber-50 text-amber-700 border-amber-100/50", iconColor: "text-[#F59E0B] bg-amber-50/50" },
                  Converted: { duration: "Milestone Accomplished", conversion: "100% Closed Won", color: "bg-[#10B981]", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100/50", iconColor: "text-[#10B981] bg-emerald-50/50" }
                };
                
                const stageInfo = details[stage.stage] || { duration: "Active Stage", conversion: "N/A", color: "bg-slate-500", badgeColor: "bg-slate-50 text-slate-700 border-slate-100", iconColor: "text-slate-500 bg-slate-50" };
                
                // Drop-off percentage calculation
                const nextStage = funnelData[i + 1];
                const dropoff = nextStage ? (((stage.count - nextStage.count) / stage.count) * 100).toFixed(0) : "0";

                return (
                  <div key={i} className="flex flex-col w-full relative">
                    <div className="bg-[#FCFDFE] hover:bg-slate-50/60 border border-[#E2E8F0]/70 rounded-[16px] p-4 flex items-center justify-between gap-4 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,102,255,0.04)] group">
                      {/* Icon & Title */}
                      <div className="flex items-center gap-3.5 min-w-[210px]">
                        <div className={`p-2.5 rounded-[12px] shrink-0 ${stageInfo.iconColor} border border-current/10`}>
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-[#0F172A] tracking-tight">{stage.stage}</h4>
                          <p className="text-[10px] font-extrabold text-[#64748B] tracking-wide uppercase mt-0.5">{stageInfo.duration}</p>
                        </div>
                      </div>

                      {/* Visual Ratio Progress bar */}
                      <div className="flex-1 max-w-md hidden md:block">
                        <div className="flex justify-between items-center text-[10px] font-bold mb-1.5">
                          <span className="text-[#64748B]">Volume Ratio</span>
                          <span className="text-[#0F172A] font-extrabold">{stage.count} Leads ({ratio.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                          <div className={`h-full ${stageInfo.color} rounded-full transition-all duration-700 ease-out`} style={{ width: `${ratio}%` }} />
                        </div>
                      </div>

                      {/* Conversions Ratios Pill Badges */}
                      <div className="flex items-center gap-3.5 shrink-0 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[16px] font-black text-[#0F172A] leading-none">{stage.count}</span>
                          <span className="text-[9px] font-extrabold text-[#94A3B8] tracking-widest uppercase mt-1">Leads</span>
                        </div>
                        
                        <div className={`px-3 py-1.5 rounded-full border text-[10px] font-extrabold shadow-sm ${stageInfo.badgeColor} shrink-0`}>
                          {stageInfo.conversion}
                        </div>
                      </div>
                    </div>

                    {/* Visually stunning linking section with calculated drop-off rate directly drawn in-line */}
                    {i < funnelData.length - 1 && (
                      <div className="flex flex-col items-center py-2 select-none relative w-full">
                        <div className="h-6 w-px border-l border-dashed border-slate-350" />
                        <div className="absolute top-[28%] bg-white/95 backdrop-blur-sm border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)] px-3.5 py-0.5 rounded-full text-[9px] font-black text-rose-600 scale-95 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          {dropoff}% Drop-off rate
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity & Top Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Lead Activity Heat Distribution Stacked Bar Chart */}
        <Card className="bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.025)] rounded-[20px] overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-[#FCFDFE]">
            <h3 className="font-bold text-[#0F172A] text-[16px]">Weekly Lead Activity</h3>
            <p className="text-[12px] text-[#64748B]">Inquiry volumes hourly density across the week</p>
          </div>
          <CardContent className="p-6">
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyLeadActivity} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 102, 255, 0.02)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '15px' }} iconType="circle" />
                  <Bar dataKey="Morning" stackId="a" fill="#0066FF" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Afternoon" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Evening" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Night" stackId="a" fill="#EC4899" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Configurations Breakdown progress lists */}
        <Card className="bg-white border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.025)] rounded-[20px] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 bg-[#FCFDFE] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#0F172A] text-[16px]">Top Performing Configurations</h3>
                <p className="text-[12px] text-[#64748B]">Click configurations to match remaining site stock</p>
              </div>
              <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-800 border-none font-bold text-[10px] rounded-full px-2 py-0.5 animate-pulse">
                Interactive
              </Badge>
            </div>
            <CardContent className="p-6 flex flex-col justify-center h-[320px] space-y-3.5">
              {topConfigurations && topConfigurations.length > 0 ? (
                <div className="space-y-3">
                  {topConfigurations.map((config: any, i: number) => {
                    const colors = ["bg-[#0066FF]", "bg-[#6366F1]", "bg-[#8B5CF6]", "bg-[#F59E0B]", "bg-[#10B981]"];
                    const color = colors[i % colors.length];
                    const isSelected = config.name === selectedConfig;
                    return (
                      <div 
                        key={i} 
                        className={`space-y-1 group cursor-pointer transition-all duration-200 p-1.5 rounded-lg ${isSelected ? 'bg-slate-50 ring-1 ring-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]' : 'hover:bg-slate-50/50'}`}
                        onClick={() => {
                          if (config.name) setSelectedConfig(config.name);
                        }}
                      >
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className={`font-bold transition-colors ${isSelected ? 'text-[#0066FF]' : 'text-[#0F172A] group-hover:text-[#0066FF]'}`}>{config.name}</span>
                          <span className="text-[#64748B] font-bold">{config.count} inquiries ({config.percentage}%)</span>
                        </div>
                        <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                          <div
                            className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
                            style={{ width: `${config.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <Building2 className="w-10 h-10 text-slate-300 animate-bounce" />
                  <h4 className="font-bold text-slate-600 text-sm">No configurations found</h4>
                  <p className="text-xs text-slate-400 max-w-[220px]">Real configurations metadata will show up here</p>
                </div>
              )}
            </CardContent>
          </div>

          {/* Interactive Configuration Stock Audit Card */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100/60 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase text-[#8B5CF6] tracking-widest flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#8B5CF6]" /> {selectedConfig} Stock & Demand Audit
              </span>
              <div className="flex gap-2 text-[10px] font-bold text-[#64748B]">
                <span>Demand: <strong className="text-slate-800">{currentConfigAudit.demand}</strong></span>
                <span>Budget: <strong className="text-slate-800">{currentConfigAudit.budget}</strong></span>
              </div>
            </div>
            <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
              Status: <strong className="text-slate-800 underline">{currentConfigAudit.status}</strong> · {currentConfigAudit.advice}
            </p>
          </div>
        </Card>
      </div>

      {/* Custom Glassmorphic AI Recommended Action Dialog Modal */}
      {modalPlaybook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in transition-all">
          <div className="bg-[#0F172A]/90 border border-slate-800/80 rounded-[28px] max-w-lg w-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl relative animate-in zoom-in-95 duration-200">
            {/* Background glowing ambient light */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="p-6 border-b border-slate-800 flex justify-between items-center relative">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white tracking-tight">{modalPlaybook.title}</h3>
              </div>
              <button 
                onClick={() => setModalPlaybook(null)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-[16px] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Estimated Business Impact</h4>
                  <p className="text-xs text-slate-200 font-semibold mt-0.5">{modalPlaybook.impact}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Recommended Execution Steps</h4>
                <div className="space-y-2.5">
                  {modalPlaybook.steps.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start bg-slate-900/40 p-3 rounded-[12px] border border-slate-850 hover:border-slate-800 transition-colors">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[#0066FF] flex items-center justify-center text-[10px] font-black shrink-0 border border-slate-700">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900/30 border-t border-slate-800/80 flex items-center justify-end gap-3.5">
              <button
                onClick={() => setModalPlaybook(null)}
                disabled={isApplyingOptimization}
                className="text-xs font-bold text-slate-400 hover:text-white px-4 py-2 rounded-full transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button
                onClick={handleApplyOptimization}
                disabled={isApplyingOptimization || optimizationApplied}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-full shadow-md transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-75 disabled:pointer-events-none"
              >
                {isApplyingOptimization ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Executing Playbook...
                  </>
                ) : optimizationApplied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Optimization Applied!
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {modalPlaybook.btnText}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
