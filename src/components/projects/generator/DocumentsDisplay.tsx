'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SimpleStreamingDocViewer } from './SimpleStreamingDocViewer';
import { generateSampleContent } from '@/app/projects/streaming-demo/page';
import type { DocumentParams } from '@/app/projects/streaming-demo/page';

export function DocumentsDisplay({ documentTypes, projectName = 'Project' }: DocumentParams) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Simulate document generation by checking localStorage
  useEffect(() => {
    // Initial check of generation state
    const storedIsGenerating = localStorage.getItem('streamingDemo:isGenerating') === 'true';
    setIsGenerating(storedIsGenerating);
    
    // Function to check for changes to generation state
    const checkGenerationState = () => {
      const currentIsGenerating = localStorage.getItem('streamingDemo:isGenerating') === 'true';
      setIsGenerating(currentIsGenerating);
      
      if (currentIsGenerating) {
        const startTime = parseInt(localStorage.getItem('streamingDemo:startTime') || '0');
        const elapsedTime = Date.now() - startTime;
        
        // Calculate which documents should be visible based on elapsed time
        // Each document takes 2 seconds to "generate"
        const docsGenerated = Math.min(Math.floor(elapsedTime / 2000), documentTypes.length);
        
        // Create documents that haven't been added yet
        if (docsGenerated > documents.length) {
          const newDocs = [...documents];
          
          for (let i = documents.length; i < docsGenerated; i++) {
            const docType = documentTypes[i];
            newDocs.push({
              id: uuidv4(),
              title: `${projectName} ${docType.charAt(0).toUpperCase() + docType.slice(1)}`,
              content: generateSampleContent(projectName, docType),
              type: docType,
              timestamp: new Date()
            });
          }
          
          setDocuments(newDocs);
        }
      }
    };
    
    // Check every 500ms for changes
    const interval = setInterval(checkGenerationState, 500);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [documents.length, documentTypes, projectName]);
  
  return (
    <SimpleStreamingDocViewer 
      streamState={{ 
        content: documents,
        isGenerating
      }} 
    />
  );
} 