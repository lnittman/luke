import React, { useState } from 'react';
import { FilesIcon, FileText } from 'lucide-react';
import { DocItem } from '@/lib/hooks/useDocumentManager';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface DocDropdownMenuProps {
  documents: DocItem[];
  onDocumentClick: (doc: DocItem) => void;
  onMarkAsRead: (id: string) => void;
}

export function DocDropdownMenu({ 
  documents, 
  onDocumentClick, 
  onMarkAsRead 
}: DocDropdownMenuProps) {
  const unreadCount = documents.filter(doc => !doc.read).length;
  const sortedDocs = [...documents].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  // State for expanded document
  const [expandedDoc, setExpandedDoc] = useState<DocItem | null>(null);
  
  // Group documents by source/category - we'll use title as a way to identify doc type 
  const groupedDocs: Record<string, DocItem[]> = {};
  
  sortedDocs.forEach(doc => {
    let docType = 'other';
    
    // Determine document type from title
    if (doc.title.toLowerCase().includes('tech')) docType = 'tech';
    else if (doc.title.toLowerCase().includes('index')) docType = 'index';
    else if (doc.title.toLowerCase().includes('design')) docType = 'design';
    else if (doc.title.toLowerCase().includes('code')) docType = 'code';
    else if (doc.title.toLowerCase().includes('init')) docType = 'init';
    else if (doc.title.toLowerCase().includes('search')) docType = 'search';
    
    if (!groupedDocs[docType]) {
      groupedDocs[docType] = [];
    }
    
    groupedDocs[docType].push(doc);
  });

  // Order of document types
  const typeOrder = ['tech', 'index', 'design', 'code', 'init', 'search'];
  const sortedTypes = Object.keys(groupedDocs).sort(
    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  );

  const handleDocClick = (doc: DocItem) => {
    if (!doc.read) {
      onMarkAsRead(doc.id);
    }
    
    // Toggle expanded state if clicking the same doc
    if (expandedDoc?.id === doc.id) {
      setExpandedDoc(null);
    } else {
      setExpandedDoc(doc);
    }
  };

  if (documents.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          className="fixed bottom-4 right-4 z-[400] p-2.5 rounded-xl transition-colors duration-300 bg-[rgb(var(--surface-1)/0.15)] hover:bg-[rgb(var(--surface-1)/0.25)] glass-effect shadow-lg"
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12">
            <span className="text-2xl sm:text-3xl">📁</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        sideOffset={5}
        className="w-[500px] max-h-[80vh] overflow-y-auto bg-background/80 backdrop-blur-sm border border-border shadow-lg z-[500]"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Generated Documents</span>
          {expandedDoc && (
            <button 
              onClick={() => setExpandedDoc(null)} 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Back to list
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {!expandedDoc ? (
          // Document list view
          documents.map(doc => (
            <DropdownMenuItem 
              key={doc.id}
              onClick={() => handleDocClick(doc)}
              className={cn(
                "flex items-center gap-2 py-3 cursor-pointer",
                !doc.read && "font-semibold bg-accent/10"
              )}
            >
              <FileText className={cn(
                "h-4 w-4 shrink-0",
                doc.source === 'claude' ? "text-purple-500" : "text-blue-500"
              )} />
              <div className="truncate">
                {doc.title}
                {!doc.read && (
                  <span className="ml-2 text-xs py-0.5 px-1.5 bg-primary/10 text-primary rounded-full">
                    New
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          // Expanded document view
          <div className="px-3 py-2">
            <div className="mb-2 flex items-center">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                expandedDoc.source === 'perplexity' 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" 
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              )}>
                {expandedDoc.source === 'perplexity' ? 'Perplexity' : 'Claude'}
              </span>
            </div>
            
            <div className="markdown-content overflow-y-auto max-h-[60vh] pr-2">
              <MarkdownRenderer content={expandedDoc.content} />
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 