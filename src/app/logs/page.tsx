'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Container, Section } from '@/components/layout';
import { LogGenerator } from '@/components/logs/LogGenerator';
import type { ActivityLog } from '@/lib/db';

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    fetchLogs();
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

  if (loading) {
    return (
      <Container>
        <Section>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse font-mono text-[rgb(var(--text-secondary))]">
              Loading logs...
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-[rgb(var(--border))] pb-6">
            <h1 className="text-4xl font-mono lowercase mb-2">
              activity logs
            </h1>
            <p className="text-[rgb(var(--text-secondary))] font-mono text-sm">
              daily github activity summaries
            </p>
          </div>

          {/* Log Generator */}
          <LogGenerator 
            onComplete={(logId) => {
              // Refresh the logs list
              fetchLogs();
            }}
          />

          {/* Logs Feed */}
          <div className="space-y-6">
            {logs.length === 0 ? (
              <div className="brutalist-card p-8 text-center">
                <p className="font-mono text-[rgb(var(--text-secondary))]">
                  No activity logs yet. Check back tomorrow!
                </p>
              </div>
            ) : (
              logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/logs/${log.id}`}>
                    <div className="brutalist-card hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer">
                      <div className="p-6 space-y-4">
                        {/* Date Header */}
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-mono text-[rgb(var(--accent-1))]">
                            {format(new Date(log.date), 'EEEE, MMMM d, yyyy')}
                          </h2>
                          {log.metadata && (
                            <div className="flex gap-4 text-xs font-mono text-[rgb(var(--text-secondary))]">
                              {log.metadata.totalCommits > 0 && (
                                <span>{log.metadata.totalCommits} commits</span>
                              )}
                              {log.metadata.totalPullRequests > 0 && (
                                <span>{log.metadata.totalPullRequests} PRs</span>
                              )}
                              {log.metadata.totalIssues > 0 && (
                                <span>{log.metadata.totalIssues} issues</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Summary */}
                        <p className="font-mono text-sm leading-relaxed">
                          {log.summary}
                        </p>

                        {/* Bullet Points */}
                        {log.bullets && log.bullets.length > 0 && (
                          <ul className="space-y-2">
                            {log.bullets.slice(0, 3).map((bullet, i) => (
                              <li 
                                key={i} 
                                className="flex items-start gap-2 text-sm font-mono text-[rgb(var(--text-secondary))]"
                              >
                                <span className="text-[rgb(var(--accent-1))] mt-1">→</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                            {log.bullets.length > 3 && (
                              <li className="text-sm font-mono text-[rgb(var(--accent-2))]">
                                + {log.bullets.length - 3} more...
                              </li>
                            )}
                          </ul>
                        )}

                        {/* Metadata Tags */}
                        {log.metadata?.languages && log.metadata.languages.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {log.metadata.languages.map((lang: string) => (
                              <span
                                key={lang}
                                className="px-2 py-1 bg-[rgb(var(--surface-2))] text-xs font-mono rounded"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => fetchLogs(true)}
                className="brutalist-button px-6 py-3"
              >
                <span className="font-mono">load more →</span>
              </button>
            </div>
          )}
        </div>
      </Section>
    </Container>
  );
}