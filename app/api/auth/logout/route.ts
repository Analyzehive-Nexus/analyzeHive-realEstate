import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  
  // Clear all auth and company branding cookies
  const cookiesToClear = [
    "user_id",
    "user_email",
    "user_role",
    "company_name",
    "company_city",
    "company_logo"
  ];
  
  cookiesToClear.forEach(cookieName => {
    cookieStore.set(cookieName, "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
    });
  });

  // Redirect to landing page
  return NextResponse.redirect(new URL("/", req.url));
}
