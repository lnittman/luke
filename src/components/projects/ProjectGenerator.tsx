import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Project } from '@/utils/constants/projects';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProjectGenerationResponse, TechStack } from '@/lib/llm';
import { TechPill } from '@/components/TechPill';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useDocumentManager, DocItem } from '@/lib/hooks/useDocumentManager';
import { Toaster } from 'sonner';
import { X } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { DocDropdownMenu } from '@/components/DocDropdownMenu';

interface ProjectGeneratorProps {
  onProjectGenerated: (project: Project) => void;
  onCancel: () => void;
  techData?: {
    techMd: string;
    relationships: Record<string, string[]>;
    isNewGeneration: boolean;
  } | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Documents {
  init: string;
  design: string;
  implementation: string;
}

// Tech stack options
type TechStackOption = 'Next.js' | 'Apple' | 'CLI' | 'Other';

// Tech stack emojis
const TECH_STACK_EMOJIS: Record<TechStackOption, string> = {
  "Next.js": "▲",
  "Apple": "🍎",
  "CLI": "🧮",
  "Other": "🍀"
};

// Tech stack display names (lowercase for UI)
const TECH_STACK_DISPLAY_NAMES: Record<TechStackOption, string> = {
  "Next.js": "next.js",
  "Apple": "apple",
  "CLI": "cli",
  "Other": "other"
};

// Platform-specific tech stack templates
const TECH_STACK_TEMPLATES: Record<TechStackOption, TechStack> = {
  "Next.js": {
    frameworks: ["next.js", "react"],
    libraries: ["tailwindcss", "framer-motion", "shadcn-ui", "react-query"],
    apis: ["restful", "graphql"],
    tools: ["typescript", "eslint", "prisma"],
    documentationLinks: {
      "next.js": "https://nextjs.org/",
      "react": "https://reactjs.org/",
      "tailwindcss": "https://tailwindcss.com/",
      "framer-motion": "https://www.framer.com/motion/",
      "shadcn-ui": "https://ui.shadcn.com/",
      "react-query": "https://tanstack.com/query/latest",
      "graphql": "https://graphql.org/",
      "restful": "https://restfulapi.net/",
      "typescript": "https://www.typescriptlang.org/",
      "eslint": "https://eslint.org/",
      "prisma": "https://www.prisma.io/"
    }
  },
  "Apple": {
    frameworks: ["swiftui", "uikit", "coredata"],
    libraries: ["combine", "swift-concurrency"],
    apis: ["healthkit", "mapkit", "avfoundation"],
    tools: ["xcode", "swift", "swiftlint"],
    documentationLinks: {
      "swiftui": "https://developer.apple.com/xcode/swiftui/",
      "uikit": "https://developer.apple.com/documentation/uikit/",
      "coredata": "https://developer.apple.com/documentation/coredata",
      "combine": "https://developer.apple.com/documentation/combine",
      "swift-concurrency": "https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html",
      "healthkit": "https://developer.apple.com/documentation/healthkit",
      "mapkit": "https://developer.apple.com/documentation/mapkit",
      "avfoundation": "https://developer.apple.com/documentation/avfoundation",
      "xcode": "https://developer.apple.com/xcode/",
      "swift": "https://swift.org/",
      "swiftlint": "https://github.com/realm/SwiftLint"
    }
  },
  "CLI": {
    frameworks: ["node.js", "deno"],
    libraries: ["commander", "inquirer", "chalk"],
    apis: ["filesystem", "network"],
    tools: ["typescript", "jest", "esbuild"],
    documentationLinks: {
      "node.js": "https://nodejs.org/",
      "deno": "https://deno.land/",
      "commander": "https://github.com/tj/commander.js",
      "inquirer": "https://github.com/SBoudrias/Inquirer.js",
      "chalk": "https://github.com/chalk/chalk",
      "filesystem": "https://nodejs.org/api/fs.html",
      "network": "https://nodejs.org/api/http.html",
      "typescript": "https://www.typescriptlang.org/",
      "jest": "https://jestjs.io/",
      "esbuild": "https://esbuild.github.io/"
    }
  },
  "Other": {
    frameworks: [],
    libraries: [],
    apis: [],
    tools: [],
    documentationLinks: {}
  }
};

// Branded tech stack documentation templates
const TECH_STACK_DOCS: Record<TechStackOption, string> = {
  "Next.js": `# Next.js Project Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Implementation Details](#implementation-details)
- [Deployment](#deployment)
- [Development Guide](#development-guide)

## Project Overview

[Project description will appear here]

### Core Features
- Core feature 1
- Core feature 2
- Core feature 3
- Core feature 4

### Architecture Overview
- Architecture point 1
- Architecture point 2
- Architecture point 3
- Architecture point 4

## Tech Stack

### Core Framework
- **Next.js**: Server-side rendering, API routes, and file-based routing
- **React**: Component-based UI development with hooks and concurrent features
- **TypeScript**: Type-safe development with latest features

### Data & State Management
- **Prisma**: Type-safe database access with migrations
- **Vercel KV/Postgres**: Serverless data storage
- **SWR/React Query**: Data fetching with caching
- **Zustand/Jotai**: State management solutions

### UI & Styling
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Reusable component system
- **Framer Motion**: Advanced animations
- **Radix UI**: Accessible component primitives

### AI Integration
- **Vercel AI SDK**: Simplified AI implementation
- **OpenAI/Anthropic**: Model provider integrations
- **Streaming Responses**: Real-time AI outputs
- **Context Management**: Efficient prompt handling

### Development Tools
- **ESLint/Prettier**: Code quality and formatting
- **Vitest/Jest**: Testing framework
- **Storybook**: Component documentation
- **Turborepo**: Monorepo support

### Deployment
- **Vercel**: Edge-optimized deployment platform
- **CI/CD**: Automated testing and deployment
- **Analytics**: User behavior tracking
- **Monitoring**: Performance and error tracking

## Implementation Details

### Project Structure
\`\`\`
src/
├── app/             # App Router pages and layouts
│   ├── api/         # API routes
│   ├── (routes)/    # Application routes
│   └── layout.tsx   # Root layout
├── components/      # Reusable UI components
│   ├── ui/          # Base UI components
│   └── features/    # Feature-specific components
├── lib/             # Utility functions and libraries
│   ├── utils.ts     # General utilities
│   ├── db/          # Database utilities
│   └── api/         # API utilities
├── hooks/           # Custom React hooks
├── providers/       # Context providers
└── types/           # TypeScript type definitions
\`\`\`

### State Management
Next.js applications can use various state management approaches:

- **React Context**: For simpler applications
- **Zustand**: For more complex global state
- **Jotai**: For atomic state management
- **TanStack Query**: For server state management

### Data Fetching
Implement data fetching using:
- Server Components for initial data
- TanStack Query or SWR for client-side data
- Server Actions for mutations

### Authentication
Implement authentication using:
- NextAuth.js for social and auth provider integration
- Clerk for managed authentication
- Custom JWT solutions for specific requirements

## Deployment

### Vercel Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

### Environment Variables
Set up the following environment variables:
\`\`\`
DATABASE_URL=...
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
OPENAI_API_KEY=...
\`\`\`

### CI/CD
Implement CI/CD using:
- GitHub Actions for automated testing
- Vercel for preview deployments
- Automated environment promotion

## Development Guide

### Getting Started
\`\`\`bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Code Standards
- Use TypeScript for all files
- Follow ESLint rules
- Use Prettier for formatting
- Write unit tests for critical functionality

### Performance Optimization
- Implement proper code splitting
- Use Image component for optimized images
- Implement incremental static regeneration where appropriate
- Use React Server Components for data-heavy pages
`,

  "Apple": `# Apple Platform Project Documentation

## Tech Stack

### Core Frameworks
- **SwiftUI**: Declarative UI framework for all Apple platforms
- **UIKit**: Object-oriented UI framework (when needed)
- **Swift**: Primary programming language
- **Swift Concurrency**: Modern async/await pattern

### Data & Storage
- **CoreData**: Object graph and persistence framework
- **CloudKit**: iCloud sync and storage
- **SwiftData**: Modern Swift-native persistence framework
- **Combine**: Reactive programming framework

### Platform Features
- **WidgetKit**: Home screen and lock screen widgets
- **App Intents**: Siri and Shortcuts integration
- **MapKit**: Maps and location services
- **HealthKit**: Health data and fitness tracking
- **AVFoundation**: Audio and video processing
- **ARKit**: Augmented reality experiences
- **RealityKit**: 3D content and spatial computing

### Development
- **Xcode**: Primary development environment
- **SwiftLint**: Code style enforcement
- **XCTest**: Testing framework
- **Instruments**: Performance profiling
- **Swift Package Manager**: Dependency management

### Deployment
- **App Store Connect**: Distribution platform
- **TestFlight**: Beta testing
- **CI/CD**: Automated testing and deployment with Xcode Cloud
`,

  "CLI": `# Command Line Interface (CLI) Project Documentation

## Tech Stack

### Core Frameworks
- **Node.js**: JavaScript runtime
- **Deno**: Secure JavaScript/TypeScript runtime
- **TypeScript**: Type-safe JavaScript superset

### CLI Libraries
- **Commander**: Command-line interface creation
- **Inquirer**: Interactive command prompts
- **Chalk/Kleur**: Terminal styling
- **ora**: Elegant terminal spinners
- **boxen**: Create boxes in the terminal
- **yargs**: Command-line argument parsing

### Data & Processing
- **fs-extra**: Enhanced file system operations
- **glob**: Pattern matching for files
- **execa**: Process execution
- **node-fetch/got**: HTTP requests
- **yaml/json5**: Configuration file parsing

### Development
- **TypeScript**: Type-safe development
- **ESLint**: Code quality and style enforcement
- **Jest/Vitest**: Testing framework
- **esbuild/tsup**: Fast bundling tools
- **pkg**: Executable compilation

### Distribution
- **npm**: Package registry
- **GitHub Actions**: CI/CD workflow
- **semantic-release**: Automated versioning and publishing
`,

  "Other": `# Custom Project Documentation

This project uses a custom technology stack tailored to its specific requirements.

## Tech Stack

### Frameworks
- Custom framework selection based on project needs

### Libraries
- Selected based on specific project requirements

### APIs
- Determined by project functionality requirements

### Development Tools
- Chosen based on development workflow and team preferences

### Deployment
- Platform-specific solutions based on project requirements
`
};

// Generalized init.md template for all project types
const GENERALIZED_INIT_MD = `# AI Development Protocol

> This guide provides comprehensive instructions for AI assistants to implement the attached project efficiently and effectively.

## Table of Contents
- [Agent Roles and Responsibilities](#agent-roles-and-responsibilities)
- [Memory Management Protocol](#memory-management-protocol)
- [Development Workflow](#development-workflow)
- [Communication Structure](#communication-structure)
- [Code Generation Rules](#code-generation-rules)
- [Session Management](#session-management)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Agent Roles and Responsibilities

As an AI development assistant, your primary role is to:

1. **Architect**: Design and implement the core architecture following the specifications in the project document
2. **Developer**: Write clean, efficient, and well-documented code
3. **Debugger**: Identify and resolve issues in the implementation
4. **Explainer**: Provide clear explanations of your implementation decisions
5. **Guide**: Help the human navigate the development process

You should adopt a methodical, expert approach to implementation, maintaining a coherent understanding of the entire project while working on specific components.

## Memory Management Protocol

To maintain context throughout the development process:

1. **Initial Analysis**:
   - Begin by thoroughly reading all project documents
   - Create a mental model of the entire project architecture
   - Map dependencies between components

2. **Context Tracking**:
   - Before each edit, review relevant sections of the project document
   - After each edit, update your understanding of the project state
   - Maintain a mental changelog of implemented features and pending tasks

3. **Document Navigation**:
   - If multiple documentation files exist, understand their relationships
   - When facing implementation questions, refer to the appropriate section
   - Maintain cross-references between related parts of the documentation

4. **State Awareness**:
   - Track the current implementation state of each component
   - Maintain awareness of which parts are complete vs. in-progress
   - Track dependencies between components to ensure proper implementation order

5. **Knowledge Retention**:
   - Remember key design decisions and their rationales
   - Reference earlier discussions when making related decisions
   - Maintain consistency in architectural patterns

## Development Workflow

Follow this phased approach to implementation:

1. **Initialization** (P0):
   - Set up the development environment
   - Install necessary dependencies
   - Create basic project structure
   - Configure essential tools and frameworks

2. **Core Architecture** (P0):
   - Implement foundational data models
   - Set up database schema and connections
   - Create basic API structure
   - Establish state management patterns

3. **Feature Implementation** (P1):
   - Work through features in priority order
   - Implement UI components
   - Develop business logic
   - Connect front-end to back-end

4. **Integration** (P1):
   - Connect components into a cohesive system
   - Ensure proper data flow between components
   - Implement authentication and authorization
   - Set up necessary APIs and services

5. **Refinement** (P2):
   - Optimize performance
   - Improve code quality
   - Enhance user experience
   - Add polish and finesse

6. **Testing and Documentation** (P2):
   - Create comprehensive tests
   - Document API endpoints
   - Provide usage examples
   - Create deployment instructions

## Communication Structure

Adopt these communication patterns when working with humans:

1. **Progress Updates**:
   - Provide clear summaries of completed work
   - Explain current challenges
   - Outline next steps

2. **Implementation Decisions**:
   - Explain the rationale behind significant choices
   - Present alternatives that were considered
   - Highlight tradeoffs made

3. **Clarification Requests**:
   - Ask specific questions when documentation is ambiguous
   - Propose solutions when seeking validation
   - Clearly explain the impact of different options

4. **Technical Explanations**:
   - Use appropriate level of technical detail
   - Provide analogies for complex concepts
   - Break down complex topics into digestible parts

## Code Generation Rules

When writing or modifying code:

1. **Quality Standards**:
   - Write clean, maintainable code
   - Follow language-specific conventions and best practices
   - Use proper naming, formatting, and documentation

2. **Completeness**:
   - Provide fully functional implementations
   - Handle edge cases appropriately
   - Include necessary error handling

3. **Modularity**:
   - Create modular, reusable components
   - Use appropriate design patterns
   - Avoid unnecessary coupling

4. **Accessibility**:
   - Ensure code is understandable to humans
   - Add meaningful comments for complex logic
   - Structure code logically

5. **Security**:
   - Follow security best practices
   - Avoid common vulnerabilities
   - Validate inputs and sanitize data

## Session Management

To maintain continuity across development sessions:

1. **Session Start**:
   - Recap the current state of the project
   - Highlight outstanding issues
   - Set goals for the current session

2. **Session End**:
   - Summarize work completed
   - Document any unresolved issues
   - Outline next steps

3. **Context Restoration**:
   - Quickly re-familiarize with the project on return
   - Review recent changes
   - Ensure consistency with previous work

## Error Handling

When encountering issues:

1. **Error Identification**:
   - Clearly identify the problem
   - Determine the root cause
   - Assess the impact on the overall project

2. **Solution Approach**:
   - Propose specific solutions
   - Consider multiple approaches
   - Explain tradeoffs between solutions

3. **Implementation Correction**:
   - Make targeted, minimal changes to fix issues
   - Verify the fix resolves the problem
   - Ensure no regressions are introduced

## Best Practices

Throughout the development process:

1. **Code Quality**:
   - Follow the established conventions in the project
   - Maintain consistent style and patterns
   - Optimize for readability and maintainability

2. **Documentation**:
   - Document complex logic and architectural decisions
   - Provide clear API documentation
   - Include usage examples for non-obvious features

3. **Error Handling**:
   - Implement proper error handling and validation
   - Provide meaningful error messages
   - Recover gracefully from failures

4. **Edge Cases**:
   - Consider and handle edge cases
   - Validate inputs and handle unexpected data
   - Ensure stability under unusual conditions

Remember that your primary goal is to implement the project as specified in the documentation. Avoid making design decisions that contradict the provided specifications unless absolutely necessary.
`;

// Animation variants for smooth transitions
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }
};

