'use client'

import { format } from 'date-fns'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { logsSearchModalOpenAtom } from '@/atoms/logs-search'
import { LogsSearchModal } from '@/components/app/logs/logs-search-modal'
import { RepoPicker } from '@/components/app/logs/repo-picker'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { TextFade } from '@/components/shared/text-fade'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { WaterAscii } from '@/components/shared/water-ascii'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { ActivityLog } from '@/lib/db'

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const setLogsSearchModalOpen = useSetAtom(logsSearchModalOpenAtom)
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

  return (
    <DefaultLayout>
      <LogsSearchModal logs={logs} />
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
                  padding: '2rem',
                }}
              >
                <WaterAscii
                  type={loading ? 'rain' : 'ocean'}
                  width={120}
                  height={40}
                  fps={10}
                  style={{
                    fontSize: '10px',
                    lineHeight: '12px',
                    width: '100%',
                    height: '100%',
                    opacity: 0.06,
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
              {isMobile ? (
                <button
                  aria-label="Search Logs"
                  onClick={() => setLogsSearchModalOpen(true)}
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
                  title="Search Logs"
                >
                  ⌕
                </button>
              ) : (
                <button
                  aria-label="Search Logs"
                  onClick={() => setLogsSearchModalOpen(true)}
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
                    gap: '0.5rem',
                    width: '100%',
                    maxWidth: '420px',
                    height: '2.5rem',
                    background: 'transparent',
                    border: '1px solid rgb(var(--border))',
                    color: 'rgb(var(--text-secondary))',
                    cursor: 'text',
                    transition: 'all 0.2s ease',
                    fontFamily: 'monospace',
                    padding: '0 0.75rem',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                  }}
                  title="Search Logs"
                >
                  <span style={{ opacity: 0.7 }}>{searchPlaceholder}</span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      opacity: 0.5,
                      fontSize: '0.75rem',
                    }}
                  >
                    ⌘K
                  </span>
                </button>
              )}
            </div>
            <div
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <RepoPicker
                isMobile={isMobile}
                onRepoSelect={setSelectedRepo}
                selectedRepo={selectedRepo}
              />
              {process.env.NODE_ENV === 'development' && (
                <Link
                  aria-label="Settings"
                  href="/logs/settings"
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
                    textDecoration: 'none',
                  }}
                  title="Settings"
                >
                  ⚙
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem 4rem 1rem',
              }}
            >
              <div
                style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'rgb(var(--text-secondary))',
                  }}
                >
                  loading logs...
                </div>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem 4rem 1rem',
              }}
            >
              <div
                style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'rgb(var(--text-secondary))',
                  }}
                >
                  no logs...
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 0 }}>
              {logs.map((log) => (
                <Link
                  href={`/logs/${log.id}`}
                  key={log.id}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                  }}
                >
                  <div
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.opacity = '0.8'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.opacity = '1'
                    }}
                    style={{
                      minHeight: '7rem',
                      padding: '1rem 24px',
                      borderBottom: '0.5px solid rgb(var(--border))',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Title and content snippet */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: 'rgb(var(--text-primary))',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {log.title ||
                          log.summary?.split('.')[0] ||
                          'daily activity log'}
                      </div>
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: 'rgb(var(--text-secondary))',
                          opacity: 0.7,
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {log.summary || 'No summary available'}
                      </div>
                    </div>

                    {/* Bottom-aligned metadata tiles */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        marginTop: '0.75rem',
                      }}
                    >
                      {/* Date tile */}
                      <div
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'rgb(var(--surface-1))',
                          border: '0.5px solid rgb(var(--border))',
                          fontFamily: 'monospace',
                          fontSize: '0.625rem',
                          color: 'rgb(var(--text-secondary))',
                        }}
                      >
                        {format(new Date(log.date), 'MMM d').toLowerCase()}
                      </div>

                      {/* Stats tiles */}
                      {log.metadata && (
                        <>
                          {log.metadata?.totalCommits !== undefined &&
                            log.metadata.totalCommits > 0 && (
                              <div
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: 'rgb(var(--surface-1))',
                                  border: '0.5px solid rgb(var(--border))',
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  gap: '0.25rem',
                                  fontFamily: 'monospace',
                                  fontSize: '0.625rem',
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    color: 'rgb(var(--accent-1))',
                                  }}
                                >
                                  {log.metadata.totalCommits}
                                </span>
                                <span style={{ opacity: 0.7 }}>commits</span>
                              </div>
                            )}
                          {log.metadata?.totalPullRequests !== undefined &&
                            log.metadata.totalPullRequests > 0 && (
                              <div
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: 'rgb(var(--surface-1))',
                                  border: '0.5px solid rgb(var(--border))',
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  gap: '0.25rem',
                                  fontFamily: 'monospace',
                                  fontSize: '0.625rem',
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    color: 'rgb(var(--accent-1))',
                                  }}
                                >
                                  {log.metadata.totalPullRequests}
                                </span>
                                <span style={{ opacity: 0.7 }}>prs</span>
                              </div>
                            )}
                          {log.metadata?.totalIssues !== undefined &&
                            log.metadata.totalIssues > 0 && (
                              <div
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: 'rgb(var(--surface-1))',
                                  border: '0.5px solid rgb(var(--border))',
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  gap: '0.25rem',
                                  fontFamily: 'monospace',
                                  fontSize: '0.625rem',
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    color: 'rgb(var(--accent-1))',
                                  }}
                                >
                                  {log.metadata.totalIssues}
                                </span>
                                <span style={{ opacity: 0.7 }}>issues</span>
                              </div>
                            )}
                          {log.repositoryId && (
                            <div
                              style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: 'rgb(var(--surface-1))',
                                border: '0.5px solid rgb(var(--border))',
                                fontFamily: 'monospace',
                                fontSize: '0.625rem',
                                color: 'rgb(var(--text-secondary))',
                                opacity: 0.7,
                              }}
                            >
                              repo
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {/* Load More */}
              {hasMore && (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <button
                    onClick={() => fetchLogs(true)}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.transform =
                        'translateX(2px) translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.transform =
                        'none'
                    }}
                    style={{
                      padding: '0.5rem 1.5rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgb(var(--text-secondary))',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease',
                    }}
                  >
                    load more →
                  </button>
                </div>
              )}
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
