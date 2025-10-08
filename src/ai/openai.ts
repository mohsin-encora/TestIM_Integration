import { AIProvider, AIFailureAnalysis, AIFailureContext } from './types';
import { buildFailurePrompt } from './prompt';

async function callOpenAI(prompt: string): Promise<AIFailureAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    return {
      summary: 'AI disabled (missing OPENAI_API_KEY).',
      likelyCause: 'N/A',
      nextActions: [
        'Set AI_ENABLED=true and provide OPENAI_API_KEY to enable analysis.',
      ],
      suspectedFlake: false,
    };
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are a precise, pragmatic QA assistant.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      summary: `AI request failed: ${response.status} ${text}`,
      likelyCause: 'AI service error or misconfiguration',
      nextActions: [
        'Verify OPENAI_API_KEY and OPENAI_MODEL',
        'Check network access to OpenAI API',
      ],
      suspectedFlake: false,
    };
  }

  const data = await response.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) {
    return {
      summary: 'AI returned no content',
      likelyCause: 'Empty response from provider',
      nextActions: ['Retry the analysis with more context'],
      suspectedFlake: false,
    };
  }

  try {
    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary ?? 'No summary provided',
      likelyCause: parsed.likely_cause ?? 'Unknown',
      nextActions: Array.isArray(parsed.next_actions) ? parsed.next_actions : [],
      suspectedFlake: Boolean(parsed.suspected_flake),
    } satisfies AIFailureAnalysis;
  } catch {
    return {
      summary: content,
      likelyCause: 'Unstructured AI output',
      nextActions: ['Improve prompt or enable JSON-mode.'],
      suspectedFlake: false,
    };
  }
}

export function createOpenAIProvider(): AIProvider {
  return {
    async analyzeFailure(ctx: AIFailureContext): Promise<AIFailureAnalysis> {
      const prompt = buildFailurePrompt(ctx);
      return await callOpenAI(prompt);
    },
  };
}
