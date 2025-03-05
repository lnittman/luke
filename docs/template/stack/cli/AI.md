# AI Integration Guide for CLI Applications

This document provides comprehensive guidance for integrating AI capabilities into command-line applications, creating powerful AI-augmented CLI tools.

## AI Architecture for CLI Applications

CLI applications have unique requirements for AI integration, focusing on efficient text processing, structured outputs, and background processing:

```
┌─────────────────────────────────────────────────────┐
│ CLI Interface Layer (Command parsing, Output)        │
├─────────────────────────────────────────────────────┤
│ Agent/Tool Layer (Commands, Tools, Actions)          │
├─────────────────────────────────────────────────────┤
│ Core Service Layer (API clients, Business logic)     │
├─────────────────────────────────────────────────────┤
│ Model Provider Layer (OpenRouter, Local models)      │
└─────────────────────────────────────────────────────┘
```

## LLM Model Strategy for CLI Tools

### Tiered Model Approach

1. **Tier 1: High-Quality Reasoning** (Used sparingly for complex tasks)
   - Claude 3.7 Sonnet (via OpenRouter)
   - Claude 3.7 Sonnet:thinking (for planning, reasoning tasks)
   - GPT-4o (via OpenRouter)
   
2. **Tier 2: Utility & General Tasks** (Everyday operations)
   - Gemini 2 Flash (optimal price/performance)
   - Claude 3 Haiku (via OpenRouter)
   - Mistral Large (via OpenRouter)
   
3. **Tier 3: Local Models** (Offline use, privacy-sensitive data)
   - Llama 3 8B (for general tasks)
   - Phi-3 Mini (for code assistance)
   - Mistral 7B (for text processing)

### Model Selection Strategy

```go
// Model selection strategy in Go
type TaskType string
const (
    TaskTypeCommand   TaskType = "command"
    TaskTypeSearch    TaskType = "search"
    TaskTypeReasoning TaskType = "reasoning"
    TaskTypeCode      TaskType = "code"
)

type ImportanceLevel string
const (
    ImportanceCritical   ImportanceLevel = "critical"
    ImportanceStandard   ImportanceLevel = "standard"
    ImportanceBackground ImportanceLevel = "background"
)

func SelectModel(task TaskType, importance ImportanceLevel, offlineMode bool) string {
    // Offline mode: use local models regardless of task
    if offlineMode {
        switch task {
        case TaskTypeCode:
            return "phi-3-mini"
        case TaskTypeReasoning:
            return "llama-3-70b-q4"
        default:
            return "mistral-7b"
        }
    }
    
    // Online mode: select based on task importance
    if importance == ImportanceCritical {
        if task == TaskTypeReasoning {
            return "anthropic/claude-3-7-sonnet:thinking" 
        }
        return "anthropic/claude-3-7-sonnet"
    }
    
    if task == TaskTypeSearch {
        return "perplexity/sonar-reasoning"
    }
    
    // Default utility model for most tasks
    return "gemini-2-flash"
}
```

## Setting Up AI in CLI Applications

### Go Implementation

```go
// ai/client.go
package ai

import (
	"context"
    "encoding/json"
    "fmt"
    "os"
    "strings"
    
    "github.com/openrouterai/openrouter-go"
)

type Client struct {
    OpenRouter *openrouter.Client
    Config     Config
}

type Config struct {
    OpenRouterAPIKey string
    DefaultModel     string
    OfflineMode      bool
}

func NewClient() (*Client, error) {
    config := Config{
        OpenRouterAPIKey: os.Getenv("OPENROUTER_API_KEY"),
        DefaultModel:     os.Getenv("DEFAULT_MODEL"),
        OfflineMode:      os.Getenv("OFFLINE_MODE") == "true",
    }
    
    if config.DefaultModel == "" {
        config.DefaultModel = "gemini-2-flash"
    }
    
    var orClient *openrouter.Client
    if !config.OfflineMode && config.OpenRouterAPIKey != "" {
        orClient = openrouter.NewClient(config.OpenRouterAPIKey)
    }
    
    return &Client{
        OpenRouter: orClient,
        Config:     config,
    }, nil
}

func (c *Client) Complete(ctx context.Context, prompt string, model string) (string, error) {
    if c.Config.OfflineMode || c.OpenRouter == nil {
        return c.completeOffline(prompt, model)
    }
    
    resp, err := c.OpenRouter.CreateChatCompletion(
        ctx,
        openrouter.ChatCompletionRequest{
            Model: model,
            Messages: []openrouter.ChatCompletionMessage{
                {
                    Role:    "user",
                    Content: prompt,
                },
            },
            Temperature: 0.7,
        },
    )
    
    if err != nil {
        return "", fmt.Errorf("openrouter completion error: %w", err)
    }
    
    return resp.Choices[0].Message.Content, nil
}

func (c *Client) completeOffline(prompt string, model string) (string, error) {
    // Implementation to call local models through llama.cpp API or similar
    // Placeholder for actual implementation
    return "Response from local model (offline mode)", nil
}
```

