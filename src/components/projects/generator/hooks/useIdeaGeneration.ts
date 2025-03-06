import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Import stores
import { useProjectStore } from '../stores/projectStore';
import { useTechStackStore } from '../stores/techStackStore';

// Import constants
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../prompts';
import { SearchResult } from '../interfaces';

// Import API client and error handling
import { generateRandomIdea, fetchWithRetry } from '../api/projectApi';
import { handleApiError, ErrorType } from '../utils/errorHandler';

/**
 * Hook for managing idea generation functionality
 */
export const useIdeaGeneration = () => {
  // Access stores
  const { setInputValue } = useProjectStore();
  const { setDiscoveredTechs } = useTechStackStore();
  
  // Local state
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  /**
   * Generates a random app idea and updates the input value
   */
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
        generateRandomIdea(useTechStackStore.getState().selectedTechStack || 'Next.js')
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
        toast.success(SUCCESS_MESSAGES.randomIdeaGenerated);
      }, 1000);
    } catch (error) {
      console.error('Error generating random app idea:', error);
      setIsGeneratingIdea(false);
      handleApiError(error, '/api/ideas/random');
    }
  }, [setInputValue, setDiscoveredTechs, setSearchResults]);
  
  /**
   * Handles when a user clicks on a discovered technology
   */
  const handleDiscoveredTechClick = useCallback((tech: string) => {
    setInputValue(prev => {
      if (prev.includes(tech)) return prev;
      return `${prev}\n\nIncorporating ${tech} for enhanced functionality.`;
    });
    
    toast.success(`Added ${tech} to your project description!`);
  }, [setInputValue]);
  
  return {
    // State
    isGeneratingIdea,
    searchProgress,
    searchResults,
    
    // Actions
    generateRandomAppIdea,
    handleDiscoveredTechClick,
  };
}; 