import { Agent } from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { REPOSITORY_ANALYSIS_XML, REPO_ANALYZER_XML } from "../components/agents/instructions";

async function load(ctx: any, key: string, fallback: string) {
  const i = internal as any;
  return (
    (await ctx.runQuery(i.functions.queries.settings.getByKey, { key })) ||
    fallback
  );
}

export async function makeRepositoryAnalysisAgent(ctx: any) {
  // Use repoAnalyzer key as the canonical storage, fall back to repositoryAnalysis XML
  const instructions = await load(ctx, "agents/repoAnalyzer", REPO_ANALYZER_XML || REPOSITORY_ANALYSIS_XML);
  return new Agent(components.agent, {
    name: "Repository Analysis Agent",
    languageModel: openrouter("openai/gpt-5") as any,
    instructions,
  });
}
