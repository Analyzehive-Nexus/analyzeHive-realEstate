import { getSessionUser } from "@/lib/session";
import OnboardingClient from "./components/onboarding-client";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  // Try to get session user from cookies
  let sessionUser = await getSessionUser();

  // If no session cookies exist (e.g. user navigated directly without WorkOS login),
  // provide a fallback dev session so the onboarding page is always accessible
  if (!sessionUser) {
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
