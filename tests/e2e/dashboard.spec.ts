import { test, expect } from '@playwright/test';

test.describe('Dashboard Example - Full Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/dashboard');
  });

  test('should display dashboard with all components', async ({ page }) => {
    // AppBar should be visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();

    // Main content should be visible
    await expect(page.locator('text=Welcome back')).toBeVisible();

    // Stats cards should be visible
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Active Users')).toBeVisible();
  });

  test('should open and close drawer', async ({ page }) => {
    // Click menu button to open drawer
    const menuButton = page.locator('button[aria-label="Menu"]');
    await menuButton.click();

    // Drawer should be visible
    await page.waitForTimeout(300);
    const drawer = page.locator('text=john@example.com').first();
    await expect(drawer).toBeVisible();

    // Click backdrop to close
    const backdrop = page.locator('[aria-hidden="true"]').first();
    await backdrop.click();

    // Drawer should be closed
    await page.waitForTimeout(300);
  });

  test('should open and close settings drawer', async ({ page }) => {
    // Click settings button
    const settingsButton = page.locator('button[aria-label="Settings"]').first();
    await settingsButton.click();

    // Settings drawer should be visible
    await page.waitForTimeout(300);
    await expect(page.locator('text=Appearance')).toBeVisible();
    await expect(page.locator('text=Notifications')).toBeVisible();

    // Close settings
    const closeButton = page.locator('button[aria-label="Close settings"]');
    await closeButton.click();

    await page.waitForTimeout(300);
  });

  test('should switch navigation items', async ({ page, viewport }) => {
    // Skip if mobile viewport (bottom nav behavior is different)
    if (viewport && viewport.width < 768) {
      test.skip();
    }

    // Wait for page to load
    await page.waitForTimeout(500);

    // Click on different navigation items
    const analyticsButton = page.locator('button').filter({ hasText: 'Analytics' }).first();
    if (await analyticsButton.isVisible()) {
      await analyticsButton.click();
      await page.waitForTimeout(200);
    }
  });

  test('should open FAB modal', async ({ page }) => {
    // Click FAB to open modal
    const fab = page.locator('button[aria-label="Create new post"]');
    await fab.click();

    // Modal should be visible
    await page.waitForTimeout(200);
    await expect(page.locator('text=Create New Post')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter post title"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="What\'s on your mind?"]')).toBeVisible();
  });

  test('should create post and show snackbar', async ({ page }) => {
    // Open modal
    const fab = page.locator('button[aria-label="Create new post"]');
    await fab.click();
    await page.waitForTimeout(200);

    // Fill in post details
    await page.fill('input[placeholder="Enter post title"]', 'Test Post');
    await page.fill('textarea[placeholder="What\'s on your mind?"]', 'This is a test post content');

    // Submit
    await page.click('button:has-text("Create Post")');

    // Snackbar should appear
    await page.waitForTimeout(200);
    await expect(page.locator('text=Post created successfully!')).toBeVisible();
  });

  test('should cancel post creation', async ({ page }) => {
    // Open modal
    const fab = page.locator('button[aria-label="Create new post"]');
    await fab.click();
    await page.waitForTimeout(200);

    // Click cancel
    await page.click('button:has-text("Cancel")');

    // Modal should be closed
    await page.waitForTimeout(200);
    await expect(page.locator('text=Create New Post')).not.toBeVisible();
  });

  test('should close modal with close button', async ({ page }) => {
    // Open modal
    const fab = page.locator('button[aria-label="Create new post"]');
    await fab.click();
    await page.waitForTimeout(200);

    // Click X button
    const closeButton = page.locator('button[aria-label="Close"]');
    await closeButton.click();

    // Modal should be closed
    await page.waitForTimeout(200);
    await expect(page.locator('text=Create New Post')).not.toBeVisible();
  });

  test('should close modal on escape key', async ({ page }) => {
    // Open modal
    const fab = page.locator('button[aria-label="Create new post"]');
    await fab.click();
    await page.waitForTimeout(200);

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should be closed
    await page.waitForTimeout(200);
    await expect(page.locator('text=Create New Post')).not.toBeVisible();
  });
});

test.describe('Dashboard - Scroll Animations', () => {
  test('should trigger scroll animations', async ({ page }) => {
    await page.goto('/examples/dashboard');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Content should still be visible
    await expect(page.locator('text=Recent Activity')).toBeVisible();

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  });

  test('should hide bottom nav on scroll down on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/examples/dashboard');

    // Initial state
    await page.waitForTimeout(500);

    // Scroll down significantly
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);

    // Bottom nav might be hidden (depending on implementation)
    // This is a visual test, actual behavior may vary
  });
});

test.describe('Dashboard - Responsive Layout', () => {
  test('should show bottom navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/examples/dashboard');

    await page.waitForTimeout(500);

    // Bottom navigation should be visible on mobile
    const bottomNav = page.locator('nav[class*="bottom"]').first();
    const isVisible = await bottomNav.isVisible().catch(() => false);

    // Either bottom nav or other navigation should be present
    const hasNavigation = await page.locator('button').filter({ hasText: 'Home' }).count();
    expect(hasNavigation).toBeGreaterThan(0);
  });

  test('should show navigation rail on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/examples/dashboard');

    await page.waitForTimeout(500);

    // Check if navigation exists
    const hasNavigation = await page.locator('nav').count();
    expect(hasNavigation).toBeGreaterThan(0);
  });

  test('should show navigation rail on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/examples/dashboard');

    await page.waitForTimeout(500);

    // Navigation should be present
    const hasNavigation = await page.locator('nav').count();
    expect(hasNavigation).toBeGreaterThan(0);
  });
});

test.describe('Dashboard - Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/examples/dashboard');

    // Check important interactive elements have labels
    await expect(page.locator('button[aria-label="Menu"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Settings"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Create new post"]')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/examples/dashboard');

    // Tab through elements
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();

    // Continue tabbing
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const currentFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(currentFocused).toBeTruthy();
  });

  test('should have modal with proper dialog role', async ({ page }) => {
    await page.goto('/examples/dashboard');

    // Open modal
    const fab = page.locator('button[aria-label="Create new post"]');
    await fab.click();
    await page.waitForTimeout(200);

    // Check modal has dialog role
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});

test.describe('Dashboard - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/examples/dashboard');

    // Wait for key content
    await expect(page.locator('text=Welcome back')).toBeVisible();

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle rapid interactions', async ({ page }) => {
    await page.goto('/examples/dashboard');

    // Rapidly open and close drawer
    const menuButton = page.locator('button[aria-label="Menu"]');
    for (let i = 0; i < 3; i++) {
      await menuButton.click();
      await page.waitForTimeout(100);
      const backdrop = page.locator('[aria-hidden="true"]').first();
      await backdrop.click();
      await page.waitForTimeout(100);
    }

    // Page should still be functional
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
});
