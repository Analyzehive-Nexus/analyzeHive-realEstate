"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { createBrowserClient } from "@/lib/supabase-browser";
import { 
  fetchInventoryData, 
  fetchDemandsData, 
  editInventoryItem, 
  restockInventoryItem,
  createVendorOrder
} from "@/app/construction/actions";
import { approveDemand, rejectDemand } from "@/app/dashboard/construction/actions";

import { 
  Package, ClipboardList, Truck, HardHat, AlertTriangle, Phone, Star, Camera, CheckCircle, XCircle, Loader2, Plus, Trash
} from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

import dynamic from "next/dynamic";

const StockSummaryChart = dynamic(
  () => import("./components/construction-charts").then((mod) => mod.StockSummaryChart),
  {
    ssr: false,
    loading: () => <div className="h-[240px] w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading stock summary...</div>
  }
);

const CompletionVelocityChart = dynamic(
  () => import("./components/construction-charts").then((mod) => mod.CompletionVelocityChart),
  {
    ssr: false,
    loading: () => <div className="h-[320px] w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400">Loading velocity chart...</div>
  }
);

const LabourAttendanceChart = dynamic(
  () => import("./components/construction-charts").then((mod) => mod.LabourAttendanceChart),
  {
    ssr: false,
    loading: () => <div className="h-40 w-40 rounded-full bg-slate-50 animate-pulse flex items-center justify-center text-xs text-slate-400 font-bold">Loading attendance...</div>
  }
);

const WeeklyLabourAvailabilityChart = dynamic(
  () => import("./components/construction-charts").then((mod) => mod.WeeklyLabourAvailabilityChart),
  {
    ssr: false,
    loading: () => <div className="h-[260px] w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400 font-bold">Loading availability...</div>
  }
);

const ExpenditureAnalysisChart = dynamic(
  () => import("./components/construction-charts").then((mod) => mod.ExpenditureAnalysisChart),
  {
    ssr: false,
    loading: () => <div className="h-[380px] w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400 font-bold">Loading expenditure analysis...</div>
  }
);


// FORMAT HELPER
const formatCur = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

// HELPER COMPONENTS
const SectionHeading = ({ title, href }: { title: string; href?: string }) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
      {href && (
        <Button 
          variant="ghost" 
          className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 px-3 text-[13px]"
          onClick={() => router.push(href)}
        >
          View All
        </Button>
      )}
    </div>
  );
};

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden ${className}`}
    style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E8ECF0',
    }}
  >
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card 
    className={`overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#CBD5E1] transition-all duration-200 ${className}`}
    style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E8ECF0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      cursor: 'pointer'
    }}
  >
    {children}
  </Card>
);

// Fallbacks since we don't fetch these explicitly from the backend in lib/data:
const photos = [
  { site: "Tower A - Floor 12 Slab Work", date: "Mar 18", color: "bg-blue-100" },
  { site: "Tower B - Column Casting", date: "Mar 18", color: "bg-orange-100" },
];

const budgetData = [
  { cat: "Civil Work", b: 8500000, s: 5230000, r: 3270000, pct: 62, status: "On Track" },
];

const progressChart = [
  { date: "Mar 12", TowerA: 55, TowerB: 30 },
];

const attendanceTrend = [
  { day: "Mon", count: 62 },
];

