import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { analyzeCommitDiffTool, analyzePullRequestTool, analyzeRepositoryContextTool, detectCodePatternsTool } from "./tools/codeReview";
import { fetchCommitDetailsTool, fetchRepoInfoTool, fetchUserActivityTool } from "./tools/github";
import { CODE_ANALYSIS_XML, REPO_CONTEXT_XML, ACTIVITY_SYNTHESIS_XML, PR_REVIEW_XML, TECHNICAL_DEBT_XML } from "../components/agents/instructions";

const OR = openrouter;

export const codeAnalysisAgent = new Agent(components.agent, {
  name: "Deep Code Analysis Agent",
  languageModel: OR("openai/gpt-5") as any,
  tools: { analyzeCommitDiffTool, detectCodePatternsTool, fetchCommitDetailsTool },
  instructions: CODE_ANALYSIS_XML,
});

export const repoContextAgent = new Agent(components.agent, {
  name: "Repository Context Agent",
  languageModel: OR("openai/gpt-5") as any,
  tools: { analyzeRepositoryContextTool, fetchRepoInfoTool },
  instructions: REPO_CONTEXT_XML,
});

export const activitySynthesisAgent = new Agent(components.agent, {
  name: "Activity Synthesis Agent",
  languageModel: OR("openai/gpt-5") as any,
  tools: { fetchUserActivityTool, analyzePullRequestTool },
  instructions: ACTIVITY_SYNTHESIS_XML,
});

export const prReviewAgent = new Agent(components.agent, {
  name: "Pull Request Review Agent",
  languageModel: OR("openai/gpt-5") as any,
  tools: { analyzePullRequestTool, analyzeCommitDiffTool, detectCodePatternsTool },
  instructions: PR_REVIEW_XML,
});

export const technicalDebtAgent = new Agent(components.agent, {
  name: "Technical Debt Tracker",
  languageModel: OR("openai/gpt-5") as any,
  tools: { analyzeCommitDiffTool, detectCodePatternsTool },
  instructions: TECHNICAL_DEBT_XML,
});

export function createCustomRulesAgent(rules: string[], focusAreas: string[]) {
  const instructions = `You are a specialized code analyst with custom rules and focus areas.\n\nRULES:\n${rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\nFOCUS AREAS:\n${focusAreas.map((a) => `- ${a}`).join("\n")}\n\nEnforce rules strictly and prioritize focus areas.`;
  return new Agent(components.agent, {
    name: "Custom Rules Agent",
    languageModel: OR("openai/gpt-5") as any,
    tools: { analyzeCommitDiffTool, detectCodePatternsTool },
    instructions,
  });
}
