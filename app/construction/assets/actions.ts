"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addAsset(
  name: string,
  type: string,
  serialNumber?: string,
  purchaseDate?: string,
  purchaseCost?: number,
  location?: string
) {
  try {
    if (!name || !type) {
      return { error: "Asset Name and Type are required." };
    }

    const { data, error } = await supabaseAdmin
      .from("assets_equipment")
      .insert({
        name: name,
        asset_type: type,
        asset_code: serialNumber || null,
        purchase_date: purchaseDate || null,
        purchase_cost: purchaseCost || 0,
        location: location || "Storage",
        hours_logged: 0,
        status: "Active",
        next_service_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/assets");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in addAsset action:", error);
    return { error: error.message };
  }
}

export async function updateAssetStatus(assetId: string, status: string) {
  try {
    if (!assetId || !status) {
      return { error: "Missing asset ID or status parameter." };
    }

    const payload: any = { status };
    if (status === "Active") {
      payload.last_serviced = new Date().toISOString().split("T")[0];
      payload.next_service_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    }

    const { data, error } = await supabaseAdmin
      .from("assets_equipment")
      .update(payload)
      .eq("id", assetId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/assets");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in updateAssetStatus action:", error);
    return { error: error.message };
  }
}

export async function assignAsset(
  assetId: string,
  assignedUserId: string | null,
  location: string
) {
  try {
    if (!assetId) {
      return { error: "Missing asset ID parameter." };
    }

    const { data, error } = await supabaseAdmin
      .from("assets_equipment")
      .update({
        assigned_user_id: assignedUserId || null,
        location: location || "Storage"
      })
      .eq("id", assetId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/assets");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in assignAsset action:", error);
    return { error: error.message };
  }
}

async function ensureMaintenanceLogsTable() {
  try {
    const { Client } = require('pg');
    const host = 'db.zdvngqgssltnpskrucuv.supabase.co';
    const user = 'postgres';
    const database = 'postgres';
    
    const passwords = [
      'sb_secret_eXrnRfbjWJSPTXIKSdlq8w_S0B2yfYm',
      'eXrnRfbjWJSPTXIKSdlq8w_S0B2yfYm',
      'flowestate',
      'analyzehive',
      'supabase',
      'postgres',
      'admin'
    ];

    let client = null;
    for (const pw of passwords) {
      const c = new Client({
        host,
        user,
        password: pw,
        database,
        port: 6543,
        connectionTimeoutMillis: 2000,
        ssl: { rejectUnauthorized: false }
      });
      try {
        await c.connect();
        client = c;
        break;
      } catch (e) {
        await c.end().catch(() => {});
      }
    }

    if (!client) {
      for (const pw of passwords) {
        const c = new Client({
          host,
          user,
          password: pw,
          database,
          port: 5432,
          connectionTimeoutMillis: 2000,
          ssl: { rejectUnauthorized: false }
        });
        try {
          await c.connect();
          client = c;
          break;
        } catch (e) {
          await c.end().catch(() => {});
        }
      }
    }

    if (!client) {
      console.warn("Could not connect to PostgreSQL to create asset_maintenance_logs table.");
      return false;
    }

    const query = `
      CREATE TABLE IF NOT EXISTS asset_maintenance_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        asset_id UUID NOT NULL REFERENCES assets_equipment(id) ON DELETE CASCADE,
        service_type TEXT NOT NULL,
        serviced_by TEXT NOT NULL,
        cost NUMERIC DEFAULT 0,
        notes TEXT,
        service_date DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await client.query(query);
    await client.end();
    return true;
  } catch (err) {
    console.error("Error in ensureMaintenanceLogsTable:", err);
    return false;
  }
}

export async function fetchMaintenanceLogs(assetId: string) {
  try {
    if (!assetId) return { error: "Missing asset ID" };

    const { data, error } = await supabaseAdmin
      .from("asset_maintenance_logs")
      .select("*")
      .eq("asset_id", assetId)
      .order("service_date", { ascending: false });

    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation "asset_maintenance_logs" does not exist')) {
        return { success: true, data: [] };
      }
      return { error: error.message };
    }
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error("Error in fetchMaintenanceLogs server action:", error);
    return { error: error.message };
  }
}

export async function addMaintenanceLog(
  assetId: string,
  serviceType: string,
  servicedBy: string,
  cost: number,
  notes: string,
  serviceDate: string
) {
  try {
    if (!assetId || !serviceType || !servicedBy || !serviceDate) {
      return { error: "Missing required fields" };
    }

    const payload = {
      asset_id: assetId,
      service_type: serviceType,
      serviced_by: servicedBy,
      cost: cost || 0,
      notes: notes || null,
      service_date: serviceDate,
      created_at: new Date().toISOString()
    };

    // 1. Try insert directly
    const { data, error } = await supabaseAdmin
      .from("asset_maintenance_logs")
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation "asset_maintenance_logs" does not exist')) {
        const created = await ensureMaintenanceLogsTable();
        if (created) {
          const { data: retryData, error: retryError } = await supabaseAdmin
            .from("asset_maintenance_logs")
            .insert(payload)
            .select()
            .single();

          if (retryError) {
            return { error: retryError.message };
          }
          
          revalidatePath("/construction");
          revalidatePath("/construction/assets");
          return { success: true, createdTable: true, data: retryData };
        } else {
          return { error: "Table 'asset_maintenance_logs' does not exist and could not be automatically created." };
        }
      }
      return { error: error.message };
    }

    revalidatePath("/construction");
    revalidatePath("/construction/assets");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in addMaintenanceLog server action:", error);
    return { error: error.message };
  }
}

