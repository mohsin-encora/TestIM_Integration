import type { FullConfig, Suite, TestCase, TestError, TestResult } from '@playwright/test/reporter';
import { createAIProvider } from '../ai';

class AIReporter {
  private enabled: boolean;
  constructor(options: { enabled?: string } = {}) {
    this.enabled = String(options.enabled ?? process.env.AI_ENABLED ?? 'false').toLowerCase() === 'true';
  }

  onBegin(config: FullConfig, suite: Suite) {
    if (this.enabled) {
      console.log(`[AIReporter] Enabled for ${suite.allTests().length} tests.`);
    }
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    if (!this.enabled) return;
    if (result.status !== 'failed') return;

    const provider = createAIProvider();
    if (!provider) return;

    const error: TestError | undefined = result.errors?.[0] ?? (result.error as any);
    const attachments = result.attachments?.map(a => ({ name: a.name, contentType: a.contentType, path: a.path || undefined }));

    const analysis = await provider.analyzeFailure({
      testTitle: test.titlePath().join(' > '),
      projectName: test.parent?.project()?.name,
      errorMessage: error?.message,
      stack: error?.stack,
      attachments,
    });

    console.log(`\n[AI Failure Analysis] ${test.title}`);
    console.log(`Summary: ${analysis.summary}`);
    console.log(`Likely cause: ${analysis.likelyCause}`);
    if (analysis.nextActions?.length) {
      console.log('Next actions:');
      for (const step of analysis.nextActions) console.log(` - ${step}`);
    }
    console.log(`Suspected flake: ${analysis.suspectedFlake}`);
  }
}

export default AIReporter;
