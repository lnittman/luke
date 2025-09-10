import { Agent } from "@convex-dev/agent";
import { components, internal } from "../_generated/api";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { analyzeCommitDiffTool, analyzePullRequestTool, analyzeRepositoryContextTool, detectCodePatternsTool } from "./tools/codeReview";
import { fetchCommitDetailsTool, fetchRepoInfoTool, fetchUserActivityTool } from "./tools/github";
import { CODE_ANALYSIS_XML, REPO_CONTEXT_XML, ACTIVITY_SYNTHESIS_XML, PR_REVIEW_XML, TECHNICAL_DEBT_XML } from "./instructions";

// Use OpenRouter provider for AI SDK v5 compatibility
// Note: API key is read from OPENROUTER_API_KEY env var automatically

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

export async function makeCodeAnalysisAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/codeAnalysis");
  return new Agent(components.agent, {
    name: "Deep Code Analysis Agent",
    languageModel: openrouter("anthropic/claude-sonnet-4"),
    tools: { analyzeCommitDiffTool, detectCodePatternsTool, fetchCommitDetailsTool },
    instructions,
  });
}

export async function makeRepoContextAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/repoContext");
  return new Agent(components.agent, {
    name: "Repository Context Agent",
    languageModel: openrouter("anthropic/claude-sonnet-4"),
    tools: { analyzeRepositoryContextTool, fetchRepoInfoTool },
    instructions,
  });
}

export async function makeActivitySynthesisAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/activitySynthesis");
  return new Agent(components.agent, {
    name: "Activity Synthesis Agent",
    languageModel: openrouter("anthropic/claude-sonnet-4"),
    tools: { fetchUserActivityTool, analyzePullRequestTool },
    instructions,
  });
}

export async function makePrReviewAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/prReview");
  return new Agent(components.agent, {
    name: "Pull Request Review Agent",
    languageModel: openrouter("anthropic/claude-sonnet-4"),
    tools: { analyzePullRequestTool, analyzeCommitDiffTool, detectCodePatternsTool },
    instructions,
  });
}

export async function makeTechnicalDebtAgent(ctx: any) {
  const instructions = await loadRequired(ctx, "agents/technicalDebt");
  return new Agent(components.agent, {
    name: "Technical Debt Tracker",
    languageModel: openrouter("anthropic/claude-sonnet-4"),
    tools: { analyzeCommitDiffTool, detectCodePatternsTool },
    instructions,
  });
}

export async function makeCustomRulesAgent(ctx: any, rules: string[], focusAreas: string[]) {
  const base = `You are a specialized code analyst with custom rules and focus areas.\n\nRULES:\n${rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\nFOCUS AREAS:\n${focusAreas.map((a) => `- ${a}`).join("\n")}\n\nEnforce rules strictly and prioritize focus areas.`;
  // Allow override at key agents/codeAnalysis if desired
  const prefix = await loadRequired(ctx, "agents/codeAnalysis");
  const instructions = `${prefix}\n\n${base}`;
  return new Agent(components.agent, {
    name: "Custom Rules Agent",
    languageModel: openrouter("anthropic/claude-sonnet-4"),
    tools: { analyzeCommitDiffTool, detectCodePatternsTool },
    instructions,
  });
}
