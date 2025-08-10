export function generate404Frames(
  width: number = 80,
  height: number = 30,
  frameCount: number = 30
): string[] {
  const frames: string[] = []
  
  // ASCII art for 404 - each digit is 5x7
  const four = [
    '█   █',
    '█   █',
    '█   █',
    '█████',
    '    █',
    '    █',
    '    █'
  ]
  
  const zero = [
    ' ███ ',
    '█   █',
    '█   █',
    '█   █',
    '█   █',
    '█   █',
    ' ███ '
  ]
  
  // Background patterns
  const bgChars = ['░', '▒', '·', '•', '◦', '○']
  
  for (let f = 0; f < frameCount; f++) {
    const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '))
    const time = (f / frameCount) * Math.PI * 2
    
    // Add animated background
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Create wave pattern
        const wave1 = Math.sin((x * 0.1) + time) * Math.sin((y * 0.15) - time * 0.5)
        const wave2 = Math.cos((x * 0.08) - time * 0.7) * Math.cos((y * 0.1) + time * 0.3)
        const intensity = (wave1 + wave2) * 0.5
        
        if (Math.abs(intensity) > 0.3 && Math.random() > 0.7) {
          grid[y][x] = bgChars[Math.floor(Math.random() * bgChars.length)]
        }
      }
    }
    
    // Calculate center position for 404
    const totalWidth = 5 + 2 + 5 + 2 + 5 // 4 + space + 0 + space + 4
    const startX = Math.floor((width - totalWidth) / 2)
    const startY = Math.floor((height - 7) / 2)
    
    // Draw 404 in the center
    for (let row = 0; row < 7; row++) {
      // Draw first 4
      for (let col = 0; col < 5; col++) {
        const char = four[row][col]
        if (char !== ' ' && startY + row >= 0 && startY + row < height && startX + col >= 0 && startX + col < width) {
          grid[startY + row][startX + col] = char
        }
      }
      
      // Draw 0
      for (let col = 0; col < 5; col++) {
        const char = zero[row][col]
        if (char !== ' ' && startY + row >= 0 && startY + row < height && startX + 7 + col >= 0 && startX + 7 + col < width) {
          grid[startY + row][startX + 7 + col] = char
        }
      }
      
      // Draw second 4
      for (let col = 0; col < 5; col++) {
        const char = four[row][col]
        if (char !== ' ' && startY + row >= 0 && startY + row < height && startX + 14 + col >= 0 && startX + 14 + col < width) {
          grid[startY + row][startX + 14 + col] = char
        }
      }
    }
    
    // Add glitch effect occasionally
    if (Math.random() > 0.95) {
      const glitchY = startY + Math.floor(Math.random() * 7)
      const glitchX = startX + Math.floor(Math.random() * totalWidth)
      if (glitchY >= 0 && glitchY < height && glitchX >= 0 && glitchX < width) {
        grid[glitchY][glitchX] = Math.random() > 0.5 ? '▓' : '░'
      }
    }
    
    frames.push(grid.map(row => row.join('')).join('\n'))
  }
  
  return frames
}

export function generateErrorFrames(
  width: number = 80,
  height: number = 30,
  frameCount: number = 40,
  errorCode: string = 'ERROR'
): string[] {
  const frames: string[] = []
  const glitchChars = ['▓', '▒', '░', '█', '▄', '▀', '■', '□', '▪', '▫']
  
  for (let f = 0; f < frameCount; f++) {
    const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '))
    const time = (f / frameCount) * Math.PI * 2
    
    // Create glitchy background
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const noise = Math.sin(x * y * 0.01 + time) * Math.cos(x * 0.1 - y * 0.1 + time)
        
        if (Math.abs(noise) > 0.8 && Math.random() > 0.85) {
          grid[y][x] = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
      }
    }
    
    // Draw error text in center
    const textY = Math.floor(height / 2)
    const textX = Math.floor((width - errorCode.length) / 2)
    
    for (let i = 0; i < errorCode.length; i++) {
      if (textX + i >= 0 && textX + i < width) {
        // Glitch the text occasionally
        if (Math.random() > 0.9) {
          grid[textY][textX + i] = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        } else {
          grid[textY][textX + i] = errorCode[i]
        }
      }
    }
    
    // Add scanline effect
    const scanlineY = Math.floor((Math.sin(time) + 1) * height / 2)
    for (let x = 0; x < width; x++) {
      if (scanlineY >= 0 && scanlineY < height) {
        if (grid[scanlineY][x] === ' ') {
          grid[scanlineY][x] = '─'
        }
      }
    }
    
    frames.push(grid.map(row => row.join('')).join('\n'))
  }
  
  return frames
}