import { cookies } from "next/headers";

export type UserRole = "MD" | "VP_SALES" | "BROKER" | "SITE_MANAGER" | "ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  const userEmail = cookieStore.get("user_email")?.value;
  const userRole = cookieStore.get("user_role")?.value as UserRole | undefined;

  if (!userId || !userEmail || !userRole) return null;
  return { id: userId, email: userEmail, role: userRole };
}
