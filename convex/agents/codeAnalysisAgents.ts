import { Agent } from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { analyzeCommitDiffTool, analyzePullRequestTool, analyzeRepositoryContextTool, detectCodePatternsTool } from "./tools/codeReview";
import { fetchCommitDetailsTool, fetchRepoInfoTool, fetchUserActivityTool } from "./tools/github";
import { CODE_ANALYSIS_XML, REPO_CONTEXT_XML, ACTIVITY_SYNTHESIS_XML, PR_REVIEW_XML, TECHNICAL_DEBT_XML } from "../components/agents/instructions";

const OR = openrouter;

async function load(ctx: any, key: string, fallback: string) {
  const i = internal as any;
  return (
    (await ctx.runQuery(i.functions.queries.settings.getByKey, { key })) ||
    fallback
  );
}

export async function makeCodeAnalysisAgent(ctx: any) {
  const instructions = await load(ctx, "agents/codeAnalysis", CODE_ANALYSIS_XML);
  return new Agent(components.agent, {
    name: "Deep Code Analysis Agent",
    languageModel: OR("openai/gpt-5") as any,
    tools: { analyzeCommitDiffTool, detectCodePatternsTool, fetchCommitDetailsTool },
    instructions,
  });
}

export async function makeRepoContextAgent(ctx: any) {
  const instructions = await load(ctx, "agents/repoContext", REPO_CONTEXT_XML);
  return new Agent(components.agent, {
    name: "Repository Context Agent",
    languageModel: OR("openai/gpt-5") as any,
    tools: { analyzeRepositoryContextTool, fetchRepoInfoTool },
    instructions,
  });
}

export async function makeActivitySynthesisAgent(ctx: any) {
  const instructions = await load(ctx, "agents/activitySynthesis", ACTIVITY_SYNTHESIS_XML);
  return new Agent(components.agent, {
    name: "Activity Synthesis Agent",
    languageModel: OR("openai/gpt-5") as any,
    tools: { fetchUserActivityTool, analyzePullRequestTool },
    instructions,
  });
}

export async function makePrReviewAgent(ctx: any) {
  const instructions = await load(ctx, "agents/prReview", PR_REVIEW_XML);
  return new Agent(components.agent, {
    name: "Pull Request Review Agent",
    languageModel: OR("openai/gpt-5") as any,
    tools: { analyzePullRequestTool, analyzeCommitDiffTool, detectCodePatternsTool },
    instructions,
  });
}

export async function makeTechnicalDebtAgent(ctx: any) {
  const instructions = await load(ctx, "agents/technicalDebt", TECHNICAL_DEBT_XML);
  return new Agent(components.agent, {
    name: "Technical Debt Tracker",
    languageModel: OR("openai/gpt-5") as any,
    tools: { analyzeCommitDiffTool, detectCodePatternsTool },
    instructions,
  });
}

export async function makeCustomRulesAgent(ctx: any, rules: string[], focusAreas: string[]) {
  const base = `You are a specialized code analyst with custom rules and focus areas.\n\nRULES:\n${rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\nFOCUS AREAS:\n${focusAreas.map((a) => `- ${a}`).join("\n")}\n\nEnforce rules strictly and prioritize focus areas.`;
  // Allow override at key agents/codeAnalysis if desired
  const prefix = await load(ctx, "agents/codeAnalysis", CODE_ANALYSIS_XML);
  const instructions = `${prefix}\n\n${base}`;
  return new Agent(components.agent, {
    name: "Custom Rules Agent",
    languageModel: OR("openai/gpt-5") as any,
    tools: { analyzeCommitDiffTool, detectCodePatternsTool },
    instructions,
  });
}