// Component to display search results
const SearchResultsDisplay = ({ 
  results, 
  isSearching, 
  progress, 
  discoveredTechs,
  onTechClick
}: { 
  results: Array<{category: string; content: string; links: string[]}>; 
  isSearching: boolean;
  progress: number;
  discoveredTechs: Array<{name: string; documentationUrl: string}>;
  onTechClick: (tech: {name: string; documentationUrl: string}) => void;
}) => {
  return (
    <div className="mt-4 space-y-4">
      {/* Search Progress */}
      {isSearching && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-[rgb(var(--text-secondary))] mb-1">
            <span>Researching trends and technologies...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-[rgba(var(--surface-1)/0.1)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[rgba(var(--accent-1)/0.5)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
      
      {/* Discovered Technologies Section */}
      {discoveredTechs.length > 0 && (
        <div className="mt-4 animate-in fade-in slide-in-from-left duration-500">
          <h3 className="text-sm font-medium text-[rgb(var(--text-primary))] mb-2">
            Discovered Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {discoveredTechs.map((tech, idx) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
              >
                <button
                  onClick={() => onTechClick(tech)}
                  className="px-2 py-1 text-xs bg-[rgba(var(--accent-1)/0.1)] hover:bg-[rgba(var(--accent-1)/0.2)] text-[rgb(var(--text-primary))] rounded-full transition-colors"
                >
                  {tech.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results Section */}
      {results.length > 0 && (
        <div className="space-y-3 mt-4">
          {results.map((result, idx) => (
            <motion.div
              key={idx}
              className="p-3 rounded-lg bg-[rgba(var(--surface-1)/0.05)] border border-[rgba(var(--border)/0.1)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
            >
              <h4 className="text-sm font-medium text-[rgb(var(--text-primary))] mb-1">
                {result.category}
              </h4>
              <p className="text-xs text-[rgb(var(--text-secondary))] mb-2 line-clamp-3">
                {result.content}
              </p>
              {result.links && result.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.links.slice(0, 3).map((link, linkIdx) => (
                    <a
                      key={linkIdx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[rgb(var(--accent-1))] hover:underline truncate max-w-[200px]"
                    >
                      {link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectGenerator = ({ onProjectGenerated, onCancel, techData }: ProjectGeneratorProps) => {
  const [inputValue, setInputValue] = useState('');
  const [projectName, setProjectName] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: "hi there! what kind of project should create together?",
      timestamp: new Date(),
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [isGeneratingRandomIdea, setIsGeneratingRandomIdea] = useState(false);
  const [showInputForm, setShowInputForm] = useState(true);
  const [shouldTransition, setShouldTransition] = useState(false);
  const [selectedTechStack, setSelectedTechStack] = useState<TechStackOption | null>(null);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // New state variables for search results
  const [searchResults, setSearchResults] = useState<Array<{category: string; content: string; links: string[]}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [discoveredTechs, setDiscoveredTechs] = useState<Array<{name: string; documentationUrl: string}>>([]);
  const [enrichmentStatus, setEnrichmentStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle');
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const techContainerRef = useRef<HTMLDivElement>(null);

  // Focus name input on load
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Focus description input after name focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update container width for responsive tech pills
  useEffect(() => {
    if (techContainerRef.current) {
      const updateWidth = () => {
        setContainerWidth(techContainerRef.current?.offsetWidth || 0);
      };
      
      updateWidth();
      const observer = new ResizeObserver(updateWidth);
      observer.observe(techContainerRef.current);
      
      return () => {
        if (techContainerRef.current) {
          observer.unobserve(techContainerRef.current);
        }
      };
    }
  }, []);

  // Update selected techs when tech stack changes
  useEffect(() => {
    if (selectedTechStack) {
      // Auto-select core techs from the selected tech stack
      const techTemplate = TECH_STACK_TEMPLATES[selectedTechStack];
      const coreTechs = [
        ...techTemplate.frameworks.slice(0, 2),
        ...techTemplate.libraries.slice(0, 1)
      ];
      
      setSelectedTechs(coreTechs);
    } else {
      setSelectedTechs([]);
    }
  }, [selectedTechStack]);

  // Toggle tech selection
  const toggleTechSelection = (techName: string) => {
    setSelectedTechs(prev => 
      prev.includes(techName)
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  // Get tech pills for the selected stack
  const getTechPillsForStack = (stack: TechStackOption): { name: string; documentationUrl: string }[] => {
    // Start with the tech stack template
    const template = TECH_STACK_TEMPLATES[stack];
    
    // Map techs from the template to the format expected by TechPill
    const resultFromTemplate = [
      ...template.frameworks.map(name => ({ 
        name, 
        documentationUrl: template.documentationLinks[name] || '' 
      })),
      ...template.libraries.map(name => ({ 
        name, 
        documentationUrl: template.documentationLinks[name] || '' 
      })),
      ...template.apis.map(name => ({ 
        name, 
        documentationUrl: template.documentationLinks[name] || '' 
      })),
      ...template.tools.map(name => ({ 
        name, 
        documentationUrl: template.documentationLinks[name] || '' 
      }))
    ];
    
    // If we have techData, enhance the results with additional tech options
    if (techData?.techMd) {
      // Mapping of stack options to tech data keys
      const stackToDataKey: Record<TechStackOption, string> = {
        'Next.js': 'next',
        'Apple': 'apple',
        'CLI': 'cli',
        'Other': 'other'
      };
      
      // Use tech relationships from the new tech documentation system if available
      if (techData.relationships && Object.keys(techData.relationships).length > 0) {
        const stackKey = stackToDataKey[stack].toLowerCase();
        const relatedTechs = techData.relationships[stackKey] || [];
        
        // Add related techs that aren't already in the template
        const existingTechNames = new Set(resultFromTemplate.map(t => t.name.toLowerCase()));
        
        relatedTechs.forEach(tech => {
          if (!existingTechNames.has(tech.toLowerCase())) {
            resultFromTemplate.push({
              name: tech,
              documentationUrl: `https://www.google.com/search?q=${encodeURIComponent(tech)}+documentation`
            });
            existingTechNames.add(tech.toLowerCase());
          }
        });
      } else {
        // Extract tech items from the tech.md content as fallback
        const techMatches = techData.techMd.match(/["`']([a-zA-Z0-9\.\-\/]+)["`']/g) || [];
        const extractedTechs = techMatches
          .map(match => match.replace(/["`']/g, '').toLowerCase())
          .filter(tech => tech.length > 1 && !tech.includes('.com'));
        
        // Find unique technologies not already in the template
        const existingTechNames = new Set(resultFromTemplate.map(t => t.name.toLowerCase()));
        const uniqueTechs = Array.from(new Set(extractedTechs)).filter(
          tech => !existingTechNames.has(tech) && tech.length < 30
        );
        
        // Add unique techs to the result
        uniqueTechs.slice(0, 10).forEach(tech => {
          resultFromTemplate.push({
            name: tech,
            documentationUrl: `https://www.google.com/search?q=${encodeURIComponent(tech)}+documentation`
          });
        });
      }
    }
    
    return resultFromTemplate;
  };

  // Effect to complete transition after animation
  useEffect(() => {
    if (shouldTransition) {
      // Wait for fade-out animation, then switch to project view
      const timer = setTimeout(() => {
        if (generatedProject) {
          onProjectGenerated(generatedProject);
        }
      }, 800); // Extended time to allow for full fade-out
      
      return () => clearTimeout(timer);
    }
  }, [shouldTransition, onProjectGenerated]);

  // Generated project ref
  const [generatedProject, setGeneratedProject] = useState<Project | null>(null);

  // Document manager for handling all document and search results
  const {
    documents,
    updateDocument: updateExistingDocument,
    addDocument,
    addSearchResult,
    markAsRead,
    clearDocuments,
    processApiDocuments
  } = useDocumentManager();

  // We no longer need a separate state for viewing documents
  // The DocDropdownMenu handles this internally

  // Helper function to handle document creation/updates by type
  const updateDocument = (docType: string, content: string, source: 'perplexity' | 'claude') => {
    // Format the title from type (e.g., "tech" -> "Tech")
    const title = docType.charAt(0).toUpperCase() + docType.slice(1);
    
    // Check if document with this type already exists
    const existingDoc = documents.find(doc => doc.title.toLowerCase() === title.toLowerCase());
    
    if (existingDoc) {
      // Update existing document
      updateExistingDocument(existingDoc.id, { content, source });
    } else {
      // Create new document
      addDocument(title, content, source);
    }
  };

  // Function to simulate sequential document generation
  const simulateSequentialDocumentGeneration = (documents: Record<string, string>) => {
    // First tech.md with Perplexity
    updateDocument('tech', "# Technology Glossary\nGenerating...", 'perplexity');
    
    setTimeout(() => {
      updateDocument('tech', documents.tech, 'perplexity');
      
      // Then index.md with Claude
      setTimeout(() => {
        updateDocument('index', "# Project Overview\nGenerating...", 'claude');
        
        setTimeout(() => {
          updateDocument('index', documents.index, 'claude');
          
          // Then design.md with Claude
          setTimeout(() => {
            updateDocument('design', "# Design Guide\nGenerating...", 'claude');
            
            setTimeout(() => {
              updateDocument('design', documents.design, 'claude');
              
              // Then code.md with Claude
              setTimeout(() => {
                updateDocument('code', "# Implementation Guide\nGenerating...", 'claude');
                
                setTimeout(() => {
                  updateDocument('code', documents.code, 'claude');
                  
                  // Finally init.md with Claude
                  setTimeout(() => {
                    updateDocument('init', "# AI Assistant Guide\nGenerating...", 'claude');
                    
                    setTimeout(() => {
                      updateDocument('init', documents.init, 'claude');
                    }, 500);
                  }, 1000);
                }, 500);
              }, 1000);
            }, 500);
          }, 1000);
        }, 500);
      }, 1000);
    }, 500);
  };

  // Generate and download documentation
  const generateAndDownloadDocs = async (project: Project, documents: ProjectGenerationResponse['documents']) => {
    try {
      setIsGeneratingDocs(true);
      console.log('Starting document generation and ZIP creation...');
      
      // Log the available documents
      console.log('Available documents:', Object.keys(documents).filter(key => documents[key as keyof typeof documents]));
      
      // Create a new ZIP file with the full project documentation structure
      const zip = new JSZip();
      
      // Create the base folder
      const projectDocsFolder = zip.folder("project-docs");
      if (!projectDocsFolder) {
        throw new Error("Failed to create project-docs folder");
      }
      console.log('Created project-docs folder');
      
      // Create directory structure
      const docsFolder = projectDocsFolder.folder("docs");
      const techFolder = projectDocsFolder.folder("tech");
      const systemFolder = projectDocsFolder.folder("system");
      const memoryFolder = projectDocsFolder.folder("memory");
      const promptsFolder = projectDocsFolder.folder("prompts");
      const architectureFolder = projectDocsFolder.folder("architecture");
      
      // Check if all folders were created
      if (!docsFolder || !techFolder || !systemFolder || !memoryFolder || !promptsFolder || !architectureFolder) {
        console.error('Failed to create one or more required directories');
      } else {
        console.log('Created all required directories');
      }
      
      // Create subfolders for prompts
      const rolesFolder = promptsFolder?.folder("roles");
      const commandsFolder = promptsFolder?.folder("commands");
      
      if (!rolesFolder || !commandsFolder) {
        console.error('Failed to create prompt subdirectories');
      } else {
        console.log('Created prompt subdirectories');
      }
      
      // Add README.md at the root (project overview)
      projectDocsFolder.file("README.md", documents.index || 
        (selectedTechStack ? TECH_STACK_DOCS[selectedTechStack] : TECH_STACK_DOCS["Other"]));
      console.log('Added README.md to project root');
      
      // Add index.md (documentation index)
      const indexContent = `# ${project.name} Documentation Index

> This document provides a comprehensive overview of all documentation folders and files for ${project.name}.

## Documentation Structure

The project documentation is organized into the following directory structure:

\`\`\`
project-docs/
│
├── README.md                      # Human-readable GitHub README
├── index.md                       # This file - summary of all folders and files
│
├── docs/                          # Core documentation
│   ├── overview.md                # Project overview
│   ├── design.md                  # Architecture and design decisions
│   ├── code.md                    # Implementation guide
│   └── README.md                  # Summary of core documentation
│
├── tech/                          # Technology documentation
│   ├── index.md                   # Tech stack overview
│   └── README.md                  # Guide to tech documentation
│
├── system/                        # LLM system files
│   ├── init.md                    # System prompt for LLM initialization
│   ├── instructions.md            # Project-specific workflow instructions
│   └── README.md                  # Guide to using system files
│
├── memory/                        # Memory system
│   ├── index.md                   # Memory system guide
│   ├── bank_1.md                  # Initial memory bank
│   └── README.md                  # Memory usage instructions
│
├── prompts/                       # Role and workflow prompts
│   ├── roles/                     # Role-specific prompts
│   │   ├── architect.md           # Architecture-focused role
│   │   ├── developer.md           # Development-focused role
│   │   ├── designer.md            # Design-focused role
│   │   └── enterprise.md          # Business/growth-focused role
│   ├── commands/                  # Workflow command prompts
│   │   ├── setup.md               # Project setup commands
│   │   └── testing.md             # Testing workflow commands
│   └── README.md                  # Guide to using prompts
│
└── architecture/                  # Architecture documentation
    ├── sample-feature.md          # Sample architecture document
    └── README.md                  # Architecture documentation guide
\`\`\`
`;
      projectDocsFolder.file("index.md", indexContent);
      console.log('Added index.md to project root');
      
      // Add core documentation files in docs/
      if (docsFolder) {
        // overview.md - copy of the index.md document
        docsFolder.file("overview.md", documents.index || 
          (selectedTechStack ? TECH_STACK_DOCS[selectedTechStack] : TECH_STACK_DOCS["Other"]));
        
        // design.md - architecture and design
        docsFolder.file("design.md", documents.design || 
          `# ${project.name} Design\n\nThis document outlines the design principles and UI/UX guidelines for the ${project.name} project.`);
        
        // code.md - implementation guide
        docsFolder.file("code.md", documents.code || 
          `# ${project.name} Implementation\n\nThis document provides implementation details and code patterns for the project.`);
        
        // README.md for docs/ directory
        docsFolder.file("README.md", `# Core Documentation\n\nThis directory contains the core documentation for ${project.name}. Start with overview.md for a high-level understanding of the project.`);
        
        console.log('Added all core documentation files to docs/ directory');
      }
      
      // Add tech documentation files in tech/
      if (techFolder) {
        // Get tech.md content from documents or fallback
        let techMdContent = documents.tech;
        console.log('Tech document available:', Boolean(techMdContent));
        
        if (!techMdContent && selectedTechStack) {
          try {
            // Map stack option to normalized tech name
            const techNameMap: Record<TechStackOption, string> = {
              'Next.js': 'next-js',
              'Apple': 'apple',
              'CLI': 'cli',
              'Other': 'other'
            };
            
            const normalizedTechName = techNameMap[selectedTechStack];
            console.log(`Looking for tech documentation for ${selectedTechStack} (${normalizedTechName})`);
            
            // Attempt to fetch from Vercel Blob
            const blobResponse = await fetch(`/api/blob/list`);
            const blobData = await blobResponse.json();
            console.log('Blob list:', blobData.blobs.map((b: any) => b.pathname));
            
            // Look for a matching tech-*.md file
            const techFile = blobData.blobs.find(
              (blob: any) => blob.pathname === `tech-${normalizedTechName}.md`
            );
            
            if (techFile) {
              // Fetch the content
              const response = await fetch(techFile.url);
              if (response.ok) {
                techMdContent = await response.text();
                console.log(`Found tech documentation for ${selectedTechStack} in Vercel Blob`);
              } else {
                console.error(`Failed to fetch tech file content: ${response.status}`);
              }
            } else {
              console.log(`No tech documentation found for ${selectedTechStack} in Vercel Blob`);
            }
          } catch (error) {
            console.error('Error fetching tech documentation from Vercel Blob:', error);
          }
        }
        
        // index.md (former tech.md)
        techFolder.file("index.md", techMdContent || 
          `# ${project.name} Technology Stack\n\nThis document details the technologies, frameworks, and libraries used in the project.`);
        console.log('Added index.md to tech/ directory');
        
        // README.md for tech/ directory
        techFolder.file("README.md", `# Technology Documentation\n\nThis directory contains documentation for all technologies used in ${project.name}. See index.md for an overview of the technology stack.`);
        
        // Tech-specific files could be added here if available in documents.techFiles
        if (documents.techFiles) {
          console.log('Tech files available:', Object.keys(documents.techFiles));
          Object.entries(documents.techFiles).forEach(([filename, content]) => {
            techFolder.file(filename, content);
            console.log(`Added tech file: ${filename}`);
          });
        } else {
          console.log('No tech-specific files available');
        }
      }
      
      // Add system files in system/
      if (systemFolder) {
        // init.md - system prompt for LLM initialization
        systemFolder.file("init.md", documents.init || 
          `# ${project.name} System Initialization\n\nThis document provides the system prompt for initializing an LLM when working with this project.`);
        
        // instructions.md - project-specific workflow instructions
        systemFolder.file("instructions.md", documents.instructions || 
          `# ${project.name} Implementation Guide\n\nThis document provides specific instructions for implementing the project using the documentation.`);
        
        // README.md for system/ directory
        systemFolder.file("README.md", `# System Files\n\nThis directory contains files used to initialize and guide LLM agents when working with ${project.name}.`);
        
        console.log('Added system files to system/ directory');
      }
      
      // Add memory files in memory/
      if (memoryFolder) {
        // index.md - memory system guide
        memoryFolder.file("index.md", documents.memoryIndex || 
          `# ${project.name} Memory System\n\nThis document outlines how to use the memory system with LLM agents for this project.`);
        
        // bank_1.md - initial memory bank
        memoryFolder.file("bank_1.md", documents.memoryBank || 
          `# ${project.name} Memory Bank\n\nThis document contains the initial memory bank for storing context when working with this project.`);
        
        // README.md for memory/ directory
        memoryFolder.file("README.md", `# Memory System\n\nThis directory contains files for the memory system used by LLM agents working with ${project.name}.`);
        
        console.log('Added memory files to memory/ directory');
      }
      
      // Add prompt files in prompts/
      if (promptsFolder) {
        // README.md for prompts/ directory
        promptsFolder.file("README.md", `# Role and Workflow Prompts\n\nThis directory contains specialized prompts for different roles and workflows when working with ${project.name}.`);
        
        // Add role-specific prompts
        if (rolesFolder) {
          rolesFolder.file("architect.md", documents.promptArchitect || 
            `# ${project.name} - Architect Role\n\nThis document provides prompts for the architecture-focused role when working with this project.`);
          
          rolesFolder.file("developer.md", documents.promptDeveloper || 
            `# ${project.name} - Developer Role\n\nThis document provides prompts for the development-focused role when working with this project.`);
          
          rolesFolder.file("designer.md", documents.promptDesigner || 
            `# ${project.name} - Designer Role\n\nThis document provides prompts for the design-focused role when working with this project.`);
          
          rolesFolder.file("enterprise.md", documents.promptEnterprise || 
            `# ${project.name} - Enterprise Role\n\nThis document provides prompts for the business/growth-focused role when working with this project.`);
          
          console.log('Added role-specific prompts to prompts/roles/ directory');
        }
        
        // Add command prompts
        if (commandsFolder) {
          commandsFolder.file("setup.md", 
            `# ${project.name} Setup Commands\n\nThis document provides commands for setting up the development environment for this project.`);
          
          commandsFolder.file("testing.md", 
            `# ${project.name} Testing Workflow\n\nThis document provides commands for testing this project.`);
          
          console.log('Added command prompts to prompts/commands/ directory');
        }
      }
      
      // Add architecture files in architecture/
      if (architectureFolder) {
        // sample-feature.md - sample architecture document
        architectureFolder.file("sample-feature.md", documents.architectureSample || 
          `# ${project.name} Sample Feature Architecture\n\nThis document provides a sample architecture document for a feature in this project.`);
        
        // README.md for architecture/ directory
        architectureFolder.file("README.md", `# Architecture Documentation\n\nThis directory contains detailed architecture documentation for ${project.name}.`);
        
        console.log('Added architecture files to architecture/ directory');
      }
      
      // Generate the ZIP file
      console.log('Generating ZIP file...');
      const content = await zip.generateAsync({ type: "blob" });
      console.log(`ZIP file generated: ${content.size} bytes`);
      
      // Save the ZIP file
      saveAs(content, `${project.name}-docs.zip`);
      console.log(`ZIP file saved as: ${project.name}-docs.zip`);
      
      setIsGeneratingDocs(false);
      
      // Begin transition to project view after docs are generated
      setTimeout(() => {
        setShouldTransition(true);
      }, 500);
    } catch (error) {
      console.error('Error generating documentation:', error);
      setIsGeneratingDocs(false);
      
      // Attempt to create a minimal ZIP with basic documents
      try {
        console.log('Attempting to create minimal documentation ZIP...');
        const zip = new JSZip();
        const folder = zip.folder("project-docs");
        if (folder) {
          folder.file("README.md", `# ${project.name}\n\nAn error occurred while generating complete documentation.`);
          folder.file("error-log.md", `# Error Log\n\n\`\`\`\n${error}\n\`\`\``);
          
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, `${project.name}-minimal-docs.zip`);
          console.log('Created minimal documentation ZIP');
        }
      } catch (fallbackError) {
        console.error('Failed to create minimal documentation ZIP:', fallbackError);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    
    // Ensure a tech stack is selected
    if (!selectedTechStack) {
      console.warn("No tech stack selected, using 'Other' as default");
      setSelectedTechStack('Other');
    }

    // Log the selected tech stack for debugging
    console.log(`Using selected tech stack: ${selectedTechStack}`);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);
    
    // Fade out input form
    setShowInputForm(false);

    try {
      // Use absolute URL with origin
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

      // Get the selected tech stack template if any
      const techStackTemplate = selectedTechStack ? TECH_STACK_TEMPLATES[selectedTechStack] : null;
      
      // Build documentation links object from selected techs
      const documentationLinks: Record<string, string> = {};
      
      // First add links from the selected tech stack template
      if (techStackTemplate) {
        Object.assign(documentationLinks, techStackTemplate.documentationLinks);
      }
      
      // Start enrichment status
      setEnrichmentStatus('loading');
      
      // Then add links from discovered techs
      if (discoveredTechs.length > 0) {
        for (const tech of discoveredTechs) {
          if (tech.name && tech.documentationUrl) {
            documentationLinks[tech.name] = tech.documentationUrl;
          }
        }
      }
      
      // Prepare the request body with tech stack
      let requestBody: any = {
        prompt: userMessage.content,
        projectName: projectName || undefined,
        selectedTechStack: selectedTechStack || 'Other'  // Always include selected tech stack
      };
      
      // Add tech information if available
      if (selectedTechStack) {
        requestBody.techStack = {
          ...techStackTemplate,
          documentationLinks
        };
      }
      
      if (selectedTechs.length > 0) {
        requestBody.selectedTechs = selectedTechs;
      }
      
      // Send project generation request
      const response = await fetch(`${baseUrl}/api/projects/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        
        // Show more specific errors based on status code
        if (response.status === 404) {
          errorMessage = "API error: 404 - Service not found. This may indicate an issue with API keys or endpoints. Please check your environment configuration.";
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = "API error: Authentication failed. Please check your API keys.";
        } else if (response.status === 429) {
          errorMessage = "API error: Rate limit exceeded. Please try again later.";
        } else if (response.status >= 500) {
          errorMessage = "API error: Server error. The AI service might be experiencing issues.";
        }
        
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      const projectData = await response.json();
      
      // Clear previous documents
      clearDocuments();
      
      // Process documents from API response
      if (projectData.documents) {
        // Simulate sequential document creation to show the process
        simulateSequentialDocumentGeneration(projectData.documents);
      }
      
      // Use the Perplexity API to enrich tech documentation links
      try {
        // Extract tech items from the generated project safely
        const techItems = projectData?.project?.content?.tech?.items
          ? projectData.project.content.tech.items.map((item: any) => 
              typeof item === 'string' ? item : item.name
            )
          : [];
        
        // Only proceed if we have tech items to enrich
        if (techItems.length > 0) {
          console.log('Enriching tech documentation with Perplexity...');
          
          // Call the tech enrichment API
          const enrichResponse = await fetch(`${baseUrl}/api/tech/enrich`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              techItems,
              detailedInfo: true
            }),
          });
          
          if (enrichResponse.ok) {
            const enrichData = await enrichResponse.json();
            
            if (enrichData.technologies && Array.isArray(enrichData.technologies)) {
              console.log(`Received ${enrichData.technologies.length} enriched tech docs`);
              
              // Create a map of enriched docs by name (case-insensitive)
              const enrichedDocsMap = new Map();
              enrichData.technologies.forEach((doc: any) => {
                if (doc.name) {
                  enrichedDocsMap.set(doc.name.toLowerCase(), doc);
                }
              });
              
              // Update tech items with enriched documentation if tech.items exists
              if (projectData?.project?.content?.tech?.items) {
                const enhancedTechItems = projectData.project.content.tech.items.map((item: any) => {
                  // Get the name from either string or object
                  const name = typeof item === 'string' ? item : item.name;
                  
                  // Look for enriched doc (case-insensitive)
                  const enrichedDoc = enrichedDocsMap.get(name.toLowerCase());
                  
                  if (enrichedDoc) {
                    // Use the enriched doc but preserve original name casing
                    return {
                      name: name,
                      documentationUrl: enrichedDoc.documentationUrl,
                      githubUrl: enrichedDoc.githubUrl,
                      // Include description and best practice if available
                      ...(enrichedDoc.description && { description: enrichedDoc.description }),
                      ...(enrichedDoc.bestPractice && { bestPractice: enrichedDoc.bestPractice })
                    };
                  }
                  
                  // If no enriched doc found, return the original item
                  return item;
                });
                
                // Update the project with enriched tech items
                projectData.project.content.tech.items = enhancedTechItems;
              }
              setEnrichmentStatus('complete');
            }
          } else {
            console.warn('Failed to enrich tech documentation:', await enrichResponse.text());
            setEnrichmentStatus('error');
          }
        } else {
          console.log('No tech items found to enrich');
          setEnrichmentStatus('complete');
        }
      } catch (enrichError) {
        console.error('Error enriching tech documentation:', enrichError);
        setEnrichmentStatus('error');
        // Continue with the original project data
      }
      
      // Download the project docs
      await generateAndDownloadDocs(projectData.project, projectData.documents);
      
      // Generate success message
      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Generated project: ${projectData.project.name}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, successMessage]);
      
      // Return the generated project
      onProjectGenerated(projectData.project);
      
    } catch (error) {
      console.error('Error generating project:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, there was an error generating your project. Please try again.',
        timestamp: new Date(),
      }]);
      
      // Show input form again
      setShowInputForm(true);
    } finally {
      setIsGenerating(false);
      setEnrichmentStatus('idle');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  // Generate a random app idea based on current trends
  const generateRandomAppIdea = async () => {
    const startTime = Date.now();
    console.log(`[SPROUT] Starting random app idea generation at ${new Date().toISOString()}`);
    
    try {
      setIsGeneratingRandomIdea(true);
      setIsSearching(true);
      setSearchResults([]);
      setSearchProgress(0);
      setDiscoveredTechs([]);
      
      // Auto-select a tech stack if none is selected
      if (!selectedTechStack) {
        // Randomly choose from available tech stacks with weighted probability
        const techStacks: TechStackOption[] = ['Next.js', 'Apple', 'CLI', 'Other'];
        const weights = [0.4, 0.3, 0.2, 0.1]; // Higher weight for Next.js and Apple
        
        // Weighted random selection
        const randomValue = Math.random();
        let cumulativeWeight = 0;
        let selectedStack: TechStackOption = 'Other'; // Default
        
        for (let i = 0; i < techStacks.length; i++) {
          cumulativeWeight += weights[i];
          if (randomValue <= cumulativeWeight) {
            selectedStack = techStacks[i];
            break;
          }
        }
        
        console.log(`[SPROUT] Auto-selecting tech stack: ${selectedStack} (random value: ${randomValue.toFixed(3)})`);
        setSelectedTechStack(selectedStack);
      } else {
        console.log(`[SPROUT] Using existing tech stack: ${selectedTechStack}`);
      }
      
      // Get the selected or auto-selected tech stack
      const techStackTemplate = selectedTechStack 
        ? TECH_STACK_TEMPLATES[selectedTechStack] 
        : TECH_STACK_TEMPLATES['Other'];
      
      // Create tech context from selected tech stack
      const techContext = selectedTechs.length > 0 
        ? `Tech stack: ${selectedTechs.join(', ')}` 
        : selectedTechStack 
          ? `Tech stack: ${TECH_STACK_DISPLAY_NAMES[selectedTechStack]} (${techStackTemplate.frameworks.join(', ')})` 
          : '';
      
      console.log(`[SPROUT] Tech context: ${techContext || 'none'}`);
      
      // Use server API endpoint instead of direct Jina calls
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Determine the enhancement mode based on input length
      const userInput = inputValue.trim();
      const enhancementMode = userInput.length === 0 
        ? 'generate' // No input, generate from scratch
        : userInput.length < 50 
          ? 'expand' // Short input, use as seed and expand
          : 'refine'; // Long input, refine and enhance while keeping core idea
      
      console.log(`[SPROUT] Enhancement mode: ${enhancementMode} for input of length ${userInput.length}`);
      if (userInput) {
        console.log(`[SPROUT] User input: "${userInput.substring(0, 100)}${userInput.length > 100 ? '...' : ''}"`);
      }
      
      const searchStartTime = Date.now();
      console.log(`[SPROUT] Starting search request to ${baseUrl}/api/ideas/search`);
      
      // New implementation with streaming search results
      // First, start a separate API call to get search results as they come in
      const searchEndpoint = `${baseUrl}/api/ideas/search`;
      const searchPromise = fetch(searchEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          techStack: techStackTemplate,
          techContext,
          userInput,
          enhancementMode
        }),
      });
      
      // Start the actual idea generation in parallel
      const ideaGenerationStartTime = Date.now();
      console.log(`[SPROUT] Starting idea generation request to ${baseUrl}/api/ideas/random`);
      
      const ideaPromise = fetch(`${baseUrl}/api/ideas/random`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          techStack: techStackTemplate,
          techContext,
          userInput,
          enhancementMode
        }),
      });
      
      // Process streaming search results
      try {
        const searchResponse = await searchPromise;
        const searchResponseTime = Date.now() - searchStartTime;
        console.log(`[SPROUT] Search response received in ${searchResponseTime}ms with status ${searchResponse.status}`);
        
        if (searchResponse.ok && searchResponse.body) {
          const reader = searchResponse.body.getReader();
          let done = false;
          let chunkCount = 0;
          let totalBytes = 0;
          
          console.log(`[SPROUT] Starting to read search result stream`);
          
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            
            if (value) {
              const chunk = new TextDecoder().decode(value);
              totalBytes += chunk.length;
              chunkCount++;
              
              try {
                const searchResult = JSON.parse(chunk);
                console.log(`[SPROUT] Received chunk #${chunkCount}: ${searchResult.category} (${chunk.length} bytes)`);
                
                // Update search results
                setSearchResults(prev => [...prev, searchResult]);
                setSearchProgress(prev => Math.min(prev + 15, 95));
                
                // Extract tech from search results
                if (searchResult.links && searchResult.links.length > 0) {
                  console.log(`[SPROUT] Processing ${searchResult.links.length} links from search result`);
                  
                  // Simple tech extraction from links based on common tech domains
                  const techDomains = [
                    { pattern: 'github.com', prefix: '' },
                    { pattern: 'npm', prefix: '' },
                    { pattern: 'reactjs', prefix: 'React' },
                    { pattern: 'vue', prefix: 'Vue' },
                    { pattern: 'angular', prefix: 'Angular' },
                    { pattern: 'tailwind', prefix: 'Tailwind CSS' },
                    { pattern: 'flutter', prefix: 'Flutter' },
                    { pattern: 'svelte', prefix: 'Svelte' },
                    { pattern: 'nextjs', prefix: 'Next.js' },
                    { pattern: 'nuxt', prefix: 'Nuxt.js' },
                    { pattern: 'firebase', prefix: 'Firebase' },
                    { pattern: 'supabase', prefix: 'Supabase' },
                    { pattern: 'vercel', prefix: 'Vercel' },
                    { pattern: 'netlify', prefix: 'Netlify' },
                    { pattern: 'aws', prefix: 'AWS' },
                    { pattern: 'azure', prefix: 'Azure' },
                    { pattern: 'google', prefix: 'Google Cloud' },
                  ];
                  
                  const extractedTechs: string[] = [];
                  
                  searchResult.links.forEach((link: string) => {
                    for (const domain of techDomains) {
                      if (link.includes(domain.pattern)) {
                        // Extract tech name from link
                        let techName = '';
                        if (domain.pattern === 'github.com') {
                          // Extract repo name from GitHub links
                          const parts = link.split('/');
                          if (parts.length >= 5) {
                            techName = parts[4]; // github.com/owner/repo
                          }
                        } else {
                          techName = domain.prefix || domain.pattern;
                        }
                        
                        if (techName) {
                          extractedTechs.push(techName);
                          setDiscoveredTechs(prev => {
                            // Check if this tech is already in the list
                            if (!prev.some(t => t.name.toLowerCase() === techName.toLowerCase())) {
                              return [...prev, {
                                name: techName,
                                documentationUrl: link
                              }];
                            }
                            return prev;
                          });
                        }
                        break;
                      }
                    }
                  });
                  
                  if (extractedTechs.length > 0) {
                    console.log(`[SPROUT] Extracted technologies from links: ${extractedTechs.join(', ')}`);
                  }
                }
              } catch (parseError) {
                console.error(`[SPROUT] Error parsing search result chunk (${chunk.length} bytes):`, parseError);
              }
            }
          }
        }
      } catch (searchError) {
        console.error('Error streaming search results:', searchError);
        // Continue anyway to get the final idea
      }
      
      // Wait for the idea generation to complete
      const ideaResponse = await ideaPromise;
      
      if (!ideaResponse.ok) {
        throw new Error(`API error: ${ideaResponse.status}`);
      }
      
      const ideaData = await ideaResponse.json();
      
      // Complete search progress
      setSearchProgress(100);
      setIsSearching(false);
      
      // Create a tech.md document from the idea if available
      if (ideaData.idea) {
        const ideaContent = ideaData.idea;
        
        // Parse the idea content to extract tech stack info
        const techRegex = /## Tech(?:nology|nologies|nical Implementation|nical Considerations|)[\s\S]*?(?=## |$)/i;
        const techSection = ideaContent.match(techRegex);
        
        if (techSection) {
          const techContent = techSection[0];
          
          // Create a tech markdown document
          const techMarkdown = `# Technology Guide\n\n${techContent}`;
          updateDocument('tech', techMarkdown, 'perplexity');
          
          // Extract tech items from the tech section
          const techItemRegex = /[-*]\s+([A-Za-z0-9_\-\.]+)/g;
          const techItems: string[] = [];
          let match;
          
          while ((match = techItemRegex.exec(techContent)) !== null) {
            if (match[1] && !techItems.includes(match[1])) {
              techItems.push(match[1]);
            }
          }
          
          // Auto-populate tech pills
          if (techItems.length > 0) {
            console.log(`[IDEA] Auto-populating tech pills: ${techItems.join(', ')}`);
            setSelectedTechs(techItems);
          }
        }
      }
      
      // Set completion
      setInputValue(ideaData.idea);
      
      // If a project name was suggested, set it
      if (ideaData.name) {
        setProjectName(ideaData.name);
      }
      
    } catch (error) {
      console.error('Error generating random app idea:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble enhancing your idea. Please try again or provide more details.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsGeneratingRandomIdea(false);
      setIsSearching(false);
      setSearchProgress(100);
    }
  };

  // Function to handle clicking on a discovered tech
  const handleDiscoveredTechClick = (tech: {name: string; documentationUrl: string}) => {
    // Add to selected techs if not already there
    if (!selectedTechs.includes(tech.name)) {
      setSelectedTechs(prev => [...prev, tech.name]);
      
      // Smart stack detection: If the tech is related to a specific stack, select that stack
      const techLower = tech.name.toLowerCase();
      if (techLower.includes('react') || techLower.includes('next') || 
          techLower.includes('tailwind') || techLower.includes('vercel')) {
        setSelectedTechStack('Next.js');
      } else if (techLower.includes('swift') || techLower.includes('ios') || 
                techLower.includes('macos') || techLower.includes('apple')) {
        setSelectedTechStack('Apple');
      } else if (techLower.includes('cli') || techLower.includes('terminal') || 
                techLower.includes('command') || techLower.includes('shell')) {
        setSelectedTechStack('CLI');
      }
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto pb-32 sm:pb-28 md:pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: shouldTransition ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        className="relative p-4 sm:p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute inset-0 rounded-xl glass-effect" />
        
        {/* Chat Interface */}
        <div className="relative z-10 flex flex-col h-[60vh] min-h-[400px]">
          {/* Centered Layout - removed close button */}
          <div className="flex-1 flex flex-col">
            {/* Central area */}
            <div className="flex-1 flex items-center justify-center">
              
              {/* Animated States - Using AnimatePresence for smooth transitions */}
              <AnimatePresence mode="wait">
                {/* Show thinking state with pulsing animation */}
                {isGenerating && !showInputForm && !generatedProject && (
                  <motion.div 
                    key="thinking-state"
                    className="text-center  text-sm text-[rgb(var(--text-secondary))]"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      scale: [0.98, 1, 0.98]
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    transition={{
                      opacity: {
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.5, 1],
                        repeat: Infinity,
                        repeatType: "loop"
                      },
                      scale: {
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.5, 1],
                        repeat: Infinity,
                        repeatType: "loop"
                      }
                    }}
                  >
                    thinking...
                  </motion.div>
                )}
                
                {/* Project card with document generation loading */}
                {generatedProject && isGeneratingDocs && (
                  <motion.div 
                    key="project-card-loading"
                    className="w-full max-w-md mx-auto"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="glass-effect p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">{generatedProject.emoji}</div>
                        <div>
                          <h2 className="text-lg ">{generatedProject.name}</h2>
                          <p className="text-sm text-[rgb(var(--text-secondary))]">{generatedProject.description}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div>
                          <h3 className="text-sm  mb-1">{generatedProject.content.overview.title}</h3>
                          <ul className="text-xs space-y-1">
                            {generatedProject.content.overview.items.map((item, i) => (
                              <li key={i} className="text-[rgb(var(--text-secondary))]">{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-sm  mb-1">{generatedProject.content.tech.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            {generatedProject.content.tech.items.map((tech, i) => (
                              <TechPill 
                                key={i} 
                                text={tech} 
                                index={i} 
                                containerWidth={containerWidth}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="mb-2 text-sm ">Generating documentation...</div>
                        <div className="w-full h-1.5 bg-[rgb(var(--surface-1)/0.2)] rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-[rgb(var(--accent-1)/0.5)]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ 
                              duration: 5, 
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatType: "reverse" 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Input Form - when not generating */}
                {showInputForm && (
                  <motion.div 
                    key="input-form"
                    className="w-full max-w-lg mx-auto"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Display welcome message */}
                    {messages.length === 1 && (
                      <div className="mb-6 text-center flex items-center justify-center gap-2">
                        {/* Random Idea Button */}
                        <button
                          type="button"
                          onClick={generateRandomAppIdea}
                          disabled={isGenerating || isGeneratingRandomIdea}
                          className="p-1.5 rounded-md bg-[rgb(var(--surface-1)/0.1)] hover:bg-[rgb(var(--surface-1)/0.3)] transition-colors text-lg"
                          title="Enhance idea with AI"
                        >
                          🌱
                        </button>
                        <p className=" text-sm whitespace-pre-wrap">{messages[0].content}</p>
                      </div>
                    )}
                    
                    {/* Error message if present */}
                    {messages.length > 1 && messages[messages.length - 1].role === 'assistant' && (
                      <div className="mb-6 text-center">
                        <p className=" text-sm whitespace-pre-wrap text-[rgb(var(--text-secondary))]">
                          {messages[messages.length - 1].content}
                        </p>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="relative">
                      {/* Project Name Input */}
                      <div className="mb-4">
                        <input
                          ref={nameInputRef}
                          value={projectName}
                          onChange={handleNameChange}
                          placeholder="project name (optional)"
                          className="w-full mb-2 p-3 bg-[rgb(var(--surface-1)/0.1)] rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(var(--surface-1)/0.3)]  text-sm border border-[rgb(var(--border)/0.2)] text-center"
                          disabled={isGenerating}
                        />
                      </div>
                      
                      {/* Loading indicator for document generation */}
                      {isGeneratingDocs && generatedProject && (
                        <div className="mb-4 p-3 bg-[rgb(var(--surface-1)/0.1)] rounded-md border border-[rgb(var(--border)/0.2)]">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{generatedProject.emoji}</div>
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{generatedProject.name}</h3>
                              <p className="text-xs text-[rgb(var(--text-secondary))]">{generatedProject.description}</p>
                              
                              <div className="mt-2 w-full h-1.5 bg-[rgb(var(--surface-1)/0.2)] rounded-full overflow-hidden">
                                <div className="h-full bg-[rgb(var(--accent-1)/0.5)] animate-pulse rounded-full" 
                                    style={{width: '70%', animationDuration: '1.5s'}}></div>
                              </div>
                              
                              <p className="mt-1 text-xs text-[rgb(var(--text-secondary))]">
                                Generating documentation...
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Project Description Input */}
                      <div className="relative">
                        <textarea
                          ref={inputRef}
                          value={inputValue}
                          onChange={handleInputChange}
                          placeholder="describe your project idea..."
                          className="w-full p-3 bg-[rgb(var(--surface-1)/0.1)] rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(var(--surface-1)/0.3)]  text-sm resize-none min-h-[40px] max-h-[120px] text-center border border-[rgb(var(--border)/0.2)] flex items-center justify-center"
                          style={{
                            textAlign: 'center',
                            paddingTop: '12px',
                            lineHeight: '1.5',
                            ...(isGeneratingRandomIdea ? { animation: 'pulse 2s infinite' } : {})
                          }}
                          disabled={isGenerating || isGeneratingRandomIdea}
                        />
                        
                        {/* Loading indicator for random idea generation */}
                        {isGeneratingRandomIdea && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[rgb(var(--surface-1)/0.7)] rounded-md backdrop-blur-sm">
                            <div className="animate-spin text-lg">🔍</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isGenerating || isGeneratingRandomIdea || !inputValue.trim()}
                        className="mt-4 w-full p-2.5 bg-[rgb(var(--accent-1)/0.1)] hover:bg-[rgb(var(--accent-1)/0.2)] rounded-md  text-sm border border-[rgb(var(--accent-1)/0.3)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        generate project
                      </button>
                      
                      {/* Tech Stack Tabs */}
                      <div className="mt-4 flex flex-col gap-3">
                        <Tabs 
                          defaultValue="Other" 
                          className="w-full"
                          onValueChange={(value: string) => setSelectedTechStack(value as TechStackOption)}
                          value={selectedTechStack || "Other"}
                        >
                          <TabsList className="grid w-full grid-cols-4  text-xs">
                            <TabsTrigger value="Other">
                              <span className="text-base mr-1">{TECH_STACK_EMOJIS["Other"]}</span>
                              <span className="hidden sm:inline">{TECH_STACK_DISPLAY_NAMES["Other"]}</span>
                            </TabsTrigger>
                            <TabsTrigger value="Apple">
                              <span className="text-base mr-1">{TECH_STACK_EMOJIS["Apple"]}</span>
                              <span className="hidden sm:inline">{TECH_STACK_DISPLAY_NAMES["Apple"]}</span>
                            </TabsTrigger>
                            <TabsTrigger value="Next.js">
                              <span className="text-base mr-1">{TECH_STACK_EMOJIS["Next.js"]}</span>
                              <span className="hidden sm:inline">{TECH_STACK_DISPLAY_NAMES["Next.js"]}</span>
                            </TabsTrigger>
                            <TabsTrigger value="CLI">
                              <span className="text-base mr-1">{TECH_STACK_EMOJIS["CLI"]}</span>
                              <span className="hidden sm:inline">{TECH_STACK_DISPLAY_NAMES["CLI"]}</span>
                            </TabsTrigger>
                          </TabsList>
                        
                          {/* Tech Pills Container - Fixed height container with internal animation */}
                          <div 
                            ref={techContainerRef}
                            className="mt-3 w-full h-32 relative rounded-xl glass-effect p-2"
                          >
                            <AnimatePresence mode="wait">
                              <motion.div 
                                key={selectedTechStack || "Other"}  
                                className="absolute inset-0 overflow-y-auto overflow-x-hidden p-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex flex-wrap gap-2 pb-1">
                                  {/* This will be populated with TechPills dynamically based on selected tech stack */}
                                  {getTechPillsForStack(selectedTechStack || "Other").map((tech, index) => (
                                    <TechPill 
                                      key={`${selectedTechStack}-${tech.name}`} 
                                      text={tech}
                                      index={index}
                                      isActive={selectedTechs.includes(tech.name)}
                                      onClick={() => toggleTechSelection(tech.name)}
                                      containerWidth={containerWidth}
                                    />
                                  ))}
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </Tabs>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Document Dropdown Menu */}
      <DocDropdownMenu 
        documents={documents}
        onDocumentClick={() => {}}
        onMarkAsRead={markAsRead}
      />
      
      {/* Toast Provider for notifications */}
      <Toaster 
        position="bottom-left" 
        toastOptions={{
          className: "glass-effect border border-border/20 ",
          duration: 5000,
          style: {
            borderRadius: '0.75rem',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            height: '72px',
            fontFamily: 'Iosevka, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
          }
        }}
      />
    </motion.div>
  );
}; 