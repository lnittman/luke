'use client'

import { useState, useRef, useEffect } from 'react'
import { AsciiEngine } from '@/lib/ascii-engine'
import { generateAsciiArt } from './actions'
import { Send, ImageIcon, Loader2, Settings, Sparkles, Copy, Download } from 'lucide-react'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
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
  const [showSettings, setShowSettings] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

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
    
    // Convert image to base64 and generate ASCII from it
    const reader = new FileReader()
    reader.onload = async () => {
      setPrompt(`Convert this image to ASCII art: ${file.name}`)
      handleGenerate()
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

        /* Preview carousel fade edges */
        .carousel-container::before,
        .carousel-container::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 40px;
          z-index: 2;
          pointer-events: none;
        }
        
        .carousel-container::before {
          left: 0;
          background: linear-gradient(to right, rgb(var(--background-start)), transparent);
        }
        
        .carousel-container::after {
          right: 0;
          background: linear-gradient(to left, rgb(var(--background-start)), transparent);
        }
      `}</style>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={8} />
            <h1>ASCII</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Content */}
      <div className={styles.content} style={{ overflow: 'hidden' }}>
        <div className={styles.innerViewport} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Display Area with custom scrollbar */}
          <div 
            ref={viewportRef}
            className="ascii-viewport"
            style={{ 
              flex: 1,
              padding: '24px',
              overflow: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {isGenerating ? (
              <div style={{ textAlign: 'center' }}>
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'rgb(var(--accent-1))' }} />
                <p style={{ fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
                  generating ascii art...
                </p>
              </div>
            ) : currentGeneration ? (
              <div
                style={{
                  border: '1px solid rgb(var(--border))',
                  backgroundColor: 'rgb(var(--surface-1))',
                  padding: '1.5rem',
                  maxWidth: '90%',
                  maxHeight: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem' 
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                      {currentGeneration.prompt}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'rgb(var(--text-secondary))', fontFamily: 'monospace' }}>
                      {currentIndex + 1} of {generations.length} • {currentGeneration.frames.length} frames
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={copyToClipboard}
                      style={{
                        padding: '0.5rem',
                        background: 'transparent',
                        border: '1px solid rgb(var(--border))',
                        color: 'rgb(var(--text-primary))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                      title="Copy ASCII"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadAscii}
                      style={{
                        padding: '0.5rem',
                        background: 'transparent',
                        border: '1px solid rgb(var(--border))',
                        color: 'rgb(var(--text-primary))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgb(var(--surface-1))'
                        e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'rgb(var(--border))'
                      }}
                      title="Download ASCII"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: 'rgb(var(--background-start))',
                    border: '1px solid rgb(var(--border))',
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
              <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                  create ascii art with ai
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'rgb(var(--text-secondary))', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
                  describe what you want to create, and ai will generate unique ascii animations for you
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setPrompt('Create a matrix rain effect with falling green characters')
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
                    try "matrix rain"
                  </button>
                  <button
                    onClick={() => {
                      setPrompt('Generate ocean waves with ASCII characters')
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
                    try "ocean waves"
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fixed bottom prompt bar and controls */}
          <div
            style={{
              borderTop: '1px solid rgb(var(--border))',
              backgroundColor: 'rgb(var(--background-start))',
              padding: '1rem 24px',
              flexShrink: 0,
            }}
          >
            {/* Full width prompt input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgb(var(--border))',
                backgroundColor: 'rgb(var(--surface-1))',
                marginBottom: '0.75rem',
              }}
            >
              <input
                ref={inputRef}
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
                  flex: 1,
                  padding: '0.75rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'rgb(var(--text-primary))',
                }}
                disabled={isGenerating}
              />
            </div>

            {/* Control row with buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              {/* Left side controls */}
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
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: '1px solid rgb(var(--border))',
                    color: 'rgb(var(--text-primary))',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    opacity: isGenerating ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isGenerating) {
                      e.currentTarget.style.background = 'rgb(var(--surface-1))'
                      e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgb(var(--border))'
                  }}
                  title="Upload image"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Image</span>
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: showSettings ? 'rgb(var(--surface-1))' : 'transparent',
                    border: '1px solid',
                    borderColor: showSettings ? 'rgb(var(--accent-1))' : 'rgb(var(--border))',
                    color: 'rgb(var(--text-primary))',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))'
                    e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                  }}
                  onMouseLeave={(e) => {
                    if (!showSettings) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'rgb(var(--border))'
                    }
                  }}
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    border: '1px solid rgb(var(--border))',
                    color: 'rgb(var(--text-primary))',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))'
                    e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgb(var(--border))'
                  }}
                  title="AI Model"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>GPT-4</span>
                </button>
              </div>

              {/* Right side - submit button and preview carousel */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {/* Preview carousel */}
                {generations.length > 0 && (
                  <div 
                    className="carousel-container"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      gap: '0.5rem',
                      maxWidth: '300px',
                      overflow: 'hidden',
                      padding: '0 40px',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      transition: 'transform 0.3s ease',
                      transform: `translateX(-${currentIndex * 56}px)`,
                    }}>
                      {generations.map((gen, idx) => (
                        <button
                          key={gen.id}
                          onClick={() => setCurrentIndex(idx)}
                          style={{
                            flexShrink: 0,
                            width: '48px',
                            height: '48px',
                            border: '1px solid',
                            borderColor: idx === currentIndex ? 'rgb(var(--accent-1))' : 'rgb(var(--border))',
                            background: idx === currentIndex ? 'rgb(var(--surface-1))' : 'rgb(var(--background-start))',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            overflow: 'hidden',
                            padding: '2px',
                            position: 'relative',
                          }}
                          onMouseEnter={(e) => {
                            if (idx !== currentIndex) {
                              e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                              e.currentTarget.style.opacity = '0.8'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (idx !== currentIndex) {
                              e.currentTarget.style.borderColor = 'rgb(var(--border))'
                              e.currentTarget.style.opacity = '1'
                            }
                          }}
                          title={gen.prompt}
                        >
                          <div style={{
                            fontSize: '2px',
                            lineHeight: '2px',
                            color: 'rgb(var(--accent-1))',
                            fontFamily: 'monospace',
                            opacity: 0.6,
                            whiteSpace: 'pre',
                            overflow: 'hidden',
                            textOverflow: 'clip',
                          }}>
                            {gen.frames[0]?.substring(0, 100) || ''}
                          </div>
                          {idx === currentIndex && (
                            <div style={{
                              position: 'absolute',
                              bottom: '2px',
                              right: '2px',
                              width: '4px',
                              height: '4px',
                              background: 'rgb(var(--accent-1))',
                              borderRadius: '50%',
                            }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: !prompt.trim() || isGenerating ? 'transparent' : 'rgb(var(--accent-1))',
                    border: '1px solid',
                    borderColor: !prompt.trim() || isGenerating ? 'rgb(var(--border))' : 'rgb(var(--accent-1))',
                    color: !prompt.trim() || isGenerating ? 'rgb(var(--text-secondary))' : 'rgb(var(--background-start))',
                    cursor: !prompt.trim() || isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    opacity: !prompt.trim() || isGenerating ? 0.5 : 1,
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
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}