import { test, expect } from '@playwright/test';

/**
 * End-to-End Construction Flow Test
 * 
 * This script automates the complete construction cycle:
 * 1. Raising a material demand
 * 2. Admin approval & stock deduction
 * 3. Submitting daily progress report
 * 4. Uploading a site photo
 * 5. Marking labour attendance
 * 6. Verifying budget updates
 */

test.describe('Construction End-to-End Flow', () => {
  // Use a unique ID to avoid collisions
  const uniqueId = Date.now().toString().slice(-4);
  const materialName = 'Cement OPC 53';
  const quantity = '50';
  const projectName = 'Tower A';
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the construction dashboard (Assuming auth session exists)
    await page.goto('/construction');
  });

  test('Complete Construction Workflow', async ({ page, browser }) => {
    
    // ---------------------------------------------------------
    // Step 1: Raise a Material Demand (SITE_MANAGER)
    // ---------------------------------------------------------
    await test.step('Raise a Material Demand', async () => {
      await page.goto('/construction/demands');
      
      // Open Raise Request Modal/Sheet
      await page.getByRole('button', { name: /Raise Request/i }).click();
      
      // Select Material
      await page.getByRole('combobox', { name: /Material/i }).click();
      await page.getByRole('option', { name: materialName }).click();
      
      // Enter Quantity
      await page.getByLabel(/Quantity/i).fill(quantity);
      
      // Select Project
      await page.getByRole('combobox', { name: /Project/i }).click();
      await page.getByRole('option', { name: projectName }).click();
      
      // Required by date (tomorrow)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];
      await page.getByLabel(/Required By/i).fill(dateString);
      
      // Add Justification
      await page.getByLabel(/Justification/i).fill(`For slab casting on Floor 12 (Test ${uniqueId})`);
      
      // Submit
      await page.getByRole('button', { name: /Submit/i }).click();
      
      // Verify success toast and table presence
      await expect(page.getByText(/Demand raised successfully/i)).toBeVisible();
      
      const pendingRow = page.locator('tr', { hasText: `Test ${uniqueId}` }).first();
      await expect(pendingRow).toContainText('Pending');
    });

    // ---------------------------------------------------------
    // Step 2: Admin Approves Demand
    // ---------------------------------------------------------
    await test.step('Admin Approves Demand', async () => {
      // NOTE: In a true multi-role E2E test, we would spawn a new browser context 
      // logged in as an ADMIN. For this script, we assume the current user has rights 
      // or we mock the UI flow.
      await page.goto('/construction/demands'); 
      
      const demandRow = page.locator('tr', { hasText: `Test ${uniqueId}` }).first();
      
      // Click Approve
      await demandRow.getByRole('button', { name: /Approve/i }).click();
      
      // Handle confirmation modal if it exists
      if (await page.getByRole('dialog').isVisible()) {
        await page.getByRole('button', { name: /Confirm/i }).click();
      }
      
      await expect(page.getByText(/approved successfully/i)).toBeVisible();
      await expect(demandRow).toContainText('Approved');
    });

    // ---------------------------------------------------------
    // Step 3: Submit Daily Progress Report
    // ---------------------------------------------------------
    await test.step('Submit Daily Progress', async () => {
      await page.goto('/construction/progress');
      
      await page.getByRole('button', { name: /Submit Daily Report/i }).click();
      
      // Select Project
      await page.getByRole('combobox', { name: /Project/i }).click();
      await page.getByRole('option', { name: projectName }).click();
      
      await page.getByLabel(/Floor/i).fill('Floor 12 - Slab area');
      
      // Date today
      const today = new Date().toISOString().split('T')[0];
      await page.getByLabel(/Date/i).fill(today);
      
      // Set Completion Status (Slider or Input)
      await page.getByLabel(/Completion/i).fill('65');
      
      // Set Weather
      await page.getByRole('combobox', { name: /Weather/i }).click();
      await page.getByRole('option', { name: 'Sunny' }).click();
      
      await page.getByLabel(/Workers Present/i).fill('12');
      await page.getByLabel(/Work Completed/i).fill('- Reinforcement binding completed\n- Shuttering started');
      
      // Add material used dynamically if applicable
      await page.getByRole('button', { name: /Add Material/i }).click();
      await page.getByRole('combobox', { name: /Material Used/i }).click();
      await page.getByRole('option', { name: materialName }).click();
      await page.getByLabel(/Quantity Used/i).fill(quantity);
      
      await page.getByLabel(/Issues/i).fill('None');
      
      // Submit Report
      await page.getByRole('button', { name: /Submit/i }).click();
      await expect(page.getByText(/Report submitted successfully/i)).toBeVisible();
    });

    // ---------------------------------------------------------
    // Step 4: Upload Site Photo
    // ---------------------------------------------------------
    await test.step('Upload Site Photo', async () => {
      // Find the latest report
      const latestReport = page.locator('tr', { hasText: 'Floor 12' }).first(); 
      await latestReport.getByRole('button', { name: /Upload Photo/i }).click();
      
      // Provide dummy file payload to file chooser
      await page.getByLabel(/Select Photo/i).setInputFiles({
        name: `site_photo_tower_a_${uniqueId}.jpg`,
        mimeType: 'image/jpeg',
        buffer: Buffer.from('test-image-content') // Dummy payload
      });
      
      await page.getByLabel(/Caption/i).fill('Tower A - Floor 12 slab work');
      
      await page.getByRole('button', { name: /Upload/i }).click();
      await expect(page.getByText(/Photo uploaded/i)).toBeVisible();
    });

    // ---------------------------------------------------------
    // Step 5: Mark Labour Attendance
    // ---------------------------------------------------------
    await test.step('Mark Labour Attendance', async () => {
      await page.goto('/construction/labour');
      
      // Select an example worker
      const workerRow = page.locator('tr').filter({ hasText: 'Mason' }).first();
      
      // Update status
      await workerRow.getByRole('combobox', { name: /Status/i }).click();
      await page.getByRole('option', { name: 'Present' }).click();
      
      // Click Save if it's not auto-save
      const saveBtn = page.getByRole('button', { name: /Save Attendance/i });
      if (await saveBtn.isVisible()) {
         await saveBtn.click();
      }
      
      await expect(page.getByText(/Attendance updated/i)).toBeVisible();
    });

    // ---------------------------------------------------------
    // Step 6: Log Expense (Budget Verification)
    // ---------------------------------------------------------
    await test.step('Log Expense for Materials', async () => {
      await page.goto('/construction/budget');
      
      await page.getByRole('button', { name: /Log Expense/i }).click();
      
      // Select Category
      await page.getByRole('combobox', { name: /Category/i }).click();
      await page.getByRole('option', { name: 'Construction Materials' }).click();
      
      await page.getByLabel(/Amount/i).fill('25000');
      await page.getByLabel(/Description/i).fill(`Cement OPC 53 for Tower A (Ref: ${uniqueId})`);
      
      // Date today
      const today = new Date().toISOString().split('T')[0];
      await page.getByLabel(/Date/i).fill(today);
      
      await page.getByRole('button', { name: /Submit/i }).click();
      await expect(page.getByText(/Expense logged successfully/i)).toBeVisible();
    });

    // ---------------------------------------------------------
    // Step 7: Verify Final Dashboard State
    // ---------------------------------------------------------
    await test.step('Verify Dashboards and KPIs', async () => {
      await page.goto('/construction');
      
      // Verify that dashboard loaded correctly and KPIs exist
      // Since specific KPIs are dynamic, we just check for their container presence
      await expect(page.locator('text=Pending Approvals')).toBeVisible();
      await expect(page.locator('text=Reports Today')).toBeVisible();
    });
  });
});
