import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { openrouter } from '@ai-sdk/openrouter'
import { generateText } from 'ai'

export async function generateHeroText(prompt: string) {
  const { text } = await generateText({
    model: openrouter('openai/gpt-4-turbo'),
    system: 'You generate short poetic hero text for a personal website.',
    prompt
  })
  return text
}

const instructionsPath = join(process.cwd(), 'public', 'hero-instructions.json')

export async function readHeroInstructions() {
  try {
    const data = await readFile(instructionsPath, 'utf8')
    return JSON.parse(data).instructions as string
  } catch {
    return 'Write a new hero text.'
  }
}

export async function writeHeroInstructions(instructions: string) {
  await writeFile(
    instructionsPath,
    JSON.stringify({ instructions }, null, 2)
  )
}

export async function updateHeroFile(prompt: string) {
  const text = await generateHeroText(prompt)
  const filePath = join(process.cwd(), 'public', 'hero.json')
  await writeFile(filePath, JSON.stringify({ date: new Date().toISOString(), text }))
  return text
}
