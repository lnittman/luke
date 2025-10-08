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
    languageModel: openrouter("anthropic/claude-3.5-sonnet"),
    tools: { fetchUserActivityTool, fetchRepoInfoTool, listPullRequestsTool, listIssuesTool },
    instructions,
  });
}

// Create a separate agent WITHOUT tools for pattern detection JSON generation
export async function makePatternDetectorAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/activitySummarizer");
  return new Agent(components.agent, {
    name: "Pattern Detector",
    languageModel: openrouter("anthropic/claude-3.5-sonnet"),
    // NO TOOLS - this agent only synthesizes pre-analyzed repo summaries into patterns
    instructions,
  });
}
