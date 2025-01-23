// Zen-inspired pastel colors with harmonious combinations
export const zenPalette = [
  { 
    bg: '242, 237, 228',    // Warm Sand
    text: '98, 87, 77',
    glow: '242, 237, 228'
  },
  { 
    bg: '228, 237, 242',    // Soft Sky
    text: '77, 87, 98',
    glow: '228, 237, 242'
  },
  { 
    bg: '237, 242, 228',    // Sage Mist
    text: '87, 98, 77',
    glow: '237, 242, 228'
  },
  { 
    bg: '242, 228, 237',    // Rose Fog
    text: '98, 77, 87',
    glow: '242, 228, 237'
  },
  { 
    bg: '237, 228, 242',    // Lavender Haze
    text: '87, 77, 98',
    glow: '237, 228, 242'
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
