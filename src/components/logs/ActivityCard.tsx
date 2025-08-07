'use client';

import React from 'react';
import type { ActivityDetail } from '@/lib/db';

interface ActivityCardProps {
  activity: ActivityDetail;
  index: number;
}

// Commit Card Component
function CommitCard({ activity }: { activity: ActivityDetail }) {
  const metadata = activity.metadata as any;
  
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--surface-color)',
      transition: 'transform 0.1s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateX(2px) translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem' }}>💾</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontFamily: 'monospace', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            {activity.title}
          </h4>
          {metadata?.stats && (
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontFamily: 'monospace', opacity: 0.7 }}>
              <span style={{ color: '#10b981' }}>+{metadata.stats.additions || 0}</span>
              <span style={{ color: '#ef4444' }}>-{metadata.stats.deletions || 0}</span>
              <span>{metadata.stats.total || 0} changes</span>
            </div>
          )}
          {metadata?.files && metadata.files.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontFamily: 'monospace', opacity: 0.6 }}>
              {metadata.files.slice(0, 3).map((file: any, i: number) => (
                <div key={i}>→ {file.filename}</div>
              ))}
              {metadata.files.length > 3 && (
                <div>+ {metadata.files.length - 3} more files</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Pull Request Card Component
function PullRequestCard({ activity }: { activity: ActivityDetail }) {
  const metadata = activity.metadata as any;
  const state = metadata?.state || 'open';
  const merged = metadata?.merged;
  
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--surface-color)',
      transition: 'transform 0.1s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateX(2px) translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem' }}>
          {merged ? '🎯' : state === 'open' ? '🔄' : '✅'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h4 style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {activity.title}
            </h4>
            <span style={{
              padding: '0.125rem 0.5rem',
              fontSize: '0.625rem',
              fontFamily: 'monospace',
              borderRadius: '2px',
              backgroundColor: merged ? 'rgba(168, 85, 247, 0.2)' :
                            state === 'open' ? 'rgba(34, 197, 94, 0.2)' :
                            'rgba(107, 114, 128, 0.2)',
              color: merged ? '#a855f7' :
                     state === 'open' ? '#22c55e' :
                     '#6b7280'
            }}>
              {merged ? 'merged' : state}
            </span>
          </div>
          {activity.description && (
            <p style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              opacity: 0.7,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {activity.description}
            </p>
          )}
          {metadata?.labels && metadata.labels.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
              {metadata.labels.map((label: any) => (
                <span
                  key={label.id}
                  style={{
                    padding: '0.125rem 0.5rem',
                    fontSize: '0.625rem',
                    fontFamily: 'monospace',
                    borderRadius: '2px',
                    backgroundColor: `#${label.color}20`,
                    color: `#${label.color}`,
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Issue Card Component
function IssueCard({ activity }: { activity: ActivityDetail }) {
  const metadata = activity.metadata as any;
  const state = metadata?.state || 'open';
  
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--surface-color)',
      transition: 'transform 0.1s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateX(2px) translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem' }}>
          {state === 'closed' ? '✓' : '⚠️'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h4 style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {activity.title}
            </h4>
            <span style={{
              padding: '0.125rem 0.5rem',
              fontSize: '0.625rem',
              fontFamily: 'monospace',
              borderRadius: '2px',
              backgroundColor: state === 'closed' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: state === 'closed' ? '#ef4444' : '#f59e0b'
            }}>
              {state}
            </span>
          </div>
          {activity.description && (
            <p style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              opacity: 0.7,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {activity.description}
            </p>
          )}
          {metadata?.assignees && metadata.assignees.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', opacity: 0.6 }}>
                Assigned to:
              </span>
              {metadata.assignees.map((assignee: any) => (
                <span key={assignee.id} style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  @{assignee.login}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Review Card Component
function ReviewCard({ activity }: { activity: ActivityDetail }) {
  const metadata = activity.metadata as any;
  const state = metadata?.state || 'PENDING';
  
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--surface-color)',
      transition: 'transform 0.1s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateX(2px) translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem' }}>
          {state === 'APPROVED' ? '✅' : 
           state === 'CHANGES_REQUESTED' ? '🔧' : '👀'}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontFamily: 'monospace', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            Code Review
          </h4>
          <span style={{
            padding: '0.125rem 0.5rem',
            fontSize: '0.625rem',
            fontFamily: 'monospace',
            borderRadius: '2px',
            backgroundColor: state === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' :
                            state === 'CHANGES_REQUESTED' ? 'rgba(245, 158, 11, 0.2)' :
                            'rgba(107, 114, 128, 0.2)',
            color: state === 'APPROVED' ? '#22c55e' :
                   state === 'CHANGES_REQUESTED' ? '#f59e0b' :
                   '#6b7280'
          }}>
            {state.toLowerCase().replace('_', ' ')}
          </span>
          {activity.description && (
            <p style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              opacity: 0.7,
              marginTop: '0.5rem'
            }}>
              {activity.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Activity Card Component
export function ActivityCard({ activity, index }: ActivityCardProps) {
  const renderCard = () => {
    switch (activity.type) {
      case 'commit':
        return <CommitCard activity={activity} />;
      case 'pr':
        return <PullRequestCard activity={activity} />;
      case 'issue':
        return <IssueCard activity={activity} />;
      case 'review':
        return <ReviewCard activity={activity} />;
      default:
        return (
          <div style={{
            padding: '1rem',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color)'
          }}>
            <h4 style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {activity.title}
            </h4>
            {activity.description && (
              <p style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                opacity: 0.7,
                marginTop: '0.25rem'
              }}>
                {activity.description}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div>
      {activity.url ? (
        <a
          href={activity.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          {renderCard()}
        </a>
      ) : (
        renderCard()
      )}
    </div>
  );
}