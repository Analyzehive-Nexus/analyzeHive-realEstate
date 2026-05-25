"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function saveCompanySetup(name: string, logo: string, city: string) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || "dev-user-001";

    // Ensure session cookies exist (for dev/onboarding without WorkOS auth)
    const cookieStore = cookies();
    if (!cookieStore.get("user_id")?.value) {
      cookieStore.set("user_id", userId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("user_email", "admin@analyzehive.com", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("user_role", "MD", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("user_name", "Admin User", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // Try inserting into the companies table
    const { data, error } = await supabaseAdmin
      .from("companies")
      .insert({
        user_id: userId,
        name,
        logo: logo || null,
        city
      })
      .select();

    // Set company branding cookies regardless of DB success
    cookieStore.set('company_name', name, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('company_city', city, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('company_logo', logo || 'building', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    if (error) {
      console.error("Error saving company:", error);
      // If the companies table doesn't exist, still succeed (cookies are set)
      if (error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        console.warn("Companies table not found. Company data saved to cookies only.");
        return { success: true, simulated: true };
      }
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error in saveCompanySetup:", error);
    return { error: error.message };
  }
}

export async function saveFirstProject(name: string, location: string, type: string, budget: number) {
  try {
    const user = await getSessionUser();
    if (!user) {
      // Still allow in dev mode
      console.warn("No session user for saveFirstProject, proceeding anyway.");
    }

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        name,
        location,
        type,
        status: "Active",
        budget_total: budget,
        budget_spent: 0,
        total_units: 40,
        floors_total: 10,
        floors_done: 0,
        completion_percentage: 0
      })
      .select();

    if (error) {
      console.error("Error saving first project:", error);
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return { success: true, simulated: true };
      }
      return { error: error.message };
    }

    revalidatePath("/sales");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in saveFirstProject:", error);
    return { error: error.message };
  }
}

export async function inviteTeamMember(name: string, email: string, role: string) {
  try {
    const user = await getSessionUser();
    if (!user) {
      console.warn("No session user for inviteTeamMember, proceeding anyway.");
    }

    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const uniqueId = `invited-${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        id: uniqueId,
        name,
        email,
        role,
        avatar_initials: initials || "TM",
        status: "Active",
        target_monthly: 5000000
      })
      .select();

    if (error) {
      console.error("Error inviting team member:", error);
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return { success: true, simulated: true };
      }
      return { error: error.message };
    }

    revalidatePath("/sales");
    return { success: true, data };
  } catch (error: any) {
    console.error("Error in inviteTeamMember:", error);
    return { error: error.message };
  }
}
