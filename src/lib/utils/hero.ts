// Edge-compatible code (no Node.js built-ins)
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'

// For AI generation - works in both Edge and Server environments
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

// This function is Edge-compatible
export async function generateHeroText(prompt: string) {
  const { text } = await generateText({
    model: openrouter('openai/gpt-4-turbo'),
    system: 'You generate short poetic hero text for a personal website.',
    prompt,
  })
  return text
}

// Server actions are now in hero-server.ts to avoid client component issues
// Import from './hero-server' when needed in server components