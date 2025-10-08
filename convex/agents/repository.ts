import { Agent } from "@convex-dev/agent";
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
  });
}

// Create a separate agent WITHOUT tools for JSON generation
export async function makeRepoSummarizerAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/repoAnalyzer");
  return new Agent(components.agent, {
    name: "Repository Summarizer",
    languageModel: openrouter("anthropic/claude-3.5-sonnet"),
    // NO TOOLS - this agent only synthesizes pre-analyzed data into JSON
    instructions,
  });
}
