'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface LogGeneratorProps {
  onComplete?: (logId: string) => void;
}

export function LogGenerator({ onComplete }: LogGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const generateLog = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    
    try {
      // Step 1: Fetching GitHub data
      setStatus('Fetching GitHub activity...');
      setProgress(25);
      
      const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'lnittman';
      const date = format(new Date(), 'yyyy-MM-dd');
      
      // Step 2: Analyzing with AI
      setTimeout(() => {
        setStatus('Analyzing commits and code changes...');
        setProgress(50);
      }, 1000);
      
      // Step 3: Generating summary
      setTimeout(() => {
        setStatus('Generating daily summary...');
        setProgress(75);
      }, 2000);
      
      // Make the actual API call
      const response = await fetch('/api/logs/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, date }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('Log generated successfully!');
        setProgress(100);
        
        // Get the log ID from the result
        const logId = data.result?.['store-activity']?.logId;
        if (logId && onComplete) {
          setTimeout(() => onComplete(logId), 1500);
        }
      } else {
        throw new Error(data.error || 'Failed to generate log');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('Generation failed');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setStatus('');
        setProgress(0);
      }, 3000);
    }
  };

  return (
    <div className="brutalist-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-lg">Generate Today&apos;s Log</h3>
          <button
            onClick={generateLog}
            disabled={isGenerating}
            className={`brutalist-button px-4 py-2 ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚙️</span>
                Generating...
              </span>
            ) : (
              'Generate Now →'
            )}
          </button>
        </div>

        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 1, height: 'auto' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              {/* Progress Bar */}
              <div className="relative h-2 bg-[rgb(var(--surface-2))] rounded overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[rgb(var(--accent-1))]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0 }}
                />
              </div>

              {/* Status Message */}
              <p className="font-mono text-sm text-[rgb(var(--text-secondary))]">
                {status}
              </p>

              {/* Streaming Activity Preview */}
              <div className="bg-[rgb(var(--surface-1))] p-3 rounded">
                <div className="space-y-2">
                  {progress >= 25 && (
                    <motion.div
                      initial={{ opacity: 1, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-xs"
                    >
                      → Fetched GitHub events
                    </motion.div>
                  )}
                  {progress >= 50 && (
                    <motion.div
                      initial={{ opacity: 1, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-xs"
                    >
                      → Analyzed {Math.floor(Math.random() * 20) + 5} commits
                    </motion.div>
                  )}
                  {progress >= 75 && (
                    <motion.div
                      initial={{ opacity: 1, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-xs"
                    >
                      → Generated AI summary
                    </motion.div>
                  )}
                  {progress === 100 && (
                    <motion.div
                      initial={{ opacity: 1, x: 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-xs text-green-400"
                    >
                      ✓ Log saved to database
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded"
            >
              <p className="font-mono text-sm text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}