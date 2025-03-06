import { DocItem as HookDocItem, DocSource } from '@/lib/hooks/useDocumentManager';
import { TechStack as LLMTechStack } from '@/lib/llm';
import { Project } from '@/utils/constants/projects';
import { ReactNode } from 'react';

// Tech stack options (exported from TechStackSelector)
export type TechStackOption = 'Next.js' | 'Apple' | 'CLI' | 'Other';

// Message format for conversation
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Project generation response format
export interface ProjectGenerationResponse {
  project: Project;
  documents: Record<string, string>;
}

// Tech stack format with typed properties
export interface TechStack extends LLMTechStack {}

// Search result format
export interface SearchResult {
  name: string;
  relevance: number;
  description: string;
  url: string;
  category?: string;
  links?: string[];
}

// Extended DocItem for project generator
export interface DocItemExtended extends HookDocItem {
  type?: 'tech' | 'index' | 'design' | 'code' | 'init' | 'search' | 'implementation';
  source: DocSource;
}

// Main ProjectGenerator props
export interface ProjectGeneratorProps {
  onProjectGenerated: (project: Project) => void;
  onCancel: () => void;
  techData?: {
    techMd: string;
    relationships: Record<string, string[]>;
    isNewGeneration: boolean;
  } | null;
}

// Props for each section component (example pattern)
export interface ComponentBaseProps {
  className?: string;
  children?: ReactNode;
}

// ProjectForm props
export interface ProjectFormProps {
  projectName: string;
  setProjectName: (name: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isGenerating: boolean;
  generateRandomAppIdea: () => Promise<void>;
  isGeneratingIdea: boolean;
  nameInputRef?: React.RefObject<HTMLInputElement>;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

// TechStackSelector props 
export interface TechStackSelectorProps {
  selectedTechStack: TechStackOption | null;
  setSelectedTechStack: (stack: TechStackOption) => void;
  selectedTechs: string[];
  setSelectedTechs: (techs: string[]) => void;
  discoveredTechs: Array<{name: string; documentationUrl: string}>;
}

// DocumentViewer props
export interface DocumentViewerProps {
  documents: DocItemExtended[];
  isGenerating?: boolean;
  onDocumentClick?: (doc: DocItemExtended) => void;
  onMarkAsRead?: (id: string) => void;
  activeDocId?: string | null;
  setActiveDocId?: (id: string | null) => void;
}

// MessageList props
export interface MessageListProps {
  messages: Message[];
}

// Search results display props
export interface SearchResultsDisplayProps {
  searchResults: SearchResult[];
  isSearching?: boolean;
  progress: number;
  discoveredTechs: Array<{name: string; documentationUrl: string}>;
  onTechClick?: (tech: {name: string; documentationUrl: string}) => void;
}

// Project controls props
export interface ProjectControlsProps {
  isGenerating: boolean;
  isGeneratingDocs: boolean;
  hasProject?: boolean;
  projectName: string;
  onDownloadDocs: () => void;
  onSaveProject: () => void;
  onCancel: () => void;
} 