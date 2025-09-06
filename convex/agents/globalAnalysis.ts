import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export function createGlobalAnalysisAgent(instructions: string, apiKey?: string) {
  // Use OpenRouter provider for AI SDK v5 compatibility
  const openrouter = createOpenRouter({
    apiKey: apiKey || process.env.OPENROUTER_API_KEY || "",
  });
  
  const model = openrouter("openai/gpt-5");
  
  return new Agent(components.agent, {
    name: "Global Analysis Agent",
    languageModel: model,
    instructions,
  });
}
