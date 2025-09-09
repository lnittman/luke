'use client'

import React, { Suspense, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { DefaultLayout } from '@/components/shared/default-layout'
import styles from '@/components/shared/root.module.scss'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import { TextScrambleLoader } from '@/components/app/logs/TextScramble'
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
  const logId = (params?.id as string) as any
  const log = useQuery(api.functions.queries.logsById.getById, { id: logId }) as any

  const workflowId: string | undefined = useMemo(() => {
    if (!log?.rawData) return undefined
    return log.rawData.workflowId || log.rawData?.workflow?.id
  }, [log])

  const events = useQuery(
    api.functions.queries.workflowTracking.listEvents,
    workflowId ? { workflowId } : 'skip'
  ) as any[] | undefined

  if (!log) {
    return (
      <div style={{ 
        padding: '2rem', 
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <TextScrambleLoader 
          isLoading={true} 
          loadingText="fetching log data..."
          className="text-[rgb(var(--text-secondary))]"
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>
      {/* Local content heading with back button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 0.75rem 0' }}>
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
      </div>

      {/* Summary card */}
      <div style={{ border: '1px solid rgb(var(--border))', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgb(var(--border))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextScrambleLoader 
              text={log.title || '(untitled)'}
              isLoading={false}
              className="font-mono text-lg"
            />
            <span style={{ fontFamily: 'monospace', color: 'rgb(var(--text-secondary))' }}>
              {formatEU(log.date)}
            </span>
          </div>
        </div>
        <div style={{ padding: '1rem 1.5rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '.9rem', color: 'rgb(var(--text-secondary))' }}>
            {log.summary}
          </p>
        </div>
      </div>

      {/* Haiku Section */}
      {log.haiku && (
        <div style={{ border: '1px solid rgb(var(--border))', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgb(var(--border))' }}>
            <h3 style={{ fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase' }}>Haiku</h3>
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
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
      {(log.totalCommits || log.totalRepos || log.productivityScore) && (
        <div style={{ border: '1px solid rgb(var(--border))', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgb(var(--border))' }}>
            <h3 style={{ fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase' }}>Metrics</h3>
          </div>
          <div style={{ 
            padding: '1rem 1.5rem',
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
      )}

      {/* Highlights */}
      {log.bullets?.length > 0 && (
        <div style={{ border: '1px solid rgb(var(--border))', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgb(var(--border))' }}>
            <h3 style={{ fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase' }}>Highlights</h3>
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {log.bullets.map((b: string, i: number) => (
                <li key={i} style={{
                  position: 'relative',
                  margin: '0.5rem 0',
                  paddingLeft: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'rgb(var(--text-secondary))',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: 'rgb(var(--text-secondary) / 0.5)',
                  }}>→</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Agent Threads */}
      {log.rawData?.agentThreads && log.rawData.agentThreads.length > 0 && (
        <div style={{ border: '1px solid rgb(var(--border))', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgb(var(--border))' }}>
            <h3 style={{ fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase' }}>Agent Threads</h3>
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
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

      {/* Raw Data */}
      {log.rawData && (
        <div style={{ border: '1px solid rgb(var(--border))', marginBottom: '1rem' }}>
          <details>
            <summary style={{
              padding: '0.75rem 1.5rem',
              borderBottom: '1px solid rgb(var(--border))',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              listStyle: 'none',
            }}>
              Raw Data
            </summary>
            <div style={{ padding: '1rem' }}>
              <CodeBlock 
                code={JSON.stringify(log.rawData, null, 2)} 
                language="json"
              />
            </div>
          </details>
        </div>
      )}

      {/* Workflow Events */}
      <div style={{ border: '1px solid rgb(var(--border))' }}>
        <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgb(var(--border))' }}>
          <h3 style={{ fontFamily: 'monospace', fontSize: '0.875rem', textTransform: 'uppercase' }}>
            Workflow Events
          </h3>
          {!workflowId && (
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '.8rem', 
              color: 'rgb(var(--text-secondary))',
              marginTop: '0.25rem' 
            }}>
              No workflowId on this log
            </div>
          )}
        </div>
        <div style={{ padding: '1rem 1.5rem' }}>
          {!workflowId ? (
            <div style={{ fontFamily: 'monospace', fontSize: '.9rem', color: 'rgb(var(--text-secondary))' }}>
              No events
            </div>
          ) : events === undefined ? (
            <TextScrambleLoader 
              isLoading={true} 
              loadingText="loading workflow events..."
              className="text-[rgb(var(--text-secondary))] text-sm"
            />
          ) : events.length === 0 ? (
            <div style={{ fontFamily: 'monospace', fontSize: '.9rem', color: 'rgb(var(--text-secondary))' }}>
              No events recorded
            </div>
          ) : (
            <div>
              {events.map((event: any) => (
                <WorkflowEvent key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
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
              <TextScrambleLoader 
                isLoading={true} 
                loadingText="loading..."
                className="text-2xl font-mono"
              />
            }>
              <LogHeader />
            </Suspense>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          <Suspense fallback={
            <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
              <TextScrambleLoader 
                isLoading={true} 
                loadingText="loading log details..."
                className="text-[rgb(var(--text-secondary))]"
              />
            </div>
          }>
            <LogDetailContent />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  )
}

function LogHeader() {
  const params = useParams()
  const logId = (params?.id as string) as any
  const log = useQuery(api.functions.queries.logsById.getById, { id: logId }) as any
  
  return <h1>{formatEU(log?.date) || 'LOGS'}</h1>
}