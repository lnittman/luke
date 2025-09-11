// Pre-generated ASCII animation presets
import {
  generateBinaryCascadeFrames,
  generateMatrixRainFrames,
} from '../generators/matrix'
import {
  generateDataFlowFrames,
  generatePulseFrames,
  generateWaveFrames,
} from '../generators/wave'

// Lazy-load presets
export const Presets = {
  matrixRain: () => generateMatrixRainFrames(80, 30, 60),
  binaryCascade: () => generateBinaryCascadeFrames(60, 25, 40),
  wave: () => generateWaveFrames(80, 20, 30),
  dataFlow: () => generateDataFlowFrames(60, 20, 40),
  pulse: () => generatePulseFrames(60, 20, 30),

  // Static water/ripple effect for logs background
  water: () => [
    `≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈`,
    `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
  ],

  // Dots pattern for subtle background
  dots: () => {
    const frames = []
    for (let i = 0; i < 20; i++) {
      let frame = ''
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 40; x++) {
          if ((x + y + i) % 4 === 0) {
            frame += '·'
          } else {
            frame += ' '
          }
        }
        frame += '\n'
      }
      frames.push(frame)
    }
    return frames
  },

  // Loading spinner
  spinner: () => ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],

  // Progress bar
  progressBar: (width = 20) => {
    const frames = []
    for (let i = 0; i <= width; i++) {
      const filled = '█'.repeat(i)
      const empty = '░'.repeat(width - i)
      frames.push(`[${filled}${empty}]`)
    }
    return frames
  },
}

// Export individual generators for custom use
export {
  generateBinaryCascadeFrames,
  generateMatrixRainFrames,
} from '../generators/matrix'
export {
  generateDataFlowFrames,
  generatePulseFrames,
  generateWaveFrames,
} from '../generators/wave'
