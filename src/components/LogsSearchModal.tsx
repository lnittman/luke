'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { logsSearchModalOpenAtom, logsSearchQueryAtom, logsSearchSelectedIndexAtom } from '@/atoms/logs-search';
import { format } from 'date-fns';
import type { ActivityLog } from '@/lib/db';

interface LogsSearchModalProps {
  logs?: ActivityLog[];
}

export function LogsSearchModal({ logs = [] }: LogsSearchModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useAtom(logsSearchModalOpenAtom);
  const [query, setQuery] = useAtom(logsSearchQueryAtom);
  const [selectedIndex, setSelectedIndex] = useAtom(logsSearchSelectedIndexAtom);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
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

  const modalContent = (
    <div style={{
      backgroundColor: 'rgb(var(--background-start))',
      border: '1px solid rgb(var(--border))',
      borderRadius: '0',
      overflow: 'hidden',
      height: isMobile ? '100%' : 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid rgb(var(--border))',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        {isMobile && (
          <button
            onClick={() => {
              setIsOpen(false);
              setQuery('');
              setSelectedIndex(0);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgb(var(--text-secondary))',
              cursor: 'pointer',
              padding: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '1.25rem',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search logs..."
          autoFocus={!isMobile}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: 'monospace',
            fontSize: '1rem',
            color: 'rgb(var(--text-primary))',
          }}
        />
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: isMobile ? 'calc(100vh - 8rem)' : '400px',
      }}>
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => (
            <button
              key={log.id}
              onClick={() => handleSelect(log.id)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{
                width: '100%',
                padding: '1rem',
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
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '80%',
                }}>
                  {log.summary || 'untitled'}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgb(var(--text-secondary))',
                }}>
                  {format(log.date, 'MMM d')}
                </div>
              </div>
              {!!log.summary && (
                <div style={{
                  fontSize: '0.75rem',
                  color: 'rgb(var(--text-secondary))',
                  display: '-webkit-box',
                  WebkitLineClamp: 2 as any,
                  WebkitBoxOrient: 'vertical' as any,
                  overflow: 'hidden',
                }}>
                  {log.summary}
                </div>
              )}
            </button>
          ))
        ) : query ? (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: 'rgb(var(--text-secondary))',
          }}>
            No logs found
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: 'rgb(var(--text-secondary))',
          }}>
            Start typing to search logs
          </div>
        )}
      </div>
      
      {!isMobile && (
        <div style={{
          padding: '0.5rem 1rem',
          borderTop: '1px solid rgb(var(--border))',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: 'rgb(var(--text-secondary))',
          display: 'flex',
          gap: '1rem',
        }}>
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>esc Close</span>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
              setSelectedIndex(0);
            }}
          />
          {isMobile ? (
            // Mobile sheet — blur/fade only (no vertical movement)
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 z-[101]"
              style={{
                maxHeight: '80vh',
              }}
            >
              {modalContent}
            </motion.div>
          ) : (
            // Desktop modal centered
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.3 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[101]"
            >
              {modalContent}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}