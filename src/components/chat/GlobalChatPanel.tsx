'use client';

import React, { useEffect, useState } from 'react';
import { FloatingChatPanel } from './FloatingChatPanel';
import { useChatStore, LogEntry } from '@/lib/store/chatStore';

export const GlobalChatPanel = () => {
  const { 
    messages, 
    latestLogEntry,
    unreadCount: storeUnreadCount,
    addMessage, 
    handleLatestLogChange,
    handleChatPanelClose
  } = useChatStore();
  
  // Local state to handle unread count updates from FloatingChatPanel
  const [localUnreadCount, setLocalUnreadCount] = useState(0);
  
  // Effect to sync store unread count with local
  useEffect(() => {
    if (storeUnreadCount !== localUnreadCount) {
      setLocalUnreadCount(storeUnreadCount);
    }
  }, [storeUnreadCount, localUnreadCount]);
  
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
      onLatestLogChange={handleLogEntryChange}
      onClose={handleChatPanelClose}
      onUnreadCountChange={setLocalUnreadCount}
    />
  );
};

export default GlobalChatPanel; 