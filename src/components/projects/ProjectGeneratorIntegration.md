# ProjectGenerator Integration Guide - Floating Documents Panel

This document provides instructions for integrating the floating documents panel and Sonner toast notifications into the `ProjectGenerator.tsx` file.

## 1. Import Required Components

Add these imports at the top of your ProjectGenerator.tsx file:

```typescript
import { FloatingDocPanel, DocItem } from './FloatingDocPanel';
import { useDocumentManager } from '@/lib/hooks/useDocumentManager';
import { Toaster } from '@/components/ui/sonner';
```

## 2. Add Document Management Hook

Add the document manager hook to your component:

```typescript
// Document manager for handling all document and search results
const {
  documents,
  updateDocument,
  addSearchResult,
  markAsRead,
  clearDocuments,
  processApiDocuments
} = useDocumentManager();

// State to control document modal
const [viewingDocument, setViewingDocument] = useState<DocItem | null>(null);
```

## 3. Update Tech Pill Rendering with Live Updates

Update your tech pill component to get data from the tech document:

```typescript
const techDocument = documents.find(doc => doc.type === 'tech')?.content;

// Extract technologies from tech document for display in tech pills
useEffect(() => {
  if (techDocument) {
    const techMatches = techDocument.match(/## (.*?)\n([\s\S]*?)(?=## |$)/g);
    if (techMatches) {
      const extractedTechs: DiscoveredTech[] = [];
      
      techMatches.forEach(section => {
        const sectionTitle = section.match(/## (.*?)\n/)?.[1];
        if (sectionTitle && sectionTitle.toLowerCase() !== 'resources') {
          const techItems = section.match(/- (.*?)(?:\n|$)/g);
          techItems?.forEach(item => {
            const techName = item.replace(/- |\n/g, '').trim();
            if (techName) {
              extractedTechs.push({
                name: techName,
                documentationUrl: '',
                category: sectionTitle
              });
            }
          });
        }
      });
      
      setDiscoveredTechs(extractedTechs);
    }
  }
}, [techDocument]);
```

## 4. Update Project Generation Flow

Modify the handleSubmit function to update documents as they're generated:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!inputValue.trim() || isGenerating) return;

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
  
  // Clear previous documents
  clearDocuments();

  try {
    // Use absolute URL with origin
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    // Make API request
    const response = await fetch(`${baseUrl}/api/projects/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: inputValue,
        techStack: selectedTechStack || 'Other'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate project');
    }

    const projectData = await response.json();
    
    // Process documents from API response - this will update documents state
    // and trigger Sonner toast notifications
    if (projectData.documents) {
      // Simulate sequential document creation to show the process
      simulateSequentialDocumentGeneration(projectData.documents);
    }
    
    // Create a completion message
    const completionMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Project "${projectData.project.name}" has been generated.`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, completionMessage]);
    setProject(projectData.project);
    setIsGenerating(false);
    
  } catch (error) {
    console.error('Error generating project:', error);
    setIsGenerating(false);
    
    // Add error message
    const errorMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'There was an error generating your project. Please try again.',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, errorMessage]);
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
```

## 5. Update Random Idea Generation Flow

Update the random idea generation to add search results as documents:

```typescript
const generateRandomAppIdea = async () => {
  if (isGeneratingRandomIdea) return;
  
  setIsGeneratingRandomIdea(true);
  setIsSearching(true);
  setSearchProgress(0);
  
  // Clear previous documents
  clearDocuments();
  
  try {
    // Add initial search categories as documents in "generating" state
    addSearchResult("Researching cultural and viral trends...", "Cultural & Viral Trends");
    addSearchResult("Analyzing technology landscape...", "Technology Landscape");
    addSearchResult("Identifying market opportunities...", "Market Opportunities");
    
    // Simulate search progress
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 800);
    
    // Make API request
    const response = await fetch('/api/ideas/random', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to generate random app idea');
    }
    
    const data = await response.json();
    clearInterval(progressInterval);
    
    // Process search results from the response
    if (data.searchResults) {
      data.searchResults.forEach((result: any, index: number) => {
        const titles = ["Cultural & Viral Trends", "Technology Landscape", "Market Opportunities"];
        addSearchResult(result.content, titles[index % titles.length]);
      });
    }
    
    // Create a tech.md document from the idea
    if (data.idea) {
      const techMarkdown = `# Technology Guide for ${data.idea.name}\n\n## Frameworks\n${
        data.idea.techStack.frameworks.map((f: string) => `- ${f}`).join('\n')
      }\n\n## Libraries\n${
        data.idea.techStack.libraries.map((l: string) => `- ${l}`).join('\n')
      }\n\n## APIs\n${
        data.idea.techStack.apis.map((a: string) => `- ${a}`).join('\n')
      }\n\n## Tools\n${
        data.idea.techStack.tools.map((t: string) => `- ${t}`).join('\n')
      }`;
      
      updateDocument('tech', techMarkdown, 'perplexity');
    }
    
    setRandomIdea(data.idea);
    setIsGeneratingRandomIdea(false);
    setIsSearching(false);
    setSearchProgress(100);
    
  } catch (error) {
    console.error('Error generating random app idea:', error);
    setIsGeneratingRandomIdea(false);
    setIsSearching(false);
  }
};
```

## 6. Add Floating Document Panel and Toast Provider to the Render Function

Add these components to your render function:

```tsx
return (
  <div className="relative">
    {/* ... existing JSX ... */}
    
    {/* Floating Document Panel */}
    <FloatingDocPanel 
      documents={documents}
      onDocumentClick={(doc) => setViewingDocument(doc)}
      onMarkAsRead={markAsRead}
    />
    
    {/* Toast Provider for notifications */}
    <Toaster position="bottom-right" />
  </div>
);
```

## 7. Install Required Dependencies

Install these dependencies for the solution to work:

```bash
npm install sonner marked dompurify
# or with yarn
yarn add sonner marked dompurify
# or with pnpm
pnpm add sonner marked dompurify
```

## 8. Complete Flow

The final flow should be:

1. User enters a prompt or clicks "Generate Random Idea"
2. For random ideas:
   - Search results are generated as documents
   - A document icon appears in the bottom right
   - Toast notifications appear for each completed document
   - Tech pills update from the generated tech.md
3. For project generation:
   - Documents are generated sequentially
   - Each document appears as a toast notification
   - The document icon shows a count of unread documents
   - Tech pills update from the tech.md document
4. Clicking on the document icon:
   - Opens a slide-out panel showing all generated documents
   - Documents are color-coded (blue for Perplexity, purple for Claude)
   - Unread documents are highlighted
5. Clicking a document:
   - Opens it in a modal view
   - Marks it as read
   - Shows the formatted markdown content

This approach maintains the existing UI while adding an unobtrusive document viewer that users can access when they need it. 