### Node.js Implementation

```typescript
// src/lib/ai-client.ts
import { OpenRouter } from 'openrouter-sdk';
import { LocalAI } from 'localai-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

interface AIClientConfig {
  openRouterKey?: string;
  defaultModel?: string;
  offlineMode?: boolean;
}

export class AIClient {
  private openRouter: OpenRouter | null = null;
  private localAI: LocalAI | null = null;
  private config: AIClientConfig;
  
  constructor(config: AIClientConfig = {}) {
    this.config = {
      openRouterKey: process.env.OPENROUTER_API_KEY,
      defaultModel: process.env.DEFAULT_MODEL || 'gemini-2-flash',
      offlineMode: process.env.OFFLINE_MODE === 'true',
      ...config
    };
    
    if (!this.config.offlineMode && this.config.openRouterKey) {
      this.openRouter = new OpenRouter({ 
        apiKey: this.config.openRouterKey 
      });
    }
    
    // Setup local AI if in offline mode
    if (this.config.offlineMode) {
      this.localAI = new LocalAI({
        apiUrl: process.env.LOCAL_AI_URL || 'http://localhost:8080'
      });
    }
  }
  
  async complete(prompt: string, model?: string): Promise<string> {
    const selectedModel = model || this.config.defaultModel;
    
    if (this.config.offlineMode || !this.openRouter) {
      return this.completeOffline(prompt, selectedModel);
    }
    
    try {
      const response = await this.openRouter.chat.completions.create({
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });
      
      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('OpenRouter completion error:', error);
      throw error;
    }
  }
  
  private async completeOffline(prompt: string, model?: string): Promise<string> {
    // Placeholder for local AI implementation
    if (!this.localAI) {
      return "Local AI not configured";
    }
    
    try {
      const response = await this.localAI.complete(prompt, {
        model: model || 'mistral-7b',
        temperature: 0.7
      });
      
      return response.text;
    } catch (error) {
      console.error('Local AI completion error:', error);
      throw error;
    }
  }
}
```

## Building CLI Agents with LLMs

### Agent System Architecture

Agents in a CLI context function as intelligent command enhancers that can:
1. Parse and understand natural language commands
2. Select appropriate tools and actions
3. Execute those actions and process results
4. Generate structured outputs for the terminal

```go
// agents/agent.go
package agents

import (
	"context"
    "encoding/json"
    "fmt"
    
    "myapp/ai"
    "myapp/tools"
)

type Tool interface {
    Name() string
    Description() string
    Parameters() map[string]interface{}
    Execute(ctx context.Context, params map[string]interface{}) (interface{}, error)
}

type Agent struct {
    AIClient   *ai.Client
    Tools      []Tool
    ModelID    string
    SystemPrompt string
}

func NewAgent(aiClient *ai.Client, modelID string) *Agent {
    return &Agent{
        AIClient:   aiClient,
        ModelID:    modelID,
        SystemPrompt: "You are a helpful CLI assistant that helps the user by using available tools.",
    }
}

func (a *Agent) RegisterTool(tool Tool) {
    a.Tools = append(a.Tools, tool)
}

func (a *Agent) Process(ctx context.Context, input string) (string, error) {
    // 1. Planning phase - determine the user's intent and required tools
    planningPrompt := fmt.Sprintf(`%s
    
Available tools:
%s

User input: %s

