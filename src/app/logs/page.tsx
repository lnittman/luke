'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useSetAtom } from 'jotai';
import { logsSearchModalOpenAtom } from '@/atoms/logs-search';
import { LogsSearchModal } from '@/components/app/logs/logs-search-modal';
import { RepoPicker } from '@/components/app/logs/repo-picker';
import { DefaultLayout } from '@/components/shared/default-layout';
import { FooterNavigation } from '@/components/shared/footer-navigation';
import { BlockLoader } from '@/components/shared/block-loader';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import styles from '@/components/shared/root.module.scss';
import type { ActivityLog } from '@/lib/db';
import { useIsMobile } from '@/hooks/useIsMobile';
import { WaterAscii } from '@/components/shared/water-ascii';
import { TextFade } from '@/components/shared/text-fade';

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const setLogsSearchModalOpen = useSetAtom(logsSearchModalOpenAtom);
  const isMobile = useIsMobile();
  const searchPlaceholder = useMemo(() => 'search logs…', []);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight || 0);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo]);

  const fetchLogs = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset : 0;
      let url = `/api/logs?limit=10&offset=${currentOffset}`;
      if (selectedRepo) {
        url += `&repoId=${selectedRepo}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      
      // Handle error response
      if (!response.ok || data.error) {
        console.error('Error from API:', data.error || 'Failed to fetch logs');
        setLogs([]);
        setHasMore(false);
        return;
      }
      
      // Handle successful response - ensure logs is an array
      const logsData = data.logs || [];
      
      if (loadMore) {
        setLogs(prev => [...prev, ...logsData]);
      } else {
        setLogs(logsData);
      }
      
      setHasMore(data.hasMore || false);
      setOffset(currentOffset + 10);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

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
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: headerHeight }}>
                <div style={{ position: 'absolute', left: 8, right: 8, bottom: 8, top: 8, opacity: 0.08, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WaterAscii
                    style={{ fontSize: '8px', lineHeight: '8px', width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Page header with search and settings - sticky under main header */}
          <div ref={headerRef} style={{ 
            position: 'sticky',
            top: 0,
            zIndex: 80,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem',
            padding: '0.75rem 24px',
            borderBottom: '1px solid rgb(var(--border))',
            backgroundColor: 'rgb(var(--background-start))'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: isMobile ? 0 : 1 }}>
              {isMobile ? (
                <button
                  onClick={() => setLogsSearchModalOpen(true)}
                  title="Search Logs"
                  aria-label="Search Logs"
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgb(var(--surface-1))';
                    e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.borderColor = 'rgb(var(--border))';
                  }}
                >
                  ⌕
                </button>
              ) : (
                <button
                  onClick={() => setLogsSearchModalOpen(true)}
                  title="Search Logs"
                  aria-label="Search Logs"
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgb(var(--surface-1))';
                  e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgb(var(--border))';
                }}
              >
                <span style={{ opacity: 0.7 }}>{searchPlaceholder}</span>
                <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: '0.75rem' }}>⌘K</span>
                </button>
              )}
              <RepoPicker 
                selectedRepo={selectedRepo}
                onRepoSelect={setSelectedRepo}
                isMobile={isMobile}
              />
            </div>
            {process.env.NODE_ENV === 'development' && (
              <Link 
                href="/logs/settings" 
                title="Settings"
                aria-label="Settings"
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgb(var(--surface-1))';
                  e.currentTarget.style.borderColor = 'rgb(var(--accent-1))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.borderColor = 'rgb(var(--border))';
                }}
              >
                ⚙
              </Link>
            )}
          </div>

          {loading ? (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem 4rem 1rem' }}>
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
                  loading logs...
                </div>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem 4rem 1rem' }}>
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
                  no logs...
                </div>
              </div>
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
                        <TextFade
                          style={{ 
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            color: 'rgb(var(--text-secondary))',
                            lineHeight: 1.5,
                            maxWidth: '100%',
                          }}
                        >
                          {log.summary}
                        </TextFade>
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