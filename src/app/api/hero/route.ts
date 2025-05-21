import { openrouter } from '@ai-sdk/openrouter'
import { streamText } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { instructions } = await req.json()
  const result = await streamText({
    model: openrouter('openai/gpt-4-turbo'),
    system: 'You generate short poetic hero text for a personal website.',
    prompt: instructions
  })
  return result.toTextStreamResponse()
}
