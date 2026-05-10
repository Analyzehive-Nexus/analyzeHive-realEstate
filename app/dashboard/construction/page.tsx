"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";


import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import { fetchConstructionData, approveDemand, rejectDemand } from "./actions";
import { useProject } from "@/lib/contexts/ProjectContext";
import {
  Building2,
  Package,
  ClipboardList,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";

export default function ConstructionStatusPage() {
  const supabase = createBrowserClient();
  const { toast } = useToast();
  const { activeProject } = useProject();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingDemand, setProcessingDemand] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const result = await fetchConstructionData();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Real-time subscriptions
    const projectsChannel = supabase
      .channel("const-projects")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => loadData())
      .subscribe();

    const stockChannel = supabase
      .channel("const-stock")
      .on("postgres_changes", { event: "*", schema: "public", table: "inventory_items" }, () => loadData())
      .subscribe();

    const demandsChannel = supabase
      .channel("const-demands")
      .on("postgres_changes", { event: "*", schema: "public", table: "material_demands" }, () => loadData())
      .subscribe();

    const attendanceChannel = supabase
      .channel("const-attendance")
      .on("postgres_changes", { event: "*", schema: "public", table: "labour_attendance" }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(stockChannel);
      supabase.removeChannel(demandsChannel);
      supabase.removeChannel(attendanceChannel);
    };
  }, [activeProject]);

  const handleApprove = async (id: string) => {
    setProcessingDemand(id);
    const result = await approveDemand(id);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Demand approved", description: "Stock deducted successfully" });
      loadData();
    }
    setProcessingDemand(null);
  };

  const handleReject = async (id: string) => {
    setProcessingDemand(id);
    const result = await rejectDemand(id);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Demand rejected" });
      loadData();
    }
    setProcessingDemand(null);
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="animate-spin w-8 h-8 text-[#0066FF]" />
      </div>
    );
  }

  const {
    projects,
    criticalStock,
    pendingDemands,
    labourStats,
    attendanceTrend,
    assetsStats,
  } = data;

  const kpis = [
    {
      label: "Active Projects",
      value: projects.filter((p: any) => p.status === "Active").length,
      icon: Building2,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Critical Stock Items",
      value: criticalStock.length,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Pending Demands",
      value: pendingDemands.length,
      icon: ClipboardList,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Workers Present Today",
      value: labourStats.present,
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Active Assets",
      value: assetsStats.activeAssets,
      icon: Truck,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Construction Status</h1>
        <p className="text-gray-500 text-sm mt-1">Project progress, inventory, demands, and labour overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi, i) => (
          <Card key={i} className="bg-white border-gray-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-full ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-gray-500 uppercase font-bold">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project-wise Progress Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => (
              <div key={project.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{project.name}</h3>
                  <Badge
                    variant={project.status === "Active" ? "default" : "secondary"}
                    className={project.status === "Active" ? "bg-green-100 text-green-700" : ""}
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Completion</span>
                    <span>{project.completion_percentage || 0}%</span>
                  </div>
                  <Progress value={project.completion_percentage || 0} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {criticalStock.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No critical stock items</p>
          ) : (
            <ResponsiveTable>
<Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Threshold</TableHead>
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalStock.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-red-600 font-bold">{item.current_stock_level}</TableCell>
                    <TableCell>{item.min_threshold}</TableCell>
                    <TableCell>{item.unit_of_measurement}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
</ResponsiveTable>
          )}
        </CardContent>
      </Card>

      {/* Pending Demands with Approve/Reject */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Material Demands</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingDemands.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending demands</p>
          ) : (
            <ResponsiveTable>
<Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDemands.map((demand: any) => (
                  <TableRow key={demand.id}>
                    <TableCell>{demand.requested_by?.name || "Unknown"}</TableCell>
                    <TableCell>{demand.item?.name || "Unknown"}</TableCell>
                    <TableCell>
                      {demand.quantity_requested} {demand.item?.unit_of_measurement || ""}
                    </TableCell>
                    <TableCell>{new Date(demand.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleApprove(demand.id)}
                        disabled={processingDemand === demand.id}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleReject(demand.id)}
                        disabled={processingDemand === demand.id}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
</ResponsiveTable>
          )}
        </CardContent>
      </Card>

      {/* Labour Summary Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Labour Attendance Trend (Last 7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceTrend.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No attendance data available</p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="present" name="Workers Present" fill="#3B82F6" stroke="#3B82F6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
