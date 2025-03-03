import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocItem } from '@/lib/hooks/useDocumentManager';
import { FilesIcon, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingDocPanelProps {
  documents: DocItem[];
  onDocumentClick: (doc: DocItem) => void;
  onMarkAsRead: (id: string) => void;
}

export const FloatingDocPanel: React.FC<FloatingDocPanelProps> = ({
  documents,
  onDocumentClick,
  onMarkAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = documents.filter(doc => !doc.read).length;

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening the panel
      documents.forEach(doc => {
        if (!doc.read) {
          onMarkAsRead(doc.id);
        }
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 300, height: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-card rounded-lg shadow-lg border border-border mb-2 w-80"
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="font-medium">Documents</h3>
              <button 
                onClick={togglePanel}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <ScrollArea className="h-[50vh] max-h-[500px]">
              {documents.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No documents available
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        onDocumentClick(doc);
                        if (!doc.read) {
                          onMarkAsRead(doc.id);
                        }
                      }}
                      className={cn(
                        "p-3 rounded-md border border-border hover:bg-accent/50 cursor-pointer transition-colors",
                        !doc.read && "bg-accent/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{doc.title}</span>
                        </div>
                        {!doc.read && (
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {doc.content.substring(0, 100)}...
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          doc.source === 'perplexity' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}>
                          {doc.source === 'perplexity' ? 'Perplexity' : 'Claude'}
                        </span>
                        
                        {doc.status === 'generating' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            Generating...
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
        className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg flex items-center justify-center relative"
      >
        <FilesIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}; 