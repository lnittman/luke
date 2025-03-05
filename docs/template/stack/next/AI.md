# AI Integration Guide for Next.js

This document provides comprehensive guidance for integrating AI capabilities into your Next.js application, with a focus on building robust agentic systems using a tiered approach to model selection.

## AI Architecture Overview

The AI integration follows a layered architecture with a strategic approach to model selection:

```
┌─────────────────────────────────────────────────────────┐
│ Application Layer (React Components)                     │
├─────────────────────────────────────────────────────────┤
│ AI Feature Layer (Hooks, Components, Agents)             │
├─────────────────────────────────────────────────────────┤
│ AI Service Layer (Adapters, Services, Workflows)         │
├─────────────────────────────────────────────────────────┤
│ Model Provider Layer (OpenRouter, Vercel AI SDK)         │
└─────────────────────────────────────────────────────────┘
```

## LLM Model Strategy

### Tiered Model Approach

1. **Tier 1: High-Quality Reasoning** (Used sparingly for critical tasks)
   - Claude 3.7 Sonnet (via OpenRouter)
   - Claude 3.7 Sonnet:thinking (for complex reasoning tasks)
   - GPT-4o (via OpenRouter)
   
2. **Tier 2: Utility & General Tasks** (Everyday operations)
   - Gemini 2 Flash (optimal price/performance)
   - Claude 3 Haiku (via OpenRouter)
   - Mistral Large (via OpenRouter)

3. **Tier 3: Specialized Functions**
   - Perplexity/Sonar-Reasoning (for deep web search & research)
   - Gemini Pro Vision (for multimodal tasks)
   - Claude 3.5 Sonnet (for document analysis)

## Setup and Configuration

### 1. Install Required Dependencies

```bash
npm install ai @vercel/ai openrouter-sdk langchain @langchain/core r-jina-api
```

### 2. Configure Environment Variables

```
# Primary API Keys
OPENROUTER_API_KEY=your-openrouter-api-key
GEMINI_API_KEY=your-gemini-api-key
SONAR_API_KEY=your-sonar-api-key

# Model Configuration
DEFAULT_CHAT_MODEL=gemini-2-flash
HIGH_QUALITY_MODEL=claude-3-7-sonnet
REASONING_MODEL=claude-3-7-sonnet:thinking
SEARCH_MODEL=perplexity-sonar-reasoning
VISION_MODEL=gemini-pro-vision
```

### 3. Create Model Configuration

```typescript
// lib/ai/config.ts
export const AI_MODELS = {
  // High-quality models (use sparingly)
  CLAUDE_3_7_SONNET: 'anthropic/claude-3-7-sonnet',
  CLAUDE_3_7_THINKING: 'anthropic/claude-3-7-sonnet:thinking',
  GPT_4O: 'openai/gpt-4o',
  
  // Utility models (everyday use)
  GEMINI_2_FLASH: 'gemini-2-flash',
  CLAUDE_3_HAIKU: 'anthropic/claude-3-haiku',
  MISTRAL_LARGE: 'mistral/mistral-large',
  
  // Specialized models
  SONAR_REASONING: 'perplexity/sonar-reasoning',
  GEMINI_PRO_VISION: 'gemini-pro-vision',
  CLAUDE_3_5_SONNET: 'anthropic/claude-3-5-sonnet',
} as const;

export const MODEL_CONTEXTS = {
  [AI_MODELS.CLAUDE_3_7_SONNET]: 200000,
  [AI_MODELS.CLAUDE_3_7_THINKING]: 200000,
  [AI_MODELS.GPT_4O]: 128000,
  [AI_MODELS.GEMINI_2_FLASH]: 32000,
  [AI_MODELS.CLAUDE_3_HAIKU]: 200000,
  [AI_MODELS.MISTRAL_LARGE]: 32000,
  [AI_MODELS.SONAR_REASONING]: 32000,
  [AI_MODELS.GEMINI_PRO_VISION]: 12000,
  [AI_MODELS.CLAUDE_3_5_SONNET]: 200000,
};

export const MODEL_PRICING = {
  [AI_MODELS.CLAUDE_3_7_SONNET]: { input: 15.00, output: 75.00 },  // $ per million tokens
  [AI_MODELS.CLAUDE_3_7_THINKING]: { input: 15.00, output: 75.00 },
  [AI_MODELS.GPT_4O]: { input: 10.00, output: 30.00 },
  [AI_MODELS.GEMINI_2_FLASH]: { input: 0.35, output: 1.05 },
  [AI_MODELS.CLAUDE_3_HAIKU]: { input: 0.25, output: 1.25 },
  [AI_MODELS.MISTRAL_LARGE]: { input: 2.00, output: 6.00 },
};

// Smart model selection based on task requirements
export function selectModelForTask(task: {
  type: 'chat' | 'search' | 'reasoning' | 'vision' | 'generation',
  importance: 'critical' | 'standard' | 'background',
  complexity: 'high' | 'medium' | 'low'
}) {
  if (task.type === 'search') return AI_MODELS.SONAR_REASONING;
  if (task.type === 'vision') return AI_MODELS.GEMINI_PRO_VISION;
  
  if (task.importance === 'critical' || task.complexity === 'high') {
    return task.type === 'reasoning' ? AI_MODELS.CLAUDE_3_7_THINKING : AI_MODELS.CLAUDE_3_7_SONNET;
  }
  
  return AI_MODELS.GEMINI_2_FLASH; // Default utility model
}
```

