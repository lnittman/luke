import { readHeroInstructions, updateHeroFile } from '@/utils/hero'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const prompt = await readHeroInstructions()
  await updateHeroFile(prompt)
  return NextResponse.json({ ok: true })
}
