'use client'

import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  logsSearchModalOpenAtom,
  logsSearchQueryAtom,
  logsSearchSelectedIndexAtom,
} from '@/atoms/logs-search'
import { TextFade } from '@/components/shared/text-fade'
import { WaterAscii } from '@/components/shared/water-ascii'
import type { ActivityLog } from '@/lib/db'

interface LogsSearchModalProps {
  logs?: ActivityLog[]
}

export function LogsSearchModal({ logs = [] }: LogsSearchModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useAtom(logsSearchModalOpenAtom)
  const [query, setQuery] = useAtom(logsSearchQueryAtom)
  const [selectedIndex, setSelectedIndex] = useAtom(logsSearchSelectedIndexAtom)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile (kept for potential styling tweaks)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const normalizedLogs = useMemo(() => {
    return (logs || []).map((log) => ({
      id: String(log.id),
      date: new Date(log.date as any),
      summary: log.summary || '',
    }))
  }, [logs])

  const filteredLogs = useMemo(() => {
    const q = query.toLowerCase()
    return normalizedLogs.filter((log) => log.summary.toLowerCase().includes(q))
  }, [normalizedLogs, query])

  const handleSelect = useCallback(
    (id: string) => {
      router.push(`/logs/${id}`)
      setIsOpen(false)
      setQuery('')
      setSelectedIndex(0)
    },
    [router, setIsOpen, setQuery, setSelectedIndex]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          setIsOpen(false)
          setQuery('')
          setSelectedIndex(0)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredLogs.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredLogs.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredLogs[selectedIndex]) {
            handleSelect(filteredLogs[selectedIndex].id)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    isOpen,
    selectedIndex,
    filteredLogs,
    setIsOpen,
    setQuery,
    setSelectedIndex,
    handleSelect,
  ])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query, setSelectedIndex])

  const resultsList = (
    <>
      {filteredLogs.length > 0 ? (
        filteredLogs.map((log, index) => (
          <button
            key={log.id}
            onClick={() => handleSelect(log.id)}
            onMouseEnter={() => setSelectedIndex(index)}
            style={{
              width: '100%',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.25rem',
              background:
                index === selectedIndex
                  ? 'rgb(var(--surface-1))'
                  : 'transparent',
              border: 'none',
              borderBottom: '1px solid rgb(var(--border))',
              cursor: 'pointer',
              transition: 'background 0.1s ease',
              fontFamily: 'monospace',
              color: 'rgb(var(--text-primary))',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <TextFade style={{ fontSize: '0.875rem', maxWidth: '80%' }}>
                {log.summary || 'untitled'}
              </TextFade>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'rgb(var(--text-secondary))',
                }}
              >
                {format(log.date, 'LLL d').toLowerCase()}
              </div>
            </div>
          </button>
        ))
      ) : query ? (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: 'rgb(var(--text-secondary))',
          }}
        >
          no logs found
        </div>
      ) : (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: 'rgb(var(--text-secondary))',
          }}
        >
          start typing to search logs
        </div>
      )}
    </>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed z-[100]"
            exit={{ opacity: 1 }}
            initial={{ opacity: 1 }}
            onClick={() => {
              setIsOpen(false)
              setQuery('')
              setSelectedIndex(0)
            }}
            style={{
              background: 'rgb(var(--background-start))',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            transition={{ duration: 0 }}
          >
            {/* top-aligned search UI */}
            <div
              className="relative z-[101] flex h-full w-full flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '768px',
                margin: '0 auto',
                borderLeft: '1px solid rgb(var(--border))',
                borderRight: '1px solid rgb(var(--border))',
              }}
            >
              {/* Mock header to maintain spacing */}
              <div
                style={{
                  borderBottom: '1px solid rgb(var(--border))',
                  padding: '1.5rem 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '2rem',
                  minHeight: '5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem' }} />
                  <h1 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>LOGS</h1>
                </div>
                <div style={{ width: '2.5rem', height: '2.5rem' }} />
              </div>
              
              {/* Search bar section - matches logs page sticky header */}
              <div
                id="logs-search-bar"
                style={{
                  padding: '0.75rem 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderBottom: '1px solid rgb(var(--border))',
                  backgroundColor: 'rgb(var(--background-start))',
                }}
              >
                {/* Search input container that matches the desktop search button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    maxWidth: '420px',
                  }}
                >
                  {/* Back button */}
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                      setSelectedIndex(0)
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2.5rem',
                      height: '2.5rem',
                      background: 'transparent',
                      border: '1px solid rgb(var(--border))',
                      color: 'rgb(var(--text-primary))',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'monospace',
                      padding: 0,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    ←
                  </button>

                  {/* Search input with clear button */}
                  <div
                    style={{
                      position: 'relative',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid rgb(var(--border))',
                      padding: '0 0.75rem',
                      height: '2.5rem',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <input
                      autoFocus
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="search logs…"
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'rgb(var(--text-primary))',
                        paddingRight: query ? '2rem' : '0',
                      }}
                      type="text"
                      value={query}
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.7'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1'
                        }}
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
                          transition: 'opacity 0.2s ease',
                          fontFamily: 'monospace',
                          fontSize: '1rem',
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* Results area */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  position: 'relative',
                }}
              >
                {resultsList}
              </div>
            </div>

            {/* ASCII background animation - behind the content */}
            <div
              className="pointer-events-none absolute"
              style={{
                top: '10rem', // Below mock header and search bar
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                maxWidth: '768px',
                margin: '0 auto',
              }}
            >
              <WaterAscii
                type="matrix"
                fillContainer={true}
                fps={12}
                style={{
                  fontSize: '12px',
                  lineHeight: '14px',
                  opacity: 0.03,
                  color: 'rgb(var(--accent-1))',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  inset: 0,
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
