import { Agent } from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { openai } from "@ai-sdk/openai";
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
  const model = openai("openai/gpt-5", {
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
  });
  return new Agent(components.agent, {
    name: "Repository Analysis Agent",
    languageModel: model,
    instructions,
  });
}
