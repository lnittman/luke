'use client'

import { useCallback, useRef, useState } from 'react'
import { AsciiEngine } from './index'

interface AsciiEditorProps {
  initialFrames?: string[]
  width?: number
  height?: number
  onSave?: (frames: string[]) => void
  className?: string
}

export function AsciiEditor({
  initialFrames = [''],
  width = 40,
  height = 20,
  onSave,
  className = '',
}: AsciiEditorProps) {
  const [frames, setFrames] = useState<string[]>(initialFrames)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [clipboard, setClipboard] = useState<string>('')

  const currentFrame = frames[currentFrameIndex] || ''

  const updateCurrentFrame = useCallback(
    (value: string) => {
      const newFrames = [...frames]
      newFrames[currentFrameIndex] = value
      setFrames(newFrames)
    },
    [frames, currentFrameIndex]
  )

  const addFrame = useCallback(() => {
    const newFrames = [...frames, currentFrame]
    setFrames(newFrames)
    setCurrentFrameIndex(newFrames.length - 1)
  }, [frames, currentFrame])

  const duplicateFrame = useCallback(() => {
    const newFrames = [...frames]
    newFrames.splice(currentFrameIndex + 1, 0, currentFrame)
    setFrames(newFrames)
    setCurrentFrameIndex(currentFrameIndex + 1)
  }, [frames, currentFrame, currentFrameIndex])

  const deleteFrame = useCallback(() => {
    if (frames.length <= 1) return
    const newFrames = frames.filter((_, i) => i !== currentFrameIndex)
    setFrames(newFrames)
    setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1))
  }, [frames, currentFrameIndex])

  const copyFrame = useCallback(() => {
    setClipboard(currentFrame)
  }, [currentFrame])

  const pasteFrame = useCallback(() => {
    if (!clipboard) return
    updateCurrentFrame(clipboard)
  }, [clipboard, updateCurrentFrame])

  const clearFrame = useCallback(() => {
    updateCurrentFrame(Array(height).fill(' '.repeat(width)).join('\n'))
  }, [height, width, updateCurrentFrame])

  const insertCharacter = useCallback(
    (char: string) => {
      if (!textareaRef.current) return
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const newValue =
        currentFrame.substring(0, start) + char + currentFrame.substring(end)
      updateCurrentFrame(newValue)

      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + char.length
          textareaRef.current.selectionEnd = start + char.length
          textareaRef.current.focus()
        }
      }, 0)
    },
    [currentFrame, updateCurrentFrame]
  )

  const exportFrames = useCallback(() => {
    const json = JSON.stringify(frames, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ascii-animation.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [frames])

  const importFrames = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        if (Array.isArray(imported)) {
          setFrames(imported)
          setCurrentFrameIndex(0)
        }
      } catch (err) {
        console.error('Failed to import frames:', err)
      }
    }
    reader.readAsText(file)
  }, [])

  const asciiChars = [
    '░',
    '▒',
    '▓',
    '█',
    '▀',
    '▄',
    '■',
    '□',
    '▪',
    '▫',
    '●',
    '○',
    '◐',
    '◑',
    '◒',
    '◓',
    '◔',
    '◕',
    '◖',
    '◗',
    '╔',
    '╗',
    '╚',
    '╝',
    '║',
    '═',
    '╠',
    '╣',
    '╦',
    '╩',
    '┌',
    '┐',
    '└',
    '┘',
    '│',
    '─',
    '├',
    '┤',
    '┬',
    '┴',
    '▲',
    '▼',
    '◄',
    '►',
    '◆',
    '◇',
    '★',
    '☆',
    '♦',
    '♠',
    '·',
    ':',
    ';',
    '=',
    '+',
    '-',
    '*',
    '#',
    '@',
    '~',
    '≈',
    '∿',
    '×',
    '÷',
    '±',
    '≠',
    '≤',
    '≥',
    '∞',
    'Ω',
  ]

  return (
    <div className={`brutalist-card ${className}`}>
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Editor Panel */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2">
            <button className="brutalist-button text-xs" onClick={addFrame}>
              New Frame
            </button>
            <button
              className="brutalist-button text-xs"
              onClick={duplicateFrame}
            >
              Duplicate
            </button>
            <button
              className="brutalist-button text-xs"
              disabled={frames.length <= 1}
              onClick={deleteFrame}
            >
              Delete
            </button>
            <button className="brutalist-button text-xs" onClick={clearFrame}>
              Clear
            </button>
            <button className="brutalist-button text-xs" onClick={copyFrame}>
              Copy
            </button>
            <button
              className="brutalist-button text-xs"
              disabled={!clipboard}
              onClick={pasteFrame}
            >
              Paste
            </button>
            <button className="brutalist-button text-xs" onClick={exportFrames}>
              Export JSON
            </button>
            <label className="brutalist-button cursor-pointer text-xs">
              Import JSON
              <input
                accept=".json"
                className="hidden"
                onChange={importFrames}
                type="file"
              />
            </label>
            {onSave && (
              <button
                className="brutalist-button ml-auto bg-[rgb(var(--accent-1))] text-white text-xs"
                onClick={() => onSave(frames)}
              >
                Save Animation
              </button>
            )}
          </div>

          {/* Frame Navigator */}
          <div className="flex items-center gap-2">
            <button
              className="brutalist-button px-2 py-1 text-sm"
              disabled={currentFrameIndex === 0}
              onClick={() =>
                setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1))
              }
            >
              ←
            </button>
            <span className="font-mono text-[rgb(var(--text-primary))] text-sm">
              Frame {currentFrameIndex + 1} / {frames.length}
            </span>
            <button
              className="brutalist-button px-2 py-1 text-sm"
              disabled={currentFrameIndex === frames.length - 1}
              onClick={() =>
                setCurrentFrameIndex(
                  Math.min(frames.length - 1, currentFrameIndex + 1)
                )
              }
            >
              →
            </button>
            <button
              className="brutalist-button ml-auto text-sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? 'Stop Preview' : 'Preview'}
            </button>
          </div>

          {/* Character Palette */}
          <div className="flex max-h-24 flex-wrap gap-1 overflow-y-auto border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] p-2">
            {asciiChars.map((char, i) => (
              <button
                className="flex h-6 w-6 items-center justify-center border border-[rgb(var(--border))] p-0 font-mono text-sm transition-colors hover:border-[rgb(var(--accent-1))] hover:bg-[rgb(var(--surface-2))]"
                key={i}
                onClick={() => insertCharacter(char)}
                title={`Insert ${char}`}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Text Editor */}
          <textarea
            className="min-h-[300px] flex-1 resize-none border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] p-2 font-mono text-[rgb(var(--text-primary))] text-xs leading-tight focus:border-[rgb(var(--accent-1))] focus:outline-none"
            onChange={(e) => updateCurrentFrame(e.target.value)}
            placeholder={`Enter ASCII art here (${width}×${height} characters)`}
            ref={textareaRef}
            spellCheck={false}
            value={currentFrame}
          />

          {/* Size Info */}
          <div className="font-mono text-[rgb(var(--text-secondary))] text-xs">
            Size: {currentFrame.split('\n')[0]?.length || 0}×
            {currentFrame.split('\n').length}
            (target: {width}×{height})
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex w-full flex-col gap-2 lg:w-96">
          <h3 className="font-bold font-mono text-[rgb(var(--text-primary))] text-sm">
            Preview
          </h3>
          <div className="min-h-[300px] flex-1 overflow-auto border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] p-4">
            {isPlaying ? (
              <AsciiEngine
                fps={12}
                frames={frames}
                loop={true}
                style={{
                  fontSize: '10px',
                  lineHeight: '12px',
                  opacity: 1,
                }}
              />
            ) : (
              <pre className="m-0 font-mono text-[10px] leading-3">
                {currentFrame}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
