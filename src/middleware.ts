import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Skip middleware for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Skip middleware for non-tech API routes
  if (!request.nextUrl.pathname.startsWith('/api/tech') && 
      !request.nextUrl.pathname.startsWith('/api/diagnostics')) {
    return NextResponse.next();
  }
  
  // Check for BLOB_READ_WRITE_TOKEN in headers
  const authHeader = request.headers.get('BLOB_READ_WRITE_TOKEN');
  
  // If token is in the header, add it to the environment
  if (authHeader) {
    // Clone the request and add the token to the environment
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-vercel-blob-token', authHeader);
    
    // Create a new response with the modified headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    return response;
  }
  
  // If we're here, continue without modifications
  return NextResponse.next();
}

// Configure matcher for the middleware
export const config = {
  matcher: ['/api/:path*'],
}; 