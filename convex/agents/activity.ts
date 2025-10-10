import { Agent } from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  fetchUserActivityTool, fetchRepoInfoTool,
  listPullRequestsTool, listIssuesTool
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

export async function makeActivitySummarizerAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/activitySummarizer");
  return new Agent(components.agent, {
    name: "Activity Summarizer",
    languageModel: openrouter("openai/gpt-5"),
    tools: { fetchUserActivityTool, fetchRepoInfoTool, listPullRequestsTool, listIssuesTool },
    instructions,
  });
}

// Create a separate agent WITHOUT tools for pattern detection JSON generation
export async function makePatternDetectorAgent(ctx: any) {
  // Use simple inline instructions that explicitly state NO TOOLS
  const instructions = `You are a pattern detection agent. Your ONLY task is to analyze pre-completed repository summaries and identify cross-repository patterns.

CRITICAL CONSTRAINTS:
- DO NOT call any tools or fetch additional data
- DO NOT use function_calls or invoke tags
- The repository analyses have already been completed
- Your job is ONLY to extract patterns and structure them into JSON

Process:
1. Read the provided repository summaries
2. Identify cross-cutting patterns, themes, and trends
3. Return ONLY valid JSON - no markdown code blocks, no preamble, no explanations

Output Format:
Return raw JSON matching this structure:
{
  "patterns": ["pattern 1", "pattern 2"],
  "themes": ["theme 1"],
  "stackTrends": ["trend 1"],
  "methodologyInsights": ["insight 1"],
  "balanceAssessment": "brief distribution description"
}`;

  return new Agent(components.agent, {
    name: "Pattern Detector",
    languageModel: openrouter("openai/gpt-5"),
    // NO TOOLS - this agent only synthesizes pre-analyzed repo summaries into patterns
    instructions,
  });
}
