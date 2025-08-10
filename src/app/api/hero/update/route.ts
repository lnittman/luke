import { NextResponse } from 'next/server'
import { updateHeroFile } from '@/lib/utils/hero-server'

// Server route (no edge runtime) - can use Node.js APIs
export async function GET() {
  const prompt = process.env.HERO_PROMPT
  await updateHeroFile(prompt)
  return NextResponse.json({ ok: true })
}
