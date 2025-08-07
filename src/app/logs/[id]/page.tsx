'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Container, Section } from '@/components/layout';
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
      <Container>
        <Section>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse font-mono text-[rgb(var(--text-secondary))]">
              Loading log details...
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <Section>
          <div className="text-center py-12">
            <p className="font-mono text-[rgb(var(--text-secondary))] mb-4">
              Log not found
            </p>
            <Link href="/logs" className="brutalist-button px-4 py-2">
              ← back to logs
            </Link>
          </div>
        </Section>
      </Container>
    );
  }

  const { log, details } = data;

  // Group details by type
  const commits = details.filter(d => d.type === 'commit');
  const pullRequests = details.filter(d => d.type === 'pr');
  const issues = details.filter(d => d.type === 'issue');
  const reviews = details.filter(d => d.type === 'review');

  return (
    <Container>
      <Section>
        <div className="space-y-8">
          {/* Back Link */}
          <Link 
            href="/logs" 
            className="inline-flex items-center gap-2 font-mono text-sm text-[rgb(var(--accent-1))] hover:underline"
          >
            ← back to logs
          </Link>

          {/* Header */}
          <div className="border-b border-[rgb(var(--border))] pb-6">
            <h1 className="text-3xl font-mono text-[rgb(var(--accent-1))] mb-2">
              {format(new Date(log.date), 'EEEE, MMMM d, yyyy')}
            </h1>
            <p className="font-mono text-sm text-[rgb(var(--text-secondary))]">
              {log.summary}
            </p>
          </div>

          {/* Statistics */}
          {log.metadata && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Commits', value: log.metadata.totalCommits || 0 },
                { label: 'Pull Requests', value: log.metadata.totalPullRequests || 0 },
                { label: 'Issues', value: log.metadata.totalIssues || 0 },
                { label: 'Repositories', value: log.metadata.totalRepos || 0 },
              ].map((stat) => (
                <div key={stat.label} className="brutalist-card p-4">
                  <div className="text-2xl font-mono text-[rgb(var(--accent-2))]">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono text-[rgb(var(--text-secondary))] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Accomplishments */}
          {log.bullets && log.bullets.length > 0 && (
            <div className="brutalist-section">
              <h2 className="text-xl font-mono mb-4 text-[rgb(var(--accent-1))]">
                Key Accomplishments
              </h2>
              <ul className="space-y-3">
                {log.bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-[rgb(var(--accent-2))] font-mono">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-sm">{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Activity Details with Generative UI */}
          {details.length > 0 && (
            <div className="brutalist-section">
              <h2 className="text-xl font-mono mb-4 text-[rgb(var(--accent-1))]">
                Activity Details ({details.length})
              </h2>
              
              {/* Group by type */}
              {commits.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-mono text-sm mb-3 text-[rgb(var(--text-secondary))]">
                    Commits ({commits.length})
                  </h3>
                  <div className="grid gap-3">
                    {commits.map((activity, i) => (
                      <ActivityCard key={activity.id} activity={activity} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {pullRequests.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-mono text-sm mb-3 text-[rgb(var(--text-secondary))]">
                    Pull Requests ({pullRequests.length})
                  </h3>
                  <div className="grid gap-3">
                    {pullRequests.map((activity, i) => (
                      <ActivityCard key={activity.id} activity={activity} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {issues.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-mono text-sm mb-3 text-[rgb(var(--text-secondary))]">
                    Issues ({issues.length})
                  </h3>
                  <div className="grid gap-3">
                    {issues.map((activity, i) => (
                      <ActivityCard key={activity.id} activity={activity} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {reviews.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-mono text-sm mb-3 text-[rgb(var(--text-secondary))]">
                    Reviews ({reviews.length})
                  </h3>
                  <div className="grid gap-3">
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
            <div className="grid md:grid-cols-2 gap-6">
              {log.metadata.languages && log.metadata.languages.length > 0 && (
                <div className="brutalist-section">
                  <h3 className="font-mono text-sm mb-3 text-[rgb(var(--accent-1))]">
                    Languages Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {log.metadata.languages.map((lang: string) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-[rgb(var(--surface-2))] font-mono text-xs rounded"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {log.metadata.topProjects && log.metadata.topProjects.length > 0 && (
                <div className="brutalist-section">
                  <h3 className="font-mono text-sm mb-3 text-[rgb(var(--accent-1))]">
                    Top Projects
                  </h3>
                  <ul className="space-y-2">
                    {log.metadata.topProjects.map((project: string) => (
                      <li key={project} className="font-mono text-xs">
                        → {project}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
    </Container>
  );
}