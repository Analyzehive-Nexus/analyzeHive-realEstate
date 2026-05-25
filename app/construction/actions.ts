"use server";

import { supabaseAdmin } from "@/lib/supabase";
import {
  getInventoryItems,
  getInventoryStats,
  getMaterialDemands,
} from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function fetchInventoryData() {
  try {
    const [items, stats] = await Promise.all([
      getInventoryItems(),
      getInventoryStats(),
    ]);
    return { items: items || [], stats };
  } catch (error: any) {
    console.error("Error in fetchInventoryData:", error);
    return { items: [], stats: null, error: error.message };
  }
}

export async function fetchDemandsData() {
  try {
    const demands = await getMaterialDemands();
    return demands || [];
  } catch (error: any) {
    console.error("Error in fetchDemandsData:", error);
    return [];
  }
}

export async function editInventoryItem(
  id: string,
  name: string,
  category: string,
  minThreshold: number,
  unitOfMeasurement: string,
) {
  try {
    if (!id || !name || !category || !unitOfMeasurement) {
      return { error: "Missing required fields" };
    }

    const { data, error } = await supabaseAdmin
      .from("inventory_items")
      .update({
        name,
        category,
        min_threshold: minThreshold,
        unit_of_measurement: unitOfMeasurement,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/stock");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in editInventoryItem:", error);
    return { error: error.message };
  }
}

export async function restockInventoryItem(id: string, quantityToAdd: number) {
  try {
    if (!id || quantityToAdd <= 0) {
      return { error: "Invalid quantity or item ID" };
    }

    // 1. Fetch current stock
    const { data: item, error: fetchError } = await supabaseAdmin
      .from("inventory_items")
      .select("current_stock_level")
      .eq("id", id)
      .single();

    if (fetchError || !item) {
      return { error: "Item not found" };
    }

    const newLevel = Number(item.current_stock_level || 0) + quantityToAdd;

    // 2. Update stock level
    const { data, error } = await supabaseAdmin
      .from("inventory_items")
      .update({
        current_stock_level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/stock");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in restockInventoryItem:", error);
    return { error: error.message };
  }
}

export async function createDemandRequest(
  itemId: string,
  quantityRequested: number,
  requestedBy: string,
  projectTower: string,
  justification?: string,
  requiredBy?: string,
) {
  try {
    if (!itemId || quantityRequested <= 0 || !requestedBy || !projectTower) {
      return { error: "Missing required fields" };
    }

    const { data, error } = await supabaseAdmin
      .from("material_demands")
      .insert({
        item_id: itemId,
        quantity_requested: quantityRequested,
        requested_by_user_id: requestedBy,
        project_tower: projectTower,
        justification: justification || "",
        required_by: requiredBy || null,
        status: "Pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/demands");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in createDemandRequest:", error);
    return { error: error.message };
  }
}

export async function createVendorOrder(
  vendorId: string,
  items: any[],
  deliveryDate: string,
  paymentTerms: string,
): Promise<{
  success?: boolean;
  error?: string;
  data?: any;
  tableMissing?: boolean;
  simulated?: boolean;
  sql?: string;
  createdTable?: boolean;
}> {
  try {
    if (
      !vendorId ||
      !items ||
      items.length === 0 ||
      !deliveryDate ||
      !paymentTerms
    ) {
      return { error: "Missing required fields" };
    }

    const totalOrderValue = items.reduce(
      (sum, item) => sum + (item.total || 0),
      0,
    );

    // Helper to increment outstanding balance on the real vendors table
    const incrementOutstanding = async () => {
      try {
        const { data: vendor } = await supabaseAdmin
          .from("vendors")
          .select("outstanding_amount")
          .eq("id", vendorId)
          .single();
        if (vendor) {
          const currentOutstanding = Number(vendor.outstanding_amount || 0);
          await supabaseAdmin
            .from("vendors")
            .update({
              outstanding_amount: currentOutstanding + totalOrderValue,
            })
            .eq("id", vendorId);
        }
      } catch (err) {
        console.error("Could not update outstanding balance for vendor:", err);
      }
    };

    // 1. Try to insert into the real vendor_orders table
    const { data, error } = await supabaseAdmin
      .from("vendor_orders")
      .insert({
        vendor_id: vendorId,
        items,
        delivery_date: deliveryDate,
        payment_terms: paymentTerms,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // If vendor_orders table doesn't exist, use graceful fallback
      if (
        error.code === "PGRST205" ||
        error.message?.includes('relation "vendor_orders" does not exist') ||
        error.code === "42P01"
      ) {
        // Simulate an order object and still update the vendor's outstanding balance
        const simulatedOrder = {
          id: `ord-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`,
          vendor_id: vendorId,
          items,
          delivery_date: deliveryDate,
          payment_terms: paymentTerms,
          created_at: new Date().toISOString(),
        };

        await incrementOutstanding();
        revalidatePath("/construction/vendors");
        return {
          success: true,
          simulated: true,
          tableMissing: true,
          data: simulatedOrder,
          sql: `
            CREATE TABLE IF NOT EXISTS public.vendor_orders (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
              items JSONB DEFAULT '[]',
              delivery_date DATE,
              payment_terms TEXT DEFAULT 'net30',
              notes TEXT,
              total_value NUMERIC DEFAULT 0,
              status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Delivered', 'Cancelled')),
              created_at TIMESTAMPTZ DEFAULT NOW()
            );
          `,
          createdTable: false,
        };
      }
      return { error: error.message };
    }

    await incrementOutstanding();
    revalidatePath("/construction/vendors");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in createVendorOrder server action:", error);
    return { error: error.message };
  }
}

export async function upsertLabourAttendance(
  workerName: string,
  role: string,
  phone: string,
  date: string,
  status: string,
  checkIn?: string,
  checkOut?: string,
  notes?: string,
) {
  try {
    if (!workerName || !role || !date || !status) {
      return { error: "Missing required fields" };
    }

    // 1. Check if record exists for this worker on this date
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("labour_attendance")
      .select("id")
      .eq("worker_name", workerName)
      .eq("date", date)
      .maybeSingle();

    if (fetchError) {
      return { error: fetchError.message };
    }

    const payload = {
      worker_name: workerName,
      role,
      phone,
      date,
      status,
      check_in: checkIn
        ? checkIn.length === 5
          ? `${checkIn}:00`
          : checkIn
        : null,
      check_out: checkOut
        ? checkOut.length === 5
          ? `${checkOut}:00`
          : checkOut
        : null,
      notes: notes || null,
    };

    if (existing) {
      // Update
      const { data, error } = await supabaseAdmin
        .from("labour_attendance")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return { error: error.message };
      revalidatePath("/construction/labour");
      return { success: true, action: "update", data };
    } else {
      // Insert
      const { data, error } = await supabaseAdmin
        .from("labour_attendance")
        .insert({
          ...payload,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return { error: error.message };
      revalidatePath("/construction/labour");
      return { success: true, action: "insert", data };
    }
  } catch (error: any) {
    console.error("Error in upsertLabourAttendance:", error);
    return { error: error.message };
  }
}

export async function addLabourWorker(
  workerName: string,
  role: string,
  phone: string,
  date: string,
  status: string,
) {
  try {
    if (!workerName || !role || !phone || !date || !status) {
      return { error: "Missing required fields" };
    }

    const { data, error } = await supabaseAdmin
      .from("labour_attendance")
      .insert({
        worker_name: workerName,
        role,
        phone,
        date,
        status,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction/labour");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in addLabourWorker:", error);
    return { error: error.message };
  }
}

export async function fetchLabourAttendanceForDate(date: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("labour_attendance")
      .select("*")
      .eq("date", date)
      .order("role")
      .order("worker_name");

    if (error) return { error: error.message };
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error in fetchLabourAttendanceForDate:", error);
    return { error: error.message };
  }
}

export async function fetchLabourAttendanceTrend() {
  try {
    // Fetch last 30 days of attendance
    const { data, error } = await supabaseAdmin
      .from("labour_attendance")
      .select("date, status")
      .order("date", { ascending: true });

    if (error) return { error: error.message };

    // Group by date and count present workers
    const groups: Record<string, number> = {};
    (data || []).forEach((row) => {
      const d = row.date;
      if (!groups[d]) groups[d] = 0;
      if (row.status === "Present" || row.status === "Half Day") {
        groups[d] += 1;
      }
    });

    // Format for AreaChart: select last 30 days
    const trend = Object.entries(groups)
      .map(([date, count]) => {
        const parts = date.split("-");
        const dayStr = parts[2] || "01";
        return {
          day: dayStr,
          dateFull: date,
          count,
        };
      })
      .slice(-30);

    return { success: true, data: trend };
  } catch (error: any) {
    console.error("Error in fetchLabourAttendanceTrend:", error);
    return { error: error.message };
  }
}

export async function fetchWorkerAttendanceHistory() {
  try {
    const { data, error } = await supabaseAdmin
      .from("labour_attendance")
      .select("worker_name, status");

    if (error) return { error: error.message };
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error in fetchWorkerAttendanceHistory:", error);
    return { error: error.message };
  }
}

export async function createDailyProgressReport(
  projectName: string,
  floorArea: string,
  date: string,
  completionPercentage: number,
  weather: string,
  workersPresent: number,
  workDone: string,
  materialsUsed: any[],
  issues?: string,
  photos?: string[],
) {
  try {
    if (
      !projectName ||
      !floorArea ||
      !date ||
      completionPercentage === undefined ||
      !weather ||
      workersPresent === undefined ||
      !workDone
    ) {
      return { error: "Missing required fields" };
    }

    const submittedBy = "workos-site-001";

    const { data, error } = await supabaseAdmin
      .from("daily_progress")
      .insert({
        project_name: projectName,
        floor_area: floorArea,
        date,
        completion_percentage: completionPercentage,
        weather,
        workers_present: workersPresent,
        work_done: workDone,
        materials_used: materialsUsed || [],
        issues: issues || null,
        photos: photos || [],
        submitted_by: submittedBy,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/progress");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in createDailyProgressReport server action:", error);
    return { error: error.message };
  }
}

export async function fetchDailyProgressReports() {
  try {
    const { data, error } = await supabaseAdmin
      .from("daily_progress")
      .select(
        `
        *,
        submitted_by_user:users(id, name)
      `,
      )
      .order("date", { ascending: false });

    if (error) return { error: error.message };
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error in fetchDailyProgressReports server action:", error);
    return { error: error.message };
  }
}

export async function uploadSitePhoto(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    const caption = (formData.get("caption") as string) || "";
    const projectName = formData.get("projectName") as string;
    const uploadedBy =
      (formData.get("uploadedBy") as string) || "workos-site-001";

    if (!file || !projectName) {
      return { error: "Missing required file or project name" };
    }

    // 1. Convert File to ArrayBuffer and Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Ensure Storage Bucket exists
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const hasBucket = buckets?.some((b) => b.name === "site-photos");
      if (!hasBucket) {
        await supabaseAdmin.storage.createBucket("site-photos", {
          public: true,
        });
      }
    } catch (bucketErr: any) {
      console.warn("Storage bucket setup warning:", bucketErr.message);
    }

    // 3. Upload File to Storage
    // Clean up filename characters to be storage-safe
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${Date.now()}-${safeFileName}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("site-photos")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { error: `Storage upload error: ${uploadError.message}` };
    }

    // 4. Get Public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("site-photos").getPublicUrl(storagePath);

    // 5. Save metadata to table
    const { data, error } = await supabaseAdmin
      .from("site_photos")
      .insert({
        url: publicUrl,
        caption: caption,
        project_name: projectName,
        uploaded_by: uploadedBy,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      if (
        error.code === "42P01" ||
        error.message?.includes('relation "site_photos" does not exist')
      ) {
        return {
          error:
            "Table 'site_photos' does not exist in your Supabase database.",
          tableMissing: true,
          sql: `CREATE TABLE IF NOT EXISTS site_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT,
  project_name TEXT NOT NULL,
  uploaded_by TEXT DEFAULT 'workos-site-001',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
        };
      }
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/photos");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in uploadSitePhoto server action:", error);
    return { error: error.message };
  }
}

export async function fetchSitePhotos() {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_photos")
      .select(
        `
        *,
        uploaded_by_user:users(id, name)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      if (
        error.code === "42P01" ||
        error.message?.includes('relation "site_photos" does not exist')
      ) {
        return {
          success: true,
          data: [],
          tableMissing: true,
          sql: `CREATE TABLE IF NOT EXISTS site_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  caption TEXT,
  project_name TEXT NOT NULL,
  uploaded_by TEXT DEFAULT 'workos-site-001',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
        };
      }
      return { error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error in fetchSitePhotos server action:", error);
    return { error: error.message };
  }
}

export async function deleteSitePhoto(id: string, storagePath: string) {
  try {
    if (!id) return { error: "Missing photo ID" };

    // 1. Delete from database metadata
    const { error: dbError } = await supabaseAdmin
      .from("site_photos")
      .delete()
      .eq("id", id);

    if (dbError) return { error: dbError.message };

    // 2. Delete from storage if storagePath is provided
    if (storagePath) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("site-photos")
        .remove([storagePath]);

      if (storageError) {
        console.warn(
          "Could not delete from storage bucket:",
          storageError.message,
        );
      }
    }

    revalidatePath("/construction");
    revalidatePath("/construction/photos");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteSitePhoto server action:", error);
    return { error: error.message };
  }
}

export async function createFinancialTransaction(
  category: string,
  amount: number,
  vendor: string,
  invoiceNumber: string,
  description: string,
  transactionDate: string,
) {
  try {
    if (!category || amount <= 0 || !vendor || !transactionDate) {
      return { error: "Missing required fields or invalid amount" };
    }

    const { data, error } = await supabaseAdmin
      .from("financial_ledger")
      .insert({
        transaction_type: "Expense",
        category,
        amount,
        vendor_id: null,
        description,
        invoice_number: invoiceNumber || null,
        transaction_date: transactionDate,
        status: "Approved",
        logged_by_user_id: "workos-site-001",
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/budget");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in createFinancialTransaction server action:", error);
    return { error: error.message };
  }
}

export async function deleteFinancialTransaction(id: string) {
  try {
    if (!id) return { error: "Missing transaction ID" };

    const { error } = await supabaseAdmin
      .from("financial_ledger")
      .delete()
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/construction");
    revalidatePath("/construction/budget");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteFinancialTransaction server action:", error);
    return { error: error.message };
  }
}

export async function updateFinancialTransactionStatus(
  id: string,
  status: string,
) {
  try {
    if (!id || !status) return { error: "Missing required fields" };

    const { data, error } = await supabaseAdmin
      .from("financial_ledger")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) return { error: error.message };

    revalidatePath("/construction");
    revalidatePath("/construction/budget");
    return { success: true, data };
  } catch (error: any) {
    console.error(
      "Error in updateFinancialTransactionStatus server action:",
      error,
    );
    return { error: error.message };
  }
}

export async function fetchFinancialTransactions() {
  try {
    const { data, error } = await supabaseAdmin
      .from("financial_ledger")
      .select(
        `
        *,
        logged_by:users(id, name)
      `,
      )
      .order("transaction_date", { ascending: false });

    if (error) return { error: error.message };
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error in fetchFinancialTransactions server action:", error);
    return { error: error.message };
  }
}

export async function createVendor(
  name: string,
  category: string,
  contactPerson: string,
  phone: string,
  email: string,
  creditLimit: number,
  rating: number,
  status: string,
) {
  try {
    if (!name || !category || !phone) {
      return { error: "Missing required fields" };
    }

    const { data, error } = await supabaseAdmin
      .from("vendors")
      .insert({
        name,
        category,
        contact_person: contactPerson || null,
        phone,
        email: email || null,
        outstanding_amount: 0,
        credit_limit: creditLimit || 0,
        rating: rating || 5,
        status: status || "Active",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return { error: error.message };

    revalidatePath("/construction");
    revalidatePath("/construction/vendors");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in createVendor server action:", error);
    return { error: error.message };
  }
}

export async function updateVendor(
  id: string,
  name: string,
  category: string,
  contactPerson: string,
  phone: string,
  email: string,
  creditLimit: number,
  rating: number,
  status: string,
) {
  try {
    if (!id || !name || !category || !phone) {
      return { error: "Missing required fields" };
    }

    const { data, error } = await supabaseAdmin
      .from("vendors")
      .update({
        name,
        category,
        contact_person: contactPerson || null,
        phone,
        email: email || null,
        credit_limit: creditLimit || 0,
        rating: rating || 5,
        status: status || "Active",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return { error: error.message };

    revalidatePath("/construction");
    revalidatePath("/construction/vendors");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in updateVendor server action:", error);
    return { error: error.message };
  }
}

export async function deleteVendor(id: string) {
  try {
    if (!id) return { error: "Missing vendor ID" };

    const { error } = await supabaseAdmin.from("vendors").delete().eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/construction");
    revalidatePath("/construction/vendors");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteVendor server action:", error);
    return { error: error.message };
  }
}

export async function fetchVendorOrdersList(vendorId: string) {
  try {
    if (!vendorId) return { error: "Missing vendor ID" };

    let query = supabaseAdmin.from("vendor_orders").select("*");
    if (vendorId !== "all") {
      query = query.eq("vendor_id", vendorId);
    }
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      // If vendor_orders table doesn't exist, return empty array gracefully
      if (
        error.code === "42P01" ||
        error.message?.includes('relation "vendor_orders" does not exist') ||
        error.code === "PGRST205"
      ) {
        return { success: true, data: [], tableMissing: true };
      }
      return { error: error.message };
    }
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error in fetchVendorOrdersList server action:", error);
    return { error: error.message };
  }
}

export async function fetchVendorsList() {
  try {
    const { data, error } = await supabaseAdmin
      .from("vendors")
      .select("*")
      .order("name");

    if (error) return { error: error.message };
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error in fetchVendorsList server action:", error);
    return { error: error.message };
  }
}

export async function recordVendorPayment(
  vendorId: string,
  amount: number,
  notes?: string,
) {
  try {
    if (!vendorId || amount <= 0) {
      return { error: "Invalid vendor ID or payment amount." };
    }

    // 1. Fetch current vendor details
    const { data: vendor, error: fetchErr } = await supabaseAdmin
      .from("vendors")
      .select("name, outstanding_amount")
      .eq("id", vendorId)
      .single();

    if (fetchErr || !vendor) {
      return { error: "Vendor profile not found." };
    }

    const currentOutstanding = Number(vendor.outstanding_amount || 0);
    const newOutstanding = Math.max(0, currentOutstanding - amount);

    // 2. Update outstanding amount
    const { data: updatedVendor, error: updateErr } = await supabaseAdmin
      .from("vendors")
      .update({ outstanding_amount: newOutstanding })
      .eq("id", vendorId)
      .select()
      .single();

    if (updateErr) {
      return { error: updateErr.message };
    }

    // 3. Log an expense in financial_ledger
    const { error: ledgerErr } = await supabaseAdmin
      .from("financial_ledger")
      .insert({
        transaction_type: "Expense",
        category: "Construction",
        amount: amount,
        description: `Payment to Supplier: ${vendor.name}${notes ? ` (${notes})` : ""}`,
        invoice_number: `PAY-${Date.now().toString().substring(7)}`,
        transaction_date: new Date().toISOString().split("T")[0],
        status: "Approved",
        logged_by_user_id: "workos-site-001",
      });

    if (ledgerErr) {
      console.warn(
        "Could not log financial ledger expense for vendor payment:",
        ledgerErr.message,
      );
    }

    revalidatePath("/construction");
    revalidatePath("/construction/vendors");
    revalidatePath("/construction/budget");

    return { success: true, newOutstanding, data: updatedVendor };
  } catch (error: any) {
    console.error("Error in recordVendorPayment server action:", error);
    return { error: error.message };
  }
}

export async function fetchNotificationsList(userId = "workos-site-001") {
  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      if (
        error.code === "42P01" ||
        error.message?.includes('relation "notifications" does not exist')
      ) {
        return {
          success: true,
          data: [],
          tableMissing: true,
          sql: `CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT DEFAULT 'workos-site-001',
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('alert', 'info', 'success', 'warning')) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
        };
      }
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error in fetchNotificationsList server action:", error);
    return { error: error.message };
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error in markNotificationAsRead server action:", error);
    return { error: error.message };
  }
}

export async function markAllNotificationsRead(userId = "workos-site-001") {
  try {
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false)
      .select();

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error in markAllNotificationsRead server action:", error);
    return { error: error.message };
  }
}
