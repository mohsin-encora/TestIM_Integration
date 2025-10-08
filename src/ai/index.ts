import { AIProvider } from './types';
import { createOpenAIProvider } from './openai';

export function createAIProvider(): AIProvider | null {
  const enabled = String(process.env.AI_ENABLED || '').toLowerCase() === 'true';
  if (!enabled) return null;
  // Only OpenAI for now, extend here for other vendors.
  return createOpenAIProvider();
}

export * from './types';
