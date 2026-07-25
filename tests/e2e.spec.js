import { test, expect } from '@playwright/test';

test.describe('Velmurugan Store E2E Tests', () => {

  test('Customer Flow: Navigate, add to cart, and checkout', async ({ page }) => {
    // 1. Visit Home
    await page.goto('http://localhost:5173/');
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    
    // Verify home page loaded
    await expect(page.locator('body')).not.toContainText('Something went wrong');
    
    // 2. Add product to cart
    const addButtons = page.locator('button:has-text("Add")');
    if (await addButtons.count() > 0) {
      await addButtons.first().click();
    }
    
    // 3. Go to Cart
    await page.goto('http://localhost:5173/cart');
    await page.waitForLoadState('networkidle');
    
    // 4. Click Checkout
    const checkoutButton = page.locator('button:has-text("Checkout")');
    if (await checkoutButton.count() > 0) {
      await checkoutButton.click();
    }
    
    // 5. If login is prompted, login as customer
    const loginInput = page.locator('input[type="email"]');
    if (await loginInput.isVisible()) {
      await loginInput.fill('guna123@gmail.com');
      await page.locator('input[type="password"]').fill('guna123');
      await page.locator('button:has-text("Login")').click();
      await page.waitForLoadState('networkidle');
    }
    
    // 6. Verify checkout page loads (might be redirected to profile or checkout based on app logic)
    await expect(page.locator('body')).not.toContainText('Something went wrong');
  });

  test('Admin Flow: Login and Dashboard', async ({ page }) => {
    // 1. Visit Login
    await page.goto('http://localhost:5173/login');
    
    // 2. Login as Admin
    await page.locator('input[type="email"]').fill('guna123@gmail.com');
    await page.locator('input[type="password"]').fill('guna123');
    await page.locator('button:has-text("Login")').click();
    
    await page.waitForLoadState('networkidle');
    
    // 3. Navigate to Admin
    await page.goto('http://localhost:5173/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Verify Dashboard loads without error
    await expect(page.locator('body')).not.toContainText('Access Denied');
    await expect(page.locator('body')).not.toContainText('Something went wrong');
    
    // 4. Check Sidebar Tabs
    const tabs = ['Dashboard', 'Products', 'Categories', 'Orders', 'Customers'];
    for (const tab of tabs) {
      await page.locator(`button:has-text("${tab}")`).click();
      // wait a bit for rendering
      await page.waitForTimeout(500);
      await expect(page.locator('body')).not.toContainText('Something went wrong');
    }
  });

});
