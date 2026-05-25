"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { useState, useEffect } from "react"
import { 
  ClipboardList, Search, Filter, Plus, FileDown,
  CheckCircle, XCircle, AlertCircle, Clock, Info, Package, Loader2
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/toast"
import { createDemandRequest } from "@/app/construction/actions";
import { approveDemand, rejectDemand } from "@/app/dashboard/construction/actions";

// Mock array replaced by props
const PriorityBadge = ({ p }: { p: string }) => {
  if (p === 'Urgent') return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 text-[10px] uppercase font-bold shadow-none">Urgent</Badge>;
  if (p === 'Normal') return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] uppercase font-bold shadow-none">Normal</Badge>;
  return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] uppercase font-bold shadow-none">Low</Badge>;
};

const StatusBadge = ({ s, r }: { s: string, r: string | null }) => {
  if (s === 'Pending') return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] uppercase font-bold shadow-none"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
  if (s === 'Approved') return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] uppercase font-bold shadow-none"><CheckCircle className="w-3 h-3 mr-1"/> Approved</Badge>;
  return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px] uppercase font-bold shadow-none"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>;
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

export default function DemandsClient({ 
  initialDemands, 
  inventoryItems,
  sessionUser,
  dbUsers
}: { 
  initialDemands: any[]; 
  inventoryItems: any[];
  sessionUser?: any;
  dbUsers?: any[];
}) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [isRaiseFormOpen, setIsRaiseFormOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [localDemands, setLocalDemands] = useState<any[]>(initialDemands);
  const [localInventory, setLocalInventory] = useState<any[]>(inventoryItems || []);

  // Form states
  const [selectedItemId, setSelectedItemId] = useState("");
  const [qtyInput, setQtyInput] = useState("");
  const [towerInput, setTowerInput] = useState("Tower A");
  const [priorityInput, setPriorityInput] = useState("Normal");
  const [requiredDateInput, setRequiredDateInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  useEffect(() => {
    setLocalDemands(initialDemands);
  }, [initialDemands]);

  useEffect(() => {
    setLocalInventory(inventoryItems);
  }, [inventoryItems]);

  const handleApprove = async (id: string) => {
    setIsActionLoading(true);
    const res = await approveDemand(id);
    setIsActionLoading(false);
    if (res?.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Demand Approved", description: "Material stock has been allocated successfully." });
      setLocalDemands(prev => prev.map(d => d.id === id ? { ...d, status: 'Approved' } : d));
      setSelectedReq(null);
    }
  };

  const handleReject = async (id: string) => {
    setIsActionLoading(true);
    const res = await rejectDemand(id);
    setIsActionLoading(false);
    if (res?.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Demand Rejected", description: "The request has been rejected." });
      setLocalDemands(prev => prev.map(d => d.id === id ? { ...d, status: 'Rejected' } : d));
      setSelectedReq(null);
    }
  };

  const handleRaiseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !qtyInput || parseFloat(qtyInput) <= 0) {
      toast({ title: "Validation Error", description: "Please select a material and enter a valid quantity.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    // Dynamically retrieve the valid user ID
    // We check if sessionUser.id exists in our database users to prevent foreign key constraint violations
    const isValidUser = dbUsers && dbUsers.some(u => u.id === sessionUser?.id);
    const managerId = isValidUser 
      ? sessionUser.id 
      : (dbUsers && dbUsers.length > 0 ? (dbUsers.find(u => u.role === 'SITE_MANAGER')?.id || dbUsers[0].id) : "workos-site-001");
    
    const res = await createDemandRequest(
      selectedItemId,
      parseFloat(qtyInput),
      managerId,
      towerInput,
      notesInput,
      requiredDateInput
    );
    setIsSubmitting(false);

    if (res.error) {
      toast({ title: "Failed to submit", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Requisition Sent", description: "Your material demand requisition has been submitted." });
      setIsRaiseFormOpen(false);
      // Reset form
      setSelectedItemId("");
      setQtyInput("");
      setNotesInput("");
      setRequiredDateInput("");

      // Optimistically append or trigger full data reload
      window.location.reload();
    }
  };

  const selectedItemDetails = localInventory.find(item => item.id === selectedItemId);

  const demandRequests = localDemands.map(r => {
    const item = r.item || r.material || {};
    const reqUser = r.requested_by || r.requested_by_user || {};
    const appUser = r.approved_by || r.approved_by_user || {};
    const unit = item.unit_of_measurement || item.unit || 'units';
    const name = item.name || item.item_name || 'Material';
    const quantity = r.quantity_requested !== undefined ? r.quantity_requested : (r.quantity !== undefined ? r.quantity : 0);
    const requiredDate = r.required_by || r.required_date;

    return {
      id: r.id,
      shortId: r.id?.substring(0,8) || 'Unknown',
      by: reqUser.name || 'Unknown User',
      role: reqUser.role || 'Staff',
      material: name,
      qty: `${quantity} ${unit}`,
      qtyVal: quantity,
      itemId: item.id || r.item_id || '',
      site: r.project_tower || (r.project?.name) || 'Site',
      priority: r.priority || 'Normal',
      date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      requiredBy: requiredDate ? new Date(requiredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      status: r.status || 'Pending',
      reviewer: appUser.name || null,
      stock: item.current_stock_level !== undefined ? item.current_stock_level : (item.quantity !== undefined ? item.quantity : 0),
      unit: unit
    };
  });

  const filteredRequests = demandRequests.filter(r => activeTab === 'all' || r.status.toLowerCase() === activeTab);

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Demand Requests</h1>
        <p className="text-sm text-slate-500">Manage site material requests, approvals, and allocation tracking.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Requests</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{demandRequests.length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Pending Approval</p>
            <div className="flex items-center gap-3">
              <h3 className="text-[32px] font-bold text-[#F59E0B] leading-tight">{demandRequests.filter(r => r.status === 'Pending').length}</h3>
              {demandRequests.filter(r => r.status === 'Pending' && r.priority === 'Urgent').length > 0 && (
                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 shadow-none border-none text-[10px] font-bold">
                  {demandRequests.filter(r => r.status === 'Pending' && r.priority === 'Urgent').length} Urgent
                </Badge>
              )}
            </div>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Approved Processing</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight">{demandRequests.filter(r => r.status === 'Approved').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Rejected</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight">{demandRequests.filter(r => r.status === 'Rejected').length}</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* RAISE NEW REQUEST CONFIG */}
      <section className={`transition-all duration-300 ${isRaiseFormOpen ? 'block' : 'hidden'}`}>
        <form onSubmit={handleRaiseSubmit}>
          <PearlCard className="p-6 border-[#0066FF] shadow-sm shadow-blue-100 bg-white">
             <div className="flex justify-between items-center mb-6 border-b border-[#E8ECF0] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0066FF] flex items-center gap-2"><Plus className="w-5 h-5"/> Raise New Material Demand</h3>
                  <p className="text-sm text-slate-500 mt-1">Submit a requirement for site operations. Approvals typically take 2-4 hours.</p>
                </div>
                <Button type="button" variant="ghost" onClick={() => setIsRaiseFormOpen(false)} className="text-slate-500 hover:bg-slate-100 rounded-[8px]">Cancel</Button>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4 col-span-2 text-left">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label className="font-semibold text-slate-700">Material Required</Label>
                       <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                         <SelectTrigger className="bg-slate-50 h-10 rounded-[8px] border-slate-200"><SelectValue placeholder="Search material..." /></SelectTrigger>
                         <SelectContent className="bg-white">
                           {localInventory.map((item) => (
                             <SelectItem key={item.id} value={item.id}>{item.name} ({item.category})</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label className="font-semibold text-slate-700">Quantity Required {selectedItemDetails ? `(${selectedItemDetails.unit_of_measurement})` : ''}</Label>
                       <Input 
                         type="number" 
                         step="0.01"
                         placeholder="e.g. 50" 
                         value={qtyInput}
                         onChange={(e) => setQtyInput(e.target.value)}
                         className="bg-slate-50 h-10 rounded-[8px] border-slate-200" 
                         required
                       />
                     </div>
                     <div className="space-y-2">
                       <Label className="font-semibold text-slate-700">Project / Tower</Label>
                       <Select value={towerInput} onValueChange={setTowerInput}>
                         <SelectTrigger className="bg-slate-50 h-10 rounded-[8px] border-slate-200"><SelectValue /></SelectTrigger>
                         <SelectContent className="bg-white">
                           <SelectItem value="Tower A">Tower A</SelectItem>
                           <SelectItem value="Tower B">Tower B</SelectItem>
                           <SelectItem value="Tower C">Tower C</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label className="font-semibold text-slate-700">Priority Level</Label>
                       <Select value={priorityInput} onValueChange={setPriorityInput}>
                         <SelectTrigger className="bg-slate-50 h-10 rounded-[8px] border-slate-200"><SelectValue /></SelectTrigger>
                         <SelectContent className="bg-white">
                           <SelectItem value="Urgent">Urgent</SelectItem>
                           <SelectItem value="Normal">Normal</SelectItem>
                           <SelectItem value="Low">Low</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2 col-span-2">
                       <Label className="font-semibold text-slate-700">Required By Date</Label>
                       <Input 
                         type="date" 
                         value={requiredDateInput}
                         onChange={(e) => setRequiredDateInput(e.target.value)}
                         className="bg-slate-50 h-10 rounded-[8px] border-slate-200" 
                         required
                       />
                     </div>
                   </div>
                   <div className="space-y-2">
                      <Label className="font-semibold text-slate-700">Justification / Usage Details</Label>
                      <Textarea 
                        placeholder="Explain why this material is needed..." 
                        rows={3} 
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        className="bg-slate-50 rounded-[8px] border-slate-200" 
                        required
                      />
                   </div>
                </div>
                
                <div className="bg-blue-50/50 border border-blue-100 rounded-[12px] p-5 flex flex-col h-full bg-gradient-to-b from-blue-50/50 to-white text-left">
                   <h4 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500"/> Current Stock Lookup</h4>
                   {selectedItemDetails ? (
                     <div className="space-y-4 flex-1">
                       <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                         <p className="text-[10px] uppercase font-bold text-slate-400">Material Category</p>
                         <p className="font-bold text-sm text-[#0F172A]">{selectedItemDetails.category}</p>
                       </div>
                       
                       <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm flex justify-between items-center">
                         <div>
                           <p className="text-[10px] uppercase font-bold text-slate-400">Current Stock</p>
                           <p className="font-extrabold text-lg text-[#0F172A]">
                             {selectedItemDetails.current_stock_level} <span className="text-xs font-semibold text-slate-500">{selectedItemDetails.unit_of_measurement}</span>
                           </p>
                         </div>
                         <Badge variant="outline" className={`h-5 text-[9px] uppercase font-bold ${
                           selectedItemDetails.current_stock_level > selectedItemDetails.min_threshold * 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                           selectedItemDetails.current_stock_level > selectedItemDetails.min_threshold ? 'bg-amber-50 text-amber-700 border-amber-200' :
                           'bg-red-50 text-red-700 border-red-200'
                         }`}>
                           {selectedItemDetails.current_stock_level > selectedItemDetails.min_threshold * 2 ? 'Good' :
                            selectedItemDetails.current_stock_level > selectedItemDetails.min_threshold ? 'Low' : 'Critical'}
                         </Badge>
                       </div>

                       <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                         <p className="text-[10px] uppercase font-bold text-slate-400 font-semibold">Min Alert Threshold</p>
                         <p className="font-bold text-sm text-slate-700">{selectedItemDetails.min_threshold} {selectedItemDetails.unit_of_measurement}</p>
                       </div>
                       
                       {selectedItemDetails.current_stock_level <= selectedItemDetails.min_threshold && (
                         <div className="flex gap-2 items-start bg-red-50 border border-red-100 p-2.5 rounded-lg text-red-700 text-xs mt-1">
                           <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                           <p className="font-medium">Warning: Current stock is below safety threshold! Ordering is highly recommended.</p>
                         </div>
                       )}
                     </div>
                   ) : (
                     <div className="flex-1 text-center flex flex-col items-center justify-center space-y-3 opacity-60">
                        <Package className="w-10 h-10 text-slate-400" />
                        <p className="text-sm font-medium text-slate-500">Select a material to view current stock levels and alerts.</p>
                     </div>
                   )}
                   <Button type="submit" disabled={isSubmitting} className="w-full mt-auto bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm flex items-center justify-center gap-1.5">
                     {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
                     Submit Request
                   </Button>
                </div>
             </div>
          </PearlCard>
        </form>
      </section>

      {/* FILTER BAR & TABS */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#E8ECF0] pb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-[10px]">
             <TabsTrigger value="all" className="rounded-[8px] text-[12px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0066FF]">All</TabsTrigger>
             <TabsTrigger value="pending" className="rounded-[8px] text-[12px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600">Pending</TabsTrigger>
             <TabsTrigger value="approved" className="rounded-[8px] text-[12px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600">Approved</TabsTrigger>
             <TabsTrigger value="rejected" className="rounded-[8px] text-[12px] font-bold uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {!isRaiseFormOpen && (
          <Button onClick={() => setIsRaiseFormOpen(true)} className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2">
            <Plus className="w-4 h-4" /> Raise Request
          </Button>
        )}
      </section>

      {/* REQUESTS TABLE */}
      <section>
        <PearlCard>
          <ResponsiveTable>
<Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Request Details</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Requested By</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Material & Qty</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Project Site</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0066FF] cursor-pointer hover:underline mb-1">{req.id}</div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge p={req.priority} />
                      <span className="text-[11px] text-slate-500 font-medium">{req.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[13px] text-[#0F172A]">{req.by}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{req.role}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{req.material}</div>
                    <div className="text-[13px] font-semibold text-slate-600 mt-0.5">{req.qty}</div>
                  </TableCell>
                  <TableCell>
                     <div className="font-medium text-[13px] text-[#0F172A]">{req.site}</div>
                     <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3"/> Req by: {req.requiredBy}</div>
                  </TableCell>
                  <TableCell>
                     <StatusBadge s={req.status} r={req.reviewer} />
                  </TableCell>
                  <TableCell className="text-right">
                     {/* APPROVAL DIALOG */}
                     <Dialog>
                       <DialogTrigger asChild>
                         {req.status === 'Pending' ? (
                           <Button size="sm" className="h-8 text-[11px] rounded-[8px] bg-white border border-[#0066FF] text-[#0066FF] hover:bg-blue-50 font-bold shadow-sm" onClick={() => setSelectedReq(req)}>Review</Button>
                         ) : (
                           <Button variant="ghost" size="sm" className="h-8 text-[11px] rounded-[8px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100" onClick={() => setSelectedReq(req)}>View</Button>
                         )}
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                         {selectedReq && (
                           <>
                             <div className="bg-slate-50 p-6 border-b border-[#E8ECF0]">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h2 className="text-xl font-bold text-[#0F172A] mb-1">Request {selectedReq.id}</h2>
                                    <p className="text-sm text-slate-500">Submitted on {selectedReq.date} by <span className="font-bold text-[#0F172A]">{selectedReq.by}</span></p>
                                  </div>
                                  <StatusBadge s={selectedReq.status} r={selectedReq.reviewer} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                  <div className="bg-white p-3 rounded-[10px] border border-[#E8ECF0] shadow-sm">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Material Requested</p>
                                    <p className="font-bold text-[15px]">{selectedReq.material}</p>
                                    <p className="text-[13px] font-semibold text-[#0066FF] mt-1">{selectedReq.qty}</p>
                                  </div>
                                  <div className="bg-white p-3 rounded-[10px] border border-[#E8ECF0] shadow-sm">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Delivery Site</p>
                                    <p className="font-bold text-[14px]">{selectedReq.site}</p>
                                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1"><PriorityBadge p={selectedReq.priority}/> By {selectedReq.requiredBy}</p>
                                  </div>
                                </div>
                             </div>

                             <div className="p-6">
                                <div className="mb-6 flex items-start gap-3 p-3 bg-blue-50/50 rounded-[10px] border border-blue-100">
                                   <Package className="w-5 h-5 text-[#0066FF] mt-0.5" />
                                   <div>
                                     <h4 className="font-bold text-[13px] text-[#0F172A]">Current Inventory Check</h4>
                                     {selectedReq.stock > parseInt(selectedReq.qty) ? (
                                        <p className="text-sm text-slate-600 mt-1">There is sufficient stock (<span className="font-bold">{selectedReq.stock} {selectedReq.unit}</span>) to fulfill this request.</p>
                                     ) : (
                                        <p className="text-sm text-red-600 font-medium mt-1">Warning: Current stock (<span className="font-bold">{selectedReq.stock} {selectedReq.unit}</span>) is insufficient to fulfill this request.</p>
                                     )}
                                   </div>
                                </div>

                                 {selectedReq.status === 'Pending' && (
                                   <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label className="font-semibold">Reviewer Notes</Label>
                                        <Textarea placeholder="Add comments before approving/rejecting..." className="rounded-[8px] bg-slate-50" />
                                      </div>
                                      <div className="flex gap-3 pt-2">
                                        <Button 
                                          className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-[8px] h-11 font-bold text-[14px] shadow-sm flex items-center justify-center gap-2"
                                          onClick={() => handleApprove(selectedReq.id)}
                                          disabled={isActionLoading}
                                        >
                                          {isActionLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                          Approve & Allocate
                                        </Button>
                                        <Button 
                                          className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-[8px] h-11 font-bold text-[14px] shadow-sm flex items-center justify-center gap-2"
                                          onClick={() => handleReject(selectedReq.id)}
                                          disabled={isActionLoading}
                                        >
                                          {isActionLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                          Reject Request
                                        </Button>
                                      </div>
                                   </div>
                                )}
                             </div>
                           </>
                         )}
                       </DialogContent>
                     </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
</ResponsiveTable>
        </PearlCard>
      </section>

    </div>
  )
}
