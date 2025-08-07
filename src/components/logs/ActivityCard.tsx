'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { ActivityDetail } from '@/lib/db';

interface ActivityCardProps {
  activity: ActivityDetail;
  index: number;
}

// Commit Card Component
function CommitCard({ activity }: { activity: ActivityDetail }) {
  const metadata = activity.metadata as any;
  
  return (
    <div className="brutalist-card p-4 hover:translate-x-1 hover:-translate-y-1 transition-transform">
      <div className="flex items-start gap-3">
        <div className="text-2xl">💾</div>
        <div className="flex-1">
          <h3 className="font-mono text-sm mb-1">{activity.title}</h3>
          {metadata?.stats && (
            <div className="flex gap-4 text-xs font-mono text-[rgb(var(--text-secondary))]">
              <span className="text-green-500">+{metadata.stats.additions || 0}</span>
              <span className="text-red-500">-{metadata.stats.deletions || 0}</span>
              <span>{metadata.stats.total || 0} changes</span>
            </div>
          )}
          {metadata?.files && metadata.files.length > 0 && (
            <div className="mt-2 text-xs font-mono text-[rgb(var(--text-secondary))]">
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
    <div className="brutalist-card p-4 hover:translate-x-1 hover:-translate-y-1 transition-transform">
      <div className="flex items-start gap-3">
        <div className="text-2xl">
          {merged ? '🎯' : state === 'open' ? '🔄' : '✅'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-mono text-sm">{activity.title}</h3>
            <span className={`px-2 py-0.5 text-xs font-mono rounded ${
              merged ? 'bg-purple-500/20 text-purple-400' :
              state === 'open' ? 'bg-green-500/20 text-green-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {merged ? 'merged' : state}
            </span>
          </div>
          {activity.description && (
            <p className="font-mono text-xs text-[rgb(var(--text-secondary))] line-clamp-2">
              {activity.description}
            </p>
          )}
          {metadata?.labels && metadata.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {metadata.labels.map((label: any) => (
                <span
                  key={label.id}
                  className="px-2 py-0.5 text-xs font-mono rounded"
                  style={{
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
    <div className="brutalist-card p-4 hover:translate-x-1 hover:-translate-y-1 transition-transform">
      <div className="flex items-start gap-3">
        <div className="text-2xl">
          {state === 'closed' ? '✓' : '⚠️'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-mono text-sm">{activity.title}</h3>
            <span className={`px-2 py-0.5 text-xs font-mono rounded ${
              state === 'closed' ? 'bg-red-500/20 text-red-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {state}
            </span>
          </div>
          {activity.description && (
            <p className="font-mono text-xs text-[rgb(var(--text-secondary))] line-clamp-2">
              {activity.description}
            </p>
          )}
          {metadata?.assignees && metadata.assignees.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-mono text-[rgb(var(--text-secondary))]">
                Assigned to:
              </span>
              {metadata.assignees.map((assignee: any) => (
                <span key={assignee.id} className="text-xs font-mono">
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
    <div className="brutalist-card p-4 hover:translate-x-1 hover:-translate-y-1 transition-transform">
      <div className="flex items-start gap-3">
        <div className="text-2xl">
          {state === 'APPROVED' ? '✅' : 
           state === 'CHANGES_REQUESTED' ? '🔧' : '👀'}
        </div>
        <div className="flex-1">
          <h3 className="font-mono text-sm mb-1">Code Review</h3>
          <span className={`px-2 py-0.5 text-xs font-mono rounded ${
            state === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
            state === 'CHANGES_REQUESTED' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {state.toLowerCase().replace('_', ' ')}
          </span>
          {activity.description && (
            <p className="font-mono text-xs text-[rgb(var(--text-secondary))] mt-2">
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
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
      },
    },
  };

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
          <div className="brutalist-card p-4">
            <h3 className="font-mono text-sm">{activity.title}</h3>
            {activity.description && (
              <p className="font-mono text-xs text-[rgb(var(--text-secondary))] mt-1">
                {activity.description}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {activity.url ? (
        <a
          href={activity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {renderCard()}
        </a>
      ) : (
        renderCard()
      )}
    </motion.div>
  );
}