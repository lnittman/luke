import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export function createGlobalAnalysisAgent(instructions: string, apiKey?: string) {
  // Use OpenRouter provider for AI SDK v5 compatibility
  const openrouter = createOpenRouter({
    apiKey: apiKey || process.env.OPENROUTER_API_KEY || "",
  });

  // Use Claude Sonnet 3.5 for reliable tool calling and structured output
  const model = openrouter("anthropic/claude-3.5-sonnet");

  return new Agent(components.agent, {
    name: "Global Analysis Agent",
    languageModel: model,
    instructions,
  });
}
