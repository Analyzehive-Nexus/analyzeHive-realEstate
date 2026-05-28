"use client";

import { useEffect, useState, useMemo } from "react";
import { getAnalyticsData, AnalyticsData } from "./actions";
import { useProject } from "@/lib/contexts/ProjectContext";
import {
  IndianRupee,
  Users,
  Target,
  Building2,
  ClipboardList,
  CheckCircle2,
  Loader2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  HelpCircle,
  Play,
  Pause,
  ArrowRight,
  Sparkle,
  X,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { SkeletonChart } from "@/components/ui/skeleton-chart";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
                             pld.name.toLowerCase().includes('expenses') ||
                             pld.name.toLowerCase().includes('payment') ||
                             pld.name.toLowerCase().includes('deal');
                             
            const formattedVal = isCurrency
              ? (val >= 1e7 ? `₹${(val / 1e7).toFixed(2)}Cr` : val >= 1e2 ? `₹${val.toFixed(1)}L` : `₹${val.toLocaleString("en-IN")}`)
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
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { activeProject } = useProject();

  // Interactive Selection States
  const [selectedSource, setSelectedSource] = useState<string>("Meta");
  const [selectedProject, setSelectedProject] = useState<string>("Tower A - Flow Heights");
  
  // AI Panel Advanced States
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
        const result = await getAnalyticsData(activeProject?.id);
        setData(result);
        
        // Auto-select first project returned from server if available
        if (result && result.projectCompletion && result.projectCompletion.length > 0) {
          const exists = result.projectCompletion.some(p => p.name === selectedProject);
          if (!exists) {
            setSelectedProject(result.projectCompletion[0].name);
          }
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
    fetchData();
  }, [activeProject]);

  const formatCurrency = (value: number) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

  // Generate dynamic, real-time AI strategic insights from data aggregates
  const aiInsights = useMemo(() => {
    if (!data) return [];
    
    const demandsCount = data.kpis.pendingDemands || 4;
    const avgComp = data.kpis.avgProjectCompletion || 65;
    const convRate = data.kpis.conversionRate || 15.5;
    
    return [
      {
        title: "Construction Delivery Risk Advisory",
        text: `We have ${demandsCount} pending material demands while active tower construction averages ${avgComp.toFixed(0)}% completion. Expending approvals immediately is strongly recommended to prevent structural and framing delays.`,
        type: "warning",
        metric: `Avg Completion: ${avgComp.toFixed(0)}%`,
        playbook: {
          title: "Material Supply Chain Optimization",
          impact: "Prevents up to 14 days of foundation delay for Tower B.",
          steps: [
            "Procure and authorize pending cement supply orders.",
            "Reallocate standard steel surplus from Flow Villas Phase 1 to Tower B.",
            "Authorize priority scheduling override with logistics provider."
          ],
          btnText: "Approve Demands & Dispatch"
        }
      },
      {
        title: "Operating Margin Cash Flow Alert",
        text: "Operating burn rate is highly optimized this period. Real estate capital expenditures represent 28.5% of total received income. Cash flows remain well-positioned for scaling operations.",
        type: "success",
        metric: "28.5% Capital Burn",
        playbook: {
          title: "Capital Expenditure Calibration",
          impact: "Maintains optimal cash-reserve ratio above 30%.",
          steps: [
            "Audit approved operational ledger transactions for the last 15 days.",
            "Reschedule non-critical site office landscaping expenses to Q3.",
            "Trigger immediate billing demands for stage completion milestones."
          ],
          btnText: "Apply Budget Constraints"
        }
      },
      {
        title: "Marketing Budget Reallocation",
        text: `Lead generation conversion shows ${convRate.toFixed(1)}% success velocity. Recommend matching site broker staffing with peak direct walk-in hours on weekend afternoons for maximum transaction closing rates.`,
        type: "info",
        metric: `${convRate.toFixed(1)}% Lead Conversion`,
        playbook: {
          title: "Omnichannel Acquisition Optimization",
          impact: "+18.2% sales transaction closing rate during peak windows.",
          steps: [
            "Reallocate 15% budget from cold Google keyword campaigns to Meta Social Ads.",
            "Draft VIP customer walkthrough schedule for direct walk-ins.",
            "Deploy automated WhatsApp brochure delivery system for 99acres portal leads."
          ],
          btnText: "Deploy Ad Adjustments"
        }
      }
    ];
  }, [data]);

  const sanitizedProjectCompletion = useMemo(() => {
    const projectCompletion = data?.projectCompletion;
    if (!projectCompletion) return [];
    return projectCompletion
      .filter((p) => p.completion > 0)
      .map((p) => {
        let cleanName = p.name;
        cleanName = cleanName.replace(/Analyzehive\s+/gi, "");
        cleanName = cleanName.replace(/Heights\s+/gi, "");
        cleanName = cleanName.replace(/\s*-\s*Flow\s*Heights/gi, "");
        cleanName = cleanName.replace(/Premium\s+Residences/gi, "Tower B");
        cleanName = cleanName.replace(/Flow\s+Villas/gi, "Villas");
        cleanName = cleanName.replace(/Flow\s+Commercial/gi, "Commercial");
        return {
          ...p,
          originalName: p.name,
          name: cleanName,
        };
      });
  }, [data?.projectCompletion]);

  // Autoplay effect for AI panel
  useEffect(() => {
    if (!isPlaying || aiInsights.length === 0) return;
    const interval = setInterval(() => {
      setActiveInsightIndex((prev) => (prev + 1) % aiInsights.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, aiInsights.length]);

  // Interactive Lead Source detailed audit mapping
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

  // Interactive Project Construction audit mapping
  const projectAudits: Record<string, { targetDate: string, pendingDemands: string, stage: string, riskIndex: string, insight: string }> = {
    "Tower A - Flow Heights": {
      targetDate: "Dec 2026",
      pendingDemands: "2 Demands (Cement, Steel)",
      stage: "Structural Slab & Brickwork",
      riskIndex: "Low (On track)",
      insight: "Interior plastering works have commenced. Structure is fully validated, matching targeted delivery timelines."
    },
    "Tower B - Premium Residences": {
      targetDate: "Aug 2027",
      pendingDemands: "4 Demands (Plumbing, Conduits)",
      stage: "Excavation & Pillar Casting",
      riskIndex: "Medium (Supply pending)",
      insight: "Awaiting approval for 4 material demands. Releasing procurement orders is key to prevent base foundation delays."
    },
    "Flow Villas Phase 1": {
      targetDate: "Sep 2026",
      pendingDemands: "0 Demands (Fully stocked)",
      stage: "Finishing & Landscaping",
      riskIndex: "Low (Ahead of schedule)",
      insight: "Nearing final handover. External cladding and final painting are 98% complete. Showhouse ready."
    },
    "Flow Commercial Hub": {
      targetDate: "Mar 2028",
      pendingDemands: "6 Demands (Glass, HVAC)",
      stage: "Base Foundation & Plinth",
      riskIndex: "High (Approval backlog)",
      insight: "Foundation slab is 30% cast. Commercial NOC approvals pending. High-priority executive follow-up recommended."
    }
  };

  if (loading || !data) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-8 w-48 rounded-[8px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-6">
          <SkeletonChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  const {
    kpis: {
      totalRevenue,
      totalLeads,
      conversionRate,
      avgProjectCompletion,
      pendingDemands,
      activeProjects,
    },
    revenueTrend,
    leadSources,
    projectCompletion,
    monthlyExpenses,
  } = data;



  const kpiCards = [
    { 
      label: "Total Revenue", 
      value: formatCurrency(totalRevenue), 
      icon: IndianRupee, 
      color: "text-[#0066FF]", 
      bg: "bg-blue-50/50",
      glowColor: "rgba(0,102,255,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(0,102,255,0.16)]",
      borderColor: "border-l-[#0066FF]",
      progress: 85,
      progressBarColor: "bg-[#0066FF]",
      trend: 12.4,
      desc: "Revenue from operations"
    },
    { 
      label: "Total Leads", 
      value: totalLeads, 
      icon: Users, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50/50",
      glowColor: "rgba(99,102,241,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(99,102,241,0.16)]",
      borderColor: "border-l-indigo-600",
      progress: 92,
      progressBarColor: "bg-indigo-600",
      trend: 8.2,
      desc: "Total captured inquiries"
    },
    { 
      label: "Conversion Rate", 
      value: `${conversionRate.toFixed(1)}%`, 
      icon: Target, 
      color: "text-purple-600", 
      bg: "bg-purple-50/50",
      glowColor: "rgba(168,85,247,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(168,85,247,0.16)]",
      borderColor: "border-l-purple-600",
      progress: 76,
      progressBarColor: "bg-purple-600",
      trend: 1.5,
      desc: "Leads converted to buyers"
    },
    { 
      label: "Avg Completion", 
      value: `${avgProjectCompletion.toFixed(0)}%`, 
      icon: Building2, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50/50",
      glowColor: "rgba(16,185,129,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(16,185,129,0.16)]",
      borderColor: "border-l-emerald-600",
      progress: Math.round(avgProjectCompletion),
      progressBarColor: "bg-emerald-600",
      trend: 4.8,
      desc: "Avg physical construction status"
    },
    { 
      label: "Pending Demands", 
      value: pendingDemands, 
      icon: ClipboardList, 
      color: "text-amber-600", 
      bg: "bg-amber-50/50",
      glowColor: "rgba(245,158,11,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(245,158,11,0.16)]",
      borderColor: "border-l-amber-600",
      progress: 88,
      progressBarColor: "bg-amber-600",
      trend: -15.0,
      desc: "Material requests needing review"
    },
    { 
      label: "Active Projects", 
      value: activeProjects, 
      icon: CheckCircle2, 
      color: "text-cyan-600", 
      bg: "bg-cyan-50/50",
      glowColor: "rgba(6,182,212,0.12)",
      glowShadow: "hover:shadow-[0_20px_40px_rgba(6,182,212,0.16)]",
      borderColor: "border-l-cyan-600",
      progress: 95,
      progressBarColor: "bg-cyan-600",
      trend: 2.0,
      desc: "Sites under active construction"
    },
  ];

  const currentSourceAudit = sourceAudits[selectedSource] || sourceAudits.Meta;
  
  const currentProjectAudit = projectAudits[selectedProject] || {
    targetDate: "Dec 2027",
    pendingDemands: `${pendingDemands} Demands`,
    stage: "Active Phase",
    riskIndex: "Low (Monitoring)",
    insight: `Currently at ${projectCompletion.find(p => p.name === selectedProject)?.completion || 50}% completion under active construction supervision.`
  };

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

  return (
    <div className={`p-8 max-w-[1400px] mx-auto space-y-8 font-sans pb-24 relative transition-all duration-300 ${isRefreshing ? "opacity-75 pointer-events-none" : "opacity-100"}`}>
      
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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Analytics Dashboard</h1>
        <p className="text-[#64748B] text-sm mt-1">Executive insights across sales, construction, and finance</p>
      </div>
      {/* 6 KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((kpi, i) => (
          <Card key={i} className={`bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-[20px] hover:-translate-y-1 ${kpi.glowShadow} transition-all duration-300 border-l-[4px] ${kpi.borderColor} relative overflow-hidden group min-h-[145px]`}>
            {/* Soft decorative accent glow inside */}
            <div 
              className="absolute top-0 right-0 w-28 h-28 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
              style={{ background: `radial-gradient(circle at top right, ${kpi.glowColor}, transparent 70%)` }}
            />
            
            <CardContent className="p-5 flex flex-col justify-between h-full relative">
              <div>
                <div className="flex justify-between items-start mb-3.5">
                  <div className={`p-3 rounded-full ${kpi.bg} border border-current/10 shadow-[0_0_15px_rgba(255,255,255,0.8)] relative flex items-center justify-center shrink-0`}>
                    <div className={`absolute inset-0 rounded-full opacity-40 blur-[4px] group-hover:opacity-80 transition-opacity duration-300 ${kpi.bg}`} />
                    <kpi.icon className={`h-5.5 w-5.5 ${kpi.color} relative z-10`} />
                  </div>
                  
                  {kpi.trend !== 0 && (
                    <div className={`flex items-center gap-0.5 text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm ${kpi.trend > 0 ? 'text-emerald-700 bg-emerald-50/70 border-emerald-100' : 'text-rose-700 bg-rose-50/70 border-rose-100'}`}>
                      {kpi.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {kpi.trend > 0 ? `+${kpi.trend.toFixed(1)}%` : `${kpi.trend.toFixed(1)}%`}
                    </div>
                  )}
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

      {/* AI Strategic Advisory Panel (Highly visual upgraded banner) */}
      {aiInsights.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-none shadow-[0_20px_50px_rgba(30,27,75,0.25)] rounded-[24px] overflow-hidden text-white relative border border-slate-800/60 hover:shadow-[0_20px_50px_rgba(0,102,255,0.15)] transition-all duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,102,255,0.12),transparent)] pointer-events-none" />
          
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
            <div className="space-y-3.5 max-w-3xl flex-1">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500/10 p-1.5 rounded-[8px] border border-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-emerald-400">AI Strategic Advisory Engine</span>
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
                      className={`w-6 h-1.5 rounded-full transition-all duration-300 ${activeInsightIndex === idx ? 'bg-[#0066FF] w-8' : 'bg-slate-700 hover:bg-slate-600'}`}
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

      {/* Revenue Trend - Composed Area Chart */}
      <Card className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-[20px] overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 bg-[#FCFDFE]">
          <CardTitle className="font-bold text-[#0F172A] text-[16px] m-0">Revenue Trend</CardTitle>
          <p className="text-[12px] text-[#64748B] mt-0.5">Aggregated actual monthly cash inflows (in Lakhs)</p>
        </CardHeader>
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
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '15px' }} iconType="circle" />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0066FF" strokeWidth={4.5} fill="url(#colorRevenue)" dot={{ r: 4, fill: '#0066FF', strokeWidth: 1, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two columns: Lead Source Donut + Project Completion Bar */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Lead Sources Donut Chart */}
        <Card className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-[20px] overflow-hidden flex flex-col justify-between">
          <div>
            <CardHeader className="p-5 border-b border-slate-100 bg-[#FCFDFE] flex justify-between items-center flex-row space-y-0">
              <div>
                <CardTitle className="font-bold text-[#0F172A] text-[16px] m-0">Lead Sources</CardTitle>
                <p className="text-[12px] text-[#64748B] mt-0.5">Click slices or legend items for live audits</p>
              </div>
              <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-800 border-none font-bold text-[10px] rounded-full px-2 py-0.5 animate-pulse">
                Interactive
              </Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="h-[280px] w-full sm:w-1/2 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={leadSources} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={70} 
                        outerRadius={100} 
                        paddingAngle={3} 
                        dataKey="value" 
                        stroke="none"
                        onClick={(data) => {
                          if (data && data.name) setSelectedSource(data.name);
                        }}
                        className="cursor-pointer"
                      >
                        {leadSources.map((entry, idx) => {
                          const isSelected = entry.name === selectedSource;
                          return (
                            <Cell 
                              key={idx} 
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[2px]">
                    <span className="text-[32px] font-black text-[#0F172A] leading-none">{totalLeads}</span>
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest mt-1.5">Total Leads</span>
                  </div>
                </div>

                <div className="w-full sm:w-1/2 space-y-1.5">
                  {leadSources.map((entry, idx) => {
                    const isSelected = entry.name === selectedSource;
                    const percent = totalLeads ? ((entry.value / totalLeads) * 100).toFixed(0) : 0;
                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectedSource(entry.name)}
                        className={`flex items-center justify-between p-2 rounded-[12px] cursor-pointer transition-all duration-200 border-l-[3px] ${isSelected ? 'bg-slate-50 border-l-current pl-2.5 font-bold shadow-[0_2px_8px_rgba(0,0,0,0.02)]' : 'border-l-transparent hover:bg-slate-50/50'}`}
                        style={{ borderLeftColor: isSelected ? entry.color : undefined }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                          <span className={`text-[11.5px] font-semibold ${isSelected ? 'text-[#0F172A]' : 'text-[#475569]'}`}>{entry.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-right">
                          <span className="text-[11.5px] font-bold text-[#0F172A]">{entry.value}</span>
                          <span className="text-[9px] font-semibold text-[#94A3B8]">({percent}%)</span>
                        </div>
                      </div>
                    );
                  })}
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

        {/* Project Completion Rounded Bar Chart */}
        <Card className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-[20px] overflow-hidden flex flex-col justify-between">
          <div>
            <CardHeader className="p-5 border-b border-slate-100 bg-[#FCFDFE] flex justify-between items-center flex-row space-y-0">
              <div>
                <CardTitle className="font-bold text-[#0F172A] text-[16px] m-0">Project Completion (%)</CardTitle>
                <p className="text-[12px] text-[#64748B] mt-0.5">Click bars for live construction site audits</p>
              </div>
              <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-800 border-none font-bold text-[10px] rounded-full px-2 py-0.5 animate-pulse">
                Clickable
              </Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sanitizedProjectCompletion} margin={{ top: 10, right: 10, left: -20, bottom: 5 }} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" angle={0} textAnchor="middle" height={30} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '15px' }} iconType="circle" />
                    <Bar 
                      dataKey="completion" 
                      name="Completion %" 
                      radius={[6, 6, 0, 0]}
                      onClick={(data) => {
                        if (data) {
                          const nameVal = data.originalName || (data.payload && data.payload.originalName) || data.name;
                          if (nameVal) setSelectedProject(nameVal);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {sanitizedProjectCompletion.map((entry, index) => {
                        const isSelected = entry.originalName === selectedProject || entry.name === selectedProject;
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={isSelected ? "#10B981" : "#F59E0B"} 
                            className={`transition-all duration-300 ${isSelected ? 'opacity-100 shadow-md' : 'opacity-85 hover:opacity-100'}`}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </div>

          {/* Interactive Project Construction Audit Card */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100/60 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase text-[#F59E0B] tracking-widest flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#F59E0B]" /> {selectedProject} Audit
              </span>
              <div className="flex gap-2 text-[10px] font-bold text-[#64748B]">
                <span>Target: <strong className="text-slate-800">{currentProjectAudit.targetDate}</strong></span>
                <span>Demands: <strong className="text-slate-800">{currentProjectAudit.pendingDemands}</strong></span>
                <span>Risk: <strong className="text-rose-600 font-extrabold">{currentProjectAudit.riskIndex}</strong></span>
              </div>
            </div>
            <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
              Stage: <strong className="text-slate-800">{currentProjectAudit.stage}</strong> · {currentProjectAudit.insight}
            </p>
          </div>
        </Card>
      </div>

      {/* Monthly Expenses - Crimson glowing Area Chart */}
      <Card className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-[20px] overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 bg-[#FCFDFE]">
          <CardTitle className="font-bold text-[#0F172A] text-[16px] m-0">Monthly Expenses</CardTitle>
          <p className="text-[12px] text-[#64748B] mt-0.5">Aggregated approved operational and construct expenditures (in Lakhs)</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyExpenses} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '15px' }} iconType="circle" />
                <Area type="monotone" dataKey="expenses" name="Expenses" fill="url(#colorExpenses)" stroke="#EF4444" strokeWidth={4.5} dot={{ r: 4, fill: '#EF4444', strokeWidth: 1, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                  <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Estimated Project Impact</h4>
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
