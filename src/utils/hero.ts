import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { openrouter } from '@ai-sdk/openrouter'
import { generateText } from 'ai'

const heroFilePath = join(process.cwd(), 'public', 'hero.json')
const instructionsPath = join(process.cwd(), 'data', 'hero-instructions.txt')

export async function getHeroInstructions() {
  try {
    return await readFile(instructionsPath, 'utf8')
  } catch {
    return ''
  }
}

export async function setHeroInstructions(text: string) {
  await writeFile(instructionsPath, text)
}

export async function generateHeroText(prompt: string) {
  const { text } = await generateText({
    model: openrouter('openai/gpt-4-turbo'),
    system: 'You generate short poetic hero text for a personal website.',
    prompt
  })
  return text
}

export async function updateHeroFile(prompt?: string) {
  const instructions = prompt ?? (await getHeroInstructions())
  const text = await generateHeroText(instructions)
  await writeFile(heroFilePath, JSON.stringify({ date: new Date().toISOString(), text }))
  return text
}
