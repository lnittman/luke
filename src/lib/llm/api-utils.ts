/**
 * API utilities for robust fetching and error handling
 */
import { log, LogLevel } from './llm/logger';

/**
 * Options for controlling retry behavior
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Initial delay in milliseconds before first retry */
  initialDelay: number;
  /** Maximum delay in milliseconds between retries */
  maxDelay: number;
  /** Whether to retry on network errors (default: true) */
  retryNetworkErrors?: boolean;
  /** List of status codes to retry on (default: [429, 503, 504]) */
  retryStatusCodes?: number[];
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  retryNetworkErrors: true,
  retryStatusCodes: [429, 503, 504] // Rate limiting and temporary server errors
};

/**
 * Enhanced fetch with retry capabilities using exponential backoff
 * 
 * @param url The URL to fetch
 * @param options Standard fetch options
 * @param retryOptions Options to control retry behavior
 * @returns The fetch response if successful
 */
export async function retryFetch(
  url: string, 
  options: RequestInit,
  retryOptions: Partial<RetryOptions> = {}
): Promise<Response> {
  // Merge default options with provided options
  const opts: RetryOptions = {
    ...DEFAULT_RETRY_OPTIONS,
    ...retryOptions
  };
  
  const { maxRetries, initialDelay, maxDelay, retryNetworkErrors, retryStatusCodes } = opts;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Log the retry attempt
      if (attempt > 0) {
        log(`Retry attempt ${attempt}/${maxRetries} for ${url}`, {
          tag: 'FETCH_RETRY',
          level: LogLevel.INFO
        });
      }
      
      const response = await fetch(url, options);
      
      // Check if the response is successful or if we should retry based on status
      if (response.ok || !retryStatusCodes?.includes(response.status)) {
        return response;
      }
      
      // Not ok and status is in retryStatusCodes, prepare for retry
      const errorText = await response.text();
      lastError = new Error(`Fetch failed with status ${response.status}: ${errorText}`);
      
      // Don't retry if we've reached the max number of retries
      if (attempt >= maxRetries) {
        throw lastError;
      }
      
      log(`Received status ${response.status}, will retry`, {
        tag: 'FETCH_RETRY',
        level: LogLevel.WARN
      });
    } catch (error: any) {
      // Don't retry if it's not a network error and retryNetworkErrors is false
      const isNetworkError = error.message && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('Network request failed') ||
        error.message.includes('network error')
      );
      
      if (!isNetworkError && !retryNetworkErrors) {
        throw error;
      }
      
      lastError = error;
      
      // Don't retry if we've reached the max number of retries
      if (attempt >= maxRetries) {
        throw error;
      }
      
      log(`Network error: ${error.message}, will retry`, {
        tag: 'FETCH_RETRY',
        level: LogLevel.WARN
      });
    }
    
    // Calculate delay with exponential backoff and jitter (±10%)
    const baseDelay = Math.min(
      maxDelay,
      initialDelay * Math.pow(2, attempt)
    );
    
    // Add jitter to prevent synchronized retries
    const jitter = 0.9 + Math.random() * 0.2; // 90% to 110% of base delay
    const delay = Math.round(baseDelay * jitter);
    
    log(`Waiting ${delay}ms before next attempt`, {
      tag: 'FETCH_RETRY',
      level: LogLevel.INFO
    });
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // This should never happen due to the throw in the loop, but TypeScript needs it
  throw lastError || new Error('Unknown error during retry');
}

/**
 * Makes an API request with timeout and retry capabilities
 * 
 * @param url The URL to fetch
 * @param options Standard fetch options
 * @param timeoutMs Timeout in milliseconds (default: 30000)
 * @param retryOptions Options to control retry behavior
 * @returns The fetch response if successful
 */
export async function apiRequest(
  url: string,
  options: RequestInit,
  timeoutMs: number = 30000,
  retryOptions: Partial<RetryOptions> = {}
): Promise<Response> {
  // Add timeout to the request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await retryFetch(
      url,
      {
        ...options,
        signal: controller.signal
      },
      retryOptions
    );
    
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
} 