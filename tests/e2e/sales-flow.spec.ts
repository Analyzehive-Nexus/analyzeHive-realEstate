import { test, expect } from '@playwright/test';

/**
 * End-to-End Sales Flow Test
 * 
 * This script automates the complete sales cycle:
 * 1. Adding a lead
 * 2. Scheduling a site visit
 * 3. Uploading a document
 * 4. Booking a flat (partial payment)
 * 5. Recording full payment
 * 6. Converting the lead
 */

test.describe('Sales End-to-End Flow', () => {
  // Use a unique name to avoid conflicts if DB is not cleared
  const uniqueId = Date.now().toString().slice(-4);
  const leadName = `E2E Test Lead ${uniqueId}`;
  const leadPhone = `+9198765${uniqueId}`;
  const leadEmail = `e2e_${uniqueId}@test.com`;

  test.beforeEach(async ({ page }) => {
    // Navigate to the app (assuming user is already authenticated via storage state)
    // Or add custom login steps here if needed
    await page.goto('/sales');
  });

  test('Complete Sales Flow: Lead to Conversion', async ({ page }) => {
    
    // ---------------------------------------------------------
    // Step 1: Add a New Lead
    // ---------------------------------------------------------
    await test.step('Add a New Lead', async () => {
      await page.goto('/sales/leads');
      
      // Click Add Lead button 
      await page.getByRole('button', { name: 'Add Lead' }).click();
      
      // Fill in lead details
      await page.getByLabel(/Full Name/i).fill(leadName);
      await page.getByLabel(/Phone Number/i).fill(leadPhone);
      await page.getByLabel(/Email Address/i).fill(leadEmail);
      
      // Select source
      await page.getByRole('combobox').filter({ hasText: 'Select a source' }).click();
      await page.getByRole('option', { name: 'Direct' }).click();
      
      // Add Notes
      await page.getByLabel(/Notes & Requirements/i).fill('Test lead for end-to-end flow');
      
      // Submit
      await page.getByRole('button', { name: /Add Lead & Send Brochure/i }).click();
      
      // Verify success toast
      await expect(page.getByText(/Lead added successfully/i)).toBeVisible();
      
      // Verify lead is in the table
      await expect(page.getByRole('cell', { name: leadName }).first()).toBeVisible();
    });

    // ---------------------------------------------------------
    // Step 2: Schedule a Site Visit
    // ---------------------------------------------------------
    await test.step('Schedule a Site Visit', async () => {
      // Depending on UI implementation, trigger schedule visit
      // Example: Click on row actions -> Schedule Visit
      const leadRow = page.locator('tr', { hasText: leadName }).first();
      await leadRow.getByRole('button', { name: /Actions/i }).click();
      await page.getByRole('menuitem', { name: 'Schedule Visit' }).click();

      // Pick a date (tomorrow)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];
      
      await page.getByLabel(/Visit Date/i).fill(dateString);
      await page.getByLabel(/Visit Time/i).fill('11:00');
      await page.getByLabel(/Notes/i).fill('First site tour');

      await page.getByRole('button', { name: /Schedule Visit/i }).click();
      
      // Verify success toast
      await expect(page.getByText(/Site visit scheduled/i)).toBeVisible();
      
      // Verify lead status updated in table
      await expect(leadRow).toContainText('Site Visit Scheduled');
    });

    // ---------------------------------------------------------
    // Step 3: Upload a Document
    // ---------------------------------------------------------
    await test.step('Upload a Document', async () => {
      await page.goto('/sales/documents');
      await page.getByRole('button', { name: /Verify Document/i }).click();
      
      await page.getByLabel(/Select Lead/i).click();
      await page.getByRole('option', { name: leadName }).click();
      
      await page.getByRole('combobox', { name: /Document Type/i }).click();
      await page.getByRole('option', { name: 'Aadhaar Card' }).click();
      
      await page.getByRole('button', { name: 'Upload & Verify' }).click();
      await expect(page.getByText(/Document uploaded/i)).toBeVisible();
    });

    // ---------------------------------------------------------
    // Step 4: Book the Flat (Partially)
    // ---------------------------------------------------------
    await test.step('Book the Flat', async () => {
      await page.goto('/sales/properties');
      
      // Find an available flat
      const flatCard = page.locator('.property-card', { hasText: 'Available' }).first(); 
      await flatCard.getByRole('button', { name: 'Book' }).click();
      
      // Assign to lead
      await page.getByLabel(/Assign to Lead/i).click();
      await page.getByRole('option', { name: leadName }).click();
      
      await page.getByLabel(/Amount/i).fill('100000');
      
      // Payment Date
      const today = new Date().toISOString().split('T')[0];
      await page.getByLabel(/Payment Date/i).fill(today);
      
      await page.getByRole('button', { name: 'Confirm Booking' }).click();
      await expect(page.getByText(/Booking confirmed/i)).toBeVisible();
    });

    // ---------------------------------------------------------
    // Step 5: Record an Additional Payment
    // ---------------------------------------------------------
    await test.step('Record Additional Payment', async () => {
      // Find the flat that was just booked (now 'On Hold' or similar)
      const bookedFlat = page.locator('.property-card', { hasText: leadName }).first();
      await bookedFlat.getByRole('button', { name: 'Pay' }).click();
      
      await page.getByRole('combobox', { name: /Payment Type/i }).click();
      await page.getByRole('option', { name: 'Full Payment' }).click();
      
      await page.getByLabel(/Amount/i).fill('7900000'); 
      
      await page.getByRole('button', { name: 'Confirm Payment' }).click();
      await expect(page.getByText(/Payment recorded/i)).toBeVisible();
    });

    // ---------------------------------------------------------
    // Step 6: Mark Lead as Converted
    // ---------------------------------------------------------
    await test.step('Mark Lead as Converted', async () => {
      await page.goto('/sales/leads');
      const leadRow = page.locator('tr', { hasText: leadName }).first();
      
      // Update status if it's not automatically updated
      const statusText = await leadRow.innerText();
      if (!statusText.includes('Converted')) {
        await leadRow.getByRole('button', { name: /Edit/i }).click();
        await page.getByRole('combobox', { name: /Status/i }).click();
        await page.getByRole('option', { name: 'Converted' }).click();
        await page.getByRole('button', { name: /Save/i }).click();
        
        await expect(page.getByText(/Lead updated/i)).toBeVisible();
      }
    });

    // ---------------------------------------------------------
    // Step 7: Verify Final Dashboard State
    // ---------------------------------------------------------
    await test.step('Verify Pipeline and Dashboards', async () => {
      // Check Pipeline
      await page.goto('/sales/pipeline');
      const convertedCol = page.locator('[data-status="Converted"]'); // Assumes data attributes
      await expect(convertedCol).toContainText(leadName);

      // Check Sales Dashboard
      await page.goto('/sales');
      // Additional assertions can be placed here to verify metrics.
      // e.g. await expect(page.locator('.kpi-converted')).toHaveText('...');
    });
  });
});
