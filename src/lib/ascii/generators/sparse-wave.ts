// Sparse left-to-right wave generator with perfect looping

export function generateSparseWaveFrames(
  width = 80,
  height = 20,
  frameCount = 60
): string[] {
  const frames: string[] = []
  const chars = ['·', ':', '∙', '•']
  
  // Create sparse wave particles
  const particles: Array<{
    x: number
    y: number
    char: string
    speed: number
    amplitude: number
    frequency: number
    phase: number
  }> = []
  
  // Generate a few sparse particles
  const particleCount = Math.floor(width * height * 0.02) // Only 2% coverage
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      char: chars[Math.floor(Math.random() * chars.length)],
      speed: 0.5 + Math.random() * 1.5,
      amplitude: 2 + Math.random() * 3,
      frequency: 0.1 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
    })
  }
  
  for (let frame = 0; frame < frameCount; frame++) {
    const grid: string[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill(' '))
    
    // Update and render particles
    particles.forEach((p) => {
      // Calculate position with seamless looping
      const progress = (frame / frameCount) % 1
      const x = Math.floor((p.x + progress * width * p.speed) % width)
      const waveOffset = Math.sin(progress * Math.PI * 2 * p.frequency + p.phase) * p.amplitude
      const y = Math.floor((p.y + waveOffset + height) % height)
      
      if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[y][x] = p.char
      }
      
      // Add occasional trailing dots
      if (Math.random() > 0.7) {
        const trailX = (x - 1 + width) % width
        if (trailX >= 0 && trailX < width && y >= 0 && y < height) {
          grid[y][trailX] = '·'
        }
      }
    })
    
    frames.push(grid.map((row) => row.join('')).join('\n'))
  }
  
  return frames
}

// Even more minimal wave
export function generateMinimalWaveFrames(
  width = 80,
  height = 20,
  frameCount = 40
): string[] {
  const frames: string[] = []
  
  for (let frame = 0; frame < frameCount; frame++) {
    const grid: string[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill(' '))
    
    // Single wave moving left to right
    const progress = (frame / frameCount) * Math.PI * 2
    
    // Just a few dots moving in a wave pattern
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(((frame * 2 + i * 15) % width))
      const y = Math.floor(height / 2 + Math.sin(progress + i * 0.5) * (height / 4))
      
      if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[y][x] = i % 2 === 0 ? '·' : '∙'
      }
    }
    
    frames.push(grid.map((row) => row.join('')).join('\n'))
  }
  
  return frames
}