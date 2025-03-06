import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { DocDropdownMenu } from '@/components/DocDropdownMenu';
import { X } from 'lucide-react';
import { DocItem as HookDocItem } from '@/lib/hooks/useDocumentManager';
import { DocItemExtended, DocumentViewerProps } from './interfaces';

export const DocumentViewer = ({
  documents,
  onDocumentClick,
  onMarkAsRead,
  activeDocId,
  setActiveDocId
}: DocumentViewerProps) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'documents'>('preview');
  
  // Get the currently viewed document
  const activeDocument = activeDocId 
    ? documents.find(doc => doc.id === activeDocId)
    : null;
  
  // Group documents by type for better organization
  const techDocs = documents.filter(doc => doc.type === 'tech');
  const designDocs = documents.filter(doc => doc.type === 'design');
  const codeDocs = documents.filter(doc => 
    doc.type === 'code' || doc.type === 'implementation' || doc.title.toLowerCase().includes('code'));
  const initDocs = documents.filter(doc => doc.type === 'init');
  const searchDocs = documents.filter(doc => doc.type === 'search');
  
  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[rgb(var(--card))] rounded-md">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[rgb(var(--border))]">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">
              Documents
            </TabsTrigger>
          </TabsList>
          {activeDocId && (
            <button
              onClick={() => setActiveDocId(null)}
              className="ml-auto p-1 rounded-md hover:bg-[rgb(var(--muted))]"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <TabsContent value="preview" className="p-4 overflow-y-auto grow">
          {activeDocument ? (
            <div className="relative w-full h-full">
              <MarkdownRenderer content={activeDocument.content} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-[rgb(var(--muted-foreground))]">
                Select a document to preview
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="p-4 overflow-y-auto grow">
          <div className="space-y-4">
            {/* Tech Docs Section */}
            {techDocs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Tech Documentation</h3>
                <div className="space-y-1">
                  {techDocs.map(doc => (
                    <DocumentItem
                      key={doc.id}
                      doc={doc}
                      onClick={() => {
                        onDocumentClick(doc);
                        onMarkAsRead(doc.id);
                        setActiveDocId(doc.id);
                      }}
                      isActive={activeDocId === doc.id}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Design Docs Section */}
            {designDocs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Design Documentation</h3>
                <div className="space-y-1">
                  {designDocs.map(doc => (
                    <DocumentItem
                      key={doc.id}
                      doc={doc}
                      onClick={() => {
                        onDocumentClick(doc);
                        onMarkAsRead(doc.id);
                        setActiveDocId(doc.id);
                      }}
                      isActive={activeDocId === doc.id}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Code Docs Section */}
            {codeDocs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Implementation Documentation</h3>
                <div className="space-y-1">
                  {codeDocs.map(doc => (
                    <DocumentItem
                      key={doc.id}
                      doc={doc}
                      onClick={() => {
                        onDocumentClick(doc);
                        onMarkAsRead(doc.id);
                        setActiveDocId(doc.id);
                      }}
                      isActive={activeDocId === doc.id}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Init Docs Section */}
            {initDocs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Init Documentation</h3>
                <div className="space-y-1">
                  {initDocs.map(doc => (
                    <DocumentItem
                      key={doc.id}
                      doc={doc}
                      onClick={() => {
                        onDocumentClick(doc);
                        onMarkAsRead(doc.id);
                        setActiveDocId(doc.id);
                      }}
                      isActive={activeDocId === doc.id}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Search Results Section */}
            {searchDocs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Search Results</h3>
                <div className="space-y-1">
                  {searchDocs.map(doc => (
                    <DocumentItem
                      key={doc.id}
                      doc={doc}
                      onClick={() => {
                        onDocumentClick(doc);
                        onMarkAsRead(doc.id);
                        setActiveDocId(doc.id);
                      }}
                      isActive={activeDocId === doc.id}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* All Documents Menu */}
            <div className="pt-4">
              <DocDropdownMenu 
                documents={documents as HookDocItem[]}
                onDocumentClick={(doc) => {
                  onDocumentClick(doc as DocItemExtended);
                  onMarkAsRead(doc.id);
                  setActiveDocId(doc.id);
                }}
                onMarkAsRead={onMarkAsRead}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DocumentItemProps {
  doc: DocItemExtended;
  onClick: () => void;
  isActive: boolean;
}

const DocumentItem = ({ doc, onClick, isActive }: DocumentItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-xs ${
        isActive 
          ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]" 
          : "hover:bg-[rgb(var(--muted))]"
      } ${!doc.read ? "font-semibold" : ""}`}
    >
      <div className="flex items-center">
        <span className="truncate">{doc.title}</span>
        {!doc.read && (
          <span className="ml-2 w-2 h-2 rounded-full bg-[rgb(var(--primary))]"></span>
        )}
        <span className="ml-auto text-[10px] opacity-70">
          {doc.source === 'claude' ? 'Claude' : 'Perplexity'}
        </span>
      </div>
    </button>
  );
}; 