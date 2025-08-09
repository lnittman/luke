import { NextResponse } from 'next/server'
import { generateHeroText } from '@/lib/utils/hero'

// Remove Edge runtime directive to allow using server-only components
// export const runtime = 'edge'

export async function GET() {
  // Redirect to the main /api/hero endpoint
  // This avoids using updateHeroFile which requires Node.js modules
  return NextResponse.redirect(
    new URL('/api/hero', process.env.VERCEL_URL || 'http://localhost:3000')
  )
}
