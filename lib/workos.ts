// lib/workos.ts contains helpers and configurations for the WorkOS session.
// In actual usage, rely on authkit-nextjs functions.
export const getWorkOSClientId = () => {
    return process.env.WORKOS_CLIENT_ID || "";
};
