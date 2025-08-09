import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'

import { getHeroInstructions } from '@/lib/utils/hero'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function GET() {
  const instructions = await getHeroInstructions()

  const result = await streamText({
    model: openrouter('openai/gpt-4-turbo'),
    system: 'You generate short poetic hero text for a personal website.',
    prompt: instructions,
  })

  return result.toTextStreamResponse()
}
