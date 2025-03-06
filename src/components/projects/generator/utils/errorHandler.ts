import { toast } from 'sonner';

/**
 * Error types for the project generator
 */
export enum ErrorType {
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DOCUMENT_ERROR = 'DOCUMENT_ERROR',
  PROJECT_ERROR = 'PROJECT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Error messages for different error types
 */
export const ERROR_MESSAGES = {
  [ErrorType.API_ERROR]: 'Failed to communicate with the server. Please try again.',
  [ErrorType.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorType.NETWORK_ERROR]: 'Network connection issue. Please check your internet connection.',
  [ErrorType.DOCUMENT_ERROR]: 'Error generating documentation. Please try again.',
  [ErrorType.PROJECT_ERROR]: 'Error generating project. Please try again.',
  [ErrorType.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
};

/**
 * Handles errors in the project generator
 * Logs the error, displays a toast, and returns a user-friendly message
 */
export const handleError = (
  error: any, 
  type: ErrorType = ErrorType.UNKNOWN_ERROR, 
  showToast: boolean = true,
  customMessage?: string
): string => {
  // Determine error message
  const message = customMessage || getErrorMessage(error, type);
  
  // Log the error
  console.error(`[${type}] Error:`, error);
  
  // Show toast if requested
  if (showToast) {
    toast.error(message);
  }
  
  // Return the error message
  return message;
};

/**
 * Gets a user-friendly error message
 */
export const getErrorMessage = (error: any, type: ErrorType): string => {
  // Use predefined message if available
  if (ERROR_MESSAGES[type]) {
    return ERROR_MESSAGES[type];
  }
  
  // Try to extract message from error
  if (error instanceof Error) {
    return error.message;
  }
  
  // If error is a string, use it
  if (typeof error === 'string') {
    return error;
  }
  
  // Last resort: generic message
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Handles API errors and attempts to provide more context
 */
export const handleApiError = (error: any, endpoint: string): string => {
  // Determine if this is a network error
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return handleError(error, ErrorType.NETWORK_ERROR);
  }
  
  // Handle specific API errors
  if (error instanceof Error && error.message.startsWith('API error:')) {
    const statusCode = error.message.split(':')[1]?.trim();
    
    if (statusCode === '401' || statusCode === '403') {
      return handleError(
        error, 
        ErrorType.API_ERROR, 
        true,
        `Authentication error when calling ${endpoint}. Please try again.`
      );
    }
    
    if (statusCode === '429') {
      return handleError(
        error, 
        ErrorType.API_ERROR, 
        true,
        `Rate limit exceeded. Please wait a moment and try again.`
      );
    }
    
    if (statusCode === '500') {
      return handleError(
        error, 
        ErrorType.API_ERROR, 
        true,
        `Server error when calling ${endpoint}. Please try again later.`
      );
    }
  }
  
  // Default to generic API error
  return handleError(error, ErrorType.API_ERROR);
}; 