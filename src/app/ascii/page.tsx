'use client'

import { useState, useRef } from 'react'
import { AsciiEngine } from '@/lib/ascii-engine'
import { generateAsciiArt } from './actions'
import { Send, Download, History, Sparkles, ImageIcon, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
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
    <div className="min-h-screen bg-gradient-to-b from-[rgb(var(--background-start))] to-[rgb(var(--background-end))]">
      {/* Header */}
      <header className="border-b border-[rgb(var(--border))]/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[rgb(var(--accent-1))] to-[rgb(var(--accent-2))]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">ASCII Studio</h1>
              <p className="text-xs text-[rgb(var(--text-secondary))]">AI-powered ASCII art generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2.5 rounded-xl transition-all ${
                showHistory 
                  ? 'bg-[rgb(var(--accent-1))]/10 text-[rgb(var(--accent-1))]' 
                  : 'hover:bg-[rgb(var(--surface-1))]/50'
              }`}
              title="History"
            >
              <History className="w-4 h-4" />
            </button>
            {currentGeneration && (
              <button
                onClick={exportAnimation}
                className="p-2.5 rounded-xl hover:bg-[rgb(var(--surface-1))]/50 transition-all"
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-73px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Display Area */}
          <div className="flex-1 p-8 overflow-auto">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex items-center justify-center h-full"
                >
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--accent-1))] mx-auto mb-4" />
                    <p className="text-sm text-[rgb(var(--text-secondary))]">Generating ASCII art...</p>
                  </div>
                </motion.div>
              ) : currentGeneration ? (
                <motion.div
                  key={currentGeneration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 flex-1 flex flex-col">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{currentGeneration.prompt}</p>
                        <p className="text-xs text-[rgb(var(--text-secondary))]">
                          {currentGeneration.frames.length} frames • {new Date(currentGeneration.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 bg-black/90 rounded-xl p-6 overflow-auto shadow-2xl">
                      {currentGeneration.frames && currentGeneration.frames.length > 0 && (
                        <AsciiEngine
                          frames={currentGeneration.frames}
                          fps={12}
                          loop={true}
                          autoPlay={true}
                          style={{
                            fontSize: '14px',
                            lineHeight: '16px',
                            color: '#00ff00',
                            fontFamily: 'monospace',
                            textShadow: '0 0 5px #00ff00',
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
                  className="flex-1 flex items-center justify-center h-full"
                >
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgb(var(--accent-1))]/20 to-[rgb(var(--accent-2))]/20 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-[rgb(var(--accent-1))]" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Create ASCII Art with AI</h2>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mb-6">
                      Describe what you want to create, and AI will generate unique ASCII animations for you
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setPrompt('Create a matrix rain effect with falling green characters')}
                        className="px-4 py-2 text-xs rounded-xl bg-[rgb(var(--surface-1))]/50 hover:bg-[rgb(var(--surface-1))] transition-all"
                      >
                        Try "Matrix Rain"
                      </button>
                      <button
                        onClick={() => setPrompt('Generate ocean waves with ASCII characters')}
                        className="px-4 py-2 text-xs rounded-xl bg-[rgb(var(--surface-1))]/50 hover:bg-[rgb(var(--surface-1))] transition-all"
                      >
                        Try "Ocean Waves"
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="border-t border-[rgb(var(--border))]/10 p-6">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleGenerate()
                    }
                  }}
                  placeholder="Describe the ASCII art you want to create..."
                  className="w-full px-5 py-4 pr-28 bg-white/5 backdrop-blur-sm rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-1))]/50 placeholder-[rgb(var(--text-secondary))]/50 transition-all"
                  rows={1}
                  style={{
                    minHeight: '56px',
                    maxHeight: '120px',
                  }}
                  disabled={isGenerating}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl hover:bg-white/5 transition-all"
                    title="Upload image"
                    disabled={isGenerating}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[rgb(var(--accent-1))] to-[rgb(var(--accent-2))] text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
        </div>

        {/* History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="border-l border-[rgb(var(--border))]/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
            >
              <div className="p-6 h-full overflow-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Generation History</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {generations.length === 0 ? (
                    <p className="text-sm text-[rgb(var(--text-secondary))]/50 text-center py-8">
                      No generations yet
                    </p>
                  ) : (
                    generations.map((gen) => (
                      <motion.button
                        key={gen.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setCurrentGeneration(gen)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          currentGeneration?.id === gen.id
                            ? 'bg-gradient-to-r from-[rgb(var(--accent-1))]/20 to-[rgb(var(--accent-2))]/20 border border-[rgb(var(--accent-1))]/30'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-sm font-medium truncate mb-1">{gen.prompt}</p>
                        <p className={`text-xs ${
                          currentGeneration?.id === gen.id
                            ? 'text-[rgb(var(--accent-1))]'
                            : 'text-[rgb(var(--text-secondary))]/70'
                        }`}>
                          {new Date(gen.timestamp).toLocaleTimeString()} • {gen.frames.length} frames
                        </p>
                      </motion.button>
                    ))
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}