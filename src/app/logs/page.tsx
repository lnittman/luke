'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useSetAtom } from 'jotai';
import { searchModalOpenAtom } from '@/atoms/search';
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
  const setSearchModalOpen = useSetAtom(searchModalOpenAtom);

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
            <h1>LOGS</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          {/* Page header with search and settings */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgb(var(--border))'
          }}>
            <button
              onClick={() => setSearchModalOpen(true)}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid rgb(var(--text-secondary))',
                backgroundColor: 'transparent',
                color: 'rgb(var(--text-primary))',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              search (⌘k)
            </button>
            <Link href="/logs/settings" style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              border: '1px solid rgb(var(--text-secondary))',
              backgroundColor: 'transparent',
              color: 'rgb(var(--text-primary))',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
              settings
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', fontFamily: 'monospace', opacity: 0.5 }}>
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'monospace', opacity: 0.7 }}>
              No activity logs yet. Check back tomorrow!
            </div>
          ) : (
            <div className="space-y-0" style={{ marginTop: '0' }}>
              {logs.map((log) => (
                <Link key={log.id} href={`/logs/${log.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{
                    padding: '1.5rem 24px',
                    borderBottom: '1px solid rgb(var(--border))',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.opacity = '1';
                  }}
                  >
                    {/* Date and Title Line */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem',
                    }}>
                      <div>
                        <h3 style={{ 
                          fontFamily: 'monospace',
                          fontSize: '1rem',
                          fontWeight: 'normal',
                          marginBottom: '0.25rem',
                          color: 'rgb(var(--text-primary))'
                        }}>
                          {format(new Date(log.date), 'EEEE, MMMM d, yyyy')}
                        </h3>
                        <p style={{ 
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          color: 'rgb(var(--text-secondary))',
                          lineHeight: 1.5,
                        }}>
                          {log.summary}
                        </p>
                      </div>
                      
                      {/* Stats */}
                      {log.metadata && (
                        <div style={{ 
                          display: 'flex', 
                          gap: '1rem', 
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: 'rgb(var(--text-secondary))',
                          flexShrink: 0,
                        }}>
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
                      border: '1px solid rgb(var(--text-secondary))',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(2px) translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'none';
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
  );
}