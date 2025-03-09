import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Message, SearchResult } from './interfaces';
import { useClickAway } from 'react-use';
import clsx from 'clsx';

// Document types for log filtering
type DocumentType = 'tech' | 'index' | 'design' | 'code' | 'init' | 'search' | 'implementation' | 'web' | 'marketing' | 'sales' | 'architect' | 'all';

interface FloatingChatPanelProps {
  messages: Message[];
  onAddMessage?: (message: string, isSystem?: boolean) => void;
  activeTab?: 'chat' | 'search'; 
  onClose?: () => void;
  onTabChange?: (tab: string) => void;
  onLatestLogChange?: (logEntry: { timestamp: Date; message: string; type: string } | null) => void;
  onUnreadCountChange?: (count: number) => void;
  // New props for search results
  searchResults?: SearchResult[];
  searchProgress?: number;
  isGeneratingIdea?: boolean;
  discoveredTechs?: Array<{name: string; documentationUrl: string}>;
  onTechClick?: (tech: string) => void;
}

export const FloatingChatPanel: React.FC<FloatingChatPanelProps> = ({
  messages,
  onAddMessage,
  activeTab: initialTab = 'chat',
  onClose,
  onTabChange,
  onLatestLogChange,
  onUnreadCountChange,
  // New props for search results
  searchResults = [],
  searchProgress = 0,
  isGeneratingIdea = false,
  discoveredTechs = [],
  onTechClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabState, setActiveTabState] = useState(initialTab);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState<DocumentType | 'chat' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  // Glows based on theme
  const glowOpacity = isDarkTheme ? 0.25 : 0.15;
  const glowSpread = isDarkTheme ? '0 0 25px' : '0 0 20px';
  const glowRadius = isDarkTheme ? '90%' : '70%';

  // Ref to track initial render for tab change effect
  const isInitialTabRender = useRef(true);
  const hasNotifiedLogEntry = useRef(false);

  // Add effect to sync activeTabState with initialTab prop
  useEffect(() => {
    if (initialTab !== activeTabState) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  // Use useMemo for logEntries to prevent recreation on every render
  const logEntries = useMemo(() => [
    { timestamp: new Date(), message: 'Chat initialized', type: 'init' as DocumentType },
    { timestamp: new Date(Date.now() - 5 * 60 * 1000), message: 'User session started', type: 'implementation' as DocumentType },
    { timestamp: new Date(Date.now() - 10 * 60 * 1000), message: 'System connection established', type: 'tech' as DocumentType },
    { timestamp: new Date(Date.now() - 15 * 60 * 1000), message: 'Code generation complete', type: 'code' as DocumentType },
    { timestamp: new Date(Date.now() - 20 * 60 * 1000), message: 'Design specs created', type: 'design' as DocumentType },
    { timestamp: new Date(Date.now() - 25 * 60 * 1000), message: 'Project index updated', type: 'index' as DocumentType },
    { timestamp: new Date(Date.now() - 30 * 60 * 1000), message: 'Resource search completed', type: 'search' as DocumentType },
    { timestamp: new Date(Date.now() - 35 * 60 * 1000), message: 'Web research completed', type: 'web' as DocumentType },
    { timestamp: new Date(Date.now() - 40 * 60 * 1000), message: 'Marketing strategy generated', type: 'marketing' as DocumentType },
    { timestamp: new Date(Date.now() - 45 * 60 * 1000), message: 'Sales documentation ready', type: 'sales' as DocumentType },
    { timestamp: new Date(Date.now() - 50 * 60 * 1000), message: 'Architecture design finalized', type: 'architect' as DocumentType },
  ], []);

  // Click outside to close the dropdown
  useClickAway(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  // Example implementation - would need to be updated for actual message tracking
  useEffect(() => {
    // This is a placeholder for unread message tracking
    setUnreadCount(1); // Just for visual effect
    
    if (onUnreadCountChange) {
      onUnreadCountChange(1);
    }
  }, [messages, onUnreadCountChange]);

  // Handle tab changes
  useEffect(() => {
    // Skip the initial mount to prevent infinite loop
    if (isInitialTabRender.current) {
      isInitialTabRender.current = false;
      return;
    }
    
    if (onTabChange) {
      onTabChange(activeTabState);
    }
  }, [activeTabState, onTabChange]);

  // Notify about the latest log entry once on mount
  useEffect(() => {
    if (logEntries.length > 0 && onLatestLogChange && !hasNotifiedLogEntry.current) {
      hasNotifiedLogEntry.current = true;
      onLatestLogChange(logEntries[0]);
    }
  }, [onLatestLogChange, logEntries]);

  // Scroll to bottom when the panel opens or when new messages arrive
  useEffect(() => {
    if (isOpen) {
      // Use a small timeout to ensure the scroll happens after the animation
      setTimeout(() => {
        if (activeTabState === 'chat' && messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [isOpen, activeTabState, messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() && onAddMessage) {
      onAddMessage(inputValue);
      setInputValue('');
      
      // Scroll to bottom after sending message
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp to readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get emoji for document type
  const getEmoji = (type: DocumentType): string => {
    switch (type) {
      case 'tech': return '🔧';
      case 'index': return '📚';
      case 'design': return '🎨';
      case 'code': return '💻';
      case 'init': return '🚀';
      case 'search': return '🔍';
      case 'implementation': return '⚙️';
      case 'web': return '🌐';
      case 'marketing': return '📢';
      case 'sales': return '💰';
      case 'architect': return '🏗️';
      case 'all':
      default: return '��';
    }
  };

  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkTheme ? 'bg-[rgb(var(--background))]' : 'bg-[rgb(var(--background))]';
  };

  // Get log entry background color based on theme
  const getLogEntryBgColor = () => {
    return isDarkTheme ? 'bg-[#1a1a1a]' : 'bg-[rgba(var(--surface-2)/0.1)]';
  };

  // Get border color based on theme
  const getBorderColor = () => {
    return isDarkTheme ? 'border-[#252525]' : 'border-[rgb(var(--border))]';
  };

  // Get text colors based on theme
  const getMutedTextColor = () => {
    return isDarkTheme ? 'text-[#8a8a8a]' : 'text-[rgb(var(--muted-foreground))]';
  };

  // Get selected state background color
  const getSelectedBgColor = () => {
    return isDarkTheme ? 'bg-[rgba(82,82,82,0.3)]' : 'bg-[rgb(var(--surface-1)/0.15)]';
  };

  // All document types for filter bar
  const documentTypes: DocumentType[] = [
    'all', 'tech', 'index', 'design', 'code', 'init', 'search', 'implementation', 
    'web', 'marketing', 'sales', 'architect'
  ];

  // Update tabs to only include chat
  const tabs = [
    { id: 'chat', label: 'chat' }
  ];

  // Handle tab changes
  const handleTabClick = (tabId: string) => {
    if (tabId === 'chat') {
      setActiveTabState(tabId as any);
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    // Always close the panel first
    setIsOpen(false);
    
    // Then call the onClose callback if provided
    if (onClose) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[400]"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="relative" ref={dropdownRef}>
        {/* Chat Button - Styled exactly like Navigation.tsx buttons */}
        <div className="relative group">
          <motion.div
            className={clsx(
              "relative p-1.5 sm:p-2.5 rounded-xl transition-colors duration-300",
              "hover:bg-[rgb(var(--surface-1)/0.1)]",
              isOpen && "bg-[rgb(var(--surface-1)/0.15)]"
            )}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setTooltipVisible('chat')}
            onHoverEnd={() => setTooltipVisible(null)}
            onTouchStart={() => setTooltipVisible('chat')}
            onTouchEnd={() => setTooltipVisible(null)}
          >
            {/* Glass effect */}
            <div className="absolute inset-0 rounded-xl glass-effect opacity-50" />
            
            {/* Glow effect exactly like Navigation.tsx with fade out animation */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 rounded-xl"
                  style={{ 
                    background: `radial-gradient(circle at center, rgb(var(--accent-1) / ${isDarkTheme ? 0.25 : 0.15}) 0%, transparent ${isDarkTheme ? '90%' : '70%'})`,
                    boxShadow: `${isDarkTheme ? '0 0 25px' : '0 0 20px'} rgb(var(--accent-1) / ${isDarkTheme ? 0.25 : 0.15})`,
                  }}
                />
              )}
            </AnimatePresence>

            <Image
              src="/assets/chat.png"
              alt="Chat"
              width={40}
              height={40}
              className="w-9 h-9 sm:w-12 sm:h-12 relative z-10 select-none touch-none"
              priority
              draggable={false}
            />
            
            {/* Unread indicator */}
            {unreadCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-medium rounded-full bg-[rgb(var(--accent-1)/0.2)] text-[rgb(var(--accent-1)/1)] border border-[rgb(var(--accent-1)/0.3)]"
              >
                {unreadCount}
              </span>
            )}
          </motion.div>
          
          {/* Tooltip */}
          <AnimatePresence>
            {tooltipVisible === 'chat' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 -translate-x-1/2 -top-10 hidden sm:block w-full"
              >
                <div className="relative flex flex-col items-center">
                  <div className="px-2.5 py-1.5 rounded-md bg-[rgb(var(--surface-1)/0.9)] backdrop-blur-sm text-sm lowercase whitespace-nowrap">
                    chat
                  </div>
                  <div 
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[rgb(var(--surface-1)/0.9)]"
                    style={{ backdropFilter: 'blur(8px)' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown Panel - Using theme's page background color */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute bottom-16 right-0 w-80 sm:w-96 rounded-lg shadow-lg border border-[rgb(var(--border))] overflow-hidden"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ 
                height: '420px',
                backgroundColor: isDarkTheme ? 'rgb(22, 28, 36)' : 'rgb(255, 255, 255)'
              }}
            >
              <div className="flex flex-col h-full" style={{ 
                backgroundColor: isDarkTheme ? 'rgb(22, 28, 36)' : 'rgb(255, 255, 255)'
              }}>
                {/* Header - Tab buttons and close button on same row */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-[rgb(var(--border))]" style={{ 
                  backgroundColor: isDarkTheme ? 'rgb(22, 28, 36)' : 'rgb(255, 255, 255)'
                }}>
                  {/* Tab Buttons - Left aligned */}
                  <div className="flex space-x-6">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={clsx(
                          "text-xs lowercase transition-colors",
                          activeTabState === tab.id
                            ? "text-[rgb(var(--text-accent))]"
                            : "text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Close Button - Right aligned */}
                  <button
                    className="text-xs text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
                    onClick={handleCloseClick}
                  >
                    close
                  </button>
                </div>
                
                {/* Content Area */}
                <div className="flex-1 flex flex-col h-full" style={{ 
                  backgroundColor: isDarkTheme ? 'rgb(22, 28, 36)' : 'rgb(255, 255, 255)'
                }}>
                  {/* Chat Content */}
                  {activeTabState === 'chat' && (
                    <div className="flex flex-col h-full" style={{ 
                      backgroundColor: isDarkTheme ? 'rgb(22, 28, 36)' : 'rgb(255, 255, 255)'
                    }}>
                      {/* Messages - Scrollable with contained content */}
                      <div className="flex-1 overflow-y-auto scrollbar-thin" ref={messagesContainerRef} style={{ 
                        backgroundColor: isDarkTheme ? 'rgb(22, 28, 36)' : 'rgb(255, 255, 255)'
                      }}>
                        <div className="p-3 space-y-3">
                          {messages.map((message, index) => (
                            <div
                              key={message.id || index}
                              className={cn(
                                "p-3 rounded-lg",
                                message.role === 'user' 
                                  ? "bg-[rgba(var(--blue-1)/0.1)] ml-8"
                                  : "bg-[rgba(var(--surface-1)/0.1)]"
                              )}
                            >
                              <div className="flex items-start gap-2">
                                {message.role !== 'user' && (
                                  <div className="h-6 w-6 rounded-full bg-[rgba(var(--purple-1)/0.2)] flex items-center justify-center text-xs">
                                    🤖
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-[rgb(var(--text-primary))] whitespace-pre-wrap break-words">
                                    {message.content}
                                  </div>
                                  <div className="text-[10px] text-[rgb(var(--text-secondary))] mt-1">
                                    {formatTime(new Date(message.timestamp))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {messages.length === 0 && (
                            <div className="text-center py-8 text-[rgb(var(--text-secondary))] text-xs">
                              no messages yet
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Input Area with separate send button */}
                      {onAddMessage && (
                        <div className="absolute bottom-0 left-0 right-0 border-t border-[rgb(var(--border))] p-2" style={{ 
                          backgroundColor: isDarkTheme ? 'rgb(22, 28, 36)' : 'rgb(255, 255, 255)'
                        }}>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder="type a message..."
                              className="flex-1 py-2 px-3 bg-transparent text-xs rounded-md border border-[rgb(var(--border))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--accent-1)/0.5)]"
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={!inputValue.trim()}
                              className="text-xs py-2 px-3 rounded-md text-[rgb(var(--text-accent))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:text-[rgb(var(--accent-1))]"
                            >
                              send
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 