import { NextRequest, NextResponse } from "next/server";
import WorkOS from "@workos-inc/node";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const workos = new WorkOS(process.env.WORKOS_API_KEY!);

  try {
    const { user } = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID!,
      code,
    });

    const email = user.email;
    if (!email) throw new Error("No email returned");

    let role = "MD";
    let userId = user.id;

    // Find or create user in Supabase
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id, role")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      userId = existing.id;
      role = existing.role;
    } else {
      const { data: inserted } = await supabaseAdmin
        .from("users")
        .insert({
          id: userId,
          email,
          name: email.split("@")[0],
          role,
        })
        .select("id, role")
        .single();
      if (inserted) {
        userId = inserted.id;
        role = inserted.role;
      }
    }

    const cookieStore = cookies();
    cookieStore.set("user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set("user_role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    let redirectPath = "/dashboard";
    if (role === "VP_SALES" || role === "BROKER") redirectPath = "/sales";
    if (role === "SITE_MANAGER" || role === "ADMIN") redirectPath = "/construction";
    if (role === "MD") redirectPath = "/command-center";

    return NextResponse.redirect(new URL(redirectPath, req.url));
  } catch (error) {
    console.error("WorkOS callback error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
