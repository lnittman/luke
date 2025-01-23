// Zen-inspired pastel colors with harmonious combinations
export const zenPalette = [
  { 
    bg: '245, 240, 235',    // Warm Sand
    text: '95, 85, 75',
    glow: '235, 200, 180'
  },
  { 
    bg: '235, 240, 245',    // Soft Sky
    text: '75, 85, 95',
    glow: '180, 210, 235'
  },
  { 
    bg: '240, 245, 235',    // Sage Mist
    text: '85, 95, 75',
    glow: '200, 235, 180'
  },
  { 
    bg: '245, 235, 240',    // Rose Fog
    text: '95, 75, 85',
    glow: '235, 180, 210'
  },
  { 
    bg: '240, 235, 245',    // Lavender Haze
    text: '85, 75, 95',
    glow: '210, 180, 235'
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
