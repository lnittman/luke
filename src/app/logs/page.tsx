'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
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

  // Fetch logs on mount and when search changes
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        params.set('limit', '30')
        
        const response = await fetch(`/api/logs?${params}`)
        const data = await response.json()
        
        if (data.logs) {
          setLogs(data.logs)
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error)
        setLogs([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchLogs, searchQuery ? 300 : 0)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

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
                        borderRadius: '3px',
                        cursor: 'pointer',
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
          <div style={{ position: 'relative', zIndex: 10, padding: '0 24px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <BlockLoader mode={1} />
              </div>
            ) : logs.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: 'rgb(var(--text-secondary))',
                  padding: '4rem 2rem',
                }}
              >
                {searchQuery ? 'no logs found matching your search...' : 'no logs yet...'}
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
                        padding: '1.5rem',
                        borderBottom: '1px solid rgb(var(--border))',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h2 style={{ 
                            fontSize: '1.25rem', 
                            marginBottom: '0.5rem',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                          }}>
                            {log.title}
                          </h2>
                          {log.haiku && (
                            <pre style={{
                              fontFamily: 'monospace',
                              fontSize: '0.875rem',
                              color: 'rgb(var(--accent-2))',
                              margin: '1rem 0',
                              fontStyle: 'italic',
                              lineHeight: '1.6',
                            }}>
                              {log.haiku}
                            </pre>
                          )}
                          <p style={{
                            fontSize: '0.875rem',
                            color: 'rgb(var(--text-secondary))',
                            lineHeight: '1.5',
                            marginTop: '0.5rem',
                          }}>
                            {log.summary}
                          </p>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'flex-end',
                          gap: '0.5rem',
                          minWidth: '150px',
                        }}>
                          <time style={{
                            fontSize: '0.75rem',
                            color: 'rgb(var(--text-secondary))',
                            fontFamily: 'monospace',
                          }}>
                            {formatDate(log.date)}
                          </time>
                          {log.version > 1 && (
                            <span style={{
                              fontSize: '0.75rem',
                              color: 'rgb(var(--accent-1))',
                              fontFamily: 'monospace',
                            }}>
                              v{log.version}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metrics bar */}
                      <div style={{
                        display: 'flex',
                        gap: '2rem',
                        marginTop: '1rem',
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
                    </div>

                    {/* Expanded content */}
                    {selectedLog?.id === log.id && (
                      <div style={{ padding: '1.5rem' }}>
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