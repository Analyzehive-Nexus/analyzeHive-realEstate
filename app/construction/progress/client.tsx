"use client"

import { useState, useEffect } from "react"
import { 
  createDailyProgressReport, 
  fetchDailyProgressReports 
} from "@/app/construction/actions";
import { useToast } from "@/components/ui/toast";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle 
} from "@/components/ui/sheet";

import { 
  FileText, Search, Plus, Calendar, Clock, MapPin, 
  CloudSun, CloudRain, Sun, HardHat, AlertTriangle, CheckCircle, Image as ImageIcon, Loader2, Trash
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
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ResponsiveTable } from "@/components/ui/responsive-table"

const WeatherIcon = ({ w }: { w: string }) => {
  if (w === 'Sunny') return <Sun className="w-4 h-4 text-amber-500" />;
  if (w === 'Cloudy') return <CloudSun className="w-4 h-4 text-slate-500" />;
  return <CloudRain className="w-4 h-4 text-blue-500" />;
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

export default function ProgressClient({ initialReports }: { initialReports: any[] }) {
  const { toast } = useToast();
  const [localReports, setLocalReports] = useState<any[]>(initialReports);

  // Filters State
  const [filterDate, setFilterDate] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterSubmittedBy, setFilterSubmittedBy] = useState("all");

  // Controlled Dialogs State
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [isFullReportOpen, setIsFullReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Report Submission Form State
  const [newProjectName, setNewProjectName] = useState("Tower A");
  const [newFloorArea, setNewFloorArea] = useState("");
  const [newDate, setNewDate] = useState("2026-03-18");
  const [reportProgress, setReportProgress] = useState([50]);
  const [newWeather, setNewWeather] = useState("Sunny");
  const [newWorkersPresent, setNewWorkersPresent] = useState("");
  const [newWorkDone, setNewWorkDone] = useState("");
  const [newMaterials, setNewMaterials] = useState<Array<{ material: string; quantity: string }>>([
    { material: "", quantity: "" }
  ]);
  const [newIssues, setNewIssues] = useState("");

  const allReports = localReports.map((r, i) => {
    const d = new Date(r.date);
    
    // Materials can be inside materials_used (JSONB)
    const materialsList = Array.isArray(r.materials_used) 
      ? r.materials_used 
      : typeof r.materials_used === 'string' 
        ? JSON.parse(r.materials_used) 
        : [];
    
    // Work completed can be split by bullet/newline
    const workList = typeof r.work_done === 'string' 
      ? r.work_done.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0)
      : Array.isArray(r.work_done) 
        ? r.work_done 
        : [];

    return {
      id: r.id || `REP-0${i+1}`,
      displayId: r.id?.substring(0,8) || `REP-0${i+1}`,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateRaw: r.date, // 'YYYY-MM-DD'
      projectName: r.project_name || 'Tower A',
      site: r.project_name || 'Tower A',
      floor: r.floor_area || 'General Area',
      p: r.completion_percentage || 0,
      by: r.submitted_by_user?.name || r.submitted_by || 'Staff',
      time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      weather: r.weather || 'Sunny',
      workers: r.workers_present || 0,
      work: workList,
      materials: materialsList.map((m: any) => ({
        m: m.material || m.m || 'Material',
        q: m.quantity || m.q || '0'
      })),
      issues: r.issues || 'None.',
      photos: Array.isArray(r.photos) ? r.photos : []
    };
  });

  // Dynamic filter values extracted directly from current active state
  const uniqueProjects = Array.from(new Set(allReports.map(r => r.site))).filter(Boolean);
  const uniqueUsers = Array.from(new Set(allReports.map(r => r.by))).filter(Boolean);

  // Applying search filters
  const filteredReports = allReports.filter(r => {
    const matchDate = !filterDate || r.dateRaw === filterDate;
    const matchProject = filterProject === "all" || r.site === filterProject || r.projectName.toLowerCase() === filterProject.toLowerCase();
    const matchUser = filterSubmittedBy === "all" || r.by.toLowerCase() === filterSubmittedBy.toLowerCase();
    return matchDate && matchProject && matchUser;
  });

  // Submitting Daily Progress Report
  const handleSubmitReport = async () => {
    if (!newFloorArea.trim() || !newWorkDone.trim()) {
      toast({
        title: "Error",
        description: "Floor/Area and Work Completed fields are required.",
        variant: "destructive"
      });
      return;
    }

    const pct = Array.isArray(reportProgress) ? reportProgress[0] : reportProgress;

    setIsSubmitting(true);

    // Filter out empty materials rows
    const materialsPayload = newMaterials.filter(m => m.material.trim() && m.quantity.trim());

    const res = await createDailyProgressReport(
      newProjectName,
      newFloorArea,
      newDate,
      pct,
      newWeather,
      parseInt(newWorkersPresent) || 0,
      newWorkDone,
      materialsPayload,
      newIssues,
      [] // photos
    );

    setIsSubmitting(false);

    if (res.error) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Report Submitted",
        description: "Daily progress report has been successfully persisted!"
      });
      setIsAddReportOpen(false);
      
      // Reset form states
      setNewFloorArea("");
      setReportProgress([50]);
      setNewWeather("Sunny");
      setNewWorkersPresent("");
      setNewWorkDone("");
      setNewMaterials([{ material: "", quantity: "" }]);
      setNewIssues("");
      
      // Reload reports
      const fresh = await fetchDailyProgressReports();
      if (fresh.success && fresh.data) {
        setLocalReports(fresh.data);
      }
    }
  };

  // Recalculating Dynamic Real-Data KPIs
  const todayStr = new Date().toISOString().split('T')[0];
  const reportsToday = allReports.filter(r => r.dateRaw === todayStr).length;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const reportsThisWeek = allReports.filter(r => new Date(r.dateRaw) >= oneWeekAgo).length;

  const avgCompletion = allReports.length > 0
    ? (allReports.reduce((acc, r) => acc + r.p, 0) / allReports.length).toFixed(0)
    : "0";

  const reportsOnSchedule = allReports.filter(r => !r.issues || r.issues === 'None.' || r.issues.toLowerCase() === 'none').length;
  const totalReportsCount = allReports.length;

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Daily Progress Reports</h1>
        <p className="text-sm text-slate-500">Track daily site activities, material usage, and project completion status.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Reports Today</p>
            <div className="flex items-center gap-3">
               <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight">{reportsToday}</h3>
               <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 shadow-none border-none text-[10px] font-bold">Live</Badge>
            </div>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#0F172A]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Reports This Week</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{reportsThisWeek}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Avg Completion</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">{avgCompletion}%</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">On Schedule</p>
            <h3 className="text-[32px] font-bold text-[#F59E0B] leading-tight">{reportsOnSchedule} / {totalReportsCount}</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[200px]">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px] bg-white" 
            />
          </div>
          
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px] bg-white">
              <SelectValue placeholder="Project / Tower" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Towers</SelectItem>
              {uniqueProjects.map((proj: any, idx) => (
                <SelectItem key={idx} value={proj}>{proj}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSubmittedBy} onValueChange={setFilterSubmittedBy}>
            <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px] bg-white">
              <SelectValue placeholder="Submitted By" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Any User</SelectItem>
              {uniqueUsers.map((user: any, idx) => (
                <SelectItem key={idx} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button 
            className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm flex gap-2 font-bold"
            onClick={() => setIsAddReportOpen(true)}
          >
            <Plus className="w-4 h-4" /> Submit Daily Report
          </Button>
        </div>
      </section>

      {/* SUBMIT REPORT DIALOG */}
      <Dialog open={isAddReportOpen} onOpenChange={setIsAddReportOpen}>
        <DialogContent className="sm:max-w-[700px] h-[85vh] overflow-y-auto bg-white border border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Submit Daily Progress Report</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Project / Tower</Label>
                <Select value={newProjectName} onValueChange={setNewProjectName}>
                  <SelectTrigger className="rounded-[8px] bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Tower A">Tower A</SelectItem>
                    <SelectItem value="Tower B">Tower B</SelectItem>
                    <SelectItem value="Tower C">Tower C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Floor / Area</Label>
                <Input 
                  placeholder="e.g. Floor 12" 
                  className="rounded-[8px] bg-white" 
                  value={newFloorArea}
                  onChange={(e) => setNewFloorArea(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 font-semibold">Date</Label>
                <Input 
                  type="date" 
                  className="rounded-[8px] bg-white" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-4 rounded-[12px] border border-[#E8ECF0]">
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <Label className="text-slate-600 font-semibold">Area Completion Status</Label>
                    <span className="font-bold text-[#0066FF]">{reportProgress[0]}%</span>
                 </div>
                 <Slider value={reportProgress} onValueChange={setReportProgress} max={100} step={1} className="[&>span:first-child]:bg-blue-100 [&_[role=slider]]:bg-[#0066FF] [&_[role=slider]]:border-[#0066FF]" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-semibold">Weather</Label>
                    <Select value={newWeather} onValueChange={setNewWeather}>
                      <SelectTrigger className="rounded-[8px] bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Sunny"><div className="flex items-center gap-2"><Sun className="w-4 h-4 text-amber-500"/> Sunny</div></SelectItem>
                        <SelectItem value="Cloudy"><div className="flex items-center gap-2"><CloudSun className="w-4 h-4 text-slate-500"/> Cloudy</div></SelectItem>
                        <SelectItem value="Rainy"><div className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-500"/> Rainy</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-600 font-semibold">Workers Present</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="rounded-[8px] bg-white"
                      value={newWorkersPresent}
                      onChange={(e) => setNewWorkersPresent(e.target.value)}
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 font-semibold">Work Completed Today (Bullet points / split by newline)</Label>
              <Textarea 
                placeholder="- Completed reinforcement binding&#10;- Casting column slab Floor 12..." 
                rows={4} 
                className="rounded-[8px] bg-white" 
                value={newWorkDone}
                onChange={(e) => setNewWorkDone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-slate-600 font-semibold">Materials Used</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[#0066FF] px-2 text-[11px] font-bold"
                  onClick={() => setNewMaterials([...newMaterials, { material: "", quantity: "" }])}
                >
                  <Plus className="w-3 h-3 mr-1"/> Add Row
                </Button>
              </div>
              <div className="border border-[#E8ECF0] rounded-[8px] overflow-hidden">
                 <div className="grid grid-cols-12 bg-slate-50 border-b border-[#E8ECF0] p-2 text-[10px] font-bold text-slate-500 uppercase">
                    <div className="col-span-7">Material Description</div>
                    <div className="col-span-4">Quantity</div>
                    <div className="col-span-1"></div>
                 </div>
                 {newMaterials.map((mat, index) => (
                    <div key={index} className="grid grid-cols-12 p-2 gap-2 items-center border-b border-slate-100 last:border-none bg-white">
                      <div className="col-span-7">
                        <Input 
                          placeholder="e.g. Cement Bags / Structural Steel" 
                          className="h-8 text-[12px] rounded-[6px]" 
                          value={mat.material}
                          onChange={(e) => {
                            const updated = [...newMaterials];
                            updated[index].material = e.target.value;
                            setNewMaterials(updated);
                          }}
                        />
                      </div>
                      <div className="col-span-4">
                        <Input 
                          placeholder="Qty" 
                          className="h-8 text-[12px] rounded-[6px]" 
                          value={mat.quantity}
                          onChange={(e) => {
                            const updated = [...newMaterials];
                            updated[index].quantity = e.target.value;
                            setNewMaterials(updated);
                          }}
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                          disabled={newMaterials.length === 1}
                          onClick={() => {
                            setNewMaterials(newMaterials.filter((_, idx) => idx !== index));
                          }}
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                 ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 font-semibold">Issues / Blockers (Optional)</Label>
              <Textarea 
                placeholder="Any delays, accidents, or material shortages..." 
                rows={2} 
                className="rounded-[8px] bg-white" 
                value={newIssues}
                onChange={(e) => setNewIssues(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-[8px] h-10 font-semibold" onClick={() => setIsAddReportOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm"
              onClick={handleSubmitReport}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-1" />}
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REPORTS LIST */}
      <section className="space-y-6">
         {filteredReports.map((r) => (
            <PearlCard key={r.id}>
               <div className="flex flex-col md:flex-row border-b border-[#E8ECF0] bg-[#FAFBFC]">
                  {/* Summary Header */}
                  <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-[#E8ECF0] flex flex-col justify-center">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white border border-[#E8ECF0] rounded-[8px] w-12 h-12 flex flex-col items-center justify-center shadow-sm">
                           <span className="text-[10px] font-bold text-slate-500 uppercase">{r.day}</span>
                           <span className="text-[16px] font-bold text-[#0F172A]">{r.date.split(" ")[1]?.replace(',', '') || r.dateRaw.split("-")[2]}</span>
                        </div>
                        <div>
                           <h3 className="font-bold text-[18px] text-[#0F172A] leading-tight flex items-center gap-2">
                             {r.site} <span className="text-slate-300 font-light">|</span> <span className="text-[#0066FF] text-[16px]">{r.floor}</span>
                           </h3>
                           <p className="text-[12px] text-slate-500 font-medium mt-0.5">{r.date}</p>
                        </div>
                     </div>
                     <div className="space-y-1.5 mt-2">
                        <div className="flex justify-between items-end">
                           <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Completion</span>
                           <span className="text-[16px] font-bold text-[#0F172A]">{r.p}%</span>
                        </div>
                        <Progress value={r.p} className={`h-2 ${r.p > 80 ? 'bg-emerald-100 [&>div]:bg-emerald-500' : 'bg-blue-100 [&>div]:bg-[#0066FF]'}`} />
                     </div>
                  </div>

                  {/* Meta Details */}
                  <div className="p-6 md:w-2/3 flex flex-col justify-between bg-white">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                             <WeatherIcon w={r.weather} />
                             <span className="text-[12px] font-bold text-slate-600">{r.weather}</span>
                           </div>
                           <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                             <HardHat className="w-4 h-4 text-slate-500" />
                             <span className="text-[12px] font-bold text-slate-600">{r.workers} Workers</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[12px] text-slate-500 font-medium">Submitted by</p>
                           <p className="text-[14px] font-bold text-[#0F172A]">{r.by}</p>
                           <p className="text-[11px] text-slate-400 mt-0.5">at {r.time}</p>
                        </div>
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-8 flex-1">
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-[#E8ECF0] pb-1">Work Completed</h4>
                           <ul className="space-y-1.5 list-disc pl-4 text-[13px] text-slate-600 font-medium">
                              {r.work.map((wLine: string, idx: number) => <li key={idx} className="pl-1 leading-snug">{wLine}</li>)}
                              {r.work.length === 0 && <p className="text-slate-400 text-xs italic">No activity logs recorded.</p>}
                           </ul>
                        </div>
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-[#E8ECF0] pb-1">Materials Used</h4>
                           <div className="space-y-1.5 text-[13px]">
                             {r.materials.map((m: any, idx: number) => (
                               <div key={idx} className="flex justify-between items-center border-b border-dashed border-[#E8ECF0] pb-1">
                                  <span className="text-slate-600 font-medium">{m.m}</span>
                                  <span className="font-bold text-[#0F172A]">{m.q}</span>
                               </div>
                             ))}
                             {r.materials.length === 0 && <p className="text-slate-400 text-xs italic">No materials logged today.</p>}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Footer / Issues / Photos */}
               <div className="p-4 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex-1 flex items-center gap-6">
                     {r.issues && r.issues !== 'None.' && r.issues.toLowerCase() !== 'none' && (
                        <div className="flex items-start gap-2 max-w-[400px]">
                           <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                           <p className="text-[12px] text-amber-700 font-medium leading-tight">{r.issues}</p>
                        </div>
                     )}
                     <div className="flex gap-2 ml-auto">
                        {r.photos.map((c: string, idx: number) => (
                           <div key={idx} className={`w-8 h-8 rounded-[6px] ${c} flex items-center justify-center border border-slate-200/50 shadow-sm overflow-hidden relative group cursor-pointer`}>
                             <ImageIcon className="w-3.5 h-3.5 text-black/20" />
                           </div>
                        ))}
                     </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="h-9 text-[12px] font-bold rounded-[8px] bg-slate-50 hover:bg-slate-100 text-[#0F172A] border-[#E8ECF0] shadow-sm whitespace-nowrap"
                    onClick={() => {
                      setSelectedReport(r);
                      setIsFullReportOpen(true);
                    }}
                  >
                    View Full Report
                  </Button>
               </div>
            </PearlCard>
         ))}
         {filteredReports.length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-white border border-slate-100 rounded-[16px] font-medium text-sm">
              No daily progress reports match current filtering criteria.
            </div>
         )}
      </section>

      {/* VIEW FULL REPORT SHEET */}
      <Sheet open={isFullReportOpen} onOpenChange={setIsFullReportOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto bg-white border-l border-[#E8ECF0] shadow-2xl">
          {selectedReport && (
            <div className="space-y-6">
              <SheetHeader className="border-b border-[#E8ECF0] pb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress Report Details</span>
                  <Badge variant="outline" className="bg-slate-50 text-slate-700 font-bold">{selectedReport.displayId}</Badge>
                </div>
                <SheetTitle className="text-2xl font-bold text-[#0F172A] mt-2">
                  {selectedReport.site} <span className="text-slate-300 font-light">|</span> <span className="text-[#0066FF]">{selectedReport.floor}</span>
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedReport.date} ({selectedReport.day})</span>
                  <span className="text-slate-300">•</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>at {selectedReport.time}</span>
                </div>
              </SheetHeader>

              {/* Completion Progress Block */}
              <div className="bg-slate-50 p-6 rounded-[12px] border border-[#E8ECF0] space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Area Completion Status</span>
                  <span className="text-3xl font-black text-[#0066FF]">{selectedReport.p}%</span>
                </div>
                <Progress value={selectedReport.p} className="h-3 bg-blue-100 [&>div]:bg-[#0066FF] rounded-full shadow-inner" />
              </div>

              {/* Environment Conditions Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-[12px] border border-[#E8ECF0] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <WeatherIcon w={selectedReport.weather} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Weather</p>
                    <p className="font-bold text-sm text-slate-700">{selectedReport.weather}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-[12px] border border-[#E8ECF0] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <HardHat className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Workers Active</p>
                    <p className="font-bold text-sm text-slate-700">{selectedReport.workers} Present</p>
                  </div>
                </div>
              </div>

              {/* Work Completed */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-[#E8ECF0] pb-2">Work Completed Today</h4>
                <ul className="space-y-2 list-disc pl-5 text-[14px] text-slate-600 font-medium leading-relaxed">
                  {selectedReport.work.map((wLine: string, idx: number) => (
                    <li key={idx} className="pl-1">{wLine}</li>
                  ))}
                  {selectedReport.work.length === 0 && (
                    <p className="text-slate-400 text-sm italic">No work list details entered.</p>
                  )}
                </ul>
              </div>

              {/* Materials Used */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-[#E8ECF0] pb-2">Materials Used</h4>
                <div className="border border-[#E8ECF0] rounded-[10px] overflow-hidden shadow-sm bg-white">
                  <ResponsiveTable>
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow className="border-none">
                          <TableHead className="py-2.5 text-xs">Material Description</TableHead>
                          <TableHead className="py-2.5 text-xs text-right">Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedReport.materials.map((m: any, idx: number) => (
                          <TableRow key={idx} className="border-[#E8ECF0] hover:bg-transparent">
                            <TableCell className="py-3 text-[13px] font-medium text-slate-600">{m.m}</TableCell>
                            <TableCell className="py-3 text-[13px] font-bold text-right text-[#0F172A]">{m.q}</TableCell>
                          </TableRow>
                        ))}
                        {selectedReport.materials.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center py-4 text-slate-400 text-sm italic">No material logs entered.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ResponsiveTable>
                </div>
              </div>

              {/* Delay / Blocker warning box */}
              {selectedReport.issues && selectedReport.issues !== 'None.' && selectedReport.issues.toLowerCase() !== 'none' && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-[12px] flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-red-900 text-sm">Issues & Delays Identified</h5>
                    <p className="text-xs text-red-700 font-medium leading-relaxed mt-1">{selectedReport.issues}</p>
                  </div>
                </div>
              )}

              {/* Submitted By Footer */}
              <div className="border-t border-[#E8ECF0] pt-6 mt-6 flex justify-between items-center text-xs text-slate-400 bg-white">
                <div>
                  <p className="font-semibold text-slate-500">Report Submitter</p>
                  <p className="font-bold text-[14px] text-[#0F172A] mt-0.5">{selectedReport.by}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-500">Submitted At</p>
                  <p className="font-bold text-[14px] text-[#0F172A] mt-0.5">{selectedReport.time}</p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </div>
  )
}

