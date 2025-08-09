// Matrix rain ASCII generator

export function generateMatrixRainFrames(
  width = 80,
  height = 30,
  frameCount = 60
): string[] {
  const frames: string[] = []
  const chars =
    '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'

  // Rain columns
  const columns: Array<{
    x: number
    y: number
    speed: number
    length: number
    chars: string[]
  }> = []

  // Initialize columns
  for (let x = 0; x < width; x += 2) {
    if (Math.random() > 0.3) {
      columns.push({
        x,
        y: Math.random() * height - height,
        speed: 0.5 + Math.random() * 1.5,
        length: 5 + Math.floor(Math.random() * 15),
        chars: Array(20)
          .fill(null)
          .map(() => chars[Math.floor(Math.random() * chars.length)]),
      })
    }
  }

  for (let frame = 0; frame < frameCount; frame++) {
    const grid: string[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill(' '))

    // Update and render columns
    columns.forEach((col) => {
      col.y += col.speed

      // Reset column when it goes off screen
      if (col.y - col.length > height) {
        col.y = -col.length
        col.speed = 0.5 + Math.random() * 1.5
        col.chars = Array(20)
          .fill(null)
          .map(() => chars[Math.floor(Math.random() * chars.length)])
      }

      // Render column
      for (let i = 0; i < col.length; i++) {
        const y = Math.floor(col.y - i)
        if (y >= 0 && y < height) {
          const brightness = 1 - i / col.length
          const char = col.chars[i % col.chars.length]

          // Leading character is bright
          if (i === 0) {
            grid[y][col.x] = char
          } else if (brightness > 0.7) {
            grid[y][col.x] = char
          } else if (brightness > 0.4) {
            grid[y][col.x] = '.'
          } else if (brightness > 0.2) {
            grid[y][col.x] = '·'
          }
        }
      }
    })

    frames.push(grid.map((row) => row.join('')).join('\n'))
  }

  return frames
}

// Binary cascade effect
export function generateBinaryCascadeFrames(
  width = 60,
  height = 25,
  frameCount = 40
): string[] {
  const frames: string[] = []

  for (let frame = 0; frame < frameCount; frame++) {
    let frameStr = ''

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const wave = Math.sin(y * 0.3 - frame * 0.2 + x * 0.1)
        const threshold = (Math.sin(frame * 0.1) + 1) * 0.5

        if (wave > threshold) {
          frameStr += Math.random() > 0.5 ? '1' : '0'
        } else if (wave > threshold - 0.3) {
          frameStr += Math.random() > 0.7 ? '·' : ' '
        } else {
          frameStr += ' '
        }
      }
      frameStr += '\n'
    }

    frames.push(frameStr)
  }

  return frames
}
