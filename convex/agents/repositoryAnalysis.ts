import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { repoAnalysisSchema } from "../lib/analysisSchema";
import { REPOSITORY_ANALYSIS_XML } from "../components/agents/instructions";

export const repositoryAnalysisAgent = new Agent(components.agent, {
  name: "Repository Analysis Agent",
  languageModel: openrouter("openai/gpt-5") as any,
  instructions: REPOSITORY_ANALYSIS_XML,
});

// Example usage would be: thread.generateObject({ schema: repoAnalysisSchema, prompt: "..." })
