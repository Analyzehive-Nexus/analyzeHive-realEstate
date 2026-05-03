"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type DemandRequest = {
  id: string;
  quantity_requested: number;
  status: string;
  created_at: string;
  item: { name: string; unit_of_measurement?: string } | null;
  requested_by: { name: string } | null;
};

export async function fetchConstructionData() {
  const cookieStore = cookies();
  const projectId = cookieStore.get("project_id")?.value;

  // 1. Projects
  let projectsQuery = supabaseAdmin
    .from("projects")
    .select("id, name, completion_percentage, status");
  if (projectId) projectsQuery = projectsQuery.eq("id", projectId);
  const { data: projects } = await projectsQuery;

  // 2. Stock items (critical = quantity <= min_threshold)
  let stockQuery = supabaseAdmin
    .from("inventory_items")
    .select("id, name, current_stock_level, min_threshold, unit_of_measurement")
    .order("current_stock_level", { ascending: true });
  if (projectId) stockQuery = stockQuery.eq("project_id", projectId);
  const { data: stockItems } = await stockQuery;

  const criticalStock = (stockItems || []).filter(
    (item) => item.current_stock_level <= item.min_threshold
  );

  // 3. Pending demands
  let demandsQuery = supabaseAdmin
    .from("material_demands")
    .select(`
      id, quantity_requested, status, created_at,
      item:inventory_items(id, name, unit_of_measurement),
      requested_by:users(id, name)
    `)
    .eq("status", "Pending")
    .order("created_at", { ascending: false });
  if (projectId) demandsQuery = demandsQuery.eq("project_id", projectId);
  const { data: demands } = await demandsQuery;

  // 4. Labour attendance today
  const today = new Date().toISOString().split("T")[0];
  let attendanceQuery = supabaseAdmin
    .from("labour_attendance")
    .select("status, role")
    .eq("date", today);
  if (projectId) attendanceQuery = attendanceQuery.eq("project_id", projectId);
  const { data: attendance } = await attendanceQuery;

  const totalWorkers = attendance?.length || 0;
  const present = attendance?.filter((a) => a.status === "Present").length || 0;
  const absent = attendance?.filter((a) => a.status === "Absent").length || 0;
  const halfDay = attendance?.filter((a) => a.status === "Half Day").length || 0;

  // 5. Labour trend (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  let weeklyAttendanceQuery = supabaseAdmin
    .from("labour_attendance")
    .select("date, status")
    .gte("date", sevenDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: true });
  if (projectId) weeklyAttendanceQuery = weeklyAttendanceQuery.eq("project_id", projectId);
  const { data: weeklyAttendance } = await weeklyAttendanceQuery;

  const attendanceTrend: { date: string; present: number }[] = [];
  if (weeklyAttendance) {
    const grouped: Record<string, number> = {};
    weeklyAttendance.forEach((a) => {
      if (a.status === "Present") grouped[a.date] = (grouped[a.date] || 0) + 1;
    });
    for (const [date, count] of Object.entries(grouped)) {
      attendanceTrend.push({ date, present: count });
    }
  }

  // 6. Assets stats
  let assetsQuery = supabaseAdmin
    .from("assets_equipment")
    .select("status");
  if (projectId) assetsQuery = assetsQuery.eq("project_id", projectId);
  const { data: assets } = await assetsQuery;
  const totalAssets = assets?.length || 0;
  const activeAssets = assets?.filter((a) => a.status === "Active").length || 0;

  return {
    projects: projects || [],
    criticalStock,
    pendingDemands: (demands || []) as DemandRequest[],
    labourStats: { totalWorkers, present, absent, halfDay },
    attendanceTrend,
    assetsStats: { totalAssets, activeAssets },
  };
}

export async function approveDemand(demandId: string) {
  // First, get the demand and its item to deduct stock
  const { data: demand, error: fetchError } = await supabaseAdmin
    .from("material_demands")
    .select("item_id, quantity_requested")
    .eq("id", demandId)
    .single();

  if (fetchError || !demand) return { error: "Demand not found" };

  // Deduct stock
  const { error: stockError } = await supabaseAdmin.rpc("decrement_stock", {
    p_item_id: demand.item_id,
    p_quantity: demand.quantity_requested,
  });

  if (stockError) return { error: "Insufficient stock or update failed" };

  // Update demand status
  const { error: updateError } = await supabaseAdmin
    .from("material_demands")
    .update({ status: "Approved" })
    .eq("id", demandId);

  if (updateError) return { error: updateError.message };

  revalidatePath("/dashboard/construction");
  return { success: true };
}

export async function rejectDemand(demandId: string) {
  const { error } = await supabaseAdmin
    .from("material_demands")
    .update({ status: "Rejected" })
    .eq("id", demandId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/construction");
  return { success: true };
}
