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
import Image from 'next/image';

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
  // State to control dropdown open state
  const [open, setOpen] = useState(false);
  
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

  const handleDocClick = (doc: DocItem, e: React.MouseEvent) => {
    // Prevent default to avoid dropdown closing
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div 
          className={cn(
            "fixed bottom-4 right-4 z-[400] p-2.5 rounded-xl transition-colors duration-300",
            "bg-[rgb(var(--surface-1)/0.15)] hover:bg-[rgb(var(--surface-1)/0.25)] glass-effect shadow-lg",
            documents.length === 0 && "opacity-60"
          )}
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12">
            <Image 
              src="/assets/digital-craftsman.png" 
              alt="documents" 
              width={32} 
              height={32} 
              className="w-7 h-7 sm:w-8 sm:h-8"
            />
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
        className="w-[500px] max-h-[80vh] overflow-y-auto bg-background/80 backdrop-blur-sm border border-border shadow-lg z-[500] font-mono"
      >
        <DropdownMenuLabel className="flex items-center justify-between lowercase">
          <span>generated documents</span>
          {expandedDoc && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpandedDoc(null);
              }} 
              className="text-xs text-muted-foreground hover:text-foreground lowercase"
            >
              back to list
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {!expandedDoc ? (
          // Document list view with constant height
          <div className="h-[300px] overflow-y-auto">
            {documents.length > 0 ? (
              documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={(e) => handleDocClick(doc, e)}
                  className={cn(
                    "flex items-center gap-2 py-3 px-2 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground lowercase",
                    !doc.read && "font-semibold bg-accent/10"
                  )}
                >
                  <FileText className={cn(
                    "h-4 w-4 shrink-0",
                    doc.source === 'claude' ? "text-purple-500" : "text-blue-500"
                  )} />
                  <div className="truncate">
                    {doc.title.toLowerCase()}
                    {!doc.read && (
                      <span className="ml-2 text-xs py-0.5 px-1.5 bg-primary/10 text-primary rounded-full lowercase">
                        new
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Empty placeholder
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
                <FileText className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-center lowercase">no documents generated yet</p>
                <p className="text-center text-xs mt-2 lowercase">documents will appear here as they're generated</p>
              </div>
            )}
          </div>
        ) : (
          // Expanded document view
          <div className="px-3 py-2 h-[300px] overflow-y-auto">
            <div className="mb-2 flex items-center">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium lowercase",
                expandedDoc.source === 'perplexity' 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" 
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              )}>
                {expandedDoc.source === 'perplexity' ? 'perplexity' : 'claude'}
              </span>
            </div>
            
            <div className="markdown-content overflow-y-auto max-h-[250px] pr-2">
              <MarkdownRenderer content={expandedDoc.content} />
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 