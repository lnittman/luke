import { Agent, stepCountIs } from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  fetchCommitDetailsTool, fetchRepoInfoTool,
  listPullRequestsTool, getPullRequestFilesTool
} from "./tools/github";

// Use OpenRouter provider for AI SDK v5 compatibility
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

async function loadRequired(ctx: any, key: string) {
  const i = internal as any;
  const val = await ctx.runQuery(i["app/settings/queries"].getByKey, { key });
  if (!val) {
    const msg = `Missing agent instructions for "${key}" in settings. Seed them or set via settings.setByKey.`;
    console.error(msg);
    throw new Error(msg);
  }
  return val as string;
}

export async function makeRepoAnalyzerAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/repoAnalyzer");
  return new Agent(components.agent, {
    name: "Repository Analyzer",
    languageModel: openrouter("anthropic/claude-3.5-sonnet"),
    // Give repo analyzer autonomy to inspect diffs, mirroring `gh` workflows
    tools: { fetchRepoInfoTool, fetchCommitDetailsTool, listPullRequestsTool, getPullRequestFilesTool },
    instructions,
    stopWhen: stepCountIs(15), // Allow up to 15 steps for multi-step tool calling
  });
}

// Create a separate agent WITHOUT tools for JSON generation
export async function makeRepoSummarizerAgent(ctx: any) {
  // Use simple inline instructions that explicitly state NO TOOLS
  const instructions = `You are a repository summarizer agent. Your ONLY task is to synthesize already-completed analysis into structured JSON format.

CRITICAL CONSTRAINTS:
- DO NOT call any tools or fetch additional data
- DO NOT use function_calls or invoke tags
- The analysis has already been completed
- Your job is ONLY to extract and structure the provided information into JSON

Process:
1. Read the provided batch analyses (narratives about completed work)
2. Extract key information: main focus, progress, technical highlights, concerns, next steps
3. Return ONLY valid JSON - no markdown code blocks, no preamble, no explanations

Output Format:
Return raw JSON matching this structure:
{
  "repository": "repo-name",
  "commitCount": number,
  "mainFocus": "one sentence summary",
  "progress": "what was accomplished",
  "technicalHighlights": ["highlight 1", "highlight 2"],
  "concerns": ["concern 1"],
  "nextSteps": ["next step 1"]
}`;

  return new Agent(components.agent, {
    name: "Repository Summarizer",
    languageModel: openrouter("anthropic/claude-3.5-sonnet"),
    // NO TOOLS - this agent only synthesizes pre-analyzed data into JSON
    instructions,
  });
}
