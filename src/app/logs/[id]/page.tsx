'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { DefaultLayout } from '@/components/page/DefaultLayout';
import { FooterNavigation } from '@/components/FooterNavigation';
import { BlockLoader } from '@/components/BlockLoader';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import styles from '@/components/page/root.module.scss';
import { ActivityCard } from '@/components/logs/ActivityCard';
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
              <h1>ACTIVITY LOG</h1>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.innerViewport}>
            <div style={{ textAlign: 'center', padding: '2rem 0', fontFamily: 'monospace', opacity: 0.5 }}>
              Loading log details...
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
              <h1>ACTIVITY LOG</h1>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.innerViewport}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontFamily: 'monospace', opacity: 0.7, marginBottom: '1rem' }}>
                Log not found
              </p>
              <Link href="/logs" style={{
                padding: '0.5rem 1rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                border: '1px solid var(--border-color)',
                textDecoration: 'none',
                color: 'inherit',
                display: 'inline-block'
              }}>
                ← back to logs
              </Link>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <BlockLoader mode={2} />
            <h1>ACTIVITY LOG</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.innerViewport}>
          {/* Back Link */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Link 
              href="/logs" 
              style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: 'var(--accent-color)',
                textDecoration: 'none'
              }}
            >
              ← back to logs
            </Link>
          </div>

          {/* Header */}
          <div style={{ 
            borderBottom: '1px solid var(--border-color)', 
            paddingBottom: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ 
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              color: 'var(--accent-color)',
              marginBottom: '0.5rem'
            }}>
              {format(new Date(log.date), 'EEEE, MMMM d, yyyy')}
            </h2>
            <p style={{ 
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              opacity: 0.8
            }}>
              {log.summary}
            </p>
          </div>

          {/* Statistics */}
          {log.metadata && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {[
                { label: 'Commits', value: log.metadata.totalCommits || 0 },
                { label: 'Pull Requests', value: log.metadata.totalPullRequests || 0 },
                { label: 'Issues', value: log.metadata.totalIssues || 0 },
                { label: 'Repositories', value: log.metadata.totalRepos || 0 },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--surface-color)'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontFamily: 'monospace',
                    color: 'var(--accent-color)'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    opacity: 0.7,
                    marginTop: '0.25rem'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Accomplishments */}
          {log.bullets && log.bullets.length > 0 && (
            <div style={{
              padding: '1rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface-color)',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontFamily: 'monospace',
                fontSize: '1rem',
                marginBottom: '1rem',
                color: 'var(--accent-color)'
              }}>
                Key Accomplishments
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {log.bullets.map((bullet: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }}
                  >
                    <span style={{ color: 'var(--accent-color)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Activity Details */}
          {details.length > 0 && (
            <div style={{
              padding: '1rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface-color)',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontFamily: 'monospace',
                fontSize: '1rem',
                marginBottom: '1rem',
                color: 'var(--accent-color)'
              }}>
                Activity Details ({details.length})
              </h3>
              
              {/* Group by type */}
              {commits.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    opacity: 0.7
                  }}>
                    Commits ({commits.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {commits.map((activity, i) => (
                      <ActivityCard key={activity.id} activity={activity} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {pullRequests.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    opacity: 0.7
                  }}>
                    Pull Requests ({pullRequests.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pullRequests.map((activity, i) => (
                      <ActivityCard key={activity.id} activity={activity} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {issues.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    opacity: 0.7
                  }}>
                    Issues ({issues.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {issues.map((activity, i) => (
                      <ActivityCard key={activity.id} activity={activity} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {reviews.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    opacity: 0.7
                  }}>
                    Reviews ({reviews.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {reviews.map((activity, i) => (
                      <ActivityCard key={activity.id} activity={activity} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Languages & Projects */}
          {log.metadata && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {log.metadata.languages && log.metadata.languages.length > 0 && (
                <div style={{
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--surface-color)'
                }}>
                  <h4 style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    color: 'var(--accent-color)'
                  }}>
                    Languages Used
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {log.metadata.languages.map((lang: string) => (
                      <span
                        key={lang}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 'var(--surface-2-color)',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          borderRadius: '2px'
                        }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {log.metadata.topProjects && log.metadata.topProjects.length > 0 && (
                <div style={{
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--surface-color)'
                }}>
                  <h4 style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    color: 'var(--accent-color)'
                  }}>
                    Top Projects
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {log.metadata.topProjects.map((project: string) => (
                      <li key={project} style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        marginBottom: '0.5rem'
                      }}>
                        → {project}
                      </li>
                    ))}
                  </ul>
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