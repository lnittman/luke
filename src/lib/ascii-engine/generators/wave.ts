// Wave and geometric pattern generators

export function generateWaveFrames(
  width = 80,
  height = 20,
  frameCount = 30,
  waveCount = 3
): string[] {
  const frames: string[] = []
  const chars = [' ', '·', ':', '-', '=', '≈', '~', '∿']

  for (let frame = 0; frame < frameCount; frame++) {
    const grid: string[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill(' '))

    for (let wave = 0; wave < waveCount; wave++) {
      const amplitude = height / 3
      const frequency = 0.1 + wave * 0.05
      const phase = (frame / frameCount) * Math.PI * 2 + (wave * Math.PI) / 2
      const yOffset = height / 2

      for (let x = 0; x < width; x++) {
        const y = Math.floor(
          yOffset + Math.sin(x * frequency + phase) * amplitude
        )

        if (y >= 0 && y < height) {
          const intensity = 1 - (wave / waveCount) * 0.5
          const charIndex = Math.floor(intensity * (chars.length - 1))
          grid[y][x] = chars[charIndex]

          // Add trailing effect
          for (let trail = 1; trail < 3; trail++) {
            const trailY = y + trail * (wave % 2 ? 1 : -1)
            if (trailY >= 0 && trailY < height && grid[trailY][x] === ' ') {
              grid[trailY][x] = chars[Math.max(0, charIndex - trail * 2)]
            }
          }
        }
      }
    }

    frames.push(grid.map((row) => row.join('')).join('\n'))
  }

  return frames
}

// Data flow visualization
export function generateDataFlowFrames(
  width = 60,
  height = 20,
  frameCount = 40
): string[] {
  const frames: string[] = []
  const dataChars = ['0', '1', '·', '-', '+', '×']

  // Data packets
  const packets: Array<{
    x: number
    y: number
    vx: number
    vy: number
    data: string
    trail: Array<{ x: number; y: number }>
  }> = []

  for (let frame = 0; frame < frameCount; frame++) {
    const grid: string[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill(' '))

    // Spawn new packets
    if (frame % 3 === 0) {
      packets.push({
        x: 0,
        y: Math.floor(Math.random() * height),
        vx: 1 + Math.random() * 2,
        vy: (Math.random() - 0.5) * 0.5,
        data: dataChars[Math.floor(Math.random() * dataChars.length)],
        trail: [],
      })
    }

    // Update packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i]

      // Add current position to trail
      p.trail.push({ x: p.x, y: p.y })
      if (p.trail.length > 10) p.trail.shift()

      // Move packet
      p.x += p.vx
      p.y += p.vy

      // Add some wave motion
      p.y += Math.sin(frame * 0.2 + p.x * 0.1) * 0.3

      // Remove if out of bounds
      if (p.x >= width || p.y < 0 || p.y >= height) {
        packets.splice(i, 1)
        continue
      }

      // Render trail
      p.trail.forEach((pos, idx) => {
        const tx = Math.floor(pos.x)
        const ty = Math.floor(pos.y)
        if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
          const fade = idx / p.trail.length
          if (fade < 0.3) {
            grid[ty][tx] = '·'
          } else if (fade < 0.6) {
            grid[ty][tx] = ':'
          } else {
            grid[ty][tx] = '-'
          }
        }
      })

      // Render packet
      const px = Math.floor(p.x)
      const py = Math.floor(p.y)
      if (px >= 0 && px < width && py >= 0 && py < height) {
        grid[py][px] = p.data
      }
    }

    frames.push(grid.map((row) => row.join('')).join('\n'))
  }

  return frames
}

// Geometric pulse effect
export function generatePulseFrames(
  width = 60,
  height = 20,
  frameCount = 30
): string[] {
  const frames: string[] = []
  const chars = [' ', '·', ':', '+', '×', '■', '▪', '□']

  for (let frame = 0; frame < frameCount; frame++) {
    let frameStr = ''
    const pulse = (Math.sin((frame / frameCount) * Math.PI * 2) + 1) / 2
    const centerX = width / 2
    const centerY = height / 2

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY)
        const normalizedDist = dist / maxDist

        // Create rings
        const ringIntensity =
          Math.sin((normalizedDist - pulse) * Math.PI * 8) * 0.5 + 0.5

        // Fade based on distance
        const fade = 1 - normalizedDist
        const intensity = ringIntensity * fade * pulse

        const charIndex = Math.floor(intensity * (chars.length - 1))
        frameStr += chars[Math.max(0, charIndex)]
      }
      frameStr += '\n'
    }

    frames.push(frameStr)
  }

  return frames
}
