'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Link from 'next/link'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { ArtsyAscii } from '@/components/shared/artsy-ascii'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'

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
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [generateMenuOpen, setGenerateMenuOpen] = useState(false)
  const isDev = process.env.NODE_ENV !== 'production'
  const runDailyAnalysis = useMutation(api.functions.mutations.logs.runDailyAnalysisOnce)

  // Convex: fetch logs reactively
  const convexLogs = useQuery(api.functions.queries.logs.get, {
    search: searchQuery || undefined,
    startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
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

  const handleApplyFilters = () => {
    setFiltersOpen(false)
  }

  const handleClearFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    setFiltersOpen(false)
  }

  const handleGenerate = async (date: string) => {
    try {
      const result = await runDailyAnalysis({ date })
      toast.success(
        <div className="font-mono uppercase">
          <div className="text-xs opacity-70">QUEUED DAILY ANALYSIS</div>
          <div className="text-sm">{date}</div>
        </div>,
        {
          style: {
            background: 'rgb(var(--surface-1))',
            border: '1px solid rgb(var(--border))',
            borderLeft: '2px solid rgb(var(--accent-1))',
            borderRadius: '0',
            fontFamily: 'monospace',
          },
        }
      )
      setGenerateMenuOpen(false)
    } catch (error) {
      toast.error('Failed to trigger analysis', {
        style: {
          background: 'rgb(var(--surface-1))',
          border: '1px solid rgb(var(--border))',
          borderLeft: '2px solid rgb(var(--accent-2))',
          borderRadius: '0',
          fontFamily: 'monospace',
        },
      })
    }
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
              {/* Search input */}
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

              {/* Result Count */}
              {!loading && (
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  color: 'rgb(var(--text-secondary))',
                  display: isMobile ? 'none' : 'block',
                }}>
                  {logs.length} {logs.length === 1 ? 'log' : 'logs'}
                  {(dateRange.from || dateRange.to) && ' • filtered'}
                </span>
              )}
              
              {/* Filters Button */}
              {isMobile ? (
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      style={{
                        height: '2.5rem',
                        width: '2.5rem',
                        border: '1px solid rgb(var(--border))',
                        backgroundColor: 'rgba(var(--surface-1), 0.5)',
                        borderRadius: '0',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                      </svg>
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="rounded-none border-t border-[rgb(var(--border))] bg-[rgb(var(--background-start))]"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                  >
                    <SheetHeader>
                      <SheetTitle className="font-mono text-sm uppercase">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <div className="mb-3">
                        <div className="text-xs font-mono uppercase text-[rgb(var(--text-secondary))] mb-3">Date Range</div>
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                          className="rounded-none border border-[rgb(var(--border))]"
                        />
                      </div>
                      <div className="flex gap-2 mb-3">
                        <Button
                          onClick={() => setDateRange({ from: subDays(new Date(), 7), to: new Date() })}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none font-mono text-xs border-[rgb(var(--border))]"
                        >
                          Last 7
                        </Button>
                        <Button
                          onClick={() => setDateRange({ from: subDays(new Date(), 30), to: new Date() })}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none font-mono text-xs border-[rgb(var(--border))]"
                        >
                          Last 30
                        </Button>
                        <Button
                          onClick={() => setDateRange({ from: undefined, to: undefined })}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none font-mono text-xs border-[rgb(var(--border))]"
                        >
                          All
                        </Button>
                      </div>
                    </div>
                    <SheetFooter>
                      <Button
                        onClick={handleClearFilters}
                        variant="outline"
                        className="rounded-none font-mono border-[rgb(var(--border))]"
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={handleApplyFilters}
                        className="rounded-none font-mono bg-[rgb(var(--accent-1))] text-[rgb(var(--background-start))] hover:bg-[rgb(var(--accent-2))]"
                      >
                        Apply
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              ) : (
                <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      style={{
                        height: '2.5rem',
                        width: '2.5rem',
                        border: '1px solid rgb(var(--border))',
                        backgroundColor: 'rgba(var(--surface-1), 0.5)',
                        borderRadius: '0',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                      </svg>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-3 border-[rgb(var(--border))] bg-[rgb(var(--background-start))] rounded-none"
                    align="end"
                  >
                    <div className="space-y-3">
                      <div className="text-xs font-mono uppercase text-[rgb(var(--text-secondary))]">Date Range</div>
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                        className="rounded-none border border-[rgb(var(--border))]"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setDateRange({ from: subDays(new Date(), 7), to: new Date() })}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none font-mono text-xs border-[rgb(var(--border))]"
                        >
                          Last 7
                        </Button>
                        <Button
                          onClick={() => setDateRange({ from: subDays(new Date(), 30), to: new Date() })}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none font-mono text-xs border-[rgb(var(--border))]"
                        >
                          Last 30
                        </Button>
                        <Button
                          onClick={() => setDateRange({ from: undefined, to: undefined })}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none font-mono text-xs border-[rgb(var(--border))]"
                        >
                          All
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleClearFilters}
                          variant="outline"
                          className="flex-1 rounded-none font-mono text-sm border-[rgb(var(--border))]"
                        >
                          Clear
                        </Button>
                        <Button
                          onClick={handleApplyFilters}
                          className="flex-1 rounded-none font-mono text-sm bg-[rgb(var(--accent-1))] text-[rgb(var(--background-start))] hover:bg-[rgb(var(--accent-2))]"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              
              {/* Generate Button (Dev Only) */}
              {isDev && (
                <Popover open={generateMenuOpen} onOpenChange={setGenerateMenuOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      style={{
                        height: '2.5rem',
                        width: '2.5rem',
                        border: '1px solid rgb(var(--border))',
                        backgroundColor: 'rgba(var(--surface-1), 0.5)',
                        borderRadius: '0',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                      </svg>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-56 p-3 border-[rgb(var(--border))] bg-[rgb(var(--background-start))] rounded-none"
                    align="end"
                  >
                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-[rgb(var(--text-secondary))] mb-3">
                        Generate Analysis
                      </div>
                      <Button
                        onClick={() => {
                          const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
                          handleGenerate(yesterday)
                        }}
                        className="w-full justify-start font-mono text-sm border-[rgb(var(--border))] bg-transparent hover:bg-[rgb(var(--surface-1))] hover:border-[rgb(var(--accent-1))] rounded-none"
                        variant="outline"
                      >
                        Yesterday
                      </Button>
                      <Button
                        onClick={() => handleGenerate(format(new Date(), 'yyyy-MM-dd'))}
                        className="w-full justify-start font-mono text-sm border-[rgb(var(--border))] bg-transparent hover:bg-[rgb(var(--surface-1))] hover:border-[rgb(var(--accent-1))] rounded-none"
                        variant="outline"
                      >
                        Today
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
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
                minHeight: 'calc(100vh - 300px)',
                overflow: 'hidden',
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
                  minHeight: 'calc(100vh - 300px)',
                  overflow: 'hidden',
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
