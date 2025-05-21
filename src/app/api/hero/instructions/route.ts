import { NextResponse } from 'next/server'
import { readHeroInstructions, writeHeroInstructions } from '@/utils/hero'

export const runtime = 'edge'

export async function GET() {
  const instructions = await readHeroInstructions()
  return NextResponse.json({ instructions })
}

export async function POST(req: Request) {
  const { instructions } = await req.json()
  await writeHeroInstructions(instructions)
  return NextResponse.json({ instructions })
}
