'use client';

import { useState } from 'react';
import type { DocumentTypes } from '@/app/projects/streaming-demo/page';

interface GenerateDocumentsButtonProps {
  documentTypes: DocumentTypes;
}

export function GenerateDocumentsButton({ documentTypes }: GenerateDocumentsButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateClick = async () => {
    // This is where you would normally trigger an API call
    // For this demo, we'll just set a flag that our display component will detect
    setIsGenerating(true);
    
    // Store a flag in localStorage to communicate with the DocumentsDisplay component
    localStorage.setItem('streamingDemo:isGenerating', 'true');
    localStorage.setItem('streamingDemo:startTime', Date.now().toString());
    
    // Simulating completion after all documents are generated
    setTimeout(() => {
      localStorage.setItem('streamingDemo:isGenerating', 'false');
      setIsGenerating(false);
    }, documentTypes.length * 2000); // Roughly the time it takes to "generate" all docs
  };
  
  return (
    <button 
      onClick={handleGenerateClick}
      disabled={isGenerating}
      className={`w-full py-2 px-4 text-white rounded-md transition-colors ${
        isGenerating 
          ? 'bg-blue-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isGenerating ? 'Generating...' : 'Generate Documents'}
    </button>
  );
} 