"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { 
  saveCompanySetup, 
  saveFirstProject, 
  inviteTeamMember 
} from "../actions";
import { 
  Building2, Landmark, Trees, Shield, Star, Hexagon, 
  ArrowRight, Sparkles, Check, ChevronRight, Plus, Trash2, 
  Mail, Loader2, ArrowLeft, ShieldAlert, User, MapPin, 
  TrendingUp, HelpCircle, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PRESET_LOGOS = [
  { id: "building", icon: Building2, color: "from-blue-500 to-indigo-600", bg: "bg-blue-50 text-blue-600" },
  { id: "landmark", icon: Landmark, color: "from-amber-500 to-orange-600", bg: "bg-amber-50 text-amber-600" },
  { id: "trees", icon: Trees, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 text-emerald-600" },
  { id: "shield", icon: Shield, color: "from-purple-500 to-pink-600", bg: "bg-purple-50 text-purple-600" },
  { id: "star", icon: Star, color: "from-rose-500 to-red-600", bg: "bg-rose-50 text-rose-600" },
  { id: "hexagon", icon: Hexagon, color: "from-cyan-500 to-blue-600", bg: "bg-cyan-50 text-cyan-600" }
];

export default function OnboardingClient({ 
  sessionUser 
}: { 
  sessionUser: { id: string; email: string; role: string } 
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 2 State - Company
  const [companyName, setCompanyName] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [selectedLogoId, setSelectedLogoId] = useState("building");
  const [customLogoUrl, setCustomLogoUrl] = useState("");

  // Step 3 State - Project
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectType, setProjectType] = useState("Residential");
  const [projectBudget, setProjectBudget] = useState("");

  // Step 4 State - Team Members
  const [teamName, setTeamName] = useState("");
  const [teamEmail, setTeamEmail] = useState("");
  const [teamRole, setTeamRole] = useState("BROKER");
  const [invitedTeammates, setInvitedTeammates] = useState<any[]>([]);

  // Helpers
  const currentLogo = PRESET_LOGOS.find(l => l.id === selectedLogoId);

  // Submit Handlers
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !companyCity.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name and city are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const logoUrl = customLogoUrl.trim() || selectedLogoId;
    const result = await saveCompanySetup(companyName.trim(), logoUrl, companyCity.trim());
    setLoading(false);

    if (result.error) {
      toast({
        title: "Error saving company",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Company Setup Completed",
        description: "Your corporate profile has been saved successfully!"
      });
      setStep(3);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectLocation.trim() || !projectBudget.trim()) {
      toast({
        title: "Validation Error",
        description: "All project fields are required.",
        variant: "destructive"
      });
      return;
    }

    const budgetVal = Number(projectBudget.replace(/[^0-9]/g, ""));
    if (isNaN(budgetVal) || budgetVal <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid numeric budget.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const result = await saveFirstProject(projectName.trim(), projectLocation.trim(), projectType, budgetVal);
    setLoading(false);

    if (result.error) {
      toast({
        title: "Error saving project",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "First Project Added",
        description: `Project "${projectName}" was added to your inventory successfully!`
      });
      setStep(4);
    }
  };

  const handleAddTeammate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !teamEmail.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and email are required to invite a teammate.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const result = await inviteTeamMember(teamName.trim(), teamEmail.trim(), teamRole);
    setLoading(false);

    if (result.error) {
      toast({
        title: "Error inviting member",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Teammate Invited",
        description: `${teamName} was added to the team roster.`
      });
      setInvitedTeammates([...invitedTeammates, { name: teamName.trim(), email: teamEmail.trim(), role: teamRole }]);
      setTeamName("");
      setTeamEmail("");
      setTeamRole("BROKER");
    }
  };

  const handleFinishOnboarding = () => {
    toast({
      title: "Onboarding Complete!",
      description: "Welcome to Flow. Redirecting to your broker dashboard..."
    });
    router.push("/sales");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-br from-slate-50 via-[#F8FAFC] to-[#EEF2FF]/60 p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Premium Animated Background Meshes */}
      <div className="absolute top-[-25%] left-[-15%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-blue-300/10 via-indigo-400/5 to-transparent blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-pink-300/5 via-violet-400/5 to-transparent blur-[100px] pointer-events-none animate-pulse duration-[10000ms]" />
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#3B82F6]/5 blur-[80px] pointer-events-none" />

      {/* HEADER LOGO */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
            <Building2 className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-[19px] font-black tracking-tight text-slate-800">Analyzehive <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Flow</span></span>
        </div>
        <Badge variant="outline" className="rounded-full px-3 py-1 font-bold text-slate-500 bg-white/70 backdrop-blur-md border-slate-100 shadow-sm text-xs flex gap-1.5 items-center">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Role: {sessionUser.role}</span>
        </Badge>
      </header>

      {/* MAIN WIZARD CARD */}
      <main className="w-full flex-1 flex flex-col justify-center items-center my-10 z-10">
        <div className="w-full max-w-xl">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between px-3 mb-5">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Setup Phase {step} of 4</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    step === i 
                      ? "w-8 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm" 
                      : step > i 
                        ? "w-2.5 bg-blue-400" 
                        : "w-2.5 bg-slate-200"
                  }`} 
                />
              ))}
            </div>
          </div>

          <Card className="border border-white/50 bg-white/75 backdrop-blur-xl shadow-[0_24px_50px_-12px_rgba(15,23,42,0.08)] rounded-[32px] p-8 md:p-10 transition-all duration-500 overflow-hidden relative">
            {/* Visual background gradient strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600" />

            {/* STEP 1: WELCOME SCREEN */}
            {step === 1 && (
              <div className="space-y-7 text-center md:text-left">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center shadow-inner mx-auto md:mx-0 animate-bounce duration-[3000ms]">
                  <Sparkles className="w-6.5 h-6.5 text-indigo-600" />
                </div>
                
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-[32px] font-black text-slate-900 tracking-tight leading-tight">
                    Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600">Analyzehive Flow</span>
                  </h1>
                  <p className="text-[14px] text-slate-500 leading-relaxed font-semibold">
                    Step into the modern era of real estate project management. Analyzehive Flow empowers your firm with high-fidelity corporate tracking, material demand CRM, ledger billing, and broker pipeline analytics.
                  </p>
                </div>

                {/* Feature highlight bullet grid */}
                <div className="grid grid-cols-2 gap-3.5 text-left py-1">
                  <div className="flex gap-2 items-center p-3 rounded-2xl bg-white/60 border border-white/80 shadow-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">Portfolio Tracking</p>
                      <p className="text-[9px] text-slate-400">Track all buildings & sites</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center p-3 rounded-2xl bg-white/60 border border-white/80 shadow-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">Ledger Expense CRM</p>
                      <p className="text-[9px] text-slate-400">Auto vendor order syncs</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center p-3 rounded-2xl bg-white/60 border border-white/80 shadow-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">Sales Pipeliners</p>
                      <p className="text-[9px] text-slate-400">Property lead metrics</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center p-3 rounded-2xl bg-white/60 border border-white/80 shadow-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">Active Team Hub</p>
                      <p className="text-[9px] text-slate-400">Secure RLS permissions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 text-left flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/10 text-sm">
                      {sessionUser.email.substring(0,2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Authenticated Email</p>
                      <p className="text-sm font-bold text-[#0F172A] truncate max-w-[200px] md:max-w-[280px]" title={sessionUser.email}>{sessionUser.email}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 shadow-none hover:bg-blue-50 border-none font-bold text-[9px] uppercase tracking-wider">Verified</Badge>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[14px] h-12 font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
                  onClick={() => setStep(2)}
                >
                  Get Started Setup
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            )}

            {/* STEP 2: COMPANY SETUP */}
            {step === 2 && (
              <form onSubmit={handleCompanySubmit} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Corporate Profile</h2>
                  <p className="text-xs text-slate-400 font-bold">Build your company profile and select a branding theme.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5 text-left">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> Company Legal Name</Label>
                    <div className="relative">
                      <Input 
                        placeholder="e.g. Prestige Builders" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="rounded-[12px] bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/10 focus:border-[#0066FF] h-11 text-[13px] shadow-sm pl-4 font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Operational Head City</Label>
                    <div className="relative">
                      <Input 
                        placeholder="e.g. Mumbai, Maharashtra" 
                        value={companyCity}
                        onChange={(e) => setCompanyCity(e.target.value)}
                        className="rounded-[12px] bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/10 focus:border-[#0066FF] h-11 text-[13px] shadow-sm pl-4 font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Logo Theme Presets */}
                  <div className="space-y-2.5 text-left">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-slate-400" /> Brand Icon Theme Preset</Label>
                    <div className="grid grid-cols-6 gap-3">
                      {PRESET_LOGOS.map((theme) => {
                        const Icon = theme.icon;
                        const isSelected = selectedLogoId === theme.id;
                        return (
                          <div 
                            key={theme.id}
                            onClick={() => { setSelectedLogoId(theme.id); setCustomLogoUrl(""); }}
                            className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer border-2 transition-all hover:scale-105 ${
                              isSelected 
                                ? `border-blue-600 ${theme.bg} shadow-md shadow-blue-500/10 scale-[1.03] font-bold` 
                                : "border-slate-100 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            <Icon className="w-6.5 h-6.5" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Logo URL (Optional overlay) */}
                  <div className="space-y-1.5 text-left">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custom Logo Link / URL <span className="text-slate-400 font-semibold normal-case">(Optional)</span></Label>
                    <Input 
                      placeholder="https://example.com/corporate-logo.png" 
                      value={customLogoUrl}
                      onChange={(e) => { setCustomLogoUrl(e.target.value); if(e.target.value) setSelectedLogoId(""); }}
                      className="rounded-[12px] bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/10 focus:border-[#0066FF] h-11 text-[13px] shadow-sm pl-4 text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="rounded-[12px] h-11 font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 px-5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[12px] h-11 font-bold shadow-md hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                  >
                    {loading && <Loader2 className="animate-spin w-4 h-4" />}
                    Save & Continue
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 3: ADD FIRST PROJECT */}
            {step === 3 && (
              <form onSubmit={handleProjectSubmit} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Configure First Project</h2>
                  <p className="text-xs text-slate-400 font-bold">Begin ERP pipeline tracking by configuring your primary real estate site.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5 text-left">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> Project / Site Name</Label>
                    <Input 
                      placeholder="e.g. Lumina Heights Tower A" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="rounded-[12px] bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/10 focus:border-[#0066FF] h-11 text-[13px] shadow-sm pl-4 font-semibold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Project Site Location</Label>
                    <Input 
                      placeholder="e.g. Sarjapur Road, Bengaluru" 
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      className="rounded-[12px] bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/10 focus:border-[#0066FF] h-11 text-[13px] shadow-sm pl-4 font-semibold text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Site Category</Label>
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger className="rounded-[12px] bg-white border-slate-200 shadow-sm h-11 text-[13px] font-semibold text-slate-700 focus-visible:ring-2 focus-visible:ring-[#0066FF]/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Residential">🏢 Residential</SelectItem>
                          <SelectItem value="Commercial">💼 Commercial</SelectItem>
                          <SelectItem value="Mixed-Use">🏬 Mixed-Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-slate-400" /> Budget (INR ₹)</Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 font-bold text-slate-400 text-sm">₹</span>
                        <Input 
                          placeholder="e.g. 5,00,00,000" 
                          value={projectBudget}
                          onChange={(e) => setProjectBudget(e.target.value)}
                          className="rounded-[12px] bg-white border-slate-200 focus-visible:ring-2 focus-visible:ring-[#0066FF]/10 focus:border-[#0066FF] h-11 text-[13px] shadow-sm pl-8 font-black text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget Quick Helper Selection Pills */}
                  <div className="space-y-1.5 text-left">
                    <Label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Quick Budget Presets</Label>
                    <div className="flex gap-2 flex-wrap">
                      <button 
                        type="button"
                        onClick={() => setProjectBudget("1,50,00,000")}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[10px] font-bold transition-colors"
                      >
                        ₹1.5 Crores
                      </button>
                      <button 
                        type="button"
                        onClick={() => setProjectBudget("5,00,00,000")}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[10px] font-bold transition-colors"
                      >
                        ₹5.0 Crores
                      </button>
                      <button 
                        type="button"
                        onClick={() => setProjectBudget("12,00,00,000")}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[10px] font-bold transition-colors"
                      >
                        ₹12.0 Crores
                      </button>
                      <button 
                        type="button"
                        onClick={() => setProjectBudget("35,00,00,000")}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[10px] font-bold transition-colors"
                      >
                        ₹35.0 Crores
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(2)}
                    className="rounded-[12px] h-11 font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 px-5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setStep(4)}
                    className="rounded-[12px] h-11 font-bold border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 px-5"
                  >
                    Skip Project
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[12px] h-11 font-bold shadow-md hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                  >
                    {loading && <Loader2 className="animate-spin w-4 h-4" />}
                    Save & Continue
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 4: INVITE TEAM */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Invite Corporate Team</h2>
                  <p className="text-xs text-slate-400 font-bold">Add collaborators, site managers, and sales brokers to your workspace.</p>
                </div>

                <form onSubmit={handleAddTeammate} className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4.5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1"><User className="w-3.5 h-3.5" /> Team Invitation</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1 text-left">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Teammate Name</Label>
                      <Input 
                        placeholder="Arjun Sharma" 
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="rounded-[10px] bg-white border-slate-200 h-10 text-[13px] font-semibold text-slate-700 pl-3"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</Label>
                      <Input 
                        type="email"
                        placeholder="arjun@company.com" 
                        value={teamEmail}
                        onChange={(e) => setTeamEmail(e.target.value)}
                        className="rounded-[10px] bg-white border-slate-200 h-10 text-[13px] font-semibold text-slate-700 pl-3"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-end">
                    <div className="space-y-1 flex-1 text-left">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Corporate Role</Label>
                      <Select value={teamRole} onValueChange={setTeamRole}>
                        <SelectTrigger className="rounded-[10px] bg-white border-slate-200 h-10 text-[13px] font-semibold text-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="BROKER">Broker (Sales Agent)</SelectItem>
                          <SelectItem value="VP_SALES">VP of Sales (Commercial Director)</SelectItem>
                          <SelectItem value="SITE_MANAGER">Site Manager (Supervisor)</SelectItem>
                          <SelectItem value="ADMIN">System Administrator (Full access)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] h-10 font-bold text-xs shrink-0 self-end px-5 flex gap-1 items-center shadow-md active:scale-95 transition-transform"
                    >
                      {loading ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <><Plus className="w-4 h-4"/> Add Member</>}
                    </Button>
                  </div>
                </form>

                {/* Invited Teammates List */}
                <div className="space-y-2.5 text-left">
                  <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> Invited Collaborators ({invitedTeammates.length})</Label>
                  <div className="max-h-[160px] overflow-y-auto space-y-2 divide-y divide-slate-100 pr-1">
                    {invitedTeammates.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between pt-2.5 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-black text-sm shadow-sm border border-blue-100">
                            {member.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{member.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{member.email}</p>
                          </div>
                        </div>
                        <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 shadow-none border border-indigo-150 text-[9px] font-black rounded-[6px] uppercase tracking-widest">{member.role}</Badge>
                      </div>
                    ))}
                    {invitedTeammates.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 italic">
                        No team invitations added yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(3)}
                    className="rounded-[12px] h-11 font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 px-5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleFinishOnboarding}
                    className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[12px] h-11 font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                  >
                    Finish Onboarding
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl flex items-center justify-center z-10 text-[9px] text-slate-400 font-extrabold uppercase tracking-widest gap-4 mt-6">
        <span>Security by WorkOS</span>
        <span>•</span>
        <span>Hosted via Supabase</span>
        <span>•</span>
        <span>Analyzehive Flow ERP © 2026</span>
      </footer>
    </div>
  );
}
