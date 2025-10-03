import { test, expect } from '@playwright/test';
import { HttpClient } from '../../src/api/httpClient';

test.describe('Public API smoke', () => {
  test('GET /repos/:owner/:repo', async () => {
    const client = new HttpClient({ baseURL: 'https://api.github.com', headers: { 'User-Agent': 'qa-framework' } });
    await client.init();
    const res = await client.get('/repos/microsoft/playwright');
    await expect(res).toBeOK();
    const json = await res.json();
    expect(json).toHaveProperty('name', 'playwright');
    await client.dispose();
  });
});
