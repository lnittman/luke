// Zen-inspired pastel colors with harmonious combinations
export const zenPalette = [
  { 
    bg: '255, 241, 232',    // Soft Peach
    text: '98, 87, 77',
    glow: '255, 200, 180'
  },
  { 
    bg: '232, 246, 255',    // Sky Blue
    text: '77, 87, 98',
    glow: '180, 220, 255'
  },
  { 
    bg: '241, 255, 232',    // Mint Green
    text: '87, 98, 77',
    glow: '200, 255, 180'
  },
  { 
    bg: '255, 232, 246',    // Rose Pink
    text: '98, 77, 87',
    glow: '255, 180, 220'
  },
  { 
    bg: '246, 232, 255',    // Soft Lavender
    text: '87, 77, 98',
    glow: '220, 180, 255'
  }
];

// Get a deterministic color based on a string
export function getZenColor(key: string, offset = 0): typeof zenPalette[0] {
  const hash = key.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return zenPalette[Math.abs((hash + offset) % zenPalette.length)];
}

// Get a random color from the palette
export function getRandomZenColor(): typeof zenPalette[0] {
  return zenPalette[Math.floor(Math.random() * zenPalette.length)];
}
