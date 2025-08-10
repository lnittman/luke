'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { RepoPicker } from '@/components/app/logs/repo-picker'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { TextFade } from '@/components/shared/text-fade'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { ArtsyAscii } from '@/components/shared/artsy-ascii'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { ActivityLog } from '@/lib/db'

// Extended type to include repo name from join
type ActivityLogWithRepo = ActivityLog & {
  repo?: string | null
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLogWithRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const isMobile = useIsMobile()
  const searchPlaceholder = useMemo(() => 'search logs…', [])
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

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

  useEffect(() => {
    fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo])

  const fetchLogs = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset : 0
      let url = `/api/logs?limit=10&offset=${currentOffset}`
      if (selectedRepo) {
        url += `&repoId=${selectedRepo}`
      }
      const response = await fetch(url)
      const data = await response.json()

      // Handle error response
      if (!response.ok || data.error) {
        console.error('Error from API:', data.error || 'Failed to fetch logs')
        setLogs([])
        setHasMore(false)
        return
      }

      // Handle successful response - ensure logs is an array
      const logsData = data.logs || []

      if (loadMore) {
        setLogs((prev) => [...prev, ...logsData])
      } else {
        setLogs(logsData)
      }

      setHasMore(data.hasMore)
      setOffset(currentOffset + 10)
    } catch (error) {
      console.error('Error fetching logs:', error)
      setLogs([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs
    const query = searchQuery.toLowerCase()
    return logs.filter(log => 
      log.summary?.toLowerCase().includes(query) ||
      log.repo?.toLowerCase().includes(query)
    )
  }, [logs, searchQuery])

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
          {(loading || logs.length === 0) && (
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
                  type="random"
                  fillContainer={true}
                  fps={12}
                  style={{
                    fontSize: '10px',
                    lineHeight: '12px',
                    width: '100%',
                    height: '100%',
                    opacity: 0.15,
                    color: 'rgb(var(--accent-1))',
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Page header with search and settings - sticky under main header */}
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
              {/* Search input for both desktop and mobile */}
              <div
                style={{
                  flex: 1,
                  maxWidth: isMobile ? '100%' : '420px',
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
                  <button
                    onClick={() => setSearchQuery('')}
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
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              {!isMobile && <RepoPicker selectedRepo={selectedRepo} onRepoSelect={setSelectedRepo} />}
              <Link
                href="/logs/settings"
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.5rem',
                  height: '2.5rem',
                  color: 'rgb(var(--text-primary))',
                  textDecoration: 'none',
                  fontSize: '1.25rem',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                }}
                title="Settings"
              >
                ⚙
              </Link>
            </div>
          </div>

          {/* Logs content */}
          {loading ? (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: 'rgb(var(--text-secondary))',
                zIndex: 10,
              }}
            >
              loading logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: 'rgb(var(--text-secondary))',
                zIndex: 10,
              }}
            >
              {searchQuery ? 'no logs match your search...' : 'no logs...'}
            </div>
          ) : (
            <div style={{ marginTop: 0 }}>
              {filteredLogs.map((log) => (
                <Link
                  key={log.id}
                  href={`/logs/${log.id}`}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div
                    className={styles.row}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgb(var(--surface-1))'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                    style={{
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <div className={styles.column}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <TextFade 
                            style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.5',
                              fontFamily: 'monospace',
                              color: 'rgb(var(--text-primary))',
                            }}
                          >
                            {log.summary || 'No summary'}
                          </TextFade>
                          {log.repo && (
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'rgb(var(--text-secondary))',
                                marginTop: '0.25rem',
                              }}
                            >
                              {log.repo}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'rgb(var(--text-secondary))',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {format(new Date(log.date as any), 'MMM d')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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