## OpenRouter Integration

### Setting up OpenRouter Client

```typescript
// lib/ai/openrouter.ts
import { OpenRouter } from 'openrouter-sdk';
import { StreamingTextResponse } from 'ai';
import { AI_MODELS } from './config';

// Initialize OpenRouter client
export const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Stream chat completions
export async function streamChatCompletion(messages: any[], model = AI_MODELS.GEMINI_2_FLASH) {
  try {
    const response = await openrouter.chat.completions.create({
      model,
      messages,
      stream: true,
      temperature: model.includes('thinking') ? 0.1 : 0.7,
    });
    
    return new StreamingTextResponse(response);
  } catch (error) {
    console.error('Error streaming chat completion:', error);
    throw error;
  }
}
```

## Research & Web Search Integration

### Sonar Reasoning for Deep Web Search

```typescript
// lib/ai/search.ts
import { StreamingTextResponse } from 'ai';
import { AI_MODELS } from './config';
import { openrouter } from './openrouter';

export async function performDeepSearch(query: string) {
  try {
    const searchSystemPrompt = `You are Sonar, an AI search assistant that provides comprehensive answers based on web searches. 
    Search for the most relevant and up-to-date information about the query. 
    Provide detailed responses with facts, figures, and citations.`;
    
    const stream = await openrouter.chat.completions.create({
      model: AI_MODELS.SONAR_REASONING,
      messages: [
        { role: 'system', content: searchSystemPrompt },
        { role: 'user', content: query }
      ],
      stream: true,
    });
    
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error performing deep search:', error);
    throw error;
  }
}

// Web content extraction with r.jina.ai
export async function extractWebContent(url: string) {
  const response = await fetch('https://r.jina.ai/api/v1/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.JINA_API_KEY}`
    },
    body: JSON.stringify({ url })
  });
  
  return response.json();
}
```

## Agentic Framework Implementation

### Agent System Architecture

```typescript
// lib/agents/types.ts
export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: Record<string, any>) => Promise<any>;
}

export interface AgentState {
  conversations: Message[];
  memory: Record<string, any>;
  tools: Tool[];
  activeTool: string | null;
  thinking: boolean;
}

// lib/agents/agent-manager.ts
import { AI_MODELS } from '../ai/config';
import { openrouter } from '../ai/openrouter';

export class AgentManager {
  private tools: Tool[] = [];
  private memory: Record<string, any> = {};
  private modelId: string = AI_MODELS.GEMINI_2_FLASH;
  
  constructor(config: {
    tools?: Tool[],
    initialMemory?: Record<string, any>,
    modelId?: string,
  }) {
    this.tools = config.tools || [];
    this.memory = config.initialMemory || {};
    this.modelId = config.modelId || AI_MODELS.GEMINI_2_FLASH;
  }
  
  registerTool(tool: Tool) {
    this.tools.push(tool);
  }
  
  async processUserRequest(userInput: string) {
    // 1. Planning phase - determine intent and required tools
    const planningResponse = await this.plan(userInput);
    
    // 2. Execution phase - run tools based on plan
    const executionResults = await this.executeTools(planningResponse.toolCalls);
    
    // 3. Response generation phase - create coherent response
    return this.generateResponse(userInput, executionResults);
  }
  
