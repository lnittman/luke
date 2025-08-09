interface TimeState {
  emoji: string
  themeValue: number
}

export function getTimeState(): TimeState {
  const now = new Date()
  const hour = now.getHours()

  // Early morning (5am - 9am)
  if (hour >= 5 && hour < 9) {
    return { emoji: '🌅', themeValue: 3 } // Morning Mist
  }
  // Day (9am - 6pm)
  if (hour >= 9 && hour < 18) {
    return { emoji: '🍃', themeValue: 1 } // Zen Garden
  }
  // Evening (6pm - 9pm)
  if (hour >= 18 && hour < 21) {
    return { emoji: '🌆', themeValue: 3 } // Morning Mist
  }
  // Night (9pm - 5am)

  return { emoji: '🌙', themeValue: 2 } // Night Rain
}
