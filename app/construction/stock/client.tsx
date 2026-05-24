"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";

import { useState } from "react";
import { 
  Package, Search, Filter, Plus, FileDown,
  Edit, Trash2, History, AlertTriangle, CheckCircle, Clock, Loader2 
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
import { createDemandRequest } from "@/app/construction/actions";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stockHistoryData = [
  { day: "1", qty: 150 }, { day: "5", qty: 140 }, { day: "10", qty: 140 },
  { day: "15", qty: 110 }, { day: "20", qty: 85 }, { day: "25", qty: 120 }, { day: "30", qty: 120 }
];

const txHistory = [
  { date: "Mar 18, 2026", type: "Used", qty: "-10", ref: "Tower A, Fl 12", by: "Ravi Kumar" },
  { date: "Mar 15, 2026", type: "Added", qty: "+50", ref: "PO-2026-089", by: "Amit M" },
  { date: "Mar 10, 2026", type: "Used", qty: "-35", ref: "Tower B, Fl 8", by: "Sunil Sharma" },
  { date: "Mar 05, 2026", type: "Adjusted", qty: "-5", ref: "Damage written off", by: "Amit M" },
];

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

export default function StockClient({ items, stats }: { items: any[], stats: any }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestock, setSelectedRestock] = useState<any>(null);

  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qtyInput, setQtyInput] = useState("");
  const [justificationInput, setJustificationInput] = useState("");
  const [requiredByInput, setRequiredByInput] = useState("");
  const [towerInput, setTowerInput] = useState("Tower A");

  const totalValue = (items || []).reduce((sum, item) => sum + (Number(item.current_stock_level || 0) * Number(item.unit_cost || 0)), 0);

  const formatCur = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Stock & Materials Management</h1>
        <p className="text-sm text-slate-500">Track inventory levels, manage restock requests, and monitor material usage.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Items</p>
            <h3 className="text-[28px] font-bold text-[#0F172A] leading-tight">{stats?.total || items.length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Good Stock</p>
            <h3 className="text-[28px] font-bold text-[#10B981] leading-tight">{stats?.good || items.filter(item => (item.current_stock_level || 0) > (item.min_threshold || 0) * 2).length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#F59E0B]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Low Stock</p>
            <h3 className="text-[28px] font-bold text-[#F59E0B] leading-tight">{stats?.low || items.filter(item => (item.current_stock_level || 0) > (item.min_threshold || 0) && (item.current_stock_level || 0) <= (item.min_threshold || 0) * 2).length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Critical</p>
            <h3 className="text-[28px] font-bold text-[#EF4444] leading-tight">{stats?.critical || items.filter(item => (item.current_stock_level || 0) <= (item.min_threshold || 0)).length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
             <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Value</p>
             <h3 className="text-[28px] font-bold text-[#0F172A] leading-tight">₹{(totalValue / 100000).toFixed(1)}L</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search material..." 
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Cement">Cement</SelectItem>
              <SelectItem value="Steel">Steel</SelectItem>
              <SelectItem value="Bricks">Bricks</SelectItem>
              <SelectItem value="Sand">Sand</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* MATERIALS TABLE */}
      <section>
        <PearlCard>
          <ResponsiveTable>
<Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Material</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Qty / Unit</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Min Threshold</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Unit Cost</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Total Value</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.filter(m => (m.name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((item) => {
                const itemValue = (item.current_stock_level || 0) * (item.unit_cost || 0);
                const status = item.current_stock_level > item.min_threshold * 2 ? 'Good' : item.current_stock_level > item.min_threshold ? 'Low' : 'Critical';
                return (
                <TableRow key={item.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                       <span className="font-bold text-[14px] text-[#0F172A]">{item.name}</span>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono">{item.id?.substring(0,8)}</span>
                          <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[4px] text-[9px] font-semibold uppercase border-slate-200 tracking-wider">
                            {item.category}
                          </Badge>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{item.current_stock_level} <span className="text-[12px] font-medium text-slate-500">{item.unit_of_measurement}</span></div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Updated: {new Date(item.updated_at).toLocaleDateString()}</div>
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium text-sm">{item.min_threshold}</TableCell>
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
                  <TableCell className="text-right font-medium text-[13px]">{formatCur(item.unit_cost || 0)}</TableCell>
                  <TableCell className="text-right font-bold text-[14px]">{formatCur(itemValue)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                       {/* HISTORY DRAWER */}
                       <Sheet>
                         <SheetTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-[8px]" title="History">
                             <History className="h-4 w-4" />
                           </Button>
                         </SheetTrigger>
                         <SheetContent className="sm:max-w-[450px]">
                           <SheetHeader className="mb-6">
                             <SheetTitle className="text-xl font-bold">{item.name}</SheetTitle>
                             <div className="flex items-center gap-2 mt-2">
                               <Badge variant="outline" className="bg-slate-50">{item.category}</Badge>
                               <Badge variant="secondary" className="bg-blue-50 text-blue-700">Stock: {item.current_stock_level} {item.unit_of_measurement}</Badge>
                             </div>
                           </SheetHeader>
                           
                           <div className="space-y-6">
                             <div>
                               <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">30-Day Trend</h4>
                               <div className="h-[200px] border border-[#E8ECF0] rounded-[12px] p-2 bg-slate-50/50">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stockHistoryData}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0"/>
                                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
                                      <Line type="monotone" dataKey="qty" stroke="#0066FF" strokeWidth={2.5} dot={{r: 4, fill: '#0066FF'}} activeDot={{r: 6, fill: '#FFFFFF', stroke: '#0066FF', strokeWidth: 2}}/>
                                    </LineChart>
                                 </ResponsiveContainer>
                               </div>
                             </div>

                             <div>
                               <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Transactions</h4>
                               <div className="divide-y divide-[#E8ECF0] border border-[#E8ECF0] rounded-[12px] bg-white">
                                  {txHistory.map((tx, idx) => (
                                    <div key={idx} className="p-3 hover:bg-slate-50 flex justify-between items-center transition-colors">
                                      <div>
                                        <div className="font-bold text-[13px] text-[#0F172A]">{tx.type} <span className="text-slate-400 font-normal mx-1">•</span> {tx.ref}</div>
                                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{tx.date} | By: {tx.by}</div>
                                      </div>
                                      <div className={`font-bold text-[14px] ${tx.qty.startsWith('+') ? 'text-[#10B981]' : tx.qty.startsWith('-') ? 'text-[#0F172A]' : 'text-slate-600'}`}>
                                        {tx.qty}
                                      </div>
                                    </div>
                                  ))}
                               </div>
                             </div>
                           </div>
                         </SheetContent>
                       </Sheet>

                       {/* DEMAND REQUISITION DIALOG */}
                       <Dialog open={isRequestOpen && selectedRestock?.id === item.id} onOpenChange={(open) => {
                         if (!open) {
                           setIsRequestOpen(false);
                         } else {
                           setSelectedRestock(item);
                           setIsRequestOpen(true);
                           setQtyInput("");
                           setJustificationInput("");
                           setRequiredByInput("");
                           setTowerInput("Tower A");
                         }
                       }}>
                         <DialogTrigger asChild>
                           <Button 
                             variant="outline" 
                             size="sm" 
                             className="h-8 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 rounded-[8px] bg-orange-50/50 font-semibold"
                             onClick={() => {
                               setSelectedRestock(item);
                               setIsRequestOpen(true);
                               setQtyInput("");
                               setJustificationInput("");
                               setRequiredByInput("");
                               setTowerInput("Tower A");
                             }}
                           >
                               Request
                           </Button>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-[450px] bg-white rounded-[16px] border border-slate-100 shadow-xl">
                           <DialogHeader>
                             <DialogTitle className="text-xl font-bold text-slate-900">Demand Requisition</DialogTitle>
                           </DialogHeader>
                           {selectedRestock && (
                             <form onSubmit={async (e) => {
                               e.preventDefault();
                               setIsSubmitting(true);
                               const res = await createDemandRequest(
                                 selectedRestock.id,
                                 parseFloat(qtyInput) || 0,
                                 "00000000-0000-0000-0000-000000000001", // अर्जुन मेहता (Stable User ID)
                                 towerInput,
                                 justificationInput,
                                 requiredByInput
                               );
                               setIsSubmitting(false);
                               if (res.error) {
                                 toast({ title: "Failed to Submit", description: res.error, variant: "destructive" });
                               } else {
                                 toast({ title: "Requisition Sent", description: "Your material demand requisition has been submitted." });
                                 setIsRequestOpen(false);
                               }
                             }} className="space-y-4 pt-4">
                               <div className="p-3 bg-slate-50 rounded-[10px] border border-[#E8ECF0] flex justify-between items-center shadow-sm">
                                  <div>
                                    <div className="font-bold text-[14px] text-[#0F172A]">{selectedRestock.name}</div>
                                    <div className="text-[12px] text-slate-500 font-medium">Current Stock: {selectedRestock.current_stock_level} {selectedRestock.unit_of_measurement}</div>
                                  </div>
                                  {status === 'Critical' && <Badge variant="destructive" className="h-5 text-[10px] rounded-full px-2 uppercase shadow-none tracking-wider bg-red-100 text-red-700 hover:bg-red-100 border-none">Critical</Badge>}
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold">Quantity Required ({selectedRestock.unit_of_measurement})</Label>
                                 <Input 
                                   type="number" 
                                   placeholder="Enter quantity" 
                                   value={qtyInput}
                                   onChange={(e) => setQtyInput(e.target.value)}
                                   required 
                                   min="0.01" 
                                   className="h-10 rounded-[8px]" 
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold">Target Tower</Label>
                                 <Select value={towerInput} onValueChange={setTowerInput}>
                                   <SelectTrigger className="h-10 rounded-[8px] bg-white"><SelectValue /></SelectTrigger>
                                   <SelectContent className="bg-white">
                                     <SelectItem value="Tower A">Tower A</SelectItem>
                                     <SelectItem value="Tower B">Tower B</SelectItem>
                                     <SelectItem value="Tower C">Tower C</SelectItem>
                                     <SelectItem value="Tower D">Tower D</SelectItem>
                                   </SelectContent>
                                 </Select>
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold">Required By Date</Label>
                                 <Input 
                                   type="date" 
                                   value={requiredByInput}
                                   onChange={(e) => setRequiredByInput(e.target.value)}
                                   required 
                                   className="h-10 rounded-[8px]" 
                                 />
                               </div>
                               <div className="space-y-2">
                                 <Label className="text-slate-600 font-semibold">Notes / Justification</Label>
                                 <Textarea 
                                   placeholder="Specific requirements or reason..." 
                                   rows={3} 
                                   value={justificationInput}
                                   onChange={(e) => setJustificationInput(e.target.value)}
                                   className="rounded-[8px]" 
                                 />
                               </div>
                               <DialogFooter className="gap-2 sm:gap-0 pt-4">
                                 <Button type="button" variant="outline" className="rounded-[8px] h-10" onClick={() => setIsRequestOpen(false)}>Cancel</Button>
                                 <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 text-white rounded-[8px] h-10 font-bold shadow-sm flex items-center justify-center gap-2">
                                   {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
                                   Submit Request
                                 </Button>
                               </DialogFooter>
                             </form>
                           )}
                         </DialogContent>
                       </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              );})}
              {(items.length === 0) && (
                <TableRow><TableCell colSpan={7} className="text-center py-6 text-gray-500">No materials found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
</ResponsiveTable>
        </PearlCard>
      </section>
    </div>
  );
}
