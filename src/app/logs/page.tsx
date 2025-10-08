'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { BlockLoader } from '@/components/shared/block-loader'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import styles from '@/components/shared/root.module.scss'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { ArtsyAscii } from '@/components/shared/artsy-ascii'
import { Button } from '@/components/ui/button'
import { LogAccordion } from '@/components/app/logs/log-accordion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
  const searchPlaceholder = useMemo(() => 'search logs…', [])
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Convex: fetch logs reactively
  const convexLogs = useQuery(api.app.logs.queries.get, {
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

  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={5} />
            <h1>LOGS</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ThemeSwitcher />
          </div>
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


              {/* Filters Button - Simplified Presets Only */}
              <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    style={{
                      height: '2.5rem',
                      width: '2.5rem',
                      border: '1px solid rgb(var(--border))',
                      backgroundColor: dateRange.from || dateRange.to ? 'rgb(var(--surface-1))' : 'transparent',
                      borderRadius: '0',
                      fontSize: '1.125rem',
                      transition: 'none',
                    }}
                  >
                    ⧉
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 rounded-none !animate-none !transition-none data-[state=open]:!animate-none data-[state=closed]:!animate-none"
                  style={{
                    border: '1px solid rgb(var(--border))',
                    backgroundColor: 'rgb(var(--background-start))',
                    boxShadow: 'none',
                    width: '200px',
                    zIndex: 200,
                  }}
                  align="end"
                  sideOffset={4}
                >
                  <div style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                    <button
                      onClick={() => {
                        setDateRange({ from: subDays(new Date(), 7), to: new Date() })
                        setFiltersOpen(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        border: 'none',
                        borderBottom: '1px solid rgb(var(--border))',
                        backgroundColor: 'transparent',
                        color: 'rgb(var(--text-primary))',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => {
                        setDateRange({ from: subDays(new Date(), 30), to: new Date() })
                        setFiltersOpen(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        border: 'none',
                        borderBottom: '1px solid rgb(var(--border))',
                        backgroundColor: 'transparent',
                        color: 'rgb(var(--text-primary))',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      Last 30 Days
                    </button>
                    <button
                      onClick={() => {
                        setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })
                        setFiltersOpen(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        border: 'none',
                        borderBottom: '1px solid rgb(var(--border))',
                        backgroundColor: 'transparent',
                        color: 'rgb(var(--text-primary))',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      This Month
                    </button>
                    <button
                      onClick={() => {
                        setDateRange({ from: undefined, to: undefined })
                        setFiltersOpen(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'rgb(var(--text-secondary))',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      Clear Filter
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
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
              <div>
                {logs.map((log) => (
                  <LogAccordion key={log.id} log={log as any} />
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
