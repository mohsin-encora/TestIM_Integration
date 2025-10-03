import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env.CI;

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? '50%' : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['./src/reporters/ai-reporter.ts', { enabled: process.env.AI_REPORTER_ENABLED ?? 'false' }]
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.UI_BASE_URL || 'https://playwright.dev',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'Chromium Desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox Desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit Desktop',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile-Chromium',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile-WebKit',
      use: { ...devices['iPhone 13 Pro'] },
    },
  ],
  outputDir: 'test-results',
});
