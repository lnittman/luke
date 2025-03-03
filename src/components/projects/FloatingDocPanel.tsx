import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import clsx from 'clsx';

// Types for documents
export interface DocItem {
  id: string;
  title: string;
  type: 'tech' | 'index' | 'design' | 'code' | 'init' | 'search';
  content: string | null;
  status: 'pending' | 'generating' | 'completed';
  source?: 'perplexity' | 'claude';
  createdAt: Date;
  read: boolean;
}

interface FloatingDocPanelProps {
  documents: DocItem[];
  onDocumentClick: (doc: DocItem) => void;
  onMarkAsRead: (docId: string) => void;
}

export const FloatingDocPanel: React.FC<FloatingDocPanelProps> = ({
  documents,
  onDocumentClick,
  onMarkAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocItem | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Calculate unread documents
    const count = documents.filter(doc => !doc.read).length;
    setUnreadCount(count);
  }, [documents]);

  // No toast notifications for new documents

  const handleDocClick = (doc: DocItem) => {
    setViewingDoc(doc);
    if (!doc.read) {
      onMarkAsRead(doc.id);
    }
  };

  // Sort documents by creation date (newest first)
  const sortedDocs = [...documents].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {documents.length > 0 && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <motion.div
                  className={clsx(
                    "relative p-1.5 sm:p-2.5 rounded-xl transition-colors duration-300",
                    "hover:bg-[rgb(var(--surface-1)/0.1)]",
                    isOpen && "bg-[rgb(var(--surface-1)/0.15)]"
                  )}
                  onHoverStart={() => {}}
                  onHoverEnd={() => {}}
                  onTouchStart={() => {}}
                  onTouchEnd={() => {}}
                >
                  <Image
                    src="/assets/luke-documents.png"
                    alt="Documents"
                    width={40}
                    height={40}
                    className="w-9 h-9 sm:w-12 sm:h-12 relative z-10 select-none touch-none"
                    priority
                    draggable={false}
                  />
                  {unreadCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-medium rounded-full bg-[rgb(var(--accent-1)/0.2)] text-[rgb(var(--accent-1)/1)] border border-[rgb(var(--accent-1)/0.3)]"
                    >
                      {unreadCount}
                    </span>
                  )}
                </motion.div>
              </SheetTrigger>
              
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Documents & Search Results</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 flex flex-col space-y-3 overflow-y-auto max-h-[70vh]">
                  {sortedDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer flex items-center gap-3",
                        doc.source === 'perplexity' 
                          ? "bg-blue-50 hover:bg-blue-100 border border-blue-200"
                          : "bg-purple-50 hover:bg-purple-100 border border-purple-200",
                        !doc.read && "font-semibold"
                      )}
                      onClick={() => handleDocClick(doc)}
                    >
                      {doc.type && doc.type === 'search' ? (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FileText size={16} />
                        </div>
                      ) : (
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          doc.source === 'perplexity' 
                            ? "bg-blue-100 text-blue-600" 
                            : "bg-purple-100 text-purple-600"
                        )}>
                          <FileText size={16} />
                        </div>
                      )}
                      
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-medium truncate">{doc.title}</h4>
                        <p className="text-xs text-gray-500 truncate">
                          {doc.type ? `${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} • ` : ''}
                          {new Date(doc.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      
                      {doc.read && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </motion.div>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      No documents generated yet
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Document Viewer Modal */}
      <Dialog open={!!viewingDoc} onOpenChange={(open) => !open && setViewingDoc(null)}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[80vh] overflow-y-auto p-0">
          {viewingDoc && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{viewingDoc.title}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setViewingDoc(null)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="markdown-content prose prose-sm max-w-none dark:prose-invert">
                {viewingDoc.content ? (
                  <div dangerouslySetInnerHTML={{ __html: viewingDoc.content }} />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Content not available
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}; 