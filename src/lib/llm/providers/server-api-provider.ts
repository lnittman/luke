import { LLMProvider } from '../types';
import { getApiUrl } from '../helpers/api';
import { logInfo, logError } from '../../logger';

/**
 * Server API provider implementation
 */
export class ServerApiProvider implements LLMProvider {
  private defaultModel: string = 'anthropic/claude-3.7-sonnet';
  
  constructor() {
    // Constructor logic if needed
  }
  
  /**
   * Generate text using the server-side API
   */
  async generate(prompt: string, options: any = {}): Promise<string> {
    // Generate a unique ID for logging
    const logId = Math.random().toString(36).substring(2, 15);
    
    try {
      const selectedModel = options.model || this.defaultModel;
      
      logInfo(`Request to ${selectedModel}`, { tag: `LLM:${logId}` });
      logInfo(`Prompt: ${prompt.substring(0, 300)}...`, { tag: `LLM:${logId}` });
      
      // Check if we're running in a browser or server environment
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9000';
      
      logInfo(`Using base URL: ${baseUrl}`, { tag: `LLM:${logId}` });
      
      const response = await fetch(`${baseUrl}/api/llm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 4000,
          responseFormat: options.responseFormat,
        }),
      });
      
      if (!response.ok) {
        logError(`API error: ${response.status}`, { tag: `LLM:${logId}` });
        try {
          // Try to get more detailed error information
          const errorData = await response.text();
          logError(`Error details: ${errorData}`, { tag: `LLM:${logId}` });
          throw new Error(`API error: ${response.status} - ${errorData.substring(0, 200)}`);
        } catch (parseError) {
          throw new Error(`API error: ${response.status} - Could not parse error details`);
        }
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      // Log response details
      logInfo(`Response status: ${response.status}`, { tag: `LLM:${logId}` });
      logInfo(`Response length: ${content.length}`, { tag: `LLM:${logId}` });
      logInfo(`Response preview: ${content.substring(0, 300)}...`, { tag: `LLM:${logId}` });
      
      return content;
    } catch (error) {
      logError(`Error: ${error}`, { tag: `LLM:${logId}` });
      throw error;
    }
  }
  
  /**
   * Generate structured data using the server-side API
   */
  async generateStructured<T>(prompt: string, options: any = {}): Promise<T> {
    // Generate a unique ID for logging
    const logId = Math.random().toString(36).substring(2, 15);
    
    logInfo(`Structured Request to ${options.model || this.defaultModel}`, { tag: `LLM:${logId}` });
    logInfo(`Structured Prompt: ${prompt.substring(0, 300)}...`, { tag: `LLM:${logId}` });
    
    try {
      // Request JSON format
      const jsonOptions = {
        ...options,
        responseFormat: { type: "json_object" }
      };
      
      const content = await this.generate(prompt, jsonOptions);
      logInfo(`Structured Response: ${content.substring(0, 300)}...`, { tag: `LLM:${logId}` });
      
      // First try direct JSON parsing
      try {
        return JSON.parse(content);
      } catch (e) {
        logError(`Error parsing direct JSON response: ${e}`, { tag: `LLM:${logId}` });
      }
      
      // Try to extract JSON from markdown code blocks (multiple patterns)
      const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          logInfo(`Attempting to parse JSON from markdown code block`, { tag: `LLM:${logId}` });
          return JSON.parse(jsonMatch[1]);
        } catch (innerError) {
          logError(`Error parsing extracted JSON from code block: ${innerError}`, { tag: `LLM:${logId}` });
        }
      }
      
      // Try to extract JSON if it's potentially wrapped in text before/after
      try {
        logInfo(`Attempting to find and extract JSON from surrounding text`, { tag: `LLM:${logId}` });
        // Look for the first { and last }
        const startIdx = content.indexOf('{');
        const endIdx = content.lastIndexOf('}');
        
        if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
          const potentialJson = content.substring(startIdx, endIdx + 1);
          logInfo(`Found potential JSON: ${potentialJson.substring(0, 50)}...`, { tag: `LLM:${logId}` });
          return JSON.parse(potentialJson);
        }
      } catch (bracketError) {
        logError(`Error parsing JSON using bracket extraction: ${bracketError}`, { tag: `LLM:${logId}` });
      }
      
      // If all extraction attempts fail, throw a descriptive error
      throw new Error(`Invalid JSON response from LLM API. Response starts with: "${content.substring(0, 100)}..."`);
    } catch (error) {
      logError(`Error generating structured content: ${error}`, { tag: `LLM:${logId}` });
      throw error;
    }
  }
  
  /**
   * Get available models from the server-side API
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const apiUrl = getApiUrl('/api/llm/models');
      const response = await fetch(apiUrl, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.models || !Array.isArray(data.models)) {
        throw new Error('Invalid response format from models API');
      }

      return data.models;
    } catch (error) {
      logError(`Error fetching models: ${error}`, { tag: 'LLM' });
      
      // Return default models if API call fails
      return [
        'anthropic/claude-3.7-sonnet',
        'anthropic/claude-3.7-haiku',
        'anthropic/claude-3.5-sonnet',
        'anthropic/claude-3-opus',
        'anthropic/claude-3-sonnet',
        'anthropic/claude-3-haiku',
        'google/gemini-2-flash',
        'google/gemini-2-pro',
        'google/gemini-1.5-flash',
        'google/gemini-1.5-pro',
        'openai/gpt-4o',
        'openai/gpt-4-turbo',
        'openai/gpt-3.5-turbo',
      ];
    }
  }
} 