import { test as base, type APIRequestContext } from '@playwright/test';
import { HttpClient } from '../api/httpClient';

export type TestFixtures = {
  api: HttpClient;
};

export const test = base.extend<TestFixtures>({
  api: async ({ playwright }, use) => {
    const client = new HttpClient({
      baseURL: process.env.API_BASE_URL || 'https://api.github.com',
      headers: { 'User-Agent': 'qa-framework' },
    });
    await client.init();
    await use(client);
    await client.dispose();
  },
});

export const expect = test.expect;
