import { getSessionUser } from "@/lib/session";
import OnboardingClient from "./components/onboarding-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const cookieStore = cookies();
  
  // 1. Check if the company_name cookie is already set
  const hasCompanyCookie = cookieStore.get("company_name")?.value;
  if (hasCompanyCookie) {
    redirect("/command-center");
  }

  // Try to get session user
  let sessionUser = await getSessionUser();

  // If we have a logged-in user, check if they have a company in the database
  if (sessionUser && sessionUser.id) {
    try {
      const { data: companyRecord } = await supabaseAdmin
        .from("companies")
        .select("id")
        .eq("user_id", sessionUser.id)
        .limit(1)
        .maybeSingle();

      if (companyRecord) {
        redirect("/command-center");
      }
    } catch (error) {
      console.warn("Could not query companies table during onboarding check:", error);
    }
  } else {
    // If no session cookies exist (e.g. local dev fallback),
    // provide a default dev session so the onboarding page remains testable
    sessionUser = {
      id: "dev-user-001",
      email: "admin@analyzehive.com",
      role: "MD",
    };
  }

  return (
    <OnboardingClient sessionUser={sessionUser} />
  );
}
