import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { fetchCommitDetailsTool, fetchRepoInfoTool, fetchUserActivityTool } from "./tools/github";
import { COMMIT_ANALYZER_XML, ACTIVITY_SUMMARIZER_XML, REPO_ANALYZER_XML } from "../components/agents/instructions";

const OR = openrouter;

export const commitAnalyzerAgent = new Agent(components.agent, {
  name: "Commit Analyzer",
  languageModel: OR("openai/gpt-5") as any,
  tools: { fetchCommitDetailsTool },
  instructions: COMMIT_ANALYZER_XML,
});

export const activitySummarizerAgent = new Agent(components.agent, {
  name: "Activity Summarizer",
  languageModel: OR("openai/gpt-5") as any,
  tools: { fetchUserActivityTool, fetchRepoInfoTool },
  instructions: ACTIVITY_SUMMARIZER_XML,
});

export const repoAnalyzerAgent = new Agent(components.agent, {
  name: "Repository Analyzer",
  languageModel: OR("openai/gpt-5") as any,
  tools: { fetchRepoInfoTool },
  instructions: REPO_ANALYZER_XML,
});
