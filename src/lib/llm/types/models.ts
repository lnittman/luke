/**
 * OpenRouter model interface
 */
export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt?: number;
    completion?: number;
  };
}

/**
 * LLM Provider interface
 */
export interface LLMProvider {
  generate: (prompt: string, options?: any) => Promise<string>;
  generateStructured: <T>(prompt: string, options?: any) => Promise<T>;
  getAvailableModels: () => Promise<string[]>;
} 