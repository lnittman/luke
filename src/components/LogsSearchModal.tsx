'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { logsSearchModalOpenAtom, logsSearchQueryAtom, logsSearchSelectedIndexAtom } from '@/atoms/logs-search';
import { format } from 'date-fns';
import type { ActivityLog } from '@/lib/db';
import { WaterAscii } from '@/components/WaterAscii';

interface LogsSearchModalProps {
  logs?: ActivityLog[];
}

export function LogsSearchModal({ logs = [] }: LogsSearchModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useAtom(logsSearchModalOpenAtom);
  const [query, setQuery] = useAtom(logsSearchQueryAtom);
  const [selectedIndex, setSelectedIndex] = useAtom(logsSearchSelectedIndexAtom);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile (kept for potential styling tweaks)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const normalizedLogs = useMemo(() => {
    return (logs || []).map((log) => ({
      id: String(log.id),
      date: new Date(log.date as any),
      summary: log.summary || '',
    }));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const q = query.toLowerCase();
    return normalizedLogs.filter((log) =>
      log.summary.toLowerCase().includes(q)
    );
  }, [normalizedLogs, query]);

  const handleSelect = useCallback((id: string) => {
    router.push(`/logs/${id}`);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, [router, setIsOpen, setQuery, setSelectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          setSelectedIndex(0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredLogs.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredLogs.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredLogs[selectedIndex]) {
            handleSelect(filteredLogs[selectedIndex].id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredLogs, setIsOpen, setQuery, setSelectedIndex, handleSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, setSelectedIndex]);

  const resultsList = (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {filteredLogs.length > 0 ? (
        filteredLogs.map((log, index) => (
          <button
            key={log.id}
            onClick={() => handleSelect(log.id)}
            onMouseEnter={() => setSelectedIndex(index)}
            style={{
              width: '100%',
              padding: '1rem 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.25rem',
              background: index === selectedIndex ? 'rgb(var(--surface-1))' : 'transparent',
              border: 'none',
              borderBottom: '1px solid rgb(var(--border))',
              cursor: 'pointer',
              transition: 'background 0.1s ease',
              fontFamily: 'monospace',
              color: 'rgb(var(--text-primary))',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                {log.summary || 'untitled'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgb(var(--text-secondary))' }}>
                {format(log.date, 'LLL d').toLowerCase()}
              </div>
            </div>
            {!!log.summary && (
              <div style={{ fontSize: '0.75rem', color: 'rgb(var(--text-secondary))', display: '-webkit-box', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                {log.summary}
              </div>
            )}
          </button>
        ))
      ) : query ? (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
          no logs found
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgb(var(--text-secondary))' }}>
          start typing to search logs
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100]"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
              setSelectedIndex(0);
            }}
            style={{ background: 'rgb(var(--background-start))' }}
          >
            {/* top-aligned search UI */}
            <div className="relative z-[101] flex h-full w-full flex-col" onClick={(e) => e.stopPropagation()}>
              <div id="logs-search-bar" style={{ padding: '12px 24px 8px 24px', borderBottom: '1px solid rgb(var(--border))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="start typing to search"
                  autoFocus
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    color: 'rgb(var(--text-primary))',
                  }}
                />
              </div>
              <div style={{ padding: '8px 12px 12px 12px' }}>{resultsList}</div>
            </div>

            {/* water background: inset from page sides and bottom, starts below search bar bottom edge */}
            <div className="pointer-events-none absolute inset-0" style={{ opacity: 0.07 }}>
              <div style={{ position: 'absolute', left: 8, right: 8, bottom: 8, top: 0 }}>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: (12 + 12 + 16) }}>
                  {/* 12 top padding + 12 bottom padding inside bar + ~16px bar content line height approximation; keeps ascii below search with small gap */}
                  <WaterAscii mode="procedural" rows={80} columns={220} speed={0.5} style={{ fontSize: '8px', lineHeight: '8px', width: '100%', height: '100%' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}