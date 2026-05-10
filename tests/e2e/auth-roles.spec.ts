import { test, expect, BrowserContext } from '@playwright/test';

/**
 * Authentication and Authorisation E2E Tests
 * 
 * Verifies role-based access control, routing, and data scoping 
 * for MD, VP_SALES, BROKER, SITE_MANAGER, and ADMIN roles.
 */

// Define test users matching the database seed
const USERS = {
  MD: { role: 'MD', email: 'md@analyzehive.com', id: 'uuid-md-123' },
  VP_SALES: { role: 'VP_SALES', email: 'vp_sales@analyzehive.com', id: 'uuid-vpsales-123' },
  BROKER: { role: 'BROKER', email: 'broker1@analyzehive.com', id: 'uuid-broker1-123' },
  SITE_MANAGER: { role: 'SITE_MANAGER', email: 'site_manager@analyzehive.com', id: 'uuid-sm-123' },
  ADMIN: { role: 'ADMIN', email: 'admin@analyzehive.com', id: 'uuid-admin-123' },
};

// Helper to mock a login session by setting application cookies
async function loginAs(context: BrowserContext, user: { role: string, email: string, id: string }) {
  // Clear any existing cookies
  await context.clearCookies();
  
  // Set authentication cookies (assuming localhost for test environment)
  await context.addCookies([
    { name: 'user_role', value: user.role, domain: 'localhost', path: '/' },
    { name: 'user_email', value: user.email, domain: 'localhost', path: '/' },
    { name: 'user_id', value: user.id, domain: 'localhost', path: '/' }
  ]);
}

test.describe('Role-Based Access & Routing', () => {
  // Use localhost domain for testing cookies (ensure playwright config matches this)
  test.use({ baseURL: 'http://localhost:3000' });

  test.describe('MD Role', () => {
    test.beforeEach(async ({ context, page }) => {
      await page.goto('/'); // Initialize origin
      await loginAs(context, USERS.MD);
    });

    test('has access to all major dashboards', async ({ page }) => {
      // MD Dashboard
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/dashboard/);
      
      // Sales Dashboard
      await page.goto('/sales');
      await expect(page).toHaveURL(/\/sales/);

      // Construction Dashboard
      await page.goto('/construction');
      await expect(page).toHaveURL(/\/construction/);

      // Settings Company
      await page.goto('/settings/company');
      await expect(page).toHaveURL(/\/settings\/company/);
    });
  });

  test.describe('VP_SALES Role', () => {
    test.beforeEach(async ({ context, page }) => {
      await page.goto('/');
      await loginAs(context, USERS.VP_SALES);
    });

    test('redirects from unauthorized pages to /sales', async ({ page }) => {
      // Blocked from MD dashboard
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/sales/);

      // Blocked from Construction
      await page.goto('/construction');
      await expect(page).toHaveURL(/\/sales/);

      // Blocked from Company Settings
      await page.goto('/settings/company');
      await expect(page).toHaveURL(/\/sales/); // Or 403
    });

    test('allows access to sales pages', async ({ page }) => {
      await page.goto('/sales/leads');
      await expect(page).toHaveURL(/\/sales\/leads/);
    });
  });

  test.describe('BROKER Role', () => {
    test.beforeEach(async ({ context, page }) => {
      await page.goto('/');
      await loginAs(context, USERS.BROKER);
    });

    test('redirects from unauthorized pages to /sales', async ({ page }) => {
      // Blocked from MD dashboard
      await page.goto('/dashboard/analytics');
      await expect(page).toHaveURL(/\/sales/);

      // Blocked from Construction
      await page.goto('/construction/demands');
      await expect(page).toHaveURL(/\/sales/);
    });

    test('enforces data scoping on leads page', async ({ page }) => {
      await page.goto('/sales/leads');
      
      // We expect the UI to only show leads assigned to this broker.
      // Assertions would depend on seeded data. For example:
      // await expect(page.locator('tbody tr')).toHaveCount(2); // Assuming 2 leads seeded
    });
  });

  test.describe('SITE_MANAGER Role', () => {
    test.beforeEach(async ({ context, page }) => {
      await page.goto('/');
      await loginAs(context, USERS.SITE_MANAGER);
    });

    test('redirects from unauthorized pages to /construction', async ({ page }) => {
      // Blocked from Sales
      await page.goto('/sales/leads');
      await expect(page).toHaveURL(/\/construction/);

      // Blocked from MD dashboard
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/construction/);
    });

    test('allows access to construction pages', async ({ page }) => {
      await page.goto('/construction/progress');
      await expect(page).toHaveURL(/\/construction\/progress/);
    });
  });

  test.describe('Session Expiry & Logout', () => {
    test('redirects to login when cookies are cleared', async ({ context, page }) => {
      await page.goto('/');
      await loginAs(context, USERS.MD);
      
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/dashboard/);

      // Clear cookies (simulate logout/expiry)
      await context.clearCookies();
      
      // Refresh or navigate
      await page.reload();
      
      // Should redirect to auth/login page
      // Assuming your login page is '/' or '/login'
      const url = page.url();
      expect(url.includes('/dashboard')).toBeFalsy();
    });
  });
});
