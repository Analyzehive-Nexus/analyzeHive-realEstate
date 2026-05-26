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
    if (!email) throw new Error('No email returned from WorkOS');

    // Extract role from WorkOS user metadata (default: 'MD')
    let role = user.metadata?.role as string || 'MD';
    // Normalize role to uppercase
    role = role.toUpperCase();

    let userId = user.id;
    let userName = email.split('@')[0];

    // Upsert user in Supabase
    const { data: userRecord, error } = await supabaseAdmin
      .from('users')
      .select('id, role, name')
      .eq('email', email)
      .single();

    const isNewUser = !userRecord;

    if (userRecord) {
      role = userRecord.role; // Use DB role if already set (can be overridden by admin)
      userId = userRecord.id;
      if (userRecord.name) userName = userRecord.name;
    } else {
      // Insert new user
      const initials = userName.substring(0, 2).toUpperCase();
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email: email,
          name: userName,
          role: role,
          avatar_initials: initials.length === 2 ? initials : (initials + 'A'),
          status: 'Active'
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("Failed to insert user record:", insertError.message);
      } else if (newUser) {
        console.log("Created database user profile for:", email);
      }
    }

    // Set session cookies
    const cookieStore = cookies();
    cookieStore.set('user_id', userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('user_role', role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('user_email', email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('user_name', userName, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // Check if company exists (onboarding check)
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
        cookieStore.set('company_name', companyRecord.name, { path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        cookieStore.set('company_city', companyRecord.city, { path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        if (companyRecord.logo) cookieStore.set('company_logo', companyRecord.logo, { path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
      }
    } catch (e) {
      console.warn("Could not query companies table:", e);
    }

    // Role-based redirect after login
    let redirectPath = '/command-center'; // fallback
    if (isNewUser) {
      redirectPath = '/onboarding';
    } else {
      switch (role) {
        case 'MD':
          redirectPath = '/dashboard';
          break;
        case 'BROKER':
        case 'VP_SALES':
          redirectPath = '/sales';
          break;
        case 'SITE_MANAGER':
        case 'ADMIN':
          redirectPath = '/construction';
          break;
        default:
          redirectPath = '/command-center';
      }
    }

    return NextResponse.redirect(new URL(redirectPath, req.url));
  } catch (error) {
    console.error('WorkOS callback error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

