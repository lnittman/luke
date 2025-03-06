import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { DocItemExtended } from '../interfaces';
import { DocSource } from '@/lib/hooks/useDocumentManager';

/**
 * Document State Interface
 */
interface DocumentState {
  // Document data
  documents: DocItemExtended[];
  activeDocId: string | null;
  
  // Actions
  setDocuments: (documents: DocItemExtended[]) => void;
  addDocument: (title: string, content: string, source: DocSource, type?: DocItemExtended['type']) => void;
  updateDocument: (id: string, updates: Partial<DocItemExtended>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setActiveDocId: (id: string | null) => void;
  clearDocuments: () => void;
}

/**
 * Document Store
 * Manages document state for the project generator
 */
export const useDocumentStore = create<DocumentState>((set) => ({
  // Initial state
  documents: [],
  activeDocId: null,
  
  // Actions
  setDocuments: (documents) => set({ documents }),
  
  addDocument: (title, content, source, type) => set((state) => {
    // Get emoji for document type
    const emoji = getEmojiForDocType(type);
    
    // Create new document
    const newDoc: DocItemExtended = {
      id: uuidv4(),
      title,
      content,
      read: false,
      status: 'complete',
      source,
      createdAt: new Date(),
      type
    };
    
    return {
      documents: [...state.documents, newDoc],
      activeDocId: state.documents.length === 0 ? newDoc.id : state.activeDocId
    };
  }),
  
  updateDocument: (id, updates) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    )
  })),
  
  markAsRead: (id) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === id ? { ...doc, read: true } : doc
    )
  })),
  
  markAllAsRead: () => set((state) => ({
    documents: state.documents.map(doc => ({ ...doc, read: true }))
  })),
  
  setActiveDocId: (activeDocId) => set({ activeDocId }),
  
  clearDocuments: () => set({ documents: [], activeDocId: null })
}));

/**
 * Helper function to get emoji for document type
 */
function getEmojiForDocType(type?: DocItemExtended['type']): string {
  switch (type) {
    case 'tech':
      return '📚';
    case 'index':
      return '📝';
    case 'design':
      return '🎨';
    case 'code':
    case 'implementation':
      return '💻';
    case 'init':
      return '🚀';
    case 'search':
      return '🔍';
    default:
      return '📄';
  }
} 