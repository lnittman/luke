import { atom } from 'jotai'

// Mouse position atom
export const mousePositionAtom = atom({ x: 0, y: 0 })

// Audio reactivity atoms
export const audioBassLevelAtom = atom(0)
export const audioMidLevelAtom = atom(0)
export const audioTrebleLevelAtom = atom(0)
export const audioLevelsAtom = atom(new Float32Array(64).fill(0))
export const isAudioActiveAtom = atom(false)

// Combined audio object atom
export const audioReactivityAtom = atom((get) => ({
  bassLevel: get(audioBassLevelAtom),
  midLevel: get(audioMidLevelAtom),
  trebleLevel: get(audioTrebleLevelAtom),
  audioLevels: get(audioLevelsAtom),
  isActive: get(isAudioActiveAtom),
}))
