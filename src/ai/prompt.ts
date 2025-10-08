import { AIFailureContext } from './types';

export function buildFailurePrompt(ctx: AIFailureContext): string {
  const parts: string[] = [];
  parts.push('You are a senior QA/SDET assistant.');
  parts.push('Analyze the following Playwright test failure and respond in JSON with keys:');
  parts.push("summary, likely_cause, next_actions (array of short steps), suspected_flake (boolean)");
  parts.push('Consider network errors, timing, selectors, test data, and environment flakiness.');
  parts.push('Provide actionable, concise steps for remediation.');
  parts.push('--- CONTEXT START ---');
  parts.push(`Project: ${ctx.projectName ?? 'unknown'}`);
  parts.push(`Test: ${ctx.testTitle}`);
  if (ctx.errorMessage) parts.push(`Error: ${ctx.errorMessage}`);
  if (ctx.stack) parts.push(`Stack:\n${ctx.stack}`);
  if (ctx.stderr) parts.push(`Stderr (tail):\n${ctx.stderr.slice(-4000)}`);
  if (ctx.stdout) parts.push(`Stdout (tail):\n${ctx.stdout.slice(-4000)}`);
  if (ctx.attachments?.length) {
    const attachList = ctx.attachments
      .slice(0, 10)
      .map((a) => `${a.name} (${a.contentType ?? 'unknown'}) ${a.path ?? ''}`)
      .join('\n');
    parts.push(`Attachments:\n${attachList}`);
  }
  parts.push('--- CONTEXT END ---');
  parts.push('Return only valid JSON with the requested keys.');
  return parts.join('\n');
}