  private async plan(userInput: string) {
    // Use thinking model for planning
    return openrouter.chat.completions.create({
      model: AI_MODELS.CLAUDE_3_7_THINKING,
      messages: [
        { role: 'system', content: this.buildSystemPrompt() },
        { role: 'user', content: userInput }
      ],
      temperature: 0.1,
      tool_choice: 'auto',
      tools: this.tools.map(tool => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: {
            type: 'object',
            properties: tool.parameters,
            required: Object.keys(tool.parameters)
          }
        }
      }))
    });
  }
  
  private async executeTools(toolCalls: any[]) {
    // Execute each tool call
    return Promise.all(toolCalls.map(async (call) => {
      const tool = this.tools.find(t => t.name === call.function.name);
      if (!tool) throw new Error(`Tool not found: ${call.function.name}`);
      
      const params = JSON.parse(call.function.arguments);
  return {
        toolName: call.function.name,
        result: await tool.execute(params)
      };
    }));
  }
  
  private async generateResponse(userInput: string, toolResults: any[]) {
    // Use high-quality model for final response
    return openrouter.chat.completions.create({
      model: AI_MODELS.CLAUDE_3_7_SONNET,
      messages: [
        { role: 'system', content: this.buildSystemPrompt() },
        { role: 'user', content: userInput },
        { role: 'assistant', content: `I'll help with that. Let me gather some information.` },
        ...toolResults.map(result => ({
          role: 'tool',
          tool_call_id: result.toolName,
          name: result.toolName,
          content: JSON.stringify(result.result)
        }))
      ],
      temperature: 0.7,
    });
  }
  
  private buildSystemPrompt() {
    return `You are an intelligent agent with access to various tools. 
    Your goal is to help the user by using these tools effectively.
    Available memory: ${JSON.stringify(this.memory)}`;
  }
}
```

## Building Multimodal Workflows

### Vision and Image Processing

```typescript
// lib/ai/vision.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeImage(imageUrl: string, prompt: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  
  // Fetch the image and convert to base64
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const imageBase64 = Buffer.from(buffer).toString('base64');
  
  // Generate content
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { 
            inline_data: {
              mime_type: response.headers.get('Content-Type') || 'image/jpeg',
              data: imageBase64
            }
          }
        ]
      }
    ]
  });
  
  return result.response.text();
}
```

### Document Processing Workflow

```typescript
// lib/ai/document-processing.ts
import { AI_MODELS } from './config';
import { openrouter } from './openrouter';

export async function extractInformationFromDocument(
  documentText: string, 
  schema: Record<string, { type: string, description: string }>
) {
  const structuredExtractionPrompt = `
    Extract the following information from the document according to this schema:
    ${JSON.stringify(schema, null, 2)}
    
    Document text:
    ${documentText}
    
    Provide the extracted information as a valid JSON object matching the schema.
  `;
  
    const response = await openrouter.chat.completions.create({
    model: AI_MODELS.CLAUDE_3_5_SONNET,
    messages: [
      { role: 'user', content: structuredExtractionPrompt }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });
  
  return JSON.parse(response.choices[0].message.content || '{}');
}
```

## React Components for AI Integration

### Generic AI Chat Interface

```tsx
// components/ai/ChatInterface.tsx
'use client';

import { useState } from 'react';
import { Message, useChat } from 'ai/react';

interface ChatInterfaceProps {
  apiEndpoint?: string;
  initialMessages?: Message[];
  modelId?: string;
  placeholder?: string;
}

export function ChatInterface({
  apiEndpoint = '/api/ai/chat',
  initialMessages = [],
  modelId,
  placeholder = 'Ask something...'
}: ChatInterfaceProps) {
  const [thinking, setThinking] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: apiEndpoint,
    initialMessages,
    body: modelId ? { modelId } : undefined,
    onResponse: () => {
      setThinking(false);
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    setThinking(true);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-4 p-4 h-[400px] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            }`}
          >
            {message.content}
          </div>
        ))}
        {thinking && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}
        </div>

      <form onSubmit={onSubmit} className="flex space-x-2 p-4 border-t">
        <input
          className="flex-1 border border-gray-300 rounded-md p-2"
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-blue-300"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

## Best Practices for AI Integration

### 1. Model Selection Strategy
- Use appropriate models for different tasks based on complexity and importance
- Implement fallback strategies for API failures
- Monitor token usage and costs

### 2. Prompt Engineering
- Create clear, specific prompts with examples
- Use system prompts to define behavior boundaries
- Implement chain-of-thought prompting for complex reasoning

### 3. Error Handling
- Implement exponential backoff for API retries
- Provide graceful fallbacks for AI failures
- Display meaningful error messages to users

### 4. Performance Optimization
- Stream responses for better user experience
- Implement client-side caching for common queries
- Use background workers for long-running processes

### 5. Security Considerations
- Never expose API keys in client-side code
- Implement rate limiting and abuse prevention
- Validate and sanitize all user inputs
- Monitor for prompt injection attacks

### 6. Testing AI Components
- Create snapshot tests for AI UI components
- Mock API responses for deterministic testing
- Test error states and loading behavior
- Implement integration tests for AI workflows

## Resources for AI Development

### Documentation
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [LangChain.js Documentation](https://js.langchain.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)

### Tools
- [OpenRouter Dashboard](https://openrouter.ai/dashboard)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [LangSmith (LangChain Tracing)](https://smith.langchain.com/)
- [AI Prompt Playground](https://platform.openai.com/playground)
