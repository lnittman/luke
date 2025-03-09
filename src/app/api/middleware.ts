import { NextRequest, NextResponse } from 'next/server';

// Simple log capture implementation since the imported one doesn't exist
const logCapture = {
  capture: (message: string) => {
    // This is a placeholder. In a real implementation, this would send the log to connected clients
    console.log(`[CAPTURED] ${message}`);
  }
};

// This will capture log messages and route them to connected SSE clients
export function middleware(request: NextRequest) {
  // Create a modified console.log to capture messages
  if (typeof console.log === 'function') {
    const originalLog = console.log;
    
    console.log = (...args) => {
      // Call the original console.log
      originalLog(...args);
      
      // Only intercept log messages with specific formats
      const message = args.join(' ');
      if (
        message.includes('[INFO]') || 
        message.includes('[ERROR]') || 
        message.includes('[API]') || 
        message.includes('[SEARCH]') || 
        message.includes('[LLM')
      ) {
        logCapture.capture(message);
      }
    };
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Only match API routes related to project generation and ideas
export const config = {
  matcher: ['/api/projects/generate', '/api/ideas/random']
}; 