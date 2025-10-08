import { BasePage } from './basePage';
import { expect } from '@playwright/test';

export class HomePage extends BasePage {
  async open() {
    await this.goto('/');
  }

  async clickGetStarted() {
    await this.page.getByRole('link', { name: /get started/i }).first().click();
  }

  async expectOnDocs() {
    await expect(this.page).toHaveURL(/docs/);
  }
}
