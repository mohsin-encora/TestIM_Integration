## Playwright + TypeScript Advanced Testing Framework (Web, Mobile-Web, API) with GenAI

A production-ready automation framework for functional UI (desktop + mobile web) and API testing, powered by Playwright and TypeScript. Includes:
- Multi-project config for Chromium, Firefox, WebKit, and mobile emulation
- API client utilities and custom fixtures
- Page Object Model structure (POM)
- GenAI failure analysis reporter (OpenAI) for fast root-cause hints
- CI workflow (GitHub Actions), linting (ESLint) and formatting (Prettier)

### Prerequisites
- Node.js 20+
- Linux/macOS/Windows (browsers installed via Playwright)
- Optional: OpenAI API key for AI analysis

### Quick Start
```bash
# install deps
npm ci || npm install

# install at least Chromium browser (works on most environments)
npx playwright install chromium
# or install all browsers (if your OS supports system deps)
# npx playwright install --with-deps chromium firefox webkit

# run tests
npx playwright test

# open last report
npx playwright show-report
```

### Project Structure
```text
src/
  ai/                 # GenAI provider + prompt + types
  api/                # API HTTP client wrapper
  fixtures/           # Custom test fixtures
  pages/              # Page Objects (POM)
  reporters/          # Custom reporters (AI failure reporter)
  utils/              # Utilities (placeholder)

tests/
  api/                # API tests
  e2e/                # UI tests

playwright.config.ts  # Multi-project config
.eslintrc.json        # ESLint config
.prettierrc           # Prettier config
.env.example          # Environment variables template
```

### Configuration
- `playwright.config.ts`
  - Projects: Desktop Chrome, Desktop Firefox, Desktop Safari, Pixel 5, iPhone 13 Pro
  - Common `use`: `trace`, `screenshot`, `video`, `baseURL`, timeouts
  - Reporters: list, html, json, and AI reporter (opt-in)
- Environment variables (copy `.env.example` to `.env`):
  - `UI_BASE_URL`: target web app URL (default `https://playwright.dev`)
  - `API_BASE_URL`: API base URL (default `https://api.github.com`)
  - `AI_ENABLED`: set `true` to enable AI analysis
  - `OPENAI_API_KEY`: your OpenAI API key
  - `OPENAI_MODEL`: default `gpt-4o-mini` (override as needed)
  - `OPENAI_BASE_URL`: override base URL if using a proxy/gateway

### GenAI Failure Analysis
When `AI_ENABLED=true`, a custom reporter (`src/reporters/ai-reporter.ts`) sends failure context to the AI provider to produce:
- Summary of failure
- Likely cause
- Next actions (actionable steps)
- Suspected flakiness

How to enable:
```bash
# .env
AI_ENABLED=true
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# run tests
npx playwright test
```
Notes:
- If no API key is set, the reporter prints a clear message and skips calling the API.
- You can add additional providers in `src/ai/index.ts`.

### Writing Tests
- UI example: `tests/e2e/sample.e2e.spec.ts`
```ts
import { test } from '@playwright/test';
import { HomePage } from '../../src/pages/homePage';

test('navigate to docs', async ({ page }) => {
  const home = new HomePage(page);
  await home.open();
  await home.clickGetStarted();
  await home.expectOnDocs();
});
```

- API example: `tests/api/sample.api.spec.ts`
```ts
import { test, expect } from '@playwright/test';
import { HttpClient } from '../../src/api/httpClient';

test('GET repo', async () => {
  const client = new HttpClient({ baseURL: 'https://api.github.com', headers: { 'User-Agent': 'qa-framework' } });
  await client.init();
  const res = await client.get('/repos/microsoft/playwright');
  await expect(res).toBeOK();
  const data = await res.json();
  expect(data).toHaveProperty('name', 'playwright');
  await client.dispose();
});
```

### Fixtures
Use `src/fixtures/test-fixtures.ts` to share utilities:
- Provides `api: HttpClient` preconfigured with `API_BASE_URL`
- Import as needed:
```ts
import { test, expect } from '../../src/fixtures/test-fixtures';

test('api via fixture', async ({ api }) => {
  const res = await api.get('/repos/microsoft/playwright');
  await expect(res).toBeOK();
});
```

### Page Objects
- Base class `src/pages/basePage.ts`
- Example `src/pages/homePage.ts`
- Pattern: methods encapsulate navigation, actions, and assertions.

### Useful Scripts
- `npm run lint`: lint the project
- `npm run format`: format all files
- `npm run build`: compile TypeScript
- `npm run test`: run all tests
- `npm run test:ci`: CI-friendly run with retries and reporters

### CI (GitHub Actions)
Workflow: `.github/workflows/ci.yml`
- Node 20
- Install dependencies
- Install Playwright browsers
- Run tests with environment variables

### Mobile-Web Testing
- Mobile emulation via Playwright device descriptors in `playwright.config.ts`
  - `Pixel 5` and `iPhone 13 Pro` projects are configured out of the box

### Desktop Testing
- Desktop Chrome, Firefox, WebKit projects enabled
- Headed mode: `npm run test:headed`

### API Testing
- `src/api/httpClient.ts` wraps `APIRequestContext`
- `expectJson` helper to validate status and parse JSON

### Troubleshooting
- Playwright dependencies on Linux: prefer `npx playwright install --with-deps` (Ubuntu-based). If packages are missing on your distro, install Chromium-only first: `npx playwright install chromium`.
- AI errors: ensure `OPENAI_API_KEY` is set and reachable; otherwise the reporter falls back to a safe message.
- Flaky tests: increase timeouts, enable `trace: 'on-first-retry'`, and inspect traces in the HTML report.

### Extending the Framework
- Add new API clients under `src/api/`
- Add new POMs under `src/pages/`
- Add custom reporters under `src/reporters/`
- Extend AI providers in `src/ai/`

### License
MIT (adjust as necessary).
