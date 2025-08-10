'use client'

import { useState, useRef } from 'react'
import { AsciiEngine } from '@/lib/ascii-engine'
import { generateAsciiArt } from './actions'
import { Send, Download, Sparkles, ImageIcon, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/shadcn/sheet'
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
  const [currentGeneration, setCurrentGeneration] = useState<AsciiGeneration | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
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
      
      setGenerations(prev => [generation, ...prev])
      setCurrentGeneration(generation)
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
      // In production, you'd send the base64 to the API
      handleGenerate()
    }
    reader.readAsDataURL(file)
  }

  const exportAnimation = () => {
    if (!currentGeneration) return
    
    const json = JSON.stringify(currentGeneration.frames, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ascii-art-${currentGeneration.id.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

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

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.innerViewport} style={{ position: 'relative' }}>
          {/* Fixed prompt bar under header */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 80,
              borderBottom: '1px solid rgb(var(--border))',
              backgroundColor: 'rgb(var(--background-start))',
              padding: '0.75rem 24px',
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
              <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
                <SheetTrigger asChild>
                  <button
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgb(var(--surface-1))'
                      e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
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
                      color: 'rgb(var(--text-primary))',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'monospace',
                      padding: 0,
                      fontSize: '1rem',
                    }}
                    title="history"
                  >
                    ⟲
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>generation history</SheetTitle>
                  </SheetHeader>
                  <div style={{ marginTop: '1.5rem', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                    {generations.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '3rem 1rem',
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          color: 'rgb(var(--text-secondary))',
                        }}
                      >
                        no generations yet
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {generations.map((gen) => (
                          <button
                            key={gen.id}
                            onClick={() => {
                              setCurrentGeneration(gen)
                              setHistoryOpen(false)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgb(var(--surface-1))'
                              e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = currentGeneration?.id === gen.id ? 'rgb(var(--surface-1))' : 'transparent'
                              e.currentTarget.style.borderColor = currentGeneration?.id === gen.id ? 'rgb(var(--accent-1))' : 'rgb(var(--border))'
                            }}
                            style={{
                              width: '100%',
                              padding: '1rem',
                              textAlign: 'left',
                              border: `1px solid ${
                                currentGeneration?.id === gen.id
                                  ? 'rgb(var(--accent-1))'
                                  : 'rgb(var(--border))'
                              }`,
                              background: currentGeneration?.id === gen.id ? 'rgb(var(--surface-1))' : 'transparent',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontFamily: 'monospace',
                            }}
                          >
                            <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                              {gen.prompt}
                            </div>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'rgb(var(--text-secondary))',
                              }}
                            >
                              {new Date(gen.timestamp).toLocaleTimeString()} • {gen.frames.length} frames
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              {currentGeneration && (
                <button
                  onClick={exportAnimation}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))'
                    e.currentTarget.style.borderColor = 'rgb(var(--accent-1))'
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
                    color: 'rgb(var(--text-primary))',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace',
                    padding: 0,
                    fontSize: '1rem',
                  }}
                  title="export"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Display Area */}
          <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div
                    style={{
                      border: '1px solid rgb(var(--border))',
                      backgroundColor: 'rgb(var(--surface-1))',
                      padding: '1.5rem',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                        {currentGeneration.prompt}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'rgb(var(--text-secondary))', fontFamily: 'monospace' }}>
                        {currentGeneration.frames.length} frames • {new Date(currentGeneration.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div
                      style={{
                        flex: 1,
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
                    height: '100%',
                  }}
                >
                  <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
                    <div
                      style={{
                        width: '4rem',
                        height: '4rem',
                        border: '1px solid rgb(var(--border))',
                        backgroundColor: 'rgb(var(--surface-1))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                      }}
                    >
                      <Sparkles className="w-8 h-8" style={{ color: 'rgb(var(--accent-1))' }} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                      create ascii art with ai
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'rgb(var(--text-secondary))', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
                      describe what you want to create, and ai will generate unique ascii animations for you
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => setPrompt('Create a matrix rain effect with falling green characters')}
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
                        onClick={() => setPrompt('Generate ocean waves with ASCII characters')}
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

      {/* No footer for ASCII page */}
    </DefaultLayout>
  )
}