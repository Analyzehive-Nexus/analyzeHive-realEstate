import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  // Ensure the redirect URI is passed if the env var isn't picked up automatically
  redirectUri: process.env.WORKOS_REDIRECT_URI,
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
