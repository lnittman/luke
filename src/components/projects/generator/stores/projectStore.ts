import { create } from 'zustand';
import { Project } from '@/utils/constants/projects';

/**
 * Project State Interface
 */
interface ProjectState {
  // Project data
  project: Project | null;
  projectName: string;
  inputValue: string;
  
  // Generation status
  isGenerating: boolean;
  isGeneratingDocs: boolean;
  
  // Actions
  setProject: (project: Project | null) => void;
  setProjectName: (name: string) => void;
  setInputValue: (value: string) => void;
  startGeneration: () => void;
  completeGeneration: () => void;
  startDocsGeneration: () => void;
  completeDocsGeneration: () => void;
  resetProject: () => void;
}

/**
 * Project Store
 * Manages project generation state
 */
export const useProjectStore = create<ProjectState>((set) => ({
  // Initial state
  project: null,
  projectName: '',
  inputValue: '',
  isGenerating: false,
  isGeneratingDocs: false,
  
  // Actions
  setProject: (project) => set({ project }),
  setProjectName: (projectName) => set({ projectName }),
  setInputValue: (inputValue) => set({ inputValue }),
  
  startGeneration: () => set({ isGenerating: true }),
  completeGeneration: () => set({ isGenerating: false }),
  
  startDocsGeneration: () => set({ isGeneratingDocs: true }),
  completeDocsGeneration: () => set({ isGeneratingDocs: false }),
  
  resetProject: () => set({
    project: null,
    projectName: '',
    inputValue: '',
    isGenerating: false,
    isGeneratingDocs: false
  })
})); 