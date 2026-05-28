import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

// Role-based route permissions
const roleRoutes: Record<string, string[]> = {
  'MD': ['/dashboard', '/sales', '/construction', '/command-center', '/settings', '/api'],
  'BROKER': ['/sales', '/command-center', '/settings/profile'],
  'VP_SALES': ['/sales', '/command-center', '/settings/profile'],
  'SITE_MANAGER': ['/construction', '/command-center', '/settings/profile'],
  'SUPERVISOR': ['/construction', '/command-center', '/settings/profile'],
  'ADMIN': ['/construction', '/command-center', '/settings/profile'],
};

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  // First, let WorkOS handle authentication (redirect to login if not authenticated)
  const authResponse = await authkitMiddleware({
    redirectUri: process.env.WORKOS_REDIRECT_URI,
  })(request, event);

  // If authResponse is a redirect (user not logged in), return it immediately
  if (authResponse && (authResponse.status === 302 || authResponse.status === 307)) {
    return authResponse;
  }

  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (
    pathname === '/' ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/webhooks')
  ) {
    return authResponse || NextResponse.next();
  }

  // User is authenticated – read role from cookie
  const userRoleCookie = request.cookies.get('user_role')?.value;

  // If authenticated but user_role cookie is missing, force logout/re-auth to restore cookies
  if (!userRoleCookie) {
    return NextResponse.redirect(new URL('/api/auth/logout', request.url));
  }

  const userRole = userRoleCookie.toUpperCase();

  // Check if the role is valid
  const allowedPaths = roleRoutes[userRole];
  if (!allowedPaths) {
    // Invalid role in cookie, force logout to clear invalid state
    return NextResponse.redirect(new URL('/api/auth/logout', request.url));
  }

  // Check if the user has permission to access the current path
  const isAllowed = allowedPaths.some(allowed => pathname.startsWith(allowed));

  if (!isAllowed) {
    // Redirect to appropriate default dashboard for the role
    let defaultRedirect = '/command-center';
    if (userRole === 'MD') defaultRedirect = '/dashboard';
    else if (userRole === 'BROKER' || userRole === 'VP_SALES') defaultRedirect = '/sales';
    else if (userRole === 'SITE_MANAGER' || userRole === 'ADMIN' || userRole === 'SUPERVISOR') defaultRedirect = '/construction';

    return NextResponse.redirect(new URL(defaultRedirect, request.url));
  }

  return authResponse || NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

