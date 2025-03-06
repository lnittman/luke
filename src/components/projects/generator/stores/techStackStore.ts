import { create } from 'zustand';
import { TechStackOption } from '../interfaces';

/**
 * Tech Stack State Interface
 */
interface TechStackState {
  // Tech selection
  selectedTechStack: TechStackOption | null;
  selectedTechs: string[];
  discoveredTechs: Array<{name: string; documentationUrl: string}>;
  
  // Actions
  setSelectedTechStack: (stack: TechStackOption | null) => void;
  setSelectedTechs: (techs: string[]) => void;
  toggleTechSelection: (techName: string) => void;
  addDiscoveredTech: (tech: {name: string; documentationUrl: string}) => void;
  setDiscoveredTechs: (techs: Array<{name: string; documentationUrl: string}>) => void;
  resetTechState: () => void;
}

/**
 * Tech Stack Store
 * Manages tech stack selection state
 */
export const useTechStackStore = create<TechStackState>((set) => ({
  // Initial state
  selectedTechStack: 'Next.js',
  selectedTechs: [],
  discoveredTechs: [],
  
  // Actions
  setSelectedTechStack: (stack) => set({ selectedTechStack: stack }),
  
  setSelectedTechs: (techs) => set({ selectedTechs: techs }),
  
  toggleTechSelection: (techName) => set((state) => ({
    selectedTechs: state.selectedTechs.includes(techName)
      ? state.selectedTechs.filter(tech => tech !== techName)
      : [...state.selectedTechs, techName]
  })),
  
  addDiscoveredTech: (tech) => set((state) => ({
    discoveredTechs: [...state.discoveredTechs, tech]
  })),
  
  setDiscoveredTechs: (techs) => set({ discoveredTechs: techs }),
  
  resetTechState: () => set({
    selectedTechStack: 'Next.js',
    selectedTechs: [],
    discoveredTechs: []
  })
})); 