export default function ConstructionClient({
  inventoryItems,
  inventoryStats,
  demands,
  assets,
  assetsStats,
  attendance,
  attendanceStats,
  progress,
  vendors
}: {
  inventoryItems: any,
  inventoryStats: any,
  demands: any,
  assets: any,
  assetsStats: any,
  attendance: any,
  attendanceStats: any,
  progress: any,
  vendors: any
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [localInventoryItems, setLocalInventoryItems] = useState(inventoryItems);
  const [localInventoryStats, setLocalInventoryStats] = useState(inventoryStats);
  const [localDemands, setLocalDemands] = useState(demands);
  const [localAssets, setLocalAssets] = useState(assets);
  const [localAssetsStats, setLocalAssetsStats] = useState(assetsStats);
  const [localAttendance, setLocalAttendance] = useState(attendance);
  const [localAttendanceStats, setLocalAttendanceStats] = useState(attendanceStats);
  const [localProgress, setLocalProgress] = useState(progress);
  const [localVendors, setLocalVendors] = useState(vendors);

  const [selectedEditItem, setSelectedEditItem] = useState<any>(null);
  const [selectedRestockItem, setSelectedRestockItem] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // State for placing new vendor orders (Phase 2)
  const [selectedOrderVendor, setSelectedOrderVendor] = useState<any>(null);
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<Array<{ materialId: string; customName: string; quantity: number; unitPrice: number }>>([
    { materialId: "", customName: "", quantity: 1, unitPrice: 0 }
  ]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("net30");
  const [orderNotes, setOrderNotes] = useState("");

  const supabase = createBrowserClient();

  useEffect(() => {
    setLocalInventoryItems(inventoryItems);
    setLocalInventoryStats(inventoryStats);
    setLocalDemands(demands);
    setLocalAssets(assets);
    setLocalAssetsStats(assetsStats);
    setLocalAttendance(attendance);
    setLocalAttendanceStats(attendanceStats);
    setLocalProgress(progress);
    setLocalVendors(vendors);
  }, [
    inventoryItems, inventoryStats, demands, assets, assetsStats, 
    attendance, attendanceStats, progress, vendors
  ]);

  useEffect(() => {
    // Real-time listener for inventory items
    const stockChannel = supabase
      .channel("const-stock-client")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory_items" }, async () => {
        const fresh = await fetchInventoryData();
        if (fresh.items) {
          setLocalInventoryItems(fresh.items);
          setLocalInventoryStats(fresh.stats);
        }
      })
      .subscribe();

    // Real-time listener for material demands
    const demandsChannel = supabase
      .channel("const-demands-client")
      .on("postgres_changes", { event: "*", schema: "public", table: "material_demands" }, async () => {
        const freshDemands = await fetchDemandsData();
        setLocalDemands(freshDemands);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(stockChannel);
      supabase.removeChannel(demandsChannel);
    };
  }, [supabase]);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEditItem) return;
    setIsActionLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const minThreshold = parseFloat(formData.get("min_threshold") as string) || 0;
    const unitOfMeasurement = formData.get("unit_of_measurement") as string;

    const res = await editInventoryItem(selectedEditItem.id, name, category, minThreshold, unitOfMeasurement);
    
    setIsActionLoading(false);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Material updated successfully." });
      setIsEditOpen(false);
      const fresh = await fetchInventoryData();
      if (fresh.items) {
        setLocalInventoryItems(fresh.items);
        setLocalInventoryStats(fresh.stats);
      }
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRestockItem) return;
    setIsActionLoading(true);
    const formData = new FormData(e.currentTarget);
    const quantityToAdd = parseFloat(formData.get("quantity_to_add") as string) || 0;

    const res = await restockInventoryItem(selectedRestockItem.id, quantityToAdd);

    setIsActionLoading(false);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Stock refilled successfully." });
      setIsRestockOpen(false);
      const fresh = await fetchInventoryData();
      if (fresh.items) {
        setLocalInventoryItems(fresh.items);
        setLocalInventoryStats(fresh.stats);
      }
    }
  };

  const handleApproveDemand = async (id: string) => {
    setIsActionLoading(true);
    const res = await approveDemand(id);
    setIsActionLoading(false);
    if (res?.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Demand Approved", description: "Material stock has been updated." });
      const freshDemands = await fetchDemandsData();
      setLocalDemands(freshDemands);
      const freshInv = await fetchInventoryData();
      if (freshInv.items) {
        setLocalInventoryItems(freshInv.items);
        setLocalInventoryStats(freshInv.stats);
      }
    }
  };

  const handleRejectDemand = async (id: string) => {
    setIsActionLoading(true);
    const res = await rejectDemand(id);
    setIsActionLoading(false);
    if (res?.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      toast({ title: "Demand Rejected", description: "The request has been rejected." });
      const freshDemands = await fetchDemandsData();
      setLocalDemands(freshDemands);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedOrderVendor) return;
    if (!deliveryDate) {
      toast({
        title: "Error",
        description: "Please specify an expected delivery date.",
        variant: "destructive"
      });
      return;
    }

    // Validate items
    const invalidItem = orderItems.find(item => !item.materialId && !item.customName.trim());
    if (invalidItem) {
      toast({
        title: "Error",
        description: "Please specify a material or enter a custom name for all items.",
        variant: "destructive"
      });
      return;
    }

    const invalidQty = orderItems.find(item => item.quantity <= 0);
    if (invalidQty) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0.",
        variant: "destructive"
      });
      return;
    }

    setIsActionLoading(true);

    const mappedItems = orderItems.map(item => {
      const dbItem = localInventoryItems.find((i: any) => i.id === item.materialId);
      return {
        material_id: item.materialId === "custom" ? null : (item.materialId || null),
        name: item.materialId === "custom" || !item.materialId ? item.customName : (dbItem?.name || "Unknown"),
        quantity: item.quantity,
        unit_price: item.unitPrice,
        unit_of_measurement: dbItem?.unit_of_measurement || "Units",
        total: item.quantity * item.unitPrice
      };
    });

    const res = await createVendorOrder(
      selectedOrderVendor.id,
      mappedItems,
      deliveryDate,
      paymentTerms
    );

    setIsActionLoading(false);

    if (res.error) {
      if (res.tableMissing) {
        toast({
          title: "Setup Required",
          description: "Database table 'vendor_orders' is missing. Please run the SQL migration in Supabase SQL Editor. SQL logged to console.",
          variant: "destructive"
        });
        console.log("SQL to execute in Supabase SQL Editor:\n", res.sql);
      } else {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Order Placed Successfully",
        description: `Your purchase order has been generated! ${res.createdTable ? '(vendor_orders table was automatically created)' : ''}`,
      });
      setIsOrderSheetOpen(false);
      // Reset form
      setOrderItems([{ materialId: "", customName: "", quantity: 1, unitPrice: 0 }]);
      setDeliveryDate("");
      setPaymentTerms("net30");
      setOrderNotes("");
    }
  };

  const stockSummaryChart = [
    { name: "Good", value: localInventoryStats?.good || 0, fill: "#10B981" },
    { name: "Low", value: localInventoryStats?.low || 0, fill: "#F59E0B" },
    { name: "Critical", value: localInventoryStats?.critical || 0, fill: "#EF4444" },
  ];

  // Derive labor table from 'attendance' list
  const laborCountByRole: any = {};
  (localAttendance || []).forEach((row: any) => {
    if (!laborCountByRole[row.role]) {
      laborCountByRole[row.role] = { present: 0, total: 0 };
    }
    laborCountByRole[row.role].total += 1;
    if (row.status === 'Present' || row.status === 'Half Day') {
      laborCountByRole[row.role].present += 1;
    }
  });

  const labourTable = Object.entries(laborCountByRole).map(([role, stats]: [string, any]) => ({
    role,
    present: stats.present,
    total: stats.total,
    pct: Math.round((stats.present / stats.total) * 100)
  }));

  const presentPercent = localAttendanceStats?.total ? Math.round((localAttendanceStats.present / localAttendanceStats.total) * 100) : 0;

  // Dynamic Progress Chart Calculation
  const progressByDate: Record<string, { date: string; TowerA: number; TowerB: number }> = {};
  (localProgress || []).forEach((row: any) => {
    const rawDate = row.date || row.created_at;
    if (!rawDate) return;
    const dateStr = new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!progressByDate[dateStr]) {
      progressByDate[dateStr] = { date: dateStr, TowerA: 0, TowerB: 0 };
    }
    if (row.project_name === 'Tower A' || row.project_site === 'Tower A') {
      progressByDate[dateStr].TowerA = Math.round(Number(row.completion_percentage || row.completion_pct || 0));
    } else if (row.project_name === 'Tower B' || row.project_site === 'Tower B') {
      progressByDate[dateStr].TowerB = Math.round(Number(row.completion_percentage || row.completion_pct || 0));
    }
  });

  const dynamicProgressChart = Object.values(progressByDate).length > 0 
    ? Object.values(progressByDate).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7)
    : [{ date: "Mar 12", TowerA: 55, TowerB: 30 }];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dynamicAttendanceTrend = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const dayName = daysOfWeek[d.getDay()];
    const baseCount = 28 + ((idx * 3) % 7); 
    return {
      day: dayName,
      count: baseCount
    };
  });

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-10 font-sans text-[#0F172A]">
      
      {/* SECTION 1 - KPI CARDS */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-[#0066FF] to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <Package className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{localInventoryStats?.total || 0}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Total Materials</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>
          
          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
                <ClipboardList className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{(localDemands || []).filter((d: any) => d.status === 'Pending').length}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Pending Approvals</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>

          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-green-500/30 shrink-0">
                <Truck className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{localAssetsStats?.active || 0}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Active Assets</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    {localAssetsStats?.maintenance || 0} maint.
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>

          <InteractivePearlCard className="p-5">
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
                <HardHat className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{localAttendanceStats?.total || 0}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Workers Today</p>
                  </div>
                  <div className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    {presentPercent}% att.
                  </div>
                </div>
              </div>
            </CardContent>
          </InteractivePearlCard>
        </div>
      </section>

      {/* SECTION 2 - STOCK & MATERIAL TRACKING */}
      <section className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <SectionHeading title="Material Stock" href="/construction/stock" />
          <PearlCard>
            <ResponsiveTable>
              <Table>
                <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Material Name</TableHead>
                    <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Quantity</TableHead>
                    <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                    <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Last Updated</TableHead>
                    <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(localInventoryItems || []).slice(0, 10).map((item: any, idx: number) => {
                    const status = item.current_stock_level > item.min_threshold * 2 ? 'Good' : item.current_stock_level > item.min_threshold ? 'Low' : 'Critical';
                    return (
                      <TableRow key={item.id || idx} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                        <TableCell>
                          <div className="font-bold text-sm text-[#0F172A]">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.category}</div>
                        </TableCell>
                        <TableCell className="font-medium text-[13px]">{item.current_stock_level} {item.unit_of_measurement}</TableCell>
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
                        <TableCell className="text-[12px] text-slate-500">{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-[11px] rounded-[6px]"
                            onClick={() => {
                              setSelectedEditItem(item);
                              setIsEditOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            className="h-7 text-[11px] rounded-[6px] bg-[#0066FF] hover:bg-[#0052CC] text-white"
                            onClick={() => {
                              setSelectedRestockItem(item);
                              setIsRestockOpen(true);
                            }}
                          >
                            Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(!localInventoryItems || localInventoryItems.length === 0) && (
                    <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-500">No materials found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </PearlCard>
        </div>

        <div className="lg:col-span-2 flex flex-col">
          <SectionHeading title="Stock Summary" />
          <PearlCard className="flex-1 flex flex-col p-6 items-center justify-center">
            <StockSummaryChart stockSummaryChart={stockSummaryChart} totalItems={localInventoryStats?.total || 0} />
            
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
              <div className="bg-[#10B981]/10 rounded-xl p-3 flex flex-col items-center border border-[#10B981]/20">
                <span className="text-xs text-[#10B981] font-bold uppercase">Good</span>
                <span className="text-xl font-bold text-[#0F172A]">{localInventoryStats?.good || 0}</span>
              </div>
              <div className="bg-[#F59E0B]/10 rounded-xl p-3 flex flex-col items-center border border-[#F59E0B]/20">
                <span className="text-xs text-[#D97706] font-bold uppercase">Low</span>
                <span className="text-xl font-bold text-[#0F172A]">{localInventoryStats?.low || 0}</span>
              </div>
              <div className="bg-[#EF4444]/10 rounded-xl p-3 flex flex-col items-center border border-[#EF4444]/20">
                <span className="text-xs text-[#EF4444] font-bold uppercase">Critical</span>
                <span className="text-xl font-bold text-[#0F172A]">{localInventoryStats?.critical || 0}</span>
              </div>
            </div>
          </PearlCard>
        </div>
      </section>

      {/* SECTION 3 - DEMAND REQUEST APPROVAL FLOW */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Material Demand Requests</h2>
        </div>
        <PearlCard>
          <ResponsiveTable>
            <Table>
              <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Request ID</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Requested By</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Material & Qty</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Project / Date</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(localDemands || []).map((req: any) => (
                  <TableRow key={req.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                    <TableCell className="font-bold text-[13px] text-[#0066FF]">{req.id.substring(0,8)}</TableCell>
                    <TableCell className="font-medium text-[13px] text-[#0F172A]">{req.requested_by?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <div className="font-bold text-[13px] text-[#0F172A]">{req.item?.name || 'Unknown Item'}</div>
                      <div className="text-xs text-slate-500 font-semibold">{req.quantity_requested} {req.item?.unit_of_measurement || 'units'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[13px] text-[#0F172A]">{req.project_tower || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      {req.status === 'Pending' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 rounded-full shadow-none text-[10px] uppercase">Pending</Badge>}
                      {req.status === 'Approved' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-full shadow-none text-[10px] uppercase border border-emerald-200"><CheckCircle className="w-3 h-3 mr-1"/>Apvd: {req.approved_by?.name || 'SYS'}</Badge>}
                      {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 rounded-full shadow-none text-[10px] uppercase border border-red-200"><XCircle className="w-3 h-3 mr-1"/>Rej: {req.approved_by?.name || 'SYS'}</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="h-7 text-[11px] rounded-[6px] bg-[#10B981] hover:bg-[#059669] text-white" onClick={() => handleApproveDemand(req.id)}>✓ Approve</Button>
                          <Button size="sm" className="h-7 text-[11px] rounded-[6px] bg-[#EF4444] hover:bg-[#DC2626] text-white" onClick={() => handleRejectDemand(req.id)}>✗ Reject</Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-[6px]" onClick={() => router.push('/construction/demands')}>View Details</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(!localDemands || localDemands.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No demands found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ResponsiveTable>
        </PearlCard>
      </section>

      {/* SECTION 4 - ASSET & EQUIPMENT TRACKER */}
      <section>
        <SectionHeading title="Active Engineering Assets" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(localAssets || []).slice(0, 8).map((ast: any, i: number) => {
            const statColor = ast.status === 'Active' ? 'bg-[#10B981]' : ast.status === 'Maintenance' ? 'bg-[#F59E0B]' : 'bg-slate-400';
            return (
              <InteractivePearlCard key={ast.id || i} className="relative group">
                <div className={`h-1.5 w-full ${statColor} absolute top-0 left-0 right-0`} />
                <CardContent className="p-6 pt-7">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`h-12 w-12 rounded-[12px] flex items-center justify-center ${ast.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Truck className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] rounded-full uppercase font-bold text-slate-500 bg-slate-50 border-slate-200">{ast.asset_type || ast.category || 'General'}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] leading-tight mb-1">{ast.name || ast.asset_name || 'Unnamed Asset'}</h3>
                  <p className="text-xs text-slate-400 font-mono mb-4">{ast.id?.substring(0,8) || 'N/A'}</p>
                  <div className="flex justify-between items-end border-t border-[#E8ECF0] pt-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Location</p>
                      <p className="text-[13px] font-semibold text-[#0F172A]">{ast.location || ast.current_location || 'Unknown'}</p>
                    </div>
                    <Badge className={`shadow-none text-[9px] uppercase font-bold ${statColor} text-white`}>{ast.status || 'Unknown'}</Badge>
                  </div>
                </CardContent>
              </InteractivePearlCard>
            );
          })}
          {(!localAssets || localAssets.length === 0) && <div className="col-span-4 text-center py-10 text-gray-500">No assets found</div>}
        </div>
      </section>

      {/* SECTION 5 - DAILY PROGRESS REPORTS */}
      <section className="grid lg:grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Daily Progress Reports" href="/construction/progress" />
          <PearlCard className="flex-1">
            <div className="divide-y divide-[#E8ECF0]">
              {(localProgress || []).slice(0, 4).map((r: any, i: number) => {
                const dateObj = new Date(r.date);
                const dM = dateObj.toLocaleString('en-US', {month: 'short'});
                const dD = dateObj.getDate();
                return (
                  <div key={r.id || i} className="p-5 hover:bg-blue-50/30 transition-colors flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="bg-slate-100 rounded-[10px] w-14 h-14 flex flex-col items-center justify-center border border-slate-200 shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{dM}</span>
                        <span className="text-lg font-bold text-[#0F172A]">{dD}</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-[#0F172A] text-[15px]">{r.project_site}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="bg-blue-100 text-[#0066FF] text-[10px] px-2 py-0.5 rounded-full font-bold">{r.completion_pct}% Done</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1"><HardHat className="w-3 h-3"/> {r.workers_present} wkrs</span>
                          <span className="text-xs text-slate-500">{r.weather_conditions}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs text-slate-500 font-medium mb-1.5">{r.submitted_by_user?.name || 'Unknown'}</span>
                      <span className="text-[11px] font-bold text-[#0066FF] cursor-pointer hover:underline" onClick={() => router.push('/construction/progress')}>View Full Report</span>
                    </div>
                  </div>
                );
              })}
              {(!localProgress || localProgress.length === 0) && <div className="p-10 text-center text-gray-500">No progress reports</div>}
            </div>
          </PearlCard>
        </div>
        
        <div className="flex flex-col">
          <SectionHeading title="7-Day Completion Velocity" href="/construction/progress" />
          <PearlCard className="flex-1 p-6">
            <CompletionVelocityChart progressChart={dynamicProgressChart} />
          </PearlCard>
        </div>
      </section>

      {/* SECTION 6 - LABOUR ATTENDANCE */}
      <section className="grid lg:grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <SectionHeading title="Today's Labour Attendance" href="/construction/labour" />
          <PearlCard className="flex-1 p-6 flex items-center gap-8">
            <LabourAttendanceChart presentPercent={presentPercent} />
            <div className="flex-1">
              <ResponsiveTable>
                <Table>
                  <TableBody>
                    {labourTable.map((l: any, i: number) => (
                      <TableRow key={i} className="hover:bg-transparent border-b border-[#E8ECF0]/60">
                        <TableCell className="py-2.5 font-semibold text-[13px] text-[#0F172A]">{l.role}</TableCell>
                        <TableCell className="py-2.5 text-right font-medium text-[13px] text-slate-600">
                          {l.present} <span className="text-slate-400">/ {l.total}</span>
                        </TableCell>
                        <TableCell className="py-2.5 text-right w-[60px]">
                          <Badge variant="outline" className={`rounded-[6px] text-[10px] ${l.pct < 85 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>{l.pct}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {labourTable.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-4 text-gray-500">No attendance data</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </ResponsiveTable>
            </div>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="Weekly Labour Availability" href="/construction/labour" />
          <PearlCard className="flex-1 p-6">
            <WeeklyLabourAvailabilityChart attendanceTrend={dynamicAttendanceTrend} />
          </PearlCard>
        </div>
      </section>

      {/* SECTION 7 - VENDORS & SUPPLIERS */}
      <section>
        <SectionHeading title="Active Vendor Relationships" href="/construction/vendors" />
        <PearlCard>
          <ResponsiveTable>
            <Table>
              <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Vendor Name</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Category</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Outstanding</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Rating</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Status</TableHead>
                  <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(localVendors || []).map((v: any, i: number) => (
                  <TableRow key={v.id || i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                    <TableCell>
                      <div className="font-bold text-[14px] text-[#0F172A]">{v.name}</div>
                      <div className="font-medium text-[12px] text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3"/> {v.contact_phone || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[6px] text-[11px] font-semibold">{v.category || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`font-bold text-[14px] ${(v.outstanding_amount || v.outstanding_balance || 0) > 50000 ? 'text-red-600' : 'text-[#0F172A]'}`}>₹{(v.outstanding_amount || v.outstanding_balance || 0).toLocaleString('en-IN')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < (v.rating || 4) ? 'fill-current' : 'text-slate-200 fill-slate-200'}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {v.status === 'Active' ? 
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-full tracking-wider font-bold">Active</Badge> : 
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 shadow-none text-[10px] uppercase rounded-full tracking-wider font-bold">{v.status || 'Pending'}</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full text-slate-600 hover:text-[#0066FF] hover:border-[#0066FF]" asChild>
                        <a href={`tel:${v.contact_phone || ''}`}>
                          <Phone className="w-3.5 h-3.5"/>
                        </a>
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8 text-[11px] rounded-[6px] font-semibold bg-white border border-[#E8ECF0] text-[#0F172A] hover:bg-slate-50 shadow-sm"
                        onClick={() => {
                          setSelectedOrderVendor(v);
                          setIsOrderSheetOpen(true);
                        }}
                      >
                        New Order
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!localVendors || localVendors.length === 0) && <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-500">No vendors found</TableCell></TableRow>}
              </TableBody>
            </Table>
          </ResponsiveTable>
        </PearlCard>
      </section>

      {/* SECTION 8 - SITE PHOTOS */}
      <section>
        <SectionHeading title="Recent Site Photos" href="/construction/progress" />
        <div className="grid sm:grid-cols-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((p, i) => (
            <InteractivePearlCard key={i} className="p-0 border-none">
              <div className={`h-40 w-full ${p.color} relative flex items-center justify-center`}>
                <Camera className="w-10 h-10 text-black/10" />
                <Badge className="absolute top-3 left-3 bg-black/60 hover:bg-black/60 text-white border-none rounded-[6px] text-[10px] uppercase">{p.date}</Badge>
              </div>
              <div className="p-4 bg-white border-t border-[#E8ECF0]">
                <h4 className="font-semibold text-[13px] text-[#0F172A] leading-tight group-hover:text-[#0066FF] transition-colors">{p.site}</h4>
              </div>
            </InteractivePearlCard>
          ))}
        </div>
      </section>

      {/* SECTION 9 - BUDGET VS ACTUAL SPENDING */}
      <section className="grid lg:grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        <div className="flex flex-col">
          <SectionHeading title="Budget Allocation Tracker" href="/construction/budget" />
          <PearlCard className="flex-1">
            <ResponsiveTable>
              <Table>
                <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="text-xs text-[#64748B] uppercase py-3">Category Details</TableHead>
                    <TableHead className="text-xs text-[#64748B] uppercase py-3 text-right">Budget / Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.map((b, i) => (
                    <TableRow key={i} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60">
                      <TableCell className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-[14px] text-[#0F172A]">{b.cat}</span>
                          {b.status === 'On Track' ? 
                            <span className="text-[10px] font-bold text-[#10B981] uppercase bg-green-50 px-2 py-0.5 rounded-[4px] border border-green-200">On Track</span> : 
                            <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded-[4px] border border-red-200">At Risk</span>
                          }
                        </div>
                        <Progress value={b.pct} className={`h-1.5 ${b.pct > 80 ? 'bg-red-100 [&>div]:bg-red-500' : 'bg-blue-100 [&>div]:bg-[#0066FF]'}`} />
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="font-bold text-[14px] text-[#0F172A]">{formatCur(b.b)}</div>
                        <div className="text-[12px] font-semibold text-slate-500 mt-0.5">{formatCur(b.s)} spent <span className="text-slate-300 mx-1">|</span> {b.pct}%</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </PearlCard>
        </div>

        <div className="flex flex-col">
          <SectionHeading title="Expenditure Analysis (Lakhs)" href="/construction/budget" />
          <PearlCard className="flex-1 p-6">
            <ExpenditureAnalysisChart budgetData={budgetData} />
          </PearlCard>
        </div>
      </section>

      {/* EDIT MATERIAL DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white rounded-[16px] border border-slate-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Edit Material Details</DialogTitle>
          </DialogHeader>
          {selectedEditItem && (
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-slate-600 font-semibold">Material Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  defaultValue={selectedEditItem.name} 
                  required 
                  className="h-10 rounded-[8px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category" className="text-slate-600 font-semibold">Category</Label>
                <Select name="category" defaultValue={selectedEditItem.category}>
                  <SelectTrigger className="h-10 rounded-[8px] bg-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Cement">Cement</SelectItem>
                    <SelectItem value="Steel">Steel</SelectItem>
                    <SelectItem value="Bricks">Bricks</SelectItem>
                    <SelectItem value="Sand">Sand</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-min" className="text-slate-600 font-semibold">Min Threshold</Label>
                  <Input 
                    id="edit-min" 
                    name="min_threshold" 
                    type="number" 
                    defaultValue={selectedEditItem.min_threshold} 
                    required 
                    className="h-10 rounded-[8px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit" className="text-slate-600 font-semibold">Unit</Label>
                  <Input 
                    id="edit-unit" 
                    name="unit_of_measurement" 
                    defaultValue={selectedEditItem.unit_of_measurement} 
                    required 
                    className="h-10 rounded-[8px]"
                  />
                </div>
              </div>
              <DialogFooter className="pt-4 gap-2 sm:gap-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-[8px] h-10 font-semibold"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm flex items-center justify-center gap-2"
                  disabled={isActionLoading}
                >
                  {isActionLoading && <Loader2 className="animate-spin w-4 h-4" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* RESTOCK DIALOG */}
      <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
        <DialogContent className="sm:max-w-[420px] bg-white rounded-[16px] border border-slate-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Restock Material</DialogTitle>
          </DialogHeader>
          {selectedRestockItem && (
            <form onSubmit={handleRestockSubmit} className="space-y-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-[12px] border border-slate-200/60 text-sm space-y-1.5 shadow-inner">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Material:</span>
                  <span className="font-bold text-slate-800">{selectedRestockItem.name}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Current Stock:</span>
                  <span className="font-bold text-slate-800">{selectedRestockItem.current_stock_level} {selectedRestockItem.unit_of_measurement}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restock-qty" className="text-slate-600 font-semibold">Quantity to Add ({selectedRestockItem.unit_of_measurement})</Label>
                <Input 
                  id="restock-qty" 
                  name="quantity_to_add" 
                  type="number" 
                  step="any"
                  placeholder="Enter refill quantity" 
                  required 
                  min="0.01"
                  className="h-10 rounded-[8px]"
                />
              </div>

              <DialogFooter className="pt-4 gap-2 sm:gap-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-[8px] h-10 font-semibold"
                  onClick={() => setIsRestockOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm flex items-center justify-center gap-2"
                  disabled={isActionLoading}
                >
                  {isActionLoading && <Loader2 className="animate-spin w-4 h-4" />}
                  Confirm Refill
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* NEW ORDER SHEET */}
      <Sheet open={isOrderSheetOpen} onOpenChange={setIsOrderSheetOpen}>
        <SheetContent className="sm:max-w-[650px] overflow-y-auto bg-white border-l border-[#E8ECF0] shadow-2xl">
          <SheetHeader className="mb-6 border-b border-[#E8ECF0] pb-4">
            <SheetTitle className="text-2xl font-bold text-[#0F172A]">Place New Purchase Order</SheetTitle>
          </SheetHeader>
          
          {selectedOrderVendor && (
            <div className="space-y-6">
              {/* Vendor Info & Call Quick Action */}
              <div className="p-4 bg-slate-50 rounded-[12px] border border-[#E8ECF0] flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vendor Selected</div>
                  <div className="font-bold text-[16px] text-[#0F172A] flex items-center gap-2">
                    {selectedOrderVendor.name} 
                    <Badge variant="outline" className="text-[9px] bg-white">{selectedOrderVendor.category || 'General'}</Badge>
                  </div>
                </div>
                {(selectedOrderVendor.contact_phone || selectedOrderVendor.phone) && (
                  <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-[8px] border-[#E8ECF0] hover:bg-slate-50 shadow-sm" asChild>
                    <a href={`tel:${selectedOrderVendor.contact_phone || selectedOrderVendor.phone}`}>
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold text-xs text-[#0F172A]">Call Vendor</span>
                    </a>
                  </Button>
                )}
              </div>

              {/* Order Items Table */}
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
                  const selectedMaterial = localInventoryItems.find((i: any) => i.id === item.materialId);
                  
                  return (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5 space-y-1">
                        <Select 
                          value={item.materialId} 
                          onValueChange={(val) => {
                            const newItems = [...orderItems];
                            newItems[index].materialId = val;
                            if (val !== "custom") {
                              const dbItem = localInventoryItems.find((i: any) => i.id === val);
                              newItems[index].customName = "";
                              // Pre-populate price with a default or unit cost if available
                              newItems[index].unitPrice = dbItem?.unit_cost || 0; 
                            }
                            setOrderItems(newItems);
                          }}
                        >
                          <SelectTrigger className="h-9 text-[12px] rounded-[6px] bg-white border-slate-200">
                            <SelectValue placeholder="Select a material" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {localInventoryItems.map((m: any) => (
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
                            className="h-8 text-[12px] rounded-[6px] border-blue-200 focus-visible:ring-blue-500"
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

              {/* Delivery & Payment Details */}
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
              
              {/* Total Order Value Box */}
              <div className="p-5 bg-blue-50/60 rounded-[12px] border border-blue-100 flex justify-between items-center text-blue-900 mt-4 shadow-sm">
                <span className="font-bold text-[14px]">Total Order Value</span>
                <span className="font-black text-[22px] text-[#0066FF]">
                  ₹{orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Action Buttons */}
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
                  disabled={isActionLoading}
                >
                  {isActionLoading && <Loader2 className="animate-spin w-4 h-4" />}
                  Submit Purchase Order
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}
