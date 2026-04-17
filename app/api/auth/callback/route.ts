import { handleAuth } from '@workos-inc/authkit-nextjs';

// Redirect to the dashboard after successful sign-in.
export const GET = handleAuth({ returnPathname: '/dashboard' });
