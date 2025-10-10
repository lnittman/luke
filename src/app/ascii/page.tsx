'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import { AsciiEngine } from '@/lib/ascii'
import { generateAsciiArt } from './actions'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { OpenInAI } from '@/components/shared/open-in-ai'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { useIsMobile } from '@/hooks/use-is-mobile'
import styles from '@/components/shared/root.module.scss'

interface AsciiGeneration {
  id: string
  prompt: string
  frames: string[]
  timestamp: Date
}

export default function AsciiPage() {
  const [prompt, setPrompt] = useState('')
  const [generations, setGenerations] = useState<AsciiGeneration[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return
    
    setIsGenerating(true)
    try {
      const result = await generateAsciiArt(prompt)
      
      const generation: AsciiGeneration = {
        id: crypto.randomUUID(),
        prompt,
        frames: result.frames,
        timestamp: new Date()
      }
      
      setGenerations(prev => [...prev, generation])
      setCurrentIndex(generations.length) // Set to new generation
      setPrompt('')
    } catch (error) {
      console.error('Failed to generate ASCII art:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = async () => {
      setPrompt(`Convert this image to ASCII art: ${file.name}`)
      inputRef.current?.focus()
    }
    reader.readAsDataURL(file)
  }

  const copyToClipboard = () => {
    const current = generations[currentIndex]
    if (current && current.frames.length > 0) {
      navigator.clipboard.writeText(current.frames[0])
    }
  }

  const downloadAscii = () => {
    const current = generations[currentIndex]
    if (current && current.frames.length > 0) {
      const blob = new Blob([current.frames[0]], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ascii-${current.id}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const clearHistory = () => {
    setGenerations([])
    setCurrentIndex(0)
  }

  const currentGeneration = generations[currentIndex] || null

  return (
    <DefaultLayout>
      <style jsx>{`
        /* Custom scrollbar for viewport */
        .ascii-viewport::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .ascii-viewport::-webkit-scrollbar-track {
          background: rgb(var(--surface-1));
          border-radius: 0;
        }
        
        .ascii-viewport::-webkit-scrollbar-thumb {
          background: rgb(var(--border));
          border-radius: 0;
        }
        
        .ascii-viewport::-webkit-scrollbar-thumb:hover {
          background: rgb(var(--accent-1));
        }
        
        .ascii-viewport {
          scrollbar-width: thin;
          scrollbar-color: rgb(var(--border)) rgb(var(--surface-1));
        }
      `}</style>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={8} />
            <h1>ASCII</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <OpenInAI />
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.innerViewport} style={{ position: 'relative' }}>
          
          {/* Sticky prompt bar under header - like logs page */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 80,
              marginBottom: '1.5rem',
              padding: '0.75rem 24px',
              borderBottom: '1px solid rgb(var(--border))',
              backgroundColor: 'rgb(var(--background-start))',
            }}
          >
            {/* Full width input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgb(var(--border))',
                padding: '0 0.75rem',
                height: '2.5rem',
                backgroundColor: 'transparent',
                position: 'relative',
                marginBottom: '0.75rem',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleGenerate()
                  }
                }}
                placeholder="describe the ascii art you want to create..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'rgb(var(--text-primary))',
                }}
                disabled={isGenerating}
              />
              {prompt && (
                <button
                  onClick={() => setPrompt('')}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.5rem',
                    height: '1.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'rgb(var(--text-primary))',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    padding: 0,
                    opacity: 0.7,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.7'
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Control row */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              gap: '0.5rem' 
            }}>
              {/* Left controls */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2rem',
                    background: 'none',
                    border: '1px solid rgb(var(--border))',
                    color: 'rgb(var(--text-primary))',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    opacity: isGenerating ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isGenerating) {
                      e.currentTarget.style.background = 'rgb(var(--surface-1))'
                      e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none'
                    e.currentTarget.style.borderColor = 'rgb(var(--border))'
                  }}
                  title="Upload image"
                >
                  <span style={{ fontSize: isMobile ? '1rem' : '0.75rem' }}>□</span>
                </button>

                {currentGeneration && (
                  <>
                    <button
                      onClick={copyToClipboard}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2rem',
                        background: 'none',
                        border: '1px solid rgb(var(--border))',
                        color: 'rgb(var(--text-primary))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                      title="Copy to clipboard"
                    >
                      <span style={{ fontSize: isMobile ? '1rem' : '0.75rem' }}>{isMobile ? '⊡' : 'CPY'}</span>
                    </button>

                    <button
                      onClick={downloadAscii}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2rem',
                        background: 'none',
                        border: '1px solid rgb(var(--border))',
                        color: 'rgb(var(--text-primary))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                      title="Download ASCII"
                    >
                      <span style={{ fontSize: isMobile ? '1rem' : '0.75rem' }}>{isMobile ? '↓' : 'DL'}</span>
                    </button>
                  </>
                )}

                {generations.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : generations.length - 1))}
                      disabled={generations.length === 0}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2rem',
                        background: 'none',
                        border: '1px solid rgb(var(--border))',
                        color: 'rgb(var(--text-primary))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                      title="Previous"
                    >
                      ←
                    </button>

                    <button
                      onClick={() => setCurrentIndex((prev) => (prev < generations.length - 1 ? prev + 1 : 0))}
                      disabled={generations.length === 0}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2rem',
                        background: 'none',
                        border: '1px solid rgb(var(--border))',
                        color: 'rgb(var(--text-primary))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                      title="Next"
                    >
                      →
                    </button>
                  </>
                )}

                {generations.length > 0 && (
                  <button
                    onClick={clearHistory}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2.5rem',
                      height: '2rem',
                      background: 'none',
                      border: '1px solid rgb(var(--border))',
                      color: 'rgb(var(--text-primary))',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgb(var(--surface-1))'
                      e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none'
                      e.currentTarget.style.borderColor = 'rgb(var(--border))'
                    }}
                    title="Clear history"
                  >
                    <span style={{ fontSize: isMobile ? '1rem' : '0.75rem' }}>{isMobile ? '○' : 'CLR'}</span>
                  </button>
                )}
              </div>

              {/* Right controls */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {generations.length > 0 && (
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: 'rgb(var(--text-secondary))',
                    marginRight: '0.5rem',
                  }}>
                    {currentIndex + 1}/{generations.length}
                  </span>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 1rem',
                    height: '2rem',
                    background: (!prompt.trim() || isGenerating) ? 'none' : 'rgb(var(--accent-1))',
                    border: '1px solid',
                    borderColor: (!prompt.trim() || isGenerating) ? 'rgb(var(--border))' : 'rgb(var(--accent-1))',
                    color: (!prompt.trim() || isGenerating) ? 'rgb(var(--text-secondary))' : 'rgb(var(--background-start))',
                    cursor: (!prompt.trim() || isGenerating) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    opacity: (!prompt.trim() || isGenerating) ? 0.5 : 1,
                    gap: '0.5rem',
                  }}
                  onMouseEnter={(e) => {
                    if (prompt.trim() && !isGenerating) {
                      e.currentTarget.style.opacity = '0.9'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (prompt.trim() && !isGenerating) {
                      e.currentTarget.style.opacity = '1'
                    }
                  }}
                >
                  {isGenerating ? '◌' : '▶'}
                  {!isMobile && <span>{isGenerating ? 'GENERATING' : 'RUN'}</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="ascii-viewport" style={{ padding: '0 24px 24px 24px' }}>
            {isGenerating ? (
              <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontFamily: 'monospace',
                  color: 'rgb(var(--accent-1))',
                  marginBottom: '1rem',
                }}>
                  ◌ ◌ ◌
                </div>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: 'rgb(var(--text-secondary))',
                  fontFamily: 'monospace',
                }}>
                  generating ascii art...
                </p>
              </div>
            ) : currentGeneration ? (
              <div style={{ paddingTop: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    fontFamily: 'monospace', 
                    color: 'rgb(var(--text-secondary))',
                    marginBottom: '0.5rem',
                  }}>
                    PROMPT:
                  </p>
                  <p style={{ 
                    fontSize: '1rem', 
                    fontFamily: 'monospace',
                    color: 'rgb(var(--text-primary))',
                  }}>
                    {currentGeneration.prompt}
                  </p>
                </div>

                <div
                  style={{
                    border: '1px solid rgb(var(--border))',
                    backgroundColor: 'rgb(var(--surface-1))',
                    padding: '1.5rem',
                    overflow: 'auto',
                  }}
                >
                  {currentGeneration.frames && currentGeneration.frames.length > 0 && (
                    <AsciiEngine
                      frames={currentGeneration.frames}
                      fps={12}
                      loop={true}
                      autoPlay={true}
                      style={{
                        fontSize: '12px',
                        lineHeight: '14px',
                        color: 'rgb(var(--accent-1))',
                        fontFamily: 'monospace',
                      }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div style={{ paddingTop: '4rem' }}>
                <div style={{ textAlign: 'center', maxWidth: '32rem', margin: '0 auto' }}>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontFamily: 'monospace', 
                    marginBottom: '1rem',
                    color: 'rgb(var(--text-primary))',
                  }}>
                    ASCII ART GENERATOR
                  </h2>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'rgb(var(--text-secondary))', 
                    marginBottom: '2rem', 
                    fontFamily: 'monospace',
                    lineHeight: '1.5',
                  }}>
                    Create unique ASCII animations with AI. Describe what you want to see, 
                    upload an image, or try one of the examples below.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setPrompt('Matrix rain effect with falling green characters')
                        inputRef.current?.focus()
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.75rem',
                        border: '1px solid rgb(var(--border))',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                    >
                      MATRIX RAIN
                    </button>
                    <button
                      onClick={() => {
                        setPrompt('Ocean waves crashing on a beach')
                        inputRef.current?.focus()
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.75rem',
                        border: '1px solid rgb(var(--border))',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                    >
                      OCEAN WAVES
                    </button>
                    <button
                      onClick={() => {
                        setPrompt('Fire flames dancing and flickering')
                        inputRef.current?.focus()
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.75rem',
                        border: '1px solid rgb(var(--border))',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                    >
                      FIRE DANCE
                    </button>
                    <button
                      onClick={() => {
                        setPrompt('Geometric patterns pulsing and morphing')
                        inputRef.current?.focus()
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.75rem',
                        border: '1px solid rgb(var(--border))',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                    >
                      GEOMETRY
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
