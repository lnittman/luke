import { ServerApiProvider } from './server-api-provider';
import { LLMProvider } from '../types';

/**
 * Create an LLM provider that uses the server-side API
 */
export function createServerApiProvider(): LLMProvider {
  return new ServerApiProvider();
}

export * from './server-api-provider'; 