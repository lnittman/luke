export function generateWaterFrames(
  width: number = 80,
  height: number = 30,
  frameCount: number = 30
): string[] {
  const frames: string[] = []
  const waterChars = ['~', '≈', '∿', '-', '_', '˜', '⁓']
  const dropChars = ['·', '•', '◦', '○', '°']
  
  for (let f = 0; f < frameCount; f++) {
    const lines: string[] = []
    const time = (f / frameCount) * Math.PI * 2
    
    for (let y = 0; y < height; y++) {
      let line = ''
      const waveOffset = Math.sin(time + y * 0.3) * 3
      
      for (let x = 0; x < width; x++) {
        const wave1 = Math.sin((x + f * 2) * 0.1 + y * 0.2) * 0.5
        const wave2 = Math.sin((x - f * 1.5) * 0.15 - y * 0.1) * 0.3
        const combined = wave1 + wave2 + waveOffset * 0.1
        
        // Add ripples
        const rippleX = width / 2 + Math.sin(time) * 10
        const rippleY = height / 2 + Math.cos(time) * 5
        const rippleDist = Math.sqrt(Math.pow(x - rippleX, 2) + Math.pow(y - rippleY, 2))
        const ripple = Math.sin(rippleDist * 0.5 - f * 0.5) * Math.exp(-rippleDist * 0.05)
        
        const intensity = Math.abs(combined + ripple * 0.3)
        
        if (intensity > 0.8) {
          line += dropChars[Math.floor(Math.random() * dropChars.length)]
        } else if (intensity > 0.5) {
          line += waterChars[Math.floor((combined + 1) * waterChars.length / 2) % waterChars.length]
        } else if (intensity > 0.2) {
          line += Math.random() > 0.7 ? '.' : ' '
        } else {
          line += ' '
        }
      }
      lines.push(line)
    }
    
    frames.push(lines.join('\n'))
  }
  
  return frames
}

export function generateOceanWavesFrames(
  width: number = 80,
  height: number = 30,
  frameCount: number = 40
): string[] {
  const frames: string[] = []
  const waveChars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
  const foamChars = ['°', '∘', '○', '◦', '•', '·']
  
  for (let f = 0; f < frameCount; f++) {
    const lines: string[] = []
    const time = (f / frameCount) * Math.PI * 4
    
    for (let y = 0; y < height; y++) {
      let line = ''
      const depth = y / height
      
      for (let x = 0; x < width; x++) {
        // Multiple wave layers
        const wave1 = Math.sin((x * 0.1) + time) * (1 - depth)
        const wave2 = Math.sin((x * 0.07) - time * 0.7) * (1 - depth) * 0.7
        const wave3 = Math.sin((x * 0.13) + time * 1.3) * (1 - depth) * 0.4
        
        const combined = wave1 + wave2 + wave3
        const waveHeight = (combined + 2) / 4 // Normalize to 0-1
        
        // Create wave effect based on depth
        if (depth < 0.3) {
          // Sky/air
          if (Math.random() > 0.98) {
            line += '·' // Occasional spray
          } else {
            line += ' '
          }
        } else if (depth < 0.5) {
          // Wave crest with foam
          if (waveHeight > 0.7 && Math.random() > 0.3) {
            line += foamChars[Math.floor(Math.random() * foamChars.length)]
          } else if (waveHeight > 0.5) {
            line += '~'
          } else {
            line += ' '
          }
        } else {
          // Deep water
          const waveIndex = Math.floor(waveHeight * waveChars.length)
          line += waveChars[Math.min(waveIndex, waveChars.length - 1)]
        }
      }
      lines.push(line)
    }
    
    frames.push(lines.join('\n'))
  }
  
  return frames
}

export function generateRainFrames(
  width: number = 80,
  height: number = 30,
  frameCount: number = 30
): string[] {
  const frames: string[] = []
  const rainChars = ['|', '¦', '⎸', '⎹', '/', '\\', '\'', '`']
  const splashChars = ['˚', '°', '∘', '○', '◦']
  
  // Track rain drops
  interface Drop {
    x: number
    y: number
    speed: number
    char: string
  }
  
  const drops: Drop[] = []
  
  // Initialize drops
  for (let i = 0; i < width * 0.3; i++) {
    drops.push({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      speed: Math.random() * 2 + 1,
      char: rainChars[Math.floor(Math.random() * rainChars.length)]
    })
  }
  
  for (let f = 0; f < frameCount; f++) {
    const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '))
    
    // Update and draw drops
    drops.forEach(drop => {
      // Move drop
      drop.y += drop.speed
      
      // Wind effect
      drop.x += Math.sin(f * 0.1) * 0.3
      
      // Reset if out of bounds
      if (drop.y >= height) {
        // Create splash at bottom
        const splashX = Math.floor(drop.x)
        if (splashX >= 0 && splashX < width) {
          grid[height - 1][splashX] = splashChars[Math.floor(Math.random() * splashChars.length)]
        }
        
        drop.y = 0
        drop.x = Math.floor(Math.random() * width)
        drop.speed = Math.random() * 2 + 1
        drop.char = rainChars[Math.floor(Math.random() * rainChars.length)]
      }
      
      // Draw drop
      const y = Math.floor(drop.y)
      const x = Math.floor(drop.x)
      if (y >= 0 && y < height && x >= 0 && x < width) {
        grid[y][x] = drop.char
        
        // Trail effect
        if (y > 0) {
          const trailY = y - 1
          if (grid[trailY][x] === ' ') {
            grid[trailY][x] = '·'
          }
        }
      }
    })
    
    // Add puddle effect at bottom
    for (let x = 0; x < width; x++) {
      if (Math.random() > 0.7) {
        grid[height - 1][x] = '~'
      }
    }
    
    frames.push(grid.map(row => row.join('')).join('\n'))
  }
  
  return frames
}