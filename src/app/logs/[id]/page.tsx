'use client'

import React, { Suspense, useMemo, useState, useRef, useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { DefaultLayout } from '@/components/shared/default-layout'
import { FooterNavigation } from '@/components/shared/footer-navigation'
import { OpenInAI } from '@/components/shared/open-in-ai'
import styles from '@/components/shared/root.module.scss'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { TextScramble } from '@/components/ui/text-scramble'
import { CodeBlock } from '@/components/app/logs/CodeBlock'
import { WorkflowEvent } from '@/components/app/logs/WorkflowEvent'
import { BlockLoader } from '@/components/shared/block-loader'

function formatEU(dateStr?: string) {
  if (!dateStr) return ''
  const p = dateStr.split('-')
  return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : dateStr
}

function LogDetailContent() {
  const params = useParams()
  const router = useRouter()
  const logId = (params?.id as string) as any
  const log = useQuery(api.app.logs.logsById.getById, { id: logId }) as any
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const workflowId: string | undefined = useMemo(() => {
    if (!log?.rawData) return undefined
    return log.rawData.workflowId || log.rawData?.workflow?.id
  }, [log])

  const events = useQuery(
    api.workflows.events.listEvents,
    workflowId ? { workflowId } : 'skip'
  ) as any[] | undefined

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

  if (!log) {
    return (
      <div style={{ 
        padding: '2rem 24px', 
        fontFamily: 'monospace',
      }}>
        <TextScramble 
          duration={0.8}
          speed={0.04}
          className="text-[rgb(var(--text-secondary))]"
        >
          fetching log data...
        </TextScramble>
      </div>
    )
  }

  const sectionStyle = {
    width: '100%',
    borderBottom: '1px solid rgb(var(--border))',
  }

  const headerStyle = {
    padding: '1.5rem 24px',
    fontFamily: 'monospace',
    fontSize: '1rem',
    textTransform: 'uppercase' as const,
    color: 'rgb(var(--text-primary))',
  }

  const contentStyle = {
    padding: '0 24px 1.5rem 24px',
    color: 'rgb(var(--text-secondary))',
  }

  return (
    <>
      {/* Search header with back button - sticky under main header */}
      <div
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
          {/* Back button */}
          <Link
            href="/logs"
            aria-label="Back to logs"
            title="Back"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              border: '1px solid rgb(var(--border))',
              color: 'rgb(var(--text-primary))',
              textDecoration: 'none',
              transition: 'none',
              fontFamily: 'monospace',
              fontSize: '1.25rem',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(var(--surface-1))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            ←
          </Link>

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
              placeholder="search logs…"
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

      {/* Content sections */}
      <div className="space-y-0" style={{ marginTop: '0' }}>
        {/* Summary section */}
        <div style={sectionStyle}>
          <div style={headerStyle}>SUMMARY</div>
          <div style={contentStyle}>
            <p style={{ fontFamily: 'monospace', fontSize: '.9rem', margin: 0, lineHeight: 1.6 }}>
              {log.summary}
            </p>
          </div>
        </div>

        {/* Haiku Section */}
        {log.haiku && (
          <div style={sectionStyle}>
            <div style={headerStyle}>HAIKU</div>
            <div style={contentStyle}>
              <pre style={{ 
                fontFamily: 'monospace', 
                fontSize: '.875rem', 
                color: 'rgb(var(--accent-2))', 
                margin: 0, 
                fontStyle: 'italic', 
                lineHeight: 1.6 
              }}>
                {log.haiku}
              </pre>
            </div>
          </div>
        )}

        {/* Metrics */}
        {(log.totalCommits !== undefined || log.totalRepos !== undefined || log.productivityScore !== undefined) && (
          <div style={sectionStyle}>
            <div style={headerStyle}>METRICS</div>
            <div style={contentStyle}>
              <div style={{
                display: 'flex',
                gap: '2rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}>
                {log.totalCommits !== undefined && (
                  <div>
                    <span style={{ color: 'rgb(var(--text-secondary))' }}>commits: </span>
                    <span style={{ color: 'rgb(var(--accent-1))' }}>{log.totalCommits}</span>
                  </div>
                )}
                {log.totalRepos !== undefined && (
                  <div>
                    <span style={{ color: 'rgb(var(--text-secondary))' }}>repos: </span>
                    <span style={{ color: 'rgb(var(--accent-1))' }}>{log.totalRepos}</span>
                  </div>
                )}
                {log.productivityScore !== undefined && (
                  <div>
                    <span style={{ color: 'rgb(var(--text-secondary))' }}>productivity: </span>
                    <span style={{ color: 'rgb(var(--accent-2))' }}>
                      {'█'.repeat(log.productivityScore)}{'░'.repeat(10 - log.productivityScore)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Highlights */}
        {log.bullets?.length > 0 && (
          <div style={sectionStyle}>
            <div style={headerStyle}>HIGHLIGHTS</div>
            <div style={contentStyle}>
              {log.bullets.map((b: string, i: number) => (
                <div key={i} style={{
                  position: 'relative',
                  margin: '0.5rem 0',
                  paddingLeft: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: 'rgb(var(--text-secondary) / 0.5)',
                  }}>→</span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agent Threads */}
        {log.rawData?.agentThreads && log.rawData.agentThreads.length > 0 && (
          <div style={sectionStyle}>
            <div style={headerStyle}>THREADS</div>
            <div style={contentStyle}>
              {log.rawData.agentThreads.map((t: any, i: number) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '0.5rem 0',
                  borderBottom: i < log.rawData.agentThreads.length - 1 ? '1px solid rgb(var(--border))' : 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}>
                  <span style={{ minWidth: '100px', color: 'rgb(var(--accent-1))' }}>{t.type}</span>
                  <span style={{ minWidth: '150px', color: 'rgb(var(--text-secondary))' }}>
                    {t.repository || '-'}
                  </span>
                  <span style={{ 
                    flex: 1, 
                    wordBreak: 'break-all', 
                    color: 'rgb(var(--text-secondary) / 0.7)',
                    fontSize: '0.75rem',
                  }}>
                    {t.threadId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflow Events */}
        <div style={sectionStyle}>
          <div style={headerStyle}>EVENTS</div>
          <div style={contentStyle}>
            {!workflowId ? (
              <div style={{ fontFamily: 'monospace', fontSize: '.9rem', color: 'rgb(var(--text-secondary))' }}>
                No workflow id
              </div>
            ) : events === undefined ? (
              <TextScramble 
                duration={0.8}
                speed={0.04}
                className="text-[rgb(var(--text-secondary))] text-sm"
              >
                loading workflow events...
              </TextScramble>
            ) : events.length === 0 ? (
              <div style={{ fontFamily: 'monospace', fontSize: '.9rem', color: 'rgb(var(--text-secondary))' }}>
                No events recorded
              </div>
            ) : (
              <div style={{
                border: '1px solid rgb(var(--border))',
                overflow: 'hidden',
              }}>
                {events.map((event: any) => (
                  <WorkflowEvent key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Raw Data */}
        {log.rawData && (
          <div style={sectionStyle}>
            <div style={headerStyle}>RAW</div>
            <div style={contentStyle}>
              <CodeBlock 
                code={JSON.stringify(log.rawData, null, 2)} 
                language="json"
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function LogDetailPage() {
  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={2} />
            <Suspense fallback={
              <TextScramble 
                duration={0.6}
                speed={0.03}
                className="text-2xl font-mono"
              >
                loading...
              </TextScramble>
            }>
              <LogHeader />
            </Suspense>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <OpenInAI />
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          <Suspense fallback={
            <div style={{ padding: '2rem 24px', fontFamily: 'monospace' }}>
              <TextScramble 
                duration={0.8}
                speed={0.04}
                className="text-[rgb(var(--text-secondary))]"
              >
                loading log details...
              </TextScramble>
            </div>
          }>
            <LogDetailContent />
          </Suspense>
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

function LogHeader() {
  const params = useParams()
  const logId = (params?.id as string) as any
  const log = useQuery(api.app.logs.logsById.getById, { id: logId }) as any
  
  return <h1>{formatEU(log?.date) || 'LOGS'}</h1>
}