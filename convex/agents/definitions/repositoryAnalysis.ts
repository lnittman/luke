import { Agent } from "@convex-dev/agent";
import { components, internal } from "../../_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { REPOSITORY_ANALYSIS_XML, REPO_ANALYZER_XML } from "../instructions";

// Use OpenRouter provider for AI SDK v5 compatibility
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

async function loadRequired(ctx: any, key: string) {
  const i = internal as any;
  const val = await ctx.runQuery(i.settings.queries.getByKey, { key });
  if (!val) {
    const msg = `Missing agent instructions for "${key}". Please set settings or run seedAgentInstructions.`;
    console.error(msg);
    throw new Error(msg);
  }
  return val as string;
}

export async function makeRepositoryAnalysisAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/repoAnalyzer");
  const model = openrouter("anthropic/claude-sonnet-4");
  return new Agent(components.agent, {
    name: "Repository Analysis Agent",
    languageModel: model,
    instructions,
  });
}
