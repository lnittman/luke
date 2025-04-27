/**
 * API Key Management Utilities
 * 
 * This module provides functions for retrieving and validating API keys
 * from the environment configuration.
 */

/**
 * Get the OpenRouter API key, ensuring proper formatting
 * 
 * @returns The properly formatted OpenRouter API key or null if not available
 */
export function getOpenRouterKey(): string | null {
  let key = process.env.OPENROUTER_API_KEY || '';
  
  // Remove any quotes from the key
  key = key.replace(/["']/g, '');
  
  // Trim whitespace
  key = key.trim();
  
  // Validate the key format
  if (!key || !key.startsWith('sk-or-v1-')) {
    console.error('[API Keys] Invalid OpenRouter API key format');
    return null;
  }
  
  return key;
}

/**
 * Get headers for OpenRouter API requests
 * 
 * @returns Object containing the necessary headers for OpenRouter API calls
 */
export function getOpenRouterHeaders(): Record<string, string> {
  const key = getOpenRouterKey();
  
  if (!key) {
    throw new Error('OpenRouter API key not available or invalid');
  }
  
  return {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://luke-portfolio.vercel.app',
    'X-Title': 'Luke App Test',
  };
} 