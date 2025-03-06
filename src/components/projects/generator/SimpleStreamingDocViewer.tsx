'use client';

import { useState, useEffect } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface TabItem {
  title: string;
  content: any;
}

/**
 * A simplified version of the streaming document viewer that works with 
 * basic React nodes from the AI SDK.
 */
export const SimpleStreamingDocViewer: React.FC<{ streamState: any }> = ({ 
  streamState 
}) => {
  // UI state for document display
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // When new state arrives from the stream, update our UI
  useEffect(() => {
    // Only process streamState if it's an object with expected properties
    if (
      streamState && 
      typeof streamState === 'object' && 
      'content' in streamState &&
      Array.isArray(streamState.content)
    ) {
      // Check for isGenerating status
      setIsGenerating(streamState.isGenerating || false);
    }
  }, [streamState]);
  
  // If we don't have proper stream state, show loading
  if (!streamState || typeof streamState !== 'object') {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">Waiting for document generation to start...</div>
      </div>
    );
  }
  
  // Extract content from stream state if it exists
  const content = streamState.content || [];
  
  // If no content available yet, show a message
  if (!content.length) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">Document Generation</h3>
          <p className="text-[rgb(var(--muted))]">
            {isGenerating 
              ? "Documents are being generated. They'll appear here as they're ready."
              : "No documents generated yet. Click 'Generate Documents' to begin."}
          </p>
          {isGenerating && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Render tabs for each piece of content
  const tabs: TabItem[] = content.map((item: any, index: number) => {
    // Try to extract a title, defaulting to generic if not found
    const title = item?.title || `Document ${index + 1}`;
    return { title, content: item };
  });
  
  return (
    <div className="h-full flex flex-col">
      {/* Tabs for document selection */}
      <div className="border-b border-[rgb(var(--border))]">
        <div className="flex overflow-x-auto">
          {tabs.map((tab: TabItem, index: number) => (
            <button
              key={index}
              className={clsx(
                "px-4 py-2 font-medium text-sm whitespace-nowrap",
                activeTabIndex === index
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
              )}
              onClick={() => setActiveTabIndex(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      
      {/* Document content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Render the active document content */}
            {tabs[activeTabIndex]?.content?.content ? (
              <div>
                <h1 className="text-2xl font-bold mb-4">{tabs[activeTabIndex].title}</h1>
                <MarkdownRenderer content={tabs[activeTabIndex].content.content} />
              </div>
            ) : (
              <div className="text-[rgb(var(--muted))]">
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span>Generating document...</span>
                  </div>
                ) : (
                  "Document content not available"
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Generation status indicator */}
      {isGenerating && (
        <div className="p-2 border-t border-[rgb(var(--border))] bg-[rgb(var(--background-light))] text-center text-sm">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            <span>Generating documents...</span>
          </div>
        </div>
      )}
    </div>
  );
}; 