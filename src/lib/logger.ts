/**
 * Structured logging utility for consistent log format across the application
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogOptions {
  tag: string;
  level?: LogLevel;
  data?: any;
}

/**
 * Log a message with structured format and optional data
 * 
 * @param message The main log message
 * @param options Logging options including tag, level, and data
 */
export function log(message: string, options: LogOptions): void {
  const { tag, level = LogLevel.INFO, data } = options;
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}] [${level}] [${tag}]`;
  
  // Log the message with its prefix
  console.log(`${logPrefix} ${message}`);
  
  // If there's additional data, log it too (truncate if needed)
  if (data) {
    const dataString = typeof data === 'string' 
      ? data 
      : JSON.stringify(data, null, 2);
    
    // Truncate very large data
    const truncated = dataString.length > 2000
      ? `${dataString.substring(0, 2000)}... (truncated, full length: ${dataString.length})`
      : dataString;
    
    console.log(`${logPrefix} Data:`, truncated);
  }
}

/**
 * Redact sensitive data from objects before logging
 * 
 * @param data The data object to redact
 * @returns A copy of the data with sensitive fields redacted
 */
export function redactSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  // Clone the object to avoid modifying the original
  const cloned = JSON.parse(JSON.stringify(data));
  
  // List of sensitive field names (case-insensitive)
  const sensitiveFields = [
    'apiKey', 'api_key', 'key', 'token', 'secret', 'password', 'auth',
    'authorization', 'credentials', 'private'
  ];
  
  // Recursively process the object
  function processObject(obj: any) {
    if (!obj || typeof obj !== 'object') {
      return;
    }
    
    // Process all properties
    for (const key in obj) {
      // Check if this is a sensitive field
      const isLowerKey = key.toLowerCase();
      const isSensitive = sensitiveFields.some(field => 
        isLowerKey.includes(field.toLowerCase())
      );
      
      if (isSensitive && typeof obj[key] === 'string') {
        // Redact the value, showing only the first and last characters
        const value = obj[key];
        if (value.length > 8) {
          obj[key] = `${value.substring(0, 3)}...${value.substring(value.length - 3)}`;
        } else {
          obj[key] = '***redacted***';
        }
      } else if (typeof obj[key] === 'object') {
        // Recursively process nested objects
        processObject(obj[key]);
      }
    }
  }
  
  processObject(cloned);
  return cloned;
}

// Convenience methods for different log levels
export const logDebug = (message: string, options: Omit<LogOptions, 'level'>) => 
  log(message, { ...options, level: LogLevel.DEBUG });

export const logInfo = (message: string, options: Omit<LogOptions, 'level'>) => 
  log(message, { ...options, level: LogLevel.INFO });

export const logWarn = (message: string, options: Omit<LogOptions, 'level'>) => 
  log(message, { ...options, level: LogLevel.WARN });

export const logError = (message: string, options: Omit<LogOptions, 'level'>) => 
  log(message, { ...options, level: LogLevel.ERROR }); 