First, determine what the user wants. Then select the appropriate tool to use.
Return your response in JSON format:
{
  "thought": "your reasoning",
  "tool": "toolName",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  }
}`, a.SystemPrompt, a.formatTools(), input)

    // Use the reasoning model for planning
    planningModel := ai.SelectModel(ai.TaskTypeReasoning, ai.ImportanceStandard, a.AIClient.Config.OfflineMode)
    planningResponse, err := a.AIClient.Complete(ctx, planningPrompt, planningModel)
    if err != nil {
        return "", fmt.Errorf("planning error: %w", err)
    }
    
    // Parse the planning response
    var plan struct {
        Thought    string                 `json:"thought"`
        Tool       string                 `json:"tool"`
        Parameters map[string]interface{} `json:"parameters"`
    }
    
    if err := json.Unmarshal([]byte(planningResponse), &plan); err != nil {
        return "", fmt.Errorf("error parsing planning response: %w", err)
    }
    
    // 2. Execution phase - run the selected tool
    var toolResult interface{}
    var toolErr error
    
    for _, tool := range a.Tools {
        if tool.Name() == plan.Tool {
            toolResult, toolErr = tool.Execute(ctx, plan.Parameters)
            if toolErr != nil {
                return "", fmt.Errorf("tool execution error: %w", toolErr)
            }
            break
        }
    }
    
    // 3. Response phase - generate a response based on the tool result
    responsePrompt := fmt.Sprintf(`%s

User input: %s

You used the %s tool with these parameters:
%v

The tool returned this result:
%v

Generate a helpful response for the user based on this result.
`, a.SystemPrompt, input, plan.Tool, plan.Parameters, toolResult)

    // Use the standard model for response generation
    responseModel := ai.SelectModel(ai.TaskTypeCommand, ai.ImportanceStandard, a.AIClient.Config.OfflineMode)
    return a.AIClient.Complete(ctx, responsePrompt, responseModel)
}

func (a *Agent) formatTools() string {
    var result string
    for _, tool := range a.Tools {
        result += fmt.Sprintf("- %s: %s\n  Parameters: %v\n\n", 
            tool.Name(), tool.Description(), tool.Parameters())
    }
    return result
}
```

### Tool Implementations

```go
// tools/search_tool.go
package tools

import (
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "net/url"
)

type SearchTool struct {
    APIKey string
}

func NewSearchTool(apiKey string) *SearchTool {
    return &SearchTool{
        APIKey: apiKey,
    }
}

func (t *SearchTool) Name() string {
    return "search"
}

func (t *SearchTool) Description() string {
    return "Search the web for information on a given query"
}

func (t *SearchTool) Parameters() map[string]interface{} {
    return map[string]interface{}{
        "query": "The search query string",
    }
}

func (t *SearchTool) Execute(ctx context.Context, params map[string]interface{}) (interface{}, error) {
    query, ok := params["query"].(string)
    if !ok {
        return nil, fmt.Errorf("missing or invalid query parameter")
    }
    
    // Implement actual search API call
    searchURL := fmt.Sprintf("https://api.search.com/v1/search?q=%s&api_key=%s",
        url.QueryEscape(query), t.APIKey)
    
    req, err := http.NewRequestWithContext(ctx, "GET", searchURL, nil)
	if err != nil {
        return nil, err
    }
    
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, err
    }
    
    return result, nil
}
```

## CLI-Specific AI Features

### 1. Smart Command Completion

```typescript
// src/commands/completion.ts
import { AIClient } from '../lib/ai-client';
import { readHistory } from '../lib/shell-history';

export async function enhanceCompletion(input: string): Promise<string[]> {
  // Get shell history for context
  const history = await readHistory(10); // Get last 10 commands
  
  const aiClient = new AIClient();
  
  const prompt = `
Based on the following command history and the current partial command,
suggest 3 likely completions for what the user might want to execute next.
Return only the commands as a JSON array of strings.

Command history:
${history.join('\n')}

Current partial command: ${input}
`;

  try {
    const result = await aiClient.complete(prompt, 'gemini-2-flash');
    const suggestions = JSON.parse(result) as string[];
    return suggestions.slice(0, 3); // Ensure we have at most 3 suggestions
  } catch (error) {
    console.error('Error generating completion suggestions:', error);
    return [];
  }
}
```

### 2. Natural Language to Command Translation

