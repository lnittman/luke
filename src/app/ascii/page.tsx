'use client'

import { useState, useRef, useEffect } from 'react'
import { AsciiEngine } from '@/lib/ascii-engine'
import { generateAsciiArt } from './actions'
import { Send, ImageIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
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
  const [showMiniPreview, setShowMiniPreview] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const navigatePrevious = () => {
    if (generations.length === 0) return
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : generations.length - 1))
  }

  const navigateNext = () => {
    if (generations.length === 0) return
    setCurrentIndex((prev) => (prev < generations.length - 1 ? prev + 1 : 0))
  }

  const currentGeneration = generations[currentIndex] || null

  // Calculate container height
  const [containerHeight, setContainerHeight] = useState('100vh')
  useEffect(() => {
    const updateHeight = () => {
      // Account for header, prompt bar, and footer
      const headerHeight = 80 // Approximate header height
      const promptBarHeight = 60 // Prompt bar height
      const footerHeight = 80 // Footer height
      const availableHeight = window.innerHeight - headerHeight - promptBarHeight - footerHeight
      setContainerHeight(`${availableHeight}px`)
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <DefaultLayout>
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

      {/* Content - No scroll */}
      <div className={styles.content} style={{ overflow: 'hidden' }}>
        <div className={styles.innerViewport} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Fixed prompt bar under header */}
          <div
            style={{
              borderBottom: '1px solid rgb(var(--border))',
              backgroundColor: 'rgb(var(--background-start))',
              padding: '0.75rem 24px',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgb(var(--border))',
                  padding: '0 0.75rem',
                  height: '2.5rem',
                  backgroundColor: 'rgb(var(--surface-1))',
                  position: 'relative',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.7'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.5rem',
                      height: '1.5rem',
                      background: 'none',
                      border: 'none',
                      color: 'rgb(var(--text-secondary))',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                      padding: 0,
                    }}
                    title="upload image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    onMouseEnter={(e) => {
                      if (!isGenerating && prompt.trim()) {
                        e.currentTarget.style.opacity = '0.7'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.5rem',
                      height: '1.5rem',
                      background: 'none',
                      border: 'none',
                      color: isGenerating || !prompt.trim() ? 'rgb(var(--text-secondary))' : 'rgb(var(--accent-1))',
                      cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.2s ease',
                      padding: 0,
                      opacity: isGenerating || !prompt.trim() ? 0.5 : 1,
                    }}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Display Area - Fixed height, no scroll */}
          <div style={{ 
            flex: 1, 
            padding: '24px', 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'rgb(var(--accent-1))' }} />
                    <p style={{ fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
                      generating ascii art...
                    </p>
                  </div>
                </motion.div>
              ) : currentGeneration ? (
                <motion.div
                  key={currentGeneration.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
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
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                        {currentGeneration.prompt}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'rgb(var(--text-secondary))', fontFamily: 'monospace' }}>
                        {currentIndex + 1} of {generations.length} • {currentGeneration.frames.length} frames
                      </p>
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
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgb(var(--surface-1))'
                          e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = 'rgb(var(--border))'
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
                      >
                        try "matrix rain"
                      </button>
                      <button
                        onClick={() => {
                          setPrompt('Generate ocean waves with ASCII characters')
                          inputRef.current?.focus()
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgb(var(--surface-1))'
                          e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = 'rgb(var(--border))'
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
                      >
                        try "ocean waves"
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Custom Footer for ASCII page */}
      <div className={styles.footer}>
        <div className={styles.column}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
          }}>
            {/* Left side - Navigation arrows */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={navigatePrevious}
                disabled={generations.length === 0}
                onMouseEnter={(e) => {
                  if (generations.length > 0) {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))'
                    e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.borderColor = 'rgb(var(--border))'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'none',
                  border: '1px solid rgb(var(--border))',
                  color: generations.length === 0 ? 'rgb(var(--text-secondary))' : 'rgb(var(--text-primary))',
                  cursor: generations.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: generations.length === 0 ? 0.5 : 1,
                  padding: 0,
                }}
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={navigateNext}
                disabled={generations.length === 0}
                onMouseEnter={(e) => {
                  if (generations.length > 0) {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))'
                    e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.borderColor = 'rgb(var(--border))'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'none',
                  border: '1px solid rgb(var(--border))',
                  color: generations.length === 0 ? 'rgb(var(--text-secondary))' : 'rgb(var(--text-primary))',
                  cursor: generations.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: generations.length === 0 ? 0.5 : 1,
                  padding: 0,
                }}
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right side - Mini ASCII preview */}
            <button
              onClick={() => setShowMiniPreview(!showMiniPreview)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgb(var(--border))'
              }}
              style={{
                position: 'relative',
                width: '120px',
                height: '2.5rem',
                border: '1px solid rgb(var(--border))',
                background: 'rgb(var(--surface-1))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="ASCII Preview"
            >
              {currentGeneration && currentGeneration.frames.length > 0 ? (
                <div style={{
                  fontSize: '4px',
                  lineHeight: '4px',
                  color: 'rgb(var(--accent-1))',
                  fontFamily: 'monospace',
                  opacity: 0.8,
                  whiteSpace: 'pre',
                  overflow: 'hidden',
                  textOverflow: 'clip',
                }}>
                  {currentGeneration.frames[0].substring(0, 200)}
                </div>
              ) : (
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.625rem',
                  color: 'rgb(var(--text-secondary))',
                }}>
                  ascii
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}