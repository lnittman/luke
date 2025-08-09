'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { DefaultLayout } from '@/components/shared/default-layout';
import { FooterNavigation } from '@/components/shared/footer-navigation';
import { BlockLoader } from '@/components/shared/block-loader';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import styles from '@/components/shared/root.module.scss';
import { ActivityCard } from '@/components/app/logs/activity-card';
import type { ActivityLog, ActivityDetail } from '@/lib/db';

interface LogData {
  log: ActivityLog;
  details: ActivityDetail[];
}

export default function LogDetailPage() {
  const params = useParams();
  const [data, setData] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchLogDetails(params.id as string);
    }
  }, [params.id]);

  const fetchLogDetails = async (id: string) => {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching log details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className={styles.header}>
          <div className={styles.column}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BlockLoader mode={2} />
              <h1>LOG</h1>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.innerViewport}>
            <div style={{ textAlign: 'center', padding: '2rem 0', fontFamily: 'monospace', opacity: 0.5 }}>
              loading log details...
            </div>
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

  if (!data) {
    return (
      <DefaultLayout>
        <div className={styles.header}>
          <div className={styles.column}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BlockLoader mode={2} />
              <h1>LOG</h1>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.innerViewport} style={{ position: 'relative' }}>
            <div style={{ 
              position: 'sticky',
              top: 0,
              zIndex: 80,
              marginBottom: '1.5rem',
              padding: '0.75rem 24px',
              borderBottom: '1px solid rgb(var(--border))',
              backgroundColor: 'rgb(var(--background-start))'
            }}>
              <Link 
                href="/logs" 
                title="Back to logs"
                aria-label="Back to logs"
                style={{
                  display: 'inline-flex',
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
                ←
              </Link>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontFamily: 'monospace', opacity: 0.7 }}>
                log not found
              </p>
            </div>
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

  const { log, details } = data;

  // Group details by type
  const commits = details.filter(d => d.type === 'commit');
  const pullRequests = details.filter(d => d.type === 'pr');
  const issues = details.filter(d => d.type === 'issue');
  const reviews = details.filter(d => d.type === 'review');

  return (
    <DefaultLayout>
      <div className={styles.header}>
        <div className={styles.column}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BlockLoader mode={2} />
              <h1>{format(new Date(log.date), 'MMMM d, yyyy').toUpperCase()}</h1>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport} style={{ position: 'relative' }}>
          {/* Back button - sticky under main header */}
          <div style={{ 
            position: 'sticky',
            top: 0,
            zIndex: 80,
            marginBottom: '1.5rem',
            padding: '0.75rem 24px',
            borderBottom: '1px solid rgb(var(--border))',
            backgroundColor: 'rgb(var(--background-start))'
          }}>
            <Link 
              href="/logs" 
              title="Back to logs"
              aria-label="Back to logs"
              style={{
                display: 'inline-flex',
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
              ←
            </Link>
          </div>

          {/* Summary Section */}
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>SUMMARY</h2>
              <p style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'rgb(var(--text-secondary))'
              }}>
                {log.summary}
              </p>
            </div>
          </div>

          {/* Statistics - Bottom left aligned slate tiles */}
          {log.metadata && (
            <div className={styles.row}>
              <div className={styles.column}>
                <div style={{ 
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-end',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}>
                  {log.metadata.totalCommits !== undefined && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgb(var(--surface-1))',
                      border: '1px solid rgb(var(--border))',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'rgb(var(--accent-1))' }}>
                        {log.metadata.totalCommits}
                      </span>
                      <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>commits</span>
                    </div>
                  )}
                  {log.metadata.totalPullRequests !== undefined && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgb(var(--surface-1))',
                      border: '1px solid rgb(var(--border))',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'rgb(var(--accent-1))' }}>
                        {log.metadata.totalPullRequests}
                      </span>
                      <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>PRs</span>
                    </div>
                  )}
                  {log.metadata.totalIssues !== undefined && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgb(var(--surface-1))',
                      border: '1px solid rgb(var(--border))',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'rgb(var(--accent-1))' }}>
                        {log.metadata.totalIssues}
                      </span>
                      <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>issues</span>
                    </div>
                  )}
                  {log.metadata.totalRepos !== undefined && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgb(var(--surface-1))',
                      border: '1px solid rgb(var(--border))',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'rgb(var(--accent-1))' }}>
                        {log.metadata.totalRepos}
                      </span>
                      <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>repos</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Key Accomplishments */}
          {log.bullets && log.bullets.length > 0 && (
            <div className={styles.row}>
              <div className={styles.column}>
                <h2>KEY ACCOMPLISHMENTS</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {log.bullets.map((bullet: string, i: number) => (
                    <li
                      key={i}
                      style={{
                        marginBottom: '0.5rem',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'rgb(var(--text-secondary))'
                      }}
                    >
                      → {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          )}

          {/* Activity Details */}
          {details.length > 0 && (
            <>
              <div className={styles.row} style={{ paddingBottom: '0', borderBottom: '1px solid rgb(var(--border))' }}>
                <div className={styles.column}>
                  <h2 style={{ marginBottom: '0' }}>ACTIVITY DETAILS</h2>
                </div>
              </div>
              
              {/* Commits */}
              {commits.length > 0 && (
                <div className={styles.row}>
                  <div className={styles.column}>
                    <h3>Commits ({commits.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {commits.map((activity, i) => (
                        <ActivityCard key={activity.id} activity={activity} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pull Requests */}
              {pullRequests.length > 0 && (
                <div className={styles.row}>
                  <div className={styles.column}>
                    <h3>Pull Requests ({pullRequests.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {pullRequests.map((activity, i) => (
                        <ActivityCard key={activity.id} activity={activity} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Issues */}
              {issues.length > 0 && (
                <div className={styles.row}>
                  <div className={styles.column}>
                    <h3>Issues ({issues.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {issues.map((activity, i) => (
                        <ActivityCard key={activity.id} activity={activity} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <div className={styles.row}>
                  <div className={styles.column}>
                    <h3>Reviews ({reviews.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {reviews.map((activity, i) => (
                        <ActivityCard key={activity.id} activity={activity} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Languages */}
          {log.metadata && log.metadata.languages && log.metadata.languages.length > 0 && (
            <div className={styles.row}>
              <div className={styles.column}>
                <h2>LANGUAGES</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {log.metadata.languages.map((lang: string) => (
                    <span
                      key={lang}
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'rgb(var(--text-secondary))'
                      }}
                    >
                      {lang}
                    </span>
                  )).reduce((prev: any, curr: any, i: number) => 
                    i === 0 ? [curr] : [...prev, ', ', curr], []
                  )}
                </div>
              </div>
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