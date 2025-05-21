import { updateHeroFile } from '@/utils/hero'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const prompt = process.env.HERO_PROMPT
  await updateHeroFile(prompt)
  return NextResponse.json({ ok: true })
}
