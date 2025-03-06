import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Project } from '@/utils/constants/projects';

// Import stores
import { useProjectStore } from '../stores/projectStore';
import { useTechStackStore } from '../stores/techStackStore';
import { useDocumentStore } from '../stores/documentStore';

// Import templates and constants
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../prompts';
import { generateDesignDoc, generateImplementationDoc, generateIndexDoc } from '../templates/documentation';
import { TECH_STACK_DOCS, GENERALIZED_INIT_MD } from '../templates';

// Import types
import { Message, ProjectGenerationResponse, TechStackOption } from '../interfaces';

// Import API client and error handling
import { generateProject, fetchWithRetry } from '../api/projectApi';
import { handleApiError, ErrorType } from '../utils/errorHandler';

/**
 * Project Generation Hook
 * Encapsulates project generation logic
 */
export const useProjectGeneration = () => {
  // Access stores
  const { 
    project, projectName, inputValue, 
    isGenerating, isGeneratingDocs,
    setProject, setProjectName, setInputValue,
    startGeneration, completeGeneration,
    startDocsGeneration, completeDocsGeneration
  } = useProjectStore();
  
  const { 
    selectedTechStack, selectedTechs, discoveredTechs,
    setSelectedTechStack, setSelectedTechs, setDiscoveredTechs
  } = useTechStackStore();
  
  const {
    documents, addDocument, clearDocuments
  } = useDocumentStore();
  
  /**
   * Simulates sequential document generation
   */
  const simulateSequentialDocumentGeneration = useCallback((documents: Record<string, string>) => {
    // First tech.md with Perplexity
    addDocument('Tech Stack', "# Technology Glossary\nGenerating...", 'perplexity', 'tech');
    
    setTimeout(() => {
      addDocument('Tech Stack', documents.tech, 'perplexity', 'tech');
      
      // Then index.md with Claude
      setTimeout(() => {
        addDocument('Overview', "# Project Overview\nGenerating...", 'claude', 'index');
        
        setTimeout(() => {
          addDocument('Overview', documents.index, 'claude', 'index');
          
          // Then design.md with Claude
          setTimeout(() => {
            addDocument('Design', "# Design Guide\nGenerating...", 'claude', 'design');
            
            setTimeout(() => {
              addDocument('Design', documents.design, 'claude', 'design');
              
              // Then code.md with Claude
              setTimeout(() => {
                addDocument('Implementation', "# Implementation Guide\nGenerating...", 'claude', 'code');
                
                setTimeout(() => {
                  addDocument('Implementation', documents.code, 'claude', 'code');
                  
                  // Finally init.md with Claude
                  setTimeout(() => {
                    addDocument('AI Init', "# AI Assistant Guide\nGenerating...", 'claude', 'init');
                    
                    setTimeout(() => {
                      addDocument('AI Init', documents.init, 'claude', 'init');
                    }, 500);
                  }, 1000);
                }, 500);
              }, 1000);
            }, 500);
          }, 1000);
        }, 500);
      }, 1000);
    }, 500);
  }, [addDocument]);
  
  /**
   * Handles form submission for project generation
   */
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
    
    try {
      // Generate project name if not provided
      const finalProjectName = projectName.trim() || `Project ${new Date().toLocaleDateString()}`;
      
      // Call the API to generate the project
      const { project, documents } = await fetchWithRetry(() => 
        generateProject(inputValue, finalProjectName, selectedTechStack)
      );
      
      // Generate documents sequentially
      simulateSequentialDocumentGeneration(documents);
      
      // Update project state
      setProject(project);
      
      // Complete generation
      completeGeneration();
      
      toast.success(SUCCESS_MESSAGES.projectGenerated(finalProjectName));
    } catch (error) {
      console.error('Error generating project:', error);
      completeGeneration();
      handleApiError(error, '/api/projects/generate');
    }
  }, [
    inputValue, projectName, selectedTechStack, 
    setProject, startGeneration, completeGeneration,
    clearDocuments, simulateSequentialDocumentGeneration
  ]);
  
  /**
   * Generates and downloads project documentation
   */
  const generateAndDownloadDocs = useCallback(async (project: Project) => {
    try {
      startDocsGeneration();
      
      // TODO: Implement actual ZIP generation and download
      // For now we're just showing a success message
      
      setTimeout(() => {
        completeDocsGeneration();
        toast.success(SUCCESS_MESSAGES.docsDownloaded(project.name));
      }, 1500);
    } catch (error) {
      console.error('Error downloading docs:', error);
      completeDocsGeneration();
      toast.error(ERROR_MESSAGES.documentGeneration);
    }
  }, [startDocsGeneration, completeDocsGeneration]);
  
  return {
    // State
    project,
    projectName,
    inputValue,
    isGenerating,
    isGeneratingDocs,
    selectedTechStack,
    selectedTechs,
    discoveredTechs,
    documents,
    
    // Actions
    setProjectName,
    setInputValue,
    setSelectedTechStack,
    setSelectedTechs,
    setDiscoveredTechs,
    handleSubmit,
    generateAndDownloadDocs,
    
    // Utilities
    simulateSequentialDocumentGeneration
  };
}; 