// Flame/Fire ASCII generator

export function generateFlameFrames(
  width = 40,
  height = 20,
  frameCount = 30
): string[] {
  const frames: string[] = []
  const chars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@']

  for (let frame = 0; frame < frameCount; frame++) {
    let frameStr = ''
    const intensity = (Math.sin(frame * 0.2) + 1) * 0.5

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const distFromBottom = height - y
        const distFromCenter = Math.abs(x - width / 2) / (width / 2)

        // Create flame shape
        const flameHeight = height * (0.7 + intensity * 0.3)
        const flameWidth = (1 - y / height) * (1 - distFromCenter * 0.8)

        // Add randomness
        const noise = Math.random() * 0.3
        const heat = (distFromBottom / flameHeight) * flameWidth - noise

        // Add flicker
        const flicker = Math.sin(frame * 0.5 + x * 0.1 + y * 0.2) * 0.1
        const finalHeat = Math.max(0, Math.min(1, heat + flicker))

        // Map to character
        const charIndex = Math.floor(finalHeat * (chars.length - 1))
        frameStr += chars[charIndex]
      }
      frameStr += '\n'
    }

    frames.push(frameStr)
  }

  return frames
}

// More intense flame with particles
export function generateIntenseFlameFrames(
  width = 60,
  height = 30,
  frameCount = 40
): string[] {
  const frames: string[] = []
  const flameChars = [' ', '.', '·', ':', '▪', '▄', '█', '▓', '▒', '░']
  const sparkChars = ['*', '+', '×', '✦']

  // Particle system
  const particles: Array<{
    x: number
    y: number
    life: number
    vx: number
    vy: number
  }> = []

  for (let frame = 0; frame < frameCount; frame++) {
    const grid: string[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill(' '))

    // Add new particles
    if (Math.random() > 0.3) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * width * 0.3,
        y: height - 1,
        life: 1,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2 - 1,
      })
    }

    // Update and render particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life -= 0.05
      p.vy += 0.1 // gravity

      if (p.life <= 0 || p.y < 0 || p.x < 0 || p.x >= width) {
        particles.splice(i, 1)
        continue
      }

      const px = Math.floor(p.x)
      const py = Math.floor(p.y)

      if (py >= 0 && py < height && px >= 0 && px < width) {
        if (p.life > 0.7) {
          grid[py][px] =
            sparkChars[Math.floor(Math.random() * sparkChars.length)]
        } else {
          grid[py][px] =
            flameChars[Math.floor(p.life * (flameChars.length - 1))]
        }
      }
    }

    // Base flame
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x] !== ' ') continue

        const distFromBottom = height - y
        const distFromCenter = Math.abs(x - width / 2)

        const flameIntensity = Math.max(
          0,
          1 -
            (distFromBottom / height) * 1.5 -
            (distFromCenter / width) * 2 +
            Math.sin(frame * 0.3 + x * 0.2) * 0.2
        )

        if (flameIntensity > 0.1) {
          const charIndex = Math.floor(flameIntensity * (flameChars.length - 1))
          grid[y][x] = flameChars[charIndex]
        }
      }
    }

    frames.push(grid.map((row) => row.join('')).join('\n'))
  }

  return frames
}
