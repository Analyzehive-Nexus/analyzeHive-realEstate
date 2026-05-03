"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
  const session = await getSessionUser();
  if (!session) {
    console.error("No session user");
    return { name: "", email: "", phone: "", avatar_initials: "" };
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("name, email, phone, avatar_initials")
    .eq("id", session.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user profile:", error);
    return { name: "", email: "", phone: "", avatar_initials: "" };
  }
  if (!data) {
    // Fallback using session info
    return {
      name: session.email.split("@")[0],
      email: session.email,
      phone: "",
      avatar_initials: session.email.charAt(0).toUpperCase(),
    };
  }
  return data;
}

export async function updateUserProfile(formData: FormData) {
  const session = await getSessionUser();
  if (!session) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const avatar_initials = formData.get("avatar_initials") as string;

  const { error } = await supabaseAdmin
    .from("users")
    .update({ name, phone, avatar_initials, updated_at: new Date().toISOString() })
    .eq("id", session.id);

  if (error) return { error: error.message };
  revalidatePath("/settings/profile");
  return { success: true };
}

// Get company settings (MD only)
export async function getCompanySettings() {
  const session = await getSessionUser();
  if (!session || session.role !== "MD") throw new Error("Forbidden");

  const { data, error } = await supabaseAdmin
    .from("company_settings")
    .select("company_name, logo_url")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Update company name (MD only)
export async function updateCompanyName(formData: FormData) {
  const session = await getSessionUser();
  if (!session || session.role !== "MD") return { error: "Forbidden" };

  const company_name = formData.get("company_name") as string;
  const companyData = await supabaseAdmin.from("company_settings").select("id").single();
  if (!companyData.data) return { error: "Company settings not found" };

  const { error } = await supabaseAdmin
    .from("company_settings")
    .update({ company_name, updated_at: new Date().toISOString() })
    .eq("id", companyData.data.id);

  if (error) return { error: error.message };
  revalidatePath("/settings/company");
  return { success: true };
}

// Upload logo (MD only)
export async function uploadLogo(formData: FormData) {
  const session = await getSessionUser();
  if (!session || session.role !== "MD") return { error: "Forbidden" };

  const file = formData.get("logo") as File;
  if (!file) return { error: "No file provided" };

  const fileExt = file.name.split(".").pop();
  const fileName = `company-logo.${fileExt}`;
  const filePath = `public/${fileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("company-assets")
    .upload(filePath, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabaseAdmin.storage.from("company-assets").getPublicUrl(filePath);
  const logo_url = urlData.publicUrl;

  const companyData = await supabaseAdmin.from("company_settings").select("id").single();
  if (!companyData.data) return { error: "Company settings not found" };

  const { error: updateError } = await supabaseAdmin
    .from("company_settings")
    .update({ logo_url, updated_at: new Date().toISOString() })
    .eq("id", companyData.data.id);

  if (updateError) return { error: updateError.message };
  revalidatePath("/settings/company");
  return { success: true, logo_url };
}
