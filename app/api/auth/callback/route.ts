import { NextRequest, NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  // 1. Get the authorization code from the URL
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    // If no code, redirect to login page
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 2. Initialize WorkOS with your API key
  const workos = new WorkOS(process.env.WORKOS_API_KEY!);

  try {
    // 3. Exchange the code for a session
    const { user } = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID!,
      code,
    });

    const email = user.email;

    if (!email) {
      throw new Error('No email returned from WorkOS');
    }

    // 4. Look up the user in your Supabase `users` table
    let role = 'MD'; // default role

    const { data: userRecord, error } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('email', email)
      .single();

    if (userRecord) {
      role = userRecord.role;
    } else {
      console.warn(`User ${email} not found in Supabase. Using default role.`);
    }

    // 5. Determine redirect path based on role
    let redirectPath = '/dashboard';
    if (role === 'VP_SALES') redirectPath = '/sales';
    if (role === 'SITE_MANAGER') redirectPath = '/construction';

    // 6. Redirect to the appropriate dashboard
    const redirectUrl = new URL(redirectPath, req.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('WorkOS callback error:', error);
    // On error, redirect to login page
    return NextResponse.redirect(new URL('/', req.url));
  }
}
