'use client'

import { useState } from 'react'
import { TextFade } from '@/components/shared/text-fade'
import { AsciiEngine } from '@/lib/ascii-engine'
import { AsciiEditor } from '@/lib/ascii-engine/editor'
import { Presets } from '@/lib/ascii-engine/presets'

export default function AsciiPage() {
  const [savedAnimations, setSavedAnimations] = useState<
    {
      name: string
      frames: string[]
    }[]
  >([])
  const [selectedAnimation, setSelectedAnimation] = useState<string[]>([])
  const [showPresets, setShowPresets] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

  const handleSave = (frames: string[]) => {
    const name = prompt('Enter a name for this animation:')
    if (name) {
      setSavedAnimations((prev) => [...prev, { name, frames }])
    }
  }

  const handlePresetSelect = (frames: string[]) => {
    setSelectedAnimation(frames)
    setEditorKey((prev) => prev + 1) // Force editor remount with new frames
    setShowPresets(false)
  }

  const presetList = [
    { name: 'Matrix Rain', generator: Presets.matrixRain },
    { name: 'Binary Cascade', generator: Presets.binaryCascade },
    { name: 'Wave', generator: Presets.wave },
    { name: 'Data Flow', generator: Presets.dataFlow },
    { name: 'Pulse', generator: Presets.pulse },
    { name: 'Water', generator: Presets.water },
    { name: 'Dots', generator: Presets.dots },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[rgb(var(--background-start))] to-[rgb(var(--background-end))]">
      {/* Header */}
      <div className="border-[rgb(var(--border))] border-b px-6 py-8">
        <TextFade className="font-bold font-mono text-2xl">
          ASCII Engine
        </TextFade>
        <div className="mt-2 font-mono text-[rgb(var(--text-secondary))] text-sm">
          Create frame-based ASCII animations
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 border-[rgb(var(--border))] border-b px-6 py-4">
        <button
          className="brutalist-button"
          onClick={() => setShowPresets(!showPresets)}
        >
          {showPresets ? 'Hide' : 'Show'} Presets
        </button>

        {savedAnimations.length > 0 && (
          <select
            className="brutalist-input"
            onChange={(e) => {
              const animation = savedAnimations.find(
                (a) => a.name === e.target.value
              )
              if (animation) {
                setSelectedAnimation(animation.frames)
                setEditorKey((prev) => prev + 1)
              }
            }}
          >
            <option value="">Load saved animation...</option>
            {savedAnimations.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Presets Grid */}
      {showPresets && (
        <div className="grid grid-cols-2 gap-4 border-[rgb(var(--border))] border-b p-6 md:grid-cols-3 lg:grid-cols-4">
          {presetList.map((preset) => (
            <button
              className="brutalist-card flex flex-col items-center gap-3 p-4 transition-all duration-200 hover:border-[rgb(var(--accent-1))]"
              key={preset.name}
              onClick={() => handlePresetSelect(preset.generator())}
            >
              <div className="h-20 w-full overflow-hidden rounded border border-[rgb(var(--border))] bg-[rgb(var(--background-start))] p-1">
                <AsciiEngine
                  fps={4}
                  frames={preset.generator().slice(0, 5)}
                  loop={true}
                  style={{
                    fontSize: '6px',
                    lineHeight: '7px',
                    opacity: 0.8,
                    color: 'rgb(var(--accent-1))',
                  }}
                />
              </div>
              <div className="font-mono text-[rgb(var(--text-primary))] text-sm">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Editor Container with Scroll */}
      <div
        className="overflow-auto p-6"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <AsciiEditor
          height={24}
          initialFrames={
            selectedAnimation.length > 0 ? selectedAnimation : undefined
          }
          key={editorKey}
          onSave={handleSave}
          width={80}
        />
      </div>

      {/* Saved Animations */}
      {savedAnimations.length > 0 && (
        <div className="border-[rgb(var(--border))] border-t p-6">
          <h3 className="mb-4 font-bold font-mono text-[rgb(var(--text-primary))] text-base">
            Saved Animations
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedAnimations.map((animation, i) => (
              <div className="brutalist-card" key={i}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-bold font-mono text-sm">
                    {animation.name}
                  </span>
                  <button
                    className="brutalist-button px-2 py-1 text-xs"
                    onClick={() => {
                      setSelectedAnimation(animation.frames)
                      setEditorKey((prev) => prev + 1)
                    }}
                  >
                    Load
                  </button>
                </div>
                <div className="h-24 overflow-hidden rounded border border-[rgb(var(--border))] bg-[rgb(var(--background-start))] p-2">
                  <AsciiEngine
                    fps={8}
                    frames={animation.frames}
                    loop={true}
                    style={{
                      fontSize: '8px',
                      lineHeight: '10px',
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
