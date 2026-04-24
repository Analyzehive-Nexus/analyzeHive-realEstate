import { NextRequest, NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  // If no authorization code, redirect to login page
  if (!code) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const workos = new WorkOS(process.env.WORKOS_API_KEY!);

  try {
    // Exchange the code for a user object
    const { user } = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID!,
      code,
    });

    const email = user.email;
    if (!email) {
      throw new Error('No email returned from WorkOS');
    }

    // ──────────────────────────────────────────────────────────
    // 1. Determine the user's role (from Supabase or fallback)
    //    Role is read from the WorkOS user metadata (custom claims)
    //    but we initially fetch from Supabase as the source of truth.
    // ──────────────────────────────────────────────────────────
    let role = 'MD'; // default

    const { data: userRecord, error } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('email', email)
      .single();

    if (userRecord) {
      role = userRecord.role;
    } else {
      console.warn(`User ${email} not found in Supabase. Using default role (MD).`);
    }

    // ──────────────────────────────────────────────────────────
    // 2. Store the role + email in secure, httpOnly cookies
    //    This acts as our "session" store for the role.
    // ──────────────────────────────────────────────────────────
    const cookieStore = cookies();
    cookieStore.set('user_role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookieStore.set('user_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // ──────────────────────────────────────────────────────────
    // 3. Role‑based redirection
    //    MD → /dashboard, VP_SALES/BROKER → /sales,
    //    SITE_MANAGER/ADMIN → /construction
    // ──────────────────────────────────────────────────────────
    let redirectPath = '/dashboard';
    if (role === 'VP_SALES' || role === 'BROKER') redirectPath = '/sales';
    if (role === 'SITE_MANAGER' || role === 'ADMIN') redirectPath = '/construction';

    return NextResponse.redirect(new URL(redirectPath, req.url));
  } catch (error) {
    console.error('WorkOS callback error:', error);
    // On any error, redirect back to login page
    return NextResponse.redirect(new URL('/', req.url));
  }
}
