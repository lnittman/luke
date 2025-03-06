'use client';

import { useUIState } from 'ai/rsc';
import { useState, useEffect } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { DocSource } from '@/lib/services/streamingDocumentService';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Document types aligned with our existing system
export type DocumentType = 'tech' | 'index' | 'design' | 'code' | 'init' | 'search' | 'implementation';

// Document structure for streaming documents
export interface StreamingDocument {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  source: DocSource;
  isComplete: boolean;
  timestamp: Date;
}

// Props for the document preview card
interface DocumentPreviewProps {
  document: StreamingDocument;
  isActive: boolean;
  onClick: () => void;
  isGenerating?: boolean;
}

// Props for the streaming document viewer
interface StreamingDocumentViewerProps {
  streamState: any; // Will be properly typed with AI UI state
  onDocumentClick?: (doc: StreamingDocument) => void;
  showControls?: boolean;
}

// Document preview card - shows in the sidebar
export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isActive,
  onClick,
  isGenerating = false,
}) => {
  // Get emoji for document type
  const getEmoji = (type: DocumentType): string => {
    const emojiMap: Record<DocumentType, string> = {
      index: '📄',
      design: '🎨',
      tech: '🔧',
      code: '💻',
      init: '🚀',
      search: '🔍',
      implementation: '⚙️',
    };
    return emojiMap[type] || '📋';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "p-3 rounded-md mb-2 cursor-pointer transition-all duration-200",
        "border border-[rgb(var(--border))] hover:border-[rgb(var(--highlight-med))]",
        isActive ? "bg-[rgb(var(--highlight-low))] border-[rgb(var(--highlight-med))]" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl mr-2">{getEmoji(document.type)}</span>
          <span className="font-medium truncate">{document.title}</span>
        </div>
        {isGenerating && !document.isComplete && (
          <div className="ml-2 flex items-center">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
            <span className="text-xs text-[rgb(var(--highlight-med))]">Generating...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// The main streaming document viewer component
export const StreamingDocumentViewer: React.FC<StreamingDocumentViewerProps> = ({
  streamState,
  onDocumentClick,
  showControls = true,
}) => {
  // Access the UI state from the stream
  const [uiState] = useUIState(streamState);
  
  // Local state for document management
  const [documents, setDocuments] = useState<StreamingDocument[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // When UI state changes, extract documents
  useEffect(() => {
    if (uiState && typeof uiState === 'object' && 'documents' in uiState) {
      setDocuments(uiState.documents as StreamingDocument[]);
      setIsGenerating(uiState.isGenerating as boolean);
      
      // Set active document to first one if none selected
      if (documents.length > 0 && !activeDocId) {
        setActiveDocId(documents[0].id);
      }
    }
  }, [uiState, activeDocId, documents.length]);
  
  // Handle document selection
  const handleDocumentClick = (doc: StreamingDocument) => {
    setActiveDocId(doc.id);
    if (onDocumentClick) {
      onDocumentClick(doc);
    }
  };
  
  // Get the currently active document
  const activeDocument = documents.find(doc => doc.id === activeDocId);
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Document list on the left */}
      <div className="flex h-full">
        <div className="w-1/4 p-4 border-r border-[rgb(var(--border))] overflow-y-auto">
          <h2 className="font-bold mb-4 text-lg">Documents</h2>
          <AnimatePresence>
            {documents.map(doc => (
              <DocumentPreview
                key={doc.id}
                document={doc}
                isActive={doc.id === activeDocId}
                onClick={() => handleDocumentClick(doc)}
                isGenerating={isGenerating}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* Document content on the right */}
        <div className="w-3/4 p-4 overflow-y-auto">
          {activeDocument ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">{activeDocument.title}</h1>
              {activeDocument.isComplete ? (
                <MarkdownRenderer content={activeDocument.content} />
              ) : (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-[rgb(var(--highlight-med))]">
                      Generating document...
                    </span>
                  </div>
                  <MarkdownRenderer content={activeDocument.content} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[rgb(var(--highlight-med))]">
                {documents.length > 0 
                  ? "Select a document to view" 
                  : "Documents will appear here as they are generated"}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls section - optional */}
      {showControls && documents.length > 0 && (
        <div className="border-t border-[rgb(var(--border))] p-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-[rgb(var(--highlight-low))] hover:bg-[rgb(var(--highlight-med))] rounded-md text-sm transition-colors duration-200"
          >
            Download Documents
          </button>
        </div>
      )}
    </div>
  );
}; 