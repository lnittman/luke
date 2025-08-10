'use server'

// Server-only code for hero instructions
export async function getHeroInstructions() {
  try {
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
  const { join } = await import('path')
  const { writeFile } = await import('fs/promises')

  const instructionsPath = join(process.cwd(), 'data', 'hero-instructions.txt')
  await writeFile(instructionsPath, text)
}

export async function updateHeroFile(prompt?: string) {
  const { join } = await import('path')
  const { writeFile } = await import('fs/promises')
  const { generateHeroText } = await import('./hero')

  const heroFilePath = join(process.cwd(), 'public', 'hero.json')
  const instructions = prompt ?? (await getHeroInstructions())
  const text = await generateHeroText(instructions)
  await writeFile(
    heroFilePath,
    JSON.stringify({ text, timestamp: new Date().toISOString() }, null, 2)
  )
  return text
}