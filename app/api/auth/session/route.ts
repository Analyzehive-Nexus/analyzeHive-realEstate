import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    // Look up their actual full name from the Supabase users table
    let name = user.email.split("@")[0];
    try {
      const { data: userRecord } = await supabaseAdmin
        .from("users")
        .select("name")
        .eq("email", user.email)
        .limit(1)
        .maybeSingle();
      
      if (userRecord && userRecord.name) {
        name = userRecord.name;
      }
    } catch (e) {
      console.warn("Could not query name from users table:", e);
    }

    return NextResponse.json({
      authenticated: true,
      id: user.id,
      email: user.email,
      role: user.role,
      name: name
    });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json({ authenticated: false, error: "Internal error" }, { status: 500 });
  }
}
