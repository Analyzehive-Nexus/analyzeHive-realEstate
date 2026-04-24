import { NextResponse } from 'next/server';
import { handleAuth } from '@workos-inc/authkit-nextjs';
import { supabaseAdmin } from '@/lib/supabase';

export const GET = handleAuth({
  afterSignIn: async (req, session) => {
    // Get the user's email from the WorkOS session
    const email = session.user?.email;

    // Default redirect path
    let redirectPath = '/dashboard';

    if (email) {
      // Fetch user role from your database (Supabase)
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('email', email)
        .single();

      if (!error && user) {
        // Map database roles to dashboard paths
        if (user.role === 'VP_SALES') redirectPath = '/sales';
        else if (user.role === 'SITE_MANAGER') redirectPath = '/construction';
        else if (user.role === 'ADMIN') redirectPath = '/dashboard';
        // Add other roles as needed
      }
    }

    // Perform the redirect
    return NextResponse.redirect(new URL(redirectPath, req.url));
  },
});
