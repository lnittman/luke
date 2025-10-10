import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export function createGlobalAnalysisAgent(instructions: string, apiKey?: string) {
  // Use OpenRouter provider for AI SDK v5 compatibility
  const openrouter = createOpenRouter({
    apiKey: apiKey || process.env.OPENROUTER_API_KEY || "",
  });

  // Use GPT-5 for global synthesis
  const model = openrouter("openai/gpt-5");

  // Override instructions to explicitly prevent tool calling
  const noToolInstructions = `${instructions}

CRITICAL: DO NOT call any tools. DO NOT use function_calls or invoke tags. All data has already been collected. Your job is ONLY to synthesize the provided information into JSON format.`;

  return new Agent(components.agent, {
    name: "Global Analysis Agent",
    languageModel: model,
    instructions: noToolInstructions,
  });
}
