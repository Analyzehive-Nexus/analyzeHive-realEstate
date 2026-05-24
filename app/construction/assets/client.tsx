"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { useState } from "react";
import { 
  Truck, Search, Filter, Plus, FileDown, Clock, MapPin, Wrench, User,
  Calendar, RotateCcw, AlertTriangle, CheckCircle, MoreVertical, Loader2
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { addAsset, updateAssetStatus, assignAsset, fetchMaintenanceLogs, addMaintenanceLog } from "./actions";

import dynamic from "next/dynamic";

const AssetUsageChart = dynamic(
  () => import("./components/asset-charts").then((mod) => mod.AssetUsageChart),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">Loading usage chart...</div>
  }
);

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
export default function AssetsClient({ 
  initialAssets,
  users
}: { 
  initialAssets: any[],
  users: any[]
}) {
  const { toast } = useToast();
  
  // Real Database Local State
  const [localAssets, setLocalAssets] = useState<any[]>(initialAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maintenance Logs State
  const [activeMaintLogs, setActiveMaintLogs] = useState<any[]>([]);
  const [isMaintLogsLoading, setIsMaintLogsLoading] = useState(false);
  const [isAddMaintOpen, setIsAddMaintOpen] = useState(false);

  // Form Fields State - Log Maintenance
  const [maintType, setMaintType] = useState("");
  const [maintBy, setMaintBy] = useState("");
  const [maintCost, setMaintCost] = useState("");
  const [maintNotes, setMaintNotes] = useState("");
  const [maintDate, setMaintDate] = useState("");

  // Form Fields State - Add Asset
  const [addName, setAddName] = useState("");
  const [addType, setAddType] = useState("Excavator");
  const [addSerial, setAddSerial] = useState("");
  const [addDate, setAddDate] = useState("");
  const [addCost, setAddCost] = useState("");
  const [addLocation, setAddLocation] = useState("Storage");

  // Form Fields State - Assign Asset
  const [assignUserId, setAssignUserId] = useState("unassigned");
  const [assignLocation, setAssignLocation] = useState("");

  // Re-calculate real-data assets list
  const allAssets = localAssets.map(a => {
    // Resolve assigned user name
    const assignedUser = a.assigned_user?.name || users.find(u => u.id === a.assigned_user_id)?.name || 'Unassigned';
    
    return {
      id: a.id,
      displayId: a.id?.substring(0, 8) || 'Unknown',
      name: a.name || a.asset_name || 'Unnamed Asset',
      type: a.asset_type || a.type || 'General',
      status: a.status || 'Active',
      nextService: (a.next_service_date || a.next_maintenance_date) ? new Date(a.next_service_date || a.next_maintenance_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--',
      assigned: assignedUser,
      assigned_user_id: a.assigned_user_id || '',
      location: a.location || a.current_location || 'Storage',
      hours: a.hours_logged || a.total_hours_used || 0,
      purch: a.purchase_date ? new Date(a.purchase_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--',
      cost: a.purchase_cost ? `₹${(a.purchase_cost / 100000).toFixed(1)}L` : '--'
    };
  });

  const filteredAssets = allAssets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Asset Handler
  const handleAddAsset = async () => {
    if (!addName.trim() || !addType) {
      toast({
        title: "Validation Error",
        description: "Asset Name and Equipment Type are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const costNum = parseFloat(addCost) || 0;
    const res = await addAsset(
      addName,
      addType,
      addSerial,
      addDate,
      costNum,
      addLocation
    );
    setIsSubmitting(false);

    if (res.error) {
      toast({ title: "Failed to Add Asset", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Asset Registered", description: "Equipment profile has been successfully saved in database!" });
      setIsAddOpen(false);
      resetAddForm();
      
      // Update local state reactively
      if (res.data) {
        setLocalAssets([res.data, ...localAssets]);
      }
    }
  };

  // Status Change Handler
  const handleStatusChange = async (assetId: string, newStatus: string) => {
    if (!assetId) return;
    
    // Optimistic UI update
    const previousAssets = [...localAssets];
    setLocalAssets(localAssets.map(a => a.id === assetId ? { ...a, status: newStatus } : a));

    const res = await updateAssetStatus(assetId, newStatus);
    if (res.error) {
      toast({ title: "Update Failed", description: res.error, variant: "destructive" });
      setLocalAssets(previousAssets); // rollback
    } else {
      toast({ title: "Status Updated", description: `Asset status changed to ${newStatus} successfully.` });
      if (res.data) {
        setLocalAssets(localAssets.map(a => a.id === assetId ? res.data : a));
      }
    }
  };

  // Assignment Handler
  const handleAssignAssetSubmit = async () => {
    if (!selectedAsset) return;
    
    setIsSubmitting(true);
    const res = await assignAsset(
      selectedAsset.id,
      assignUserId === "unassigned" ? null : (assignUserId || null),
      assignLocation
    );
    setIsSubmitting(false);

    if (res.error) {
      toast({ title: "Assignment Failed", description: res.error, variant: "destructive" });
    } else {
      toast({ 
        title: "Asset Assigned", 
        description: assignUserId === "unassigned" 
          ? `Successfully marked ${selectedAsset.name} as unassigned.` 
          : `Successfully assigned ${selectedAsset.name} to ${users.find(u => u.id === assignUserId)?.name || 'User'} at ${assignLocation}.` 
      });
      setIsAssignOpen(false);
      setAssignUserId("unassigned");
      setAssignLocation("");
      
      // Update local state reactively
      if (res.data) {
        setLocalAssets(localAssets.map(a => a.id === selectedAsset.id ? res.data : a));
      }
    }
  };

  const loadMaintenanceLogsForAsset = async (assetId: string) => {
    setIsMaintLogsLoading(true);
    const res = await fetchMaintenanceLogs(assetId);
    setIsMaintLogsLoading(false);
    if (res.success && res.data) {
      setActiveMaintLogs(res.data);
    } else {
      setActiveMaintLogs([]);
    }
  };

  const handleAddMaintenanceSubmit = async () => {
    if (!selectedAsset) return;
    if (!maintType.trim() || !maintBy.trim() || !maintDate) {
      toast({
        title: "Validation Error",
        description: "Service Type, Serviced By, and Service Date are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const costNum = parseFloat(maintCost) || 0;
    const res = await addMaintenanceLog(
      selectedAsset.id,
      maintType,
      maintBy,
      costNum,
      maintNotes,
      maintDate
    );
    setIsSubmitting(false);

    if (res.error) {
      toast({ title: "Failed to Log Maintenance", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Maintenance Logged", description: "The service record has been successfully saved!" });
      setIsAddMaintOpen(false);
      resetMaintForm();
      
      // Reload logs reactively
      await loadMaintenanceLogsForAsset(selectedAsset.id);
    }
  };

  const resetMaintForm = () => {
    setMaintType("");
    setMaintBy("");
    setMaintCost("");
    setMaintNotes("");
    setMaintDate("");
  };

  const triggerAssignModal = (ast: any) => {
    setSelectedAsset(ast);
    setAssignUserId(ast.assigned_user_id || "unassigned");
    setAssignLocation(ast.location || "Storage");
    setIsAssignOpen(true);
  };

  const resetAddForm = () => {
    setAddName("");
    setAddType("Excavator");
    setAddSerial("");
    setAddDate("");
    setAddCost("");
    setAddLocation("Storage");
  };

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Asset & Equipment Tracking</h1>
        <p className="text-sm text-slate-500">Monitor machinery, schedules, maintenance logs, and asset allocation.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
              placeholder="Search assets name, type or location..." 
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-100 p-1 rounded-[10px] flex items-center">
             <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className={`h-8 px-3 rounded-[8px] text-[12px] ${viewMode === 'grid' ? 'bg-white text-[#0066FF] shadow-sm font-bold' : 'text-slate-500 font-semibold hover:bg-slate-200/50 hover:text-slate-700'}`}>Grid</Button>
             <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('table')} className={`h-8 px-3 rounded-[8px] text-[12px] ${viewMode === 'table' ? 'bg-white text-[#0066FF] shadow-sm font-bold' : 'text-slate-500 font-semibold hover:bg-slate-200/50 hover:text-slate-700'}`}>Table</Button>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm flex gap-2 font-bold" onClick={resetAddForm}>
                <Plus className="w-4 h-4" /> Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white border border-slate-100 shadow-2xl rounded-[24px]">
              <DialogHeader className="border-b border-[#F1F5F9] pb-4">
                <DialogTitle className="text-lg font-bold text-[#0F172A]">Register New Asset</DialogTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">Save a heavy machinery or tool to the ERP assets registry.</p>
              </DialogHeader>
              <div className="grid gap-4 py-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Name</Label>
                    <Input placeholder="e.g. Caterpillar Excavator 320" className="rounded-[8px]" value={addName} onChange={e => setAddName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Type</Label>
                    <Select value={addType} onValueChange={setAddType}>
                      <SelectTrigger className="rounded-[8px] bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Excavator">Excavator</SelectItem>
                        <SelectItem value="Crane">Crane</SelectItem>
                        <SelectItem value="Mixer">Concrete Mixer</SelectItem>
                        <SelectItem value="Generator">Generator</SelectItem>
                        <SelectItem value="Pump">Hydraulic Pump</SelectItem>
                        <SelectItem value="Other">Other Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Serial / ID Number</Label>
                    <Input placeholder="e.g. CAT-9821-X" className="rounded-[8px]" value={addSerial} onChange={e => setAddSerial(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Purchase Date</Label>
                    <Input type="date" className="rounded-[8px]" value={addDate} onChange={e => setAddDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Purchase Cost (₹)</Label>
                    <Input type="number" placeholder="4500000" className="rounded-[8px] font-bold" value={addCost} onChange={e => setAddCost(e.target.value)} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Location</Label>
                    <Input placeholder="e.g. Tower B - Basement Zone" className="rounded-[8px]" value={addLocation} onChange={e => setAddLocation(e.target.value)} />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0 border-t border-[#F1F5F9] pt-4">
                <Button variant="outline" className="rounded-[10px]" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] font-bold" onClick={handleAddAsset} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-1.5" />}
                  Register Asset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* ASSIGN ASSET DIALOG */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white border border-slate-100 shadow-2xl rounded-[24px]">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <DialogTitle className="text-lg font-bold text-[#0F172A] text-left">Assign Asset & Equipment</DialogTitle>
            <p className="text-[11px] text-slate-500 mt-0.5 text-left font-medium">Allocate this equipment to an active site user and track its location.</p>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Selected</Label>
              <div className="p-3 bg-slate-50 border border-[#E8ECF0] rounded-[10px] font-bold text-[#0F172A] text-[14px]">
                {selectedAsset?.name} <span className="font-semibold text-slate-400 text-xs ml-1.5">({selectedAsset?.type})</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assign User</Label>
              <Select value={assignUserId} onValueChange={setAssignUserId}>
                <SelectTrigger className="rounded-[8px] bg-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="unassigned">Unassigned (Mark as Unallocated)</SelectItem>
                  {users.map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Location / Project Tower</Label>
              <Input 
                placeholder="e.g. Tower B - Floor 14" 
                className="rounded-[8px] bg-white font-semibold text-[13px]" 
                value={assignLocation}
                onChange={e => setAssignLocation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 border-t border-[#F1F5F9] pt-4">
            <Button variant="outline" className="rounded-[10px]" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] font-bold" onClick={handleAssignAssetSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-1.5" />}
              Assign Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* LOG MAINTENANCE DIALOG */}
      <Dialog open={isAddMaintOpen} onOpenChange={setIsAddMaintOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white border border-slate-100 shadow-2xl rounded-[24px]">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <DialogTitle className="text-lg font-bold text-[#0F172A] text-left">Log Equipment Maintenance</DialogTitle>
            <p className="text-[11px] text-slate-500 mt-0.5 text-left font-medium">Record a new service, repair, or routine inspection for this machinery.</p>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Selected</Label>
              <div className="p-3 bg-slate-50 border border-[#E8ECF0] rounded-[10px] font-bold text-[#0F172A] text-[14px]">
                {selectedAsset?.name} <span className="font-semibold text-slate-400 text-xs ml-1.5">({selectedAsset?.type})</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Type / Action</Label>
                <Input 
                  placeholder="e.g. Routine Oil Change, Track Replacement" 
                  className="rounded-[8px] bg-white font-semibold text-[13px]" 
                  value={maintType}
                  onChange={e => setMaintType(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Serviced By / Vendor</Label>
                <Input 
                  placeholder="e.g. In-house, TechMech Services" 
                  className="rounded-[8px] bg-white text-[13px]" 
                  value={maintBy}
                  onChange={e => setMaintBy(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cost (₹)</Label>
                <Input 
                  type="number"
                  placeholder="0" 
                  className="rounded-[8px] bg-white font-bold text-[13px]" 
                  value={maintCost}
                  onChange={e => setMaintCost(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Date</Label>
                <Input 
                  type="date"
                  className="rounded-[8px] bg-white text-[13px]" 
                  value={maintDate}
                  onChange={e => setMaintDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Notes</Label>
                <Textarea 
                  placeholder="Describe the issues resolved, parts replaced, or general status..." 
                  className="rounded-[8px] bg-white text-[13px]" 
                  value={maintNotes}
                  onChange={e => setMaintNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 border-t border-[#F1F5F9] pt-4">
            <Button variant="outline" className="rounded-[10px]" onClick={() => setIsAddMaintOpen(false)}>Cancel</Button>
            <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] font-bold" onClick={handleAddMaintenanceSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-1.5" />}
              Save Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                       <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-[4px]">{ast.displayId}</span>
                    </div>
                 </div>
                 
                 <h3 className="text-[17px] font-bold text-[#0F172A] leading-tight mb-4">{ast.name}</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-2 mt-auto text-[13px] text-left">
                    <div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider mb-1"><MapPin className="w-3 h-3 text-slate-400"/> Location</span>
                      <span className="font-semibold text-[#0F172A] truncate block" title={ast.location}>{ast.location}</span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider mb-1"><User className="w-3 h-3 text-slate-400"/> Assigned To</span>
                      <span className="font-semibold text-[#0F172A] truncate block" title={ast.assigned}>{ast.assigned}</span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase font-bold tracking-wider mb-1"><Clock className="w-3 h-3 text-slate-400"/> Hrs Used</span>
                      <span className="font-semibold text-[#0F172A]">{ast.hours} <span className="text-slate-400 font-normal ml-0.5">hrs</span></span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-amber-600 text-[11px] uppercase font-bold tracking-wider mb-1"><Wrench className="w-3 h-3 text-amber-500"/> Next Service</span>
                      <span className="font-bold text-amber-700">{ast.nextService}</span>
                    </div>
                 </div>

                 <div className="flex gap-2 mt-6 pt-4 border-t border-[#E8ECF0]">
                    <Button 
                      className="flex-1 bg-white border border-[#E8ECF0] text-[#0F172A] hover:bg-slate-50 text-[13px] h-9 rounded-[8px] shadow-sm font-semibold"
                      onClick={() => {
                        setSelectedAsset(ast);
                        loadMaintenanceLogsForAsset(ast.id);
                        setIsDetailsOpen(true);
                      }}
                    >
                      Details
                    </Button>

                    <Button 
                      className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white text-[13px] h-9 rounded-[8px] shadow-sm font-semibold"
                      onClick={() => triggerAssignModal(ast)}
                    >
                      Assign
                    </Button>
                 </div>
              </CardContent>
            </InteractivePearlCard>
          )})}
        </div>
      ) : (
        <PearlCard>
          <ResponsiveTable>
            <Table>
              <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Asset Details</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Type</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Current Assignment</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Location</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Maintenance</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-left">
                {filteredAssets.map((ast) => (
                  <TableRow key={ast.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                    <TableCell>
                      <div className="font-bold text-[14px] text-[#0F172A]">{ast.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-1">{ast.displayId}</div>
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
                      <Select defaultValue={ast.status} onValueChange={(val) => handleStatusChange(ast.id, val)}>
                        <SelectTrigger className="h-8 w-32 border text-xs font-semibold rounded-[6px] bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-[11px] rounded-[6px] font-semibold text-[#0F172A]"
                        onClick={() => triggerAssignModal(ast)}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTable>
        </PearlCard>
      )}

      {/* SINGLE UNIFIED ASSET DETAILS SHEET */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-[500px] overflow-y-auto bg-white border-l border-[#E8ECF0] shadow-2xl">
          {selectedAsset && (
            <>
              <SheetHeader className="mb-6 border-b border-[#E8ECF0] pb-4">
                <SheetTitle className="text-xl font-bold text-left">{selectedAsset.name}</SheetTitle>
                <div className="flex items-center gap-3 mt-2">
                   <StatusBadge s={selectedAsset.status} />
                   <span className="text-[13px] font-medium text-slate-500">ID: <span className="font-mono">{selectedAsset.id}</span></span>
                </div>
              </SheetHeader>
              
              <div className="space-y-6 text-left">
                 <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0]">
                       <p className="text-[10px] uppercase font-bold text-slate-400">Purchased</p>
                       <p className="font-semibold text-[13px] text-[#0F172A] mt-1">{selectedAsset.purch}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0]">
                       <p className="text-[10px] uppercase font-bold text-slate-400">Cost</p>
                       <p className="font-semibold text-[13px] text-[#0F172A] mt-1">{selectedAsset.cost}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0]">
                       <p className="text-[10px] uppercase font-bold text-slate-400">Total Hrs</p>
                       <p className="font-semibold text-[13px] text-[#0F172A] mt-1">{selectedAsset.hours}</p>
                    </div>
                 </div>

                 <div>
                   <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">7-Day Usage Log</h4>
                   <div className="h-[200px] border border-[#E8ECF0] rounded-[12px] p-2 bg-white">
                     <AssetUsageChart data={usageLogs} />
                   </div>
                 </div>

                 <div>
                    <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                       Maintenance History
                       <Button 
                         variant="ghost" 
                         className="h-6 text-[#0066FF] hover:bg-blue-50 hover:text-[#0066FF] text-[11px] px-2 rounded-[6px]"
                         onClick={() => {
                           setIsAddMaintOpen(true);
                         }}
                       >
                         <Plus className="w-3 h-3 mr-1"/> Log
                       </Button>
                    </h4>
                    {isMaintLogsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin w-5 h-5 text-[#0066FF]" />
                      </div>
                    ) : activeMaintLogs.length > 0 ? (
                      <div className="divide-y divide-[#E8ECF0] border border-[#E8ECF0] rounded-[12px] bg-white text-[13px]">
                        {activeMaintLogs.map((m, idx) => (
                          <div key={m.id || idx} className="p-3 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-[#0F172A]">{m.service_type}</span>
                              <span className="font-bold text-[#0066FF]">₹{Number(m.cost).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mb-1.5">
                              {new Date(m.service_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | By: {m.serviced_by}
                            </div>
                            {m.notes && <p className="text-slate-600 text-[12px] leading-relaxed">{m.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-[12px] text-xs">
                        No maintenance records logged for this equipment.
                      </div>
                    )}
                  </div>
                 
                 <div className="pt-4 border-t border-[#E8ECF0] flex gap-3">
                    {selectedAsset.status === 'Active' ? (
                      <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-[8px] font-bold" onClick={() => handleStatusChange(selectedAsset.id, 'Maintenance')}>Send to Maintenance</Button>
                    ) : (
                      <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[8px] font-bold" onClick={() => handleStatusChange(selectedAsset.id, 'Active')}>Mark as Active</Button>
                    )}
                 </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
