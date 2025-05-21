import { openrouter } from '@ai-sdk/openrouter'
import { streamText } from 'ai'
import { getHeroInstructions } from '@/utils/hero'

export const runtime = 'edge'

export async function GET() {
  const instructions = await getHeroInstructions()
  const result = await streamText({
    model: openrouter('openai/gpt-4-turbo'),
    system: 'You generate short poetic hero text for a personal website.',
    prompt: instructions
  })
  return result.toTextStreamResponse()
}
