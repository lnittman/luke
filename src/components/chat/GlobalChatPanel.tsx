'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChat, LogEntry } from './ChatContext';
import { FloatingChatPanel } from './FloatingChatPanel';

export const GlobalChatPanel = () => {
  const { 
    messages, 
    activeTab, 
    latestLogEntry,
    unreadCount: contextUnreadCount,
    addMessage, 
    setActiveTab, 
    handleLatestLogChange,
    handleChatPanelClose
  } = useChat();
  
  // Local state to handle unread count updates from FloatingChatPanel
  const [localUnreadCount, setLocalUnreadCount] = useState(0);
  
  // Effect to sync context unread count with local
  useEffect(() => {
    if (contextUnreadCount !== localUnreadCount) {
      setLocalUnreadCount(contextUnreadCount);
    }
  }, [contextUnreadCount, localUnreadCount]);

  // Adapter function to handle the tab change
  const handleTabChange = (tab: string) => {
    if (tab === 'chat') {
      setActiveTab(tab);
    }
  };
  
  // Adapter function to convert LogEntry type if needed
  const handleLogEntryChange = (logEntry: { timestamp: Date; message: string; type: string } | null) => {
    if (logEntry) {
      const convertedEntry: LogEntry = {
        timestamp: logEntry.timestamp,
        message: logEntry.message,
        type: logEntry.type
      };
      handleLatestLogChange(convertedEntry);
    } else {
      handleLatestLogChange(null);
    }
  };

  return (
    <FloatingChatPanel 
      messages={messages}
      onAddMessage={addMessage}
      activeTab={activeTab === 'log' ? 'chat' : activeTab} // Default to chat if log was selected
      onTabChange={handleTabChange}
      onLatestLogChange={handleLogEntryChange}
      onClose={handleChatPanelClose}
      onUnreadCountChange={setLocalUnreadCount}
    />
  );
};

export default GlobalChatPanel; 