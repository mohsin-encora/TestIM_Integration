export interface AIFailureContext {
  testTitle: string;
  projectName?: string;
  errorMessage?: string;
  stack?: string;
  stdout?: string;
  stderr?: string;
  attachments?: Array<{ name: string; contentType?: string; path?: string }>;
}

export interface AIFailureAnalysis {
  summary: string;
  likelyCause: string;
  nextActions: string[];
  suspectedFlake: boolean;
}

export interface AIProvider {
  analyzeFailure(ctx: AIFailureContext): Promise<AIFailureAnalysis>;
}