```go
// nl2cmd/translator.go
package nl2cmd

import (
    "context"
	"fmt"
    
    "myapp/ai"
)

// TranslateToCommand converts natural language to shell commands
func TranslateToCommand(ctx context.Context, aiClient *ai.Client, input string, shell string) (string, error) {
    prompt := fmt.Sprintf(`Convert the following natural language request into a valid %s shell command:
    
Input: %s

Return ONLY the command with no other text, explanation, markdown formatting, or preamble.
`, shell, input)

    // Use Gemini 2 Flash for quick command translation
    return aiClient.Complete(ctx, prompt, "gemini-2-flash")
}
```

### 3. Interactive CLI Wizards

```typescript
// src/wizards/project-generator.ts
import inquirer from 'inquirer';
import { AIClient } from '../lib/ai-client';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function projectGenerator(): Promise<void> {
  // Gather user requirements through interactive prompts
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
    },
    {
      type: 'input', 
      name: 'description',
      message: 'Briefly describe your project:',
    },
    {
      type: 'list',
      name: 'language',
      message: 'Select the primary language:',
      choices: ['JavaScript/TypeScript', 'Python', 'Go', 'Rust', 'Other'],
    },
    {
      type: 'input',
      name: 'features',
      message: 'What features do you need? (comma-separated list)',
    }
  ]);
  
  console.log('Generating project structure...');
  
  const aiClient = new AIClient();
  
  // Generate project structure
  const structurePrompt = `
Create a CLI project structure for the following requirements:
- Project name: ${answers.projectName}
- Description: ${answers.description}
- Language: ${answers.language}
- Features: ${answers.features}

Return a JSON object with the following structure:
{
  "directories": [
    { "path": "relative/path/to/directory", "description": "what this directory is for" }
  ],
  "files": [
    { 
      "path": "relative/path/to/file", 
      "description": "what this file is for",
      "content": "sample content or template for the file"
    }
  ]
}
`;

  try {
    // Use Claude 3.5 Sonnet for structured output
    const structureJson = await aiClient.complete(structurePrompt, "anthropic/claude-3-5-sonnet");
    const structure = JSON.parse(structureJson);
    
    // Create project directory
    await fs.mkdir(answers.projectName, { recursive: true });
    
    // Create directories
    for (const dir of structure.directories) {
      await fs.mkdir(path.join(answers.projectName, dir.path), { recursive: true });
      console.log(`Created directory: ${dir.path}`);
    }
    
    // Create files
    for (const file of structure.files) {
      await fs.writeFile(path.join(answers.projectName, file.path), file.content);
      console.log(`Created file: ${file.path}`);
    }
    
    console.log(`\nProject ${answers.projectName} successfully created!`);
  } catch (error) {
    console.error('Error generating project:', error);
  }
}
```

## Best Practices for CLI AI Integration

### 1. Model Usage Optimization
- Use smaller, faster models for interactive commands
- Reserve larger models for complex reasoning tasks
- Implement local model fallbacks for offline use
- Cache common responses to reduce API usage

### 2. CLI UX Considerations
- Display thinking/generating indicators for longer operations
- Provide verbose output options for transparency
- Allow interruption of long-running AI tasks
- Format AI output to match terminal conventions

### 3. Processing Efficiency
- Use streaming responses for long outputs
- Implement timeout handling for API requests
- Process results incrementally where possible
- Support background processing for long tasks

### 4. Security & Privacy
- Never send sensitive local data to remote APIs
- Implement local models for processing private data
- Sanitize command inputs and outputs
- Use keyring/credential storage for API keys

### 5. Error Handling
- Provide graceful fallbacks for API failures
- Implement exponential backoff for retries
- Display helpful error messages
- Log errors for troubleshooting

## Resources for CLI AI Development

### Documentation
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Ollama Local Models](https://ollama.com/library)
- [LangChain CLI Guide](https://js.langchain.com/docs/integrations/tools/cli)
- [Bubbletea TUI Framework](https://github.com/charmbracelet/bubbletea)

### Tools
- [OpenRouter Go SDK](https://github.com/openrouterai/openrouter-go)
- [LLaMA.cpp](https://github.com/ggerganov/llama.cpp)
- [LocalAI](https://github.com/go-skynet/LocalAI)
- [GPT4All](https://github.com/nomic-ai/gpt4all) 