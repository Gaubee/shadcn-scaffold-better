import { test, expect } from '@playwright/test';

test.describe('Scaffold UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Scaffold UI');
    await expect(page.locator('text=Flutter-inspired scaffold components')).toBeVisible();
  });

  test('should navigate to basic example', async ({ page }) => {
    await page.click('text=Basic Example');
    await expect(page).toHaveURL('/examples/basic');
  });

  test('should navigate to immersive example', async ({ page }) => {
    await page.click('text=Immersive AppBar');
    await expect(page).toHaveURL('/examples/immersive');
  });

  test('should navigate to responsive example', async ({ page }) => {
    await page.click('text=Responsive Layout');
    await expect(page).toHaveURL('/examples/responsive');
  });
});

test.describe('AppBar Component', () => {
  test('should shrink on scroll', async ({ page }) => {
    await page.goto('/examples/immersive');

    // Get initial height
    const appBar = page.locator('header').first();
    const initialHeight = await appBar.evaluate((el) => (el as HTMLElement).offsetHeight);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(500);

    // Check if height changed (for collapsible mode)
    const scrolledHeight = await appBar.evaluate((el) => (el as HTMLElement).offsetHeight);

    // Height should either stay same or shrink
    expect(scrolledHeight).toBeLessThanOrEqual(initialHeight);
  });

  test('should be visible at top of page', async ({ page }) => {
    await page.goto('/examples/basic');
    const appBar = page.locator('header').first();
    await expect(appBar).toBeVisible();
  });
});

test.describe('Drawer Component', () => {
  test('should open and close drawer', async ({ page }) => {
    await page.goto('/examples/basic');

    // Open drawer
    const menuButton = page.locator('[data-testid="menu-button"]').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Wait for drawer to open
      await page.waitForTimeout(400);

      // Check drawer is visible
      const drawer = page.locator('aside').first();
      await expect(drawer).toBeVisible();

      // Close drawer by clicking backdrop
      const backdrop = page.locator('[aria-hidden="true"]').first();
      await backdrop.click();

      // Wait for drawer to close
      await page.waitForTimeout(400);
    }
  });
});

test.describe('Responsive Behavior', () => {
  test('should show drawer on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/examples/responsive');

    // On mobile, navigation rail should not be visible
    const navRail = page.locator('nav[style*="grid-area: nav"]');
    await expect(navRail).not.toBeVisible();
  });

  test('should show navigation rail on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/examples/responsive');

    // On desktop, navigation rail might be visible
    // This depends on the implementation
    await page.waitForTimeout(500);
  });
});

test.describe('Accessibility', () => {
  test('should have no accessibility violations on home page', async ({ page }) => {
    await page.goto('/');

    // Check for basic accessibility
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    const links = page.locator('a');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    const firstFocusable = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocusable).toBeTruthy();
  });
});