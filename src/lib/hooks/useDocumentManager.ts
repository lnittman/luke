import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Document types and interfaces
export type DocStatus = 'complete' | 'generating';
export type DocSource = 'claude' | 'perplexity';

export interface DocItem {
  id: string;
  title: string;
  content: string;
  read: boolean;
  status: DocStatus;
  source: DocSource;
  createdAt: Date;
}

interface UseDocumentManagerResult {
  documents: DocItem[];
  addDocument: (title: string, content: string, source: DocSource, status?: DocStatus) => DocItem;
  updateDocument: (id: string, updates: Partial<Omit<DocItem, 'id'>>) => void;
  markAsRead: (id: string) => void;
  clearDocuments: () => void;
  addSearchResult: (category: string, content: string) => DocItem;
  processApiDocuments: (docs: Record<string, string>, source?: DocSource) => void;
}

export const useDocumentManager = (): UseDocumentManagerResult => {
  const [documents, setDocuments] = useState<DocItem[]>([]);

  // Add a new document
  const addDocument = useCallback((title: string, content: string, source: DocSource = 'claude', status: DocStatus = 'complete') => {
    const newDoc: DocItem = {
      id: uuidv4(),
      title,
      content,
      read: false,
      status,
      source,
      createdAt: new Date(),
    };

    setDocuments(prev => [...prev, newDoc]);
    
    // Extract title from markdown content if it looks like markdown
    let cleanTitle = title;
    if (content.startsWith('#')) {
      // Try to extract a better title from the first heading
      const titleMatch = content.match(/^#\s+(.+?)($|\n)/);
      if (titleMatch && titleMatch[1]) {
        cleanTitle = titleMatch[1].trim();
        // Remove markdown formatting like ** or __
        cleanTitle = cleanTitle.replace(/\*\*|\*|__|_/g, '');
        // Limit length
        if (cleanTitle.length > 60) {
          cleanTitle = cleanTitle.substring(0, 57) + '...';
        }
      }
    }
    
    // Show toast notification for new document with consistent height
    toast.success(`New document: ${cleanTitle}`, {
      description: 'Click to view document',
      duration: 5000,
      className: "h-[72px] flex flex-col justify-center ",
      action: {
        label: 'view',
        onClick: () => {
          markAsRead(newDoc.id);
          // Note: This needs to be handled by the component that uses the hook
          // by watching the return value of this function
        }
      }
    });

    return newDoc;
  }, []);

  // Update an existing document
  const updateDocument = useCallback((id: string, updates: Partial<Omit<DocItem, 'id'>>) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, ...updates } : doc
      )
    );
  }, []);

  // Mark a document as read
  const markAsRead = useCallback((id: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, read: true } : doc
      )
    );
  }, []);

  // Clear all documents
  const clearDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  // Add a search result as a document
  const addSearchResult = useCallback((category: string, content: string) => {
    // Format the category title to be more readable
    let formattedCategory = category;
    
    // If category starts with ##, clean it up
    if (formattedCategory.startsWith('##')) {
      formattedCategory = formattedCategory.replace(/^#+\s*/, '');
      // Remove any markdown formatting
      formattedCategory = formattedCategory.replace(/\*\*|\*|__|_/g, '');
    }
    
    // Truncate if too long
    if (formattedCategory.length > 50) {
      formattedCategory = formattedCategory.substring(0, 47) + '...';
    }
    
    return addDocument(`Search: ${formattedCategory}`, content, 'perplexity');
  }, [addDocument]);

  // Process documents from API response
  const processApiDocuments = useCallback((docs: Record<string, string>, source: DocSource = 'claude') => {
    Object.entries(docs).forEach(([key, content]) => {
      // Format the title from filename (e.g., "tech.md" -> "Tech")
      const title = key.replace('.md', '').charAt(0).toUpperCase() + key.replace('.md', '').slice(1);
      addDocument(title, content, source);
    });
  }, [addDocument]);

  return {
    documents,
    addDocument,
    updateDocument,
    markAsRead,
    clearDocuments,
    addSearchResult,
    processApiDocuments,
  };
}; 