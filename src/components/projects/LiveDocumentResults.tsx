import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Clipboard, X, Check, ChevronRight, Database, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { saveAs } from 'file-saver';

interface DocumentItem {
  type: 'tech' | 'index' | 'design' | 'code' | 'init';
  content: string | null;
  status: 'pending' | 'generating' | 'completed';
  source?: 'perplexity' | 'claude';
}

interface LiveDocumentResultsProps {
  documents: Record<string, string | null>;
  documentSources?: Record<string, 'perplexity' | 'claude'>;
  isGenerating: boolean;
  onComplete?: () => void;
}

const documentLabels: Record<string, { emoji: string; title: string }> = {
  tech: { emoji: '📚', title: 'Tech Stack' },
  index: { emoji: '📝', title: 'Overview' },
  design: { emoji: '🎨', title: 'Design' },
  code: { emoji: '💻', title: 'Code' },
  init: { emoji: '🚀', title: 'AI Init' },
};

export const LiveDocumentResults: React.FC<LiveDocumentResultsProps> = ({ 
  documents, 
  documentSources = {
    tech: 'perplexity',
    index: 'claude',
    design: 'claude',
    code: 'claude',
    init: 'claude',
  },
  isGenerating,
  onComplete 
}) => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  // Create document items array with status
  const documentItems = Object.keys(documentLabels).map(key => ({
    type: key,
    content: documents[key],
    status: !documents[key] 
      ? 'pending' 
      : documents[key] && documents[key]?.length > 0 
        ? 'completed' 
        : 'generating',
    source: documentSources[key] || 'claude'
  }));
  
  // Get completed documents count
  const completedCount = documentItems.filter(doc => doc.status === 'completed').length;
  const totalCount = documentItems.length;
  
  // Copy document content to clipboard
  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(null), 2000);
  };
  
  // Download document
  const downloadDocument = (content: string, type: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `${type}.md`);
  };
  
  // Variants for fade-in animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div className="w-full">
      {/* Progress indicator */}
      <div className="mb-3 flex items-center gap-2">
        <div className="text-sm font-mono text-[rgb(var(--text-secondary))]">
          Generating documentation: {completedCount}/{totalCount}
        </div>
        <div className="flex-1 h-1.5 bg-[rgb(var(--surface-1)/0.2)] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[rgb(var(--accent-1)/0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Documents grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {documentItems.map((doc) => (
          <AnimatePresence key={doc.type} mode="wait">
            <motion.div 
              key={`${doc.type}-${doc.status}`}
              variants={itemVariants}
              className={`
                relative rounded-lg overflow-hidden cursor-pointer
                ${doc.status === 'pending' ? 'glass-effect opacity-50' : ''}
                ${doc.status === 'generating' ? 'glass-effect animate-pulse' : ''}
                ${doc.status === 'completed' ? `glass-effect hover:bg-[rgb(var(--surface-1)/0.3)] ${doc.source === 'perplexity' ? 'border-2 border-blue-400/30' : 'border-2 border-purple-400/30'}` : ''}
              `}
              onClick={() => doc.status === 'completed' && setSelectedDoc(doc.type)}
            >
              <div className="p-4 flex flex-col items-center justify-center min-h-[100px]">
                <div className="text-2xl mb-2">{documentLabels[doc.type].emoji}</div>
                <div className="font-mono text-sm text-center">{documentLabels[doc.type].title}</div>
                
                {/* Source indicator */}
                {doc.status === 'completed' && (
                  <div className="absolute top-2 right-2">
                    {doc.source === 'perplexity' ? (
                      <Database size={14} className="text-blue-400" />
                    ) : (
                      <Cpu size={14} className="text-purple-400" />
                    )}
                  </div>
                )}
                
                {doc.status === 'generating' && (
                  <motion.div 
                    className={`mt-2 text-xs ${doc.source === 'perplexity' ? 'text-blue-400' : 'text-purple-400'}`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    {doc.source === 'perplexity' ? 'searching...' : 'generating...'}
                  </motion.div>
                )}
                
                {doc.status === 'completed' && (
                  <div className="mt-2 flex items-center gap-2">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        doc.content && copyToClipboard(doc.content, doc.type);
                      }}
                      className="p-1 rounded-full bg-[rgb(var(--surface-1)/0.3)] hover:bg-[rgb(var(--surface-1)/0.5)]"
                    >
                      {copySuccess === doc.type ? <Check size={14} /> : <Clipboard size={14} />}
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        doc.content && downloadDocument(doc.content, doc.type);
                      }}
                      className="p-1 rounded-full bg-[rgb(var(--surface-1)/0.3)] hover:bg-[rgb(var(--surface-1)/0.5)]"
                    >
                      <Download size={14} />
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="p-1 rounded-full bg-[rgb(var(--surface-1)/0.3)] hover:bg-[rgb(var(--surface-1)/0.5)]"
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
      </motion.div>
      
      {/* Document viewer modal */}
      <Dialog open={!!selectedDoc} onOpenChange={(open: boolean) => !open && setSelectedDoc(null)}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0">
          {selectedDoc && documents[selectedDoc] && (
            <div className="flex flex-col h-full">
              <div className={`flex items-center justify-between p-4 border-b ${documentSources[selectedDoc] === 'perplexity' ? 'border-blue-400/30 bg-blue-900/10' : 'border-purple-400/30 bg-purple-900/10'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{documentLabels[selectedDoc].emoji}</span>
                  <h2 className="font-mono text-lg">{documentLabels[selectedDoc].title}</h2>
                  <div className={`text-xs font-mono px-2 py-1 rounded-full ${documentSources[selectedDoc] === 'perplexity' ? 'bg-blue-400/20 text-blue-200' : 'bg-purple-400/20 text-purple-200'}`}>
                    {documentSources[selectedDoc] === 'perplexity' ? 'Perplexity' : 'Claude AI'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    className="flex items-center"
                    onClick={() => documents[selectedDoc] && copyToClipboard(documents[selectedDoc]!, selectedDoc)}
                  >
                    {copySuccess === selectedDoc ? <Check size={16} className="mr-2" /> : <Clipboard size={16} className="mr-2" />}
                    Copy
                  </Button>
                  <Button 
                    className="flex items-center"
                    onClick={() => documents[selectedDoc] && downloadDocument(documents[selectedDoc]!, selectedDoc)}
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button 
                    className="flex items-center"
                    onClick={() => setSelectedDoc(null)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 markdown-content">
                <ReactMarkdown>{documents[selectedDoc] || ''}</ReactMarkdown>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 