import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { UserRole } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();
    const normalizedRole = role?.toUpperCase() as UserRole;

    const validRoles: UserRole[] = ["MD", "VP_SALES", "BROKER", "SITE_MANAGER", "ADMIN"];
    if (!validRoles.includes(normalizedRole)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: No session active" }, { status: 401 });
    }

    // 1. Persist the updated role in the database
    const { error: dbError } = await supabaseAdmin
      .from("users")
      .update({ role: normalizedRole })
      .eq("id", userId);

    if (dbError) {
      console.error("Failed to update role in DB:", dbError.message);
      return NextResponse.json({ error: "Failed to persist role in database" }, { status: 500 });
    }

    // 2. Overwrite the user_role session cookie so Next.js middleware reflects it immediately
    cookieStore.set("user_role", normalizedRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log(`User ${userId} switched active role to ${normalizedRole}`);

    return NextResponse.json({ success: true, role: normalizedRole });
  } catch (error) {
    console.error("Switch role API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
