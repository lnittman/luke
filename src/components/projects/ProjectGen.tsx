import { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Import types and interfaces
import { Project } from '@/utils/constants/projects';
import { ProjectGeneratorProps, Message, SearchResult, DocItemExtended } from './generator/interfaces';

// Import stores
import { useProjectStore, useTechStackStore, useDocumentStore, useMessageStore } from './generator/stores';

// Import API clients and error handling
import { generateProject, generateRandomIdea, fetchWithRetry } from './generator/api/projectApi';
import { handleApiError } from './generator/utils/errorHandler';

// Import utility functions and constants
import { simulateSequentialDocumentGeneration } from './generator/utils';
import { WELCOME_MESSAGE, DOCUMENT_LABELS, SUCCESS_MESSAGES, ERROR_MESSAGES } from './generator/prompts';
import { getTechStackDocs } from './generator/templates/index';

// Import custom hooks
import { DocSource } from '@/lib/hooks/useDocumentManager';

// Import components
import { ProjectLayout, LeftPanel, RightPanel } from './generator/ProjectLayout';
import { TechStackSelector } from './generator/TechStackSelector';
import { ProjectForm } from './generator/ProjectForm';
import { DocumentViewer } from './generator/DocumentViewer';
import { MessageList } from './generator/MessageList';
import { SearchResultsDisplay } from './generator/SearchResultsDisplay';
import { ProjectControls } from './generator/ProjectControls';

/**
 * ProjectGen - Modular implementation of the project generator
 * Uses Zustand stores for state management
 */
export const ProjectGen = ({ onProjectGenerated, onCancel, techData }: ProjectGeneratorProps) => {
  // Store hooks for state management
  const {
    project,
    projectName,
    inputValue,
    isGenerating,
    isGeneratingDocs,
    setProject,
    setProjectName,
    setInputValue,
    startGeneration,
    completeGeneration,
    startDocsGeneration,
    completeDocsGeneration,
    resetProject
  } = useProjectStore();
  
  const {
    selectedTechStack,
    selectedTechs,
    discoveredTechs,
    setSelectedTechStack,
    setSelectedTechs,
    toggleTechSelection: toggleTech,
    setDiscoveredTechs
  } = useTechStackStore();
  
  const {
    documents,
    activeDocId,
    addDocument,
    markAsRead,
    setActiveDocId,
    clearDocuments
  } = useDocumentStore();
  
  const { messages, addUserMessage, addAssistantMessage, addErrorMessage, addSuccessMessage } = useMessageStore();
  
  // Input refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Idea generation state (not yet in a store)
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  // Effects
  useEffect(() => {
    // Initialize welcome message if messages is empty
    if (messages.length === 0) {
      addAssistantMessage(WELCOME_MESSAGE);
    }
    
    // Focus on name input field when component mounts
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
    
    // Reset stores when component mounts
    resetProject();
    
    // If tech data is provided, set up the tech stack
    if (techData) {
      setSelectedTechStack('Other');
      const techNames = Object.keys(techData.relationships || {});
      setSelectedTechs(techNames);
      
      // If this is a new generation, add the tech document
      if (techData.isNewGeneration && techData.techMd) {
        addDocument('Tech Stack', techData.techMd, 'perplexity', 'tech');
      }
    } else {
      // Set default tech stack
      setSelectedTechStack('Next.js');
    }
  }, [techData, resetProject, messages.length, addAssistantMessage, 
      nameInputRef, setSelectedTechStack, setSelectedTechs, addDocument]);
  
  // Document handling functions
  const updateDocument = useCallback((docType: string, content: string, source: DocSource) => {
    const docTypeInfo = DOCUMENT_LABELS[docType] || { emoji: '📄', title: 'Document' };
    addDocument(docTypeInfo.title, content, source, docType as DocItemExtended['type']);
  }, [addDocument]);
  
  // Generate and download documentation
  const generateAndDownloadDocs = useCallback(async () => {
    if (!project) return;
    
    startDocsGeneration();
    
    try {
      const zip = new JSZip();
      
      // Add all documents to the zip file
      documents.forEach(doc => {
        if (doc.content) {
          const filename = `${doc.title.toLowerCase().replace(/\s+/g, '-')}.md`;
          zip.file(filename, doc.content);
        }
      });
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Save the zip file
      saveAs(zipBlob, `${project.name.toLowerCase().replace(/\s+/g, '-')}-docs.zip`);
      
      addSuccessMessage(SUCCESS_MESSAGES.docsDownloaded(project.name));
    } catch (error) {
      handleApiError(error, 'document-download');
    } finally {
      completeDocsGeneration();
    }
  }, [project, documents, startDocsGeneration, completeDocsGeneration, addSuccessMessage]);
  
  // Generate random app idea
  const generateRandomAppIdea = useCallback(async () => {
    try {
      setIsGeneratingIdea(true);
      setSearchProgress(0);
      setSearchResults([]);
      
      // Simulate search progress
      const progressInterval = setInterval(() => {
        setSearchProgress((prev: number) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 500);
      
      // Call API to generate a random idea
      const { idea, discoveredTechs } = await fetchWithRetry(() => 
        generateRandomIdea(selectedTechStack || 'Next.js')
      );
      
      // When we get the response, update UI with discoveries
      if (discoveredTechs && discoveredTechs.length > 0) {
        setDiscoveredTechs(discoveredTechs);
        
        // Create search results from discovered technologies
        const results: SearchResult[] = discoveredTechs.map(tech => ({
          name: tech.name,
          relevance: 0.8 + Math.random() * 0.2, // Random relevance between 0.8 and 1.0
          description: `${tech.name} is a popular choice for modern applications.`,
          url: tech.documentationUrl || `https://www.google.com/search?q=${encodeURIComponent(tech.name)}`
        }));
        
        // Show results sequentially for better UX
        setTimeout(() => setSearchResults([results[0]]), 500);
        setTimeout(() => setSearchResults(results.slice(0, 2)), 1000);
        setTimeout(() => setSearchResults(results.slice(0, 3)), 1500);
        setTimeout(() => setSearchResults(results), 2000);
      }
      
      // Clear progress interval and set to 100%
      clearInterval(progressInterval);
      setSearchProgress(100);
      
      // Set the input value to the generated idea
      setInputValue(idea);
      
      // Complete the idea generation
      setTimeout(() => {
        setIsGeneratingIdea(false);
        addSuccessMessage(SUCCESS_MESSAGES.randomIdeaGenerated);
      }, 1000);
    } catch (error) {
      console.error('Error generating random app idea:', error);
      setIsGeneratingIdea(false);
      handleApiError(error, '/api/ideas/random');
    }
  }, [selectedTechStack, setInputValue, setDiscoveredTechs, addSuccessMessage]);
  
  // Handle discovered tech click
  const handleDiscoveredTechClick = useCallback((tech: {name: string; documentationUrl: string}) => {
    setInputValue((prev: string) => {
      if (prev.includes(tech.name)) return prev;
      return `${prev}\n\nIncorporating ${tech.name} for enhanced functionality.`;
    });
    
    addSuccessMessage(SUCCESS_MESSAGES.techDiscovered(tech.name));
  }, [setInputValue, addSuccessMessage]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (!selectedTechStack) {
      toast.error(ERROR_MESSAGES.noSelectedTech);
      return;
    }
    
    startGeneration();
    
    // Clear existing documents
    clearDocuments();
    
    // Add user message
    addUserMessage(inputValue);
    
    try {
      // Generate project name if not provided
      const finalProjectName = projectName.trim() || `Project ${new Date().toLocaleDateString()}`;
      
      // Call the API to generate the project with retries
      const { project, documents } = await fetchWithRetry(() => 
        generateProject(inputValue, finalProjectName, selectedTechStack)
      );
      
      // Store the generated project
      setProject(project);
      
      // Simulate sequential document generation for better UX
      simulateSequentialDocumentGeneration(documents, updateDocument);
      
      // Add success message
      addAssistantMessage(`I've generated ${finalProjectName} for you! You can view the documentation and download it.`);
      
      // Notify parent component
      if (onProjectGenerated) {
        onProjectGenerated(project);
      }
      
      addSuccessMessage(SUCCESS_MESSAGES.projectGenerated(finalProjectName));
    } catch (error) {
      console.error('Error generating project:', error);
      
      // Add error message
      addErrorMessage(error instanceof Error ? error.message : 'Failed to generate project');
      
      handleApiError(error, '/api/projects/generate');
    } finally {
      completeGeneration();
    }
  }, [
    inputValue, 
    projectName, 
    selectedTechStack, 
    startGeneration, 
    completeGeneration, 
    clearDocuments, 
    setProject,
    updateDocument,
    onProjectGenerated,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage
  ]);
  
  // Handle save project
  const handleSaveProject = useCallback(() => {
    if (project) {
      // TODO: Implement save project to database
      toast.success(SUCCESS_MESSAGES.projectSaved(project.name));
      
      // Notify parent component
      if (onProjectGenerated) {
        onProjectGenerated(project);
      }
    }
  }, [project, onProjectGenerated]);
  
  // Handle document click
  const handleDocumentClick = useCallback((doc: DocItemExtended) => {
    setActiveDocId(doc.id);
    markAsRead(doc.id);
  }, [setActiveDocId, markAsRead]);
  
  return (
    <ProjectLayout>
      <LeftPanel>
        {/* Tech Stack Selection */}
        <div className="p-4 border-b border-[rgb(var(--border))]">
          <h2 className="text-lg font-semibold mb-4">Technology Stack</h2>
          <TechStackSelector
            selectedTechStack={selectedTechStack}
            setSelectedTechStack={setSelectedTechStack}
            selectedTechs={selectedTechs}
            setSelectedTechs={setSelectedTechs}
            discoveredTechs={discoveredTechs}
          />
        </div>
        
        {/* Project Form */}
        <div className="p-4 border-b border-[rgb(var(--border))] flex-grow overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Project Details</h2>
          <ProjectForm
            projectName={projectName}
            setProjectName={setProjectName}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            isGenerating={isGenerating}
            generateRandomAppIdea={generateRandomAppIdea}
            isGeneratingIdea={isGeneratingIdea}
            nameInputRef={nameInputRef}
            inputRef={inputRef}
          />
          
          {/* Search Results Display */}
          <AnimatePresence>
            {isGeneratingIdea && (
              <SearchResultsDisplay
                searchResults={searchResults}
                isSearching={isGeneratingIdea}
                progress={searchProgress}
                discoveredTechs={discoveredTechs}
                onTechClick={handleDiscoveredTechClick}
              />
            )}
          </AnimatePresence>
        </div>
        
        {/* Project Controls */}
        {project && (
          <ProjectControls
            isGenerating={isGenerating}
            isGeneratingDocs={isGeneratingDocs}
            hasProject={!!project}
            projectName={project.name}
            onDownloadDocs={generateAndDownloadDocs}
            onSaveProject={handleSaveProject}
            onCancel={onCancel}
          />
        )}
      </LeftPanel>
      
      <RightPanel>
        {/* Document Viewer */}
        <div className="h-3/4 overflow-hidden flex flex-col">
          <DocumentViewer
            documents={documents}
            isGenerating={isGenerating}
            onDocumentClick={handleDocumentClick}
            onMarkAsRead={markAsRead}
            activeDocId={activeDocId}
            setActiveDocId={setActiveDocId}
          />
        </div>
        
        {/* Message List */}
        <div className="h-1/4 border-t border-[rgb(var(--border))] overflow-hidden">
          <MessageList messages={messages} />
        </div>
      </RightPanel>
    </ProjectLayout>
  );
}; 