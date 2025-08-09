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

// Server-only code in a separate file to avoid Edge runtime errors
export async function getHeroInstructions() {
  'use server'

  try {
    // Dynamic import to avoid loading these modules in Edge runtime
    const { join } = await import('path')
    const { readFile } = await import('fs/promises')

    const instructionsPath = join(
      process.cwd(),
      'data',
      'hero-instructions.txt'
    )
    return await readFile(instructionsPath, 'utf8')
  } catch {
    return ''
  }
}

export async function setHeroInstructions(text: string) {
  'use server'

  const { join } = await import('path')
  const { writeFile } = await import('fs/promises')

  const instructionsPath = join(process.cwd(), 'data', 'hero-instructions.txt')
  await writeFile(instructionsPath, text)
}

export async function updateHeroFile(prompt?: string) {
  'use server'

  const { join } = await import('path')
  const { writeFile } = await import('fs/promises')

  const heroFilePath = join(process.cwd(), 'public', 'hero.json')
  const instructions = prompt ?? (await getHeroInstructions())
  const text = await generateHeroText(instructions)
  await writeFile(
    heroFilePath,
    JSON.stringify({ date: new Date().toISOString(), text })
  )
  return text
}
