/**
 * Helper function to get absolute URL for API endpoints
 * This handles both client-side and server-side environments
 */
export function getApiUrl(path: string): string {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  if (isBrowser) {
    // Client-side: Use relative URL which will be resolved against the current origin
    return path;
  } else {
    // Server-side: Need absolute URL
    // First try to get the URL from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    
    if (baseUrl) {
      // Make sure we have the protocol
      const protocol = baseUrl.startsWith('http') ? '' : 'https://';
      return `${protocol}${baseUrl}${path}`;
    }
    
    // Fallback to localhost for development
    return `http://localhost:${process.env.PORT || 3000}${path}`;
  }
} 