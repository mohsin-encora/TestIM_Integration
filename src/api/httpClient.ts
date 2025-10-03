import { APIRequestContext, request, expect } from '@playwright/test';

export interface HttpClientOptions {
  baseURL: string;
  headers?: Record<string, string>;
}

export class HttpClient {
  private context!: APIRequestContext;
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: HttpClientOptions) {
    this.baseURL = options.baseURL.replace(/\/$/, '');
    this.defaultHeaders = options.headers ?? {};
  }

  async init(): Promise<void> {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: this.defaultHeaders,
      ignoreHTTPSErrors: true,
    });
  }

  async dispose(): Promise<void> {
    if (this.context) await this.context.dispose();
  }

  async get(path: string, headers?: Record<string, string>) {
    const res = await this.context.get(path, { headers });
    return res;
  }
  async post(path: string, data?: any, headers?: Record<string, string>) {
    const res = await this.context.post(path, { data, headers });
    return res;
  }
  async put(path: string, data?: any, headers?: Record<string, string>) {
    const res = await this.context.put(path, { data, headers });
    return res;
  }
  async patch(path: string, data?: any, headers?: Record<string, string>) {
    const res = await this.context.patch(path, { data, headers });
    return res;
  }
  async delete(path: string, headers?: Record<string, string>) {
    const res = await this.context.delete(path, { headers });
    return res;
  }

  async expectJson(res: Awaited<ReturnType<HttpClient['get']>>, status = 200) {
    await expect(res).toBeOK();
    expect(res.status()).toBe(status);
    const body = await res.json();
    return body as unknown;
  }
}
