"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { 
  createVendor, 
  updateVendor, 
  deleteVendor, 
  createVendorOrder,
  fetchVendorsList,
  fetchVendorOrdersList,
  recordVendorPayment
} from "@/app/construction/actions";

import { 
  Building2, Search, Filter, Plus, FileDown, Phone,
  Star, ShoppingBag, CreditCard, Box, MapPin, Mail, AlertTriangle, 
  Trash, Loader2, MoreVertical, Edit, FileText, Check, Clock 
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COMMON_MATERIALS = [
  { id: "Cement PPC", name: "Cement PPC", unit_of_measurement: "Bags", unit_cost: 320 },
  { id: "Cement OPC", name: "Cement OPC", unit_of_measurement: "Bags", unit_cost: 350 },
  { id: "TMT Steel Bars", name: "TMT Steel Bars", unit_of_measurement: "Tons", unit_cost: 58000 },
  { id: "River Sand", name: "River Sand", unit_of_measurement: "Brass", unit_cost: 4500 },
  { id: "Coarse Aggregate (20mm)", name: "Coarse Aggregate (20mm)", unit_of_measurement: "Brass", unit_cost: 3800 },
  { id: "Clay Bricks", name: "Clay Bricks", unit_of_measurement: "Pcs", unit_cost: 8 },
  { id: "Fly Ash Bricks", name: "Fly Ash Bricks", unit_of_measurement: "Pcs", unit_cost: 11 },
];

const formatCur = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

export default function VendorsClient({ 
  initialVendors, 
  initialOrders 
}: { 
  initialVendors: any[], 
  initialOrders: any[] 
}) {
  const { toast } = useToast();
  
  // Database local states
  const [localVendors, setLocalVendors] = useState<any[]>(initialVendors);
  const [localOrders, setLocalOrders] = useState<any[]>(initialOrders);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modals state
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
  const [isViewOrdersOpen, setIsViewOrdersOpen] = useState(false);
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State - Record Payment
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Form State - Add/Edit Vendor
  const [vendorName, setVendorName] = useState("");
  const [vendorCategory, setVendorCategory] = useState("Cement & Concrete");
  const [vendorContact, setVendorContact] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorLimit, setVendorLimit] = useState("");
  const [vendorRating, setVendorRating] = useState("5");
  const [vendorStatus, setVendorStatus] = useState("Active");

  // Form State - Purchase Order Items
  const [orderItems, setOrderItems] = useState<Array<{ materialId: string; customName: string; quantity: number; unitPrice: number }>>([
    { materialId: "", customName: "", quantity: 1, unitPrice: 0 }
  ]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("net30");
  const [orderNotes, setOrderNotes] = useState("");

  const reloadData = async () => {
    const freshVendors = await fetchVendorsList();
    if (freshVendors.success && freshVendors.data) {
      setLocalVendors(freshVendors.data);
    }
    const freshOrders = await fetchVendorOrdersList("all");
    if (freshOrders.success && freshOrders.data) {
      setLocalOrders(freshOrders.data);
    }
  };

  // Add a new vendor account
  const handleAddVendor = async () => {
    if (!vendorName.trim() || !vendorCategory || !vendorPhone.trim()) {
      toast({
        title: "Validation Error",
        description: "Vendor Name, Category, and Phone fields are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const res = await createVendor(
      vendorName,
      vendorCategory,
      vendorContact,
      vendorPhone,
      vendorEmail,
      parseFloat(vendorLimit) || 0,
      parseInt(vendorRating) || 5,
      vendorStatus
    );
    setIsSubmitting(false);

    if (res.error) {
      toast({ title: "Addition Failed", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Vendor Created", description: "Supplier profile has been successfully saved!" });
      setIsAddVendorOpen(false);
      resetVendorForm();
      await reloadData();
    }
  };

  // Edit existing vendor account
  const handleEditVendor = async () => {
    if (!selectedVendor) return;
    if (!vendorName.trim() || !vendorCategory || !vendorPhone.trim()) {
      toast({
        title: "Validation Error",
        description: "Vendor Name, Category, and Phone fields are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const res = await updateVendor(
      selectedVendor.id,
      vendorName,
      vendorCategory,
      vendorContact,
      vendorPhone,
      vendorEmail,
      parseFloat(vendorLimit) || 0,
      parseInt(vendorRating) || 5,
      vendorStatus
    );
    setIsSubmitting(false);

    if (res.error) {
      toast({ title: "Edit Failed", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Vendor Updated", description: "Supplier profile parameters successfully modified!" });
      setIsEditVendorOpen(false);
      resetVendorForm();
      await reloadData();
    }
  };

  // Delete vendor account
  const handleDeleteVendor = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this supplier? This action cannot be undone.")) return;

    const res = await deleteVendor(id);
    if (res.error) {
      toast({ title: "Delete Failed", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Vendor Deleted", description: "Supplier profile permanently removed." });
      await reloadData();
    }
  };

  // Record dynamic payment to vendor and sync with financial ledger
  const handleRecordPayment = async () => {
    if (!selectedVendor) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please specify a valid payment amount greater than zero.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const res = await recordVendorPayment(selectedVendor.id, amount, paymentNotes);
    setIsSubmitting(false);

    if (res.error) {
      toast({ title: "Payment Failed", description: res.error, variant: "destructive" });
    } else {
      toast({
        title: "Payment Recorded",
        description: `Successfully paid ${formatCur(amount)} to ${selectedVendor.name}. Outstanding balance updated and ledger expense created!`
      });
      setIsRecordPaymentOpen(false);
      setPaymentAmount("");
      setPaymentNotes("");
      
      // Update local orders/vendors if needed or just reloadData
      await reloadData();
    }
  };

  // Place Purchase Order
  const handlePlaceOrder = async () => {
    if (!selectedVendor) return;
    if (!deliveryDate) {
      toast({ title: "Error", description: "Please specify an expected delivery date.", variant: "destructive" });
      return;
    }

    const invalidItem = orderItems.find(item => !item.materialId && !item.customName.trim());
    if (invalidItem) {
      toast({ title: "Error", description: "Please specify a material or enter a custom name for all items.", variant: "destructive" });
      return;
    }

    const invalidQty = orderItems.find(item => item.quantity <= 0);
    if (invalidQty) {
      toast({ title: "Error", description: "Quantity must be greater than 0.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const mappedItems = orderItems.map(item => {
      const selectedMat = COMMON_MATERIALS.find(m => m.id === item.materialId);
      return {
        material_id: item.materialId === "custom" ? null : (item.materialId || null),
        name: item.materialId === "custom" || !item.materialId ? item.customName : (selectedMat?.name || "Unknown"),
        quantity: item.quantity,
        unit_price: item.unitPrice,
        unit_of_measurement: selectedMat?.unit_of_measurement || "Units",
        total: item.quantity * item.unitPrice
      };
    });

    const res = await createVendorOrder(
      selectedVendor.id,
      mappedItems,
      deliveryDate,
      paymentTerms
    );

    setIsSubmitting(false);

    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Order Placed Successfully", description: "Your purchase order has been generated!" });
      setIsOrderSheetOpen(false);
      
      // Update local orders list to update stats and orders tab
      if (res.data) {
        setLocalOrders([res.data, ...localOrders]);
      }

      setOrderItems([{ materialId: "", customName: "", quantity: 1, unitPrice: 0 }]);
      setDeliveryDate("");
      setPaymentTerms("net30");
      setOrderNotes("");
    }
  };

  const triggerEditModal = (v: any) => {
    setSelectedVendor(v);
    setVendorName(v.name || "");
    setVendorCategory(v.category || "Cement & Concrete");
    setVendorContact(v.contact_person || v.contact || "");
    setVendorPhone(v.phone || "");
    setVendorEmail(v.email || "");
    setVendorLimit(v.credit_limit?.toString() || v.limit?.toString() || "");
    setVendorRating(v.rating?.toString() || "5");
    setVendorStatus(v.status || "Active");
    setIsEditVendorOpen(true);
  };

  const resetVendorForm = () => {
    setVendorName("");
    setVendorCategory("Cement & Concrete");
    setVendorContact("");
    setVendorPhone("");
    setVendorEmail("");
    setVendorLimit("");
    setVendorRating("5");
    setVendorStatus("Active");
  };

  // Compile active vendor list with proper falls
  const vendorsList = localVendors.map((v, i) => {
    const vendorId = v.id || `VND-10${i+1}`;
    
    // Calculate total orders placed for this vendor
    const totalOrders = localOrders.filter(o => o.vendor_id === vendorId).length || v.total_orders || 0;

    return {
      id: vendorId,
      displayId: vendorId.substring(0, 8),
      name: v.name || 'Unknown Vendor',
      cat: v.category || 'General',
      contact: v.contact_person || v.contact || 'N/A',
      phone: v.phone || '--',
      email: v.email || '--',
      out: v.outstanding_amount || v.outstanding_balance || 0,
      limit: v.credit_limit || 0,
      date: v.created_at ? new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Mar 15, 2026",
      orders: totalOrders,
      rating: v.rating || 5,
      status: v.status || 'Active'
    };
  });

  // Calculate dynamic KPIs from real database values
  const totalVendors = vendorsList.length;
  const activeAccounts = vendorsList.filter(v => v.status === "Active").length;
  const totalOutstanding = vendorsList.reduce((acc, v) => acc + v.out, 0);

  // Orders This Month (Dynamic calculation based on date timestamps)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const ordersThisMonth = localOrders.filter(o => {
    const d = new Date(o.created_at || o.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  // Extract unique category options for filtering
  const dynamicCategories = Array.from(new Set(vendorsList.map(v => v.cat))).filter(Boolean);

  // Apply search + category + status filtering
  const filteredVendors = vendorsList.filter(v => {
    const matchSearch = !searchTerm || 
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.displayId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = filterCategory === "all" || v.cat === filterCategory;
    const matchStatus = filterStatus === "all" || v.status === filterStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  // Filter orders for the selected vendor profile
  const selectedVendorOrders = selectedVendor
    ? localOrders.filter(o => o.vendor_id === selectedVendor.id)
    : [];

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Vendor & Supplier CRM</h1>
          <p className="text-sm text-slate-500">Manage supplier profiles, place purchase orders, monitor outstanding balances, and track dynamic KPIs.</p>
        </div>
        <Button 
          onClick={() => {
            resetVendorForm();
            setIsAddVendorOpen(true);
          }}
          className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2 h-10 px-5"
        >
          <Plus className="w-4 h-4" /> Add Vendor
        </Button>
      </div>

      {/* KPI METRICS */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Vendors</p>
            <div className="flex items-center gap-3">
              <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{totalVendors}</h3>
              <Badge className="bg-slate-50 text-slate-600 border-none text-[10px] font-bold">Stored</Badge>
            </div>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Active Accounts</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#10B981]"/> {activeAccounts}
            </h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Outstanding</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight">{formatCur(totalOutstanding)}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#0066FF]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Orders This Month</p>
            <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#0066FF]"/> {ordersThisMonth}
            </h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER CONTROLS */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 flex-wrap gap-4 items-center w-full">
          <div className="relative w-full max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search vendor name or contact..." 
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px] bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px] h-10 bg-slate-50 border-slate-200 rounded-[10px] bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Categories</SelectItem>
              {dynamicCategories.map((cat, idx) => (
                <SelectItem key={idx} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* VENDORS LEDGER GRID */}
      <section>
        <PearlCard>
          <ResponsiveTable>
            <Table>
              <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Vendor Info</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Contact details</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Outstanding / Limit</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Last Order</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Rating</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((v) => (
                  <TableRow key={v.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                    <TableCell>
                      <div className="font-bold text-[14px] text-[#0F172A]">{v.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-slate-400">{v.displayId}</span>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[4px] text-[9px] font-bold tracking-wider uppercase border-slate-200">{v.cat}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-[13px] text-[#0F172A] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400"/>
                        <a href={`tel:${v.phone}`} className="hover:underline hover:text-[#0066FF]">{v.phone}</a>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{v.contact}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`font-bold text-[15px] ${v.out > 50000 ? 'text-red-600' : 'text-[#0F172A]'}`}>{formatCur(v.out)}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Limit: {formatCur(v.limit)}</div>
                      {v.limit > 0 && (
                        <div className="w-24 ml-auto mt-1.5 bg-slate-100 rounded-full h-1 overflow-hidden" title={`Credit Utilization: ${((v.out / v.limit) * 100).toFixed(1)}%`}>
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              (v.out / v.limit) > 0.8 ? 'bg-red-500' : (v.out / v.limit) > 0.5 ? 'bg-amber-500' : 'bg-[#0066FF]'
                            }`}
                            style={{ width: `${Math.min(100, (v.out / v.limit) * 100)}%` }}
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-medium text-[13px] text-slate-700">{v.date}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{v.orders} orders total</div>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex justify-center text-amber-400 gap-0.5">
                         {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className={`w-3.5 h-3.5 ${idx < v.rating ? 'fill-current' : 'text-slate-200 fill-slate-200'}`} />
                         ))}
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       {v.status === 'Active' ? 
                         <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 shadow-none text-[10px] uppercase rounded-[4px] border border-emerald-200 font-bold">Active</Badge> : 
                         <Badge className="bg-slate-50 text-slate-600 hover:bg-slate-50 shadow-none text-[10px] uppercase rounded-[4px] border border-slate-200 font-bold">Pending</Badge>
                       }
                    </TableCell>
                    <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                       <Sheet>
                         <SheetTrigger asChild>
                           <Button variant="outline" size="sm" className="h-8 text-[11px] rounded-[6px] font-bold text-[#0F172A] border-[#E8ECF0] hover:bg-slate-50 shadow-sm" onClick={() => setSelectedVendor(v)}>Profile</Button>
                         </SheetTrigger>
                         <SheetContent className="sm:max-w-[550px] overflow-y-auto">
                           <SheetHeader className="mb-6 border-b border-[#E8ECF0] pb-4">
                             <SheetTitle className="text-2xl font-bold">{v.name}</SheetTitle>
                             <div className="flex items-center gap-2 mt-2">
                               <Badge variant="outline" className="bg-slate-50 text-slate-700 font-bold">{v.cat}</Badge>
                               <div className="flex text-amber-500 gap-0.5 items-center">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-sm font-bold text-[#0F172A]">{v.rating}.0</span>
                               </div>
                               {v.status === 'Active' && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] uppercase rounded-[4px] font-bold ml-auto border-none">Active Vendor</Badge>}
                             </div>
                           </SheetHeader>
                           
                           <div className="space-y-6 text-left">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                <a href={`tel:${v.phone}`} className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0] flex gap-3 items-center hover:bg-blue-50/50 hover:border-blue-200 transition-colors w-full">
                                   <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0066FF] flex items-center justify-center shrink-0"><Phone className="w-4 h-4"/></div>
                                   <div className="overflow-hidden">
                                     <p className="text-[10px] uppercase font-bold text-slate-400">Call</p>
                                     <p className="font-semibold text-[13px] text-[#0F172A] truncate hover:text-[#0066FF]">{v.phone}</p>
                                   </div>
                                </a>
                                <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0] flex gap-3 items-center">
                                   <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><Mail className="w-4 h-4"/></div>
                                   <div className="overflow-hidden">
                                     <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                                     <p className="font-semibold text-[13px] text-[#0F172A] truncate" title={v.email}>{v.email}</p>
                                   </div>
                                </div>
                             </div>

                             <div className="bg-red-50/50 p-6 rounded-[12px] border border-red-100 shadow-sm flex items-center justify-between">
                               <div>
                                 <p className="text-[12px] uppercase font-bold text-red-700 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4"/> Outstanding Balance</p>
                                 <h2 className="text-4xl font-bold text-red-600 tracking-tight">{formatCur(v.out)}</h2>
                               </div>
                               <Button 
                                 className="bg-red-600 hover:bg-red-700 text-white rounded-[8px] font-bold shadow-sm shadow-red-200"
                                 onClick={() => {
                                   setSelectedVendor(v);
                                   setPaymentAmount(v.out.toString());
                                   setIsRecordPaymentOpen(true);
                                 }}
                               >
                                 Record Payment
                               </Button>
                             </div>

                             <div className="space-y-4">
                               <div className="flex justify-between items-center mb-2">
                                 <h4 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Recent Orders ({selectedVendorOrders.length})</h4>
                               </div>
                               <div className="border border-[#E8ECF0] rounded-[10px] bg-white overflow-hidden shadow-sm">
                                  <ResponsiveTable>
                                    <Table>
                                      <TableHeader className="bg-slate-50">
                                        <TableRow className="border-none">
                                          <TableHead className="py-2 text-[10px]">PO #</TableHead>
                                          <TableHead className="py-2 text-[10px]">Delivery</TableHead>
                                          <TableHead className="py-2 text-[10px] text-right">Items Quantity</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedVendorOrders.map((o, ix) => (
                                          <TableRow key={ix} className="border-[#E8ECF0] hover:bg-transparent">
                                            <TableCell className="py-2.5 text-[12px] font-bold text-[#0066FF]">{o.id.substring(0,8)}</TableCell>
                                            <TableCell className="py-2.5 text-[12px] font-medium text-slate-600">{o.delivery_date}</TableCell>
                                            <TableCell className="py-2.5 text-[12px] font-bold text-right">{Array.isArray(o.items) ? o.items.length : 0} items</TableCell>
                                          </TableRow>
                                        ))}
                                        {selectedVendorOrders.length === 0 && (
                                          <TableRow>
                                            <TableCell colSpan={3} className="text-center py-4 text-slate-400 text-xs italic">No orders logged for this supplier yet.</TableCell>
                                          </TableRow>
                                        )}
                                      </TableBody>
                                    </Table>
                                  </ResponsiveTable>
                               </div>
                             </div>
                           </div>
                         </SheetContent>
                       </Sheet>

                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-full">
                              <MoreVertical className="w-4 h-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="bg-white border border-slate-100 shadow-md rounded-[8px] p-1 w-44 z-50">
                           <DropdownMenuItem 
                             onClick={() => triggerEditModal(v)}
                             className="text-xs font-bold text-slate-700 hover:bg-slate-50 focus:bg-slate-50 p-2 rounded-[6px] flex gap-2 cursor-pointer"
                           >
                             <Edit className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                             <span>Edit Profile</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                             onClick={() => {
                               setSelectedVendor(v);
                               setIsViewOrdersOpen(true);
                             }}
                             className="text-xs font-bold text-slate-700 hover:bg-slate-50 focus:bg-slate-50 p-2 rounded-[6px] flex gap-2 cursor-pointer"
                           >
                             <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                             <span>View Orders</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                             onClick={() => handleDeleteVendor(v.id)}
                             className="text-xs font-bold text-red-600 hover:bg-red-50 focus:bg-red-50 p-2 rounded-[6px] flex gap-2 cursor-pointer"
                           >
                             <Trash className="w-3.5 h-3.5 text-red-500 shrink-0" />
                             <span>Delete Vendor</span>
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>

                       <Button 
                         size="sm" 
                         className="h-8 text-[11px] rounded-[6px] bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold shadow-sm" 
                         onClick={() => {
                           setSelectedVendor(v);
                           setIsOrderSheetOpen(true);
                         }}
                       >
                         New Order
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTable>
          
          {filteredVendors.length === 0 && (
            <div className="text-center py-12 text-slate-400 bg-white font-medium text-sm">
              No suppliers match current filtering criteria.
            </div>
          )}
        </PearlCard>
      </section>

      {/* ADD VENDOR DIALOG */}
      <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border border-slate-100 shadow-2xl rounded-[24px]">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-lg font-bold text-[#0F172A]">Add New Supplier</DialogTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">Register a new vendor account into construction ERP database.</p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-4 py-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor / Business Name</Label>
                <Input 
                  placeholder="e.g. Rajhans Cement Co." 
                  className="rounded-[8px] bg-white" 
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</Label>
                <Select value={vendorCategory} onValueChange={setVendorCategory}>
                  <SelectTrigger className="rounded-[8px] bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Cement & Concrete">Cement & Concrete</SelectItem>
                    <SelectItem value="Steel & Metallurgy">Steel & Metallurgy</SelectItem>
                    <SelectItem value="Electrical Systems">Electrical Systems</SelectItem>
                    <SelectItem value="Plumbing & Pipes">Plumbing & Pipes</SelectItem>
                    <SelectItem value="Equip & Machinery">Equip & Machinery</SelectItem>
                    <SelectItem value="Brick & Hardware">Brick & Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Person</Label>
                <Input 
                  placeholder="e.g. Amit Sharma" 
                  className="rounded-[8px] bg-white" 
                  value={vendorContact}
                  onChange={(e) => setVendorContact(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Link</Label>
                <Input 
                  placeholder="+919876543210" 
                  className="rounded-[8px] bg-white" 
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</Label>
                <Input 
                  placeholder="vendor@example.com" 
                  className="rounded-[8px] bg-white" 
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credit Limit (₹)</Label>
                <Input 
                  type="number" 
                  placeholder="500000" 
                  className="rounded-[8px] bg-white font-bold" 
                  value={vendorLimit}
                  onChange={(e) => setVendorLimit(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial Rating (1-5)</Label>
                <div className="flex gap-2 items-center h-10 mt-0.5">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setVendorRating(starVal.toString())}
                      className="text-amber-400 hover:scale-125 focus:outline-none transition-transform duration-100"
                    >
                      <Star className={`w-6 h-6 ${starVal <= (parseInt(vendorRating) || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                    </button>
                  ))}
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">
                    {vendorRating === "1" && "Poor"}
                    {vendorRating === "2" && "Fair"}
                    {vendorRating === "3" && "Good"}
                    {vendorRating === "4" && "Very Good"}
                    {vendorRating === "5" && "Excellent"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t border-[#F1F5F9] pt-4">
            <Button 
              variant="outline" 
              className="rounded-[10px] h-10 font-semibold text-slate-600 hover:bg-slate-50" 
              onClick={() => setIsAddVendorOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] h-10 font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center"
              onClick={handleAddVendor}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-1.5" />
                  Saving...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT VENDOR DIALOG */}
      <Dialog open={isEditVendorOpen} onOpenChange={setIsEditVendorOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border border-slate-100 shadow-2xl rounded-[24px]">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                <Edit className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-lg font-bold text-[#0F172A]">Edit Supplier Profile</DialogTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">Modify parameters for {selectedVendor?.name}.</p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-4 py-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor / Business Name</Label>
                <Input 
                  placeholder="e.g. Rajhans Cement Co." 
                  className="rounded-[8px] bg-white" 
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</Label>
                <Select value={vendorCategory} onValueChange={setVendorCategory}>
                  <SelectTrigger className="rounded-[8px] bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Cement & Concrete">Cement & Concrete</SelectItem>
                    <SelectItem value="Steel & Metallurgy">Steel & Metallurgy</SelectItem>
                    <SelectItem value="Electrical Systems">Electrical Systems</SelectItem>
                    <SelectItem value="Plumbing & Pipes">Plumbing & Pipes</SelectItem>
                    <SelectItem value="Equip & Machinery">Equip & Machinery</SelectItem>
                    <SelectItem value="Brick & Hardware">Brick & Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Person</Label>
                <Input 
                  placeholder="e.g. Amit Sharma" 
                  className="rounded-[8px] bg-white" 
                  value={vendorContact}
                  onChange={(e) => setVendorContact(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Link</Label>
                <Input 
                  placeholder="+919876543210" 
                  className="rounded-[8px] bg-white" 
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</Label>
                <Input 
                  placeholder="vendor@example.com" 
                  className="rounded-[8px] bg-white" 
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credit Limit (₹)</Label>
                <Input 
                  type="number" 
                  placeholder="500000" 
                  className="rounded-[8px] bg-white font-bold" 
                  value={vendorLimit}
                  onChange={(e) => setVendorLimit(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                <Select value={vendorStatus} onValueChange={setVendorStatus}>
                  <SelectTrigger className="rounded-[8px] bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating (1-5)</Label>
                <div className="flex gap-2 items-center h-10 mt-0.5">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setVendorRating(starVal.toString())}
                      className="text-amber-400 hover:scale-125 focus:outline-none transition-transform duration-100"
                    >
                      <Star className={`w-6 h-6 ${starVal <= (parseInt(vendorRating) || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                    </button>
                  ))}
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">
                    {vendorRating === "1" && "Poor"}
                    {vendorRating === "2" && "Fair"}
                    {vendorRating === "3" && "Good"}
                    {vendorRating === "4" && "Very Good"}
                    {vendorRating === "5" && "Excellent"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t border-[#F1F5F9] pt-4">
            <Button 
              variant="outline" 
              className="rounded-[10px] h-10 font-semibold text-slate-600 hover:bg-slate-50" 
              onClick={() => setIsEditVendorOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] h-10 font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center"
              onClick={handleEditVendor}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-1.5" />
                  Updating...
                </>
              ) : (
                "Save Parameters"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RECORD PAYMENT DIALOG */}
      <Dialog open={isRecordPaymentOpen} onOpenChange={setIsRecordPaymentOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white border border-slate-100 shadow-2xl rounded-[24px]">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
                <CreditCard className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-lg font-bold text-[#0F172A]">Record Vendor Payment</DialogTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">Register a payment. This updates their outstanding balance and adds an expense to the ledger.</p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-4 py-4 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendor</Label>
              <div className="p-3 bg-slate-50 border border-[#E8ECF0] rounded-[8px] font-bold text-slate-800 text-[14px]">
                {selectedVendor?.name}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Amount (₹)</Label>
              <Input 
                type="number" 
                placeholder="Enter paid amount" 
                className="rounded-[8px] bg-white font-bold text-[16px] text-red-600 focus-visible:ring-red-500" 
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              {selectedVendor && (
                <p className="text-[11px] text-slate-400">
                  Current outstanding balance: <span className="font-bold text-slate-600">{formatCur(selectedVendor.out)}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks / Notes</Label>
              <Textarea 
                placeholder="e.g. Cleared via HDFC Bank Transfer, TXN-98234" 
                className="rounded-[8px] bg-white min-h-[70px] text-[13px]" 
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t border-[#F1F5F9] pt-4">
            <Button 
              variant="outline" 
              className="rounded-[10px] h-10 font-semibold text-slate-600 hover:bg-slate-50" 
              onClick={() => setIsRecordPaymentOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white rounded-[10px] h-10 font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center"
              onClick={handleRecordPayment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-1.5" />
                  Recording...
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW HISTORICAL ORDERS DIALOG */}
      <Dialog open={isViewOrdersOpen} onOpenChange={setIsViewOrdersOpen}>
        <DialogContent className="sm:max-w-[650px] bg-white border border-slate-100 shadow-2xl rounded-[24px]">
          <DialogHeader className="border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-lg font-bold text-[#0F172A]">Historical Purchase Orders</DialogTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">List of purchase orders generated for {selectedVendor?.name}.</p>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <div className="border border-[#E8ECF0] rounded-[12px] bg-white overflow-hidden shadow-sm">
              <ResponsiveTable>
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-none">
                      <TableHead className="py-2 text-[11px] font-bold text-slate-500 uppercase">PO ID</TableHead>
                      <TableHead className="py-2 text-[11px] font-bold text-slate-500 uppercase">Delivery Date</TableHead>
                      <TableHead className="py-2 text-[11px] font-bold text-slate-500 uppercase">Payment Terms</TableHead>
                      <TableHead className="py-2 text-[11px] font-bold text-slate-500 uppercase text-right">Order Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-left">
                    {selectedVendorOrders.map((o, ix) => (
                      <TableRow key={ix} className="border-[#E8ECF0] hover:bg-slate-50/50">
                        <TableCell className="py-3 text-[13px] font-bold text-[#0066FF]">{o.id.substring(0,8)}</TableCell>
                        <TableCell className="py-3 text-[13px] font-medium text-slate-600">{o.delivery_date}</TableCell>
                        <TableCell className="py-3 text-[12px] font-semibold text-slate-500 uppercase">{o.payment_terms}</TableCell>
                        <TableCell className="py-3 text-[13px] font-bold text-right text-[#0F172A]">
                          {Array.isArray(o.items) ? o.items.length : 0} items mapped
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedVendorOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-slate-400 text-xs italic">
                          No purchase orders recorded for this vendor.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ResponsiveTable>
            </div>
          </div>

          <DialogFooter className="border-t border-[#F1F5F9] pt-4">
            <Button 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[10px] h-10 font-bold px-6 border-none"
              onClick={() => setIsViewOrdersOpen(false)}
            >
              Close Ledger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NEW ORDER SHEET OVERLAY */}
      <Sheet open={isOrderSheetOpen} onOpenChange={setIsOrderSheetOpen}>
        <SheetContent className="sm:max-w-[650px] overflow-y-auto bg-white border-l border-[#E8ECF0] shadow-2xl">
          <SheetHeader className="mb-6 border-b border-[#E8ECF0] pb-4">
            <SheetTitle className="text-2xl font-bold text-[#0F172A]">Place New Purchase Order</SheetTitle>
          </SheetHeader>
          
          {selectedVendor && (
            <div className="space-y-6 text-left">
              <div className="p-4 bg-slate-50 rounded-[12px] border border-[#E8ECF0] flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vendor Selected</div>
                  <div className="font-bold text-[16px] text-[#0F172A] flex items-center gap-2">
                    {selectedVendor.name} 
                    <Badge variant="outline" className="text-[9px] bg-white">{selectedVendor.cat || 'General'}</Badge>
                  </div>
                </div>
                {selectedVendor.phone && (
                  <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-[8px] border-[#E8ECF0] hover:bg-slate-50 shadow-sm" asChild>
                    <a href={`tel:${selectedVendor.phone}`}>
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold text-xs text-[#0F172A]">Call Vendor</span>
                    </a>
                  </Button>
                )}
              </div>

              <div className="space-y-3 border p-4 rounded-[12px] border-[#E8ECF0] bg-white shadow-sm">
                <div className="flex justify-between items-center border-b border-[#E8ECF0] pb-2">
                  <Label className="font-bold text-[#0F172A]">Order Items</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[#0066FF] px-2 text-[11px] hover:bg-blue-50 font-bold"
                    onClick={() => setOrderItems([...orderItems, { materialId: "", customName: "", quantity: 1, unitPrice: 0 }])}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1"/> Add Item
                  </Button>
                </div>

                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-500 uppercase px-1">
                  <div className="col-span-5">Material Description</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {orderItems.map((item, index) => {
                  return (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5 space-y-1">
                        <Select 
                          value={item.materialId} 
                          onValueChange={(val) => {
                            const newItems = [...orderItems];
                            newItems[index].materialId = val;
                            if (val !== "custom") {
                              const selectedMat = COMMON_MATERIALS.find(m => m.id === val);
                              newItems[index].customName = "";
                              newItems[index].unitPrice = selectedMat?.unit_cost || 0; 
                            }
                            setOrderItems(newItems);
                          }}
                        >
                          <SelectTrigger className="h-9 text-[12px] rounded-[6px] bg-white border-slate-200">
                            <SelectValue placeholder="Select a material" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {COMMON_MATERIALS.map((m: any) => (
                              <SelectItem key={m.id} value={m.id} className="text-[12px]">
                                {m.name} ({m.unit_of_measurement || 'Units'})
                              </SelectItem>
                            ))}
                            <SelectItem value="custom" className="text-[12px] font-semibold text-[#0066FF]">
                              + Custom Item...
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {item.materialId === "custom" && (
                           <Input 
                             placeholder="Enter custom material name" 
                             className="h-8 text-[12px] rounded-[6px] border-blue-250 focus-visible:ring-blue-500"
                             value={item.customName}
                             onChange={(e) => {
                               const newItems = [...orderItems];
                               newItems[index].customName = e.target.value;
                               setOrderItems(newItems);
                             }}
                           />
                        )}
                      </div>

                      <div className="col-span-2">
                        <Input 
                          type="number" 
                          placeholder="Qty" 
                          className="h-9 text-[12px] text-center rounded-[6px]"
                          value={item.quantity}
                          min="0.01"
                          step="any"
                          onChange={(e) => {
                            const newItems = [...orderItems];
                            newItems[index].quantity = parseFloat(e.target.value) || 0;
                            setOrderItems(newItems);
                          }}
                        />
                      </div>

                      <div className="col-span-2">
                        <Input 
                          type="number" 
                          placeholder="₹" 
                          className="h-9 text-[12px] text-right rounded-[6px]"
                          value={item.unitPrice}
                          min="0"
                          step="any"
                          onChange={(e) => {
                            const newItems = [...orderItems];
                            newItems[index].unitPrice = parseFloat(e.target.value) || 0;
                            setOrderItems(newItems);
                          }}
                        />
                      </div>

                      <div className="col-span-2 text-right pr-1 font-bold text-[12px] text-[#0F172A]">
                        ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>

                      <div className="col-span-1 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                          disabled={orderItems.length === 1}
                          onClick={() => {
                            const newItems = orderItems.filter((_, idx) => idx !== index);
                            setOrderItems(newItems);
                          }}
                        >
                          <Trash className="w-3.5 h-3.5"/>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700 text-[13px]">Expected Delivery Date</Label>
                  <Input 
                    type="date" 
                    className="h-10 rounded-[8px] text-[13px] border-slate-200" 
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700 text-[13px]">Payment Terms</Label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger className="h-10 rounded-[8px] text-[13px] bg-white border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="adv" className="text-[13px]">100% Advance</SelectItem>
                      <SelectItem value="net15" className="text-[13px]">Net 15 Days</SelectItem>
                      <SelectItem value="net30" className="text-[13px]">Net 30 Days</SelectItem>
                      <SelectItem value="cod" className="text-[13px]">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-700 text-[13px]">Additional Notes / Instructions</Label>
                <textarea 
                  placeholder="Delivery instructions, quality requirements..." 
                  rows={2} 
                  className="flex min-h-[60px] w-full rounded-[8px] border border-slate-200 bg-background px-3 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>
              
              <div className="p-5 bg-blue-50/60 rounded-[12px] border border-blue-100 flex justify-between items-center text-blue-900 mt-4 shadow-sm">
                <span className="font-bold text-[14px]">Total Order Value</span>
                <span className="font-black text-[22px] text-[#0066FF]">
                  ₹{orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#E8ECF0] pt-4 mt-6">
                <Button 
                  variant="outline" 
                  className="rounded-[8px] h-10 font-semibold text-[13px] px-6"
                  onClick={() => setIsOrderSheetOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold text-[13px] shadow-md px-6 flex gap-2 items-center"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
                  Submit Purchase Order
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
