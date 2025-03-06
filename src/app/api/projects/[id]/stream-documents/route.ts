import { streamUI } from 'ai/rsc';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest } from 'next/server';
import { 
  generateDocument, 
  DocumentType, 
  DocumentTypeSchema 
} from '@/lib/services/streamingDocumentService';

// Schema for the document generation request
const GenerateDocumentSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  projectDescription: z.string(),
  techStack: z.any(), // Can be string or TechStack object
  documentTypes: z.array(DocumentTypeSchema).optional(),
});

/**
 * Streaming API route for document generation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;
  
  // Parse the request body
  const rawData = await request.json();
  const validationResult = GenerateDocumentSchema.safeParse(rawData);
  
  if (!validationResult.success) {
    return new Response(JSON.stringify({ 
      error: 'Invalid request data',
      details: validationResult.error.format() 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
  
  const { 
    projectName, 
    projectDescription, 
    techStack,
    documentTypes = ['index', 'design', 'tech', 'code', 'init'] as DocumentType[]
  } = validationResult.data;

  // Use streamUI to create a streaming response
  return streamUI({
    tools: {
      generateInitialStructure: {
        description: "Generate the initial project structure",
        parameters: z.object({
          streamId: z.string().optional()
        }),
        generate: async () => {
          // Initial structure component
          return {
            documents: [],
            isGenerating: true,
            message: "Starting document generation..."
          };
        }
      },
      generateDocuments: {
        description: "Generate all project documents",
        parameters: z.object({
          streamId: z.string().optional()
        }),
        generate: async function* () {
          // Track the documents created so far
          const documents: any[] = [];
          
          // Yield initial state
          yield {
            documents,
            isGenerating: true,
            message: `Preparing to generate ${documentTypes.length} documents...`
          };
          
          // Generate each document type in sequence
          for (const docType of documentTypes) {
            // Update the status message
            yield {
              documents: [...documents],
              isGenerating: true,
              message: `Generating ${docType} document...`
            };
            
            try {
              // Generate the document
              const result = await generateDocument({
                projectName,
                projectDescription,
                techStack,
                documentType: docType,
                shouldStream: true,
              });
              
              // Create document object
              const doc = {
                id: uuidv4(),
                title: result.title,
                content: result.content,
                type: docType,
                source: result.source,
                isComplete: true,
                timestamp: new Date()
              };
              
              // Add to documents array
              documents.push(doc);
              
              // Yield updated documents
              yield {
                documents: [...documents],
                isGenerating: true,
                message: `Generated ${docType} document. ${documents.length} of ${documentTypes.length} complete.`
              };
              
            } catch (error) {
              console.error(`Error generating ${docType} document:`, error);
              
              // Create error document
              const errorDoc = {
                id: uuidv4(),
                title: `${projectName} ${docType.charAt(0).toUpperCase() + docType.slice(1)} (Error)`,
                content: `# Error Generating Document\n\nThere was an error generating this document. Please try again later.`,
                type: docType,
                source: 'claude' as const,
                isComplete: true,
                isError: true,
                timestamp: new Date()
              };
              
              // Add to documents array
              documents.push(errorDoc);
              
              // Yield updated documents with error
              yield {
                documents: [...documents],
                isGenerating: true,
                message: `Error generating ${docType} document. Continuing with remaining documents.`,
                error: String(error)
              };
            }
          }
          
          // Final state - all documents complete
          return {
            documents,
            isGenerating: false,
            message: `All ${documents.length} documents generated successfully.`,
            projectId
          };
        }
      }
    }
  });
}

/**
 * GET handler for retrieving document generation status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;
  
  // In a real implementation, you would fetch the generation status from a database
  // For now, we'll just return a simple response
  
  return new Response(JSON.stringify({ 
    projectId,
    status: 'pending',
    message: 'Document generation has not started or is in progress.' 
  }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' } 
  });
} 