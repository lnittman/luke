'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Link from 'next/link'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { ArtsyAscii } from '@/components/shared/artsy-ascii'
import { useIsMobile } from '@/hooks/useIsMobile'

interface Log {
  id: string
  date: string
  title: string
  summary: string
  haiku: string | null
  bullets: string[]
  totalCommits: number
  totalRepos: number
  productivityScore: number
  version: number
  createdAt: string
}

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)
  const isMobile = useIsMobile()
  const searchPlaceholder = useMemo(() => 'search logs…', [])
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Convex: fetch logs reactively
  const convexLogs = useQuery(api.functions.queries.logs.get, {
    search: searchQuery || undefined,
    limit: 30,
  })

  useEffect(() => {
    if (convexLogs === undefined) {
      setLoading(true)
    } else {
      setLogs(convexLogs as any)
      setLoading(false)
    }
  }, [convexLogs])

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight || 0)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Handle ESC key to clear search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('')
        searchInputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={2} />
            <h1>LOGS</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport} style={{ position: 'relative' }}>
          {/* Always show background ASCII */}
          <div
            style={{ 
              position: 'absolute', 
              inset: 0, 
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: headerHeight,
              }}
            >
              <ArtsyAscii
                type="sparse"
                fillContainer={true}
                fps={10}
                style={{
                  fontSize: '10px',
                  lineHeight: '12px',
                  width: '100%',
                  height: '100%',
                  opacity: 0.2,
                  color: 'rgb(var(--accent-1))',
                }}
              />
            </div>
          </div>
          
          {/* Page header with search - sticky under main header */}
          <div
            ref={headerRef}
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 80,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              padding: '0.75rem 24px',
              borderBottom: '1px solid rgb(var(--border))',
              backgroundColor: 'rgb(var(--background-start))',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                flex: 1,
              }}
            >
              {/* Search input - wider to align with theme switcher */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgb(var(--border))',
                  padding: '0 0.75rem',
                  height: '2.5rem',
                  backgroundColor: 'transparent',
                  position: 'relative',
                }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'rgb(var(--text-primary))',
                  }}
                />
                {searchQuery && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <kbd
                      style={{
                        padding: '0.125rem 0.375rem',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        color: 'rgb(var(--text-secondary))',
                        backgroundColor: 'rgba(var(--surface-1), 0.5)',
                        border: '1px solid rgb(var(--border))',
                        borderRadius: '0',
                        cursor: 'pointer',
                        transition: 'none',
                      }}
                      onClick={() => {
                        setSearchQuery('')
                        searchInputRef.current?.focus()
                      }}
                      title="Clear search (ESC)"
                    >
                      esc
                    </kbd>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Logs content */}
          <div style={{ 
            position: 'relative', 
            zIndex: 10, 
            padding: '0',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: `calc(100vh - ${headerHeight}px - 200px)`, // Account for main header and footer
          }}>
            {loading ? (
              <div style={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}>
                <BlockLoader mode={1} />
              </div>
            ) : logs.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'rgb(var(--text-secondary))',
                }}
              >
                {searchQuery ? 'no results...' : 'no logs yet...'}
              </div>
            ) : (
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {logs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      marginBottom: '2rem',
                      border: '1px solid rgb(var(--border))',
                      backgroundColor: 'rgba(var(--surface-1), 0.5)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {/* Log header */}
                    <div
                      style={{
                        padding: '0.75rem 1.5rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ 
                          fontSize: '1.125rem', 
                          fontFamily: 'monospace',
                          fontWeight: 500,
                        }}>
                          {log.title}
                        </h2>
                        <span style={{
                          fontSize: '1.5rem',
                          color: 'rgb(var(--text-secondary))',
                          transition: 'transform 0.2s',
                          transform: selectedLog?.id === log.id ? 'rotate(90deg)' : 'rotate(0)',
                        }}>
                          →
                        </span>
                      </div>
                    </div>

                    {/* Expanded content */}
                    {selectedLog?.id === log.id && (
                      <div style={{ 
                        padding: '1.5rem',
                        borderTop: '1px solid rgb(var(--border))',
                      }}>
                        {/* Date and version */}
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          marginBottom: '1rem',
                          fontSize: '0.75rem',
                          color: 'rgb(var(--text-secondary))',
                          fontFamily: 'monospace',
                        }}>
                          <time>{formatDate(log.date)}</time>
                          {log.version > 1 && <span>v{log.version}</span>}
                        </div>

                        {/* Haiku */}
                        {log.haiku && (
                          <pre style={{
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            color: 'rgb(var(--accent-2))',
                            margin: '1.5rem 0',
                            fontStyle: 'italic',
                            lineHeight: '1.6',
                          }}>
                            {log.haiku}
                          </pre>
                        )}

                        {/* Summary */}
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'rgb(var(--text-secondary))',
                          lineHeight: '1.5',
                          marginBottom: '1.5rem',
                        }}>
                          {log.summary}
                        </p>

                        {/* Metrics */}
                        <div style={{
                          display: 'flex',
                          gap: '2rem',
                          marginBottom: '1.5rem',
                          fontSize: '0.875rem',
                          fontFamily: 'monospace',
                        }}>
                          <div>
                            <span style={{ color: 'rgb(var(--text-secondary))' }}>commits: </span>
                            <span style={{ color: 'rgb(var(--accent-1))' }}>{log.totalCommits}</span>
                          </div>
                          <div>
                            <span style={{ color: 'rgb(var(--text-secondary))' }}>repos: </span>
                            <span style={{ color: 'rgb(var(--accent-1))' }}>{log.totalRepos}</span>
                          </div>
                          <div>
                            <span style={{ color: 'rgb(var(--text-secondary))' }}>productivity: </span>
                            <span style={{ color: 'rgb(var(--accent-2))' }}>
                              {'█'.repeat(log.productivityScore)}{'░'.repeat(10 - log.productivityScore)}
                            </span>
                          </div>
                        </div>

                        {/* Highlights */}
                        <h3 style={{
                          fontSize: '1rem',
                          marginBottom: '1rem',
                          fontFamily: 'monospace',
                          color: 'rgb(var(--text-primary))',
                        }}>
                          Highlights
                        </h3>
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                        }}>
                          {log.bullets.map((bullet, idx) => (
                            <li key={idx} style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              marginBottom: '0.5rem',
                              fontFamily: 'monospace',
                              color: 'rgb(var(--text-primary))',
                              display: 'flex',
                              alignItems: 'flex-start',
                            }}>
                              <span style={{ 
                                color: 'rgb(var(--accent-1))', 
                                marginRight: '0.5rem',
                                flexShrink: 0,
                              }}>
                                ▸
                              </span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.column}>
          <FooterNavigation />
        </div>
      </div>
    </DefaultLayout>
  )
}
