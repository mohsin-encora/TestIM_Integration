import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/homePage';

test.describe('Playwright site smoke', () => {
  test('navigate to docs', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.clickGetStarted();
    await home.expectOnDocs();
  });
});
