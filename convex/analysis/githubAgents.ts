import { Agent } from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { 
  fetchCommitDetailsTool, fetchRepoInfoTool, fetchUserActivityTool,
  listPullRequestsTool, getPullRequestFilesTool,
  listIssuesTool
} from "./tools/github";
import { COMMIT_ANALYZER_XML, ACTIVITY_SUMMARIZER_XML, REPO_ANALYZER_XML } from "../components/agents/instructions";

// Use OpenRouter provider for AI SDK v5 compatibility
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

async function loadRequired(ctx: any, key: string) {
  const i = internal as any;
  const val = await ctx.runQuery(i.settings.queries.getByKey, { key });
  if (!val) {
    const msg = `Missing agent instructions for "${key}" in settings. Seed them or set via settings.setByKey.`;
    console.error(msg);
    throw new Error(msg);
  }
  return val as string;
}

export async function makeCommitAnalyzerAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/commitAnalyzer");
  return new Agent(components.agent, {
    name: "Commit Analyzer",
    languageModel: openrouter("anthropic/claude-sonnet-4"),
    tools: { fetchCommitDetailsTool, getPullRequestFilesTool },
    instructions,
  });
}

export async function makeActivitySummarizerAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/activitySummarizer");
  return new Agent(components.agent, {
    name: "Activity Summarizer",
    languageModel: openrouter("anthropic/claude-sonnet-4"),
    tools: { fetchUserActivityTool, fetchRepoInfoTool, listPullRequestsTool, listIssuesTool },
    instructions,
  });
}

export async function makeRepoAnalyzerAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/repoAnalyzer");
  return new Agent(components.agent, {
    name: "Repository Analyzer",
    languageModel: openrouter("anthropic/claude-sonnet-4"),
    // Give repo analyzer autonomy to inspect diffs, mirroring `gh` workflows
    tools: { fetchRepoInfoTool, fetchCommitDetailsTool, listPullRequestsTool, getPullRequestFilesTool },
    instructions,
  });
}
