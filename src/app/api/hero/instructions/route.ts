import { NextResponse } from 'next/server'
import { getHeroInstructions, setHeroInstructions } from '@/lib/utils/hero-server'

// Removed edge runtime - this route needs Node.js file system access

export async function GET() {
  const instructions = await getHeroInstructions()
  return NextResponse.json({ instructions })
}

export async function POST(req: Request) {
  const { instructions } = await req.json()
  await setHeroInstructions(instructions || '')
  return NextResponse.json({ ok: true })
}
