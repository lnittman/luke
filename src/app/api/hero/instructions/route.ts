import { NextResponse } from 'next/server'
import { getHeroInstructions, setHeroInstructions } from '@/utils/hero'

export const runtime = 'edge'

export async function GET() {
  const instructions = await getHeroInstructions()
  return NextResponse.json({ instructions })
}

export async function POST(req: Request) {
  const { instructions } = await req.json()
  await setHeroInstructions(instructions || '')
  return NextResponse.json({ ok: true })
}
