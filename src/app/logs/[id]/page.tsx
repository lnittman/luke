'use client'

import React, { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { DefaultLayout } from '@/components/shared/default-layout'
import styles from '@/components/shared/root.module.scss'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BlockLoader } from '@/components/shared/block-loader'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'

function formatEU(dateStr?: string) {
  if (!dateStr) return ''
  const p = dateStr.split('-')
  return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : dateStr
}

export default function LogDetailPage() {
  const params = useParams();
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

  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={2} />
            <h1>{formatEU(log?.date)}</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          {!log ? (
            <div style={{ padding: '2rem', fontFamily: 'monospace' }}>loading…</div>
          ) : (
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
                >
                  ←
                </Link>
              </div>
              {/* Summary card */}
              <div style={{ border: '1px solid rgb(var(--border))', marginBottom: '1rem' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgb(var(--border))' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontFamily: 'monospace', fontSize: '1.125rem' }}>{log.title || '(untitled)'}</h2>
                    <span style={{ fontFamily: 'monospace', color: 'rgb(var(--text-secondary))' }}>
                      {(() => {
                        const p = (log.date || '').split('-')
                        return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : log.date
                      })()}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '1rem 1.5rem' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '.9rem', color: 'rgb(var(--text-secondary))' }}>{log.summary}</p>
                </div>
              </div>

              {/* Agent Threads */}
              {log.rawData?.agentThreads && (
                <div style={{ border: '1px solid rgb(var(--border))', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgb(var(--border))' }}>
                    <h3 style={{ fontFamily: 'monospace' }}>Agent Threads</h3>
                  </div>
                  <div style={{ padding: '1rem 1.5rem' }}>
                    <table style={{ width: '100%', fontFamily: 'monospace', fontSize: '.85rem' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left' }}>type</th>
                          <th style={{ textAlign: 'left' }}>repository</th>
                          <th style={{ textAlign: 'left' }}>threadId</th>
                        </tr>
                      </thead>
                      <tbody>
                        {log.rawData.agentThreads.map((t: any, i: number) => (
                          <tr key={i}>
                            <td>{t.type}</td>
                            <td>{t.repository || '-'}</td>
                            <td style={{ wordBreak: 'break-all' }}>{t.threadId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Workflow Events */}
              <div style={{ border: '1px solid rgb(var(--border))' }}>
                <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgb(var(--border))' }}>
                  <h3 style={{ fontFamily: 'monospace' }}>Workflow Events</h3>
                  {!workflowId && (
                    <div style={{ fontFamily: 'monospace', fontSize: '.8rem', color: 'rgb(var(--text-secondary))' }}>
                      No workflowId on this log.
                    </div>
                  )}
                </div>
                <div style={{ padding: '1rem 1.5rem' }}>
                  {!workflowId ? (
                    <div style={{ fontFamily: 'monospace', fontSize: '.9rem' }}>No events.</div>
                  ) : events === undefined ? (
                    <div style={{ fontFamily: 'monospace', fontSize: '.9rem' }}>loading events…</div>
                  ) : events.length === 0 ? (
                    <div style={{ fontFamily: 'monospace', fontSize: '.9rem' }}>no events recorded</div>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {events.map((e: any) => (
                        <li key={e._id} style={{
                          display: 'flex',
                          gap: '1rem',
                          borderBottom: '1px solid rgb(var(--border))',
                          padding: '.5rem 0'
                        }}>
                          <span style={{ fontFamily: 'monospace', color: 'rgb(var(--text-secondary))', minWidth: 150 }}>{e.timestamp}</span>
                          <span style={{ fontFamily: 'monospace', minWidth: 140 }}>{e.type}{e.step ? `:${e.step}` : ''}</span>
                          <span style={{ fontFamily: 'monospace', color: 'rgb(var(--text-secondary))' }}>
                            {e.error ? String(e.error) : e.details ? JSON.stringify(e.details) : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  )
}
