import { Agent } from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { openai } from "@ai-sdk/openai";
import { fetchCommitDetailsTool, fetchRepoInfoTool, fetchUserActivityTool } from "./tools/github";
import { COMMIT_ANALYZER_XML, ACTIVITY_SUMMARIZER_XML, REPO_ANALYZER_XML } from "../components/agents/instructions";

async function load(ctx: any, key: string, fallback: string) {
  const i = internal as any;
  return (
    (await ctx.runQuery(i.functions.queries.settings.getByKey, { key })) ||
    fallback
  );
}

export async function makeCommitAnalyzerAgent(ctx: any) {
  const instructions = await load(ctx, "agents/commitAnalyzer", COMMIT_ANALYZER_XML);
  return new Agent(components.agent, {
    name: "Commit Analyzer",
    languageModel: openai("openai/gpt-5", {
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || "",
    }),
    tools: { fetchCommitDetailsTool },
    instructions,
  });
}

export async function makeActivitySummarizerAgent(ctx: any) {
  const instructions = await load(ctx, "agents/activitySummarizer", ACTIVITY_SUMMARIZER_XML);
  return new Agent(components.agent, {
    name: "Activity Summarizer",
    languageModel: openai("openai/gpt-5", {
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || "",
    }),
    tools: { fetchUserActivityTool, fetchRepoInfoTool },
    instructions,
  });
}

export async function makeRepoAnalyzerAgent(ctx: any) {
  const instructions = await load(ctx, "agents/repoAnalyzer", REPO_ANALYZER_XML);
  return new Agent(components.agent, {
    name: "Repository Analyzer",
    languageModel: openai("openai/gpt-5", {
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || "",
    }),
    tools: { fetchRepoInfoTool },
    instructions,
  });
}
