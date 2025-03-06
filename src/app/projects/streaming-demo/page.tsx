import { Suspense } from 'react';
import { ProjectLayout, LeftPanel, RightPanel } from '@/components/projects/generator/ProjectLayout';
import { GenerateDocumentsButton } from '@/components/projects/generator/GenerateDocumentsButton';
import { DocumentsDisplay } from '@/components/projects/generator/DocumentsDisplay';

// Mock project data
const mockProject = {
  id: 'project-123',
  name: 'TaskMaster',
  description: 'A productivity app for managing tasks and projects with a modern UI and real-time updates.',
  techStack: 'Next.js'
};

// Sample document types
const documentTypes = ['index', 'design', 'tech', 'code', 'init'];

export default function StreamingDemoPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <header className="border-b border-[rgb(var(--border))] p-4">
        <h1 className="text-2xl font-bold">{mockProject.name} - Streaming Documents</h1>
        <p className="text-[rgb(var(--muted))]">{mockProject.description}</p>
      </header>
      
      <ProjectLayout>
        <LeftPanel>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Project Details</h2>
            <div className="mb-4">
              <p className="text-sm font-medium text-[rgb(var(--muted))]">Name</p>
              <p>{mockProject.name}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-[rgb(var(--muted))]">Tech Stack</p>
              <p>{mockProject.techStack}</p>
            </div>
            <div className="mb-6">
              <p className="text-sm font-medium text-[rgb(var(--muted))]">Description</p>
              <p className="text-sm">{mockProject.description}</p>
            </div>
            
            <GenerateDocumentsButton documentTypes={documentTypes} />
          </div>
        </LeftPanel>
        
        <RightPanel>
          <Suspense fallback={<div className="p-4">Loading document viewer...</div>}>
            <DocumentsDisplay 
              documentTypes={documentTypes} 
              projectName={mockProject.name} 
            />
          </Suspense>
        </RightPanel>
      </ProjectLayout>
    </div>
  );
}

// Export these types to be used by client components
export type { DocumentTypes, DocumentParams };

// Type definitions
type DocumentTypes = string[];
interface DocumentParams {
  documentTypes: DocumentTypes;
  projectName?: string;
}

// Helper function to generate sample content for each document type
export function generateSampleContent(projectName: string, docType: string): string {
  const content: Record<string, string> = {
    index: `# ${projectName} Overview

## Introduction
${projectName} is a modern productivity application designed to help users manage tasks effectively.

## Features
- Task organization with categories and tags
- Due date tracking and notifications
- Collaboration features for team projects
- Progress tracking with visual charts

## Target Users
This application is designed for professionals, students, and anyone who needs to organize their work efficiently.

## Architecture Overview
${projectName} uses a modern web stack with a React frontend and Node.js backend.`,
    
    design: `# ${projectName} Design System

## UI Components
- Task Cards: Visual representation of individual tasks
- Category Panels: Organizes tasks into groups
- Status Indicators: Shows progress and priority
- Navigation Menu: Provides access to different views

## User Flow
1. User authentication
2. Dashboard view with task overview
3. Task creation and editing
4. Category management
5. Filter and search capabilities

## Design Decisions
We've chosen a minimalist design approach to reduce cognitive load and help users focus on their tasks.

## Responsive Design Strategy
The application is designed with a mobile-first approach, ensuring great usability across all device sizes.`,
    
    tech: `# ${projectName} Technology Stack

## Frontend Technologies
- React for component-based UI
- Next.js for server-side rendering
- TailwindCSS for styling
- Framer Motion for animations

## Backend Technologies
- Node.js runtime
- Express.js framework
- MongoDB for data storage
- JWT for authentication

## External APIs and Services
- Sendgrid for email notifications
- Cloudinary for image storage
- Auth0 for authentication (optional)

## Development Tools
- TypeScript for type safety
- ESLint for code quality
- Jest for testing
- GitHub Actions for CI/CD`,
    
    code: `# ${projectName} Implementation Guide

## Project Structure
\`\`\`
src/
├── components/     # Reusable UI components
├── pages/          # Next.js pages
├── lib/            # Utility functions
├── services/       # API services
├── hooks/          # Custom React hooks
├── styles/         # Global styles
└── types/          # TypeScript definitions
\`\`\`

## Key Components
- TaskList: Renders a collection of tasks
- TaskCard: Individual task display
- CategorySelector: Manages task categories
- DueDatePicker: Custom date selection

## Data Flow
1. User actions trigger React state updates
2. State changes may trigger API calls via custom hooks
3. API responses update global state
4. UI reacts to state changes

## Integration Points
- Authentication system integration
- Notification service connections
- Task data synchronization with backend
- Analytics tracking integration`,
    
    init: `# ${projectName} Initialization Guide

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- MongoDB instance (local or MongoDB Atlas)
- Git for version control

## Environment Setup
1. Clone the repository
\`\`\`bash
git clone https://github.com/example/${projectName.toLowerCase()}.git
cd ${projectName.toLowerCase()}
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env.local
\`\`\`

## Installation
Complete the following in your .env.local file:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/${projectName.toLowerCase()}
JWT_SECRET=your_secret_key
API_URL=http://localhost:3000/api
\`\`\`

## Configuration
1. Start the development server
\`\`\`bash
npm run dev
\`\`\`

2. Open http://localhost:3000 in your browser`
  };
  
  return content[docType] || 
    `# ${projectName} ${docType.charAt(0).toUpperCase() + docType.slice(1)}
    
This is sample content for the ${docType} document. In a real implementation, this would be generated by an AI model.`;
} 