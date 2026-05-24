import { NextRequest, NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const workos = new WorkOS(process.env.WORKOS_API_KEY!);

  try {
    const { user } = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID!,
      code,
    });

    const email = user.email;
    if (!email) {
      throw new Error('No email returned from WorkOS');
    }

    let role = 'MD'; // default
    let userId = user.id;

    const { data: userRecord, error } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('email', email)
      .single();

    if (userRecord) {
      role = userRecord.role;
      userId = userRecord.id;
    } else {
      console.warn(`User ${email} not found in Supabase. Using default role (MD).`);
    }

    const cookieStore = cookies();
    cookieStore.set('user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('user_role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('user_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // Check if onboarding is completed by looking for a company record in the database
    let hasCompany = false;
    try {
      const { data: companyRecord } = await supabaseAdmin
        .from('companies')
        .select('id, name, city, logo')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (companyRecord) {
        hasCompany = true;
        // Populate company branding cookies so sidebars load branding instantly
        cookieStore.set('company_name', companyRecord.name, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        cookieStore.set('company_city', companyRecord.city, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        if (companyRecord.logo) {
          cookieStore.set('company_logo', companyRecord.logo, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
          });
        }
      }
    } catch (e) {
      console.warn("Could not query companies table during callback:", e);
    }

    let redirectPath = '/dashboard';
    if (!hasCompany) {
      redirectPath = '/onboarding';
    } else {
      if (role === 'VP_SALES' || role === 'BROKER') redirectPath = '/sales';
      if (role === 'SITE_MANAGER' || role === 'ADMIN') redirectPath = '/construction';
      if (role === 'MD') redirectPath = '/command-center';
    }

    return NextResponse.redirect(new URL(redirectPath, req.url));
  } catch (error) {
    console.error('WorkOS callback error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
