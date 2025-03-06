# Project Generator

A modular and maintainable implementation of the project generator system.

## Architecture

The project generator is built with a focus on:

- **Modularity**: Broken down into small, focused components
- **State Management**: Using Zustand stores for clean state management
- **Custom Hooks**: Encapsulating complex logic in custom hooks
- **Template System**: Organized prompt templates in dedicated files
- **Progressive Loading**: Using React Server Components and Vercel AI SDK for streaming UI

## Directory Structure

```
generator/
├── components/
│   ├── DocumentViewer.tsx
│   ├── MessageList.tsx
│   ├── ProjectControls.tsx
│   ├── ProjectForm.tsx
│   ├── ProjectLayout.tsx
│   ├── SearchResultsDisplay.tsx
│   ├── SimpleStreamingDocViewer.tsx
│   ├── StreamingDocumentViewer.tsx
│   └── TechStackSelector.tsx
├── api/
│   ├── projectApi.ts
├── hooks/
│   ├── useIdeaGeneration.ts
│   ├── useProjectGeneration.ts
│   └── index.ts
├── stores/
│   ├── documentStore.ts
│   ├── messageStore.ts
│   ├── projectStore.ts
│   ├── techStackStore.ts
│   └── index.ts
├── templates/
│   ├── documentation.ts
│   └── index.ts
├── utils/
│   └── errorHandler.ts
├── constants.ts
├── interfaces.ts
├── prompts.ts
├── templates.ts
├── utils.ts
├── ProjectGenV2.tsx
└── index.ts
```

## Implementation

### Components

- **ProjectLayout**: Handles the overall layout structure
- **TechStackSelector**: Manages tech stack selection
- **ProjectForm**: Handles project input and generation
- **DocumentViewer**: Displays generated documentation
- **StreamingDocumentViewer**: Real-time document generation UI with Vercel AI SDK
- **MessageList**: Shows system messages
- **SearchResultsDisplay**: Shows search results during idea generation
- **ProjectControls**: Provides project action buttons

### Vercel AI SDK Integration

The Vercel AI SDK integration provides a streaming document generation experience:

- **StreamingDocumentViewer**: Client component that leverages `useUIState` from the AI SDK
- **Document Generation API**: Uses `streamUI` to progressively stream generated documents
- **Document Streaming Service**: Uses `streamText` to generate document content with AI

The integration has these advantages:
- Documents appear progressively as they're generated
- UI remains responsive during generation
- Improved user experience with real-time feedback
- Reduced perceived latency even for long-running operations

### Services

- **streamingDocumentService.ts**: Handles document generation with streaming support
- **projectApi.ts**: API client with retry mechanism for network resilience

### Hooks

- **useProjectGeneration**: Encapsulates project generation logic
- **useIdeaGeneration**: Encapsulates idea generation logic

### Stores

- **projectStore**: Manages project state
- **techStackStore**: Manages tech stack selection state
- **documentStore**: Manages document state
- **messageStore**: Manages message state for human-in-the-loop interactions

### Templates

- **documentation.ts**: Generates documentation templates
- **templates.ts**: Contains tech stack documentation templates
- **prompts.ts**: Contains prompt templates for AI interaction

## Usage

### Basic Usage

```tsx
import { ProjectGenV2 } from './components/projects/generator';

// In your component
return <ProjectGenV2 />;
```

### Streaming Document Generation

```tsx
import { StreamingDocumentViewer } from './components/projects/generator/StreamingDocumentViewer';
import { streamUI } from 'ai/rsc';

// In your server component
const stream = streamUI({
  tools: {
    generateDocument: {
      description: "Generate a project document",
      parameters: z.object({
        type: z.enum(['tech', 'index', 'design', 'code', 'init']),
        projectId: z.string()
      }),
      generate: async ({ type, projectId }) => {
        // Generate document based on type
        const document = await generateDocument(type, projectId);
        
        // Return a React component that will be streamed to the client
        return <DocumentCard document={document} />;
      }
    }
  }
});

// In your client component
return <StreamingDocumentViewer streamState={stream} />;
```

## Future Improvements

- Add tests for components and hooks
- Expand server component integration
- Add more tech stack templates
- Improve error handling
- Add more customization options 
- Support for collaborative document editing 