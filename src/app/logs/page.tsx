'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import styles from '@/components/page/root.module.scss';
import type { ActivityLog } from '@/lib/db';

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLogs = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset : 0;
      const response = await fetch(`/api/logs?limit=30&offset=${currentOffset}`);
      const data = await response.json();
      
      if (loadMore) {
        setLogs(prev => [...prev, ...data.logs]);
      } else {
        setLogs(data.logs);
      }
      
      setHasMore(data.hasMore);
      setOffset(currentOffset + 30);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={2} />
            <h1>ACTIVITY LOGS</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/logs/settings" style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: 'var(--accent-color)',
              textDecoration: 'none',
              padding: '0.25rem 0.5rem',
              border: '1px solid var(--border-color)',
            }}>
              Settings
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', fontFamily: 'monospace', opacity: 0.5 }}>
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'monospace', opacity: 0.7 }}>
              No activity logs yet. Check back tomorrow!
            </div>
          ) : (
            <>
              {logs.map((log) => (
                <Link key={log.id} href={`/logs/${log.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--surface-color)',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(2px) translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                  }}
                  >
                    {/* Date and Stats */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }}>
                      <strong style={{ color: 'var(--accent-color)' }}>
                        {format(new Date(log.date), 'EEEE, MMMM d, yyyy')}
                      </strong>
                      {log.metadata && (
                        <div style={{ display: 'flex', gap: '1rem', opacity: 0.7 }}>
                          {log.metadata?.totalCommits && log.metadata.totalCommits > 0 && (
                            <span>{log.metadata.totalCommits} commits</span>
                          )}
                          {log.metadata?.totalPullRequests && log.metadata.totalPullRequests > 0 && (
                            <span>{log.metadata.totalPullRequests} PRs</span>
                          )}
                          {log.metadata?.totalIssues && log.metadata.totalIssues > 0 && (
                            <span>{log.metadata.totalIssues} issues</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <p style={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      marginBottom: '0.75rem'
                    }}>
                      {log.summary}
                    </p>

                    {/* Bullets */}
                    {log.bullets && log.bullets.length > 0 && (
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0,
                        margin: 0,
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        opacity: 0.8
                      }}>
                        {log.bullets.slice(0, 3).map((bullet: string, i: number) => (
                          <li key={i} style={{ marginBottom: '0.25rem' }}>
                            → {bullet}
                          </li>
                        ))}
                        {log.bullets.length > 3 && (
                          <li style={{ color: 'var(--accent-color)', marginTop: '0.25rem' }}>
                            + {log.bullets.length - 3} more...
                          </li>
                        )}
                      </ul>
                    )}

                    {/* Language Tags */}
                    {log.metadata?.languages && log.metadata.languages.length > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '0.5rem',
                        marginTop: '0.75rem'
                      }}>
                        {log.metadata.languages.map((lang: string) => (
                          <span
                            key={lang}
                            style={{
                              padding: '0.125rem 0.5rem',
                              backgroundColor: 'var(--surface-2-color)',
                              fontFamily: 'monospace',
                              fontSize: '0.625rem',
                              borderRadius: '2px'
                            }}
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}

              {/* Load More */}
              {hasMore && (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <button
                    onClick={() => fetchLogs(true)}
                    style={{
                      padding: '0.5rem 1.5rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(2px) translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    load more →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.column}>
          <FooterNavigation />
        </div>
      </div>
    </DefaultLayout>
  );
}