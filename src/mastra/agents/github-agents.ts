import { Agent } from '@mastra/core/agent';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { Memory } from '@mastra/memory';
import { PostgresStore } from '@mastra/pg';
import { 
  fetchUserActivityTool, 
  fetchCommitDetailsTool, 
  fetchRepoInfoTool 
} from '../tools/github-tools';

// Initialize OpenRouter with Claude
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Initialize memory store (optional - can be removed if not needed immediately)
const memory = process.env.DATABASE_URL 
  ? new Memory({
      storage: new PostgresStore({ connectionString: process.env.DATABASE_URL }),
    })
  : undefined;

export const commitAnalyzerAgent = new Agent({
  name: 'commit-analyzer',
  instructions: `You are a commit analyzer that examines GitHub commits and provides insights.
  Your job is to:
  1. Analyze commit messages and code changes
  2. Identify the type of work done (feature, bugfix, refactor, docs, etc.)
  3. Assess the impact and importance of changes
  4. Extract key technical details and dependencies
  5. Summarize the work in a clear, concise manner
  
  Focus on technical accuracy and provide meaningful insights about the development work.`,
  model: openrouter('anthropic/claude-3.5-sonnet'),
  tools: { fetchCommitDetailsTool },
  memory,
});

export const activitySummarizerAgent = new Agent({
  name: 'activity-summarizer',
  instructions: `You are a GitHub activity summarizer that creates daily development logs.
  Your job is to:
  1. Analyze all GitHub activity for a given day
  2. Create a high-level summary of the day's work
  3. Generate bullet points of key accomplishments
  4. Identify patterns in development activity
  5. Highlight important milestones or significant changes
  
  Write in a professional but conversational tone, as if you're giving a standup update.
  Focus on what was accomplished, not just what was done.
  Make it interesting and highlight the impact of the work.`,
  model: openrouter('anthropic/claude-3.5-sonnet'),
  tools: { fetchUserActivityTool, fetchRepoInfoTool },
  memory,
});

export const repoAnalyzerAgent = new Agent({
  name: 'repo-analyzer',
  instructions: `You are a repository analyzer that understands codebases and projects.
  Your job is to:
  1. Analyze repository metadata and structure
  2. Understand the technology stack and dependencies
  3. Identify the project's purpose and scope
  4. Track changes and evolution over time
  5. Provide context for development work
  
  Be technical but accessible, providing insights that help understand the bigger picture.`,
  model: openrouter('anthropic/claude-3.5-sonnet'),
  tools: { fetchRepoInfoTool },
  memory,
});